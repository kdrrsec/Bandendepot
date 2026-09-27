export interface Brand {
  name: string;
  slug: string;
  logo: string;
}

export const brands: Brand[] = [
  { name: "Michelin", slug: "michelin", logo: "/brands/michelin.png" },
  { name: "Bridgestone", slug: "bridgestone", logo: "/brands/bridgestone.png" },
  { name: "Continental", slug: "continental", logo: "/brands/continental.png" },
  { name: "Goodyear", slug: "goodyear", logo: "/brands/goodyear.png" },
  { name: "Pirelli", slug: "pirelli", logo: "/brands/pirelli.png" },
  { name: "Dunlop", slug: "dunlop", logo: "/brands/dunlop.png" },
  { name: "Hankook", slug: "hankook", logo: "/brands/hankook.png" },
  { name: "Toyo", slug: "toyo", logo: "/brands/toyo.png" },
  { name: "Yokohama", slug: "yokohama", logo: "/brands/yokohama.png" },
  { name: "Nokian", slug: "nokian", logo: "/brands/nokian.png" },
];

