import Link from "next/link";
import {
  deleteEnquiryAction,
  setEnquiryStatusAction,
} from "@/actions/enquiries";
import { ConfirmActionForm } from "@/components/admin/confirm-action-form";
import { Icon } from "@/components/icon";
import { getEnquiryCounts, listEnquiries } from "@/lib/enquiries";
import { formatDate } from "@/lib/format";
import type { EnquiryStatus } from "@/lib/types";

const filters: Array<{ value: EnquiryStatus | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "handled", label: "Handled" },
  { value: "archived", label: "Archived" },
];

export default async function AdminEnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const requested = typeof params.status === "string" ? params.status : "all";
  const status: EnquiryStatus | "all" =
    requested === "new" || requested === "handled" || requested === "archived"
      ? requested
      : "all";
  const enquiries = await listEnquiries(status);
  const counts = await getEnquiryCounts();

  return (
    <div className="mx-auto max-w-5xl">
      <div>
        <p className="eyebrow">Inbox</p>
        <h1 className="mt-1 text-3xl font-semibold">Enquiries</h1>
        <p className="mt-2 text-sm text-ink/55">
          {counts.total} saved enquir{counts.total === 1 ? "y" : "ies"} ·{" "}
          {counts.new} new. Enquiries are also sent to WhatsApp when the visitor
          continues there.
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {filters.map((filter) => {
          const active = status === filter.value;
          const count =
            filter.value === "all"
              ? counts.total
              : counts[filter.value as EnquiryStatus];
          return (
            <Link
              key={filter.value}
              href={
                filter.value === "all"
                  ? "/admin/enquiries"
                  : `/admin/enquiries?status=${filter.value}`
              }
              className={`rounded-full border px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider transition ${
                active
                  ? "border-ink bg-ink text-cream"
                  : "border-line bg-white text-ink/55 hover:border-ink hover:text-ink"
              }`}
            >
              {filter.label} ({count})
            </Link>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4">
        {enquiries.map((enquiry) => (
          <article key={enquiry.id} className="admin-card">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold">{enquiry.name}</h2>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[0.62rem] font-extrabold uppercase tracking-wider ${
                      enquiry.status === "new"
                        ? "bg-gold/20 text-clay"
                        : enquiry.status === "handled"
                          ? "bg-ink/10 text-ink/60"
                          : "bg-ink/5 text-ink/35"
                    }`}
                  >
                    {enquiry.status}
                  </span>
                  <span className="rounded-full bg-sand px-2 py-0.5 text-[0.62rem] font-extrabold uppercase tracking-wider text-ink/45">
                    {enquiry.source}
                  </span>
                </div>
                <p className="mt-1 text-xs text-ink/45">
                  {formatDate(enquiry.createdAt)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href={`tel:${enquiry.phone}`}
                  className="btn btn-outline btn-sm"
                >
                  <Icon name="phone" className="h-4 w-4" />
                  Call
                </a>
                <a
                  href={`https://wa.me/${enquiry.phone.replace(/\D/g, "").replace(/^0/, "254")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm bg-[#25d366] text-ink hover:bg-[#20bd5a]"
                >
                  <Icon name="whatsapp" className="h-4 w-4" />
                  WhatsApp
                </a>
              </div>
            </div>

            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-[0.62rem] font-extrabold uppercase tracking-wider text-ink/40">
                  Phone
                </dt>
                <dd className="mt-0.5 font-bold">{enquiry.phone}</dd>
              </div>
              <div>
                <dt className="text-[0.62rem] font-extrabold uppercase tracking-wider text-ink/40">
                  Property
                </dt>
                <dd className="mt-0.5">
                  {enquiry.propertyRef ? (
                    <span>
                      {enquiry.propertyRef}
                      {enquiry.propertyTitle
                        ? ` · ${enquiry.propertyTitle}`
                        : ""}
                    </span>
                  ) : (
                    <span className="text-ink/45">General enquiry</span>
                  )}
                </dd>
              </div>
            </dl>

            <p className="mt-4 whitespace-pre-line rounded-xl bg-sand/60 p-4 text-sm leading-6 text-ink/70">
              {enquiry.message}
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
              <div className="flex flex-wrap gap-2">
                {enquiry.status !== "handled" ? (
                  <form action={setEnquiryStatusAction}>
                    <input type="hidden" name="id" value={enquiry.id} />
                    <input type="hidden" name="status" value="handled" />
                    <button type="submit" className="btn btn-outline btn-sm">
                      <Icon name="check" className="h-4 w-4" />
                      Mark handled
                    </button>
                  </form>
                ) : null}
                {enquiry.status !== "new" ? (
                  <form action={setEnquiryStatusAction}>
                    <input type="hidden" name="id" value={enquiry.id} />
                    <input type="hidden" name="status" value="new" />
                    <button type="submit" className="btn btn-outline btn-sm">
                      Mark new
                    </button>
                  </form>
                ) : null}
                {enquiry.status !== "archived" ? (
                  <form action={setEnquiryStatusAction}>
                    <input type="hidden" name="id" value={enquiry.id} />
                    <input type="hidden" name="status" value="archived" />
                    <button type="submit" className="btn btn-outline btn-sm">
                      Archive
                    </button>
                  </form>
                ) : null}
              </div>
              <ConfirmActionForm
                action={deleteEnquiryAction}
                fields={{ id: enquiry.id }}
                confirmMessage={`Delete the enquiry from ${enquiry.name}? This cannot be undone.`}
              >
                <button
                  type="submit"
                  className="btn btn-sm text-clay hover:bg-clay/10"
                >
                  <Icon name="trash" className="h-4 w-4" />
                  Delete
                </button>
              </ConfirmActionForm>
            </div>
          </article>
        ))}

        {!enquiries.length ? (
          <div className="admin-card py-14 text-center">
            <p className="font-display text-2xl font-semibold">
              No enquiries here
            </p>
            <p className="mt-2 text-sm text-ink/45">
              New website enquiries will appear in this inbox.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
