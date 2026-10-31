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
  featured: number;
  image: string;
  gallery: string;
  summary: string;
  description: string;
  features: string;
  amenities: string;
  status: string;
  created_at: string;
  updated_at: string;
}

function parseList(value: string): string[] {
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

export function listProperties(filters: PropertyFilters = {}): Property[] {
  const db = getDb();
  const where: string[] = [];
  const params: Array<string | number> = [];

  if (!filters.includeDrafts) {
    where.push("status = 'published'");
  }

  if (filters.purpose === "sale" || filters.purpose === "rent") {
    where.push("purpose = ?");
    params.push(filters.purpose);
  }

  if (filters.location && AREAS.some((area) => area.name === filters.location)) {
    where.push("location = ?");
    params.push(filters.location);
  }

  if (filters.type) {
    where.push("type = ?");
    params.push(filters.type);
  }

  if (filters.beds && filters.beds > 0) {
    where.push("beds IS NOT NULL AND beds >= ?");
    params.push(filters.beds);
  }

  if (filters.q) {
    const term = `%${filters.q.trim()}%`;
    where.push("(title LIKE ? OR summary LIKE ? OR location LIKE ? OR ref LIKE ?)");
    params.push(term, term, term, term);
  }

  const order = {
    featured: "featured DESC, created_at DESC",
    newest: "created_at DESC",
    beds: "beds IS NULL, beds DESC, created_at DESC",
    title: "title COLLATE NOCASE ASC",
  }[filters.sort || "featured"];

  const sql = `
    SELECT * FROM properties
    ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
    ORDER BY ${order}
  `;

  const rows = db.prepare(sql).all(...params) as unknown as PropertyRow[];
  return rows.map(toProperty);
}

export function getPropertyBySlug(slug: string, includeDrafts = false): Property | null {
  const db = getDb();
  const sql = includeDrafts
    ? "SELECT * FROM properties WHERE slug = ?"
    : "SELECT * FROM properties WHERE slug = ? AND status = 'published'";
  const row = db.prepare(sql).get(slug) as unknown as PropertyRow | undefined;
  return row ? toProperty(row) : null;
}

export function getPropertyById(id: string): Property | null {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM properties WHERE id = ?")
    .get(id) as unknown as PropertyRow | undefined;
  return row ? toProperty(row) : null;
}

export function getFeaturedProperties(limit = 6): Property[] {
  return listProperties({ sort: "featured" })
    .filter((property) => property.featured)
    .slice(0, limit);
}

export function getRelatedProperties(property: Property, limit = 3): Property[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT * FROM properties
       WHERE id != ? AND status = 'published'
       ORDER BY (location = ?) DESC, (purpose = ?) DESC, featured DESC, created_at DESC
       LIMIT ?`
    )
    .all(property.id, property.location, property.purpose, limit) as unknown as PropertyRow[];
  return rows.map(toProperty);
}

export function getPropertyCounts(): {
  total: number;
  published: number;
  drafts: number;
  sale: number;
  rent: number;
} {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) AS published,
        SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) AS drafts,
        SUM(CASE WHEN purpose = 'sale' THEN 1 ELSE 0 END) AS sale,
        SUM(CASE WHEN purpose = 'rent' THEN 1 ELSE 0 END) AS rent
       FROM properties`
    )
    .get() as {
    total: number;
    published: number | null;
    drafts: number | null;
    sale: number | null;
    rent: number | null;
  };
  return {
    total: row.total,
    published: row.published || 0,
    drafts: row.drafts || 0,
    sale: row.sale || 0,
    rent: row.rent || 0,
  };
}

export function getNextRef(): string {
  const db = getDb();
  const rows = db.prepare("SELECT ref FROM properties").all() as Array<{ ref: string }>;
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

function uniqueSlug(base: string, excludeId?: string): string {
  const db = getDb();
  const root = slugify(base) || "property";
  let candidate = root;
  let counter = 2;
  while (true) {
    const row = excludeId
      ? db
          .prepare("SELECT id FROM properties WHERE slug = ? AND id != ?")
          .get(candidate, excludeId)
      : db.prepare("SELECT id FROM properties WHERE slug = ?").get(candidate);
    if (!row) return candidate;
    candidate = `${root}-${counter}`;
    counter += 1;
  }
}

export function isRefTaken(ref: string, excludeId?: string): boolean {
  const db = getDb();
  const row = excludeId
    ? db.prepare("SELECT id FROM properties WHERE ref = ? AND id != ?").get(ref, excludeId)
    : db.prepare("SELECT id FROM properties WHERE ref = ?").get(ref);
  return Boolean(row);
}

function insertValues(input: PropertyInput, id: string, slug: string, now: string): unknown[] {
  const area = AREAS.find((item) => item.name === input.location);
  return [
    id,
    input.ref.trim(),
    slug,
    input.title.trim(),
    input.purpose,
    input.location,
    area?.county || "",
    input.type,
    input.beds,
    input.baths,
    input.size.trim(),
    input.priceLabel.trim() || "Price on request",
    input.priceKsh,
    input.featured ? 1 : 0,
    input.image.trim(),
    JSON.stringify(input.gallery.filter(Boolean)),
    input.summary.trim(),
    input.description.trim(),
    JSON.stringify(input.features.filter(Boolean)),
    JSON.stringify(input.amenities.filter(Boolean)),
    input.status,
    now,
    now,
  ];
}

export function createProperty(input: PropertyInput): Property {
  const db = getDb();
  const id = `psp-${randomUUID().slice(0, 8)}`;
  const slug = uniqueSlug(input.slug || input.title);
  const now = new Date().toISOString();

  db.prepare(
    `INSERT INTO properties (
      id, ref, slug, title, purpose, location, county, type, beds, baths,
      size, price_label, price_ksh, featured, image, gallery, summary,
      description, features, amenities, status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(...(insertValues(input, id, slug, now) as never[]));

  const created = getPropertyById(id);
  if (!created) throw new Error("Property could not be created");
  return created;
}

export function updateProperty(id: string, input: PropertyInput): Property {
  const db = getDb();
  const existing = getPropertyById(id);
  if (!existing) throw new Error("Property not found");

  const slug = input.slug ? uniqueSlug(input.slug, id) : existing.slug;
  const now = new Date().toISOString();
  const area = AREAS.find((item) => item.name === input.location);

  db.prepare(
    `UPDATE properties SET
      ref = ?, slug = ?, title = ?, purpose = ?, location = ?, county = ?,
      type = ?, beds = ?, baths = ?, size = ?, price_label = ?, price_ksh = ?,
      featured = ?, image = ?, gallery = ?, summary = ?, description = ?,
      features = ?, amenities = ?, status = ?, updated_at = ?
     WHERE id = ?`
  ).run(
    input.ref.trim(),
    slug,
    input.title.trim(),
    input.purpose,
    input.location,
    area?.county || "",
    input.type,
    input.beds,
    input.baths,
    input.size.trim(),
    input.priceLabel.trim() || "Price on request",
    input.priceKsh,
    input.featured ? 1 : 0,
    input.image.trim(),
    JSON.stringify(input.gallery.filter(Boolean)),
    input.summary.trim(),
    input.description.trim(),
    JSON.stringify(input.features.filter(Boolean)),
    JSON.stringify(input.amenities.filter(Boolean)),
    input.status,
    now,
    id
  );

  const updated = getPropertyById(id);
  if (!updated) throw new Error("Property could not be updated");
  return updated;
}

export function deleteProperty(id: string): void {
  getDb().prepare("DELETE FROM properties WHERE id = ?").run(id);
}

export function isPurpose(value: string): value is Purpose {
  return value === "sale" || value === "rent";
}

export function isStatus(value: string): value is PropertyStatus {
  return value === "published" || value === "draft";
}
