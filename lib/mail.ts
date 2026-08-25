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

/** Field order matches the form, so the email reads the way it was filled in. */
const FIELD_LABELS: { key: string; tr: string; en: string }[] = [
  { key: 'name', tr: 'Ad Soyad', en: 'Name' },
  { key: 'company', tr: 'Firma', en: 'Company' },
  { key: 'email', tr: 'E-posta', en: 'Email' },
  { key: 'phone', tr: 'Telefon', en: 'Phone' },
  { key: 'application', tr: 'Uygulama', en: 'Application' },
  { key: 'fluid', tr: 'Akışkan', en: 'Fluid' },
  { key: 'flow', tr: 'Debi', en: 'Flow rate' },
  { key: 'pressure', tr: 'Basınç', en: 'Pressure' },
  { key: 'viscosity', tr: 'Viskozite', en: 'Viscosity' },
  { key: 'temperature', tr: 'Sıcaklık', en: 'Temperature' },
  { key: 'message', tr: 'Proses notları', en: 'Process notes' },
]

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

export function renderInquiry(fields: Record<string, string>, locale: Locale) {
  const rows = FIELD_LABELS.filter((f) => fields[f.key]).map((f) => ({
    label: locale === 'tr' ? f.tr : f.en,
    value: fields[f.key],
  }))

  const subject =
    locale === 'tr'
      ? `Teknik talep: ${fields.company || fields.name}`
      : `Technical inquiry: ${fields.company || fields.name}`

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
