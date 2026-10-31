import Link from "next/link";
import { notFound } from "next/navigation";
import { deletePropertyAction } from "@/actions/properties";
import { ConfirmActionForm } from "@/components/admin/confirm-action-form";
import { PropertyForm } from "@/components/admin/property-form";
import { Icon } from "@/components/icon";
import { getNextRef, getPropertyById } from "@/lib/properties";

export default async function EditPropertyPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const property = getPropertyById(id);
  if (!property) notFound();

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <Link
          href="/admin/properties"
          className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-ink/45 hover:text-clay"
        >
          <Icon name="arrow" className="h-4 w-4 rotate-180" />
          Back to properties
        </Link>
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Edit property</h1>
            <p className="mt-2 text-sm text-ink/55">
              {property.ref} · {property.title}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {property.status === "published" ? (
              <Link
                href={`/property/${property.slug}`}
                target="_blank"
                className="btn btn-outline btn-sm"
              >
                <Icon name="eye" className="h-4 w-4" />
                View public page
              </Link>
            ) : null}
            <ConfirmActionForm
              action={deletePropertyAction}
              fields={{ id: property.id }}
              confirmMessage={`Delete ${property.title}? This cannot be undone.`}
            >
              <button type="submit" className="btn btn-sm border border-clay/30 text-clay hover:bg-clay/10">
                <Icon name="trash" className="h-4 w-4" />
                Delete
              </button>
            </ConfirmActionForm>
          </div>
        </div>
      </div>

      {query.saved === "1" ? (
        <p className="mb-5 rounded-xl bg-[#25d366]/15 px-4 py-3 text-sm font-semibold text-[#128c4b]">
          Property saved.
        </p>
      ) : null}

      <PropertyForm property={property} nextRef={getNextRef()} />
    </div>
  );
}
