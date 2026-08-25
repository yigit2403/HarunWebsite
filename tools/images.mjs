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
