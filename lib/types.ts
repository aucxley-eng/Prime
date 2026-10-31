export type Purpose = "sale" | "rent";
export type PropertyStatus = "published" | "draft";
export type EnquiryStatus = "new" | "handled" | "archived";

export interface Area {
  name: string;
  county: string;
  image: string;
  blurb: string;
  tags: string[];
}

export interface Property {
  id: string;
  ref: string;
  slug: string;
  title: string;
  purpose: Purpose;
  location: string;
  county: string;
  type: string;
  beds: number | null;
  baths: number | null;
  size: string;
  priceLabel: string;
  priceKsh: number | null;
  featured: boolean;
  image: string;
  gallery: string[];
  summary: string;
  description: string;
  features: string[];
  amenities: string[];
  status: PropertyStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyInput {
  slug?: string;
  ref: string;
  title: string;
  purpose: Purpose;
  location: string;
  type: string;
  beds: number | null;
  baths: number | null;
  size: string;
  priceLabel: string;
  priceKsh: number | null;
  featured: boolean;
  image: string;
  gallery: string[];
  summary: string;
  description: string;
  features: string[];
  amenities: string[];
  status: PropertyStatus;
}

export interface Enquiry {
  id: number;
  propertyId: string | null;
  propertyRef: string | null;
  propertyTitle: string | null;
  name: string;
  phone: string;
  message: string;
  source: string;
  status: EnquiryStatus;
  createdAt: string;
}

export interface SiteSettings {
  phonePrimaryLabel: string;
  phonePrimaryTel: string;
  phoneSecondaryLabel: string;
  phoneSecondaryTel: string;
  whatsapp: string;
  facebookUrl: string;
  officeNote: string;
  hours: string;
}

export interface PropertyFilters {
  purpose?: Purpose;
  location?: string;
  type?: string;
  beds?: number;
  q?: string;
  sort?: "featured" | "newest" | "beds" | "title";
  includeDrafts?: boolean;
}
