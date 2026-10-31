import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { isAdmin, isAdminConfigured } from "@/lib/auth";

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <main className="grid min-h-screen bg-sand/60 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-ink p-12 text-cream lg:flex lg:flex-col lg:justify-between">
        <Image
          src="/images/house-6.jpg"
          alt=""
          fill
          sizes="50vw"
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/80 to-ink" />
        <Link href="/" className="relative flex items-center gap-3">
          <Image src="/images/logo.svg" alt="" width={46} height={46} />
          <span className="leading-none">
            <strong className="block font-display text-xl font-semibold">
              Prime Sahara
            </strong>
            <span className="mt-1 block text-[0.62rem] font-extrabold uppercase tracking-[0.24em] text-gold-2">
              Properties
            </span>
          </span>
        </Link>
        <div className="relative max-w-md">
          <p className="eyebrow eyebrow-light">Content manager</p>
          <h1 className="mt-3 text-4xl font-semibold">
            Manage listings and enquiries in one place.
          </h1>
          <p className="mt-4 text-sm leading-7 text-cream/60">
            Add properties, upload photographs, update contact details and
            review the enquiries the site has received.
          </p>
        </div>
        <p className="relative text-xs text-cream/40">
          Authorised access only. Sessions expire after seven days.
        </p>
      </div>

      <div className="flex items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-md rounded-3xl border border-line bg-white p-6 shadow-xl shadow-ink/5 sm:p-8">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-3 lg:hidden"
          >
            <Image src="/images/logo.svg" alt="" width={40} height={40} />
            <span className="leading-none">
              <strong className="block font-display text-lg font-semibold">
                Prime Sahara
              </strong>
              <span className="mt-1 block text-[0.58rem] font-extrabold uppercase tracking-[0.22em] text-clay">
                Properties
              </span>
            </span>
          </Link>
          <p className="eyebrow">Admin</p>
          <h2 className="mt-2 text-3xl font-semibold">Sign in</h2>
          <p className="mt-2 text-sm leading-7 text-ink/60">
            Enter the admin password to manage the catalogue.
          </p>
          <div className="mt-6">
            <LoginForm configured={isAdminConfigured()} />
          </div>
          <Link
            href="/"
            className="mt-6 inline-flex text-xs font-bold uppercase tracking-wider text-ink/45 hover:text-clay"
          >
            Back to website
          </Link>
        </div>
      </div>
    </main>
  );
}
