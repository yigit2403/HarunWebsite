# Photography

The site is built to hold Profimann's own photographs. Until they exist, each reserved
position renders as a measured, labelled frame rather than a stock stand-in, because a
generic photograph of an unrelated factory would damage the page more than an honest gap.

## How to add a photograph

1. Put the file in `public/photos/`.
2. Add `src` to the matching slot in `content/pages.ts` → `PHOTOS`:

```ts
manufacturing: {
  id: 'manufacturing',
  ratio: '4 / 3',
  label: { tr: '...', en: '...' },
  src: '/photos/manufacturing.jpg',   // <- this line is the whole change
},
```

The frame is replaced by an optimised, lazily loaded `next/image`. Nothing around it moves,
because the slot already reserves the correct aspect ratio. The `label` becomes the alt text,
so write it as a description of the picture, not as a caption.

## Shot list

| Slot | Ratio | Minimum width | Appears on |
| --- | --- | --- | --- |
| `manufacturing` | 4:3 | 1600px | Home (engineering band), About |
| `assembly` | 3:2 | 1600px | Engineering |
| `installation` | 16:9 | 2000px | Every application page |

### `manufacturing`

Casing machining or rotor finishing on the machine. What sells this frame is the surface:
swarf, a fresh cut, a measuring instrument in the shot. Close in on the work rather than
photographing the whole shop floor.

### `assembly`

A Liquilob pump set on the bench during assembly. Front cover off if possible, so the rotor
pair is visible; that image ties directly to the cross-section drawing used elsewhere on the
site and is the single most valuable photograph on this list.

### `installation`

A pump installed on a real line, with its pipework. Stainless steel, clean welds, a plant
that looks like it runs. Wide enough to read as an installation, not a product shot.

## What to shoot for the rest of the site

The catalogue and the product detail pages currently use engineering drawings, which is a
defensible choice for a pump manufacturer. They become stronger with a photograph of the
real machine. If a shoot is commissioned, ask for:

- One isolated three-quarter view per frame size (LQL-25, 50, 100, 200), same angle, same
  lighting, on a plain light-grey seamless background. These replace the drawing in the
  catalogue card and in the product hero.
- One rotor close-up on a neutral background. Tri-lobe, clean, filling the frame.
- One shot of the front cover open with the rotor pair in the casing.

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
