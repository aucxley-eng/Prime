import type { SiteSettings } from "@/lib/types";

export const SITE_NAME = "Prime Sahara Properties";
export const SITE_SHORT_NAME = "Prime Sahara";
export const SITE_DESCRIPTION =
  "Prime Sahara Properties helps buyers, renters and investors find homes and property in Kitengela, Lang'ata and Juja, with viewings arranged directly by phone or WhatsApp.";

export const PROPERTY_TYPES = [
  "Apartment",
  "Maisonette",
  "Bungalow",
  "Townhouse",
  "Villa",
  "Plot",
] as const;

export const DEFAULT_SETTINGS: SiteSettings = {
  phonePrimaryLabel: "0722 744110",
  phonePrimaryTel: "+254722744110",
  phoneSecondaryLabel: "0707 600069",
  phoneSecondaryTel: "+254707600069",
  whatsapp: "254722744110",
  facebookUrl:
    "https://www.facebook.com/search/top?q=Prime%20Sahara%20Properties",
  officeNote:
    "Viewings are arranged by appointment. Our exact office location is being confirmed, so please call or WhatsApp before visiting.",
  hours: "Viewings by appointment. Call or WhatsApp to confirm a time.",
};
