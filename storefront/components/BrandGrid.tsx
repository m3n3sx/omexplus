// components/BrandGrid.tsx
import Image from "next/image";

type Brand = {
  id: string;
  name: string;
  logo: string;   // ścieżka do pliku w /public
  alt?: string;
};

const BRANDS: Brand[] = [
  { id: "atlas", name: "ATLAS", logo: "/brands/atlas.svg" },
  { id: "bobcat", name: "Bobcat", logo: "/brands/bobcat.svg" },
  { id: "case", name: "CASE", logo: "/brands/case.svg" },
  { id: "caterpillar", name: "Caterpillar", logo: "/brands/caterpillar.svg" },
  { id: "develon", name: "Develon", logo: "/brands/develon.svg" },
  { id: "doosan", name: "Doosan", logo: "/brands/doosan.svg" },
  { id: "fiat-hitachi", name: "Fiat-Hitachi", logo: "/brands/fiat-hitachi.svg" },
  { id: "fiat-kobelco", name: "Fiat-Kobelco", logo: "/brands/fiat-kobelco.svg" },
  { id: "hitachi", name: "Hitachi", logo: "/brands/hitachi.svg" },
  { id: "jcb", name: "JCB", logo: "/brands/jcb.svg" },
  { id: "kobelco", name: "Kobelco", logo: "/brands/kobelco.svg" },
  { id: "komatsu", name: "Komatsu", logo: "/brands/komatsu.svg" },
  { id: "kramer", name: "Kramer", logo: "/brands/kramer.svg" },
  { id: "kubota", name: "Kubota", logo: "/brands/kubota.svg" },
  { id: "liebherr", name: "Liebherr", logo: "/brands/liebherr.svg" },
  { id: "new-holland", name: "New Holland", logo: "/brands/new-holland.svg" },
  { id: "oek", name: "O&K", logo: "/brands/oek.svg" },
  { id: "schaeff", name: "Schaeff", logo: "/brands/schaeff.svg" },
  { id: "takeuchi", name: "Takeuchi", logo: "/brands/takeuchi.svg" },
  { id: "terex", name: "Terex", logo: "/brands/terex.svg" },
  { id: "volvo", name: "Volvo", logo: "/brands/volvo.svg" },
  { id: "wacker-neuson", name: "Wacker Neuson", logo: "/brands/wacker-neuson.svg" },
  { id: "yanmar", name: "Yanmar", logo: "/brands/yanmar.svg" },
];

export function BrandGrid() {
  return (
    <section aria-labelledby="brand-grid-heading" className="py-8">
      <div className="mx-auto max-w-6xl px-4">
        <h2
          id="brand-grid-heading"
          className="text-lg font-semibold tracking-tight mb-4"
        >
          Obsługiwane marki
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {BRANDS.map((brand) => (
            <div
              key={brand.id}
              className="flex items-center justify-center rounded-md border border-neutral-200 bg-white px-3 py-2"
            >
              <Image
                src={brand.logo}
                alt={brand.alt ?? brand.name}
                width={120}
                height={60}
                className="max-h-10 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
