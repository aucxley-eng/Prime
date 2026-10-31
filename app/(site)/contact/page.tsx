import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { Icon } from "@/components/icon";
import { AREAS } from "@/lib/areas";
import { getSettings } from "@/lib/settings";
import {
  generalEnquiryMessage,
  telHref,
  whatsappUrl,
} from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact and viewings",
  description:
    "Contact Prime Sahara Properties by phone or WhatsApp to ask about property in Kitengela, Lang'ata and Juja, or arrange a viewing.",
};

export default function ContactPage() {
  const settings = getSettings();
  const whatsapp = whatsappUrl(generalEnquiryMessage(), settings);

  return (
    <>
      <section className="bg-ink py-14 text-cream sm:py-16">
        <div className="container-page">
          <p className="eyebrow eyebrow-light">Contact</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold sm:text-5xl">
            Ask about a property or arrange a viewing
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-cream/65">
            Call or WhatsApp us with the property reference, or send an enquiry
            and we will open WhatsApp with your message ready to send.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container-page grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="space-y-3">
            <a
              href={telHref(settings.phonePrimaryTel)}
              className="flex items-center gap-4 rounded-2xl border border-line bg-white p-5 shadow-sm transition hover:border-gold"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/20 text-clay">
                <Icon name="phone" className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-xs font-extrabold uppercase tracking-wider text-ink/45">
                  Primary phone
                </span>
                <strong className="mt-0.5 block text-lg">
                  {settings.phonePrimaryLabel}
                </strong>
              </span>
            </a>

            <a
              href={telHref(settings.phoneSecondaryTel)}
              className="flex items-center gap-4 rounded-2xl border border-line bg-white p-5 shadow-sm transition hover:border-gold"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/20 text-clay">
                <Icon name="phone" className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-xs font-extrabold uppercase tracking-wider text-ink/45">
                  Alternative phone
                </span>
                <strong className="mt-0.5 block text-lg">
                  {settings.phoneSecondaryLabel}
                </strong>
              </span>
            </a>

            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-line bg-white p-5 shadow-sm transition hover:border-[#25d366]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#25d366]/15 text-[#128c4b]">
                <Icon name="whatsapp" className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-xs font-extrabold uppercase tracking-wider text-ink/45">
                  WhatsApp
                </span>
                <strong className="mt-0.5 block text-lg">
                  Message {settings.phonePrimaryLabel}
                </strong>
              </span>
            </a>

            <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
              <dl className="space-y-4 text-sm">
                <div className="flex gap-3">
                  <Icon name="calendar" className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <div>
                    <dt className="font-extrabold text-ink">Viewing times</dt>
                    <dd className="mt-0.5 text-ink/60">{settings.hours}</dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <div>
                    <dt className="font-extrabold text-ink">Office</dt>
                    <dd className="mt-0.5 text-ink/60">{settings.officeNote}</dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Icon name="home" className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <div>
                    <dt className="font-extrabold text-ink">Areas served</dt>
                    <dd className="mt-0.5 text-ink/60">
                      {AREAS.map((area) => area.name).join(" · ")}
                    </dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Icon name="facebook" className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <div>
                    <dt className="font-extrabold text-ink">Facebook</dt>
                    <dd className="mt-0.5">
                      <a
                        className="text-ink/60 underline hover:text-clay"
                        href={settings.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Find Prime Sahara Properties on Facebook
                      </a>
                    </dd>
                  </div>
                </div>
              </dl>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white p-6 shadow-lg shadow-ink/5 sm:p-8">
            <h2 className="text-2xl font-semibold">Send an enquiry</h2>
            <p className="mt-2 text-sm leading-7 text-ink/60">
              Tell us what you are looking for. The enquiry is saved for the team
              and WhatsApp opens with your message ready to send.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16 sm:pb-20">
        <div className="container-page">
          <h2 className="text-2xl font-semibold">Common questions</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {[
              {
                question: "How do I arrange a viewing?",
                answer:
                  "Open a property and use the viewing request, or call and WhatsApp us with the property reference. Viewings are arranged by appointment.",
              },
              {
                question: "Are the prices on the site final?",
                answer:
                  "Prices and availability must be confirmed with the team. Where a price is not published, the listing says price on request.",
              },
              {
                question: "Can I visit the office?",
                answer:
                  "The exact office location is still being confirmed. Please call or WhatsApp before visiting so we can confirm where to meet.",
              },
              {
                question: "Do you handle rentals as well as sales?",
                answer:
                  "Yes. The catalogue has separate filters for properties for sale and properties for rent.",
              },
            ].map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl border border-line bg-white p-5"
              >
                <summary className="cursor-pointer list-none text-sm font-extrabold text-ink marker:hidden">
                  <span className="flex items-center justify-between gap-3">
                    {item.question}
                    <Icon
                      name="plus"
                      className="h-4 w-4 shrink-0 text-gold transition group-open:rotate-45"
                    />
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-ink/60">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
