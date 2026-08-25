import Link from 'next/link'

import { A, INQUIRY_FIELD_ORDER } from './dict'
import { APPLICATIONS } from '@/content/applications'
import { findDocument } from '@/content/pages'
import { RankedBars, SplitBar, TrendChart } from '@/server/admin/Charts'
import { delta, summarise } from '@/server/analytics/aggregate'
import { analyticsStore } from '@/server/analytics/store'
import { LOCALE_NAME, isLocale, type Locale } from '@/lib/i18n'
import { mailConfigured } from '@/server/mail'

/**
 * Site analytics.
 *
 * A server component that reads the event log and renders it. No client
 * JavaScript, no chart library, no third-party analytics service: the data
 * never leaves Profimann's own infrastructure, which is also why the site
 * needs no cookie banner.
 */

export const dynamic = 'force-dynamic'

const RANGES = [7, 30, 90] as const
const DAY = 86_400_000

type Search = { d?: string; lang?: string }

/** Two fields store an id. Show the words the visitor actually saw. */
function readField(key: string, value: string, locale: Locale): string {
  if (key === 'application') {
    return APPLICATIONS.find((a) => a.key === value)?.name[locale] ?? value
  }
  if (key === 'doc') return findDocument(value)?.title[locale] ?? value
  return value
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<Search>
}) {
  const params = await searchParams
  const locale: Locale = isLocale(params.lang ?? '') ? (params.lang as Locale) : 'tr'
  const days = RANGES.includes(Number(params.d) as (typeof RANGES)[number])
    ? (Number(params.d) as (typeof RANGES)[number])
    : 30

  const store = analyticsStore()
  const now = Date.now()
  const events = await store.read(now - days * 2 * DAY)
  const s = summarise(events, days, now)

  const t = (key: keyof typeof A) => A[key][locale]
  const num = (n: number) => n.toLocaleString(locale)
  const rangeHref = (d: number) => `/admin?d=${d}${locale === 'en' ? '&lang=en' : ''}`
  const langHref = (l: Locale) => `/admin?d=${days}${l === 'en' ? '&lang=en' : ''}`

  const stats = [
    { label: t('views'), value: s.totals.views, change: delta(s.totals.views, s.previous.views) },
    {
      label: t('sessions'),
      value: s.totals.sessions,
      change: delta(s.totals.sessions, s.previous.sessions),
    },
    {
      label: t('inquiries'),
      value: s.totals.inquiries,
      change: delta(s.totals.inquiries, s.previous.inquiries),
    },
    {
      label: t('docRequests'),
      value: s.totals.docRequests,
      change: delta(s.totals.docRequests, s.previous.docRequests),
    },
  ]

  return (
    <div className="admin" lang={locale}>
      <header className="admin__bar">
        <div className="container admin__bar-inner">
          <div className="admin__title">
            <strong>{t('analytics')}</strong>
            Liquilob · Profimann
          </div>

          <nav className="segmented" aria-label={t('rangeLabel')}>
            {RANGES.map((r) => (
              <Link key={r} href={rangeHref(r)} aria-current={r === days ? 'true' : undefined}>
                {A[`range${r}` as 'range7' | 'range30' | 'range90'][locale]}
              </Link>
            ))}
          </nav>

          <nav className="segmented" aria-label="Language">
            {(['tr', 'en'] as Locale[]).map((l) => (
              <Link
                key={l}
                href={langHref(l)}
                aria-current={l === locale ? 'true' : undefined}
                aria-label={LOCALE_NAME[l]}
              >
                {l.toUpperCase()}
              </Link>
            ))}
          </nav>

          <Link className="btn btn--secondary btn--sm" href={`/${locale}`}>
            {t('backToSite')}
          </Link>
        </div>
      </header>

      <main className="container admin__main">
        {!mailConfigured() ? (
          <div className="notice">
            <strong>{t('mailOffTitle')}</strong> {t('mailOffBody')}
            {s.totals.undelivered > 0 ? (
              <>
                {' '}
                {t('mailOffCount')}: <strong>{num(s.totals.undelivered)}</strong>.
              </>
            ) : null}
          </div>
        ) : null}

        {!store.persistent ? (
          <div className="notice notice--neutral">
            <strong>{t('storageTitle')}</strong> {t('storageBody')}
          </div>
        ) : null}

        <div className="stats">
          {stats.map((stat) => (
            <div className="stat" key={stat.label}>
              <span className="stat__label">{stat.label}</span>
              <span className="stat__value">{num(stat.value)}</span>
              {stat.change !== null ? (
                <span className="stat__delta" data-dir={stat.change >= 0 ? 'up' : 'down'}>
                  {stat.change}% {t('vsPrevious')}
                </span>
              ) : null}
            </div>
          ))}
        </div>

        <div style={{ height: 'var(--grid-gap)' }} />

        <div className="admin-grid admin-grid--split">
          <section className="panel">
            <div className="panel__head">
              <h2 className="panel__title">{t('trendTitle')}</h2>
            </div>
            <TrendChart
              data={s.perDay}
              locale={locale}
              labels={{
                views: t('views'),
                sessions: t('sessions'),
                peak: t('peak'),
                table: t('tableView'),
                date: t('date'),
              }}
            />
          </section>

          <div>
            <section className="panel">
              <div className="panel__head">
                <h2 className="panel__title">{t('languageSplit')}</h2>
              </div>
              <SplitBar
                locale={locale}
                empty={t('noData')}
                rows={s.localeSplit.map((row) => ({
                  label: LOCALE_NAME[row.locale],
                  value: row.views,
                }))}
              />
            </section>

            <section className="panel">
              <div className="panel__head">
                <h2 className="panel__title">{t('devices')}</h2>
              </div>
              <RankedBars
                locale={locale}
                empty={t('noData')}
                rows={[
                  { label: t('mobile'), value: s.viewport.mobile },
                  { label: t('tablet'), value: s.viewport.tablet },
                  { label: t('desktop'), value: s.viewport.desktop },
                ]
                  .filter((r) => r.value > 0)
                  .sort((a, b) => b.value - a.value)}
              />
            </section>
          </div>
        </div>

        <div style={{ height: 'var(--grid-gap)' }} />

        <div className="admin-grid admin-grid--halves">
          <section className="panel">
            <div className="panel__head">
              <h2 className="panel__title">{t('topPages')}</h2>
            </div>
            <RankedBars rows={s.topPages} locale={locale} empty={t('noData')} />
          </section>

          <div>
            <section className="panel">
              <div className="panel__head">
                <h2 className="panel__title">{t('docsWanted')}</h2>
                <span className="panel__note">{t('docsNote')}</span>
              </div>
              <RankedBars rows={s.topDocs} locale={locale} empty={t('noData')} />
            </section>

            <section className="panel">
              <div className="panel__head">
                <h2 className="panel__title">{t('referrers')}</h2>
                <span className="panel__note">{t('referrersNote')}</span>
              </div>
              <RankedBars rows={s.topReferrers} locale={locale} empty={t('noData')} />
            </section>
          </div>
        </div>

        <div style={{ height: 'var(--grid-gap)' }} />

        <section className="panel">
          <div className="panel__head">
            <h2 className="panel__title">{t('recentInquiries')}</h2>
          </div>

          {s.recentInquiries.length === 0 ? (
            <p className="empty-note">{t('noInquiries')}</p>
          ) : (
            s.recentInquiries.map((inquiry) => (
              <article className="inquiry" key={`${inquiry.ts}-${inquiry.fields.email}`}>
                <div className="inquiry__head">
                  <h3 className="inquiry__company">
                    {inquiry.fields.company || inquiry.fields.name}
                  </h3>
                  {inquiry.delivery === 'stored' ? (
                    <span className="inquiry__flag">{t('notForwarded')}</span>
                  ) : null}
                  <span className="inquiry__meta">
                    {new Date(inquiry.ts).toLocaleString(locale === 'tr' ? 'tr-TR' : 'en-GB', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>
                <dl className="inquiry__fields">
                  {INQUIRY_FIELD_ORDER.filter(([key]) => inquiry.fields[key]).map(([key, label]) => (
                    <div key={key} className={key === 'message' ? 'inquiry__field--wide' : undefined}>
                      <dt>{label[locale]}</dt>
                      <dd>{readField(key, inquiry.fields[key], locale)}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  )
}
