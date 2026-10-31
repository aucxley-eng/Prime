import Image from "next/image";
import Link from "next/link";
import { deletePropertyAction } from "@/actions/properties";
import { ConfirmActionForm } from "@/components/admin/confirm-action-form";
import { Icon } from "@/components/icon";
import { formatDay } from "@/lib/format";
import { listProperties } from "@/lib/properties";

export default async function AdminPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const saved = params.saved === "1";
  const deleted = params.deleted === "1";
  const properties = await listProperties({ includeDrafts: true, sort: "newest" });

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Catalogue</p>
          <h1 className="mt-1 text-3xl font-semibold">Properties</h1>
          <p className="mt-2 text-sm text-ink/55">
            {properties.length} propert{properties.length === 1 ? "y" : "ies"} in
            the database, including drafts.
          </p>
        </div>
        <Link href="/admin/properties/new" className="btn btn-primary">
          <Icon name="plus" className="h-4 w-4" />
          Add property
        </Link>
      </div>

      {saved || deleted ? (
        <p className="mt-5 rounded-xl bg-[#25d366]/15 px-4 py-3 text-sm font-semibold text-[#128c4b]">
          {saved ? "Property saved." : "Property deleted."}
        </p>
      ) : null}

      <div className="admin-card mt-6 overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-line bg-sand/50 text-[0.65rem] uppercase tracking-wider text-ink/45">
              <tr>
                <th className="px-4 py-3 font-extrabold">Property</th>
                <th className="px-4 py-3 font-extrabold">Purpose</th>
                <th className="px-4 py-3 font-extrabold">Location</th>
                <th className="px-4 py-3 font-extrabold">Status</th>
                <th className="px-4 py-3 font-extrabold">Updated</th>
                <th className="px-4 py-3 text-right font-extrabold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {properties.map((property) => (
                <tr key={property.id} className="align-middle">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-sand">
                        <Image
                          src={property.image}
                          alt=""
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/admin/properties/${property.id}`}
                          className="line-clamp-1 font-bold hover:text-clay"
                        >
                          {property.title}
                        </Link>
                        <p className="mt-0.5 text-xs text-ink/45">
                          {property.ref} · {property.type}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize text-ink/60">
                    {property.purpose}
                  </td>
                  <td className="px-4 py-3 text-ink/60">{property.location}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[0.62rem] font-extrabold uppercase tracking-wider ${
                        property.status === "published"
                          ? "bg-[#25d366]/15 text-[#128c4b]"
                          : "bg-ink/5 text-ink/40"
                      }`}
                    >
                      {property.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-ink/50">
                    {formatDay(property.updatedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {property.status === "published" ? (
                        <Link
                          href={`/property/${property.slug}`}
                          target="_blank"
                          className="flex h-8 w-8 items-center justify-center rounded-full text-ink/45 hover:bg-sand hover:text-ink"
                          aria-label={`View ${property.title}`}
                        >
                          <Icon name="eye" className="h-4 w-4" />
                        </Link>
                      ) : null}
                      <Link
                        href={`/admin/properties/${property.id}`}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-ink/45 hover:bg-sand hover:text-ink"
                        aria-label={`Edit ${property.title}`}
                      >
                        <Icon name="settings" className="h-4 w-4" />
                      </Link>
                      <ConfirmActionForm
                        action={deletePropertyAction}
                        fields={{ id: property.id }}
                        confirmMessage={`Delete ${property.title}? This cannot be undone.`}
                      >
                        <button
                          type="submit"
                          className="flex h-8 w-8 items-center justify-center rounded-full text-ink/45 hover:bg-clay/10 hover:text-clay"
                          aria-label={`Delete ${property.title}`}
                        >
                          <Icon name="trash" className="h-4 w-4" />
                        </button>
                      </ConfirmActionForm>
                    </div>
                  </td>
                </tr>
              ))}
              {!properties.length ? (
                <tr>
                  <td colSpan={6} className="px-4 py-14 text-center text-ink/45">
                    No properties yet. Add the first listing.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
