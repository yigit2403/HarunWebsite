/**
 * Liquilob LQL side elevation.
 *
 * A measured line drawing, not decoration. Reading left to right: the pump
 * casing with its bolted front cover, the vertical discharge and suction
 * ports ending in bolted flange faces, the bearing and timing-gear housing
 * that carries the unit, its feet, the baseplate, and the shaft stub with its
 * coupling hub. Centrelines are dash-dot per drawing convention and one red
 * dimension carries the overall length.
 *
 * Styling lives in styles/drawing.css: browsers do not resolve var() inside
 * an SVG presentation attribute, so putting the tokens in CSS is what keeps
 * these drawings on the palette instead of falling back to black.
 */

const CX = 300
const CY = 262
const R = 150

/** Bolt circle on the front cover. */
const COVER_BOLTS = Array.from({ length: 8 }, (_, i) => {
  const angle = (i / 8) * Math.PI * 2 - Math.PI / 8
  return { cx: CX + 116 * Math.cos(angle), cy: CY + 116 * Math.sin(angle) }
})

/** Bolt holes across a flange face, drawn in elevation. */
const FLANGE_BOLTS = [232, 268, 332, 368]

export function PumpElevation({
  title,
  className,
  /**
   * Relative frame size, 1 = LQL-100. The four models really are different
   * sizes, so the drawing is scaled rather than repeated identically across
   * four catalogue cards. Implemented on the viewBox around the drawing
   * centre, which keeps the line weights consistent between models.
   */
  scale = 1,
}: {
  title: string
  className?: string
  scale?: number
}) {
  const w = 868 / scale
  const h = 706 / scale
  const viewBox = `${450 - w / 2} ${353 - h / 2} ${w} ${h}`

  return (
    <svg
      viewBox={viewBox}
      role="img"
      aria-label={title}
      className={className ? `dwg ${className}` : 'dwg'}
    >
      <title>{title}</title>

      {/* Bearing and timing-gear housing. Drawn before the casing so the
          casing reads as mounted on its face. */}
      <path className="dwg-body" d="M430 168h312v308H430z" />
      <path className="dwg-detail" d="M430 226h312M430 418h312" />
      <path className="dwg-detail" d="M508 258h150v122H508z" />
      <path className="dwg-body" d="M470 476h68v128h-68zM634 476h68v128h-68z" />

      {/* Discharge port, upward */}
      <path className="dwg-body" d="M244 44h112v190H244z" />
      <path className="dwg-body dwg-body--thin" d="M206 20h188v26H206z" />
      {FLANGE_BOLTS.map((x) => (
        <circle className="dwg-detail" key={`d${x}`} cx={x} cy="33" r="5" />
      ))}

      {/* Suction port, downward */}
      <path className="dwg-body" d="M244 290h112v212H244z" />
      <path className="dwg-body dwg-body--thin" d="M206 500h188v26H206z" />
      {FLANGE_BOLTS.map((x) => (
        <circle className="dwg-detail" key={`s${x}`} cx={x} cy="513" r="5" />
      ))}

      {/* Casing, front cover, cover bolts and shaft boss */}
      <circle className="dwg-body" cx={CX} cy={CY} r={R} />
      <circle className="dwg-body dwg-body--thin" cx={CX} cy={CY} r="130" />
      {COVER_BOLTS.map((b, i) => (
        <circle className="dwg-body dwg-body--thin" key={i} cx={b.cx} cy={b.cy} r="7.5" />
      ))}
      <circle className="dwg-body dwg-body--thin" cx={CX} cy={CY} r="44" />
      <circle className="dwg-detail" cx={CX} cy={CY} r="19" />

      {/* Baseplate */}
      <path className="dwg-body" d="M40 604h820v30H40z" />
      <path className="dwg-shade" d="M40 634h820v12H40z" />

      {/* Shaft stub and coupling hub */}
      <path className="dwg-body dwg-body--thin" d="M742 302h58v40h-58z" />
      <path className="dwg-body dwg-body--thin" d="M798 274h34v96h-34z" />

      {/* Centrelines */}
      <path className="dwg-centre" d={`M120 ${CY}h750`} />
      <path className="dwg-centre" d={`M${CX} 8v548`} />

      {/* Overall length */}
      <path className="dwg-dim dwg-dim--extension" d="M150 650v50M832 650v50" />
      <path className="dwg-dim" d="M160 684h662" />
      <path className="dwg-arrow" d="M160 684l16-6v12zM822 684l-16-6v12z" />
      <text className="dwg-dim-text" x="491" y="676" textAnchor="middle">
        L
      </text>
    </svg>
  )
}
