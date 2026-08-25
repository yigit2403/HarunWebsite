/**
 * Writes public/inquiry-data.json from the content modules.
 *
 * The contact form is handled by PHP in production, and PHP cannot read the
 * TypeScript the rest of the site is written in. Rather than keep a second
 * copy of the field labels, the document list and the application list in
 * inquiry.php — which would be wrong the first time someone adds a document —
 * the build writes them out and the PHP reads them.
 *
 * Run by `npm run build`. Node reads the .ts files directly; every import in
 * them is type-only, so there is nothing to resolve at runtime.
 */
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const { INQUIRY_FIELDS, INQUIRY_REQUIRED, INQUIRY_MAX_FIELD, INQUIRY_SUBJECT } = await import(
  '../content/inquiry.ts'
)
const { DOCUMENTS } = await import('../content/pages.ts')
const { APPLICATIONS } = await import('../content/applications.ts')

const data = {
  // A note for anyone who opens this file on the server wondering what it is.
  _generated: 'tools/inquiry-data.mjs — do not edit, edit content/ instead',
  fields: INQUIRY_FIELDS,
  required: INQUIRY_REQUIRED,
  maxField: INQUIRY_MAX_FIELD,
  subject: INQUIRY_SUBJECT,
  // Both are stored as ids and shown as words. The id is also the whitelist:
  // inquiry.php refuses anything that is not a key here.
  documents: Object.fromEntries(DOCUMENTS.map((d) => [d.id, d.title])),
  applications: Object.fromEntries(APPLICATIONS.map((a) => [a.key, a.name])),
}

const out = join(root, 'public', 'inquiry-data.json')
writeFileSync(out, JSON.stringify(data, null, 2) + '\n', 'utf8')

console.log(
  `inquiry-data.json: ${data.fields.length} fields, ` +
    `${Object.keys(data.documents).length} documents, ` +
    `${Object.keys(data.applications).length} applications`
)
