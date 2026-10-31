import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icon";
import type { SiteSettings } from "@/lib/types";
import { generalEnquiryMessage, telHref, whatsappUrl } from "@/lib/whatsapp";

const footerLinks = [
  { href: "/properties?purpose=sale", label: "For sale" },
  { href: "/properties?purpose=rent", label: "For rent" },
  { href: "/properties", label: "All properties" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
];

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();
  const whatsapp = whatsappUrl(generalEnquiryMessage(), settings);

  return (
    <footer className="bg-ink text-cream">
      <div className="container-page py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:py-7">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex min-w-0 items-center gap-2.5">
            <Image
              src="/images/logo.svg"
              alt=""
              width={38}
              height={38}
              className="h-9 w-9 shrink-0"
            />
            <span className="min-w-0 leading-none">
              <strong className="block truncate font-display text-lg font-semibold">
                Prime Sahara
              </strong>
              <span className="mt-1 block text-[0.55rem] font-extrabold uppercase tracking-[0.22em] text-gold-2">
                Properties
              </span>
            </span>
          </Link>

          <div className="flex shrink-0 gap-1.5">
            <a
              href={settings.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Prime Sahara Properties on Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/15 text-cream/70 hover:border-gold hover:text-gold"
            >
              <Icon name="facebook" className="h-3.5 w-3.5" />
            </a>
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Prime Sahara Properties"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/15 text-cream/70 hover:border-gold hover:text-gold"
            >
              <Icon name="whatsapp" className="h-4 w-4" />
            </a>
            <a
              href={telHref(settings.phonePrimaryTel)}
              aria-label={`Call ${settings.phonePrimaryLabel}`}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/15 text-cream/70 hover:border-gold hover:text-gold"
            >
              <Icon name="phone" className="h-4 w-4" />
            </a>
          </div>
        </div>

        <nav
          aria-label="Footer"
          className="mt-4 border-t border-cream/10 pt-3.5"
        >
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-cream/65 sm:flex sm:flex-wrap sm:items-center sm:gap-x-6">
            {footerLinks.map((link) => (
              <li key={link.label}>
                <Link className="hover:text-cream" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-4 border-t border-cream/10 pt-3.5 text-[0.68rem] leading-5 text-cream/40">
          <p>
            © {year} Prime Sahara Properties. Prices and availability must be
            confirmed.
          </p>
        </div>
      </div>
    </footer>
  );
}
