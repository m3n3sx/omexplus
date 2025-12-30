import { GoogleGenAI, Type } from "@google/genai";
import { Machine } from "../types";

// Delay helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Retry with exponential backoff
const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 5000
): Promise<T | null> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (e: any) {
      if (e.message?.includes('429') || e.message?.includes('RESOURCE_EXHAUSTED')) {
        const waitTime = baseDelay * Math.pow(2, i);
        console.log(`Rate limited, waiting ${waitTime}ms before retry ${i + 1}/${maxRetries}`);
        await delay(waitTime);
      } else {
        throw e;
      }
    }
  }
  return null;
};

const getPartsSchema = () => ({
  type: Type.OBJECT,
  properties: {
    parts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          nameEn: { type: Type.STRING },
          oemNumber: { type: Type.STRING },
          category: { type: Type.STRING },
          manufacturer: { type: Type.STRING },
          description: { type: Type.STRING },
          alternatives: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                manufacturer: { type: Type.STRING },
                partNumber: { type: Type.STRING },
                type: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  }
});

const getSpecsSchema = () => ({
  type: Type.OBJECT,
  properties: {
    ratingPlate: {
      type: Type.OBJECT,
      properties: {
        operatingweightkg: { type: Type.STRING },
        enginepowerkw: { type: Type.STRING },
        engine_model: { type: Type.STRING },
        enginedisplacementcc: { type: Type.STRING },
        emission_standard: { type: Type.STRING },
        hydraulicpressurebar: { type: Type.STRING },
        fueltankcapacity_l: { type: Type.STRING },
        hydraulictankcapacity_l: { type: Type.STRING },
        coolantcapacityl: { type: Type.STRING },
        engineoilcapacity_l: { type: Type.STRING },
        adblue_capacity_l: { type: Type.STRING },
      }
    },
    mechanicalSpecs: {
      type: Type.OBJECT,
      properties: {
        max_torque_nm: { type: Type.STRING },
        hydraulic_pump_type: { type: Type.STRING },
        hydraulic_flow_max_lmin: { type: Type.STRING },
        system_voltage_v: { type: Type.STRING },
        battery_capacity_ah: { type: Type.STRING },
        travel_speed_kmh: { type: Type.STRING },
        swing_speed_rpm: { type: Type.STRING },
        breakout_force_kn: { type: Type.STRING },
      }
    },
    dimensions: {
      type: Type.OBJECT,
      properties: {
        transport_length_mm: { type: Type.STRING },
        transport_width_mm: { type: Type.STRING },
        transport_height_mm: { type: Type.STRING },
        digging_depth_mm: { type: Type.STRING },
        digging_reach_mm: { type: Type.STRING },
        dump_height_mm: { type: Type.STRING },
      }
    },
    soundSpecs: {
      type: Type.OBJECT,
      properties: {
        noise_level_external_lwa_db: { type: Type.STRING },
        noise_level_cabin_lpa_db: { type: Type.STRING },
      }
    },
    commonIssues: { type: Type.ARRAY, items: { type: Type.STRING } },
    technicalDocs: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          type: { type: Type.STRING },
          publicationNumber: { type: Type.STRING },
          description: { type: Type.STRING }
        }
      }
    }
  }
});

// Check if string looks like a valid part number
const isValidPartNumber = (str: string): boolean => {
  if (!str || str.length > 40) return false;
  if (str.split(' ').length > 3) return false;
  const badWords = ['real oem', 'search did not', 'check', 'needed', 'catalog', 'example', 'contact', 'verify', 'consult', 'refer'];
  const lower = str.toLowerCase();
  return !badWords.some(w => lower.includes(w));
};

// Validate and clean part data
const cleanPart = (part: any): any | null => {
  if (!part.name) return null;
  
  let oemNumber = part.oemNumber || '';
  if (!isValidPartNumber(oemNumber)) {
    oemNumber = '000';
  } else {
    oemNumber = oemNumber.trim().substring(0, 30);
  }
  
  return {
    ...part,
    name: (part.name || '').substring(0, 100),
    nameEn: (part.nameEn || '').substring(0, 100),
    oemNumber: oemNumber,
    category: part.category || 'Inne',
    manufacturer: (part.manufacturer || '').substring(0, 50),
    description: (part.description || '').substring(0, 150),
    alternatives: (part.alternatives || []).filter((alt: any) => 
      alt.partNumber && isValidPartNumber(alt.partNumber)
    ).map((alt: any) => ({
      manufacturer: (alt.manufacturer || '').substring(0, 30),
      partNumber: alt.partNumber.trim().substring(0, 30),
      type: alt.type || 'aftermarket'
    }))
  };
};

export const enrichMachineData = async (
  machine: Machine,
  onProgress?: (stage: string, progress: number) => void
): Promise<{
  ratingPlate: any,
  mechanicalSpecs: any,
  dimensions: any,
  soundSpecs: any,
  commonIssues: string[],
  technicalDocs: any[],
  newParts: any[],
  groundingMetadata?: any
} | null> => {
  if (!process.env.API_KEY) {
    throw new Error("Brak klucza API. Sprawdz GEMINI_API_KEY w .env.local");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const machineInfo = `${machine.basicInfo.manufacturer} ${machine.basicInfo.model_code}`;
  const engineInfo = machine.ratingPlate.engine_model || machine.basicInfo.engine_model || '';

  let result: any = {
    ratingPlate: {},
    mechanicalSpecs: {},
    dimensions: {},
    soundSpecs: {},
    commonIssues: [],
    technicalDocs: [],
    newParts: [],
    groundingMetadata: null
  };

  // STAGE 1: Technical Specifications
  onProgress?.("Etap 1/2: Specyfikacje techniczne...", 20);
  
  const specsResult = await retryWithBackoff(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Search for technical specifications of ${machineInfo} construction machine.
Find: operating weight kg, engine power kW, engine model, displacement cc, emission standard, hydraulic pressure bar, fuel tank L, hydraulic tank L, coolant L, engine oil L, AdBlue L, dimensions mm, common issues, service manuals.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: getSpecsSchema(),
        maxOutputTokens: 4096
      },
    });
    return response;
  });

  if (specsResult?.text) {
    try {
      const specs = JSON.parse(specsResult.text);
      result.ratingPlate = specs.ratingPlate || {};
      result.mechanicalSpecs = specs.mechanicalSpecs || {};
      result.dimensions = specs.dimensions || {};
      result.soundSpecs = specs.soundSpecs || {};
      result.commonIssues = specs.commonIssues || [];
      result.technicalDocs = specs.technicalDocs || [];
      result.groundingMetadata = specsResult.candidates?.[0]?.groundingMetadata;
      console.log("Specs loaded:", result.ratingPlate);
    } catch (e) {
      console.error("JSON parse error:", e);
    }
  }

  // Wait before next request
  await delay(3000);

  // STAGE 2: All Parts in one request (to reduce API calls)
  onProgress?.("Etap 2/2: Czesci zamienne...", 60);
  
  const partsResult = await retryWithBackoff(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Search for "${machineInfo} parts catalog" and find spare parts with OEM numbers.

IMPORTANT: Return ONLY real part numbers like "32/925694" or "P550588". NO descriptions in oemNumber field!

Find parts for ${machineInfo} ${engineInfo}:

FILTERS (category: Filtry):
- Oil filter, Fuel filter, Air filter outer/inner, Hydraulic filter, Cabin filter

ENGINE (category: Silnik):
- Water pump, Thermostat, Turbocharger, Injector, Drive belt

ELECTRICAL (category: Elektryka):
- Starter, Alternator, Sensors

HYDRAULICS (category: Hydraulika):
- Main pump, Seal kits

UNDERCARRIAGE (category: Podwozie):
- Track roller, Sprocket, Idler

WEAR PARTS (category: Czesci zuzyciowe):
- Bucket teeth, Cutting edge`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: getPartsSchema(),
        maxOutputTokens: 8192
      },
    });
    return response;
  });

  if (partsResult?.text) {
    try {
      const data = JSON.parse(partsResult.text);
      if (data.parts) {
        const cleanedParts = data.parts.map(cleanPart).filter(Boolean);
        result.newParts.push(...cleanedParts);
      }
    } catch (e) {
      console.error("Parts JSON parse error:", e);
    }
  }

  onProgress?.("Zakonczono!", 100);

  // Deduplicate parts
  const uniqueParts = result.newParts.reduce((acc: any[], part: any) => {
    if (part && part.oemNumber && !acc.find(p => p.oemNumber === part.oemNumber)) {
      acc.push({ ...part, id: `part-${Date.now()}-${acc.length}` });
    }
    return acc;
  }, []);
  result.newParts = uniqueParts;

  console.log(`Found ${uniqueParts.length} valid parts`);

  return result;
};
