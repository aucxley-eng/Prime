import { getDb } from "@/lib/db";
import type { Enquiry, EnquiryStatus } from "@/lib/types";

interface EnquiryRow {
  id: number;
  property_id: string | null;
  property_ref: string | null;
  property_title: string | null;
  name: string;
  phone: string;
  message: string;
  source: string;
  status: string;
  created_at: string;
}

function toEnquiry(row: EnquiryRow): Enquiry {
  return {
    id: Number(row.id),
    propertyId: row.property_id,
    propertyRef: row.property_ref,
    propertyTitle: row.property_title,
    name: row.name,
    phone: row.phone,
    message: row.message,
    source: row.source,
    status:
      row.status === "handled" || row.status === "archived" ? row.status : "new",
    createdAt: row.created_at,
  };
}

export interface NewEnquiry {
  propertyId?: string | null;
  propertyRef?: string | null;
  propertyTitle?: string | null;
  name: string;
  phone: string;
  message: string;
  source: "contact" | "property";
}

export function createEnquiry(input: NewEnquiry): Enquiry {
  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO enquiries (
        property_id, property_ref, property_title, name, phone, message, source, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'new', ?)`
    )
    .run(
      input.propertyId || null,
      input.propertyRef || null,
      input.propertyTitle || null,
      input.name.trim(),
      input.phone.trim(),
      input.message.trim(),
      input.source,
      new Date().toISOString()
    );

  const row = db
    .prepare("SELECT * FROM enquiries WHERE id = ?")
    .get(Number(result.lastInsertRowid)) as unknown as EnquiryRow | undefined;
  if (!row) throw new Error("Enquiry could not be created");
  return toEnquiry(row);
}

export function listEnquiries(status?: EnquiryStatus | "all"): Enquiry[] {
  const db = getDb();
  const rows =
    status && status !== "all"
      ? (db
          .prepare(
            "SELECT * FROM enquiries WHERE status = ? ORDER BY created_at DESC"
          )
          .all(status) as unknown as EnquiryRow[])
      : (db
          .prepare("SELECT * FROM enquiries ORDER BY created_at DESC")
          .all() as unknown as EnquiryRow[]);
  return rows.map(toEnquiry);
}

export function getEnquiryCounts(): {
  total: number;
  new: number;
  handled: number;
  archived: number;
} {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) AS new_count,
        SUM(CASE WHEN status = 'handled' THEN 1 ELSE 0 END) AS handled,
        SUM(CASE WHEN status = 'archived' THEN 1 ELSE 0 END) AS archived
       FROM enquiries`
    )
    .get() as {
    total: number;
    new_count: number | null;
    handled: number | null;
    archived: number | null;
  };
  return {
    total: row.total,
    new: row.new_count || 0,
    handled: row.handled || 0,
    archived: row.archived || 0,
  };
}

export function updateEnquiryStatus(id: number, status: EnquiryStatus): void {
  getDb().prepare("UPDATE enquiries SET status = ? WHERE id = ?").run(status, id);
}

export function deleteEnquiry(id: number): void {
  getDb().prepare("DELETE FROM enquiries WHERE id = ?").run(id);
}
