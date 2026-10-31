"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { AREAS } from "@/lib/areas";
import { PROPERTY_TYPES } from "@/lib/defaults";

export function SearchForm() {
  const router = useRouter();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    for (const key of ["purpose", "location", "type"]) {
      const value = String(data.get(key) || "").trim();
      if (value) params.set(key, value);
    }

    router.push(`/properties${params.size ? `?${params.toString()}` : ""}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-3 rounded-3xl bg-cream p-4 shadow-2xl shadow-ink/20 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]"
    >
      <label className="block">
        <span className="sr-only">Buy or rent</span>
        <select name="purpose" className="field-select">
          <option value="">Buy or rent</option>
          <option value="sale">For sale</option>
          <option value="rent">For rent</option>
        </select>
      </label>
      <label className="block">
        <span className="sr-only">Location</span>
        <select name="location" className="field-select">
          <option value="">All locations</option>
          {AREAS.map((area) => (
            <option key={area.name} value={area.name}>
              {area.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="sr-only">Property type</span>
        <select name="type" className="field-select">
          <option value="">All property types</option>
          {PROPERTY_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" className="btn btn-primary lg:px-8">
        Search
      </button>
    </form>
  );
}
