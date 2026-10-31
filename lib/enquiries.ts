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

export async function createEnquiry(input: NewEnquiry): Promise<Enquiry> {
  const db = await getDb();
  const rows = await db<EnquiryRow[]>`
    INSERT INTO enquiries (
      property_id, property_ref, property_title, name, phone, message, source, status, created_at
    ) VALUES (
      ${input.propertyId || null}, ${input.propertyRef || null},
      ${input.propertyTitle || null}, ${input.name.trim()},
      ${input.phone.trim()}, ${input.message.trim()}, ${input.source},
      'new', ${new Date().toISOString()}
    )
    RETURNING *
  `;
  if (!rows[0]) throw new Error("Enquiry could not be created");
  return toEnquiry(rows[0]);
}

export async function listEnquiries(
  status?: EnquiryStatus | "all"
): Promise<Enquiry[]> {
  const db = await getDb();
  const rows =
    status && status !== "all"
      ? await db<EnquiryRow[]>`
          SELECT * FROM enquiries WHERE status = ${status} ORDER BY created_at DESC
        `
      : await db<EnquiryRow[]>`
          SELECT * FROM enquiries ORDER BY created_at DESC
        `;
  return rows.map(toEnquiry);
}

export async function getEnquiryCounts(): Promise<{
  total: number;
  new: number;
  handled: number;
  archived: number;
}> {
  const db = await getDb();
  const [row] = await db<
    {
      total: number;
      new_count: number;
      handled: number;
      archived: number;
    }[]
  >`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE status = 'new')::int AS new_count,
      COUNT(*) FILTER (WHERE status = 'handled')::int AS handled,
      COUNT(*) FILTER (WHERE status = 'archived')::int AS archived
    FROM enquiries
  `;
  return {
    total: row?.total || 0,
    new: row?.new_count || 0,
    handled: row?.handled || 0,
    archived: row?.archived || 0,
  };
}

export async function updateEnquiryStatus(
  id: number,
  status: EnquiryStatus
): Promise<void> {
  const db = await getDb();
  await db`UPDATE enquiries SET status = ${status} WHERE id = ${id}`;
}

export async function deleteEnquiry(id: number): Promise<void> {
  const db = await getDb();
  await db`DELETE FROM enquiries WHERE id = ${id}`;
}
