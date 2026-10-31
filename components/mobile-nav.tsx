"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/icon";
import type { SiteSettings } from "@/lib/types";
import { generalEnquiryMessage, whatsappUrl } from "@/lib/whatsapp";

const navItems: {
  href: string;
  label: string;
  icon: IconName;
  external?: boolean;
}[] = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/properties", label: "Properties", icon: "search" },
  { href: "/about", label: "About", icon: "info" },
  { href: "/contact", label: "Contact", icon: "phone" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/properties") {
    return pathname.startsWith("/properties") || pathname.startsWith("/property/");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileNav({ settings }: { settings: SiteSettings }) {
  const pathname = usePathname();
  const whatsapp = whatsappUrl(generalEnquiryMessage(), settings);

  return (
    <nav
      aria-label="Mobile"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line/80 bg-cream/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(16,36,30,0.12)] backdrop-blur lg:hidden"
    >
      <div className="mx-auto grid h-[4.25rem] w-full max-w-2xl grid-cols-5 items-stretch px-1.5 sm:h-[4.75rem] sm:px-4">
        {navItems.slice(0, 2).map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} />
        ))}

        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Prime Sahara Properties on WhatsApp"
          className="flex flex-col items-center justify-center gap-1 text-[0.6rem] font-extrabold tracking-wide text-[#128c4a] sm:text-xs"
        >
          <span className="flex h-8 w-11 items-center justify-center rounded-full bg-[#25d366]/15 sm:h-9 sm:w-14">
            <Icon name="whatsapp" className="h-5 w-5" />
          </span>
          WhatsApp
        </a>

        {navItems.slice(2).map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} />
        ))}
      </div>
    </nav>
  );
}

function NavLink({
  item,
  pathname,
}: {
  item: (typeof navItems)[number];
  pathname: string;
}) {
  const active = isActive(pathname, item.href);

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={`flex flex-col items-center justify-center gap-1 text-[0.6rem] font-extrabold tracking-wide transition sm:text-xs ${
        active ? "text-ink" : "text-ink/50 hover:text-ink"
      }`}
    >
      <span
        className={`flex h-8 w-11 items-center justify-center rounded-full transition sm:h-9 sm:w-14 ${
          active ? "bg-ink text-cream" : "bg-transparent"
        }`}
      >
        <Icon name={item.icon} className="h-5 w-5" />
      </span>
      {item.label}
    </Link>
  );
}
