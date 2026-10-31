import Link from "next/link";
import { PropertyForm } from "@/components/admin/property-form";
import { Icon } from "@/components/icon";
import { getNextRef } from "@/lib/properties";

export default async function NewPropertyPage() {
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
        <h1 className="mt-3 text-3xl font-semibold">Add a property</h1>
        <p className="mt-2 text-sm text-ink/55">
          Create a listing, upload a cover image and publish when ready.
        </p>
      </div>
      <PropertyForm nextRef={await getNextRef()} />
    </div>
  );
}
