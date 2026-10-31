import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icon";
import type { Property, SiteSettings } from "@/lib/types";
import {
  displayPrice,
  formatPurpose,
  propertyEnquiryMessage,
  whatsappUrl,
} from "@/lib/whatsapp";

export function PropertyCard({
  property,
  settings,
}: {
  property: Property;
  settings: SiteSettings;
}) {
  const whatsapp = whatsappUrl(propertyEnquiryMessage(property), settings);
  const href = `/property/${property.slug}`;

  return (
    <article className="group overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/10">
      <Link
        href={href}
        className="relative block aspect-[4/3] overflow-hidden bg-sand"
        aria-label={`View ${property.title}`}
      >
        <Image
          src={property.image}
          alt={`Illustrative photograph for ${property.title}`}
          fill
          sizes="(max-width: 719px) 100vw, (max-width: 1080px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[0.65rem] font-extrabold uppercase tracking-wider ${
            property.purpose === "rent"
              ? "bg-clay text-white"
              : "bg-ink text-cream"
          }`}
        >
          {formatPurpose(property.purpose)}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-cream/95 px-2.5 py-1 text-[0.65rem] font-extrabold tracking-wider text-ink">
          {property.ref}
        </span>
      </Link>

      <div className="p-5">
        <p className="text-sm font-extrabold text-clay">
          {displayPrice(property)}
        </p>
        <h3 className="mt-1.5 text-xl font-semibold leading-snug">
          <Link href={href} className="hover:text-clay">
            {property.title}
          </Link>
        </h3>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-ink/55">
          <Icon name="pin" className="h-3.5 w-3.5 text-gold" />
          {property.location}, {property.county}
        </p>

        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-line/70 pt-4 text-xs font-semibold text-ink/65">
          {property.beds ? (
            <li className="flex items-center gap-1.5">
              <Icon name="bed" className="h-4 w-4 text-ink/40" />
              {property.beds} bed{property.beds === 1 ? "" : "s"}
            </li>
          ) : null}
          {property.baths ? (
            <li className="flex items-center gap-1.5">
              <Icon name="bath" className="h-4 w-4 text-ink/40" />
              {property.baths} bath{property.baths === 1 ? "" : "s"}
            </li>
          ) : null}
          <li className="flex items-center gap-1.5">
            <Icon name="ruler" className="h-4 w-4 text-ink/40" />
            {property.size}
          </li>
        </ul>

        <div className="mt-5 flex items-center justify-between gap-3">
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 text-sm font-extrabold text-ink hover:text-clay"
          >
            View details
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25d366] text-white transition hover:brightness-95"
            aria-label={`Enquire about ${property.title} on WhatsApp`}
            title="Enquire on WhatsApp"
          >
            <Icon name="whatsapp" className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  );
}
