# Prime Sahara Properties — website and CMS

A React property website and small content manager for **Prime Sahara Properties**,
covering Kitengela, Lang'ata and Juja. The public site separates sale and rental
listings, shows property details and sends every enquiry to the team by WhatsApp. The
admin area manages properties, photographs, enquiries and contact settings.

Built with Next.js, React, Tailwind CSS and SQLite. There is no external CMS, ORM or
tracking service.

## Status

This is a working prototype, not a published inventory. The public site, admin login,
property CRUD, image uploads, settings, enquiry storage and WhatsApp handoff have been
exercised against a production build. The listings are **starter content** and must be
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
- **SQLite** through Node's built-in `node:sqlite` module
- No ORM, database server, analytics or third-party form service

Use Node.js 22.5 or newer so that `node:sqlite` is available. The app was tested on
Node 26.5.1.

## Run locally

```bash
cd /home/aucxley/Work/prime
cp .env.example .env.local
npm install
npm run dev
```

Open <http://localhost:3000>. The database and 12 starter listings are created on first
database access. The admin area is at <http://localhost:3000/admin>.

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
DATABASE_PATH=./data/prime.db
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- `ADMIN_PASSWORD` — required in production. If it is unset in production, admin login is
  disabled.
- `ADMIN_SESSION_SECRET` — used to sign the admin session cookie. Use a long random value
  in production. If unset in production, a process-local random fallback is used, so
  sessions do not survive a restart.
- `DATABASE_PATH` — optional. Defaults to `./data/prime.db`.
- `NEXT_PUBLIC_SITE_URL` — canonical URL used by metadata, robots and the sitemap. Set it
  to the production origin before launch.

Admin sessions last seven days. The `psp_admin_session` cookie is HTTP-only, SameSite
Lax and `Secure` in production, so production admin access must be served over HTTPS.
The local development server does not require HTTPS.

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

SQLite tables:

- `properties` — listing content, JSON-encoded gallery/features/amenities, status and
  timestamps.
- `enquiries` — contact details, optional property reference, message, source and status
  (`new`, `handled`, `archived`).
- `settings` — key/value site settings used by the header, footer, contact page and
  WhatsApp links.

The database is seeded with 12 starter properties from `lib/seed-data.ts` and default
settings from `lib/defaults.ts` only when the properties table is empty. Deleting the
database resets it to starter content on the next request.

Database files are ignored by git:

```text
data/*.db
data/*.db-*
```

Uploaded images are written to `public/uploads/` and served from `/uploads/...`.
Gallery and cover paths must start with `/`; remote image URLs are rejected. Uploads are
limited to JPEG, PNG, WebP or AVIF and 8 MB per file.

**Production storage:** both `data/` and `public/uploads/` must live on persistent disk.
This setup is suitable for a VPS or container with a volume, not an ephemeral serverless
filesystem. For serverless deployment, replace local SQLite/uploads with a managed
database and object storage.

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
3. Saves the enquiry in SQLite with status `new`.
4. Returns a pre-filled WhatsApp URL.

The browser opens WhatsApp only after the API responds successfully. If WhatsApp is
unavailable, the form falls back to a direct link. Enquiries are stored even when the
visitor never completes the WhatsApp message, and can be reviewed in `/admin/enquiries`.

The privacy page discloses this database storage. Review the wording against the actual
retention and access policy before launch.

## Verification

The following were run against the production build with an isolated SQLite database:

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
lib/                         Types, SQLite, queries, auth, uploads and seed data
public/images/               Logo and illustrative stock photography
public/uploads/              Admin-uploaded property images
data/                        Local SQLite database (ignored by git)
```

## Launch checklist

- Replace all 12 starter listings with verified inventory and owned photography.
- Confirm real prices, rent, service charges, deposits and availability.
- Confirm the exact office address, map pin and viewing procedure.
- Replace the Facebook search URL with the exact page URL.
- Confirm business hours and update the viewing note.
- Set `NEXT_PUBLIC_SITE_URL`, a strong `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`.
- Serve production over HTTPS so the secure admin cookie works.
- Mount persistent storage for `data/` and `public/uploads/`, and back up the database.
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
