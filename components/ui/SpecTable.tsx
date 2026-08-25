import { UI } from '@/content/dict'
import { SPECS_ARE_PROVISIONAL } from '@/content/site'
import type { SpecGroup } from '@/content/products'
import type { Locale } from '@/lib/i18n'

/**
 * Technical data table. Horizontally scrollable on narrow screens rather than
 * collapsed, because hiding a specification from a mobile reader is worse than
 * asking them to scroll. The scroll container is focusable so it can be
 * reached and panned from the keyboard.
 */
export function SpecTable({
  group,
  locale,
  note = true,
}: {
  group: SpecGroup
  locale: Locale
  note?: boolean
}) {
  return (
    <div
      className="table-scroll"
      tabIndex={0}
      role="region"
      aria-label={group.title[locale]}
    >
      <table className="spec-table">
        <caption>{group.title[locale]}</caption>
        <thead>
          <tr>
            <th scope="col">{UI.property[locale]}</th>
            <th scope="col">{UI.value[locale]}</th>
          </tr>
        </thead>
        <tbody>
          {group.rows.map((row) => {
            const value = typeof row.value === 'string' ? row.value : row.value[locale]
            const isProse = typeof row.value !== 'string'
            return (
              <tr key={row.label.en}>
                <th scope="row">{row.label[locale]}</th>
                <td className={isProse ? 'is-text' : undefined}>{value}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {note && SPECS_ARE_PROVISIONAL ? (
        <p className="spec-table__note">{UI.provisionalNote[locale]}</p>
      ) : null}
    </div>
  )
}

/** Model-by-model comparison used at the head of the catalogue page. */
export function CompareTable({
  columns,
  rows,
  locale,
  caption,
}: {
  columns: { key: string; label: string }[]
  rows: { model: string; values: Record<string, string> }[]
  locale: Locale
  caption: string
}) {
  return (
    <div className="table-scroll" tabIndex={0} role="region" aria-label={caption}>
      <table className="spec-table">
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th scope="col">{UI.model[locale]}</th>
            {columns.map((c) => (
              <th scope="col" key={c.key}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.model}>
              <th scope="row">{r.model}</th>
              {columns.map((c) => (
                <td key={c.key}>{r.values[c.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {SPECS_ARE_PROVISIONAL ? (
        <p className="spec-table__note">{UI.provisionalNote[locale]}</p>
      ) : null}
    </div>
  )
}
