import type { Localised } from '@/lib/i18n'

/**
 * The technical inquiry, described once.
 *
 * Three things read this and they must agree, because they all end up in the
 * same mailbox:
 *
 *   - components/forms/InquiryForm.tsx   renders the fields
 *   - public/inquiry.php                 validates and emails them in production,
 *                                        reading public/inquiry-data.json, which
 *                                        tools/inquiry-data.mjs generates from here
 *   - server/mail.ts                     the Node mailer, parked with the rest of
 *                                        the server-side code
 *
 * Adding a field means adding one row here and one input to the form.
 */

/** Field order matches the form, so the email reads the way it was filled in. */
export const INQUIRY_FIELDS: { key: string; label: Localised }[] = [
  { key: 'doc', label: { tr: 'Talep edilen doküman', en: 'Requested document' } },
  { key: 'name', label: { tr: 'Ad Soyad', en: 'Name' } },
  { key: 'company', label: { tr: 'Firma', en: 'Company' } },
  { key: 'email', label: { tr: 'E-posta', en: 'Email' } },
  { key: 'phone', label: { tr: 'Telefon', en: 'Phone' } },
  { key: 'application', label: { tr: 'Uygulama', en: 'Application' } },
  { key: 'fluid', label: { tr: 'Akışkan', en: 'Fluid' } },
  { key: 'flow', label: { tr: 'Debi', en: 'Flow rate' } },
  { key: 'pressure', label: { tr: 'Basınç', en: 'Pressure' } },
  { key: 'viscosity', label: { tr: 'Viskozite', en: 'Viscosity' } },
  { key: 'temperature', label: { tr: 'Sıcaklık', en: 'Temperature' } },
  { key: 'message', label: { tr: 'Proses notları', en: 'Process notes' } },
]

/** Without these there is nobody to reply to, so the submission is refused. */
export const INQUIRY_REQUIRED = ['name', 'company', 'email']

/** Longest accepted value per field. A public endpoint must have a ceiling. */
export const INQUIRY_MAX_FIELD = 4000

/**
 * A document request is a different errand from a selection enquiry, and the
 * subject line says which, so the mailbox can be sorted on it.
 */
export const INQUIRY_SUBJECT: Record<'inquiry' | 'document', Localised> = {
  inquiry: { tr: 'Teknik talep', en: 'Technical inquiry' },
  document: { tr: 'Doküman talebi', en: 'Document request' },
}
