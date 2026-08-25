import type { Localised } from '@/lib/i18n'

/**
 * Body configurations that cut across the whole LQL range.
 *
 * These are not separate models: any frame size can be built jacketed or in
 * polypropylene. Content from Profimann's chocolate and PP-series documents.
 */

export type Configuration = {
  key: 'jacketed' | 'pp'
  name: Localised
  latin: string
  summary: Localised
  body: Localised<string[]>
  points: Localised<string[]>
  /** Application keys where this configuration is the usual answer. */
  applications: string[]
}

export const CONFIGURATIONS: Configuration[] = [
  {
    key: 'jacketed',
    name: { tr: 'Ceketli Gövde', en: 'Jacketed Body' },
    latin: 'Jacketed',
    summary: {
      tr: 'Düşük sıcaklıkta katılaşan ürünler için sıcaklık kontrollü gövde.',
      en: 'A temperature-controlled body for products that set as they cool.',
    },
    body: {
      tr: [
        'Çikolata ve benzeri kremamsı ürünler düşük sıcaklıklarda hızla katılaşma eğilimi gösterir. Bu, transfer ekipmanında ısıtma, ilk çalıştırma güvenliği ve akış stabilitesi açısından yüksek teknik gereksinim doğurur.',
        'Ceketli konfigürasyonda pompa gövdesinin dışına entegre edilmiş ısıtma ceketi, ürünle temas etmeden kontrollü ısı transferi sağlar. Isıtma ortamı olarak buhar veya sıcak su, saha koşullarına göre seçilebilir.',
        'Bu yapı sayesinde ürün proses boyunca akışkan formunu korur. Pompa ilk çalıştırmada zorlanmaz; ani duruş ve tıkanma riski ortadan kalkar.',
      ],
      en: [
        'Chocolate and similar creamy products set quickly as they cool. That places real demands on transfer equipment: heating, safe start-up and stable flow all have to be solved together.',
        'In the jacketed configuration a heating jacket integrated on the outside of the pump body transfers heat under control without touching the product. Steam or hot water can be used as the heating medium, chosen to suit the site.',
        'The product keeps its fluid form throughout the process. The pump is not strained at start-up, and the risk of sudden stoppage or blockage is removed.',
      ],
    },
    points: {
      tr: [
        'Sürekli sirkülasyonlu ısıtma',
        'Homojen sıcaklık dağılımı',
        'Düşük sıcaklıkta katılaşmanın önlenmesi',
        'Paslanmaz çelik gövde, kolay temizlenebilir hijyenik yapı',
      ],
      en: [
        'Continuously circulated heating',
        'Even temperature distribution',
        'Prevents the product setting as it cools',
        'Stainless steel body with an easily cleaned hygienic geometry',
      ],
    },
    applications: ['chocolate', 'food-beverage'],
  },
  {
    key: 'pp',
    name: { tr: 'PP Gövde', en: 'Polypropylene Body' },
    latin: 'PP',
    summary: {
      tr: 'Paslanmaz çeliğin istenmediği agresif kimyasallar için.',
      en: 'For aggressive chemicals where stainless steel is not wanted.',
    },
    body: {
      tr: [
        'Asidik ve bazik kimyasalların paslanmaz çelik ile temasının istenmediği uygulamalarda, ürünle temas eden yüzeyler yüksek kimyasal dayanım sağlayan polipropilen malzemeden üretilir.',
        'Bu yapı sayesinde pompa, agresif kimyasalların transferinde metal iyon salınımı ve yüzey bozulması olmadan çalışır. Reaktör besleme, tank dolumu ve hassas kimyasal dozajlama uygulamalarında düşük pulsasyon ve stabil debi sağlar.',
        'Sızdırmazlık, kimyasala uygun mekanik salmastra seçenekleriyle çözülür; operatör ve çevre güvenliği tasarımın parçasıdır.',
      ],
      en: [
        'Where acidic and alkaline chemicals should not meet stainless steel, the wetted surfaces are produced in polypropylene, which offers high chemical resistance.',
        'The pump then transfers aggressive chemicals without releasing metal ions and without surface degradation. On reactor feed, tank filling and precise chemical dosing it holds low pulsation and a stable flow rate.',
        'Sealing is solved with mechanical seal options matched to the medium, so operator and environmental safety are part of the design rather than an accessory to it.',
      ],
    },
    points: {
      tr: [
        'Asit ve bazlara karşı yüksek direnç',
        'Korozyon ve kimyasal aşınma riski yok',
        'Metal iyon salınımı olmadan transfer',
        'Kimyasala uygun mekanik salmastra seçenekleri',
      ],
      en: [
        'High resistance to acids and alkalis',
        'No corrosion or chemical erosion',
        'Transfer without metal ion release',
        'Mechanical seal options matched to the medium',
      ],
    },
    applications: ['chemical', 'wastewater'],
  },
]

/** Where the PP series is typically deployed, from the PP document. */
export const PP_SECTORS: Localised<string[]> = {
  tr: [
    'Kimya sanayi',
    'Su arıtma ve proses kimyasalları',
    'Deterjan ve temizlik ürünleri',
    'Asit ve baz transfer hatları',
    'Özel proses kimyasalları',
  ],
  en: [
    'Chemical industry',
    'Water treatment and process chemicals',
    'Detergents and cleaning products',
    'Acid and alkali transfer lines',
    'Speciality process chemicals',
  ],
}
