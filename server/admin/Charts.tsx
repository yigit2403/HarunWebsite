import type { DayBucket, Ranked } from '@/server/analytics/aggregate'
import type { Locale } from '@/lib/i18n'

/**
 * The four chart forms this panel needs, each picked from the data's job:
 *
 *   StatRow    a handful of headline numbers -> KPI tiles, not a bar chart
 *   TrendChart change over time, one series  -> columns, no legend
 *   RankedBars magnitude, low to high        -> bars, length carries value
 *   SplitBar   part-to-whole, two segments   -> one stacked bar, not a pie
 *
 * All of them are plain HTML with CSS hover tooltips, so the admin panel
 * ships no JavaScript at all. Each chart is followed by a table view, so no
 * value is reachable only by hovering or only by telling colours apart.
 */

/* ---------------------------------------------------------------- helpers */

function niceCeiling(max: number): number {
  if (max <= 5) return 5
  const magnitude = 10 ** Math.floor(Math.log10(max))
  for (const step of [1, 1.5, 2, 2.5, 5, 10]) {
    const candidate = step * magnitude
    if (candidate >= max) return candidate
  }
  return 10 * magnitude
}

function formatDay(date: string, locale: Locale, long = false): string {
  return new Date(date + 'T00:00:00Z').toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-GB', {
    day: 'numeric',
    month: long ? 'long' : 'short',
    timeZone: 'UTC',
  })
}

/* -------------------------------------------------------------- TREND ---- */

export function TrendChart({
  data,
  locale,
  labels,
}: {
  data: DayBucket[]
  locale: Locale
  labels: { views: string; peak: string; table: string; date: string; sessions: string }
}) {
  const max = Math.max(...data.map((d) => d.views), 0)
  const ceiling = niceCeiling(max)
  const peakIndex = max > 0 ? data.findIndex((d) => d.views === max) : -1
  const divisions = [4, 3, 5].find((d) => Number.isInteger(ceiling / d)) ?? 4
  const ticks = Array.from({ length: divisions + 1 }, (_, i) => i / divisions)

  return (
    <>
      <div className="chart">
        <div className="chart__plot">
          <div className="chart__grid" aria-hidden="true">
            {ticks.map((t) => (
              <div className="chart__gridline" key={t} style={{ bottom: `${t * 100}%` }}>
                <span>{Math.round(ceiling * t).toLocaleString(locale)}</span>
              </div>
            ))}
          </div>

          <ol className="chart__bars">
            {data.map((day, index) => (
              <li
                className="chart__bar"
                key={day.date}
                data-peak={index === peakIndex ? 'true' : undefined}
                tabIndex={0}
              >
                <span className="chart__tip">
                  {formatDay(day.date, locale)} · {day.views.toLocaleString(locale)}
                </span>
                <span
                  className="chart__mark"
                  style={{ ['--h' as string]: `${ceiling ? (day.views / ceiling) * 100 : 0}%` }}
                />
              </li>
            ))}
          </ol>
        </div>

        <div className="chart__axis">
          <span>{data.length ? formatDay(data[0].date, locale) : ''}</span>
          <span>{data.length ? formatDay(data[data.length - 1].date, locale) : ''}</span>
        </div>
      </div>

      {peakIndex >= 0 ? (
        <p className="chart__peak">
          {labels.peak}: <strong>{formatDay(data[peakIndex].date, locale, true)}</strong>,{' '}
          {max.toLocaleString(locale)} {labels.views.toLocaleLowerCase(locale)}
        </p>
      ) : null}

      <details className="data-toggle">
        <summary>{labels.table}</summary>
        <div className="table-scroll" tabIndex={0} role="region" aria-label={labels.table}>
          <table className="spec-table">
            <thead>
              <tr>
                <th scope="col">{labels.date}</th>
                <th scope="col">{labels.views}</th>
                <th scope="col">{labels.sessions}</th>
              </tr>
            </thead>
            <tbody>
              {data.map((day) => (
                <tr key={day.date}>
                  <th scope="row">{formatDay(day.date, locale, true)}</th>
                  <td>{day.views.toLocaleString(locale)}</td>
                  <td>{day.sessions.toLocaleString(locale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </>
  )
}

/* -------------------------------------------------------------- RANKED --- */

export function RankedBars({
  rows,
  locale,
  empty,
}: {
  rows: Ranked[]
  locale: Locale
  empty: string
}) {
  if (rows.length === 0) return <p className="empty-note">{empty}</p>
  const max = Math.max(...rows.map((r) => r.value))

  return (
    <ol className="ranked">
      {rows.map((row) => (
        <li className="ranked__row" key={row.label}>
          <div className="ranked__head">
            <span className="ranked__label">{row.label}</span>
            <span className="ranked__value">{row.value.toLocaleString(locale)}</span>
          </div>
          <div
            className="ranked__mark"
            style={{ ['--w' as string]: `${(row.value / max) * 100}%` }}
            aria-hidden="true"
          />
        </li>
      ))}
    </ol>
  )
}

/* --------------------------------------------------------------- SPLIT --- */

export function SplitBar({
  rows,
  locale,
  empty,
}: {
  rows: { label: string; value: number }[]
  locale: Locale
  empty: string
}) {
  const total = rows.reduce((sum, r) => sum + r.value, 0)
  if (total === 0) return <p className="empty-note">{empty}</p>

  return (
    <>
      <div className="split-bar" aria-hidden="true">
        {rows.map((row) => (
          <span
            className="split-bar__seg"
            key={row.label}
            style={{ ['--w' as string]: `${(row.value / total) * 100}%` }}
          />
        ))}
      </div>
      <ul className="split-legend">
        {rows.map((row, index) => (
          <li key={row.label}>
            <span
              className="split-legend__swatch"
              style={{ background: index === 0 ? 'var(--red)' : '#8a8a8a' }}
              aria-hidden="true"
            />
            {row.label}
            <span className="split-legend__value">
              {row.value.toLocaleString(locale)} · {Math.round((row.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </>
  )
}
