import type { Localised } from '@/lib/i18n'

/**
 * Page prose. Written from the company brief. No performance claim, no
 * certification and no reference customer appears here that Profimann has
 * not stated. Where a fact is not yet available, the copy says so.
 */

/* -------------------------------------------------------------------- HOME */

export const HERO = {
  title: {
    tr: ['Hassas akış.', 'Güvenilir performans.'],
    en: ['Precise flow.', 'Reliable performance.'],
  } as Localised<string[]>,
  lead: {
    tr: 'Endüstriyel uygulamalar için yüksek verimli, dayanıklı ve hassas loblu pompa çözümleri.',
    en: 'High-efficiency, durable rotary lobe pumps engineered for demanding industrial duties.',
  } as Localised,
  drawingCaption: {
    tr: 'LQL serisi, ön kapak çıkarılmış',
    en: 'LQL series, shown with the front cover removed',
  } as Localised,
}

export const PILLARS: { title: Localised; body: Localised }[] = [
  {
    title: { tr: 'Yüksek Verimlilik', en: 'High Efficiency' },
    body: {
      tr: 'Düşük iç kaçak ve kararlı hacimsel verim, debiyi doğrudan mil devrinin kontrolüne bırakır.',
      en: 'Low internal slip and stable volumetric efficiency put flow under the direct control of shaft speed.',
    },
  },
  {
    title: { tr: 'Hijyenik Tasarım', en: 'Hygienic Design' },
    body: {
      tr: 'Ölü hacmi sınırlayan gövde geometrisi ve CIP rejimine uygun salmastra düzenlemeleri.',
      en: 'Casing geometry that limits dead volume, with seal arrangements suited to a CIP regime.',
    },
  },
  {
    title: { tr: 'Uzun Ömür', en: 'Long Service Life' },
    body: {
      tr: 'Aşınma parçaları ön kapaktan değiştirilir. Pompa servis için hattan ve tahrikten ayrılmaz.',
      en: 'Wear parts are changed through the front cover. The pump stays coupled to the line and to its drive.',
    },
  },
  {
    title: { tr: 'Yerli Üretim', en: 'Local Manufacturing' },
    body: {
      tr: 'Amerikan ve Alman mühendislik pratiğinden gelen tasarım altyapısı, Konya’daki üretim hattında uygulanır.',
      en: 'Design practice carried over from American and German engineering work, executed on our production line in Konya.',
    },
  },
]

export const PRODUCTS_SECTION = {
  // Set uppercase in the source: CSS text-transform under lang="tr" maps a
  // lowercase i to a dotted capital, which would print the brand as LIQUILOB
  // with a dot. Turkish words below the brand still transform correctly.
  kicker: { tr: 'LIQUILOB ürün ailesi', en: 'LIQUILOB product family' } as Localised,
  title: { tr: 'LQL Serisi loblu rotorlu pompalar', en: 'LQL Series rotary lobe pumps' } as Localised,
  lead: {
    tr: 'Dört gövde boyu, ortak bir hidrolik tasarım ve akışkana göre seçilen rotor, salmastra ve malzeme konfigürasyonu.',
    en: 'Four frame sizes on one hydraulic design, with rotor, seal and material configuration selected for the medium.',
  } as Localised,
}

export const PRINCIPLE = {
  title: { tr: 'Loblu pompa nasıl çalışır', en: 'How a rotary lobe pump works' } as Localised,
  lead: {
    tr: 'Hacimsel bir prensip. Birbirine temas etmeyen iki rotor, akışkanı gövde ile arasındaki hücrelerde taşır.',
    en: 'A positive displacement principle. Two rotors that never touch carry the fluid in cells between themselves and the casing.',
  } as Localised,
  drawingCaption: {
    tr: 'Gövde kesiti, 3 kanatlı rotor çifti',
    en: 'Casing section, tri-lobe rotor pair',
  } as Localised,
  steps: [
    {
      title: { tr: 'Senkron tahrik', en: 'Synchronised drive' },
      body: {
        tr: 'Rotorlar dişli kutusu üzerinden senkronize edilir ve birbirine temas etmeden karşılıklı döner. Metal metale sürtünme yoktur.',
        en: 'The rotors are synchronised through a gearbox and counter-rotate without touching. There is no metal-to-metal contact.',
      },
    },
    {
      title: { tr: 'Emme', en: 'Suction' },
      body: {
        tr: 'Rotorlar ayrılırken emme ağzında hacim genişler ve oluşan basınç farkı akışkanı gövdeye alır.',
        en: 'As the rotors separate, the volume at the suction port expands and the resulting pressure difference draws the fluid into the casing.',
      },
    },
    {
      title: { tr: 'Taşıma', en: 'Transport' },
      body: {
        tr: 'Akışkan, rotor ile gövde arasındaki hücrelerde basma tarafına taşınır. Geniş kesitler kesme kuvvetini düşük tutar.',
        en: 'The fluid is carried to the discharge side in the cells between rotor and casing. Wide passages keep shear low.',
      },
    },
    {
      title: { tr: 'Basma', en: 'Discharge' },
      body: {
        tr: 'Rotorlar tekrar birleştiğinde hücre kapanır ve akışkan hatta verilir. Debi, mil devriyle doğru orantılıdır.',
        en: 'As the rotors mesh again the cell closes and the fluid is delivered to the line. Flow is proportional to shaft speed.',
      },
    },
  ],
}

export const APPLICATIONS_SECTION = {
  kicker: { tr: 'Uygulama alanları', en: 'Applications' } as Localised,
  title: { tr: 'Prosesinizden başlayın', en: 'Start from your process' } as Localised,
  lead: {
    tr: 'Hangi modele ihtiyacınız olduğunu henüz bilmiyorsanız, akışkanınızdan ilerleyin. Her uygulama sayfası proses koşullarını, tipik zorlukları ve uygun gövde boylarını açıklar.',
    en: 'If you do not yet know which model you need, start from your fluid. Each application page sets out the process conditions, the typical difficulties and the frame sizes that suit them.',
  } as Localised,
}

export const ENGINEERING_BAND = {
  kicker: { tr: 'Mühendislik', en: 'Engineering' } as Localised,
  title: {
    tr: ['Uluslararası mühendislik bilgisi.', 'Yerli üretim gücü.'],
    en: ['International engineering practice.', 'Local manufacturing capability.'],
  } as Localised<string[]>,
  body: {
    tr: 'Profimann’ın üretim yaklaşımı, Amerikan ve Alman mühendislik firmalarında edinilen teknolojik tasarım altyapısı ve saha deneyimi üzerine kuruludur. Bu birikim, yerli üretim kabiliyetleriyle birleştirilerek Liquilob ürünlerine aktarılır.',
    en: 'Profimann’s manufacturing approach is built on technological design infrastructure and field experience gained at American and German engineering companies. That grounding is combined with local manufacturing capability and carried into every Liquilob product.',
  } as Localised,
  figures: [
    {
      value: '4',
      unit: { tr: '', en: '' } as Localised,
      label: { tr: 'Şirketi birlikte kuran ortak', en: 'Partners who founded the company together' } as Localised,
    },
    {
      value: '2',
      unit: { tr: '', en: '' } as Localised,
      label: { tr: 'Tasarım pratiğinin dayandığı mühendislik ekolü: Amerikan ve Alman', en: 'Engineering schools the design practice draws on: American and German' } as Localised,
    },
    {
      value: 'DN 25',
      unit: { tr: '- 150', en: '- 150' } as Localised,
      label: { tr: 'LQL serisinin kapsadığı bağlantı aralığı', en: 'Connection range covered by the LQL series' } as Localised,
    },
  ],
}

export const ABOUT_STATEMENT = {
  statement: {
    tr: 'Kalite, tek bir ürün özelliği değil; tasarımdan satış sonrası hizmete kadar uzanan bir şirket yaklaşımıdır.',
    en: 'Quality is not a single product characteristic. It is a company-wide approach that runs from design to after-sales service.',
  } as Localised,
  body: {
    tr: 'Profimann, yüksek verimli ve uzun ömürlü akışkan transfer çözümleri geliştiren bir mühendislik firmasıdır. Liquilob markası altında ürettiği loblu pompalar, hijyen, hassas akış kontrolü ve zorlu koşullarda kararlı çalışma gerektiren uygulamalar için tasarlanır.',
    en: 'Profimann is an engineering company developing high-efficiency, long-life fluid-transfer solutions. The rotary lobe pumps it produces under the Liquilob brand are designed for applications that demand hygiene, precise flow control and stable operation in difficult conditions.',
  } as Localised,
}

export const RESOURCES_SECTION = {
  title: { tr: 'Teknik kaynaklar', en: 'Technical resources' } as Localised,
  lead: {
    tr: 'Katalog, veri sayfası, montaj ve bakım dokümanları hazırlık aşamasındadır. Bu süreçte istediğiniz dokümanı doğrudan mühendislik ekibimizden talep edebilirsiniz.',
    en: 'The catalogue, datasheets and installation and maintenance documents are in preparation. In the meantime you can request any document directly from our engineering team.',
  } as Localised,
}

export const HOME_CTA = {
  title: {
    tr: 'Uygulamanız için doğru pompayı birlikte belirleyelim.',
    en: 'Let us determine the right pump for your application together.',
  } as Localised,
  body: {
    tr: 'Akışkan özelliklerinizi ve çalışma koşullarınızı paylaşın; mühendislik ekibimiz uygun Liquilob konfigürasyonunu belirlemenize yardımcı olsun.',
    en: 'Share your fluid characteristics and operating conditions, and our engineering team will help you arrive at the right Liquilob configuration.',
  } as Localised,
}

/* ------------------------------------------------------------------- ABOUT */

export const ABOUT_PAGE = {
  title: { tr: 'Kurumsal', en: 'About Profimann' } as Localised,
  lead: {
    tr: 'Dört ortak tarafından kurulan Profimann, uluslararası mühendislik deneyimini yerli üretim kabiliyetiyle birleştiren bir makine firmasıdır.',
    en: 'Founded by four partners, Profimann is a machinery company that combines international engineering experience with local manufacturing capability.',
  } as Localised,
  story: {
    tr: [
      'Profimann, yüksek kaliteli ve uzun ömürlü endüstriyel akışkan transfer çözümlerine odaklanan bir mühendislik firmasıdır. Liquilob markası altında, başta loblu rotorlu pompalar olmak üzere farklı endüstriyel gereksinimlere yönelik güvenilir ürünler geliştirir.',
      'Üretim yaklaşımı, Amerikan ve Alman mühendislik firmalarında edinilmiş teknolojik tasarım altyapısı ve saha deneyimi üzerine kuruludur. Şirket bu uluslararası birikimi yerli üretim kabiliyetleri ve titiz mühendislikle birleştirir.',
      'Liquilob pompaları; hijyen, hassas akışkan yönetimi ve zorlu koşullarda kararlı çalışma gerektiren uygulamalar için geliştirilir. Tüm ürünler, kalite sürekliliği ve uzun servis ömrü hedefleyen süreçlerle üretilir.',
    ],
    en: [
      'Profimann is an engineering company focused on high-quality, long-life industrial fluid-transfer solutions. Under the Liquilob brand it develops reliable products for a range of industrial requirements, principally rotary lobe pumps.',
      'Its manufacturing approach is built upon technological design infrastructure and field experience acquired at American and German engineering companies. The company combines that international grounding with local manufacturing capability and meticulous engineering.',
      'Liquilob pumps are developed for applications where hygiene, precise fluid handling and stable operation under demanding conditions are required. All products are manufactured through processes aimed at consistent quality and long service life.',
    ],
  } as Localised<string[]>,
  quality: {
    title: { tr: 'Kalite yaklaşımı', en: 'Approach to quality' } as Localised,
    body: {
      tr: 'Profimann kaliteyi yalnızca bir ürün özelliği olarak değil, şirketin tamamını kapsayan bir felsefe olarak ele alır. Bu yaklaşım tasarım, mühendislik, üretim, satış, müşteri desteği ve satış sonrası hizmeti aynı ölçütlerle değerlendirir.',
      en: 'Profimann treats quality not merely as a product characteristic but as a philosophy covering the whole company. The same criteria apply to design, engineering, production, sales, customer support and after-sales service.',
    } as Localised,
    points: {
      tr: [
        'Tasarım ve mühendislik kararlarının üretim kabiliyetiyle birlikte alınması',
        'Üretim süreçlerinde ölçülebilir ve tekrarlanabilir kalite',
        'Satış öncesinde doğru pompa seçimi için proses verisine dayalı değerlendirme',
        'Satış sonrasında yedek parça ve teknik destek sürekliliği',
      ],
      en: [
        'Design and engineering decisions taken together with manufacturing capability',
        'Measurable and repeatable quality across production processes',
        'Pre-sales assessment based on real process data, so the pump selection is right',
        'Continuity of spare parts and technical support after the sale',
      ],
    } as Localised<string[]>,
  },
  vision: {
    title: { tr: 'Vizyon', en: 'Vision' } as Localised,
    body: {
      tr: 'Endüstriyel pompalar ve akışkan transfer sistemlerinde küresel ölçekte tercih edilen bir marka olmak.',
      en: 'To become a globally preferred brand in industrial pumps and fluid-transfer systems.',
    } as Localised,
    points: {
      tr: [
        'Yenilikçi ürünler ve güvenilir mühendislik',
        'Uluslararası mühendislik standartlarında tasarım',
        'Uzun servis ömrü ve sürdürülebilir üretim',
        'Sürekli geliştirilen Liquilob çözümleri',
      ],
      en: [
        'Innovative products and reliable engineering',
        'Design to international engineering standards',
        'Long service life and sustainable manufacturing',
        'Continuously improved Liquilob solutions',
      ],
    } as Localised<string[]>,
  },
  mission: {
    title: { tr: 'Misyon', en: 'Mission' } as Localised,
    body: {
      tr: 'Amerikan ve Alman mühendislik bilgisini yerli üretim kabiliyetleriyle birleştirerek verimli, dayanıklı ve güvenilir ürünler geliştirmek.',
      en: 'To combine American and German engineering know-how with local production capability, and develop efficient, durable and reliable products.',
    } as Localised,
    points: {
      tr: [
        'Müşteri ihtiyacını doğru anlamak ve kısa vadeli satış yerine uzun vadeli çözüm sunmak',
        'Tasarım, üretim ve kalite süreçlerinde sürekliliği korumak',
        'Güçlü satış öncesi ve satış sonrası destek sağlamak',
        'Teknoloji, deneyim ve mühendislik etrafında bir üretim kültürü kurmak',
      ],
      en: [
        'Understand customer needs accurately and offer long-term solutions rather than short-term sales',
        'Maintain continuity across design, manufacturing and quality processes',
        'Provide strong pre-sales and after-sales support',
        'Build a manufacturing culture centred on technology, experience and engineering',
      ],
    } as Localised<string[]>,
  },
}

/* ------------------------------------------------------------- ENGINEERING */

export const ENGINEERING_PAGE = {
  title: { tr: 'Mühendislik ve Üretim', en: 'Engineering & Manufacturing' } as Localised,
  lead: {
    tr: 'Bir pompanın servis ömrü, montaj hattında değil tasarım masasında belirlenir. Profimann’da tasarım kararları üretim kabiliyetiyle birlikte alınır.',
    en: 'The service life of a pump is decided at the design table, not on the assembly line. At Profimann, design decisions are taken together with manufacturing capability.',
  } as Localised,
  philosophy: {
    tr: [
      'Loblu pompa, dar toleranslara bağlı bir makinedir. Rotor ile gövde arasındaki boşluk hacimsel verimi, rotor profilinin doğruluğu ise kesme kuvvetini ve pulsasyonu belirler. Bu nedenle tasarım ve talaşlı imalat süreçleri birbirinden ayrı düşünülmez.',
      'Şirketin mühendislik temeli, Amerikan ve Alman mühendislik firmalarında edinilen tasarım pratiğine dayanır. Bu pratik, tolerans zincirlerinin nasıl kurulduğu, aşınma parçalarının nasıl ayrıştırıldığı ve servis erişiminin tasarımın başında nasıl planlandığı gibi konularda somut karşılık bulur.',
    ],
    en: [
      'A lobe pump is a machine governed by tight tolerances. The clearance between rotor and casing determines volumetric efficiency, and the accuracy of the rotor profile determines shear and pulsation. Design and machining are therefore never considered separately.',
      'The engineering foundation of the company rests on design practice acquired at American and German engineering companies. That practice shows up concretely in how tolerance chains are built, how wear parts are separated out, and how service access is planned at the start of the design rather than at the end.',
    ],
  } as Localised<string[]>,
  capabilities: {
    title: { tr: 'Tasarımdan servise', en: 'From design to service' } as Localised,
    items: [
      {
        term: { tr: 'Tasarım ve hesaplama', en: 'Design and calculation' },
        def: {
          tr: 'Hacimsel hesaplama, tolerans zinciri, mil ve yatak boyutlandırması, malzeme uyum değerlendirmesi.',
          en: 'Volumetric calculation, tolerance chain, shaft and bearing sizing, materials compatibility assessment.',
        },
      },
      {
        term: { tr: 'Talaşlı imalat', en: 'Machining' },
        def: {
          tr: 'Gövde, kapak, rotor ve mil grubunun dar toleranslarla işlenmesi; aşınma yüzeylerinin ayrı parçalar olarak üretilmesi.',
          en: 'Casing, cover, rotor and shaft set machined to tight tolerances, with wear surfaces produced as separate parts.',
        },
      },
      {
        term: { tr: 'Montaj ve test', en: 'Assembly and test' },
        def: {
          tr: 'Rotor boşluk ayarı, senkron dişli kutusu montajı, sızdırmazlık ve çalışma testleri.',
          en: 'Rotor clearance setting, timing gearbox assembly, leak testing and running tests.',
        },
      },
      {
        term: { tr: 'Saha desteği', en: 'Field support' },
        def: {
          tr: 'Devreye alma, çalışma noktası doğrulaması, bakım planı ve yedek parça sürekliliği.',
          en: 'Commissioning, duty point verification, maintenance planning and spare-part continuity.',
        },
      },
    ],
  },
  selection: {
    title: { tr: 'Pompa seçimi nasıl yapılır', en: 'How a pump is selected' } as Localised,
    lead: {
      tr: 'Doğru seçim, katalogdan model okumakla değil proses verisiyle başlar. Aşağıdaki dört bilgi, uygun gövde boyunu ve konfigürasyonu belirlemek için yeterlidir.',
      en: 'A correct selection starts from process data, not from reading a model off a catalogue page. The four items below are enough to determine the frame size and the configuration.',
    } as Localised,
    steps: [
      {
        title: { tr: 'Akışkan', en: 'The fluid' },
        body: {
          tr: 'Kimyasal içerik, katı madde oranı, parçacık boyutu ve kesme kuvvetine duyarlılık. Malzeme ve rotor seçimini bu belirler.',
          en: 'Chemical content, solids ratio, particle size and shear sensitivity. This decides the material and the rotor choice.',
        },
      },
      {
        title: { tr: 'Viskozite ve sıcaklık', en: 'Viscosity and temperature' },
        body: {
          tr: 'İşletme sıcaklığındaki viskozite ile soğuk başlangıç değeri ayrı ayrı gerekir. Tahrik torku bu iki değere göre hesaplanır.',
          en: 'Viscosity at running temperature and at cold start are both needed. Drive torque is calculated from the two.',
        },
      },
      {
        title: { tr: 'Debi ve basınç', en: 'Flow and pressure' },
        body: {
          tr: 'İstenen debi ve hattın diferansiyel basıncı, gövde boyu ile çalışma devrini birlikte belirler.',
          en: 'The required flow and the differential pressure of the line together set the frame size and the operating speed.',
        },
      },
      {
        title: { tr: 'Çalışma rejimi', en: 'Duty regime' },
        body: {
          tr: 'Sürekli mi kesintili mi çalışacağı, CIP veya SIP gerekliliği ve emme koşulları salmastra ile bağlantı tipini belirler.',
          en: 'Continuous or intermittent running, any CIP or SIP requirement and the suction conditions determine the seal and the connection type.',
        },
      },
    ],
  },
}

/* ---------------------------------------------------------------- RESOURCES */

export type DocKind = 'catalogue' | 'datasheet' | 'manual' | 'drawing' | 'material' | 'curve'

export const DOCUMENTS: { id: string; kind: DocKind; title: Localised; meta: Localised }[] = [
  {
    id: 'catalogue',
    kind: 'catalogue',
    title: { tr: 'Liquilob LQL Serisi ürün kataloğu', en: 'Liquilob LQL Series product catalogue' },
    meta: { tr: 'PDF', en: 'PDF' },
  },
  {
    id: 'datasheets',
    kind: 'datasheet',
    title: { tr: 'Model bazlı teknik veri sayfaları', en: 'Model technical datasheets' },
    meta: { tr: 'PDF, model başına', en: 'PDF, per model' },
  },
  {
    id: 'curves',
    kind: 'curve',
    title: { tr: 'Performans eğrileri', en: 'Performance curves' },
    meta: { tr: 'Çalışma noktasına göre hazırlanır', en: 'Prepared per duty point' },
  },
  {
    id: 'drawings',
    kind: 'drawing',
    title: { tr: 'Ölçü resimleri', en: 'Dimensional drawings' },
    meta: { tr: 'PDF / DWG', en: 'PDF / DWG' },
  },
  {
    id: 'install-manual',
    kind: 'manual',
    title: { tr: 'Montaj ve devreye alma kılavuzu', en: 'Installation and commissioning manual' },
    meta: { tr: 'PDF', en: 'PDF' },
  },
  {
    id: 'maintenance-manual',
    kind: 'manual',
    title: { tr: 'Bakım ve yedek parça dokümanı', en: 'Maintenance and spare parts document' },
    meta: { tr: 'PDF', en: 'PDF' },
  },
  {
    id: 'material-table',
    kind: 'material',
    title: { tr: 'Malzeme ve sızdırmazlık seçim tablosu', en: 'Material and seal selection table' },
    meta: { tr: 'PDF', en: 'PDF' },
  },
]

export const SUPPORT_PAGE = {
  title: { tr: 'Teknik Kaynaklar ve Destek', en: 'Technical Resources & Support' } as Localised,
  lead: {
    tr: 'Doküman kütüphanesi hazırlık aşamasındadır. Bu süreçte ihtiyaç duyduğunuz teknik dokümanı doğrudan mühendislik ekibimizden talep edebilirsiniz.',
    en: 'The document library is in preparation. In the meantime you can request any technical document you need directly from our engineering team.',
  } as Localised,
  supportTitle: { tr: 'Destek kapsamı', en: 'What support covers' } as Localised,
  support: [
    {
      term: { tr: 'Satış öncesi', en: 'Pre-sales' },
      def: {
        tr: 'Proses verinize göre gövde boyu, rotor tipi, salmastra ve malzeme konfigürasyonunun belirlenmesi.',
        en: 'Determining the frame size, rotor type, seal and material configuration from your process data.',
      },
    },
    {
      term: { tr: 'Devreye alma', en: 'Commissioning' },
      def: {
        tr: 'Montaj kontrolü, dönüş yönü ve çalışma noktası doğrulaması, ilk çalıştırma desteği.',
        en: 'Installation check, direction of rotation and duty point verification, support at first start-up.',
      },
    },
    {
      term: { tr: 'Bakım', en: 'Maintenance' },
      def: {
        tr: 'Aşınma parçası değişim aralığının belirlenmesi, bakım planı ve yerinde servis desteği.',
        en: 'Setting the replacement interval for wear parts, maintenance planning and on-site service support.',
      },
    },
    {
      term: { tr: 'Yedek parça', en: 'Spare parts' },
      def: {
        tr: 'Rotor, salmastra, aşınma plakası ve elastomer setlerinin sürekliliği.',
        en: 'Continuity of rotors, seals, wear plates and elastomer sets.',
      },
    },
  ],
}

/* ------------------------------------------------------------------ CONTACT */

export const CONTACT_PAGE = {
  title: { tr: 'İletişim', en: 'Contact' } as Localised,
  lead: {
    tr: 'Proses verilerinizi paylaşın, mühendislik ekibimiz uygun Liquilob konfigürasyonunu birlikte belirlesin. Acil durumlarda doğrudan telefonla ulaşabilirsiniz.',
    en: 'Share your process data and our engineering team will work through the right Liquilob configuration with you. For anything urgent, reach us directly by phone.',
  } as Localised,
  formTitle: { tr: 'Teknik talep formu', en: 'Technical inquiry form' } as Localised,
  formLead: {
    tr: 'Ne kadar çok proses verisi paylaşırsanız dönüş o kadar isabetli olur. Bilmediğiniz alanları boş bırakabilirsiniz.',
    en: 'The more process data you share, the more precise our response can be. Leave any field you do not know blank.',
  } as Localised,
  officeTitle: { tr: 'Merkez ve üretim', en: 'Head office and production' } as Localised,
}

/* -------------------------------------------------------------- PHOTOGRAPHY
   Slots carrying a `src` are Profimann's own images. Slots without one still
   render as a measured, labelled frame rather than a stock stand-in; see
   PHOTOGRAPHY.md for what is still needed.                                  */

export type PhotoSlot = {
  id: string
  ratio: string
  label: Localised
  /** Public path once the file exists, e.g. '/photos/cnc-machining.jpg'. */
  src?: string
}

export const PHOTOS: Record<string, PhotoSlot> = {
  installation: {
    id: 'installation',
    ratio: '1529 / 1013',
    src: '/photos/installation-food-line.jpg',
    label: {
      tr: 'Gıda üretim hattına kurulu Liquilob loblu pompa ve redüktörlü motor grubu',
      en: 'A Liquilob lobe pump and geared motor installed on a food production line',
    },
  },
  rotorFamily: {
    id: 'rotorFamily',
    ratio: '1331 / 538',
    src: '/photos/rotor-family.jpg',
    label: {
      tr: 'Liquilob rotor ailesi: çok pervaneli, üç loblu, çift kanatlı ve tek kanatlı rotor çiftleri',
      en: 'The Liquilob rotor family: multi-impeller, tri-lobe, bi-wing and single-wing rotor pairs',
    },
  },
  manufacturing: {
    id: 'manufacturing',
    ratio: '4 / 3',
    label: {
      tr: 'Üretim: gövde işleme veya rotor tesviye operasyonu',
      en: 'Production: casing machining or rotor finishing operation',
    },
  },
  assembly: {
    id: 'assembly',
    ratio: '3 / 2',
    label: {
      tr: 'Montaj hattında Liquilob pompa grubu',
      en: 'Liquilob pump set on the assembly line',
    },
  },
}

/**
 * The isolated product render, used wherever the machine itself is the
 * subject: the hero, the catalogue cards and the product detail page. Its
 * background has been keyed out, so it sits on any surface.
 */
export const PRODUCT_IMAGE = {
  src: '/photos/pump-render.png',
  width: 612,
  height: 516,
  alt: {
    tr: 'Liquilob loblu rotorlu pompa, ön kapak çıkarılmış halde üç loblu rotor çifti görünür',
    en: 'Liquilob rotary lobe pump with the front cover removed, showing the tri-lobe rotor pair',
  } as Localised,
}
