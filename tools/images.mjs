/**
 * Generates the web images in public/ from the masters in assets/.
 *
 * The site is exported as static files, so there is no Next.js image optimiser
 * in production: whatever is in public/ is what a visitor downloads, at full
 * size, on every viewport. This script does ahead of time what the optimiser
 * used to do per request — resize to the largest size the layout can use, and
 * encode as WebP.
 *
 * Masters stay in assets/, which is not copied into the build. They are the
 * originals: re-encoding from a lossy WebP loses a little more each time, so
 * new photography goes into assets/ and comes out of here. See PHOTOGRAPHY.md.
 *
 * Run by `npm run build`, or on its own with `npm run images`.
 */
import { mkdir, readFile, writeFile, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

/**
 * `width` is the widest the layout ever renders the image, doubled for
 * high-density screens. There is no point shipping more than that, and the
 * script never enlarges a master that is already smaller.
 */
const IMAGES = [
  {
    from: 'assets/brand/liquilob-logo.png',
    // Not public/: Brand.tsx imports this one, so Next fingerprints it and
    // emits it under _next/static. A copy in public/ would ship twice.
    to: 'assets/brand/liquilob-logo.webp',
    width: 600, // header lockup renders at 200px
    // Flat brand artwork with hard edges and transparency: lossy WebP frays
    // the wordmark's counters, and lossless is smaller here anyway.
    options: { lossless: true },
  },
  {
    from: 'assets/photos/pump-render.png',
    to: 'public/photos/pump-render.webp',
    width: 1224, // 612 native, kept at 2x for the product hero
    options: { quality: 86 },
  },
  {
    from: 'assets/photos/installation-food-line.jpg',
    to: 'public/photos/installation-food-line.webp',
    width: 1400,
    options: { quality: 78 },
  },
  {
    from: 'assets/photos/rotor-family.jpg',
    to: 'public/photos/rotor-family.webp',
    width: 1400,
    options: { quality: 78 },
  },
  {
    // Keyed cut-out, like the pump render: quality is spent on the machine
    // rather than on a ground that is not there.
    from: 'assets/photos/pump-unit.png',
    to: 'public/photos/pump-unit.webp',
    width: 1400, // 899 native, so this never enlarges
    options: { quality: 86 },
  },
  {
    // Line art. Lossy WebP frays a hairline edge, so this one is given a
    // higher quality than a photograph would need.
    from: 'assets/photos/pump-unit-drawing.png',
    to: 'public/photos/pump-unit-drawing.webp',
    width: 1400, // 1091 native
    options: { quality: 92 },
  },
]

const kb = (bytes) => `${Math.round(bytes / 1024)} kB`

let before = 0
let after = 0

for (const image of IMAGES) {
  const source = join(root, image.from)
  const target = join(root, image.to)

  await mkdir(dirname(target), { recursive: true })

  const input = await readFile(source)
  const meta = await sharp(input).metadata()

  const pipeline = sharp(input)
  if (meta.width > image.width) {
    pipeline.resize({ width: image.width, withoutEnlargement: true })
  }

  const output = await pipeline.webp(image.options).toBuffer()
  await writeFile(target, output)

  const original = (await stat(source)).size
  before += original
  after += output.length

  const width = Math.min(meta.width, image.width)
  console.log(
    `${image.to.padEnd(40)} ${String(width).padStart(5)}px  ` +
      `${kb(original).padStart(8)} -> ${kb(output.length).padStart(8)}`
  )
}

console.log(`${''.padEnd(40)} ${'total'.padStart(7)}  ${kb(before).padStart(8)} -> ${kb(after).padStart(8)}`)

/* ------------------------------------------------------------- SOCIAL CARD
   The pages declare twitter:card summary_large_image, and messaging apps ask
   for og:image before showing a link at all, so a site without one unfurls as
   bare text. Composed here from the pump-set master and the logo. JPEG, not
   WebP: WhatsApp and several link scrapers still ignore WebP og:images.      */
{
  const logo = await sharp(await readFile(join(root, 'assets/brand/liquilob-logo.png')))
    .resize({ width: 250 })
    .toBuffer()
  const unit = await sharp(await readFile(join(root, 'assets/photos/pump-unit.png')))
    .resize({ width: 820 })
    .toBuffer()

  // The logo sits top-left and the machine below it; the machine's top edge
  // starts under any plausible logo height, so the two can never collide.
  const card = await sharp({
    create: { width: 1200, height: 630, channels: 3, background: '#ffffff' },
  })
    .composite([
      { input: logo, left: 56, top: 48 },
      { input: unit, left: 190, top: 168 },
    ])
    .jpeg({ quality: 84, mozjpeg: true })
    .toBuffer()

  const target = join(root, 'public', 'photos', 'og-card.jpg')
  await writeFile(target, card)
  console.log(`public/photos/og-card.jpg ${' '.repeat(15)} 1200px  ${kb(card.length).padStart(8)}`)
}

/* ------------------------------------------------------------- FAVICON.ICO
   app/icon.svg covers every modern browser, but old bookmarks, feed readers
   and some crawlers request /favicon.ico blindly — and on this host a miss
   serves the whole 404 page instead. The ICO wraps PNG frames, which every
   current browser accepts.                                                   */
{
  const svg = await readFile(join(root, 'app', 'icon.svg'))
  const frames = []
  for (const size of [16, 32]) {
    frames.push({ size, png: await sharp(svg).resize(size, size).png().toBuffer() })
  }

  // ICONDIR (6 bytes), then one ICONDIRENTRY (16 bytes) per frame, then the
  // PNG payloads at the offsets the entries declare.
  const header = Buffer.alloc(6)
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(frames.length, 4)

  const entries = []
  let offset = 6 + 16 * frames.length
  for (const frame of frames) {
    const entry = Buffer.alloc(16)
    entry.writeUInt8(frame.size === 256 ? 0 : frame.size, 0)
    entry.writeUInt8(frame.size === 256 ? 0 : frame.size, 1)
    entry.writeUInt16LE(1, 4) // colour planes
    entry.writeUInt16LE(32, 6) // bits per pixel
    entry.writeUInt32LE(frame.png.length, 8)
    entry.writeUInt32LE(offset, 12)
    entries.push(entry)
    offset += frame.png.length
  }

  const ico = Buffer.concat([header, ...entries, ...frames.map((f) => f.png)])
  await writeFile(join(root, 'public', 'favicon.ico'), ico)
  console.log(`public/favicon.ico ${' '.repeat(23)} 16+32px ${kb(ico.length).padStart(8)}`)
}
