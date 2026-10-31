import { getDb } from "@/lib/db";
import { DEFAULT_SETTINGS } from "@/lib/defaults";
import type { SiteSettings } from "@/lib/types";

const SETTING_KEYS = Object.keys(DEFAULT_SETTINGS) as Array<keyof SiteSettings>;

export async function getSettings(): Promise<SiteSettings> {
  const db = await getDb();
  const rows = await db<{ key: string; value: string }[]>`
    SELECT key, value FROM settings
  `;

  const settings: SiteSettings = { ...DEFAULT_SETTINGS };
  for (const row of rows) {
    if ((SETTING_KEYS as string[]).includes(row.key)) {
      settings[row.key as keyof SiteSettings] = row.value;
    }
  }
  return settings;
}

export async function saveSettings(input: SiteSettings): Promise<void> {
  const db = await getDb();
  await db.begin(async (transaction) => {
    for (const key of SETTING_KEYS) {
      await transaction`
        INSERT INTO settings (key, value)
        VALUES (${key}, ${input[key] ?? DEFAULT_SETTINGS[key]})
        ON CONFLICT (key) DO UPDATE SET value = excluded.value
      `;
    }
  });
}
