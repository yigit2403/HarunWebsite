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
  /** A plain string for numeric values, a Localised for prose values. */
  value: string | Localised
}

export type SpecGroup = {
  title: Localised
  rows: SpecRow[]
}

export type Product = {
  /** Model code. Identical in both languages by design. */
  slug: string
  name: string
  series: string
  type: Localised
  summary: Localised
  description: Localised<string[]>
  /** Shown in the catalogue card and at the top of the detail page. */
  keySpecs: { label: Localised; value: string }[]
  specGroups: SpecGroup[]
  advantages: { term: Localised; def: Localised }[]
  /** Keys into content/applications.ts */
  applications: string[]
  /** Relative body scale used by the elevation drawing, 1 = LQL-100. */
  drawScale: number
}

const TEMP_RANGE = '-20 ... +130 °C'

const ROTOR_OPTIONS: Localised = {
  tr: '2 kanatlı, 3 kanatlı veya helisel rotor',
  en: 'Bi-wing, tri-lobe or helical rotor',
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

function commonGroups(o: {
  displacement: string
  speed: string
  capacity: string
  pressure: string
  viscosity: string
  connection: string
  weight: string
}): SpecGroup[] {
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
        { label: { tr: 'Bağlantı tipleri', en: 'Connection types' }, value: CONNECTION_OPTIONS },
        { label: { tr: 'Rotor seçenekleri', en: 'Rotor options' }, value: ROTOR_OPTIONS },
        { label: { tr: 'Salmastra seçenekleri', en: 'Shaft seal options' }, value: SEAL_OPTIONS },
        { label: { tr: 'Gövde malzemesi', en: 'Casing material' }, value: CASING_MATERIAL },
        { label: { tr: 'Elastomerler', en: 'Elastomers' }, value: ELASTOMERS },
        { label: { tr: 'Tahrik', en: 'Drive' }, value: DRIVE },
        { label: { tr: 'Pompa ağırlığı (yaklaşık)', en: 'Pump weight, approximate' }, value: o.weight },
      ],
    },
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

export const PRODUCTS: Product[] = [
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
    keySpecs: [
      { label: { tr: 'Kapasite', en: 'Capacity' }, value: '0,5 - 8 m³/h' },
      { label: { tr: 'Maks. basınç', en: 'Max. pressure' }, value: '8 bar' },
      { label: { tr: 'Bağlantı', en: 'Connection' }, value: 'DN 25 - DN 40' },
    ],
    specGroups: commonGroups({
      capacity: '0,5 - 8 m³/h',
      pressure: '8 bar',
      displacement: '0,20 l/dev',
      speed: '150 - 700 min-1',
      viscosity: '1 - 60.000 mPa·s',
      connection: 'DN 25 - DN 40',
      weight: '38 kg',
    }),
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
        'Rotor kanat sayısı akışkana göre seçilir: parçacıklı ürünlerde 2 kanatlı, düşük pulsasyon istenen dolum hatlarında 3 kanatlı veya helisel rotor kullanılır.',
      ],
      en: [
        'LQL-50 is the frame size most often specified on food, dairy and cosmetics lines. It connects directly into CIP circuits and works as a feed pump ahead of filling machines.',
        'Rotor wing count is selected for the medium: bi-wing for particulate products, tri-lobe or helical where a filling line needs low pulsation.',
      ],
    },
    keySpecs: [
      { label: { tr: 'Kapasite', en: 'Capacity' }, value: '4 - 30 m³/h' },
      { label: { tr: 'Maks. basınç', en: 'Max. pressure' }, value: '10 bar' },
      { label: { tr: 'Bağlantı', en: 'Connection' }, value: 'DN 50 - DN 65' },
    ],
    specGroups: commonGroups({
      capacity: '4 - 30 m³/h',
      pressure: '10 bar',
      displacement: '0,90 l/dev',
      speed: '100 - 600 min-1',
      viscosity: '1 - 100.000 mPa·s',
      connection: 'DN 50 - DN 65',
      weight: '76 kg',
    }),
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
    keySpecs: [
      { label: { tr: 'Kapasite', en: 'Capacity' }, value: '15 - 90 m³/h' },
      { label: { tr: 'Maks. basınç', en: 'Max. pressure' }, value: '12 bar' },
      { label: { tr: 'Bağlantı', en: 'Connection' }, value: 'DN 80 - DN 100' },
    ],
    specGroups: commonGroups({
      capacity: '15 - 90 m³/h',
      pressure: '12 bar',
      displacement: '3,20 l/dev',
      speed: '100 - 500 min-1',
      viscosity: '1 - 150.000 mPa·s',
      connection: 'DN 80 - DN 100',
      weight: '145 kg',
    }),
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
    keySpecs: [
      { label: { tr: 'Kapasite', en: 'Capacity' }, value: '60 - 220 m³/h' },
      { label: { tr: 'Maks. basınç', en: 'Max. pressure' }, value: '12 bar' },
      { label: { tr: 'Bağlantı', en: 'Connection' }, value: 'DN 125 - DN 150' },
    ],
    specGroups: commonGroups({
      capacity: '60 - 220 m³/h',
      pressure: '12 bar',
      displacement: '9,50 l/dev',
      speed: '80 - 400 min-1',
      viscosity: '1 - 200.000 mPa·s',
      connection: 'DN 125 - DN 150',
      weight: '310 kg',
    }),
    advantages: SHARED_ADVANTAGES,
    applications: ['wastewater', 'industrial-process', 'chemical'],
    drawScale: 1.15,
  },
]

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

export const COMPARE_ROWS: Record<string, Record<string, string>> = {
  'lql-25': { capacity: '0,5 - 8 m³/h', pressure: '8 bar', connection: 'DN 25 - 40', viscosity: '1 - 60.000 mPa·s' },
  'lql-50': { capacity: '4 - 30 m³/h', pressure: '10 bar', connection: 'DN 50 - 65', viscosity: '1 - 100.000 mPa·s' },
  'lql-100': { capacity: '15 - 90 m³/h', pressure: '12 bar', connection: 'DN 80 - 100', viscosity: '1 - 150.000 mPa·s' },
  'lql-200': { capacity: '60 - 220 m³/h', pressure: '12 bar', connection: 'DN 125 - 150', viscosity: '1 - 200.000 mPa·s' },
}
