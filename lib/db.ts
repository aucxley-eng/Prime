import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { AREAS } from "@/lib/areas";
import { DEFAULT_SETTINGS } from "@/lib/defaults";
import { SEED_PROPERTIES } from "@/lib/seed-data";

const SCHEMA = `
CREATE TABLE IF NOT EXISTS properties (
  id TEXT PRIMARY KEY,
  ref TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  purpose TEXT NOT NULL,
  location TEXT NOT NULL,
  county TEXT NOT NULL,
  type TEXT NOT NULL,
  beds INTEGER,
  baths INTEGER,
  size TEXT NOT NULL DEFAULT '',
  price_label TEXT NOT NULL,
  price_ksh INTEGER,
  featured INTEGER NOT NULL DEFAULT 0,
  image TEXT NOT NULL,
  gallery TEXT NOT NULL DEFAULT '[]',
  summary TEXT NOT NULL,
  description TEXT NOT NULL,
  features TEXT NOT NULL DEFAULT '[]',
  amenities TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'published',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_properties_status ON properties (status);
CREATE INDEX IF NOT EXISTS idx_properties_purpose ON properties (purpose);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties (location);

CREATE TABLE IF NOT EXISTS enquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  property_id TEXT,
  property_ref TEXT,
  property_title TEXT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT 'contact',
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries (status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries (created_at);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
`;

const globalDatabase = globalThis as unknown as {
  primeSaharaDb?: DatabaseSync;
};

function resolveDatabasePath(): string {
  const configured = process.env.DATABASE_PATH?.trim();
  if (configured) return configured;
  return path.join(process.cwd(), "data", "prime.db");
}

function migrate(db: DatabaseSync): void {
  db.exec(SCHEMA);
}

function seed(db: DatabaseSync): void {
  const insertSetting = db.prepare(
    "INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)"
  );
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    insertSetting.run(key, value);
  }

  const row = db.prepare("SELECT COUNT(*) AS count FROM properties").get() as
    | { count: number }
    | undefined;
  if (row && row.count > 0) return;

  const insertProperty = db.prepare(`
    INSERT INTO properties (
      id, ref, slug, title, purpose, location, county, type, beds, baths,
      size, price_label, price_ksh, featured, image, gallery, summary,
      description, features, amenities, status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  db.exec("BEGIN");
  try {
    SEED_PROPERTIES.forEach((property, index) => {
      const area = AREAS.find((item) => item.name === property.location);
      const timestamp = new Date(Date.now() - index * 86_400_000).toISOString();
      insertProperty.run(
        property.id,
        property.ref,
        property.slug,
        property.title,
        property.purpose,
        property.location,
        area?.county || "",
        property.type,
        property.beds,
        property.baths,
        property.size,
        property.priceLabel,
        property.priceKsh,
        property.featured ? 1 : 0,
        property.image,
        JSON.stringify(property.gallery),
        property.summary,
        property.description,
        JSON.stringify(property.features),
        JSON.stringify(property.amenities),
        property.status,
        timestamp,
        timestamp
      );
    });
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function getDb(): DatabaseSync {
  if (globalDatabase.primeSaharaDb) return globalDatabase.primeSaharaDb;

  const file = resolveDatabasePath();
  fs.mkdirSync(path.dirname(file), { recursive: true });

  const db = new DatabaseSync(file);
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");
  db.exec("PRAGMA busy_timeout = 5000;");

  migrate(db);
  seed(db);

  globalDatabase.primeSaharaDb = db;
  return db;
}
