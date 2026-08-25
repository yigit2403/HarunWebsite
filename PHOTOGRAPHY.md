# Photography

Profimann's own imagery, and what is still missing.

## Delivered and in use

Masters live in `assets/` and are never served. `npm run images` encodes each one
into the web file in the table below; `npm run build` does it for you.

| Asset | Master | Served as | Where it appears |
| --- | --- | --- | --- |
| Product render, cover removed | `assets/photos/pump-render.png` | `/photos/pump-render.webp` | Home hero, catalogue cards, product detail hero |
| Installation on a food line | `assets/photos/installation-food-line.jpg` | `/photos/installation-food-line.webp` | Home engineering band |
| Rotor family | `assets/photos/rotor-family.jpg` | `/photos/rotor-family.webp` | Rotor technologies page |
| Logo artwork | `assets/brand/liquilob-logo.png` | fingerprinted by Next | Header and footer |

Together they weigh 978 kB as masters and 161 kB as served files.

Two of these were processed before use:

- **The render** arrived on an opaque white ground with a shadow slab beneath it. The
  background was keyed out by flood-filling from the border, so white highlights *inside*
  the machine survive, and the ground slab was cropped away at the feet. It now sits on any
  surface. The original is in the source document if it is ever needed again.
- **The logo** arrived with a wide red margin that left the wordmark at half the plate
  height and `BY PROFIMANN` illegible at header size. It was cropped to its ink with even
  padding, which renders the wordmark about 40% larger in the same space. The mark itself is
  untouched.

The brand red in `styles/tokens.css` is `#cc0c0c`, sampled from the logo artwork, where it
accounts for 93% of the red pixels across both supplied files.

## Still needed

Each remaining position renders as a measured, labelled frame rather than a stock stand-in,
because a generic photograph of an unrelated factory would damage the page more than an
honest gap.

## How to add a photograph

The site is exported as static files, so there is no image optimiser running in
production: whatever sits in `public/` is what a visitor downloads, at full size, on every
screen. `tools/images.mjs` does that work ahead of time instead.

1. Put the full-resolution original in `assets/photos/`. Do not put it in `public/`.
2. Add an entry to `IMAGES` in `tools/images.mjs`, where `width` is the widest the layout
   ever renders it, doubled for high-density screens:

```js
{
  from: 'assets/photos/manufacturing.jpg',
  to: 'public/photos/manufacturing.webp',
  width: 1400,
  options: { quality: 78 },
},
```

3. Add `src` to the matching slot in `content/pages.ts` → `PHOTOS`:

```ts
manufacturing: {
  id: 'manufacturing',
  ratio: '4 / 3',
  label: { tr: '...', en: '...' },
  src: '/photos/manufacturing.webp',   // <- points at the generated file
},
```

4. `npm run build`.

The frame is replaced by a lazily loaded `next/image`. Nothing around it moves, because the
slot already reserves the correct aspect ratio. The `label` becomes the alt text, so write
it as a description of the picture, not as a caption.

Re-encoding a WebP produces a slightly worse WebP each time, which is why the masters stay
in `assets/` rather than being replaced by their output.

## Shot list

| Slot | Ratio | Minimum width | Appears on |
| --- | --- | --- | --- |
| `manufacturing` | 4:3 | 1600px | About |
| `assembly` | 3:2 | 1600px | Engineering |

### `manufacturing`

Casing machining or rotor finishing on the machine. What sells this frame is the surface:
swarf, a fresh cut, a measuring instrument in the shot. Close in on the work rather than
photographing the whole shop floor.

### `assembly`

A Liquilob pump set on the bench during assembly. Front cover off if possible, so the rotor
pair is visible; that image ties directly to the cross-section drawing used elsewhere on the
site and is the single most valuable photograph on this list.

## What to shoot for the rest of the site

The catalogue now uses the supplied render. If a shoot is commissioned, ask for:

- One isolated three-quarter view **per frame size** (LQL-25, 50, 100, 200), matching the
  existing render's angle, lighting and background. Right now one render stands in for all
  four models, which is normal for a catalogue but weaker than showing the real size step.
- One rotor close-up per geometry on a neutral background, to sit beside the generated
  section diagrams on the rotor technologies page.
- One jacketed pump and one PP-bodied pump, for the configurations section.

Consistency matters more than production value here: four pumps photographed at the same
angle on the same background read as one product family. Four pumps photographed four
different ways read as a stock library.

## What to avoid

The brief is explicit and it is right:

- No businesspeople shaking hands, no meeting rooms, no stock imagery.
- No factory photographs unrelated to pumps.
- No heavy colour grading. The site is white, black and one red; photographs should sit
  inside that, not fight it.

## Technical notes

- Deliver JPEG or PNG at the widths above. Next.js generates AVIF and WebP at build time.
- Everything below the fold is lazily loaded already. Do not mark a slot `priority` unless
  it is genuinely the largest element in the first viewport.
- Alt text is the `label` field, and it is bilingual. Write both.
