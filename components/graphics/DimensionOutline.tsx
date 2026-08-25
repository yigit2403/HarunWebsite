/**
 * Dimensioned outline. The silhouette of the pump unit carrying the dimension
 * letters a manufacturer's drawing sheet uses. The letters map onto a table
 * that stays empty until Profimann's approved drawings are issued, so the page
 * shows what will be supplied without inventing millimetre figures.
 */
export function DimensionOutline({ title, className }: { title: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 640 470"
      role="img"
      aria-label={title}
      className={className ? `dwg ${className}` : 'dwg'}
    >
      <title>{title}</title>

      {/* Baseplate, housing and feet */}
      <path className="dwg-body dwg-body--thin" d="M60 392h540v22H60z" />
      <path className="dwg-body dwg-body--thin" d="M330 118h190v206H330z" />
      <path className="dwg-body dwg-body--thin" d="M356 324h44v68h-44zM452 324h44v68h-44z" />

      {/* Ports */}
      <path className="dwg-body dwg-body--thin" d="M190 78h64v54h-64zM190 244h64v58h-64z" />
      <path className="dwg-body dwg-body--thin" d="M172 58h100v20H172zM172 302h100v20H172z" />

      {/* Casing, spool and shaft stub */}
      <circle className="dwg-body dwg-body--thin" cx="222" cy="188" r="106" />
      <path className="dwg-body dwg-body--thin" d="M310 132h20v112h-20z" />
      <circle className="dwg-detail" cx="222" cy="188" r="30" />
      <path className="dwg-body dwg-body--thin" d="M520 202h44v28h-44z" />

      {/* Dimensions */}
      <path className="dwg-dim dwg-dim--extension" d="M116 458V424M564 458V424" />
      <path className="dwg-dim dwg-dim--fine" d="M124 446h432" />
      <path className="dwg-arrow" d="M124 446l13-5v10zM556 446l-13-5v10z" />

      <path className="dwg-dim dwg-dim--extension" d="M604 58h-330M604 414h-46" />
      <path className="dwg-dim dwg-dim--fine" d="M596 66v340" />
      <path className="dwg-arrow" d="M596 66l-5 13h10zM596 406l-5-13h10z" />

      <path className="dwg-dim dwg-dim--extension" d="M34 188h80M34 414h28" />
      <path className="dwg-dim dwg-dim--fine" d="M42 196v210" />
      <path className="dwg-arrow" d="M42 196l-5 13h10zM42 406l-5-13h10z" />

      <path className="dwg-dim dwg-dim--extension" d="M222 46v-24M564 190v-168" />
      <path className="dwg-dim dwg-dim--fine" d="M230 34h326" />
      <path className="dwg-arrow" d="M230 34l13-5v10zM556 34l-13-5v10z" />

      <text className="dwg-dim-text" x="340" y="440" textAnchor="middle">
        L1
      </text>
      <text className="dwg-dim-text" x="620" y="242" textAnchor="middle">
        H1
      </text>
      <text className="dwg-dim-text" x="20" y="306" textAnchor="middle">
        H2
      </text>
      <text className="dwg-dim-text" x="393" y="28" textAnchor="middle">
        L2
      </text>
    </svg>
  )
}
