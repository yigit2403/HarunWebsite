import { APPLICATIONS } from '@/content/applications'
import { INQUIRY_FIELDS, INQUIRY_SUBJECT } from '@/content/inquiry'
import { findDocument } from '@/content/pages'
import type { Locale } from '@/lib/i18n'

/**
 * Inquiry email forwarding.
 *
 * Built and dormant. Profimann has no mailbox for the site yet, so nothing here
 * is switched on: with the variables below unset, `sendInquiryMail` reports
 * `not_configured` and the caller falls back to storing the inquiry so it is
 * still readable in the admin panel. Nothing is dropped in the meantime.
 *
 * To switch it on, set all three:
 *
 *   INQUIRY_TO_EMAIL     where inquiries land, e.g. info@liquilob.com
 *   INQUIRY_FROM_EMAIL   a sender on a domain verified with the provider,
 *                        e.g. site@liquilob.com
 *   RESEND_API_KEY       https://resend.com, one HTTP call, no SDK needed
 *
 * Another provider is a change to `deliver` alone. For plain SMTP, add
 * nodemailer and swap the fetch for a transport; the rest of the file, and the
 * inquiry route, stay as they are.
 */

export type MailConfig = {
  to: string
  from: string
  apiKey: string
}

export type MailResult =
  | { ok: true; via: 'resend' }
  | { ok: false; reason: 'not_configured' | 'failed' }

export function mailConfig(): MailConfig | null {
  const to = process.env.INQUIRY_TO_EMAIL
  const from = process.env.INQUIRY_FROM_EMAIL
  const apiKey = process.env.RESEND_API_KEY
  if (!to || !from || !apiKey) return null
  return { to, from, apiKey }
}

export function mailConfigured(): boolean {
  return mailConfig() !== null
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/**
 * Two fields store an id rather than the words the visitor saw. The email
 * shows what they picked: "dairy" and "catalogue" are not what the person
 * reading the mailbox is looking for.
 */
function readValue(key: string, value: string, locale: Locale): string {
  if (key === 'application') {
    return APPLICATIONS.find((a) => a.key === value)?.name[locale] ?? value
  }
  if (key === 'doc') return findDocument(value)?.title[locale] ?? value
  return value
}

export function renderInquiry(fields: Record<string, string>, locale: Locale) {
  const rows = INQUIRY_FIELDS.filter((f) => fields[f.key]).map((f) => ({
    label: f.label[locale],
    value: readValue(f.key, fields[f.key], locale),
  }))

  const kind = fields.doc ? 'document' : 'inquiry'
  const subject = `${INQUIRY_SUBJECT[kind][locale]}: ${fields.company || fields.name}`

  const text = rows.map((r) => `${r.label}: ${r.value}`).join('\n')

  const html = `<table style="border-collapse:collapse;font:14px/1.5 Helvetica,Arial,sans-serif;color:#111">
${rows
  .map(
    (r) =>
      `<tr><th align="left" style="padding:6px 16px 6px 0;vertical-align:top;color:#5c5c5c;font-weight:600;white-space:nowrap">${escapeHtml(
        r.label
      )}</th><td style="padding:6px 0;vertical-align:top">${escapeHtml(r.value).replace(/\n/g, '<br>')}</td></tr>`
  )
  .join('\n')}
</table>`

  return { subject, text, html }
}

export async function sendInquiryMail(
  fields: Record<string, string>,
  locale: Locale
): Promise<MailResult> {
  const config = mailConfig()
  if (!config) return { ok: false, reason: 'not_configured' }

  const { subject, text, html } = renderInquiry(fields, locale)

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${config.apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from: config.from,
        to: [config.to],
        subject,
        text,
        html,
        // So a reply from the mailbox goes straight back to the enquirer.
        reply_to: fields.email || undefined,
      }),
    })
    if (!response.ok) throw new Error(`resend responded ${response.status}`)
    return { ok: true, via: 'resend' }
  } catch (error) {
    console.error('[mail] delivery failed', error)
    return { ok: false, reason: 'failed' }
  }
}
