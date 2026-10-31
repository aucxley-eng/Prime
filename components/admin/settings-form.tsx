"use client";

import { useActionState } from "react";
import {
  saveSettingsAction,
  type SettingsFormState,
} from "@/actions/settings";
import { Icon } from "@/components/icon";
import type { SiteSettings } from "@/lib/types";

const initialState: SettingsFormState = {};

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction, pending] = useActionState(
    saveSettingsAction,
    initialState
  );

  return (
    <form action={formAction} className="grid gap-6">
      {state.error ? (
        <p role="alert" className="rounded-xl bg-clay/10 px-4 py-3 text-sm font-semibold text-clay">
          {state.error}
        </p>
      ) : null}

      <section className="admin-card">
        <h2 className="text-xl font-semibold">Phone numbers</h2>
        <p className="mt-1 text-xs text-ink/50">
          These update the header, footer, contact page and call buttons across
          the site.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="field-label">Primary label</span>
            <input
              name="phonePrimaryLabel"
              required
              defaultValue={settings.phonePrimaryLabel}
              className="field-input"
              placeholder="0722 744110"
            />
          </label>
          <label className="block">
            <span className="field-label">Primary tel link</span>
            <input
              name="phonePrimaryTel"
              required
              defaultValue={settings.phonePrimaryTel}
              className="field-input"
              placeholder="+254722744110"
            />
          </label>
          <label className="block">
            <span className="field-label">Alternative label</span>
            <input
              name="phoneSecondaryLabel"
              required
              defaultValue={settings.phoneSecondaryLabel}
              className="field-input"
              placeholder="0707 600069"
            />
          </label>
          <label className="block">
            <span className="field-label">Alternative tel link</span>
            <input
              name="phoneSecondaryTel"
              defaultValue={settings.phoneSecondaryTel}
              className="field-input"
              placeholder="+254707600069"
            />
          </label>
        </div>
      </section>

      <section className="admin-card">
        <h2 className="text-xl font-semibold">WhatsApp and social</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="field-label">WhatsApp number</span>
            <input
              name="whatsapp"
              required
              defaultValue={settings.whatsapp}
              className="field-input"
              placeholder="254722744110"
            />
            <span className="field-help">
              Digits only. A leading 0 is converted to 254.
            </span>
          </label>
          <label className="block">
            <span className="field-label">Facebook URL</span>
            <input
              name="facebookUrl"
              type="url"
              defaultValue={settings.facebookUrl}
              className="field-input"
              placeholder="https://www.facebook.com/..."
            />
            <span className="field-help">
              Replace the search URL with the exact page URL when known.
            </span>
          </label>
        </div>
      </section>

      <section className="admin-card">
        <h2 className="text-xl font-semibold">Viewing information</h2>
        <label className="mt-5 block">
          <span className="field-label">Viewing hours</span>
          <input
            name="hours"
            defaultValue={settings.hours}
            className="field-input"
            placeholder="Viewings by appointment. Call or WhatsApp to confirm a time."
          />
        </label>
        <label className="mt-4 block">
          <span className="field-label">Office note</span>
          <textarea
            name="officeNote"
            rows={4}
            defaultValue={settings.officeNote}
            className="field-textarea"
            placeholder="Viewings are arranged by appointment..."
          />
        </label>
      </section>

      <section className="admin-card bg-sand/40">
        <h2 className="text-xl font-semibold">Admin access</h2>
        <p className="mt-2 text-sm leading-6 text-ink/60">
          The admin password and session secret are environment variables, not
          database settings. Change them on the server and restart the app. Use a
          long, random password and secret in production.
        </p>
      </section>

      <div className="sticky bottom-4 z-20 flex justify-end rounded-2xl border border-line bg-white/95 p-4 shadow-lg backdrop-blur">
        <button type="submit" className="btn btn-primary" disabled={pending}>
          <Icon name="check" className="h-4 w-4" />
          {pending ? "Saving…" : "Save settings"}
        </button>
      </div>
    </form>
  );
}
