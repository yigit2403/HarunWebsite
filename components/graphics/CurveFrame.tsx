/**
 * Performance-curve frame.
 *
 * Drawn to the axes a lobe-pump curve sheet actually uses, differential
 * pressure against capacity, but with no curve plotted: Profimann's measured
 * curves are not published yet and drawing a plausible one would be inventing
 * performance data. The empty state beside the frame says what to do instead.
 */
export function CurveFrame({
  title,
  axisX,
  axisY,
  className,
}: {
  title: string
  axisX: string
  axisY: string
  className?: string
}) {
  const cols = [1, 2, 3, 4, 5]
  const rows = [1, 2, 3]

  return (
    <svg
      viewBox="0 0 480 300"
      role="img"
      aria-label={title}
      className={className ? `dwg ${className}` : 'dwg'}
    >
      <title>{title}</title>

      <rect className="dwg-plot" x="76" y="26" width="366" height="220" />

      {cols.map((c) => (
        <path className="dwg-grid" key={`c${c}`} d={`M${76 + c * 61} 26v220`} />
      ))}
      {rows.map((r) => (
        <path className="dwg-grid" key={`r${r}`} d={`M76 ${26 + r * 55}h366`} />
      ))}

      <path className="dwg-axis" d="M76 26v220h366" />

      <text className="dwg-tick" x="76" y="268" textAnchor="middle">
        0
      </text>
      <text className="dwg-tick" x="442" y="268" textAnchor="end">
        {axisX}
      </text>
      <text className="dwg-tick" x="66" y="246" textAnchor="end">
        0
      </text>
      <text className="dwg-tick" x="66" y="32" textAnchor="end">
        {axisY}
      </text>
    </svg>
  )
}
