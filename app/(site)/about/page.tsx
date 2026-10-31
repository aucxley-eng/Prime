import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { AREAS } from "@/lib/areas";
import { getPropertyCounts } from "@/lib/properties";
import { getSettings } from "@/lib/settings";
import {
  generalEnquiryMessage,
  telHref,
  whatsappUrl,
} from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "About",
  description:
    "Prime Sahara Properties helps buyers, renters and investors find homes and property in Kitengela, Lang'ata and Juja.",
};

export default async function AboutPage() {
  const settings = await getSettings();
  const counts = await getPropertyCounts();
  const whatsapp = whatsappUrl(generalEnquiryMessage(), settings);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink py-16 text-cream sm:py-20">
        <Image
          src="/images/house-6.jpg"
          alt="Illustrative photograph of a home"
          fill
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/40" />
        <div className="container-page relative">
          <p className="eyebrow eyebrow-light">About Prime Sahara</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
            A straightforward way to look for property
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-cream/70">
            Prime Sahara Properties brings homes and investment property in
            Kitengela, Lang&apos;ata and Juja into one catalogue, with viewings
            arranged directly by phone or WhatsApp.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-sand">
            <Image
              src="/images/house-8.jpg"
              alt="Illustrative photograph of a family home"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="eyebrow">Our approach</p>
            <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">
              Small enough to know the property. Organised enough to help you
              move.
            </h2>
            <p className="mt-4 text-sm leading-7 text-ink/65">
              Prime Sahara Properties advertises homes and investment property
              through social posts and direct conversations, with enquiries
              handled on phone and WhatsApp. This site brings that catalogue
              into one place so you can compare what is available before you
              call.
            </p>
            <p className="mt-3 text-sm leading-7 text-ink/65">
              Sale and rental listings are kept separate, the location is clear
              on every listing, and each property has a viewing request. If a
              property is not the right fit, tell us what you are looking for
              and we will point you to the closest option.
            </p>
            <div className="mt-7 grid grid-cols-2 gap-3">
              {[
                { value: "3", label: "Focus areas" },
                { value: "2", label: "Phone lines" },
                { value: String(counts.sale), label: "Starter sale listings" },
                { value: String(counts.rent), label: "Starter rentals" },
              ].map((fact) => (
                <div
                  key={fact.label}
                  className="rounded-xl border border-line bg-white p-4"
                >
                  <strong className="font-display text-2xl font-semibold">
                    {fact.value}
                  </strong>
                  <span className="mt-1 block text-xs font-semibold text-ink/50">
                    {fact.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-sand/60 py-16 sm:py-20">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="eyebrow">What guides us</p>
            <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">
              Clear information, direct contact, a viewing first
            </h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: "pin" as const,
                title: "Local focus",
                text: "The catalogue stays with Kitengela, Lang'ata and Juja rather than listing property everywhere.",
              },
              {
                icon: "phone" as const,
                title: "Direct contact",
                text: "Enquiries go to the team by phone or WhatsApp, with the property reference included.",
              },
              {
                icon: "home" as const,
                title: "Viewing first",
                text: "We encourage a viewing before you commit to a home or an investment.",
              },
              {
                icon: "check" as const,
                title: "Clear next steps",
                text: "Price, availability and documents are confirmed in the conversation.",
              },
            ].map((value) => (
              <article
                key={value.title}
                className="rounded-2xl border border-line bg-white p-5 shadow-sm"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/20 text-clay">
                  <Icon name={value.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{value.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink/60">{value.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-page">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Where we work</p>
              <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">
                Kitengela, Lang&apos;ata and Juja
              </h2>
            </div>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 text-sm font-extrabold text-ink hover:text-clay"
            >
              Browse the catalogue
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
            {AREAS.map((area) => (
              <Link
                key={area.name}
                href={`/properties?location=${encodeURIComponent(area.name)}`}
                className="group relative isolate aspect-[4/3] overflow-hidden rounded-2xl bg-ink"
              >
                <Image
                  src={area.image}
                  alt={`Illustrative photograph of property in ${area.name}`}
                  fill
                  sizes="(max-width: 767px) 50vw, 33vw"
                  className="object-cover opacity-65 transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3 text-cream sm:p-5">
                  <span className="text-[0.5rem] font-extrabold uppercase tracking-[0.16em] text-gold-2 sm:text-[0.65rem] sm:tracking-[0.2em]">
                    {area.county}
                  </span>
                  <h3 className="mt-1 text-base font-semibold sm:text-2xl">{area.name}</h3>
                  <p className="mt-2 hidden line-clamp-2 text-sm text-cream/70 sm:block">
                    {area.blurb}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink py-16 text-cream sm:py-20">
        <div className="container-page grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-center">
          <div>
            <p className="eyebrow eyebrow-light">A note on information</p>
            <h2 className="mt-2 text-3xl font-semibold">
              What you see here is a starting point
            </h2>
            <p className="mt-4 text-sm leading-7 text-cream/65">
              Property moves quickly. Prices, availability, sizes and
              documentation should always be confirmed with the team before you
              make a decision. For land and purchases, carry out your own due
              diligence on title, zoning, access and utilities.
            </p>
            <p className="mt-3 text-sm leading-7 text-cream/65">
              The photographs currently on the site are illustrative and will be
              replaced with photographs of the actual properties as the
              catalogue is updated.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/contact" className="btn btn-gold">
                Contact the team
              </Link>
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-light"
              >
                <Icon name="whatsapp" className="h-4 w-4" />
                WhatsApp us
              </a>
            </div>
          </div>
          <div className="rounded-2xl border border-cream/10 bg-cream/5 p-6">
            <p className="text-sm font-bold text-cream">Prefer to talk?</p>
            <div className="mt-4 space-y-3 text-sm">
              <a
                className="flex items-center gap-3 text-cream/70 hover:text-cream"
                href={telHref(settings.phonePrimaryTel)}
              >
                <Icon name="phone" className="h-4 w-4 text-gold" />
                {settings.phonePrimaryLabel}
              </a>
              <a
                className="flex items-center gap-3 text-cream/70 hover:text-cream"
                href={telHref(settings.phoneSecondaryTel)}
              >
                <Icon name="phone" className="h-4 w-4 text-gold" />
                {settings.phoneSecondaryLabel}
              </a>
              <p className="flex items-start gap-3 text-cream/70">
                <Icon name="calendar" className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                {settings.hours}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
