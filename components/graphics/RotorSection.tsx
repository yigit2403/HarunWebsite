import { BORE, ROTOR_LEFT, ROTOR_RIGHT } from './geometry'

/**
 * Cross-section through the pumping chamber.
 *
 * The figure-of-eight bore, a meshed pair of tri-lobe rotors, the two shaft
 * centres, and the direction of rotation and flow. The pale red area is the
 * fluid: it is the bore with both rotors subtracted from it (one path, even-odd
 * fill), so what the reader sees as the pumping cells is the real swept volume
 * rather than a shape drawn to look convincing.
 *
 * Rotor profiles come from ./geometry.ts and are generated, so the running
 * clearance visible at the tips is the real one.
 */
export function RotorSection({
  title,
  labels,
  className,
}: {
  title: string
  labels: { suction: string; discharge: string }
  className?: string
}) {
  return (
    <svg
      viewBox="-235 -178 470 356"
      role="img"
      aria-label={title}
      className={className ? `dwg ${className}` : 'dwg'}
    >
      <title>{title}</title>

      {/* Fluid: bore minus both rotors */}
      <path className="dwg-fluid" fillRule="evenodd" d={`${BORE}${ROTOR_LEFT}${ROTOR_RIGHT}`} />

      {/* Casing wall */}
      <path className="dwg-casing-wall" d={BORE} />
      <path className="dwg-casing-line" d={BORE} />

      {/* Meshed rotors */}
      <path className="dwg-rotor" d={ROTOR_LEFT} />
      <path className="dwg-rotor" d={ROTOR_RIGHT} />

      {/* Shafts on the two bore centres */}
      <circle className="dwg-shaft" cx="-80" cy="0" r="20" />
      <circle className="dwg-shaft" cx="80" cy="0" r="20" />
      <path className="dwg-centre dwg-centre--tight" d="M-80 -142v284M80 -142v284M-215 0h430" />

      {/* Direction of rotation: left rotor clockwise, right anticlockwise */}
      <path className="dwg-spin" d="M-80 -46a46 46 0 0 1 40 23" />
      <path className="dwg-arrow" d="M-38 -25l4 -15 -15 5z" />
      <path className="dwg-spin" d="M80 -46a46 46 0 0 0 -40 23" />
      <path className="dwg-arrow" d="M38 -25l-4 -15 15 5z" />

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
