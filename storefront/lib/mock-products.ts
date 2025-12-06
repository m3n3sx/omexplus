// Mock products for demo purposes when backend is not available
export const mockProducts = [
  {
    id: "prod_01",
    title: "Filtr oleju hydraulicznego",
    handle: "filtr-oleju-hydraulicznego",
    description: "Wysokiej jakości filtr oleju hydraulicznego do maszyn budowlanych",
    thumbnail: "/placeholder.svg",
    variants: [
      {
        id: "variant_01",
        title: "Standard",
        prices: [{ amount: 12500, currency_code: "pln" }],
        inventory_quantity: 50
      }
    ],
    categories: [{ name: "Filtry" }],
    tags: [{ value: "hydraulika" }, { value: "filtry" }]
  },
  {
    id: "prod_02",
    title: "Uszczelka głowicy",
    handle: "uszczelka-glowicy",
    description: "Oryginalna uszczelka głowicy do silników diesla",
    thumbnail: "/placeholder.svg",
    variants: [
      {
        id: "variant_02",
        title: "Standard",
        prices: [{ amount: 25000, currency_code: "pln" }],
        inventory_quantity: 30
      }
    ],
    categories: [{ name: "Uszczelki" }],
    tags: [{ value: "silnik" }, { value: "uszczelki" }]
  },
  {
    id: "prod_03",
    title: "Pasek klinowy",
    handle: "pasek-klinowy",
    description: "Wzmocniony pasek klinowy do agregatów",
    thumbnail: "/placeholder.svg",
    variants: [
      {
        id: "variant_03",
        title: "Standard",
        prices: [{ amount: 8500, currency_code: "pln" }],
        inventory_quantity: 100
      }
    ],
    categories: [{ name: "Paski" }],
    tags: [{ value: "napęd" }, { value: "paski" }]
  },
  {
    id: "prod_04",
    title: "Łożysko kulkowe",
    handle: "lozysko-kulkowe",
    description: "Precyzyjne łożysko kulkowe do maszyn przemysłowych",
    thumbnail: "/placeholder.svg",
    variants: [
      {
        id: "variant_04",
        title: "Standard",
        prices: [{ amount: 15000, currency_code: "pln" }],
        inventory_quantity: 75
      }
    ],
    categories: [{ name: "Łożyska" }],
    tags: [{ value: "łożyska" }, { value: "mechanika" }]
  },
  {
    id: "prod_05",
    title: "Pompa hydrauliczna",
    handle: "pompa-hydrauliczna",
    description: "Wydajna pompa hydrauliczna do koparek",
    thumbnail: "/placeholder.svg",
    variants: [
      {
        id: "variant_05",
        title: "Standard",
        prices: [{ amount: 450000, currency_code: "pln" }],
        inventory_quantity: 10
      }
    ],
    categories: [{ name: "Pompy" }],
    tags: [{ value: "hydraulika" }, { value: "pompy" }]
  },
  {
    id: "prod_06",
    title: "Cylinder hydrauliczny",
    handle: "cylinder-hydrauliczny",
    description: "Wytrzymały cylinder hydrauliczny",
    thumbnail: "/placeholder.svg",
    variants: [
      {
        id: "variant_06",
        title: "Standard",
        prices: [{ amount: 350000, currency_code: "pln" }],
        inventory_quantity: 15
      }
    ],
    categories: [{ name: "Cylindry" }],
    tags: [{ value: "hydraulika" }, { value: "cylindry" }]
  }
];

export const mockCategories = [
  { id: "cat_01", name: "Filtry", handle: "filtry" },
  { id: "cat_02", name: "Uszczelki", handle: "uszczelki" },
  { id: "cat_03", name: "Paski", handle: "paski" },
  { id: "cat_04", name: "Łożyska", handle: "lozyska" },
  { id: "cat_05", name: "Pompy", handle: "pompy" },
  { id: "cat_06", name: "Cylindry", handle: "cylindry" }
];
