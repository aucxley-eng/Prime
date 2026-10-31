import type { Property, Purpose, SiteSettings } from "@/lib/types";

export function whatsappNumber(settings: SiteSettings): string {
  return settings.whatsapp.replace(/\D/g, "");
}

export function whatsappUrl(message: string, settings: SiteSettings): string {
  return `https://wa.me/${whatsappNumber(settings)}?text=${encodeURIComponent(message)}`;
}

export function propertyEnquiryMessage(
  property: Pick<Property, "title" | "ref" | "location">,
  name?: string
): string {
  const greeting = name
    ? `Hello Prime Sahara Properties, my name is ${name}.`
    : "Hello Prime Sahara Properties.";
  return `${greeting} I would like to arrange a viewing for ${property.title} (Ref ${property.ref}) in ${property.location}. Please share the price, availability and available viewing times.`;
}

export function generalEnquiryMessage(name?: string): string {
  const greeting = name
    ? `Hello Prime Sahara Properties, my name is ${name}.`
    : "Hello Prime Sahara Properties.";
  return `${greeting} I would like to make an enquiry about a property.`;
}

export function formatPurpose(purpose: Purpose): string {
  return purpose === "rent" ? "For rent" : "For sale";
}

export function displayPrice(property: Pick<Property, "priceLabel" | "priceKsh">): string {
  if (property.priceLabel.trim()) return property.priceLabel;
  if (property.priceKsh && property.priceKsh > 0) {
    return `KSh ${new Intl.NumberFormat("en-KE").format(property.priceKsh)}`;
  }
  return "Price on request";
}

export function telHref(tel: string): string {
  return `tel:${tel.replace(/[^\d+]/g, "")}`;
}
