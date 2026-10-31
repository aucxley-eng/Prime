import { randomUUID } from "node:crypto";
import { getDb } from "@/lib/db";
import { AREAS } from "@/lib/areas";
import type {
  Property,
  PropertyFilters,
  PropertyInput,
  PropertyStatus,
  Purpose,
} from "@/lib/types";

interface PropertyRow {
  id: string;
  ref: string;
  slug: string;
  title: string;
  purpose: string;
  location: string;
  county: string;
  type: string;
  beds: number | null;
  baths: number | null;
  size: string;
  price_label: string;
  price_ksh: number | null;
  featured: boolean;
  image: string;
  gallery: unknown;
  summary: string;
  description: string;
  features: unknown;
  amenities: unknown;
  status: string;
  created_at: string;
  updated_at: string;
}

function parseList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  if (typeof value !== "string") return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function toProperty(row: PropertyRow): Property {
  return {
    id: row.id,
    ref: row.ref,
    slug: row.slug,
    title: row.title,
    purpose: row.purpose === "rent" ? "rent" : "sale",
    location: row.location,
    county: row.county,
    type: row.type,
    beds: row.beds,
    baths: row.baths,
    size: row.size,
    priceLabel: row.price_label,
    priceKsh: row.price_ksh,
    featured: Boolean(row.featured),
    image: row.image,
    gallery: parseList(row.gallery),
    summary: row.summary,
    description: row.description,
    features: parseList(row.features),
    amenities: parseList(row.amenities),
    status: row.status === "draft" ? "draft" : "published",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listProperties(
  filters: PropertyFilters = {}
): Promise<Property[]> {
  const db = await getDb();
  const where: string[] = [];
  const params: Array<string | number> = [];

  function parameter(value: string | number): string {
    params.push(value);
    return `$${params.length}`;
  }

  if (!filters.includeDrafts) {
    where.push("status = 'published'");
  }

  if (filters.purpose === "sale" || filters.purpose === "rent") {
    where.push(`purpose = ${parameter(filters.purpose)}`);
  }

  if (filters.location && AREAS.some((area) => area.name === filters.location)) {
    where.push(`location = ${parameter(filters.location)}`);
  }

  if (filters.type) {
    where.push(`type = ${parameter(filters.type)}`);
  }

  if (filters.beds && filters.beds > 0) {
    where.push(`beds IS NOT NULL AND beds >= ${parameter(filters.beds)}`);
  }

  if (filters.q) {
    const term = `%${filters.q.trim()}%`;
    where.push(
      `(title ILIKE ${parameter(term)} OR summary ILIKE ${parameter(
        term
      )} OR location ILIKE ${parameter(term)} OR ref ILIKE ${parameter(term)})`
    );
  }

  const order = {
    featured: "featured DESC, created_at DESC",
    newest: "created_at DESC",
    beds: "beds IS NULL, beds DESC, created_at DESC",
    title: "lower(title) ASC",
  }[filters.sort || "featured"];

  const query = `
    SELECT * FROM properties
    ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
    ORDER BY ${order}
  `;

  const rows = (await db.unsafe(query, params)) as unknown as PropertyRow[];
  return rows.map(toProperty);
}

export async function getPropertyBySlug(
  slug: string,
  includeDrafts = false
): Promise<Property | null> {
  const db = await getDb();
  const rows = (await db.unsafe(
    includeDrafts
      ? "SELECT * FROM properties WHERE slug = $1"
      : "SELECT * FROM properties WHERE slug = $1 AND status = 'published'",
    [slug]
  )) as unknown as PropertyRow[];
  return rows[0] ? toProperty(rows[0]) : null;
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const db = await getDb();
  const rows = (await db.unsafe("SELECT * FROM properties WHERE id = $1", [
    id,
  ])) as unknown as PropertyRow[];
  return rows[0] ? toProperty(rows[0]) : null;
}

export async function getFeaturedProperties(limit = 6): Promise<Property[]> {
  const properties = await listProperties({ sort: "featured" });
  return properties.filter((property) => property.featured).slice(0, limit);
}

export async function getRelatedProperties(
  property: Property,
  limit = 3
): Promise<Property[]> {
  const db = await getDb();
  const rows = (await db.unsafe(
    `SELECT * FROM properties
     WHERE id != $1 AND status = 'published'
     ORDER BY (location = $2) DESC, (purpose = $3) DESC, featured DESC, created_at DESC
     LIMIT $4`,
    [property.id, property.location, property.purpose, limit]
  )) as unknown as PropertyRow[];
  return rows.map(toProperty);
}

export async function getPropertyCounts(): Promise<{
  total: number;
  published: number;
  drafts: number;
  sale: number;
  rent: number;
}> {
  const db = await getDb();
  const [row] = await db<
    {
      total: number;
      published: number;
      drafts: number;
      sale: number;
      rent: number;
    }[]
  >`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE status = 'published')::int AS published,
      COUNT(*) FILTER (WHERE status = 'draft')::int AS drafts,
      COUNT(*) FILTER (WHERE purpose = 'sale')::int AS sale,
      COUNT(*) FILTER (WHERE purpose = 'rent')::int AS rent
    FROM properties
  `;
  return {
    total: row?.total || 0,
    published: row?.published || 0,
    drafts: row?.drafts || 0,
    sale: row?.sale || 0,
    rent: row?.rent || 0,
  };
}

export async function getNextRef(): Promise<string> {
  const db = await getDb();
  const rows = await db<{ ref: string }[]>`SELECT ref FROM properties`;
  const highest = rows.reduce((max, row) => {
    const match = row.ref.match(/(\d+)\s*$/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return `PSP-${String(highest + 1).padStart(3, "0")}`;
}

export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/['’]/g, "")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const db = await getDb();
  const root = slugify(base) || "property";
  let candidate = root;
  let counter = 2;
  while (true) {
    const rows = excludeId
      ? await db<{ id: string }[]>`
          SELECT id FROM properties WHERE slug = ${candidate} AND id != ${excludeId}
        `
      : await db<{ id: string }[]>`
          SELECT id FROM properties WHERE slug = ${candidate}
        `;
    if (!rows[0]) return candidate;
    candidate = `${root}-${counter}`;
    counter += 1;
  }
}

export async function isRefTaken(
  ref: string,
  excludeId?: string
): Promise<boolean> {
  const db = await getDb();
  const rows = excludeId
    ? await db<{ id: string }[]>`
        SELECT id FROM properties WHERE ref = ${ref} AND id != ${excludeId}
      `
    : await db<{ id: string }[]>`SELECT id FROM properties WHERE ref = ${ref}`;
  return Boolean(rows[0]);
}

export async function createProperty(input: PropertyInput): Promise<Property> {
  const db = await getDb();
  const id = `psp-${randomUUID().slice(0, 8)}`;
  const slug = await uniqueSlug(input.slug || input.title);
  const now = new Date().toISOString();
  const area = AREAS.find((item) => item.name === input.location);

  const rows = await db<PropertyRow[]>`
    INSERT INTO properties (
      id, ref, slug, title, purpose, location, county, type, beds, baths,
      size, price_label, price_ksh, featured, image, gallery, summary,
      description, features, amenities, status, created_at, updated_at
    ) VALUES (
      ${id}, ${input.ref.trim()}, ${slug}, ${input.title.trim()},
      ${input.purpose}, ${input.location}, ${area?.county || ""},
      ${input.type}, ${input.beds}, ${input.baths}, ${input.size.trim()},
      ${input.priceLabel.trim() || "Price on request"}, ${input.priceKsh},
      ${input.featured}, ${input.image.trim()},
      ${JSON.stringify(input.gallery.filter(Boolean))},
      ${input.summary.trim()}, ${input.description.trim()},
      ${JSON.stringify(input.features.filter(Boolean))},
      ${JSON.stringify(input.amenities.filter(Boolean))},
      ${input.status}, ${now}, ${now}
    )
    RETURNING *
  `;

  if (!rows[0]) throw new Error("Property could not be created");
  return toProperty(rows[0]);
}

export async function updateProperty(
  id: string,
  input: PropertyInput
): Promise<Property> {
  const db = await getDb();
  const existing = await getPropertyById(id);
  if (!existing) throw new Error("Property not found");

  const slug = input.slug ? await uniqueSlug(input.slug, id) : existing.slug;
  const now = new Date().toISOString();
  const area = AREAS.find((item) => item.name === input.location);

  const rows = await db<PropertyRow[]>`
    UPDATE properties SET
      ref = ${input.ref.trim()},
      slug = ${slug},
      title = ${input.title.trim()},
      purpose = ${input.purpose},
      location = ${input.location},
      county = ${area?.county || ""},
      type = ${input.type},
      beds = ${input.beds},
      baths = ${input.baths},
      size = ${input.size.trim()},
      price_label = ${input.priceLabel.trim() || "Price on request"},
      price_ksh = ${input.priceKsh},
      featured = ${input.featured},
      image = ${input.image.trim()},
      gallery = ${JSON.stringify(input.gallery.filter(Boolean))},
      summary = ${input.summary.trim()},
      description = ${input.description.trim()},
      features = ${JSON.stringify(input.features.filter(Boolean))},
      amenities = ${JSON.stringify(input.amenities.filter(Boolean))},
      status = ${input.status},
      updated_at = ${now}
    WHERE id = ${id}
    RETURNING *
  `;

  if (!rows[0]) throw new Error("Property could not be updated");
  return toProperty(rows[0]);
}

export async function deleteProperty(id: string): Promise<void> {
  const db = await getDb();
  await db`DELETE FROM properties WHERE id = ${id}`;
}

export function isPurpose(value: string): value is Purpose {
  return value === "sale" || value === "rent";
}

export function isStatus(value: string): value is PropertyStatus {
  return value === "published" || value === "draft";
}
