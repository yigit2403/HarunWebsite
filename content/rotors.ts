import type { RotorKey } from '@/components/graphics/rotors'
import type { Localised } from '@/lib/i18n'

/**
 * Liquilob rotor family.
 *
 * Content from Profimann's "Liquilob Rotor Teknolojileri" document. The four
 * geometries are the product's real differentiator, so they get their own page
 * rather than a single row in a specification table.
 */

export type Rotor = {
  key: RotorKey
  /** Model-independent, so the slug is the same in both languages. */
  slug: string
  name: Localised
  /** The engineering term, shown alongside the Turkish name. */
  latin: string
  lobes: Localised
  summary: Localised
  body: Localised
  points: Localised<string[]>
  /** Application keys this geometry is specified for. */
  applications: string[]
}

export const ROTOR_INTRO: Localised = {
  tr: 'Liquilob, loblu pompa teknolojisinde yüksek mühendislik, hassas işleme ve uzun ömürlü performansı bir araya getirir. Her rotor geometrisi farklı bir proses ihtiyacına göre optimize edilmiştir; doğru rotoru seçmek, doğru gövde boyunu seçmek kadar belirleyicidir.',
  en: 'Liquilob combines engineering, precision machining and long-life performance in rotary lobe pump technology. Each rotor geometry is optimised for a different process requirement, and choosing the right rotor matters as much as choosing the right frame size.',
}

export const ROTORS_CONTENT: Rotor[] = [
  {
    key: 'single',
    slug: 'single-wing',
    name: { tr: 'Tek Kanatlı Rotor', en: 'Single-Wing Rotor' },
    latin: 'Single-Wing',
    lobes: { tr: 'Tek kanat', en: 'One wing' },
    summary: {
      tr: 'Büyük partikül içeren, yapısı korunması gereken ürünler için.',
      en: 'For products carrying large particles whose structure has to survive the transfer.',
    },
    body: {
      tr: 'Büyük partikül içeren ve yapısı korunması gereken ürünlerin transferi için geliştirilmiştir. Akış sırasında ürün yapısını bozmadan, parçacıkları ezmeden ve kesmeden ilerleme sağlar. Geniş tek hücre hacmi, meyve parçaları veya sebze küpleri gibi katıların rotor ile gövde arasında sıkışmadan taşınmasını sağlar.',
      en: 'Developed for transferring products that carry large particles and whose structure has to be preserved. It moves the product without breaking it down, and without crushing or cutting the particles. A single large cell volume carries solids such as fruit pieces or diced vegetables through the casing without trapping them between rotor and housing.',
    },
    points: {
      tr: [
        'Partikül dostu tasarım',
        'Düşük kesme (low-shear) etkisi',
        'Gıda ve kozmetik uygulamalarında üstün ürün koruması',
      ],
      en: [
        'Particle-friendly geometry',
        'Low-shear transfer',
        'Strong product protection in food and cosmetics duties',
      ],
    },
    applications: ['food-beverage', 'pharma-cosmetics'],
  },
  {
    key: 'bi',
    slug: 'bi-wing',
    name: { tr: 'Çift Kanatlı Rotor', en: 'Bi-Wing Rotor' },
    latin: 'Bi-Wing / Butterfly',
    lobes: { tr: 'İki kanat', en: 'Two wings' },
    summary: {
      tr: 'Orta ve yüksek viskoziteli akışkanlarda denge ve verim.',
      en: 'Balance and efficiency on medium and high-viscosity media.',
    },
    body: {
      tr: 'Orta ve yüksek viskoziteli akışkanlar için denge ve verim odaklı bir çözümdür. Akış sürekliliği sayesinde titreşim ve pulsasyonu minimize eder. Kanat geometrisi torku mil üzerinde dengeli dağıtır; bu, uzun basma hatlarında yatak ömrünü doğrudan etkiler.',
      en: 'A balance-and-efficiency solution for medium and high-viscosity media. Continuity of flow keeps vibration and pulsation to a minimum. The wing geometry distributes torque evenly along the shaft, which bears directly on bearing life over long discharge lines.',
    },
    points: {
      tr: [
        'Dengeli tork dağılımı',
        'Yüksek viskozitede kararlı akış',
        'Krema, şurup, reçel ve benzeri ürünler için ideal',
      ],
      en: [
        'Even torque distribution',
        'Stable flow at high viscosity',
        'Suited to creams, syrups, jams and similar products',
      ],
    },
    applications: ['food-beverage', 'dairy', 'chocolate'],
  },
  {
    key: 'tri',
    slug: 'tri-lobe',
    name: { tr: 'Üç Loblu Rotor', en: 'Tri-Lobe Rotor' },
    latin: 'Tri-Lobe',
    lobes: { tr: 'Üç lob', en: 'Three lobes' },
    summary: {
      tr: 'Serinin en geniş kullanım alanına sahip rotoru.',
      en: 'The most widely applicable rotor in the series.',
    },
    body: {
      tr: 'Liquilob’un en çok tercih edilen ve en geniş kullanım alanına sahip rotor tipidir. Yüksek debi, stabil çalışma ve uzun servis ömrü sunar. Üç temas hattı, hacimsel verimi geniş bir viskozite aralığında kararlı tutar; bir prosesin gereksinimleri net değilse başlangıç noktası bu geometridir.',
      en: 'The most frequently specified Liquilob rotor and the one with the widest field of use. It delivers high flow, stable running and long service life. Three lines of contact hold volumetric efficiency steady across a wide viscosity band, which makes this the geometry to start from when a process is not yet fully characterised.',
    },
    points: {
      tr: [
        'Geniş viskozite aralığında çalışma',
        'Yüksek verim, düşük enerji kaybı',
        'Endüstriyel standartların üzerinde performans',
      ],
      en: [
        'Operation across a wide viscosity range',
        'High efficiency with low energy loss',
        'Performance above the industrial standard',
      ],
    },
    applications: ['dairy', 'chemical', 'wastewater', 'industrial-process'],
  },
  {
    key: 'multi',
    slug: 'multi-impeller',
    name: { tr: 'Çok Pervaneli Rotor', en: 'Multi-Impeller Rotor' },
    latin: 'Multi-Impeller',
    lobes: { tr: 'Çoklu pervane', en: 'Multiple impellers' },
    summary: {
      tr: 'Hassas dozajlama ve minimum pulsasyon gerektiren prosesler için.',
      en: 'For processes that need precise dosing and minimal pulsation.',
    },
    body: {
      tr: 'Hassas prosesler için geliştirilmiş, ileri seviye akış kontrolü sağlar. Pervane sayısının artmasıyla birlikte her devirde açılan hücre sayısı artar, hücre başına hacim küçülür ve akış hassasiyeti maksimum seviyeye çıkar. Dozaj pompası olarak kullanıma uygundur.',
      en: 'Developed for precision duties, this geometry provides advanced flow control. As the impeller count rises, more cells open per revolution and each carries less volume, which takes flow precision to its maximum. It is suitable for use as a dosing pump.',
    },
    points: {
      tr: [
        'Üstün dozajlama hassasiyeti',
        'Minimum pulsasyon',
        'Kimya ve ilaç endüstrisi için ideal çözüm',
      ],
      en: [
        'High dosing precision',
        'Minimal pulsation',
        'Well suited to chemical and pharmaceutical duties',
      ],
    },
    applications: ['chemical', 'pharma-cosmetics'],
  },
]

/** "Neden Liquilob?" from the rotor document. */
export const ROTOR_QUALITY: Localised<string[]> = {
  tr: [
    'CNC hassasiyetinde işlenmiş rotorlar',
    'Uzun ömürlü ve yüksek aşınma direnci',
    'Hijyenik tasarım ve kolay temizlenebilir yapı',
    'Sessiz, titreşimsiz ve güvenilir çalışma',
  ],
  en: [
    'Rotors machined to CNC tolerances',
    'Long life and high wear resistance',
    'Hygienic design and a geometry that cleans easily',
    'Quiet, vibration-free, dependable running',
  ],
}

export const ROTOR_CLOSING: Localised = {
  tr: 'Liquilob yalnızca bir pompa değil; proses güvenliği, ürün kalitesi ve sürdürülebilir performans sunar.',
  en: 'Liquilob is not only a pump. It carries process safety, product quality and sustainable performance.',
}

export function rotorBySlug(slug: string): Rotor | undefined {
  return ROTORS_CONTENT.find((r) => r.slug === slug)
}
