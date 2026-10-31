import { NextResponse, type NextRequest } from "next/server";
import { createEnquiry } from "@/lib/enquiries";
import { getPropertyById } from "@/lib/properties";
import { getSettings } from "@/lib/settings";
import {
  generalEnquiryMessage,
  propertyEnquiryMessage,
  whatsappUrl,
} from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

const hits = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 12;

function rateLimited(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || entry.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > LIMIT;
}

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many enquiries. Please call or WhatsApp us directly." },
      { status: 429 }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const data =
    payload && typeof payload === "object"
      ? (payload as Record<string, unknown>)
      : {};

  if (clean(data.website, 200)) {
    return NextResponse.json({
      ok: true,
      whatsappUrl: whatsappUrl(generalEnquiryMessage(), await getSettings()),
    });
  }

  const name = clean(data.name, 100);
  const phone = clean(data.phone, 30);
  const message = clean(data.message, 2000);
  const propertyId = clean(data.propertyId, 100);

  if (name.length < 2) {
    return NextResponse.json({ error: "Enter your name." }, { status: 400 });
  }
  if (phone.replace(/\D/g, "").length < 7) {
    return NextResponse.json(
      { error: "Enter a valid phone number." },
      { status: 400 }
    );
  }

  const property = propertyId ? await getPropertyById(propertyId) : null;
  if (propertyId && (!property || property.status !== "published")) {
    return NextResponse.json(
      { error: "That property is no longer available." },
      { status: 404 }
    );
  }

  try {
    await createEnquiry({
      propertyId: property?.id || null,
      propertyRef: property?.ref || null,
      propertyTitle: property?.title || null,
      name,
      phone,
      message,
      source: property ? "property" : "contact",
    });
  } catch {
    return NextResponse.json(
      { error: "Your enquiry could not be saved. Please call or WhatsApp us." },
      { status: 500 }
    );
  }

  const settings = await getSettings();
  const base = property
    ? propertyEnquiryMessage(property, name)
    : generalEnquiryMessage(name);
  const fullMessage = message
    ? `${base}\n\nAdditional details: ${message}`
    : base;

  return NextResponse.json({ ok: true, whatsappUrl: whatsappUrl(fullMessage, settings) });
}
