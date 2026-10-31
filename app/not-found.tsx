import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-5 py-16">
      <div className="w-full max-w-xl text-center">
        <Link href="/" className="inline-flex items-center gap-3">
          <Image src="/images/logo.svg" alt="" width={46} height={46} />
          <span className="text-left leading-none">
            <strong className="block font-display text-xl font-semibold text-ink">
              Prime Sahara
            </strong>
            <span className="mt-1 block text-[0.62rem] font-extrabold uppercase tracking-[0.24em] text-clay">
              Properties
            </span>
          </span>
        </Link>
        <p className="mt-10 text-xs font-extrabold uppercase tracking-[0.24em] text-clay">
          404
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-ink sm:text-5xl">
          That page is not here
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-ink/60">
          The link may be out of date. Browse the current catalogue or contact us
          and we will point you in the right direction.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/properties" className="btn btn-primary">
            Browse properties
          </Link>
          <Link href="/contact" className="btn btn-outline">
            Contact us
          </Link>
        </div>
      </div>
    </main>
  );
}
