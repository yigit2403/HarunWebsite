/**
 * Turns a CAD viewport export into a master for assets/photos/.
 *
 * SolidWorks writes its viewport, not a photograph: the machine sits small in
 * the middle of a 16:9 frame on a pale blue-grey gradient. Dropped into the
 * page as-is it reads as a screenshot, and the gradient fights the white,
 * black and one red the rest of the site is built from.
 *
 * What it does, in order:
 *
 *   1. Keys out the ground. A flood fill from the border marks every light,
 *      near-neutral pixel it can reach as background. Because it can only
 *      travel through the ground, white highlights *inside* the machine and
 *      the white fills inside a hidden-line drawing both survive; only the
 *      gradient goes. Foreground pixels touching the ground keep a partial
 *      alpha, so the cut edge is not a staircase.
 *   2. With --appearances, puts the machine into the product's own colours.
 *      See CORRECTIONS below.
 *   3. Crops to the machine with an even margin, so the composition is the
 *      subject rather than the viewport.
 *   4. Lifts the white point, which clears the haze a JPEG round trip leaves
 *      behind and takes the paper inside a drawing to real white.
 *   5. Unsharp masks what that round trip softened. Mild and fixed: it puts
 *      back edges that are already in the file and does not invent detail.
 *      It is not a substitute for exporting at a usable size.
 *
 * Run by hand when a new export arrives, not by the build:
 *
 *     node tools/cad-cutout.mjs <export.jpg> <assets/photos/name.png> [options]
 *
 *       --margin=<px>   air around the machine, in source pixels (default 56).
 *                       A cut-out that will sit inside an already padded frame
 *                       wants less; one that goes straight into a bare hairline
 *                       frame wants the default.
 *       --appearances   apply the colour corrections described below.
 *
 * Then add the master to IMAGES in tools/images.mjs and point a slot in
 * content/pages.ts at the file it generates. See PHOTOGRAPHY.md.
 */
import sharp from 'sharp'

/**
 * A pixel can be ground if it is light and close to neutral. The exports run
 * 225-255 across the gradient with a slight blue cast; the machine's lightest
 * face sits well below this. Saturated parts are never ground, however light.
 */
const GROUND_MIN = 200
const GROUND_CAST = 32

/** White point. Anything at or above this in the export is meant to be paper. */
const WHITE_POINT = 247

/* ------------------------------------------------------------ CORRECTIONS
   The assembly still carries two SolidWorks appearances that were never set
   to the part's real finish, and both read as a toy rather than as a machine:

   1. The housing is a brick red, where the pump Profimann actually ships is
      the brand red the rest of the site is built from. Hue goes to red, chroma
      to the brand's, and lightness is lifted toward it. Shading survives,
      because every pixel keeps its own place in the range: the casting still
      reads as a casting and not as a flat fill.
   2. The drive adaptor between the gear housing and the coupling guard is
      still the default magenta. It becomes the machined steel it is.

   Neither can be fixed here for good. Set them in the model and this whole
   block quietly becomes a no-op.

   Only genuinely coloured pixels are touched. A specular highlight has an
   enormous computed saturation off a chroma of three or four levels, so the
   guard is on absolute chroma rather than on saturation, and the near-white
   end is left alone. Blue is never in a band, so the motor is never touched. */
const BRAND_RED = { h: 0, s: 0.889 } // #cc0c0c, from styles/tokens.css
const STEEL = { h: 210, s: 0.03 }

/** Mean saturation of the housing as exported, which the brand's is read against. */
const HOUSING_SATURATION = 0.75

/** Hue windows, in degrees. */
const inRedBand = (h) => h >= 350 || h < 30
const inMagentaBand = (h) => h >= 300 && h < 350

/** Below this chroma a pixel is grey or a highlight, whatever its hue says. */
const MIN_CHROMA = 24
/** Above this lightness a pixel is a highlight and keeps its own colour. */
const MAX_LIGHTNESS = 0.9
/** How far the housing's shading is lifted toward the brand red. */
const RED_LIFT = 1.38

const argv = process.argv.slice(2)
const flags = argv.filter((a) => a.startsWith('--'))
const [from, to] = argv.filter((a) => !a.startsWith('--'))
const appearances = flags.includes('--appearances')
const marginFlag = flags.find((a) => a.startsWith('--margin='))
const MARGIN = marginFlag ? Number(marginFlag.slice('--margin='.length)) : 56

if (!from || !to || !Number.isFinite(MARGIN) || MARGIN < 0) {
  console.error(
    'usage: node tools/cad-cutout.mjs <export.jpg> <assets/photos/name.png> ' +
      '[--margin=<px>] [--appearances]'
  )
  process.exit(1)
}

/* --- HSL the long way round, because this runs over every pixel in the frame. */

function toHsl(r, g, b) {
  const mx = Math.max(r, g, b)
  const mn = Math.min(r, g, b)
  const chroma = mx - mn
  const l = (mx + mn) / 510
  if (chroma === 0) return { h: 0, s: 0, l, chroma }
  const s = chroma / 255 / (1 - Math.abs(2 * l - 1))
  let h
  if (mx === r) h = 60 * (((g - b) / chroma) % 6)
  else if (mx === g) h = 60 * ((b - r) / chroma + 2)
  else h = 60 * ((r - g) / chroma + 4)
  return { h: h < 0 ? h + 360 : h, s, l, chroma }
}

function toRgb(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let rgb
  if (h < 60) rgb = [c, x, 0]
  else if (h < 120) rgb = [x, c, 0]
  else if (h < 180) rgb = [0, c, x]
  else if (h < 240) rgb = [0, x, c]
  else if (h < 300) rgb = [x, 0, c]
  else rgb = [c, 0, x]
  return rgb.map((v) => Math.round(Math.max(0, Math.min(255, (v + m) * 255))))
}

/** The corrected colour for one pixel, or null to leave it exactly as it is. */
function correct(r, g, b) {
  const { h, s, l, chroma } = toHsl(r, g, b)
  if (chroma < MIN_CHROMA || l > MAX_LIGHTNESS) return null
  if (inRedBand(h)) {
    return toRgb(
      BRAND_RED.h,
      Math.min(1, s * (BRAND_RED.s / HOUSING_SATURATION)),
      Math.min(MAX_LIGHTNESS, l * RED_LIFT)
    )
  }
  if (inMagentaBand(h)) return toRgb(STEEL.h, STEEL.s, l)
  return null
}

const { data, info } = await sharp(from).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const { width: W, height: H, channels: C } = info

const isGroundColour = (i) => {
  const r = data[i]
  const g = data[i + 1]
  const b = data[i + 2]
  const min = Math.min(r, g, b)
  return min >= GROUND_MIN && Math.max(r, g, b) - min <= GROUND_CAST
}

/* Flood fill inwards from every border pixel. */
const ground = new Uint8Array(W * H)
const stack = []
const visit = (x, y) => {
  const p = y * W + x
  if (ground[p] || !isGroundColour(p * C)) return
  ground[p] = 1
  stack.push(p)
}
for (let x = 0; x < W; x++) {
  visit(x, 0)
  visit(x, H - 1)
}
for (let y = 0; y < H; y++) {
  visit(0, y)
  visit(W - 1, y)
}
while (stack.length) {
  const p = stack.pop()
  const x = p % W
  const y = (p - x) / W
  if (x > 0) visit(x - 1, y)
  if (x < W - 1) visit(x + 1, y)
  if (y > 0) visit(x, y - 1)
  if (y < H - 1) visit(x, y + 1)
}

/* Opaque machine, transparent ground, and the bounds of what is left. */
const out = Buffer.alloc(W * H * 4)
let x0 = W
let y0 = H
let x1 = -1
let y1 = -1
let recoloured = 0
for (let p = 0; p < W * H; p++) {
  const s = p * C
  const d = p * 4
  if (ground[p]) {
    out[d] = out[d + 1] = out[d + 2] = 255
    out[d + 3] = 0
    continue
  }

  let r = data[s]
  let g = data[s + 1]
  let b = data[s + 2]
  if (appearances) {
    const fixed = correct(r, g, b)
    if (fixed) {
      ;[r, g, b] = fixed
      recoloured++
    }
  }
  out[d] = r
  out[d + 1] = g
  out[d + 2] = b
  out[d + 3] = 255

  const x = p % W
  const y = (p - x) / W
  if (x < x0) x0 = x
  if (x > x1) x1 = x
  if (y < y0) y0 = y
  if (y > y1) y1 = y
}

if (x1 < 0) {
  console.error(`${from}: the flood fill claimed the whole frame. Nothing to cut out.`)
  process.exit(1)
}

/* A pixel on the cut edge is part machine, part ground. The lighter it is,
   the more ground it holds, so that is what its alpha becomes. */
for (let y = 1; y < H - 1; y++) {
  for (let x = 1; x < W - 1; x++) {
    const p = y * W + x
    if (ground[p]) continue
    if (!(ground[p - 1] || ground[p + 1] || ground[p - W] || ground[p + W])) continue
    const s = p * C
    const min = Math.min(data[s], data[s + 1], data[s + 2])
    out[p * 4 + 3] = Math.round(Math.max(0, Math.min(1, (248 - min) / 40)) * 255)
  }
}

const left = Math.max(0, x0 - MARGIN)
const top = Math.max(0, y0 - MARGIN)
const width = Math.min(W - left, x1 - x0 + 1 + MARGIN * 2)
const height = Math.min(H - top, y1 - y0 + 1 + MARGIN * 2)

const written = await sharp(out, { raw: { width: W, height: H, channels: 4 } })
  .extract({ left, top, width, height })
  .linear(255 / WHITE_POINT, 0)
  // Small radius, low flat-area gain, so JPEG mush in a flat casting face is
  // not amplified into texture that was never in the model.
  .sharpen({ sigma: 0.7, m1: 0.3, m2: 1.6 })
  .png({ compressionLevel: 9 })
  .toFile(to)

console.log(
  `${to}  ${written.width}x${written.height}  ` +
    `ratio ${written.width} / ${written.height}  ${Math.round(written.size / 1024)} kB` +
    (appearances ? `  (${recoloured.toLocaleString('en')} px recoloured)` : '')
)
console.log('  ^ use that ratio verbatim in the content/pages.ts slot, so the cover fit never crops it.')
