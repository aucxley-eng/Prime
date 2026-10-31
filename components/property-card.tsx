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
    <article className="group flex flex-col overflow-hidden rounded-xl border border-line bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/10 sm:rounded-2xl">
      <Link
        href={href}
        className="relative block aspect-[4/3] overflow-hidden bg-sand"
        aria-label={`View ${property.title}`}
      >
        <Image
          src={property.image}
          alt={`Illustrative photograph for ${property.title}`}
          fill
          sizes="(max-width: 767px) 50vw, (max-width: 1279px) 33vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span
          className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[0.55rem] font-extrabold uppercase tracking-wider sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[0.65rem] ${
            property.purpose === "rent"
              ? "bg-clay text-white"
              : "bg-ink text-cream"
          }`}
        >
          {formatPurpose(property.purpose)}
        </span>
        <span className="absolute right-2 top-2 rounded-full bg-cream/95 px-2 py-0.5 text-[0.55rem] font-extrabold tracking-wider text-ink sm:right-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[0.65rem]">
          {property.ref}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <p className="text-[0.7rem] font-extrabold text-clay sm:text-sm">
          {displayPrice(property)}
        </p>
        <h3 className="mt-1 line-clamp-2 text-[0.95rem] font-semibold leading-snug sm:mt-1.5 sm:text-xl">
          <Link href={href} className="hover:text-clay">
            {property.title}
          </Link>
        </h3>
        <p className="mt-1.5 flex items-center gap-1 text-[0.65rem] text-ink/55 sm:mt-2 sm:gap-1.5 sm:text-xs">
          <Icon name="pin" className="h-3 w-3 shrink-0 text-gold sm:h-3.5 sm:w-3.5" />
          <span className="truncate">
            {property.location}, {property.county}
          </span>
        </p>

        <ul className="mt-3 flex flex-wrap gap-x-2.5 gap-y-1 border-t border-line/70 pt-3 text-[0.65rem] font-semibold text-ink/65 sm:mt-4 sm:gap-x-4 sm:gap-y-2 sm:pt-4 sm:text-xs">
          {property.beds ? (
            <li className="flex items-center gap-1 sm:gap-1.5">
              <Icon name="bed" className="h-3.5 w-3.5 text-ink/40 sm:h-4 sm:w-4" />
              {property.beds} bed{property.beds === 1 ? "" : "s"}
            </li>
          ) : null}
          {property.baths ? (
            <li className="flex items-center gap-1 sm:gap-1.5">
              <Icon name="bath" className="h-3.5 w-3.5 text-ink/40 sm:h-4 sm:w-4" />
              {property.baths} bath{property.baths === 1 ? "" : "s"}
            </li>
          ) : null}
          <li className="flex items-center gap-1 sm:gap-1.5">
            <Icon name="ruler" className="h-3.5 w-3.5 text-ink/40 sm:h-4 sm:w-4" />
            {property.size}
          </li>
        </ul>

        <div className="mt-auto flex items-center justify-between gap-2 pt-3 sm:gap-3 sm:pt-5">
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-ink hover:text-clay sm:text-sm"
          >
            <span className="sm:hidden">Details</span>
            <span className="hidden sm:inline">View details</span>
            <Icon name="arrow" className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Link>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#25d366] text-white transition hover:brightness-95 sm:h-9 sm:w-9"
            aria-label={`Enquire about ${property.title} on WhatsApp`}
            title="Enquire on WhatsApp"
          >
            <Icon name="whatsapp" className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </a>
        </div>
      </div>
    </article>
  );
}
