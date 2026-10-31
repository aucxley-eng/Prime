"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition, type FormEvent } from "react";
import { Icon } from "@/components/icon";
import type { Area } from "@/lib/types";

export function PropertyFilters({
  areas,
  types,
}: {
  areas: Area[];
  types: readonly string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const purpose = searchParams.get("purpose") || "";
  const location = searchParams.get("location") || "";
  const type = searchParams.get("type") || "";
  const beds = searchParams.get("beds") || "";
  const sort = searchParams.get("sort") || "featured";

  function navigate(next: URLSearchParams) {
    const value = next.toString();
    startTransition(() => {
      router.push(value ? `${pathname}?${value}` : pathname, { scroll: false });
    });
  }

  function update(key: string, value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    navigate(next);
  }

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get("q");
    update("q", typeof value === "string" ? value.trim() : "");
  }

  function reset() {
    navigate(new URLSearchParams());
  }

  return (
    <div className={pending ? "opacity-70 transition" : "transition"}>
      <div className="flex flex-wrap items-center gap-2">
        {[
          { value: "", label: "All properties" },
          { value: "sale", label: "For sale" },
          { value: "rent", label: "For rent" },
        ].map((tab) => (
          <button
            key={tab.value}
            type="button"
            aria-pressed={purpose === tab.value}
            onClick={() => update("purpose", tab.value)}
            className={`rounded-full px-4 py-2 text-sm font-extrabold transition ${
              purpose === tab.value
                ? "bg-ink text-cream"
                : "border border-line bg-white text-ink/70 hover:border-ink/40"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form
        onSubmit={onSearch}
        className="mt-5 grid gap-3 rounded-2xl border border-line bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_0.8fr_1fr_auto]"
      >
        <label className="relative block">
          <span className="sr-only">Search properties</span>
          <Icon
            name="search"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35"
          />
          <input
            key={searchParams.get("q") || ""}
            name="q"
            type="search"
            defaultValue={searchParams.get("q") || ""}
            className="field-input pl-9"
            placeholder="Search title, area or ref"
          />
        </label>

        <label className="block">
          <span className="sr-only">Location</span>
          <select
            value={location}
            onChange={(event) => update("location", event.target.value)}
            className="field-select"
          >
            <option value="">All locations</option>
            {areas.map((area) => (
              <option key={area.name} value={area.name}>
                {area.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="sr-only">Property type</span>
          <select
            value={type}
            onChange={(event) => update("type", event.target.value)}
            className="field-select"
          >
            <option value="">All types</option>
            {types.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="sr-only">Minimum bedrooms</span>
          <select
            value={beds}
            onChange={(event) => update("beds", event.target.value)}
            className="field-select"
          >
            <option value="">Beds</option>
            {[1, 2, 3, 4, 5].map((value) => (
              <option key={value} value={value}>
                {value}+ beds
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="sr-only">Sort results</span>
          <select
            value={sort}
            onChange={(event) => update("sort", event.target.value)}
            className="field-select"
          >
            <option value="featured">Featured first</option>
            <option value="newest">Newest first</option>
            <option value="beds">Most bedrooms</option>
            <option value="title">Title A–Z</option>
          </select>
        </label>

        <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
          <button type="submit" className="btn btn-primary flex-1">
            Search
          </button>
          <button
            type="button"
            onClick={reset}
            className="btn btn-outline px-4"
            aria-label="Clear filters"
            title="Clear filters"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
