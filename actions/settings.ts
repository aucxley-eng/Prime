"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { text } from "@/lib/form";
import { saveSettings } from "@/lib/settings";
import type { SiteSettings } from "@/lib/types";

export interface SettingsFormState {
  error?: string;
}

function normalizeTel(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("0")) return `+254${digits.slice(1)}`;
  if (digits.startsWith("254")) return `+${digits}`;
  return `+${digits}`;
}

function normalizeWhatsapp(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("0")) return `254${digits.slice(1)}`;
  return digits;
}

export async function saveSettingsAction(
  _previous: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  if (!(await isAdmin())) {
    return { error: "Your session has expired. Sign in again and retry." };
  }

  const phonePrimaryTel = normalizeTel(text(formData, "phonePrimaryTel"));
  const phoneSecondaryTel = normalizeTel(text(formData, "phoneSecondaryTel"));
  const whatsapp = normalizeWhatsapp(text(formData, "whatsapp"));
  const facebookUrl = text(formData, "facebookUrl");

  if (!phonePrimaryTel || phonePrimaryTel.length < 10) {
    return { error: "Enter a valid primary phone number." };
  }
  if (!whatsapp || whatsapp.length < 10) {
    return { error: "Enter a valid WhatsApp number." };
  }
  if (facebookUrl && !/^https?:\/\//i.test(facebookUrl)) {
    return { error: "The Facebook URL must start with http:// or https://." };
  }

  const input: SiteSettings = {
    phonePrimaryLabel: text(formData, "phonePrimaryLabel"),
    phonePrimaryTel,
    phoneSecondaryLabel: text(formData, "phoneSecondaryLabel"),
    phoneSecondaryTel,
    whatsapp,
    facebookUrl,
    officeNote: text(formData, "officeNote"),
    hours: text(formData, "hours"),
  };

  if (!input.phonePrimaryLabel || !input.phoneSecondaryLabel) {
    return { error: "Both phone labels are required." };
  }

  try {
    saveSettings(input);
  } catch {
    return { error: "Settings could not be saved. Try again." };
  }

  revalidatePath("/", "layout");
  redirect("/admin/settings?saved=1");
}
