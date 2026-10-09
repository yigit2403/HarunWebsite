import type { Localised } from '@/lib/i18n'

import type { PhotoSlot } from './pages'

/**
 * Liquilob internal gear pump.
 *
 * A second pump type beside the LQL lobe series, and deliberately not a sixth
 * entry in content/products.ts: the lobe-pump specification structure (rotor
 * geometry, CIP, frame sizes named by port DN) does not describe this machine,
 * and forcing it in would print rows that mean nothing for it.
 *
 * There are no models and no figures yet. The copy is built from Profimann's
 * own description; nothing here states a capacity, pressure or viscosity
 * limit, because none has been issued in writing. When it is, it belongs in a
 * specs block shaped like ModelSpecs, not in this prose.
 */

export const GEAR_PUMP = {
  /** Localised, unlike model codes: this is a name, not a code. */
  slug: { tr: 'ic-disli-pompa', en: 'internal-gear-pump' } as Localised,
  name: { tr: 'İç Dişli Pompa', en: 'Internal Gear Pump' } as Localised,
  type: { tr: 'Pozitif deplasmanlı pompa', en: 'Positive displacement pump' } as Localised,

  summary: {
    tr: 'Farklı viskozitelerdeki sıvıların hassas, güvenilir ve kesintisiz transferi için iç dişli pompa.',
    en: 'An internal gear pump for precise, reliable and continuous transfer of liquids across a wide range of viscosities.',
  } as Localised,

  overview: {
    tr: [
      'İç dişli pompalar, farklı viskozitelere sahip sıvıların hassas, güvenilir ve kesintisiz transferi için tasarlanmış pozitif deplasmanlı pompalardır.',
      'İç içe çalışan iki dişlinin oluşturduğu hacim değişimi sayesinde akışkan, düşük titreşim ve düzenli debi ile taşınır. Kompakt yapıları, yüksek emiş kabiliyetleri ve verimli çalışma özellikleriyle endüstriyel uygulamalarda tercih edilir.',
      'Debi, pozitif deplasman prensibi gereği mil devriyle orantılıdır ve basınçla belirgin biçimde değişmez. Bu, frekans invertörüyle debi ayarını ve tekrarlanabilir transferi kolaylaştırır.',
    ],
    en: [
      'Internal gear pumps are positive displacement pumps designed for precise, reliable and continuous transfer of liquids across a wide range of viscosities.',
      'Two gears turning one inside the other create a changing volume that carries the liquid through the pump with low vibration and an even flow. Their compact construction, strong suction and efficient running make them a common choice in industrial service.',
      'As with any positive displacement pump, flow is proportional to shaft speed and changes little with pressure. That makes flow straightforward to set with a variable frequency drive, and transfers repeatable.',
    ],
  },

  /** How it works, in the order the liquid meets it. */
  principle: [
    {
      title: { tr: 'Emiş', en: 'Suction' },
      body: {
        tr: 'Emme tarafında dişliler birbirinden ayrılırken diş boşlukları açılır. Büyüyen hacim akışkanı pompanın içine çeker.',
        en: 'On the suction side the gears come out of mesh and the tooth spaces open. The growing volume draws the liquid into the pump.',
      },
    },
    {
      title: { tr: 'Taşıma', en: 'Transfer' },
      body: {
        tr: 'Akışkan, dış dişlinin ve iç dişlinin diş boşluklarında basma tarafına taşınır. Hilal biçimli ayırıcı iki akışı birbirinden ayırır.',
        en: 'The liquid is carried round to the discharge side in the tooth spaces of the outer and inner gear, kept apart by a crescent-shaped separator.',
      },
    },
    {
      title: { tr: 'Basma', en: 'Discharge' },
      body: {
        tr: 'Basma tarafında dişliler yeniden kavraşır, diş boşlukları kapanır ve akışkan çıkış ağzından düzenli bir debiyle itilir.',
        en: 'On the discharge side the gears mesh again, the tooth spaces close, and the liquid is pushed out through the outlet at an even rate.',
      },
    },
  ],

  advantages: [
    {
      term: { tr: 'Düşük titreşimli ve sessiz çalışma', en: 'Low vibration, quiet running' },
      def: {
        tr: 'Sürekli kavrama halindeki dişliler düzgün bir dönüş sağlar; boru hattına aktarılan titreşim ve gürültü düşük kalır.',
        en: 'Gears in continuous mesh turn smoothly, so little vibration or noise is passed into the pipework.',
      },
    },
    {
      term: { tr: 'Yüksek viskozitede etkili transfer', en: 'Effective with viscous liquids' },
      def: {
        tr: 'Viskozite arttıkça iç kaçak azalır; reçine, yağ ve boya gibi koyu akışkanlar düşük devirde verimli biçimde taşınır.',
        en: 'Internal slip falls as viscosity rises, so thick liquids such as resins, oils and paints are moved efficiently at low speed.',
      },
    },
    {
      term: { tr: 'Hassas ve düzenli debi', en: 'Precise, even flow' },
      def: {
        tr: 'Her devirde sabit hacim taşınır. Debi devirle ayarlanır, basınç dalgalanmalarından az etkilenir.',
        en: 'A fixed volume is moved on every revolution. Flow is set by speed and is little affected by swings in pressure.',
      },
    },
    {
      term: { tr: 'Kompakt, dayanıklı ve uzun ömürlü', en: 'Compact, robust, long-lived' },
      def: {
        tr: 'Az sayıda hareketli parça ve kısa gövde, dar alanlara montajı ve bakımı kolaylaştırır.',
        en: 'Few moving parts and a short body make the pump easy to fit into tight spaces and to maintain.',
      },
    },
    {
      term: { tr: 'Farklı sıcaklık ve basınç koşullarına uygunluk', en: 'Suited to varied temperature and pressure' },
      def: {
        tr: 'Malzeme, salmastra ve boşluk seçimi akışkana ve çalışma koşullarına göre yapılır.',
        en: 'Materials, shaft seal and clearances are selected for the liquid and the operating conditions.',
      },
    },
  ],

  /** Keys into content/applications.ts, for the industries that have a page. */
  applications: ['chemical', 'food-beverage', 'pharma-cosmetics', 'industrial-process'],

  /** The rest of Profimann's list, which has no application page of its own. */
  otherIndustries: {
    tr: ['Petrokimya', 'Boya', 'Reçine', 'Madeni yağ', 'Diğer endüstriyel sıvı transferleri'],
    en: ['Petrochemicals', 'Paint', 'Resin', 'Lubricating oil', 'Other industrial liquid transfer'],
  },

  /**
   * The question an engineer asks first on a site that sells both. General
   * practice only, and framed as such: the selection itself is made from
   * process data.
   */
  versusLobe: {
    title: { tr: 'Loblu pompa mı, iç dişli pompa mı?', en: 'Lobe pump or internal gear pump?' } as Localised,
    body: {
      tr: 'Genel bir kural olarak: hijyenik proseslerde, CIP ile temizlenen hatlarda ve katı parçacık taşıyan ya da kesmeye duyarlı ürünlerde loblu pompa; yağ, reçine, boya gibi temiz ve viskoz akışkanlarda iç dişli pompa öne çıkar. Doğru seçim proses verisiyle yapılır; akışkanınızı ve çalışma koşullarınızı bildirin, birlikte değerlendirelim.',
      en: 'As a general rule: on hygienic processes, lines cleaned in place, and products carrying solids or sensitive to shear, the lobe pump leads; on clean, viscous liquids such as oils, resins and paints, the internal gear pump does. The right choice is made from process data; send us your fluid and operating conditions and we will work through it with you.',
    } as Localised,
  },

  dataNote: {
    tr: 'Model, debi ve basınç aralıkları prosesinize göre belirlenir. Teknik veri ve teklif için akışkanınızı, debiyi, basıncı ve sıcaklığı bildirin.',
    en: 'Models, flow and pressure ranges are selected for your process. For technical data and a quotation, send us your fluid, flow rate, pressure and temperature.',
  } as Localised,
}

/** Section headings on the page. */
export const GEAR_PUMP_HEADINGS = {
  overview: { tr: 'Genel bakış', en: 'Overview' },
  principle: { tr: 'Çalışma prensibi', en: 'How it works' },
  advantages: { tr: 'Başlıca avantajlar', en: 'Main advantages' },
  applications: { tr: 'Kullanım alanları', en: 'Where it is used' },
  gallery: { tr: 'Görünüşler', en: 'Views' },
  data: { tr: 'Teknik veri', en: 'Technical data' },
  /** The products page and the home page link here under this. */
  family: { tr: 'Diğer pompa tipi', en: 'Also from Liquilob' },
} as const

export const GEAR_PHOTOS: Record<'side' | 'set' | 'front', PhotoSlot> = {
  side: {
    id: 'gearSide',
    ratio: '1690 / 931',
    src: '/photos/gear-pump-side.webp',
    label: {
      tr: 'Liquilob iç dişli pompa yandan: flanşlı emme ağzı, rulman yatağı gövdesi ve tahrik mili',
      en: 'Liquilob internal gear pump from the side: flanged suction port, bearing bracket and drive shaft',
    },
  },
  set: {
    id: 'gearSet',
    ratio: '1690 / 931',
    src: '/photos/gear-pump-set.webp',
    label: {
      tr: 'Ortak şase üzerinde Liquilob iç dişli pompa grubu: pompa, kaplin muhafazası, redüktör ve elektrik motoru',
      en: 'A Liquilob internal gear pump set on a common baseplate: pump, coupling guard, gear reducer and electric motor',
    },
  },
  front: {
    id: 'gearFront',
    ratio: '1690 / 931',
    src: '/photos/gear-pump-front.webp',
    label: {
      tr: 'Liquilob iç dişli pompanın ön kapağı ve flanşlı basma ağzı',
      en: 'Front cover and flanged discharge port of the Liquilob internal gear pump',
    },
  },
}
