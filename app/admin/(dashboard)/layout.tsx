import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAction } from "@/actions/auth";
import { AdminNav } from "@/components/admin/admin-nav";
import { Icon } from "@/components/icon";
import { isAdmin } from "@/lib/auth";
import { getEnquiryCounts } from "@/lib/enquiries";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  if (!(await isAdmin())) redirect("/admin/login");
  const counts = await getEnquiryCounts();

  return (
    <div className="min-h-screen bg-sand/40 lg:pl-72">
      <aside className="border-b border-line bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:w-72 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link href="/admin" className="flex items-center gap-3">
            <Image src="/images/logo.svg" alt="" width={38} height={38} />
            <span className="leading-none">
              <strong className="block font-display text-lg font-semibold">
                Prime Sahara
              </strong>
              <span className="mt-1 block text-[0.58rem] font-extrabold uppercase tracking-[0.22em] text-clay">
                Content manager
              </span>
            </span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink/50 hover:border-ink hover:text-ink lg:hidden"
            aria-label="View website"
          >
            <Icon name="eye" className="h-4 w-4" />
          </Link>
        </div>

        <div className="px-3 pb-4 sm:px-4">
          <AdminNav newEnquiries={counts.new} />
          <form action={logoutAction} className="mt-3 lg:hidden">
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-xl px-3.5 py-2.5 text-left text-sm font-bold text-ink/55 hover:bg-clay/10 hover:text-clay"
            >
              <Icon name="logout" className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>

        <div className="hidden border-t border-line p-4 lg:block">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-bold text-ink/55 hover:bg-sand hover:text-ink"
          >
            <Icon name="eye" className="h-4 w-4" />
            View website
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="mt-1 flex w-full items-center gap-2 rounded-xl px-3.5 py-2.5 text-left text-sm font-bold text-ink/55 hover:bg-clay/10 hover:text-clay"
            >
              <Icon name="logout" className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10">{children}</main>
    </div>
  );
}
