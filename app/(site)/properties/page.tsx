import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Icon } from "@/components/icon";
import { PropertyCard } from "@/components/property-card";
import { PropertyFilters } from "@/components/property-filters";
import { AREAS } from "@/lib/areas";
import { PROPERTY_TYPES } from "@/lib/defaults";
import { listProperties } from "@/lib/properties";
import { getSettings } from "@/lib/settings";
import type { PropertyFilters as Filters, Purpose } from "@/lib/types";

export const metadata: Metadata = {
  title: "Properties for sale and rent",
  description:
    "Browse properties for sale and rent in Kitengela, Lang'ata and Juja. Filter by location, type and bedrooms, then request a viewing.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function value(params: Record<string, string | string[] | undefined>, key: string) {
  const item = params[key];
  return Array.isArray(item) ? item[0] || "" : item || "";
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const settings = await getSettings();

  const purposeValue = value(params, "purpose");
  const purpose: Purpose | undefined =
    purposeValue === "sale" || purposeValue === "rent" ? purposeValue : undefined;
  const location = value(params, "location");
  const type = value(params, "type");
  const bedsValue = Number.parseInt(value(params, "beds"), 10);
  const beds = Number.isFinite(bedsValue) && bedsValue > 0 ? bedsValue : undefined;
  const q = value(params, "q");
  const sortValue = value(params, "sort");
  const sort: Filters["sort"] =
    sortValue === "newest" ||
    sortValue === "beds" ||
    sortValue === "title"
      ? sortValue
      : "featured";

  const filters: Filters = {
    purpose,
    location: AREAS.some((area) => area.name === location) ? location : undefined,
    type: PROPERTY_TYPES.includes(type as (typeof PROPERTY_TYPES)[number])
      ? type
      : undefined,
    beds,
    q: q || undefined,
    sort,
  };

  const properties = await listProperties(filters);
  const descriptor = [
    purpose === "sale" ? "for sale" : purpose === "rent" ? "for rent" : "",
    filters.location ? `in ${filters.location}` : "",
    filters.type ? `of type ${filters.type}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <section className="bg-ink py-14 text-cream sm:py-16">
        <div className="container-page">
          <p className="eyebrow eyebrow-light">The catalogue</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold sm:text-5xl">
            Properties for sale and rent
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-cream/65">
            Sale and rental listings are kept separate. Filter the catalogue,
            open a property, then request a viewing by WhatsApp or phone.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-xs font-bold uppercase tracking-[0.16em] text-cream/50">
            <span>{properties.length} matching listings</span>
            <span>Kitengela · Lang&apos;ata · Juja</span>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="container-page">
          <Suspense fallback={<div className="h-40 rounded-2xl bg-sand" />}>
            <PropertyFilters areas={AREAS} types={PROPERTY_TYPES} />
          </Suspense>

          <div className="mt-8 flex flex-col gap-2 border-b border-line pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-clay">
                Results
              </p>
              <h2 className="mt-1 text-2xl font-semibold">
                {properties.length} propert{properties.length === 1 ? "y" : "ies"}{" "}
                {descriptor}
              </h2>
            </div>
            <Link
              href="/properties"
              className="text-xs font-bold uppercase tracking-wider text-ink/50 hover:text-clay"
            >
              Clear all filters
            </Link>
          </div>

          {properties.length ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  settings={settings}
                />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-2xl border border-dashed border-line bg-white px-6 py-14 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sand text-ink/50">
                <Icon name="search" className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-2xl font-semibold">
                No properties match those filters
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-ink/60">
                Try a different area or property type, or clear the filters to
                see the full catalogue.
              </p>
              <Link href="/properties" className="btn btn-primary mt-6">
                View all properties
              </Link>
            </div>
          )}

          <div className="mt-12 flex flex-col gap-4 rounded-2xl bg-sand/70 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Not seeing the right fit?</h2>
              <p className="mt-1 text-sm text-ink/60">
                Tell us what you need and we will point you to the closest
                option.
              </p>
            </div>
            <Link href="/contact" className="btn btn-primary">
              Send an enquiry
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
