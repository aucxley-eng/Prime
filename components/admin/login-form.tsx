"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/actions/auth";

const initialState: LoginState = {};

export function LoginForm({ configured }: { configured: boolean }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="grid gap-4">
      <label className="block">
        <span className="field-label">Admin password</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="field-input"
          placeholder="Enter your password"
          disabled={!configured}
        />
      </label>

      {!configured ? (
        <p className="rounded-xl bg-clay/10 px-4 py-3 text-sm text-clay">
          Admin login is not configured. Set ADMIN_PASSWORD in the environment
          and restart the site.
        </p>
      ) : null}

      {state.error ? (
        <p role="alert" className="rounded-xl bg-clay/10 px-4 py-3 text-sm text-clay">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={pending || !configured}
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
