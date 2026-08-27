'use client'

import { useEffect, useState } from 'react'
import {
  IconAlertTriangle,
  IconArrowRight,
  IconCheck,
  IconFileDescription,
  IconLoader2,
} from '@tabler/icons-react'

import { APPLICATIONS } from '@/content/applications'
import { UI } from '@/content/dict'
import { findDocument } from '@/content/pages'
import { COMPANY } from '@/content/site'
import type { Locale } from '@/lib/i18n'

type Status = 'idle' | 'sending' | 'sent' | 'error'

/**
 * Technical inquiry form.
 *
 * The fields are the ones an application engineer needs before recommending a
 * frame size, in the order they are usually asked. Labels sit above inputs and
 * no field uses a placeholder in place of a label.
 *
 * Submission posts to public/inquiry.php, which emails the inquiry to
 * Profimann. Until the mailbox exists that script has nowhere to send it, so it
 * replies 503, and the error state below sends the visitor to the phone number
 * rather than claiming the message was sent.
 *
 * A visitor who clicked "Request" on a document row arrives with the document
 * id in the address. The form names it and sends it along, so the inquiry says
 * which document was wanted instead of leaving it to be guessed.
 */

/**
 * Where the form posts.
 *
 * The site is exported as static files, so this is a PHP script sitting beside
 * the HTML rather than a route in this app — see public/inquiry.php. `next dev`
 * cannot run PHP: to exercise the form locally, build the site and serve out/
 * with a PHP server (`npm run preview`), or point this at a handler that is
 * already running.
 */
const ENDPOINT = process.env.NEXT_PUBLIC_INQUIRY_ENDPOINT || '/inquiry.php'
export function InquiryForm({ locale }: { locale: Locale }) {
  const [status, setStatus] = useState<Status>('idle')
  const [doc, setDoc] = useState<ReturnType<typeof findDocument>>(null)

  // Read from the address rather than with useSearchParams: this keeps the
  // page above prerenderable, and it is the only thing that works in a static
  // export, where the query string exists in the browser and nowhere else.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('doc')
    setDoc(id ? findDocument(id) : null)
  }, [])

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget

    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    setStatus('sending')
    try {
      const payload = Object.fromEntries(new FormData(form).entries())
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...payload, locale }),
      })
      if (!response.ok) throw new Error(String(response.status))
      setStatus('sent')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="form-status" role="status">
        <p style={{ display: 'flex', gap: 'var(--s3)', alignItems: 'flex-start' }}>
          <IconCheck size={20} stroke={2} aria-hidden="true" style={{ flex: 'none', marginTop: 2 }} />
          <span>
            {UI.formSuccess[locale]}{' '}
            <a href={COMPANY.phoneHref} style={{ borderBottom: '2px solid var(--red)' }}>
              {COMPANY.phoneDisplay}
            </a>
          </span>
        </p>
      </div>
    )
  }

  const required = <span className="field__req" title={UI.formRequired[locale]}>*</span>

  return (
    <form onSubmit={onSubmit} noValidate={false}>
      {doc ? (
        <>
          <div className="form-doc">
            <IconFileDescription
              size={20}
              stroke={1.75}
              aria-hidden="true"
              style={{ flex: 'none', marginTop: 2 }}
            />
            <span>
              {UI.formDocNotice[locale]}: <strong>{doc.title[locale]}</strong>
            </span>
          </div>
          <input type="hidden" name="doc" value={doc.id} />
        </>
      ) : null}

      {/* Honeypot. inquiry.php (and the parked Node route) discard any
          submission that fills this: a person never sees it, a form-scraping
          bot fills every field it finds. Off-canvas rather than display:none,
          aria-hidden and untabbable so no real visitor can reach it. */}
      <div className="field field--trap" aria-hidden="true">
        <label htmlFor="inq-website">Website</label>
        <input
          id="inq-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="form-grid">
        <div className="field">
          <label className="field__label" htmlFor="inq-name">
            {UI.formName[locale]} {required}
          </label>
          <input className="input" id="inq-name" name="name" type="text" required autoComplete="name" />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="inq-company">
            {UI.formCompany[locale]} {required}
          </label>
          <input
            className="input"
            id="inq-company"
            name="company"
            type="text"
            required
            autoComplete="organization"
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="inq-email">
            {UI.formEmail[locale]} {required}
          </label>
          <input
            className="input"
            id="inq-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            spellCheck={false}
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="inq-phone">
            {UI.formPhone[locale]}
          </label>
          <input className="input" id="inq-phone" name="phone" type="tel" autoComplete="tel" />
        </div>

        <div className="field field--wide">
          <label className="field__label" htmlFor="inq-application">
            {UI.formApplication[locale]}
          </label>
          <select className="select" id="inq-application" name="application" defaultValue="">
            <option value="">{UI.formSelect[locale]}</option>
            {APPLICATIONS.map((app) => (
              <option key={app.key} value={app.key}>
                {app.name[locale]}
              </option>
            ))}
          </select>
        </div>

        <div className="field field--wide">
          <label className="field__label" htmlFor="inq-fluid">
            {UI.formFluid[locale]}
          </label>
          <input
            className="input"
            id="inq-fluid"
            name="fluid"
            type="text"
            autoComplete="off"
            aria-describedby="inq-fluid-hint"
          />
          <p className="field__hint" id="inq-fluid-hint">
            {UI.formFluidHint[locale]}
          </p>
        </div>

        <div className="field">
          <label className="field__label" htmlFor="inq-flow">
            {UI.formFlow[locale]}
          </label>
          {/* Free text rather than type=number: engineers write ranges and
              approximations ("30-40", "~25"). inputmode still raises the
              numeric keypad on a phone. The temperature field below stays on
              the full keyboard, because the decimal keypad has no minus. */}
          <input
            className="input"
            id="inq-flow"
            name="flow"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            aria-describedby="inq-flow-hint"
          />
          <p className="field__hint" id="inq-flow-hint">
            {UI.formFlowHint[locale]}
          </p>
        </div>

        <div className="field">
          <label className="field__label" htmlFor="inq-pressure">
            {UI.formPressure[locale]}
          </label>
          <input
            className="input"
            id="inq-pressure"
            name="pressure"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            aria-describedby="inq-pressure-hint"
          />
          <p className="field__hint" id="inq-pressure-hint">
            {UI.formPressureHint[locale]}
          </p>
        </div>

        <div className="field">
          <label className="field__label" htmlFor="inq-viscosity">
            {UI.formViscosity[locale]}
          </label>
          <input
            className="input"
            id="inq-viscosity"
            name="viscosity"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            aria-describedby="inq-viscosity-hint"
          />
          <p className="field__hint" id="inq-viscosity-hint">
            {UI.formViscosityHint[locale]}
          </p>
        </div>

        <div className="field">
          <label className="field__label" htmlFor="inq-temperature">
            {UI.formTemperature[locale]}
          </label>
          <input
            className="input"
            id="inq-temperature"
            name="temperature"
            type="text"
            autoComplete="off"
            aria-describedby="inq-temperature-hint"
          />
          <p className="field__hint" id="inq-temperature-hint">
            {UI.formTemperatureHint[locale]}
          </p>
        </div>

        <div className="field field--wide">
          <label className="field__label" htmlFor="inq-message">
            {UI.formMessage[locale]}
          </label>
          <textarea
            className="textarea"
            id="inq-message"
            name="message"
            rows={5}
            aria-describedby="inq-message-hint"
          />
          <p className="field__hint" id="inq-message-hint">
            {UI.formMessageHint[locale]}
          </p>
        </div>
      </div>

      {status === 'error' ? (
        <div className="form-status" role="alert" style={{ marginTop: 'var(--s6)' }}>
          <p style={{ display: 'flex', gap: 'var(--s3)', alignItems: 'flex-start' }}>
            <IconAlertTriangle
              size={20}
              stroke={2}
              aria-hidden="true"
              style={{ flex: 'none', marginTop: 2 }}
            />
            <span>
              {UI.formErrorGeneric[locale]}{' '}
              <a href={COMPANY.phoneHref} style={{ borderBottom: '2px solid var(--red)' }}>
                {COMPANY.phoneDisplay}
              </a>
              {' · '}
              <a href={COMPANY.emailHref} style={{ borderBottom: '2px solid var(--red)' }}>
                {COMPANY.email}
              </a>
            </span>
          </p>
        </div>
      ) : null}

      <div
        style={{
          marginTop: 'var(--s8)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 'var(--s6)',
        }}
      >
        <button className="btn btn--primary" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? (
            <>
              <IconLoader2 size={18} stroke={2} aria-hidden="true" className="btn__spinner" />
              {UI.formSending[locale]}
            </>
          ) : (
            <>
              {UI.formSubmit[locale]}
              <IconArrowRight size={18} stroke={2} aria-hidden="true" />
            </>
          )}
        </button>
        <p className="form-note">{UI.formPrivacy[locale]}</p>
      </div>
    </form>
  )
}
