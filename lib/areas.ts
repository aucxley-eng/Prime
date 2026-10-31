import type { Area } from "@/lib/types";

export const AREAS: Area[] = [
  {
    name: "Kitengela",
    county: "Kajiado County",
    image: "/images/house-1.jpg",
    blurb:
      "Gated estates, family homes and development plots on Nairobi's southern edge, with space to grow and easy access to the city.",
    tags: ["Family homes", "Plots", "Gated estates"],
  },
  {
    name: "Lang'ata",
    county: "Nairobi County",
    image: "/images/house-3.jpg",
    blurb:
      "An established, leafy part of Nairobi close to schools, shopping and open spaces, suited to families and long-term rentals.",
    tags: ["Family homes", "Apartments", "Townhouses"],
  },
  {
    name: "Juja",
    county: "Kiambu County",
    image: "/images/apartment-1.jpg",
    blurb:
      "A fast-growing university town along the Thika corridor, popular with young professionals, students and buy-to-let investors.",
    tags: ["Apartments", "Maisonettes", "Investment"],
  },
];

export const AREA_NAMES = AREAS.map((area) => area.name);

export function findArea(name: string): Area | undefined {
  return AREAS.find((area) => area.name === name);
}
