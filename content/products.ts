import type { Localised } from '@/lib/i18n'

/**
 * Liquilob LQL series.
 *
 * IMPORTANT - specification values below are engineering placeholders that
 * follow the internal geometry of the series (displacement x speed) so the
 * catalogue is dimensionally coherent for review. They are NOT verified test
 * data. While SPECS_ARE_PROVISIONAL in content/site.ts is true, every table
 * renders a visible advisory. Replace the numbers here with Profimann's
 * measured figures and set the flag to false.
 */

export type SpecRow = {
  label: Localised
  value: Localised
  /** Prose renders in the text face; numeric values stay in the mono face. */
  prose?: boolean
}

export type SpecGroup = {
  title: Localised
  rows: SpecRow[]
}

/**
 * The measured values for one model. This is the single source of truth: the
 * catalogue card, the comparison table and the technical data table are all
 * derived from it, so a figure cannot be updated in one place and go stale in
 * another. It is also the only block that changes when Profimann's verified
 * test data replaces the current placeholders.
 */
export type ModelSpecs = {
  capacity: Localised
  pressure: Localised
  displacement: Localised
  speed: Localised
  viscosity: Localised
  connection: Localised
  weight: Localised
}

/**
 * The two languages punctuate numbers differently, and showing one form to the
 * other audience misreads: Turkish "60.000 mPa·s" is sixty to an English
 * reader, and "l/dev" is a Turkish abbreviation. Values that read identically
 * in both languages are written once.
 */
const loc = (tr: string, en: string = tr): Localised => ({ tr, en })

export type Product = {
  /** Model code. Identical in both languages by design. */
  slug: string
  name: string
  series: string
  type: Localised
  summary: Localised
  description: Localised<string[]>
  specs: ModelSpecs
  /** Derived from `specs`. Shown on the card and at the top of the detail page. */
  keySpecs: { label: Localised; value: Localised }[]
  /** Derived from `specs`. */
  specGroups: SpecGroup[]
  advantages: { term: Localised; def: Localised }[]
  /** Keys into content/applications.ts */
  applications: string[]
  /** Relative body scale used by the elevation drawing, 1 = LQL-100. */
  drawScale: number
}

const TEMP_RANGE = loc('−20 … +130 °C')

const ROTOR_OPTIONS: Localised = {
  tr: 'Tek kanatlı, çift kanatlı, üç loblu veya çok pervaneli rotor',
  en: 'Single-wing, bi-wing, tri-lobe or multi-impeller rotor',
}

const SEAL_OPTIONS: Localised = {
  tr: 'Tek mekanik salmastra, yıkamalı çift mekanik salmastra veya kartuş tip',
  en: 'Single mechanical seal, flushed double mechanical seal or cartridge type',
}

const CONNECTION_OPTIONS: Localised = {
  tr: 'DIN 11851, SMS, Clamp (DIN 32676) veya DIN EN 1092-1 flanş',
  en: 'DIN 11851, SMS, Clamp (DIN 32676) or DIN EN 1092-1 flange',
}

const CASING_MATERIAL: Localised = {
  tr: '1.4404 (AISI 316L) paslanmaz çelik veya EN-GJL-250 dökme demir',
  en: '1.4404 (AISI 316L) stainless steel or EN-GJL-250 cast iron',
}

const ELASTOMERS: Localised = {
  tr: 'NBR, EPDM, FKM veya FFKM (akışkana göre)',
  en: 'NBR, EPDM, FKM or FFKM, selected for the medium',
}

const DRIVE: Localised = {
  tr: 'Helisel dişli redüktörlü motor; frekans invertörü ile debi kontrolü',
  en: 'Helical geared motor, with flow control via variable frequency drive',
}

function specGroupsFrom(o: ModelSpecs): SpecGroup[] {
  return [
    {
      title: { tr: 'Hidrolik veriler', en: 'Hydraulic data' },
      rows: [
        { label: { tr: 'Kapasite aralığı', en: 'Capacity range' }, value: o.capacity },
        { label: { tr: 'Maksimum diferansiyel basınç', en: 'Maximum differential pressure' }, value: o.pressure },
        { label: { tr: 'Devir başına hacim', en: 'Displacement per revolution' }, value: o.displacement },
        { label: { tr: 'Çalışma devri', en: 'Operating speed' }, value: o.speed },
        { label: { tr: 'Viskozite aralığı', en: 'Viscosity range' }, value: o.viscosity },
        { label: { tr: 'Akışkan sıcaklığı', en: 'Fluid temperature' }, value: TEMP_RANGE },
      ],
    },
    {
      title: { tr: 'Mekanik yapı', en: 'Mechanical construction' },
      rows: [
        { label: { tr: 'Bağlantı ölçüsü', en: 'Port size' }, value: o.connection },
        { label: { tr: 'Bağlantı tipleri', en: 'Connection types' }, value: CONNECTION_OPTIONS, prose: true },
        { label: { tr: 'Rotor seçenekleri', en: 'Rotor options' }, value: ROTOR_OPTIONS, prose: true },
        { label: { tr: 'Salmastra seçenekleri', en: 'Shaft seal options' }, value: SEAL_OPTIONS, prose: true },
        { label: { tr: 'Gövde malzemesi', en: 'Casing material' }, value: CASING_MATERIAL, prose: true },
        { label: { tr: 'Elastomerler', en: 'Elastomers' }, value: ELASTOMERS, prose: true },
        { label: { tr: 'Tahrik', en: 'Drive' }, value: DRIVE, prose: true },
        { label: { tr: 'Pompa ağırlığı (yaklaşık)', en: 'Pump weight, approximate' }, value: o.weight },
      ],
    },
  ]
}

/** The three values an engineer scans first, in the order they scan them. */
function keySpecsFrom(o: ModelSpecs): Product['keySpecs'] {
  return [
    { label: { tr: 'Kapasite', en: 'Capacity' }, value: o.capacity },
    { label: { tr: 'Maks. basınç', en: 'Max. pressure' }, value: o.pressure },
    { label: { tr: 'Bağlantı', en: 'Connection' }, value: o.connection },
  ]
}

const SHARED_ADVANTAGES: Product['advantages'] = [
  {
    term: { tr: 'Çift yönlü çalışma', en: 'Bi-directional operation' },
    def: {
      tr: 'Dönüş yönü değiştirildiğinde emme ve basma yön değiştirir. Hat boşaltma için ayrı ekipman gerekmez.',
      en: 'Reversing the direction of rotation reverses suction and discharge, so emptying a line needs no additional equipment.',
    },
  },
  {
    term: { tr: 'Devirle orantılı debi', en: 'Flow proportional to speed' },
    def: {
      tr: 'Hacimsel prensip nedeniyle debi mil devriyle doğru orantılıdır; invertör üzerinden dozajlama yapılabilir.',
      en: 'The positive displacement principle keeps flow proportional to shaft speed, which makes dosing over a frequency drive straightforward.',
    },
  },
  {
    term: { tr: 'Düşük kesme kuvveti', en: 'Low shear' },
    def: {
      tr: 'Geniş akış kesitleri ve düşük devir, parçacıklı ve hassas ürünlerin yapısını korur.',
      en: 'Wide flow passages and low shaft speeds preserve the structure of particulate and shear-sensitive products.',
    },
  },
  {
    term: { tr: 'Kuru emiş kabiliyeti', en: 'Dry self-priming capability' },
    def: {
      tr: 'Rotor geometrisi negatif emme yüksekliğinde de emiş oluşturur; hattın dolu tutulması gerekmez.',
      en: 'The rotor geometry generates suction under a negative head, so the line does not have to be kept flooded.',
    },
  },
  {
    term: { tr: 'Önden bakım', en: 'Front-loading maintenance' },
    def: {
      tr: 'Rotorlar ve salmastralar ön kapak sökülerek değiştirilir. Pompa hattan ve tahrikten ayrılmaz.',
      en: 'Rotors and seals are changed through the front cover. The pump stays coupled to the line and to its drive.',
    },
  },
  {
    term: { tr: 'Uygulamaya özel konfigürasyon', en: 'Application-specific configuration' },
    def: {
      tr: 'Rotor kanat sayısı, elastomer sınıfı, salmastra tipi ve bağlantı standardı akışkana göre seçilir.',
      en: 'Rotor wing count, elastomer grade, seal type and connection standard are all selected for the medium.',
    },
  },
]

type RawProduct = Omit<Product, 'keySpecs' | 'specGroups'>

const MODELS: RawProduct[] = [
  {
    slug: 'lql-25',
    name: 'LQL-25',
    series: 'Liquilob LQL',
    type: { tr: 'Loblu Rotorlu Pompa', en: 'Rotary Lobe Pump' },
    summary: {
      tr: 'Dozajlama ve küçük hat transferleri için serinin en kompakt gövdesi.',
      en: 'The most compact frame in the series, for dosing duties and small-bore transfer lines.',
    },
    description: {
      tr: [
        'LQL-25, laboratuvar ölçeğinden pilot üretime kadar küçük debili hatlar için tasarlanmış kompakt bir loblu pompadır. Dar hacimsel toleransları sayesinde düşük devirde bile kararlı bir dozaj sağlar.',
        'Kısa gövde boyu, mevcut proses hatlarına sonradan eklenmesini kolaylaştırır. Aromalar, katkı çözeltileri ve viskoz konsantreler için tercih edilir.',
      ],
      en: [
        'LQL-25 is a compact lobe pump for low flow lines, from laboratory scale up to pilot production. Tight volumetric tolerances hold a stable dose even at low shaft speeds.',
        'The short frame length makes it straightforward to retrofit into an existing process line. It is typically used for flavourings, additive solutions and viscous concentrates.',
      ],
    },
    specs: {
      capacity: loc('0,5 – 8 m³/h', '0.5 – 8 m³/h'),
      pressure: loc('8 bar'),
      displacement: loc('0,20 l/dev', '0.20 l/rev'),
      speed: loc('150 – 700 dev/dk', '150 – 700 rpm'),
      viscosity: loc('1 – 60.000 mPa·s', '1 – 60,000 mPa·s'),
      connection: loc('DN 25 – DN 40'),
      weight: loc('38 kg'),
    },
    advantages: SHARED_ADVANTAGES,
    applications: ['food-beverage', 'pharma-cosmetics', 'chemical'],
    drawScale: 0.78,
  },
  {
    slug: 'lql-50',
    name: 'LQL-50',
    series: 'Liquilob LQL',
    type: { tr: 'Loblu Rotorlu Pompa', en: 'Rotary Lobe Pump' },
    summary: {
      tr: 'Hijyenik dolum ve orta debili proses transferleri için ana gövde boyu.',
      en: 'The core frame size for hygienic filling duties and mid-range process transfer.',
    },
    description: {
      tr: [
        'LQL-50, gıda, süt ve kozmetik hatlarında en sık kullanılan gövde boyudur. CIP devrelerine doğrudan bağlanabilir ve dolum makinelerinin önünde besleme pompası olarak çalışır.',
        'Rotor geometrisi akışkana göre seçilir: büyük parçacıklı ürünlerde tek kanatlı, kremamsı ürünlerde çift kanatlı, düşük pulsasyon istenen dolum hatlarında üç loblu rotor kullanılır.',
      ],
      en: [
        'LQL-50 is the frame size most often specified on food, dairy and cosmetics lines. It connects directly into CIP circuits and works as a feed pump ahead of filling machines.',
        'Rotor geometry is selected for the medium: single-wing for products carrying large particles, bi-wing for creamy products, tri-lobe where a filling line needs low pulsation.',
      ],
    },
    specs: {
      capacity: loc('4 – 30 m³/h'),
      pressure: loc('10 bar'),
      displacement: loc('0,90 l/dev', '0.90 l/rev'),
      speed: loc('100 – 600 dev/dk', '100 – 600 rpm'),
      viscosity: loc('1 – 100.000 mPa·s', '1 – 100,000 mPa·s'),
      connection: loc('DN 50 – DN 65'),
      weight: loc('76 kg'),
    },
    advantages: SHARED_ADVANTAGES,
    applications: ['food-beverage', 'dairy', 'pharma-cosmetics'],
    drawScale: 0.9,
  },
  {
    slug: 'lql-100',
    name: 'LQL-100',
    series: 'Liquilob LQL',
    type: { tr: 'Loblu Rotorlu Pompa', en: 'Rotary Lobe Pump' },
    summary: {
      tr: 'Yüksek viskoziteli ve katı madde içeren akışkanlar için ana proses pompası.',
      en: 'The principal process pump for high-viscosity media and fluids carrying solids.',
    },
    description: {
      tr: [
        'LQL-100, yüksek viskoziteli ürünlerin ve katı madde taşıyan akışkanların sürekli transferi için tasarlanmıştır. Geniş emme ağzı, sıvılaştırılmış çamur ve pulplu ürünlerde tıkanma riskini azaltır.',
        'Aşınma plakaları ve rotor uçları ayrı parçalar olarak üretilir; aşınma durumunda gövde değiştirilmeden yenilenir. Bu, atıksu ve dolgu macunu gibi abrazif uygulamalarda toplam işletme maliyetini doğrudan etkiler.',
      ],
      en: [
        'LQL-100 is built for continuous transfer of high-viscosity products and fluids carrying solids. A wide suction port reduces the risk of blockage with thickened sludge and pulp-bearing products.',
        'Wear plates and rotor tips are separate parts and are renewed without replacing the casing. On abrasive duties such as wastewater and filler compounds this drives the operating cost directly.',
      ],
    },
    specs: {
      capacity: loc('15 – 90 m³/h'),
      pressure: loc('12 bar'),
      displacement: loc('3,20 l/dev', '3.20 l/rev'),
      speed: loc('100 – 500 dev/dk', '100 – 500 rpm'),
      viscosity: loc('1 – 150.000 mPa·s', '1 – 150,000 mPa·s'),
      connection: loc('DN 80 – DN 100'),
      weight: loc('145 kg'),
    },
    advantages: SHARED_ADVANTAGES,
    applications: ['chemical', 'wastewater', 'industrial-process'],
    drawScale: 1,
  },
  {
    slug: 'lql-200',
    name: 'LQL-200',
    series: 'Liquilob LQL',
    type: { tr: 'Loblu Rotorlu Pompa', en: 'Rotary Lobe Pump' },
    summary: {
      tr: 'Arıtma tesisleri ve büyük hacimli proses hatları için en büyük gövde boyu.',
      en: 'The largest frame in the series, for treatment plants and high-volume process lines.',
    },
    description: {
      tr: [
        'LQL-200, arıtma tesislerinde yoğunlaştırılmış çamur sirkülasyonu ve büyük hacimli proses transferleri için kullanılır. Düşük devirde yüksek debi verecek şekilde boyutlandırılmıştır; bu da aşınmayı ve enerji tüketimini sınırlar.',
        'Takviyeli mil ve büyütülmüş yatak grubu, uzun basma hatlarında oluşan eksenel yükleri karşılar.',
      ],
      en: [
        'LQL-200 handles thickened sludge circulation in treatment plants and high-volume process transfer. It is dimensioned to deliver high flow at low shaft speed, which limits both wear and energy consumption.',
        'A reinforced shaft and an enlarged bearing set carry the axial loads that build up on long discharge lines.',
      ],
    },
    specs: {
      capacity: loc('60 – 220 m³/h'),
      pressure: loc('12 bar'),
      displacement: loc('9,50 l/dev', '9.50 l/rev'),
      speed: loc('80 – 400 dev/dk', '80 – 400 rpm'),
      viscosity: loc('1 – 200.000 mPa·s', '1 – 200,000 mPa·s'),
      connection: loc('DN 125 – DN 150'),
      weight: loc('310 kg'),
    },
    advantages: SHARED_ADVANTAGES,
    applications: ['wastewater', 'industrial-process', 'chemical'],
    drawScale: 1.15,
  },
]

export const PRODUCTS: Product[] = MODELS.map((model) => ({
  ...model,
  keySpecs: keySpecsFrom(model.specs),
  specGroups: specGroupsFrom(model.specs),
}))

export function productBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug)
}

/** Compact comparison used at the top of the catalogue page. */
export const COMPARE_COLUMNS: { key: 'capacity' | 'pressure' | 'connection' | 'viscosity'; label: Localised }[] = [
  { key: 'capacity', label: { tr: 'Kapasite', en: 'Capacity' } },
  { key: 'pressure', label: { tr: 'Maks. basınç', en: 'Max. pressure' } },
  { key: 'connection', label: { tr: 'Bağlantı', en: 'Connection' } },
  { key: 'viscosity', label: { tr: 'Viskozite', en: 'Viscosity' } },
]

export const COMPARE_ROWS: Record<string, Record<string, Localised>> = Object.fromEntries(
  PRODUCTS.map((p) => [
    p.slug,
    {
      capacity: p.specs.capacity,
      pressure: p.specs.pressure,
      connection: p.specs.connection,
      viscosity: p.specs.viscosity,
    },
  ])
)
