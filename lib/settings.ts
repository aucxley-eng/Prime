import { getDb } from "@/lib/db";
import { DEFAULT_SETTINGS } from "@/lib/defaults";
import type { SiteSettings } from "@/lib/types";

const SETTING_KEYS = Object.keys(DEFAULT_SETTINGS) as Array<keyof SiteSettings>;

export function getSettings(): SiteSettings {
  const db = getDb();
  const rows = db.prepare("SELECT key, value FROM settings").all() as Array<{
    key: string;
    value: string;
  }>;

  const settings: SiteSettings = { ...DEFAULT_SETTINGS };
  for (const row of rows) {
    if ((SETTING_KEYS as string[]).includes(row.key)) {
      settings[row.key as keyof SiteSettings] = row.value;
    }
  }
  return settings;
}

export function saveSettings(input: SiteSettings): void {
  const db = getDb();
  const statement = db.prepare(`
    INSERT INTO settings (key, value) VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `);

  db.exec("BEGIN");
  try {
    for (const key of SETTING_KEYS) {
      statement.run(key, input[key] ?? DEFAULT_SETTINGS[key]);
    }
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}
