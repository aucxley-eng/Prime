# Prime Sahara Properties — website and CMS

A React property website and small content manager for **Prime Sahara Properties**,
covering Kitengela, Lang'ata and Juja. The public site separates sale and rental
listings, shows property details and sends every enquiry to the team by WhatsApp. The
admin area manages properties, photographs, enquiries and contact settings.

Built with Next.js, React and Tailwind CSS on Vercel, with Supabase Postgres for data and
Supabase Storage for uploaded photographs. There is no external CMS or tracking service.

## Status

This is a working prototype, not a published inventory. The public site, admin login,
property CRUD, settings, enquiry storage and WhatsApp handoff have been exercised against
a production build with PostgreSQL. Supabase Storage uploads are wired but still need to
be verified with project credentials. The listings are **starter content** and must be
replaced with confirmed inventory, prices and photography before launch.

## Due diligence

Verified from the brief or a public check:

- Trading name: **Prime Sahara Properties**
- Phone numbers: **0722 744110** and **0707 600069**
- Target areas: **Kitengela, Lang'ata and Juja**
- A public Facebook profile with a matching name was observed.

Deliberately not invented on the site:

- An exact office address or map pin.
- A company website, domain name, email address or exact Facebook page URL.
- Actual properties, plot sizes, bedroom counts, prices, rent figures or service charges.
- Ownership documents, title status, approvals or agent registration details.
- Specific business hours; the site says viewings are by appointment.
- Testimonials, client numbers, awards or years in business.

The Facebook link is a **search URL**, not a confirmed page URL. The office note says the
location is being confirmed. Every listing uses **“Price on request”** or **“Rent on
request”**. Photographs are illustrative stock images. Do not treat them as photographs
of the company's actual properties.

## Stack

- **Next.js 16.4.3** (App Router, server actions, Turbopack)
- **React 19.3.1**
- **Tailwind CSS 4.3.3**
- **TypeScript 5.9.3**
- **Supabase Postgres** through the `postgres` client
- **Supabase Storage** for uploaded property photographs
- No ORM, analytics or third-party form service

The app was tested on Node 26.5.1 against PostgreSQL 16. Use Node.js 20.9 or newer.

## Run locally

```bash
cd /home/aucxley/Work/prime
createdb prime_test
cp .env.example .env.local
npm install
npm run dev
```

For local development, set `DATABASE_URL=postgresql:///prime_test?host=/var/run/postgresql`.
The schema, default settings and 12 starter listings are created on first database access.
Open <http://localhost:3000>; the admin area is at <http://localhost:3000/admin>.

Image uploads require the Supabase Storage variables even during local development.

For local development, if `ADMIN_PASSWORD` is unset, the fallback password is
`prime-sahara-dev`. Do not rely on that fallback in production.

```bash
npm run lint
npm run typecheck
npm run build
npm start
```

`npm run verify` runs lint, typecheck and build in sequence.

## Environment

Copy `.env.example` to `.env.local` and adjust:

```dotenv
ADMIN_PASSWORD=change-me-now
ADMIN_SESSION_SECRET=replace-with-a-long-random-secret
DATABASE_URL=postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres?sslmode=require
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=replace-with-the-service-role-key
SUPABASE_STORAGE_BUCKET=property-images
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- `ADMIN_PASSWORD` — required in production. If it is unset in production, admin login is
  disabled.
- `ADMIN_SESSION_SECRET` — used to sign the admin session cookie. Use a long random value
  in production. If unset in production, a process-local random fallback is used, so
  sessions do not survive a restart.
- `DATABASE_URL` — Supabase Postgres connection string. On Vercel use the transaction
  pooler URI on port `6543`; the app disables prepared statements for pooler compatibility.
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL, used for Storage.
- `SUPABASE_SERVICE_ROLE_KEY` — server-only Supabase service-role key. Never expose this
  with a `NEXT_PUBLIC_` prefix or in client code.
- `SUPABASE_STORAGE_BUCKET` — public Storage bucket for property images. Defaults to
  `property-images`.
- `NEXT_PUBLIC_SITE_URL` — canonical URL used by metadata, robots and the sitemap. Set it
  to the production origin before launch.

Admin sessions last seven days. The `psp_admin_session` cookie is HTTP-only, SameSite
Lax and `Secure` in production, so production admin access must be served over HTTPS.
The local development server does not require HTTPS.

## Deploying to Vercel with Supabase

1. Create a Supabase project. Copy the **transaction pooler** Postgres URI from the
   project's Connect panel and replace the password placeholder.
2. In Supabase Storage, create a **public** bucket named `property-images`.
3. Add every variable from the Environment section to the Vercel project. Mark
   `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `ADMIN_PASSWORD` and
   `ADMIN_SESSION_SECRET` as sensitive.
4. Set `NEXT_PUBLIC_SITE_URL=https://prime-livid-five.vercel.app` before building, because
   public environment values are embedded at build time.
5. Deploy, then open the site once. The first database request creates the schema, default
   settings and starter listings. You can also run `supabase/schema.sql` manually in the
   Supabase SQL editor.
6. Sign in at `/admin` and upload one cover image and one gallery image to verify the
   bucket and service-role key.

Changing Vercel environment variables requires a redeploy. The current failing Vercel
deployment predates these changes and still uses the old local-SQLite build.

## Routes

### Public

| Route | Purpose |
| --- | --- |
| `/` | Home, search, featured properties and areas |
| `/properties` | Catalogue with purpose, location, type, bedroom, search and sort filters |
| `/property/[slug]` | Property detail, gallery, JSON-LD and viewing enquiry |
| `/about` | Positioning, areas and how the process works |
| `/contact` | Contact details, general enquiry form and FAQ |
| `/privacy` | Plain-language privacy note |
| `/robots.txt`, `/sitemap.xml` | Generated from the current data and site URL |

### Admin

| Route | Purpose |
| --- | --- |
| `/admin/login` | Password login |
| `/admin` | Overview, counts, recent properties and enquiries |
| `/admin/properties` | Property list with edit, view and delete |
| `/admin/properties/new` | Create a property and upload images |
| `/admin/properties/[id]` | Edit or delete a property |
| `/admin/enquiries` | Enquiry inbox with status filters and actions |
| `/admin/settings` | Phone, WhatsApp, Facebook and viewing information |

## Data and storage

Supabase Postgres tables:

- `properties` — listing content, `JSONB` gallery/features/amenities, status and
  timestamps.
- `enquiries` — contact details, optional property reference, message, source and status
  (`new`, `handled`, `archived`).
- `settings` — key/value site settings used by the header, footer, contact page and
  WhatsApp links.

The schema is created on first database access from `lib/db.ts`; `supabase/schema.sql`
contains the same schema for manual setup or review. Row-level security is enabled with no
public policies, so the public Supabase APIs cannot read or write these tables. The app
connects directly with the Postgres role.

The database is seeded with 12 starter properties from `lib/seed-data.ts` and default
settings from `lib/defaults.ts` only when the properties table is empty. Deleting all
properties resets it to starter content on the next request.

Uploaded images are written to the public Supabase Storage bucket named by
`SUPABASE_STORAGE_BUCKET` and stored as absolute public URLs. Uploads are limited to JPEG,
PNG, WebP or AVIF and 8 MB per file. Manually entered image paths must start with `/`.

**Production storage:** both Vercel and Supabase must have the environment variables above.
The bucket must exist and be public; database rows and image objects persist independently
of Vercel deployments.

## Editing content

Use the admin area for routine changes:

1. **Properties** — add or edit a listing, set sale/rent, publish or keep as a draft,
   upload a cover and gallery, and mark featured listings.
2. **Enquiries** — review saved enquiries, open WhatsApp to the enquirer, mark them
   handled, archive them or delete them.
3. **Settings** — update phone numbers, WhatsApp, Facebook URL, viewing hours and office
   note without editing code.

Properties can be drafts, so incomplete listings can be prepared privately. Drafts are
excluded from the public catalogue and property URLs. Changing a slug breaks old links.

Starter areas and property types live in `lib/areas.ts` and `lib/defaults.ts`.

## How enquiries work

The property and contact forms validate in the browser and POST JSON to
`/api/enquiries`. The API:

1. Rejects honeypot submissions, short names/phone numbers and over-limit requests.
2. Checks that a referenced property is still published.
3. Saves the enquiry in Supabase Postgres with status `new`.
4. Returns a pre-filled WhatsApp URL.

The browser opens WhatsApp only after the API responds successfully. If WhatsApp is
unavailable, the form falls back to a direct link. Enquiries are stored even when the
visitor never completes the WhatsApp message, and can be reviewed in `/admin/enquiries`.

The privacy page discloses this database storage. Review the wording against the actual
retention and access policy before launch.

## Verification

The following were run against the production build with an isolated PostgreSQL database:

```bash
npm run lint
npm run typecheck
npm run build
```

Smoke checks covered:

- Public routes, property detail pages, `robots.txt` and `sitemap.xml`.
- Unauthenticated admin redirect to `/admin/login`.
- Wrong-password rejection, successful login, unauth redirect and signed-session access to all admin pages.
- Property create, update and delete through the admin forms.
- Settings save reflected on the public contact page.
- Enquiry API persistence, admin status update and delete.
- WhatsApp URL generation.
- Supabase Storage uploads are not covered without project credentials; test one cover and
  one gallery upload in the deployed admin before launch.

No browser automation suite is committed to the repository. Add one before treating the
UI as regression-tested.

## Project structure

```text
app/
├── (site)/                  Public layout and pages
├── admin/                   Admin login and dashboard route group
├── api/enquiries/           Enquiry API and WhatsApp handoff
├── globals.css              Tailwind theme and shared component classes
├── layout.tsx               Fonts, metadata and root layout
├── robots.ts, sitemap.ts
actions/                     Server actions for auth, properties, settings and enquiries
components/                  Public and admin UI components
lib/                         Types, Postgres, queries, auth, uploads and seed data
public/images/               Logo and illustrative stock photography
supabase/schema.sql          Database schema for manual setup/review
```

## Launch checklist

- Replace all 12 starter listings with verified inventory and owned photography.
- Confirm real prices, rent, service charges, deposits and availability.
- Confirm the exact office address, map pin and viewing procedure.
- Replace the Facebook search URL with the exact page URL.
- Confirm business hours and update the viewing note.
- Set `NEXT_PUBLIC_SITE_URL`, a strong `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`.
- Serve production over HTTPS so the secure admin cookie works.
- Create the Supabase project, public `property-images` bucket and Vercel environment
  variables; back up the Supabase database.
- Test both phone numbers and the WhatsApp handoff on a real phone.
- Have the privacy note reviewed against how enquiries are actually stored and handled.
- Add browser-level tests for the public filters, enquiry forms and admin CRUD.
- Consider spam protection stronger than the in-memory rate limiter if traffic grows.

## Image and font licensing

Photographs in `public/images/` were downloaded from Unsplash for this prototype.
Unsplash images are provided under the Unsplash License; check the current licence and
retain photographer credit where required. Replace them with owned or licensed property
photography before launch. Fraunces and Manrope are open-source Google Fonts loaded
through `next/font`.
