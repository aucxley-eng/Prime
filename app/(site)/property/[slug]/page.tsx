import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EnquiryForm } from "@/components/enquiry-form";
import { Gallery } from "@/components/gallery";
import { Icon } from "@/components/icon";
import { PropertyCard } from "@/components/property-card";
import {
  getPropertyBySlug,
  getRelatedProperties,
} from "@/lib/properties";
import { getSettings } from "@/lib/settings";
import {
  displayPrice,
  formatPurpose,
  propertyEnquiryMessage,
  telHref,
  whatsappUrl,
} from "@/lib/whatsapp";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);
  if (!property) return { title: "Property not found" };

  return {
    title: property.title,
    description: property.summary,
    openGraph: {
      title: property.title,
      description: property.summary,
      images: [{ url: property.image }],
    },
  };
}

export default async function PropertyPage({ params }: { params: Params }) {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);
  if (!property) notFound();

  const settings = getSettings();
  const related = getRelatedProperties(property);
  const images = property.gallery.length ? property.gallery : [property.image];
  const whatsapp = whatsappUrl(propertyEnquiryMessage(property), settings);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.summary,
    url: `${siteUrl}/property/${property.slug}`,
    image: images.map((image) => `${siteUrl}${image}`),
    address: {
      "@type": "PostalAddress",
      addressLocality: property.location,
      addressRegion: property.county,
      addressCountry: "KE",
    },
    numberOfRooms: property.beds || undefined,
    floorSize: property.size ? { "@type": "QuantitativeValue", name: property.size } : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="border-b border-line bg-sand/50 py-5">
        <div className="container-page flex flex-wrap items-center gap-2 text-xs font-semibold text-ink/50">
          <Link href="/" className="hover:text-clay">
            Home
          </Link>
          <span>/</span>
          <Link href="/properties" className="hover:text-clay">
            Properties
          </Link>
          <span>/</span>
          <span className="text-ink/75">{property.title}</span>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="container-page">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div>
              <Gallery images={images} title={property.title} />

              <div className="mt-8">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-[0.65rem] font-extrabold uppercase tracking-wider ${
                      property.purpose === "rent"
                        ? "bg-clay text-white"
                        : "bg-ink text-cream"
                    }`}
                  >
                    {formatPurpose(property.purpose)}
                  </span>
                  <span className="rounded-full border border-line bg-white px-3 py-1 text-[0.65rem] font-extrabold tracking-wider text-ink/60">
                    {property.ref}
                  </span>
                </div>
                <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
                  {property.title}
                </h1>
                <p className="mt-3 flex items-center gap-2 text-sm text-ink/60">
                  <Icon name="pin" className="h-4 w-4 text-gold" />
                  {property.location}, {property.county}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {property.beds ? (
                  <Spec label="Bedrooms" value={String(property.beds)} icon="bed" />
                ) : null}
                {property.baths ? (
                  <Spec label="Bathrooms" value={String(property.baths)} icon="bath" />
                ) : null}
                <Spec label="Size" value={property.size} icon="ruler" />
                <Spec label="Type" value={property.type} icon="home" />
              </div>

              <div className="mt-8 rounded-2xl border border-line bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold">About this property</h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-ink/70">
                  {property.description}
                </p>

                {property.features.length ? (
                  <>
                    <h3 className="mt-7 text-lg font-semibold">Features</h3>
                    <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                      {property.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-sm text-ink/70"
                        >
                          <Icon
                            name="check"
                            className="mt-0.5 h-4 w-4 shrink-0 text-gold"
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}

                {property.amenities.length ? (
                  <>
                    <h3 className="mt-7 text-lg font-semibold">
                      Amenities and services
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {property.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="rounded-full bg-sand px-3 py-1.5 text-xs font-semibold text-ink/70"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>

              <div className="mt-6 rounded-2xl bg-sand/70 p-6 text-sm leading-7 text-ink/65">
                <strong className="text-ink">Before you commit.</strong> Prices,
                availability, sizes and documentation must be confirmed with the
                team. For land and purchases, carry out your own due diligence on
                title, zoning, access and utilities. Photographs are illustrative
                until replaced with photographs of the actual property.
              </div>
            </div>

            <aside className="lg:sticky lg:top-28">
              <div className="rounded-2xl border border-line bg-white p-6 shadow-lg shadow-ink/5">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-clay">
                  {formatPurpose(property.purpose)}
                </p>
                <p className="mt-2 font-display text-3xl font-semibold">
                  {displayPrice(property)}
                </p>
                <p className="mt-2 text-sm leading-6 text-ink/55">
                  Contact us to confirm the current price, availability and
                  viewing times.
                </p>

                <div className="mt-5 grid gap-2">
                  <a
                    className="btn btn-primary w-full"
                    href={telHref(settings.phonePrimaryTel)}
                  >
                    <Icon name="phone" className="h-4 w-4" />
                    Call {settings.phonePrimaryLabel}
                  </a>
                  <a
                    className="btn btn-outline w-full"
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon name="whatsapp" className="h-4 w-4" />
                    WhatsApp about this property
                  </a>
                </div>

                <div className="my-6 border-t border-line" />

                <h2 className="text-xl font-semibold">Request a viewing</h2>
                <p className="mt-1 text-xs leading-6 text-ink/55">
                  Send your details and we will open WhatsApp with the property
                  reference already included.
                </p>
                <div className="mt-4">
                  <EnquiryForm
                    propertyId={property.id}
                    propertyTitle={property.title}
                  />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {related.length ? (
        <section className="bg-sand/50 py-14 sm:py-16">
          <div className="container-page">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Keep looking</p>
                <h2 className="mt-2 text-3xl font-semibold">
                  Similar properties
                </h2>
              </div>
              <Link
                href="/properties"
                className="hidden items-center gap-2 text-sm font-extrabold text-ink hover:text-clay sm:inline-flex"
              >
                View all
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <PropertyCard key={item.id} property={item} settings={settings} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}

function Spec({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: "bed" | "bath" | "ruler" | "home";
}) {
  return (
    <div className="rounded-xl border border-line bg-white p-3.5">
      <Icon name={icon} className="h-4 w-4 text-gold" />
      <p className="mt-2 text-[0.65rem] font-extrabold uppercase tracking-wider text-ink/45">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-bold text-ink">{value}</p>
    </div>
  );
}
