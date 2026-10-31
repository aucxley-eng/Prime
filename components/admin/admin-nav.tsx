"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/icon";

const items: Array<{ href: string; label: string; icon: IconName; exact?: boolean }> = [
  { href: "/admin", label: "Overview", icon: "chart", exact: true },
  { href: "/admin/properties", label: "Properties", icon: "home" },
  { href: "/admin/enquiries", label: "Enquiries", icon: "inbox" },
  { href: "/admin/settings", label: "Settings", icon: "settings" },
];

export function AdminNav({ newEnquiries }: { newEnquiries: number }) {
  const pathname = usePathname();

  return (
    <nav
      className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
      aria-label="Admin"
    >
      {items.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-bold transition ${
              active
                ? "bg-ink text-cream"
                : "text-ink/60 hover:bg-sand hover:text-ink"
            }`}
          >
            <Icon name={item.icon} className="h-4 w-4" />
            {item.label}
            {item.href === "/admin/enquiries" && newEnquiries > 0 ? (
              <span className="ml-auto rounded-full bg-gold px-2 py-0.5 text-[0.62rem] font-extrabold text-ink">
                {newEnquiries}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
