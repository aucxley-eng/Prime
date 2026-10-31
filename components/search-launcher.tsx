"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Icon } from "@/components/icon";

const quickLinks = [
  { href: "/properties?purpose=sale", label: "For sale" },
  { href: "/properties?purpose=rent", label: "For rent" },
  { href: "/properties", label: "All properties" },
  { href: "/properties?location=Kitengela", label: "Kitengela" },
  { href: "/properties?location=Lang%27ata", label: "Lang'ata" },
  { href: "/properties?location=Juja", label: "Juja" },
];

export function SearchLauncher() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 40);

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get("q");
    const query = typeof value === "string" ? value.trim() : "";
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    setOpen(false);
    router.push(`/properties${params.size ? `?${params.toString()}` : ""}`);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search properties"
        aria-haspopup="dialog"
        aria-expanded={open}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-ink transition hover:border-ink/40 hover:bg-sand sm:h-11 sm:w-11"
      >
        <Icon name="search" className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-ink/60 px-4 py-[10vh] backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="site-search-title"
            className="w-full max-w-xl overflow-hidden rounded-3xl border border-line bg-cream shadow-2xl shadow-ink/30"
          >
            <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
              <div>
                <p className="eyebrow">Search</p>
                <h2
                  id="site-search-title"
                  className="mt-1 text-xl font-semibold"
                >
                  Find a property
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close search"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink/60 transition hover:border-ink/40 hover:text-ink"
              >
                <Icon name="close" className="h-4 w-4" />
              </button>
            </div>

            <form action="/properties" method="get" onSubmit={onSubmit} className="px-5 pt-5">
              <div className="relative">
                <Icon
                  name="search"
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35"
                />
                <input
                  ref={inputRef}
                  name="q"
                  type="search"
                  placeholder="Title, area, type or reference"
                  aria-label="Search properties"
                  className="field-input h-12 pl-10 pr-24"
                />
                <button
                  type="submit"
                  className="absolute bottom-1 right-1 top-1 rounded-full bg-ink px-4 text-xs font-bold text-cream transition hover:bg-ink-2"
                >
                  Search
                </button>
              </div>
              <p className="field-help">
                Search the catalogue by title, area, property type or reference.
              </p>
            </form>

            <div className="px-5 pb-5 pt-4">
              <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.16em] text-ink/40">
                Browse quickly
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {quickLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-full border border-line bg-white px-3.5 py-2 text-xs font-bold text-ink/70 transition hover:border-ink/40 hover:text-ink"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
