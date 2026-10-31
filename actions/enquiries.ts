"use server";

import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth";
import { deleteEnquiry, updateEnquiryStatus } from "@/lib/enquiries";
import { text } from "@/lib/form";
import type { EnquiryStatus } from "@/lib/types";

export async function setEnquiryStatusAction(formData: FormData): Promise<void> {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  const id = Number.parseInt(text(formData, "id"), 10);
  const status = text(formData, "status");
  if (!Number.isFinite(id)) return;
  if (status !== "new" && status !== "handled" && status !== "archived") return;
  await updateEnquiryStatus(id, status as EnquiryStatus);
  revalidatePath("/admin");
  revalidatePath("/admin/enquiries");
}

export async function deleteEnquiryAction(formData: FormData): Promise<void> {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  const id = Number.parseInt(text(formData, "id"), 10);
  if (!Number.isFinite(id)) return;
  await deleteEnquiry(id);
  revalidatePath("/admin");
  revalidatePath("/admin/enquiries");
}
