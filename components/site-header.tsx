"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icon";
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
  const [open, setOpen] = useState(false);
  const whatsapp = whatsappUrl(generalEnquiryMessage(), settings);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

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

        <div className="flex shrink-0 items-center gap-2">
          <a
            className="btn btn-primary btn-sm hidden sm:inline-flex"
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="whatsapp" className="h-4 w-4" />
            WhatsApp us
          </a>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink sm:h-11 sm:w-11 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-navigation"
          className="menu-panel absolute inset-x-0 top-full max-h-[calc(100dvh-6rem)] overflow-y-auto border-t border-line bg-cream shadow-2xl shadow-ink/15 lg:hidden"
        >
          <nav className="container-page py-4" aria-label="Mobile">
            <div className="grid grid-cols-2 gap-2">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex min-h-11 items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-bold transition ${
                    isActive(link.key || link.href)
                      ? "border-ink bg-ink text-cream"
                      : "border-line bg-white text-ink/75 hover:border-ink/40 hover:text-ink"
                  }`}
                >
                  {link.label}
                  <Icon name="arrow" className="h-3.5 w-3.5 opacity-40" />
                </Link>
              ))}
            </div>

            <div className="mt-3 rounded-2xl bg-ink p-3.5 text-cream">
              <p className="px-1 text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-gold-2">
                Talk to us
              </p>
              <div className="mt-2.5 grid grid-cols-2 gap-2">
                <a
                  className="btn btn-gold btn-sm w-full"
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                >
                  <Icon name="whatsapp" className="h-4 w-4" />
                  WhatsApp
                </a>
                <a
                  className="btn btn-sm w-full border border-cream/25 text-cream hover:bg-cream hover:text-ink"
                  href={telHref(settings.phonePrimaryTel)}
                  onClick={() => setOpen(false)}
                >
                  <Icon name="phone" className="h-4 w-4" />
                  Call
                </a>
              </div>
              <p className="mt-2 px-1 text-xs leading-5 text-cream/55">
                {settings.phonePrimaryLabel} · {settings.hours}
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-line bg-white px-3.5 py-2.5 text-xs font-semibold text-ink/55">
              <a
                className="inline-flex items-center gap-1.5 hover:text-clay"
                href={telHref(settings.phoneSecondaryTel)}
              >
                <Icon name="phone" className="h-3.5 w-3.5" />
                {settings.phoneSecondaryLabel}
              </a>
              <a
                className="inline-flex items-center gap-1.5 hover:text-clay"
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="facebook" className="h-3.5 w-3.5" />
                Facebook
              </a>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
