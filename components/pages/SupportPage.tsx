import { Breadcrumb } from '@/components/site/Breadcrumb'
import { CtaBand } from '@/components/site/CtaBand'
import { DocList } from '@/components/ui/DocList'
import { SectionHead } from '@/components/ui/SectionHead'
import { NAV_LABEL, UI } from '@/content/dict'
import { DOCUMENTS, HOME_CTA, SUPPORT_PAGE } from '@/content/pages'
import type { Locale } from '@/lib/i18n'
import { href } from '@/lib/routes'

export function SupportPage({ locale }: { locale: Locale }) {
  return (
    <>
      <Breadcrumb
        locale={locale}
        trail={[{ label: UI.home[locale], url: href(locale) }, { label: NAV_LABEL.support[locale] }]}
      />

      <section className="masthead">
        <div className="container">
          <span className="rule" aria-hidden="true" />
          <h1 className="masthead__title">{SUPPORT_PAGE.title[locale]}</h1>
          <p className="masthead__lead">{SUPPORT_PAGE.lead[locale]}</p>
        </div>
      </section>

      <section className="section section--canvas">
        <div className="container">
          <SectionHead as="h2" title={UI.documents[locale]} />
          <DocList documents={DOCUMENTS} locale={locale} />
        </div>
      </section>

      <section className="section section--cloud">
        <div className="container">
          <SectionHead as="h2" title={SUPPORT_PAGE.supportTitle[locale]} />
          <div className="pillars">
            {SUPPORT_PAGE.support.map((item) => (
              <div className="pillar" key={item.term.en} data-reveal="">
                <span className="pillar__mark" aria-hidden="true" />
                <h3 className="pillar__title">{item.term[locale]}</h3>
                <p className="pillar__body">{item.def[locale]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        locale={locale}
        surface="canvas"
        title={HOME_CTA.title[locale]}
        body={HOME_CTA.body[locale]}
      />
    </>
  )
}
