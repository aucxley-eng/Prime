import Link from "next/link";
import { Icon } from "@/components/icon";
import { listEnquiries } from "@/lib/enquiries";
import { formatDate } from "@/lib/format";
import { getPropertyCounts, listProperties } from "@/lib/properties";

export default function AdminOverviewPage() {
  const counts = getPropertyCounts();
  const enquiries = listEnquiries();
  const newEnquiries = enquiries.filter((item) => item.status === "new").length;
  const recentProperties = listProperties({
    includeDrafts: true,
    sort: "newest",
  }).slice(0, 5);

  const stats = [
    { label: "Total properties", value: counts.total, href: "/admin/properties" },
    { label: "Published", value: counts.published, href: "/admin/properties" },
    { label: "For sale / rent", value: `${counts.sale} / ${counts.rent}`, href: "/admin/properties" },
    { label: "New enquiries", value: newEnquiries, href: "/admin/enquiries" },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Overview</p>
          <h1 className="mt-1 text-3xl font-semibold">Content manager</h1>
          <p className="mt-2 text-sm text-ink/55">
            Manage the property catalogue, enquiries and contact details.
          </p>
        </div>
        <Link href="/admin/properties/new" className="btn btn-primary">
          <Icon name="plus" className="h-4 w-4" />
          Add property
        </Link>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="admin-card transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-xs font-extrabold uppercase tracking-wider text-ink/40">
              {stat.label}
            </p>
            <p className="mt-2 font-display text-3xl font-semibold">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section className="admin-card">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Recent enquiries</h2>
            <Link
              href="/admin/enquiries"
              className="text-xs font-extrabold uppercase tracking-wider text-clay hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="mt-4 divide-y divide-line">
            {enquiries.slice(0, 5).map((enquiry) => (
              <div key={enquiry.id} className="flex items-start justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">
                    {enquiry.name}{" "}
                    <span className="font-normal text-ink/45">
                      · {enquiry.phone}
                    </span>
                  </p>
                  <p className="mt-1 truncate text-xs text-ink/55">
                    {enquiry.propertyTitle || "General enquiry"}
                  </p>
                  <p className="mt-1 text-[0.68rem] text-ink/40">
                    {formatDate(enquiry.createdAt)}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[0.62rem] font-extrabold uppercase tracking-wider ${
                    enquiry.status === "new"
                      ? "bg-gold/20 text-clay"
                      : enquiry.status === "handled"
                        ? "bg-ink/10 text-ink/60"
                        : "bg-ink/5 text-ink/35"
                  }`}
                >
                  {enquiry.status}
                </span>
              </div>
            ))}
            {!enquiries.length ? (
              <p className="py-8 text-center text-sm text-ink/45">
                No enquiries yet.
              </p>
            ) : null}
          </div>
        </section>

        <section className="admin-card">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Latest properties</h2>
            <Link
              href="/admin/properties"
              className="text-xs font-extrabold uppercase tracking-wider text-clay hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="mt-4 divide-y divide-line">
            {recentProperties.map((property) => (
              <Link
                key={property.id}
                href={`/admin/properties/${property.id}`}
                className="flex items-center justify-between gap-4 py-3 hover:text-clay"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{property.title}</p>
                  <p className="mt-1 text-xs text-ink/50">
                    {property.ref} · {property.location} · {property.purpose}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[0.62rem] font-extrabold uppercase tracking-wider ${
                    property.status === "published"
                      ? "bg-[#25d366]/15 text-[#128c4b]"
                      : "bg-ink/5 text-ink/40"
                  }`}
                >
                  {property.status}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
