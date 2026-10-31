"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/icon";
import { SearchLauncher } from "@/components/search-launcher";
import type { SiteSettings } from "@/lib/types";
import {
  generalEnquiryMessage,
  telHref,
  whatsappUrl,
} from "@/lib/whatsapp";

const links = [
  { href: "/", label: "Home" },
  { href: "/properties?purpose=sale", label: "For sale", key: "sale" },
  { href: "/properties?purpose=rent", label: "For rent", key: "rent" },
  { href: "/properties", label: "All properties", key: "all" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({ settings }: { settings: SiteSettings }) {
  const pathname = usePathname();
  const whatsapp = whatsappUrl(generalEnquiryMessage(), settings);

  function isActive(key?: string) {
    if (key === "sale" || key === "rent") return false;
    if (key === "all") return pathname.startsWith("/properties");
    return pathname === key;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-cream/95 backdrop-blur">
      <div className="bg-ink text-cream">
        <div className="container-page flex items-center justify-between gap-3 py-1.5 text-[0.65rem] font-semibold sm:py-2 sm:text-[0.7rem]">
          <span className="hidden text-cream/70 sm:block">
            Kitengela · Lang&apos;ata · Juja
          </span>
          <span className="flex flex-1 items-center justify-end gap-3 sm:flex-none sm:gap-4">
            <a
              className="inline-flex items-center gap-1.5 hover:text-gold-2"
              href={telHref(settings.phonePrimaryTel)}
            >
              <Icon name="phone" className="h-3.5 w-3.5" />
              {settings.phonePrimaryLabel}
            </a>
            <a
              className="hidden items-center gap-1.5 hover:text-gold-2 sm:inline-flex"
              href={telHref(settings.phoneSecondaryTel)}
            >
              {settings.phoneSecondaryLabel}
            </a>
          </span>
        </div>
      </div>

      <div className="container-page flex h-16 items-center justify-between gap-3 sm:h-[4.5rem] sm:gap-5">
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3"
          aria-label="Prime Sahara Properties home"
        >
          <Image
            src="/images/logo.svg"
            alt=""
            width={44}
            height={44}
            className="h-9 w-9 sm:h-10 sm:w-10"
          />
          <span className="min-w-0 leading-none">
            <strong className="block truncate font-display text-lg font-semibold sm:text-xl">
              Prime Sahara
            </strong>
            <span className="mt-1 block text-[0.55rem] font-extrabold uppercase tracking-[0.22em] text-clay sm:text-[0.62rem]">
              Properties
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`rounded-full px-3.5 py-2 text-sm font-semibold transition ${
                isActive(link.key || link.href)
                  ? "bg-ink text-cream"
                  : "text-ink/70 hover:bg-sand hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <SearchLauncher />
          <a
            className="hidden h-11 items-center justify-center gap-2 rounded-full bg-ink px-4 text-xs font-bold text-cream transition hover:bg-ink-2 sm:inline-flex"
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="whatsapp" className="h-4 w-4" />
            WhatsApp us
          </a>
          <a
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25d366] text-white transition hover:brightness-95 sm:hidden"
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with Prime Sahara Properties on WhatsApp"
          >
            <Icon name="whatsapp" className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
