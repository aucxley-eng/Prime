import type { Metadata } from "next";
import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { telHref } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How Prime Sahara Properties handles enquiries submitted through this website.",
};

export default function PrivacyPage() {
  const settings = getSettings();

  return (
    <section className="py-14 sm:py-20">
      <div className="container-page max-w-3xl">
        <p className="eyebrow">Privacy</p>
        <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">
          How we handle your information
        </h1>
        <div className="mt-8 space-y-6 text-sm leading-7 text-ink/70">
          <p>
            This website is operated for Prime Sahara Properties. This note
            explains what happens when you submit an enquiry or contact us about
            a property.
          </p>

          <div>
            <h2 className="text-xl font-semibold text-ink">
              What we collect
            </h2>
            <p className="mt-2">
              When you send an enquiry, we collect the name, phone number and
              details you choose to provide, plus the property reference if you
              are asking about a listing. We also store the date the enquiry was
              sent and whether it has been handled.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-ink">
              Why we collect it
            </h2>
            <p className="mt-2">
              We use the information to respond to your enquiry, confirm
              availability and arrange a viewing. We do not sell your details or
              use them for unrelated marketing.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-ink">
              Where it is stored
            </h2>
            <p className="mt-2">
              Enquiries are stored in the website&apos;s database so the team can
              review and respond to them. Access is limited to authorised staff.
              The site does not use advertising cookies, third-party analytics or
              tracking pixels.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-ink">WhatsApp and Facebook</h2>
            <p className="mt-2">
              The enquiry form opens WhatsApp with your message ready to send.
              Nothing is sent to WhatsApp until you press send. WhatsApp and
              Facebook are separate services with their own privacy policies,
              and using them is subject to their terms.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-ink">How long we keep it</h2>
            <p className="mt-2">
              Enquiries are kept only as long as needed to handle your request
              and maintain a record of the conversation. You can ask us to
              delete your enquiry by contacting us on the numbers below.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-ink">Your choices</h2>
            <p className="mt-2">
              You can ask what information we hold about you, request a
              correction, or ask us to delete it. You can also choose to contact
              us by phone instead of using the form.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-ink">Contact</h2>
            <p className="mt-2">
              For a privacy request, call or WhatsApp{" "}
              <a
                className="font-bold text-ink underline hover:text-clay"
                href={telHref(settings.phonePrimaryTel)}
              >
                {settings.phonePrimaryLabel}
              </a>{" "}
              or{" "}
              <a
                className="font-bold text-ink underline hover:text-clay"
                href={telHref(settings.phoneSecondaryTel)}
              >
                {settings.phoneSecondaryLabel}
              </a>
              .
            </p>
          </div>

          <p className="rounded-2xl bg-sand p-5 text-xs leading-6 text-ink/60">
            This is a plain-language website note, not a substitute for legal
            advice. Review it against how enquiries are actually handled before
            publishing the site.
          </p>

          <Link
            href="/contact"
            className="inline-flex text-sm font-extrabold text-ink underline hover:text-clay"
          >
            Back to contact
          </Link>
        </div>
      </div>
    </section>
  );
}
