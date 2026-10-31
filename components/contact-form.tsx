"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "@/components/icon";
import { AREAS } from "@/lib/areas";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");
  const [fallback, setFallback] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const interest = String(data.get("interest") || "").trim();
    const location = String(data.get("location") || "").trim();
    const note = String(data.get("message") || "").trim();

    const details = [
      interest ? `Interest: ${interest}` : "",
      location ? `Preferred area: ${location}` : "",
      note,
    ].filter(Boolean);

    setStatus("loading");
    setMessage("");
    setFallback(null);

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          message: details.join("\n"),
          website: String(data.get("website") || ""),
        }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        whatsappUrl?: string;
        error?: string;
      };

      if (!response.ok || !payload.ok || !payload.whatsappUrl) {
        throw new Error(payload.error || "Your enquiry could not be sent.");
      }

      setStatus("success");
      setMessage(
        "Enquiry saved. Opening WhatsApp — send the message to complete your request."
      );
      setFallback(payload.whatsappUrl);
      const opened = window.open(
        payload.whatsappUrl,
        "_blank",
        "noopener,noreferrer"
      );
      if (opened) opened.focus();
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Your enquiry could not be sent. Please call or WhatsApp us."
      );
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="field-label">Your name</span>
          <input
            name="name"
            required
            autoComplete="name"
            className="field-input"
            placeholder="Full name"
          />
        </label>
        <label className="block">
          <span className="field-label">Phone number</span>
          <input
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            className="field-input"
            placeholder="07xx xxx xxx"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="field-label">I am interested in</span>
          <select name="interest" className="field-select" defaultValue="">
            <option value="">Choose one</option>
            <option value="Buying a property">Buying a property</option>
            <option value="Renting a property">Renting a property</option>
            <option value="Investing in property">Investing in property</option>
            <option value="General enquiry">General enquiry</option>
          </select>
        </label>
        <label className="block">
          <span className="field-label">Preferred area</span>
          <select name="location" className="field-select" defaultValue="">
            <option value="">Any area</option>
            {AREAS.map((area) => (
              <option key={area.name} value={area.name}>
                {area.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className="field-label">Tell us what you need</span>
        <textarea
          name="message"
          rows={5}
          className="field-textarea"
          placeholder="Budget, bedrooms, timing, or anything else that helps us advise you."
        />
      </label>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={status === "loading"}
      >
        <Icon name="whatsapp" className="h-4 w-4" />
        {status === "loading" ? "Sending…" : "Send enquiry"}
      </button>

      <p className="text-xs leading-relaxed text-ink/50">
        Your enquiry is saved for the team and WhatsApp opens with the message
        ready to send. Nothing is sent until you press send in WhatsApp.
      </p>

      {message ? (
        <p
          role="status"
          className={`rounded-xl px-4 py-3 text-sm ${
            status === "error"
              ? "bg-clay/10 text-clay"
              : "bg-ink/5 text-ink/70"
          }`}
        >
          {message}
          {fallback ? (
            <>
              {" "}
              <a
                className="font-bold underline"
                href={fallback}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open WhatsApp
              </a>
            </>
          ) : null}
        </p>
      ) : null}
    </form>
  );
}
