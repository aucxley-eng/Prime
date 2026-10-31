"use server";

import { redirect } from "next/navigation";
import {
  checkPassword,
  clearAdminSession,
  isAdminConfigured,
  setAdminSession,
} from "@/lib/auth";
import { text } from "@/lib/form";

export interface LoginState {
  error?: string;
}

export async function loginAction(
  _previous: LoginState,
  formData: FormData
): Promise<LoginState> {
  if (!isAdminConfigured()) {
    return {
      error:
        "Admin login is not configured. Set ADMIN_PASSWORD in the environment.",
    };
  }

  const password = text(formData, "password");
  if (!password) return { error: "Enter the admin password." };
  if (!checkPassword(password)) return { error: "Incorrect password." };

  await setAdminSession();
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await clearAdminSession();
  redirect("/admin/login");
}
