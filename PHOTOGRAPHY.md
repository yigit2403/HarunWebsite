# Photography

Profimann's own imagery, and what is still missing.

## Delivered and in use

Masters live in `assets/` and are never served. `npm run images` encodes each one
into the web file in the table below; `npm run build` does it for you.

| Asset | Master | Served as | Where it appears |
| --- | --- | --- | --- |
| Complete pump set | `assets/photos/pump-unit.png` | `/photos/pump-unit.webp` | Home hero, and About beside the company story |
| Product render, cover removed | `assets/photos/pump-render.png` | `/photos/pump-render.webp` | Catalogue cards, product detail hero |
| Pump set general arrangement | `assets/photos/pump-unit-drawing.png` | `/photos/pump-unit-drawing.webp` | Engineering, beside the philosophy |
| Installation on a food line | `assets/photos/installation-food-line.jpg` | `/photos/installation-food-line.webp` | Home engineering band |
| Rotor family | `assets/photos/rotor-family.jpg` | `/photos/rotor-family.webp` | Rotor technologies page |
| Logo artwork | `assets/brand/liquilob-logo.png` | fingerprinted by Next | Header and footer |

Together they weigh 1426 kB as masters and 235 kB as served files.

The hero and the catalogue deliberately show different machines. The catalogue sells the
pump, and the motor is selected per duty, so the cards carry the pump on its own. The hero
has to say what the machine *is* to somebody who does not yet have the vocabulary, and a
bare casing does not do that, so it carries the complete set on its baseplate.

Four of these were processed before use:

- **The render** arrived on an opaque white ground with a shadow slab beneath it. The
  background was keyed out by flood-filling from the border, so white highlights *inside*
  the machine survive, and the ground slab was cropped away at the feet. It now sits on any
  surface. The original is in the source document if it is ever needed again.
- **The logo** arrived with a wide red margin that left the wordmark at half the plate
  height and `BY PROFIMANN` illegible at header size. It was cropped to its ink with even
  padding, which renders the wordmark about 40% larger in the same space. The mark itself is
  untouched.
- **The two CAD views** arrived as SolidWorks viewport exports: the machine small in the
  middle of a 16:9 frame on a pale blue-grey gradient. Both were put through
  `tools/cad-cutout.mjs`, which keys out the gradient, crops to the machine with an even
  margin, lifts the white point and unsharp masks what the JPEG round trip softened. The
  untouched exports are kept in `assets/cad/`, so the treatment can be re-run — see
  *Re-cutting a CAD export* below.

  The colour render was also run with `--appearances`, which puts two parts into the colours
  they are actually made in. The housing was a brick red and is now the brand `#cc0c0c`; the
  drive adaptor between the gear housing and the coupling guard was still a default magenta
  and is now machined steel. Both are appearances nobody had set in the model, and both read
  as a toy on the page. Shading is preserved — each pixel keeps its own place in the range,
  so the casting still reads as a casting — and no geometry, marking or proportion is
  touched. **The right place to fix this is the model.** Set the two appearances there and
  the flag can be dropped, which is one less thing standing between the CAD and the page.

The brand red in `styles/tokens.css` is `#cc0c0c`, sampled from the logo artwork, where it
accounts for 93% of the red pixels across both supplied files.

## Still needed

Every position on the site now carries a real image, so no page renders a labelled
placeholder frame any more. What is still missing is *photography*: everything showing the
machine is a render or a drawing off the CAD model. That is normal for a pump catalogue and
it is honest, but a camera would earn its place on the two pages listed under **Shot list**.

Until it exists, nothing gets a stock stand-in. A generic photograph of an unrelated factory
would damage a page more than an honest gap.

### Resolution, and what a bigger export would buy

A CAD view is only as sharp as the export it came from, and these came through a messaging
app at 1600x900, which leaves the machine about 1000px wide. Nothing can put back detail
that is not in the file: the unsharp mask in `cad-cutout.mjs` recovers edges that survived
the JPEG, and that is the end of what processing can do.

What that costs, per position, measured on the page:

Widths are the widest the layout ever gives each position, measured on the page, which is
where the container stops growing:

| Position | Rendered at | Master | Effective |
| --- | --- | --- | --- |
| Home hero | 450px | 899px | 2.00x — clears a high-density screen |
| Engineering, general arrangement | 686px | 1091px | 1.59x |
| About, complete set | 686px | 899px | 1.31x — softest of the three |

So the hero, which is seen first and matters most, is exactly at the 2x a high-density screen
asks for, and that is not luck: the render is cropped tighter than the drawing precisely
because the frame it sits in supplies its own padding. The two mid-page figures fall short
and are the ones worth re-exporting for. One export at 3200x1800 clears every row at once.

### Re-cutting a CAD export

When a bigger export arrives, drop it in `assets/cad/` and re-run the same commands:

```
node tools/cad-cutout.mjs assets/cad/pump-unit-export.jpg assets/photos/pump-unit.png --margin=28 --appearances
node tools/cad-cutout.mjs assets/cad/pump-unit-drawing-export.jpg assets/photos/pump-unit-drawing.png
```

`--margin` is in source pixels and scales with the export, so it needs raising in proportion
if the export gets bigger: 28 and 56 are tuned to a 1600x900 frame, and a 3200x1800 one
wants 56 and 112 for the same air. The render takes the smaller margin because it sits
inside a frame that already has padding of its own; the drawing goes into a bare hairline
frame and brings its own.

The script prints the size and ratio of what it wrote. Put that ratio verbatim into the
matching slot in `content/pages.ts`, so the cover fit never crops the machine, then
`npm run build`.

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

Neither of these is a gap in the layout any more: both slots carry a CAD view. They are the
two photographs that would replace one, in the order they are worth taking.

| Slot | Currently | Ratio | Minimum width | Appears on |
| --- | --- | --- | --- | --- |
| `unitDrawing` | General arrangement drawing | 1091:494 | 2200px | Engineering |
| `unit` | Complete pump set, render | 899:450 | 1800px | Home hero, About |

### `unitDrawing` — a pump set on the bench during assembly

Front cover off if possible, so the rotor pair is visible; that image ties directly to the
cross-section drawing further down the same page, and it is the single most valuable
photograph on this list. It would take the drawing's place beside the engineering
philosophy, and the drawing would move to the product pages, where a general arrangement
belongs anyway.

Shoot it wide rather than square: the slot is a little over 2:1, because a pump, a coupling
guard, a reducer and a motor in a line is a wide subject.

### `unit` — casing machining or rotor finishing on the machine

What sells this frame is the surface: swarf, a fresh cut, a measuring instrument in the
shot. Close in on the work rather than photographing the whole shop floor. It is the frame
that turns *we manufacture in Konya* from a claim into something the reader can see.

Note that this slot is the *only* thing that would move: the hero draws on the same file
through `UNIT_IMAGE`, and the hero should stay a render. A machine photographed on a bench
is the wrong first impression for a catalogue; a clean isolated unit is the right one. Point
the About slot at the photograph and leave `UNIT_IMAGE` where it is.

Filling this one also ends the single repeat on the site, which is the complete-set render
appearing both on the home hero and on About. Four per-model renders (below) would end it
just as well, from the other direction.

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

The first of those does not need a shoot. The CAD model that produced `pump-unit.png` can
produce the same view of each frame size from the same camera, which is four exports and
four runs of `tools/cad-cutout.mjs`. Four renders taken from one model are as consistent as
photography ever gets, and the size step is exactly what a catalogue card should show.

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
