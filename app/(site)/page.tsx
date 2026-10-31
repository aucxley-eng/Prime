import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { PropertyCard } from "@/components/property-card";
import { SearchForm } from "@/components/search-form";
import { AREAS } from "@/lib/areas";
import { getFeaturedProperties, listProperties } from "@/lib/properties";
import { getSettings } from "@/lib/settings";
import {
  generalEnquiryMessage,
  telHref,
  whatsappUrl,
} from "@/lib/whatsapp";

export default function HomePage() {
  const settings = getSettings();
  const featured = getFeaturedProperties(6);
  const all = listProperties();
  const saleCount = all.filter((property) => property.purpose === "sale").length;
  const rentCount = all.filter((property) => property.purpose === "rent").length;
  const whatsapp = whatsappUrl(generalEnquiryMessage(), settings);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink text-cream">
        <Image
          src="/images/hero.jpg"
          alt="Illustrative photograph of a modern home in Kenya"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/20" />
        <div className="container-page relative py-20 sm:py-28 lg:py-32">
          <div className="max-w-2xl">
            <p className="eyebrow eyebrow-light">Kitengela · Lang&apos;ata · Juja</p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">
              Find the right home, with someone who knows the area.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-cream/75">
              Homes, apartments, townhouses and plots across three growing
              Nairobi neighbourhoods. Compare the catalogue, then arrange a
              viewing directly by phone or WhatsApp.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/properties" className="btn btn-gold">
                Browse properties
                <Icon name="arrow" className="h-4 w-4" />
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

          <div className="mt-12 max-w-4xl">
            <SearchForm />
          </div>

          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-xs font-bold uppercase tracking-[0.16em] text-cream/60">
            <span>{all.length} starter listings</span>
            <span>{saleCount} for sale</span>
            <span>{rentCount} for rent</span>
            <span>Viewings by appointment</span>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-page">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Featured properties</p>
              <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">
                A first look at the catalogue
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-ink/60">
                Starter listings show how the site works. Prices, availability,
                sizes and documents must be confirmed with the team before you
                make a decision.
              </p>
            </div>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 text-sm font-extrabold text-ink hover:text-clay"
            >
              View all properties
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                settings={settings}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sand/70 py-16 sm:py-20">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="eyebrow">Where we work</p>
            <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">
              Three areas, different reasons to choose them
            </h2>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {AREAS.map((area) => (
              <Link
                key={area.name}
                href={`/properties?location=${encodeURIComponent(area.name)}`}
                className="group relative isolate aspect-[4/5] overflow-hidden rounded-2xl bg-ink"
              >
                <Image
                  src={area.image}
                  alt={`Illustrative photograph of property in ${area.name}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover opacity-70 transition duration-500 group-hover:scale-105 group-hover:opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-cream">
                  <span className="text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-gold-2">
                    {area.county}
                  </span>
                  <h3 className="mt-1 text-2xl font-semibold">{area.name}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-cream/70">
                    {area.blurb}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider">
                    Browse {area.name}
                    <Icon name="arrow" className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="eyebrow">A simple process</p>
            <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">
              From shortlist to viewing without the runaround
            </h2>
            <p className="mt-4 text-sm leading-7 text-ink/60">
              The site keeps sale and rental listings separate and attaches a
              viewing request to every property. The rest is a direct
              conversation about what is actually available.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                className="btn btn-primary"
                href={telHref(settings.phonePrimaryTel)}
              >
                <Icon name="phone" className="h-4 w-4" />
                Call {settings.phonePrimaryLabel}
              </a>
              <Link className="btn btn-outline" href="/contact">
                Contact the team
              </Link>
            </div>
          </div>

          <ol className="grid gap-4">
            {[
              {
                title: "Browse by area or budget",
                text: "Filter the catalogue by purpose, location, type and bedrooms.",
              },
              {
                title: "Ask about a specific property",
                text: "Each listing has a viewing request that opens WhatsApp with the property reference filled in.",
              },
              {
                title: "Confirm the details",
                text: "Price, availability, size and documents are confirmed in the conversation before you commit.",
              },
            ].map((step, index) => (
              <li
                key={step.title}
                className="flex gap-4 rounded-2xl border border-line bg-white p-5 shadow-sm"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/20 font-display text-lg font-semibold text-clay">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-ink/60">
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-page pb-16 sm:pb-20">
        <div className="rounded-3xl bg-ink px-6 py-10 text-cream sm:px-10 sm:py-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="eyebrow eyebrow-light">Let&apos;s talk property</p>
              <h2 className="mt-2 text-3xl font-semibold">
                Tell us what you are looking for
              </h2>
              <p className="mt-3 text-sm leading-7 text-cream/65">
                Share your preferred area, budget and whether you want to buy or
                rent. We will tell you what is available and arrange a viewing.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a className="btn btn-gold" href={telHref(settings.phonePrimaryTel)}>
                Call {settings.phonePrimaryLabel}
              </a>
              <a
                className="btn btn-outline-light"
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="whatsapp" className="h-4 w-4" />
                WhatsApp us
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
