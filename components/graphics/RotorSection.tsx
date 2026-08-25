import { ROTORS, type RotorKey } from './rotors'

/**
 * Cross-section through the pumping chamber.
 *
 * The bore, a meshed rotor pair, the shaft centres, and the direction of
 * rotation and flow. The pale red area is the fluid: it is the bore with both
 * rotors subtracted from it (one path, even-odd fill), so the pumping cells a
 * reader sees are the real swept volume rather than a shape drawn to look
 * convincing.
 *
 * Geometry comes from ./rotors.ts, which is generated: the four rotor types
 * are one equation at four lobe counts, and their clearances are measured.
 */
export function RotorSection({
  title,
  labels,
  rotor = 'tri',
  className,
}: {
  title: string
  labels: { suction: string; discharge: string }
  rotor?: RotorKey
  className?: string
}) {
  const g = ROTORS[rotor]

  return (
    <svg
      viewBox="-235 -178 470 356"
      role="img"
      aria-label={title}
      className={className ? `dwg ${className}` : 'dwg'}
    >
      <title>{title}</title>

      {/* Fluid: bore minus both rotors */}
      <path className="dwg-fluid" fillRule="evenodd" d={`${g.borePath}${g.left}${g.right}`} />

      {/* Casing wall */}
      <path className="dwg-casing-wall" d={g.borePath} />
      <path className="dwg-casing-line" d={g.borePath} />

      {/* Meshed rotors */}
      <path className="dwg-rotor" d={g.left} />
      <path className="dwg-rotor" d={g.right} />

      {/* Shafts on the two bore centres */}
      <circle className="dwg-shaft" cx={-g.centre} cy="0" r="20" />
      <circle className="dwg-shaft" cx={g.centre} cy="0" r="20" />
      <path
        className="dwg-centre dwg-centre--tight"
        d={`M${-g.centre} -142v284M${g.centre} -142v284M-215 0h430`}
      />

      {/* Direction of rotation: left rotor clockwise, right anticlockwise */}
      <path className="dwg-spin" d={`M${-g.centre} -46a46 46 0 0 1 40 23`} />
      <path className="dwg-arrow" d={`M${-g.centre + 42} -25l4 -15 -15 5z`} />
      <path className="dwg-spin" d={`M${g.centre} -46a46 46 0 0 0 -40 23`} />
      <path className="dwg-arrow" d={`M${g.centre - 42} -25l-4 -15 15 5z`} />

      {/* Flow: suction below, discharge above */}
      <path className="dwg-flow" d="M0 122v-52" />
      <path className="dwg-arrow" d="M0 64l-10 18h20z" />
      <path className="dwg-flow" d="M0 -70v-52" />
      <path className="dwg-arrow" d="M0 -128l-10 18h20z" />

      <text className="dwg-label" x="0" y="152" textAnchor="middle">
        {labels.suction.toLocaleUpperCase('en')}
      </text>
      <text className="dwg-label" x="0" y="-142" textAnchor="middle">
        {labels.discharge.toLocaleUpperCase('en')}
      </text>
    </svg>
  )
}

/**
 * Compact profile of a rotor pair with no annotation, for comparing the four
 * types side by side. Same geometry, same line weights, no flow story.
 */
export function RotorProfile({ rotor, title }: { rotor: RotorKey; title: string }) {
  const g = ROTORS[rotor]

  return (
    // One viewBox for all four types. Normalising each to its own extent would
    // draw every bore at a different size, which is exactly the comparison the
    // surrounding copy says these diagrams make. The widest pair (multi-impeller,
    // centre distance 184) sets the frame; the narrower types sit inside it.
    <svg viewBox="-206 -114 412 228" role="img" aria-label={title} className="dwg">
      <title>{title}</title>
      <path className="dwg-fluid" fillRule="evenodd" d={`${g.borePath}${g.left}${g.right}`} />
      <path className="dwg-casing-line" d={g.borePath} />
      <path className="dwg-rotor" d={g.left} />
      <path className="dwg-rotor" d={g.right} />
      <circle className="dwg-shaft" cx={-g.centre} cy="0" r="16" />
      <circle className="dwg-shaft" cx={g.centre} cy="0" r="16" />
    </svg>
  )
}
