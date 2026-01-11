import { NextRequest, NextResponse } from 'next/server'
import https from 'https'

// GUS API credentials
const GUS_API_KEY = 'a44eade9e2ba46e9bec1'
const GUS_API_URL = 'https://wyszukiwarkaregon.stat.gov.pl/wsBIR/UslugaBIRzewnPubl.svc'

// Create HTTPS agent that ignores SSL certificate errors
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
})

// SOAP envelope templates
const loginEnvelope = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://CIS/BIR/PUBL/2014/07">
  <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
    <wsa:Action>http://CIS/BIR/PUBL/2014/07/IUslugaBIRzewnPubl/Zaloguj</wsa:Action>
    <wsa:To>${GUS_API_URL}</wsa:To>
  </soap:Header>
  <soap:Body>
    <ns:Zaloguj>
      <ns:pKluczUzytkownika>${GUS_API_KEY}</ns:pKluczUzytkownika>
    </ns:Zaloguj>
  </soap:Body>
</soap:Envelope>`

function searchEnvelope(nip: string) {
  return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://CIS/BIR/PUBL/2014/07" xmlns:dat="http://CIS/BIR/PUBL/2014/07/DataContract">
  <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
    <wsa:Action>http://CIS/BIR/PUBL/2014/07/IUslugaBIRzewnPubl/DaneSzukajPodmioty</wsa:Action>
    <wsa:To>${GUS_API_URL}</wsa:To>
  </soap:Header>
  <soap:Body>
    <ns:DaneSzukajPodmioty>
      <ns:pParametryWyszukiwania>
        <dat:Nip>${nip}</dat:Nip>
      </ns:pParametryWyszukiwania>
    </ns:DaneSzukajPodmioty>
  </soap:Body>
</soap:Envelope>`
}

// Custom fetch with SSL bypass
async function fetchWithSSLBypass(url: string, options: RequestInit & { headers?: Record<string, string> }): Promise<Response> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url)
    
    const reqOptions: https.RequestOptions = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname,
      method: options.method || 'GET',
      headers: options.headers || {},
      agent: httpsAgent
    }

    const req = https.request(reqOptions, (res) => {
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => {
        resolve(new Response(data, {
          status: res.statusCode || 200,
          headers: res.headers as any
        }))
      })
    })

    req.on('error', reject)
    
    if (options.body) {
      req.write(options.body)
    }
    req.end()
  })
}

async function getSessionId(): Promise<string | null> {
  try {
    const response = await fetchWithSSLBypass(GUS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/soap+xml;charset=UTF-8',
      },
      body: loginEnvelope,
    })

    const text = await response.text()
    const match = text.match(/<ZalogujResult>([^<]+)<\/ZalogujResult>/)
    if (match && match[1]) {
      return match[1]
    }
    return null
  } catch (error) {
    console.error('GUS login error:', error)
    return null
  }
}

async function searchByNip(sessionId: string, nip: string): Promise<any> {
  try {
    const response = await fetchWithSSLBypass(GUS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/soap+xml;charset=UTF-8',
        'sid': sessionId,
      },
      body: searchEnvelope(nip),
    })

    const text = await response.text()
    const resultMatch = text.match(/<DaneSzukajPodmiotyResult>([^]*?)<\/DaneSzukajPodmiotyResult>/)
    if (!resultMatch || !resultMatch[1]) {
      return null
    }

    const decodedXml = resultMatch[1]
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')

    const getData = (tag: string) => {
      const regex = new RegExp(`<${tag}>([^<]*)</${tag}>`)
      const match = decodedXml.match(regex)
      return match ? match[1] : ''
    }

    return {
      name: getData('Nazwa'),
      nip: getData('Nip'),
      regon: getData('Regon'),
      province: getData('Wojewodztwo'),
      county: getData('Powiat'),
      commune: getData('Gmina'),
      city: getData('Miejscowosc'),
      postalCode: getData('KodPocztowy'),
      street: getData('Ulica'),
      buildingNumber: getData('NrNieruchomosci'),
      apartmentNumber: getData('NrLokalu'),
      type: getData('Typ'),
    }
  } catch (error) {
    console.error('GUS search error:', error)
    return null
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const nip = searchParams.get('nip')

  if (!nip) {
    return NextResponse.json({ error: 'NIP is required' }, { status: 400 })
  }

  const cleanNip = nip.replace(/[-\s]/g, '')

  if (!/^\d{10}$/.test(cleanNip)) {
    return NextResponse.json({ error: 'Invalid NIP format' }, { status: 400 })
  }

  const sessionId = await getSessionId()
  if (!sessionId) {
    return NextResponse.json({ error: 'Failed to connect to GUS API' }, { status: 500 })
  }

  const companyData = await searchByNip(sessionId, cleanNip)
  if (!companyData) {
    return NextResponse.json({ error: 'Company not found' }, { status: 404 })
  }

  let address = ''
  if (companyData.street) {
    address = `ul. ${companyData.street}`
    if (companyData.buildingNumber) {
      address += ` ${companyData.buildingNumber}`
    }
    if (companyData.apartmentNumber) {
      address += `/${companyData.apartmentNumber}`
    }
  } else if (companyData.buildingNumber) {
    address = companyData.buildingNumber
    if (companyData.apartmentNumber) {
      address += `/${companyData.apartmentNumber}`
    }
  }

  return NextResponse.json({
    success: true,
    data: {
      companyName: companyData.name,
      nip: companyData.nip,
      regon: companyData.regon,
      address: address,
      city: companyData.city,
      postalCode: companyData.postalCode,
      province: companyData.province,
    }
  })
}
