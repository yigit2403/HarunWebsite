# Parked server-side code

Nothing in this directory is built, imported, or deployed. It is kept, and kept
type-correct, because it is the site's server-side half — written, working, and
switched off when the site moved to Linux shared hosting, where there is no Node
process to run it.

## What is here

| Path | Was | Replaced by |
| --- | --- | --- |
| `api/inquiry-route.ts` | `POST /api/inquiry` — validated the contact form, emailed or webhooked it, stored it either way | `public/inquiry.php` |
| `api/collect-route.ts` | `POST /api/collect` — the analytics beacon's endpoint | the host's own log statistics (AWStats, Webalizer) |
| `admin/` | `/admin` — the analytics dashboard, behind HTTP Basic auth | as above |
| `analytics/` | the event store, the aggregation, and the browser beacon | as above |
| `mail.ts` | inquiry email via Resend | PHP `mail()`, delivering to a mailbox on the same host |

The locale redirect that lived in `proxy.ts` alongside these is the one piece
still in use: it runs in `next dev`, and `public/.htaccess` performs it in
production.

## Why it was not simply deleted

Two of these decisions are reversible and may want reversing:

- **Analytics.** Server log analytics counts crawlers and cannot see a click
  that does not request a URL — notably which document a visitor asked for,
  since every document row links to the same contact anchor. That signal now
  travels with the inquiry itself, which is better, but the dashboard showed
  things the logs do not.
- **Inquiry storage.** The Node route stored every inquiry as well as sending
  it, so nothing was lost when email was misconfigured. `inquiry.php` has no
  store: if `mail()` fails it answers 503 and the form shows the phone number.

If the site moves back to a host that runs Node — Vercel, a VPS, or a panel's
Node.js application manager — putting these back is a matter of moving the
files to where Next.js expects them:

```
server/api/inquiry-route.ts  ->  app/api/inquiry/route.ts
server/api/collect-route.ts  ->  app/api/collect/route.ts
server/admin/               ->  app/admin/          (admin.css back to styles/)
server/admin/Charts.tsx     ->  components/admin/Charts.tsx
server/analytics/Beacon.tsx ->  components/analytics/Beacon.tsx
server/analytics/*.ts       ->  lib/analytics/
server/mail.ts              ->  lib/mail.ts
```

then reversing the four things done to switch them off:

1. `next.config.ts` — drop `output: 'export'` and `images.unoptimized`.
2. `app/[locale]/layout.tsx` — mount `<Beacon locale={locale} />` again.
3. `proxy.ts` — restore the `/admin` Basic auth branch (see git history).
4. `components/forms/InquiryForm.tsx` — point `ENDPOINT` at `/api/inquiry`.

The imports inside these files already use `@/server/...` paths, so they will
need updating to match wherever the files land.
