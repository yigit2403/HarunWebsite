# Profimann / Liquilob

Bilingual (Turkish and English) industrial website for **Profimann Makine San. Tic. Ltd. Şti.**
and its rotary lobe pump brand **Liquilob**.

Next.js App Router, TypeScript, hand-written CSS on a token system. No UI framework,
no CSS framework, no animation library.

The site is **exported as static files** and uploaded to Linux shared hosting — cPanel or
DirectAdmin, on Apache or LiteSpeed. There is no Node process in production: `npm run build`
produces `out/`, and `out/` is the website. See [Deploying](#deploying).

Live at **https://www.liquilob.com**.

```bash
npm install
npm run dev      # http://localhost:3210 — writing, design, everything except the form
npm run build    # generates images and data, then exports the site to out/
npm run preview  # serves out/ with PHP, so the contact form works too
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

A bare path is sent to `/tr`, or to `/en` when the browser asks for English. This happens
in two places, because a static site has no middleware: [`proxy.ts`](proxy.ts) does it in
`next dev`, and [`public/.htaccess`](public/.htaccess) does it on the server. **They must be
changed together.** Model codes (`lql-100`) are identical in both languages; application
slugs are translated.

Exported pages are directories: `/tr/urunler/` is `out/tr/urunler/index.html`. Apache serves
it from its `DirectoryIndex` and redirects the slashless form, so every address the sitemap
and the canonical tags name is the one that answers `200`.

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
| `content/inquiry.ts` | The contact form's fields, and how they are labelled in the email |

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
is dimensionally coherent for review. **They are not measured test data.**

Each model has one `specs` block and everything derives from it: the catalogue card, the
comparison table on the catalogue page, the key specifications on the detail page and the
technical data table. So replacing a figure is a single edit that cannot leave a stale copy
behind somewhere else. When Profimann's verified data arrives, update those four blocks and
set `SPECS_ARE_PROVISIONAL` to `false`; the advisories disappear on their own.

### 2. Photography is partial

Profimann has supplied the product render, an installation shot, the rotor family and the
logo, and all four are in use. Two positions are still reserved (`manufacturing`,
`assembly`) and render as measured, labelled frames rather than stock stand-ins. See
[PHOTOGRAPHY.md](PHOTOGRAPHY.md) for the shot list, the processing that was applied to the
supplied files, and how to drop new ones in.

Documents behave the same way. Nothing links to a catalogue PDF that has not been issued;
every document row routes to the inquiry form with the document named.

---

## The contact form

[`components/forms/InquiryForm.tsx`](components/forms/InquiryForm.tsx) posts JSON to
[`public/inquiry.php`](public/inquiry.php), which validates it and emails it to Profimann.
PHP rather than a route handler because the site is static: the script is uploaded beside
the HTML and runs on the host's own PHP.

**It is live.** The two addresses are set in an `inquiry-config.php` sitting beside
`inquiry.php` on the server:

```php
<?php
$INQUIRY_TO = '...';     // where inquiries land
$INQUIRY_FROM = '...';   // the site's sending identity
```

They are **deliberately not in this repository** — partly so they are not published
alongside the code, and partly because that file is not part of the build, so a redeploy
cannot overwrite them. Ship the defaults in `inquiry.php` empty; an empty `$INQUIRY_TO`
makes the endpoint answer `503` and the form show the phone number, which is the correct
behaviour for a build that has not been configured yet rather than a failure.

Both addresses are on **the same domain, on the same server**, so form mail is delivered
locally and never leaves the machine: no SPF evaluation, no relay, no spam classification in
the path. Where the sender's domain does not host the site, this still works — the envelope
sender is set with `-f` so that domain's SPF record covers the message — but local delivery
is the most reliable arrangement available and worth keeping.

`Reply-To` is set to the enquirer, so replying from the mailbox goes to the customer rather
than back to the site's own address.

### One description of the fields, not two

PHP cannot read the TypeScript the rest of the site is written in, and a second copy of the
field labels would be wrong the first time someone added a document. So there is no second
copy: [`content/inquiry.ts`](content/inquiry.ts) describes the fields, and
[`tools/inquiry-data.mjs`](tools/inquiry-data.mjs) writes them — with the document and
application lists — to `public/inquiry-data.json` at build time. `inquiry.php` reads that.

Adding a field is a row in `content/inquiry.ts` and an input in the form. **Editing
`inquiry.php` to add a field is a mistake.**

The generated JSON is denied over HTTP in `.htaccess`; the script reads it from disk.

### Which document was asked for

No catalogue or datasheet exists as a file yet, so every **Talep Et / Request** row in
`components/ui/DocList.tsx` routes to the inquiry form rather than to a download. The
document id travels with it as `?doc=`, the form names the document above the fields, and
submits it as a hidden field.

That makes the request legible where it lands. The email subject reads **Doküman talebi /
Document request** instead of the usual technical-inquiry line, so the mailbox can be sorted
on it, and the document is the first row of the email.

This is the answer to *which document do we produce first*. It used to be a click counted
by the analytics beacon; carrying it on the inquiry instead is what let that beacon go when
the site moved to static hosting, because an id attached to a named company survives where
an anonymous click count does not.

The id is checked against the document list before anything is emailed — `findDocument` in
`content/pages.ts` on the client, the same list via `inquiry-data.json` in the PHP. The
endpoint is public, so a posted value that is not a real document id is dropped rather than
echoed into the mailbox.

---

## Deploying

**Push to `main`.** [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds the
site and uploads it over FTPS, to every document root the site is served from. A pull
request is built and checked but never deployed.

It needs three repository secrets — *Settings → Secrets and variables → Actions*:

| Secret | Value |
| --- | --- |
| `FTP_SERVER` | the hostname from the hosting panel |
| `FTP_USERNAME` | the DirectAdmin account username |
| `FTP_PASSWORD` | that account's password, or a dedicated FTP account's |

The workflow uploads incrementally and keeps its own sync state on the server, so a redeploy
transfers only what changed and removes what no longer exists — which is what stops old
content-hashed `_next/` chunks accumulating. `inquiry-config.php` and `.well-known/` are
excluded, so the mailbox settings and Let's Encrypt renewals are never touched.

Before uploading it checks that the build actually produced a servable site: `.htaccess`,
`inquiry.php`, `inquiry-data.json`, both home pages, and a `robots.txt` that lets crawlers
in. Each of those has a specific failure it catches — a missing `.htaccess` alone means the
site 404s at `/`.

### Deploying by hand

Still worth knowing, for a first upload to a new server or when the pipeline is not an
option.

```bash
SITE_STAGE=production NEXT_PUBLIC_SITE_URL=https://www.liquilob.com npm run build
```

That writes `out/`. Upload **the contents of `out/`** — not the folder itself. There is
nothing to install, nothing to restart, and no Node version to pick: it is HTML, CSS,
JavaScript, images, and one PHP file.

Three things in `out/` are easy to miss:

| File | Why it matters |
| --- | --- |
| `.htaccess` | The locale redirects, caching, the 404. FTP clients hide dotfiles by default — turn that off, or the site will 404 at `/`. |
| `inquiry.php` | The contact form. Needs `$INQUIRY_TO` set on the server; see above. |
| `inquiry-data.json` | Read by `inquiry.php`. Without it the form answers `503`. |

Uploading does not delete, so an `inquiry-config.php` you placed on the server survives a
redeploy. Nothing else on the server is written to by the site.

**Both environment variables are read at build time**, not on the server. Rebuilding without
them produces a site that tells crawlers to stay out — which is the point, further down.

### HTTPS and the www address belong to the panel, not to `.htaccess`

Both panels can force HTTPS and redirect a parked domain or pointer from their own settings,
and `.htaccess` ships with those rules **commented out** on purpose. Configuring the same
redirect in two places is how a loop happens: if the panel sends `www` to non-`www` while
`.htaccess` sends non-`www` to `www`, the two argue forever.

Set it in the panel. If you cannot, uncomment the CANONICAL URL block in
[`public/.htaccess`](public/.htaccess) — but check first that the panel is not already doing
it.

If neither does it, nothing breaks. Both hostnames answer, every page carries a
`<link rel="canonical">` naming the `www` address, and the sitemap lists only that one, so
search engines are told which version counts either way.

### cPanel

Upload into the document root **of the domain that serves this site**, which is not always
`public_html`:

- If `liquilob.com` is the account's **primary** domain, it is `public_html`.
- If the account was bought under a different domain — `profimann.com`, say — and
  `liquilob.com` was added afterwards as an **addon domain**, cPanel gives it a directory of
  its own, usually `public_html/liquilob.com/`. That directory *is* the document root for
  `liquilob.com`, so every root-relative path in the build resolves normally. Upload there
  and nothing else changes.

  The wrinkle: cPanel leaves that same directory reachable at
  `profimann.com/liquilob.com/`, and through that address the build's root-relative asset
  paths point at the wrong place, so the page renders unstyled. Nothing links to it and every
  page carries a canonical naming the real address, so it does no harm — but do not use that
  path to check the site, and do not send it to a client.

- **Force HTTPS** — *Domains*, then the toggle on the domain's row. AutoSSL issues the
  certificate; give it a few minutes after the domain resolves.
- **The `www` address** — served automatically. To make it redirect one way or the other,
  use *Domains* → *Redirects*.
- **PHP version** — *MultiPHP Manager*. Anything 7.4 or newer runs `inquiry.php`.
- **The mailbox** — *Email Accounts*. Create `info@liquilob.com` there, then put it in
  `$INQUIRY_TO`. Mail to a mailbox on the same server never leaves the machine.

### DirectAdmin

Upload into `domains/<your-domain>/public_html`, via File Manager or FTP. Not the account
root — DirectAdmin gives every domain its own tree.

- **`private_html`** — the one that catches people out. On older DirectAdmin setups HTTPS is
  served from `private_html` rather than `public_html`, so a site uploaded only to
  `public_html` looks fine on `http://` and empty on `https://`. In *Domain Setup* choose
  the option to use a **symbolic link from `private_html` to `public_html`**, then upload
  once. Newer versions default to this; check rather than assume.
- **Force HTTPS** — *SSL Certificates* for the certificate (Let's Encrypt), then the force
  HTTPS redirect option in *Domain Setup*.
- **Pointers** — DirectAdmin's equivalent of parked domains, under *Domain Pointers*. A
  pointer can be a plain alias or a redirect; pick redirect if you want one canonical
  hostname.
- **PHP version** — *Select PHP Version* per domain, if the host enables it.
- **The mailbox** — *E-Mail Accounts*, same as above.
- **Check the web server.** DirectAdmin hosts run Apache, LiteSpeed *or* nginx.
  **nginx ignores `.htaccess` entirely** — the site would still serve, but `/` would not
  redirect to `/tr/`, and the 404 and caching rules would not apply. If the host is
  nginx-only, ask them to add the equivalent `location` rules, or use a plan on Apache or
  LiteSpeed.

### How it is actually deployed

Recorded because none of it is derivable from this repository, and the next person to touch
it should not have to work it out from a control panel.

| | |
| --- | --- |
| Host | Güzel Hosting, DirectAdmin, **LiteSpeed** — so `.htaccess` is read in full |
| Registrar | İsimtescil, for both `liquilob.com` and `profimann.com` |
| Nameservers | Güzel's, set at İsimtescil. DNS, including the mail records, is managed in DirectAdmin |
| Account | Bought under `profimann.com`; `liquilob.com` was added afterwards as a second domain |
| Upload path | `domains/liquilob.com/public_html` — **not** the account root, which belongs to `profimann.com` |
| HTTPS | Let's Encrypt via DirectAdmin, forced in the panel rather than in `.htaccess` |
| Mailbox | Both the inquiry sender and recipient are on `profimann.com`, so form mail is delivered locally and never leaves the server. The addresses are in `inquiry-config.php` on the server, deliberately not in this repository |

Uploading is one zip rather than 282 files. From inside `out/`:

```bash
tar -a -c -f ../liquilob-site.zip .
```

Then upload and extract it in File Manager. **Do not use PowerShell's `Compress-Archive` or
Explorer's "Send to → Compressed folder"** — both write Windows backslashes as path
separators, and Linux `unzip` then produces 400 files with literal backslashes in their
names instead of a directory tree. `tar` writes the archive correctly.

On a redeploy, delete the old `_next/` first — asset filenames are content-hashed, so stale
chunks accumulate rather than being overwritten. Leave `inquiry-config.php` alone. The
pipeline handles both of these itself; this only applies to uploading by hand.

### Showing it to a client before launch

Upload the same `out/` to a temporary hosting address, built **without** those two variables.
The site is arranged so that a review copy cannot damage the eventual launch:

- **`robots.txt` refuses every crawler** unless the build is production *and*
  `NEXT_PUBLIC_SITE_URL` is set. Both conditions, not either.
- **Every page also carries `noindex, nofollow`** on a non-production build, because a
  direct link bypasses `robots.txt` entirely.
- **Canonical URLs and the sitemap follow the build**, so a review copy does not announce
  itself as `liquilob.com` before that domain exists.
- **`.htaccess` names no hostname**, so a temporary address cannot redirect itself to a
  domain that does not exist yet.

[`lib/deployment.ts`](lib/deployment.ts) decides this from `SITE_STAGE`. The safe state is
the default; indexing has to be switched on deliberately.

### If the server returns 500 after uploading

That is `.htaccess`, and almost always one directive the host does not support. Comment out
the `<IfModule mod_headers.c>` block first, then the `mod_expires` one. The `mod_rewrite`
block is the part the site actually needs.

---

## Analytics

There are none in the site. The host's own statistics cover it — **Metrics** in cPanel,
**Site Summary / Statistics / Logs** in DirectAdmin, both usually AWStats or Webalizer over
the raw access log. Between them you get page views, top pages, referrers, and the
Turkish/English split, which is just the URL prefix. Two things to know when reading them:

- **Server logs count crawlers**, and AWStats filters them imperfectly. The numbers read
  higher than a JavaScript beacon's would.
- **Server logs record IP addresses.** The first-party beacon this replaced deliberately did
  not, which is why the site still has no cookie banner — it sets no cookie and no
  client-side identifier. Request logging is ordinary and the host is the processor, but it
  is a different posture from what the code used to do.

What the logs cannot see is which document a visitor asked for, because every document row
links to the same contact anchor. That signal travels on the inquiry instead — see
[Which document was asked for](#which-document-was-asked-for).

The first-party analytics and the `/admin` dashboard that used to serve this purpose are
parked, intact, in [`server/`](server/README.md), along with the rest of the server-side
code. Nothing there is built or deployed; it is there because the decision to drop it is
reversible, and that file explains how.

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
