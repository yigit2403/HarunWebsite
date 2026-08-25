# Profimann / Liquilob

Bilingual (Turkish and English) industrial website for **Profimann Makine San. Tic. Ltd. Şti.**
and its rotary lobe pump brand **Liquilob**.

Next.js App Router, TypeScript, hand-written CSS on a token system. No UI framework,
no CSS framework, no animation library.

```bash
npm install
npm run dev      # http://localhost:3210
npm run build
npm start
```

---

## Language and URLs

Every page exists at a localised address. There are no unlocalised routes.

| Page | Turkish | English |
| --- | --- | --- |
| Home | `/tr` | `/en` |
| Catalogue | `/tr/urunler` | `/en/products` |
| Product | `/tr/urunler/lql-100` | `/en/products/lql-100` |
| Rotor technologies | `/tr/rotor-teknolojileri` | `/en/rotor-technologies` |
| Applications | `/tr/uygulamalar` | `/en/applications` |
| Application | `/tr/uygulamalar/sut-urunleri` | `/en/applications/dairy` |
| Engineering | `/tr/muhendislik` | `/en/engineering` |
| About | `/tr/kurumsal` | `/en/about` |
| Resources | `/tr/teknik-kaynaklar` | `/en/technical-resources` |
| Contact | `/tr/iletisim` | `/en/contact` |

One table drives all of it: [`lib/routes.ts`](lib/routes.ts). Adding a page means adding one
row there. That row feeds routing, `generateStaticParams`, the header, the footer, the
sitemap and the language switcher, so none of them can drift apart.

`proxy.ts` sends a bare path to `/tr`, or to `/en` when the browser asks for English.
Model codes (`lql-100`) are identical in both languages; application slugs are translated.

### A note on Turkish uppercase

`<html lang="tr-TR">` makes CSS `text-transform: uppercase` follow Turkish casing rules, so
`i` becomes `İ`. That is correct for Turkish words and wrong for the brand: `Liquilob` would
print as `LİQUİLOB`. Where a brand name appears inside uppercase text it is either already
uppercase in the source string or wrapped in `lang="en"`. Keep that in mind before adding a
new uppercase label containing "Liquilob" or "Profimann".

---

## Where the content lives

All copy, in both languages, sits in `content/`. Nothing is hardcoded in a component.

| File | Holds |
| --- | --- |
| `content/site.ts` | Company facts: legal name, phone, address, domains |
| `content/dict.ts` | Interface strings: navigation, labels, table headers, form chrome |
| `content/pages.ts` | Page prose: home sections, about, engineering, resources, contact |
| `content/products.ts` | The four LQL models and their specifications |
| `content/rotors.ts` | The four rotor geometries |
| `content/configurations.ts` | Jacketed and PP body variants |
| `content/applications.ts` | The seven application pages |

Editing Turkish and English side by side is the point: every entry is
`{ tr: '...', en: '...' }`, so a missing translation is a TypeScript error rather than a
silent gap on the page.

---

## Two things that are deliberately unfinished

### 1. Specification values are provisional

`content/site.ts` exports `SPECS_ARE_PROVISIONAL = true`. While it is true, every
specification table renders a visible advisory saying the figures are preliminary and under
verification.

The numbers currently in `content/products.ts` follow the internal geometry of the series
(displacement × speed × 60 gives the stated capacity, for all four frames) so the catalogue
is dimensionally coherent for review. **They are not measured test data.** Replace them with
Profimann's verified figures and set the flag to `false`; the advisories disappear on their
own.

### 2. Photography is partial

Profimann has supplied the product render, an installation shot, the rotor family and the
logo, and all four are in use. Two positions are still reserved (`manufacturing`,
`assembly`) and render as measured, labelled frames rather than stock stand-ins. See
[PHOTOGRAPHY.md](PHOTOGRAPHY.md) for the shot list, the processing that was applied to the
supplied files, and how to drop new ones in.

Documents behave the same way. Nothing links to a catalogue PDF that has not been issued;
every document row routes to the inquiry form with the document named.

---

## The contact form and email forwarding

```bash
cp .env.example .env.local
```

`components/forms/InquiryForm.tsx` posts to `app/api/inquiry/route.ts`, which tries three
things in order and records the inquiry either way:

| Step | Needs | Status |
| --- | --- | --- |
| 1. Email | `INQUIRY_TO_EMAIL` + `INQUIRY_FROM_EMAIL` + `RESEND_API_KEY` | **Built, currently off.** Profimann has no mailbox for the site yet. |
| 2. Webhook | `INQUIRY_WEBHOOK_URL` | Optional. CRM intake, Zapier, Make, or a Slack or Teams incoming webhook. |
| 3. Store | always | So nothing is lost while 1 and 2 are off. |

**Turning email on later is three environment variables and a redeploy.** Nothing in the
code needs to change. Sign up at [resend.com](https://resend.com), verify the `liquilob.com`
domain, then set:

```bash
INQUIRY_TO_EMAIL=info@liquilob.com      # wherever inquiries should land
INQUIRY_FROM_EMAIL=site@liquilob.com    # a sender on the verified domain
RESEND_API_KEY=re_...
```

The email is laid out in `lib/mail.ts` with the fields in the order the form asks them, and
`reply_to` set to the enquirer, so replying from the mailbox goes straight back to them.
For a different provider, change the `deliver` call in that file and nothing else; for plain
SMTP, add nodemailer and swap the `fetch` for a transport.

Until then, every inquiry appears in `/admin` flagged **not forwarded**, and the panel
carries a banner saying forwarding is off. The route only reports success when the message
actually went somewhere durable: if it can neither forward nor store, it answers `503` and
the form sends the visitor to the phone number rather than claiming it was sent.

---

## Showing it to a client before launch

Deploy it as a preview. The site is built so a review deployment cannot damage the
eventual launch:

- **`robots.txt` refuses every crawler** unless the build is production *and*
  `NEXT_PUBLIC_SITE_URL` is set. Both conditions, not either.
- **Every page also carries `noindex, nofollow`** on a non-production build, because a
  direct link bypasses `robots.txt` entirely.
- **Canonical URLs and the sitemap follow the deployment**, so a preview does not announce
  itself as `liquilob.com` before that domain exists.

`lib/deployment.ts` decides this from `VERCEL_ENV`, or from `SITE_STAGE` if you host it
somewhere else. Nothing has to be remembered at deploy time; the safe state is the default,
and indexing has to be switched on deliberately.

When the real domain is ready, set `NEXT_PUBLIC_SITE_URL=https://www.liquilob.com` on the
production environment only. That single variable is what flips indexing on.

---

## The admin panel

`/admin` — first-party analytics, behind HTTP Basic auth, no third-party service and no
cookies. Because it stores nothing that identifies a person, the site needs no consent
banner.

```bash
ADMIN_USER=admin
ADMIN_PASSWORD=<something long>
```

**With `ADMIN_PASSWORD` unset the panel refuses to serve at all** (503), so forgetting to
configure it fails closed rather than leaving the page open. Auth is enforced in `proxy.ts`,
which also stamps `x-robots-tag: noindex`; `/admin` is disallowed in `robots.txt` and absent
from the sitemap.

It shows page views, sessions, inquiries and document requests with period-on-period
deltas, a daily trend, top pages, referring sites, language split, devices, and the full
text of recent inquiries. **Most requested documents** is the one to watch right now: the
document library is not published, so that panel says which document to produce first.

### Where the data lives

Choose an adapter with an environment variable. The panel tells you which one is active.

| Set this | Adapter | Use when |
| --- | --- | --- |
| `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` | Redis over REST | Vercel or any serverless host |
| `ANALYTICS_DATA_DIR=/var/lib/liquilob` | One JSONL file per month | Your own server running `next start` |
| neither | In memory | Development. **Lost on restart**, and the panel says so in a banner. |

Swapping in Postgres later means implementing `append` and `read` in
`lib/analytics/store.ts`. Nothing else knows which adapter is in use.

### What is and is not collected

Collected: pathname, language, referring **hostname**, viewport width, and a random session
id held in `sessionStorage` that dies with the tab.

Not collected: no cookie, no IP address, no cross-site identifier, no fingerprint. Query
strings are stripped from paths and referrers are reduced to a bare hostname before storage,
because both are the usual way personal data leaks into an analytics log. The beacon honours
Do Not Track and Global Privacy Control and sends nothing when either is set.

---

## The design system

Tokens are the contract. Nothing outside `styles/tokens.css` should introduce a colour, a
type size or a spacing value.

| File | Scope |
| --- | --- |
| `styles/tokens.css` | Colour, typography, spacing, grid, radius, motion, z-index |
| `styles/base.css` | Reset, document defaults, focus, reduced-motion policy |
| `styles/layout.css` | Container, grid, section bands, the red-rule heading motif |
| `styles/nav.css` | Brand lockup, header, drawer, footer |
| `styles/components.css` | Buttons, cards, tables, downloads, forms, figures |
| `styles/pages.css` | Hero, dark band, product detail, contact, CTA |
| `styles/drawing.css` | The line vocabulary for every SVG |

Rules the whole site keeps:

- **One accent.** `--red` is `#cc0c0c`, sampled from the supplied logo artwork rather than
  guessed. On the dark slab it becomes `--red-on-dark`, the lighter variant that clears AA
  against `#141414`.
- **One shape rule.** Interactive elements are 2px. Containers are 0px. Nothing is rounder.
- **No shadows.** Depth comes from surface contrast and hairlines.
- **Four surfaces.** `--canvas`, `--cloud`, `--fog`, `--slab`. Two bands of the same surface
  never sit next to each other.
- **Numbers run mono.** Capacities, pressures, dimensions and the phone number are all
  IBM Plex Mono, tabular.
- **Red is never the only signal.** Active navigation carries `aria-current` as well as the
  red underline.

### The drawings

Photographs sell the machine; drawings explain it. Both are used, and neither does the
other's job.

`components/graphics/` holds a side elevation, a chamber cross-section, a performance-curve
frame and a dimensioned outline. The rotor profiles in `components/graphics/rotors.ts` are
**generated, not drawn**: all four geometries are one equation, `r(t) = a + b·cos(n·t)`, at
four lobe counts, with the bore held at a constant radius so the four diagrams are directly
comparable. Regenerate with:

```bash
node tools/rotors.js
```

That script also solves the meshing index numerically and refuses to emit a pair that
collides, so the clearances the diagrams show are measured rather than assumed.

### Why the drawing styles are in CSS

Browsers do not resolve `var()` inside an SVG presentation attribute, so
`fill="var(--canvas)"` silently paints black. Every drawing style is a class in
`styles/drawing.css` for that reason. If you add a drawing, give its elements classes; do
not put tokens in attributes.

---

## Motion (public site)

One effect: a short fade with a 12px lift as an element enters the viewport, driven by a
single `IntersectionObserver` in `components/ui/Reveal.tsx`. Server components mark an
element with `data-reveal=""` and that is the whole contract, so the JavaScript shipped does
not grow with the length of the page.

There is no scroll listener anywhere on this site. Under `prefers-reduced-motion` the CSS
shows everything immediately and the observer exits without doing any work.

---

## Accessibility

- Semantic landmarks, one `h1` per page, headings in order.
- Skip link to `#main`.
- Focus is never removed: 3px ink outline on light surfaces, white on dark slabs. Red is
  never used as a focus ring because it disappears against the red CTA.
- Specification tables are horizontally scrollable inside a focusable `role="region"`, so a
  keyboard user can pan them. No specification is hidden on mobile.
- Form labels sit above their inputs. No placeholder is used as a label.
- Contrast: body text 6.7:1, muted footer text 7.9:1, red on white and white on red 5.8:1.

### A note on Turkish uppercase, again

The admin panel's document is `lang="tr"`, so its English view sets `lang` on the panel
wrapper. Without that, `text-transform: uppercase` renders "Page views" with a dotted capital
I. The same trap applies anywhere uppercase English appears inside a Turkish document.
