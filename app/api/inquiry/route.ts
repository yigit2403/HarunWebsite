import { NextResponse } from 'next/server'

import { analyticsStore } from '@/lib/analytics/store'
import type { InquiryEvent } from '@/lib/analytics/types'
import { DEFAULT_LOCALE, isLocale } from '@/lib/i18n'
import { sendInquiryMail } from '@/lib/mail'

/**
 * Technical inquiry endpoint.
 *
 * Delivery is attempted in order, and the inquiry is recorded either way:
 *
 *   1. Email        INQUIRY_TO_EMAIL + INQUIRY_FROM_EMAIL + RESEND_API_KEY
 *                   Dormant until Profimann's mailbox exists. See lib/mail.ts.
 *   2. Webhook      INQUIRY_WEBHOOK_URL
 *                   A CRM intake endpoint, Zapier, Make, or a Slack or Teams
 *                   incoming webhook.
 *   3. Store        always, so an inquiry is never lost while 1 and 2 are off.
 *                   It shows up in /admin, flagged as not yet forwarded.
 *
 * The response tells the truth about which of those happened. If the inquiry
 * was neither forwarded nor durably stored, this answers 503 and the form sends
 * the visitor to the phone number instead of claiming success.
 */

export const runtime = 'nodejs'

const MAX_FIELD = 4000

const FIELDS = [
  'name',
  'company',
  'email',
  'phone',
  'application',
  'fluid',
  'flow',
  'pressure',
  'viscosity',
  'temperature',
  'message',
] as const

function clean(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, MAX_FIELD)
}

async function forwardToWebhook(payload: unknown): Promise<boolean> {
  const webhook = process.env.INQUIRY_WEBHOOK_URL
  if (!webhook) return false
  try {
    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) throw new Error(`webhook responded ${response.status}`)
    return true
  } catch (error) {
    console.error('[inquiry] webhook delivery failed', error)
    return false
  }
}

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const fields: Record<string, string> = {}
  for (const field of FIELDS) fields[field] = clean(body[field])

  if (!fields.name || !fields.company || !fields.email) {
    return NextResponse.json({ error: 'missing_required_fields' }, { status: 422 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(fields.email)) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 422 })
  }

  // Honeypot: a real visitor never fills a field the form does not render.
  if (clean(body.website)) {
    return NextResponse.json({ ok: true }, { status: 202 })
  }

  const rawLocale = clean(body.locale)
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE

  const mail = await sendInquiryMail(fields, locale)
  const webhookOk = await forwardToWebhook({
    source: 'liquilob.com',
    receivedAt: new Date().toISOString(),
    locale,
    inquiry: fields,
  })

  const delivery: InquiryEvent['delivery'] = mail.ok ? 'mail' : webhookOk ? 'webhook' : 'stored'

  const store = analyticsStore()
  let stored = false
  try {
    await store.append({ type: 'inquiry', ts: Date.now(), locale, fields, delivery })
    stored = true
  } catch (error) {
    console.error('[inquiry] could not record inquiry', error)
  }

  if (delivery !== 'stored') {
    return NextResponse.json({ ok: true, delivery })
  }

  // Nothing forwarded it. That is fine only if it is somewhere durable that a
  // person actually reads.
  if (stored && store.persistent) {
    console.warn('[inquiry] no delivery target configured; inquiry held for /admin')
    return NextResponse.json({ ok: true, delivery: 'stored', queued: true })
  }

  console.warn(
    '[inquiry] no delivery target and no durable store. Set INQUIRY_TO_EMAIL + INQUIRY_FROM_EMAIL + RESEND_API_KEY, or INQUIRY_WEBHOOK_URL, or a persistent analytics store.'
  )
  return NextResponse.json({ error: 'delivery_not_configured' }, { status: 503 })
}
