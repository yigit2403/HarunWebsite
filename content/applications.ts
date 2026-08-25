import type { Localised } from '@/lib/i18n'

/**
 * Application pages. Each one is written for an engineer who knows their
 * process but has not yet chosen a pump frame. Structure per page:
 * process -> fluid characteristics -> what makes it hard -> what we do
 * about it -> materials and hygiene -> which frames apply.
 */

export type Application = {
  key: string
  slug: Localised
  icon: IconKey
  name: Localised
  /** One line on the homepage tile. */
  short: Localised
  /** Typical media, shown at the foot of the tile. */
  fluids: Localised
  lead: Localised
  process: Localised<string[]>
  characteristics: Localised<string[]>
  challenges: Localised<string[]>
  approach: Localised<string[]>
  materials: Localised
  /** Product slugs, most relevant first. */
  models: { slug: string; note: Localised }[]
}

export type IconKey =
  | 'food'
  | 'dairy'
  | 'chemical'
  | 'pharma'
  | 'wastewater'
  | 'industrial'

export const APPLICATIONS: Application[] = [
  {
    key: 'food-beverage',
    slug: { tr: 'gida-icecek', en: 'food-beverage' },
    icon: 'food',
    name: { tr: 'Gıda ve İçecek', en: 'Food & Beverage' },
    short: {
      tr: 'Parçacıklı ve viskoz ürünlerin yapısını bozmadan transferi.',
      en: 'Transfer of particulate and viscous products without breaking their structure.',
    },
    fluids: {
      tr: 'Soslar, meyve püreleri, şuruplar, konsantreler, dolgu malzemeleri',
      en: 'Sauces, fruit purées, syrups, concentrates, fillings',
    },
    lead: {
      tr: 'Gıda hatlarında pompa seçimi çoğu zaman debiden çok ürünün yapısını koruma meselesidir. Parça bütünlüğü, hava sürüklenmesi ve temizlenebilirlik birlikte değerlendirilir.',
      en: 'On food lines the pump choice is usually less about flow rate and more about protecting the product. Particle integrity, air entrainment and cleanability are assessed together.',
    },
    process: {
      tr: [
        'Tipik bir hatta pompa üç noktada bulunur: karıştırma tankından ara depoya besleme, pastörizatör veya ısı değiştirici öncesi basınçlandırma ve dolum makinesine dozajlı besleme.',
        'Her üç nokta da farklı bir gereksinim tanımlar. Tank boşaltmada kuru emiş, ısı değiştirici öncesinde kararlı basınç, dolumda ise devirle orantılı ve tekrarlanabilir bir debi beklenir.',
      ],
      en: [
        'A typical line uses the pump at three points: feeding from the mixing tank to an intermediate vessel, building pressure ahead of a pasteuriser or heat exchanger, and metering into the filling machine.',
        'Each point defines a different requirement. Emptying a tank calls for dry suction, the heat exchanger needs stable pressure, and filling needs a repeatable flow that tracks shaft speed.',
      ],
    },
    characteristics: {
      tr: [
        'Viskozite ürün sıcaklığıyla belirgin şekilde değişir; soğuk başlangıç değeri işletme değerinin katı olabilir.',
        'Çoğu üründe hassas katı parçacıklar bulunur: meyve parçaları, baharat taneleri, sebze küpleri.',
        'Ürünler kesme kuvvetine duyarlıdır; yüksek devirde emülsiyon ayrışması veya kıvam kaybı görülür.',
        'Hat, üretim sonunda CIP çözeltisiyle yıkanır ve pompa bu rejimde de çalışır.',
      ],
      en: [
        'Viscosity changes considerably with product temperature. The cold start value can be a multiple of the running value.',
        'Most products carry delicate solids: fruit pieces, spice grains, diced vegetables.',
        'Products are shear sensitive. At high shaft speeds emulsions separate and body is lost.',
        'The line is washed with CIP solution at the end of a run, and the pump operates in that regime too.',
      ],
    },
    challenges: {
      tr: [
        'Santrifüj pompalar yüksek devirde parçacıkları öğütür ve viskozite arttıkça verim kaybeder.',
        'Ölü hacimlerde kalan ürün, sonraki partide tat ve renk taşınmasına yol açar.',
        'Dolum hattında pulsasyon, hacim toleransını doğrudan bozar.',
      ],
      en: [
        'Centrifugal pumps grind particles at high speed and lose efficiency as viscosity rises.',
        'Product left in dead volumes carries flavour and colour into the next batch.',
        'Pulsation on a filling line degrades fill volume tolerance directly.',
      ],
    },
    approach: {
      tr: [
        'Liquilob loblu pompalar düşük devirde çalışır ve geniş akış kesitleri sayesinde parçacıkları taşır, ezmez. Debi mil devriyle doğru orantılı olduğundan dolum hattında invertör üzerinden doğrudan hacim kontrolü yapılabilir.',
        'Pulsasyonun kritik olduğu dolum uygulamalarında helisel rotor kullanılır. Parçacık boyutunun büyük olduğu soslarda ise 2 kanatlı rotor tercih edilir.',
        'Gövde geometrisi ölü hacmi sınırlar ve rotorlar ön kapak sökülerek çıkarılır; parti değişimlerinde hat açma süresi kısalır.',
      ],
      en: [
        'Liquilob lobe pumps run at low speed and their wide flow passages carry particles rather than crush them. Because flow tracks shaft speed, a filling line can control volume directly from the frequency drive.',
        'Where pulsation is critical, a helical rotor is specified. Where particle size is large, as in chunky sauces, a bi-wing rotor is the better choice.',
        'The casing geometry limits dead volume and the rotors come out through the front cover, which shortens changeover between batches.',
      ],
    },
    materials: {
      tr: 'Akışkanla temas eden yüzeyler 1.4404 (AISI 316L) paslanmaz çelikten üretilir. Elastomer sınıfı ürüne ve CIP kimyasalına göre EPDM veya FKM olarak seçilir. Bağlantılar DIN 11851, SMS veya Clamp standardında yapılır.',
      en: 'Wetted surfaces are made from 1.4404 (AISI 316L) stainless steel. The elastomer grade is selected as EPDM or FKM according to the product and the CIP chemistry. Connections are made to DIN 11851, SMS or Clamp standards.',
    },
    models: [
      { slug: 'lql-50', note: { tr: 'Dolum ve proses besleme', en: 'Filling and process feed' } },
      { slug: 'lql-25', note: { tr: 'Aroma ve katkı dozajı', en: 'Flavour and additive dosing' } },
      { slug: 'lql-100', note: { tr: 'Yüksek viskoziteli hatlar', en: 'High-viscosity lines' } },
    ],
  },
  {
    key: 'dairy',
    slug: { tr: 'sut-urunleri', en: 'dairy' },
    icon: 'dairy',
    name: { tr: 'Süt ve Süt Ürünleri', en: 'Dairy' },
    short: {
      tr: 'CIP ve SIP rejimlerine uygun hijyenik transfer ve dozajlama.',
      en: 'Hygienic transfer and dosing built around CIP and SIP regimes.',
    },
    fluids: {
      tr: 'Yoğurt, krema, peynir altı suyu, taze peynir, süt',
      en: 'Yoghurt, cream, whey, fresh cheese, milk',
    },
    lead: {
      tr: 'Süt ürünlerinde pompa, ürün kalitesinin bir parçasıdır. Kesme kuvveti kıvamı, ölü hacim ise mikrobiyolojik güvenliği doğrudan etkiler.',
      en: 'In dairy the pump is part of product quality. Shear determines body and texture, while dead volume determines microbiological safety.',
    },
    process: {
      tr: [
        'Fermantasyon tankından dolum hattına giden yolda ürün yapısı en kırılgan halindedir. Set yoğurt ve taze peynir gibi ürünlerde jel yapısı bir kez bozulduğunda geri kazanılmaz.',
        'Aynı pompa üretim sonunda CIP devresinin parçası olur ve alkali, asit ve durulama fazlarında farklı sıcaklık ve viskozitelerle çalışır.',
      ],
      en: [
        'On the path from the fermentation tank to the filling line the product structure is at its most fragile. In set yoghurt and fresh cheese a gel structure, once broken, does not recover.',
        'At the end of a run the same pump becomes part of the CIP circuit and operates through alkaline, acid and rinse phases at different temperatures and viscosities.',
      ],
    },
    characteristics: {
      tr: [
        'Tiksotropik davranış: kesme altında viskozite düşer, dinlenmede kısmen geri döner.',
        'Yüksek protein içeriği nedeniyle sıcak yüzeylerde birikme eğilimi vardır.',
        'CIP fazlarında sıcaklık 80 °C üzerine çıkar; SIP uygulanan hatlarda buhar teması söz konusudur.',
        'Peynir altı suyu gibi düşük viskoziteli akışkanlarda kaçak debisi verimi belirler.',
      ],
      en: [
        'Thixotropic behaviour: viscosity drops under shear and only partly recovers at rest.',
        'High protein content tends to deposit on hot surfaces.',
        'CIP phases exceed 80 °C, and lines with SIP see direct steam contact.',
        'On low-viscosity media such as whey, slip flow determines efficiency.',
      ],
    },
    challenges: {
      tr: [
        'Yüksek devirli pompalar yoğurt jelini kırar ve ürün serum ayrışması gösterir.',
        'Salmastra bölgesinde kalan ürün, temizlenemeyen bir mikrobiyolojik risk oluşturur.',
        'Sık sıcaklık değişimi salmastra ve elastomer ömrünü kısaltır.',
      ],
      en: [
        'High-speed pumps break the yoghurt gel and the product shows serum separation.',
        'Product retained around the shaft seal creates a microbiological risk that cleaning does not reach.',
        'Frequent temperature cycling shortens seal and elastomer life.',
      ],
    },
    approach: {
      tr: [
        'Hijyenik konfigürasyonda salmastra bölgesi CIP çözeltisinin ulaşabileceği şekilde tasarlanır. Yıkamalı çift mekanik salmastra seçildiğinde bariyer sıvısı hem sızdırmazlığı hem de temizlenebilirliği güvence altına alır.',
        'Yoğurt ve krema transferinde 3 kanatlı veya helisel rotor düşük kesme kuvveti sağlar. Devir 200 min-1 civarında tutulduğunda jel yapısı korunur.',
        'SIP uygulanan hatlarda elastomer sınıfı EPDM olarak seçilir ve pompa gövdesi buhar sıcaklığına göre boyutlandırılır.',
      ],
      en: [
        'In the hygienic configuration the seal area is arranged so that CIP solution reaches it. With a flushed double mechanical seal the barrier fluid secures both sealing and cleanability.',
        'For yoghurt and cream a tri-lobe or helical rotor keeps shear low. Held near 200 min-1, the gel structure survives the transfer.',
        'On lines with SIP the elastomer grade is specified as EPDM and the pump body is dimensioned for steam temperature.',
      ],
    },
    materials: {
      tr: 'Islak yüzeyler 1.4404 (AISI 316L), yüzey pürüzlülüğü hijyenik gereksinime göre işlenir. Elastomerler EPDM olarak seçilir. Bağlantılar DIN 11851 veya Clamp standardındadır.',
      en: 'Wetted surfaces are 1.4404 (AISI 316L), finished to the surface roughness the hygienic requirement calls for. Elastomers are specified as EPDM. Connections are made to DIN 11851 or Clamp standards.',
    },
    models: [
      { slug: 'lql-50', note: { tr: 'Fermantasyon ve dolum hattı', en: 'Fermentation and filling line' } },
      { slug: 'lql-100', note: { tr: 'Tank boşaltma ve transfer', en: 'Tank emptying and transfer' } },
      { slug: 'lql-25', note: { tr: 'Kültür ve katkı dozajı', en: 'Culture and additive dosing' } },
    ],
  },
  {
    key: 'chemical',
    slug: { tr: 'kimya', en: 'chemical' },
    icon: 'chemical',
    name: { tr: 'Kimya', en: 'Chemical' },
    short: {
      tr: 'Agresif ve yüksek viskoziteli akışkanlarda malzeme uyumlu transfer.',
      en: 'Material-compatible transfer of aggressive and high-viscosity media.',
    },
    fluids: {
      tr: 'Reçineler, polimerler, çözücüler, asit ve baz çözeltileri, yapıştırıcılar',
      en: 'Resins, polymers, solvents, acid and alkaline solutions, adhesives',
    },
    lead: {
      tr: 'Kimyasal transferde pompa seçimi bir malzeme uyum çalışmasıdır. Akışkanın kimyası, sıcaklığı ve viskozitesi birlikte değerlendirilmeden gövde ve elastomer seçilmez.',
      en: 'In chemical duty, pump selection is a materials compatibility exercise. Casing and elastomer are not chosen before the chemistry, the temperature and the viscosity are assessed together.',
    },
    process: {
      tr: [
        'Reaktör boşaltma, ara ürün transferi, dozajlama ve dolum hatlarında farklı basınç ve debi rejimleri görülür. Aynı tesiste birbirinden çok farklı akışkanlar aynı pompa ailesiyle karşılanabilir.',
        'Reçine ve yapıştırıcı hatlarında akışkan bekleme süresince sertleşme eğilimi gösterir; durdurma ve yeniden başlatma rejimi seçim kriterlerine dahil edilir.',
      ],
      en: [
        'Reactor emptying, intermediate transfer, dosing and filling each present different pressure and flow regimes. Within one plant, media that differ widely can still be covered by one pump family.',
        'On resin and adhesive lines the medium tends to cure while standing, so the stop and restart regime becomes part of the selection criteria.',
      ],
    },
    characteristics: {
      tr: [
        'Viskozite aralığı çok geniştir; aynı hatta 10 mPa·s ile 150.000 mPa·s arasında akışkanlar dolaşabilir.',
        'Çözücüler elastomer şişmesine, asitler ise paslanmaz çelikte nokta korozyonuna yol açabilir.',
        'Bazı akışkanlar sıcaklık düştüğünde kristalize olur veya faz ayrışması gösterir.',
        'Kaçak, çevre ve iş güvenliği açısından kabul edilebilir sınırın çok altında tutulmalıdır.',
      ],
      en: [
        'The viscosity band is wide. The same line can carry media between 10 mPa·s and 150,000 mPa·s.',
        'Solvents can swell elastomers, and acids can cause pitting corrosion in stainless steel.',
        'Some media crystallise or separate into phases as the temperature falls.',
        'Leakage has to stay far below the acceptable limit for environmental and occupational safety.',
      ],
    },
    challenges: {
      tr: [
        'Yanlış elastomer seçimi haftalar içinde salmastra arızasına ve üretim durmasına yol açar.',
        'Yüksek viskozitede santrifüj pompa verimi hızla düşer ve emme tarafında kavitasyon başlar.',
        'Sertleşen akışkanlar durdurma sonrası yeniden başlatmada tork artışı yaratır.',
      ],
      en: [
        'The wrong elastomer choice leads to seal failure and lost production within weeks.',
        'At high viscosity centrifugal efficiency falls away quickly and cavitation starts on the suction side.',
        'Curing media raise the breakaway torque after a stop.',
      ],
    },
    approach: {
      tr: [
        'Seçim akışkanın malzeme uyum tablosuyla başlar. Gövde 1.4404 veya uygulamaya göre daha yüksek alaşımlı malzeme, elastomer ise FKM veya FFKM olarak belirlenir.',
        'Kaçağın kritik olduğu akışkanlarda yıkamalı çift mekanik salmastra kullanılır; bariyer sıvısı basıncı proses basıncının üzerinde tutularak akışkanın atmosfere ulaşması engellenir.',
        'Hacimsel prensip, viskozite arttıkça verim kaybı yaşatmaz. Aksine yüksek viskozite iç kaçağı azalttığı için hacimsel verim yükselir.',
      ],
      en: [
        'Selection starts from the compatibility table for the medium. The casing is specified as 1.4404 or a higher alloy where the duty requires it, and the elastomer as FKM or FFKM.',
        'Where leakage is critical, a flushed double mechanical seal is used and the barrier fluid is held above process pressure so the medium cannot reach atmosphere.',
        'The positive displacement principle does not lose efficiency as viscosity rises. Higher viscosity reduces internal slip, so volumetric efficiency improves.',
      ],
    },
    materials: {
      tr: 'Gövde ve rotorlar 1.4404 (AISI 316L) veya uygulamaya özel yüksek alaşımlı malzemeden üretilir. Elastomer sınıfı FKM, FFKM veya EPDM olarak akışkana göre seçilir. Bağlantılar DIN EN 1092-1 flanş standardındadır.',
      en: 'Casing and rotors are produced in 1.4404 (AISI 316L) or, where the duty calls for it, a higher alloy. The elastomer grade is specified as FKM, FFKM or EPDM to suit the medium. Connections are made to DIN EN 1092-1 flange standard.',
    },
    models: [
      { slug: 'lql-100', note: { tr: 'Reçine ve polimer transferi', en: 'Resin and polymer transfer' } },
      { slug: 'lql-50', note: { tr: 'Ara ürün ve dozaj hatları', en: 'Intermediate and dosing lines' } },
      { slug: 'lql-200', note: { tr: 'Büyük hacimli transfer', en: 'High-volume transfer' } },
    ],
  },
  {
    key: 'pharma-cosmetics',
    slug: { tr: 'ilac-kozmetik', en: 'pharmaceutical-cosmetics' },
    icon: 'pharma',
    name: { tr: 'İlaç ve Kozmetik', en: 'Pharmaceutical & Cosmetics' },
    short: {
      tr: 'Emülsiyon yapısını koruyan, doğrulanabilir temizlik rejimine uygun transfer.',
      en: 'Transfer that protects emulsion structure and suits a verifiable cleaning regime.',
    },
    fluids: {
      tr: 'Kremler, jeller, emülsiyonlar, şuruplar, tentürler, macunlar',
      en: 'Creams, gels, emulsions, syrups, tinctures, pastes',
    },
    lead: {
      tr: 'İlaç ve kozmetik hatlarında temizlik doğrulanabilir olmak zorundadır. Pompa geometrisi, temizlik prosedürünün ulaşamayacağı bir hacim bırakmayacak şekilde seçilir.',
      en: 'On pharmaceutical and cosmetics lines cleaning has to be verifiable. The pump geometry is chosen so that no volume is left where the cleaning procedure cannot reach.',
    },
    process: {
      tr: [
        'Homojenizatör çıkışından dolum hattına giden yolda emülsiyon kararlılığı korunmalıdır. Aşırı kesme, damlacık boyut dağılımını değiştirir ve raf ömrünü kısaltır.',
        'Partiler arasında ürün değişimi sık yapılır; hat açma ve temizlik süresi doğrudan üretim kapasitesini belirler.',
      ],
      en: [
        'Between the homogeniser outlet and the filling line the emulsion has to stay stable. Excess shear changes the droplet size distribution and shortens shelf life.',
        'Product changeovers are frequent, so strip-down and cleaning time sets the effective production capacity.',
      ],
    },
    characteristics: {
      tr: [
        'Çoğu ürün tiksotropik veya yalancı plastik davranır; pompa giriş koşullarında viskozite ölçüm değerinden farklıdır.',
        'Hava sürüklenmesi kabul edilmez; köpük dolum hacmini ve görünümü bozar.',
        'Ürün taşınması (cross-contamination) riski, geometri ve yüzey kalitesiyle sınırlandırılır.',
        'Yüzey pürüzlülüğü ve kaynak kalitesi doğrulama dosyasının parçasıdır.',
      ],
      en: [
        'Most products are thixotropic or pseudoplastic, so viscosity at the pump inlet differs from the measured value.',
        'Air entrainment is not acceptable. Foam disturbs both fill volume and appearance.',
        'Cross-contamination risk is limited by geometry and surface quality.',
        'Surface roughness and weld quality form part of the validation file.',
      ],
    },
    challenges: {
      tr: [
        'Yüksek kesmeli pompalar emülsiyonu inceltir ve ürün spesifikasyon dışına çıkar.',
        'Karmaşık iç geometri, temizlik doğrulamasını zorlaştırır ve dokümantasyon yükünü artırır.',
        'Yüksek viskoziteli macunlarda emme tarafı yetersiz beslenir.',
      ],
      en: [
        'High-shear pumps thin the emulsion and the product moves outside specification.',
        'Complex internal geometry makes cleaning validation harder and increases the documentation load.',
        'With high-viscosity pastes the suction side is starved.',
      ],
    },
    approach: {
      tr: [
        'Hijyenik konfigürasyonda iç geometri sadeleştirilir, ölü hacim ve keskin geçişler sınırlandırılır. Kartuş tip salmastra, sökme ve montaj sırasında insan hatasını azaltır.',
        'Düşük devirde çalışma emülsiyona uygulanan kesme enerjisini sınırlar. Debi ihtiyacı devirle değil gövde boyu seçilerek karşılanır.',
        'Yüksek viskoziteli macunlarda emme ağzı büyütülür veya beslemeli konfigürasyon kullanılır.',
      ],
      en: [
        'In the hygienic configuration the internal geometry is simplified and dead volume and sharp transitions are limited. A cartridge seal reduces the scope for assembly error during strip-down.',
        'Running at low speed limits the shear energy applied to the emulsion. Flow demand is met by choosing the frame size rather than by raising the speed.',
        'With high-viscosity pastes the suction port is enlarged or a fed configuration is used.',
      ],
    },
    materials: {
      tr: 'Islak yüzeyler 1.4404 (AISI 316L), talep edilen yüzey pürüzlülüğüne göre işlenir. Elastomerler EPDM, FKM veya FFKM olarak seçilir. Bağlantılar Clamp (DIN 32676) veya DIN 11851 standardındadır.',
      en: 'Wetted surfaces are 1.4404 (AISI 316L), finished to the requested surface roughness. Elastomers are specified as EPDM, FKM or FFKM. Connections are made to Clamp (DIN 32676) or DIN 11851 standards.',
    },
    models: [
      { slug: 'lql-25', note: { tr: 'Dozajlama ve küçük partiler', en: 'Dosing and small batches' } },
      { slug: 'lql-50', note: { tr: 'Krem ve emülsiyon transferi', en: 'Cream and emulsion transfer' } },
      { slug: 'lql-100', note: { tr: 'Yüksek viskoziteli macunlar', en: 'High-viscosity pastes' } },
    ],
  },
  {
    key: 'wastewater',
    slug: { tr: 'atiksu-cevre', en: 'wastewater-environment' },
    icon: 'wastewater',
    name: { tr: 'Atıksu ve Çevre', en: 'Wastewater & Environment' },
    short: {
      tr: 'Katı madde ve abrazif içerikli çamurlarda kesintisiz çalışma.',
      en: 'Uninterrupted operation on sludge carrying solids and abrasives.',
    },
    fluids: {
      tr: 'Yoğunlaştırılmış çamur, flotasyon köpüğü, biyokütle, polimer çözeltisi',
      en: 'Thickened sludge, flotation scum, biomass, polymer solution',
    },
    lead: {
      tr: 'Arıtma tesislerinde pompanın işi durmamaktır. Seçim, en iyi noktadaki verime göre değil, en kötü koşuldaki güvenilirliğe göre yapılır.',
      en: 'In a treatment plant the pump has one job: not to stop. Selection is made against reliability in the worst condition, not efficiency at the best point.',
    },
    process: {
      tr: [
        'Yoğunlaştırıcı çıkışından susuzlaştırma ünitesine besleme, çürütücü sirkülasyonu ve polimer dozajlama en yaygın kullanım noktalarıdır.',
        'Çamur konsantrasyonu gün içinde değişir. Pompa, kuru madde oranı yükseldiğinde de aynı hattı beslemeye devam etmek zorundadır.',
      ],
      en: [
        'The most common duty points are feeding the dewatering unit from the thickener outlet, digester circulation and polymer dosing.',
        'Sludge concentration varies through the day. The pump has to keep feeding the same line when the dry solids content rises.',
      ],
    },
    characteristics: {
      tr: [
        'Kuru madde oranına bağlı olarak viskozite geniş bir aralıkta değişir.',
        'Çamurda kum, lif, plastik ve metal parçaları bulunabilir.',
        'Abrazif içerik aşınma parçalarının ömrünü belirler.',
        'Çürütücü hatlarında gaz kabarcıkları emme tarafını kesintiye uğratabilir.',
      ],
      en: [
        'Viscosity varies across a wide band with dry solids content.',
        'Sludge can carry grit, fibre, plastic and metal fragments.',
        'Abrasive content sets the life of the wear parts.',
        'On digester lines, gas bubbles can interrupt the suction side.',
      ],
    },
    challenges: {
      tr: [
        'Lifli içerik rotor etrafında birikerek tıkanma ve tork artışına yol açar.',
        'Aşınma, gövdeyi de kapsadığında onarım maliyeti pompa maliyetine yaklaşır.',
        'Servis için pompanın hattan sökülmesi tesiste kesinti anlamına gelir.',
      ],
      en: [
        'Fibrous content builds up around the rotor, leading to blockage and rising torque.',
        'When wear reaches the casing, repair cost approaches the cost of the pump.',
        'Removing the pump from the line for service means an outage for the plant.',
      ],
    },
    approach: {
      tr: [
        'Abrazif uygulamalarda aşınma plakaları ve rotor uçları ayrı parçalar olarak üretilir. Aşınma yüzeyi tükendiğinde gövde değil bu parçalar değiştirilir.',
        'Rotorlar ön kapak açılarak çıkarılır. Pompa hattan ve tahrikten ayrılmadığı için servis süresi saatlerle değil dakikalarla ölçülür.',
        'Lifli içerikte 2 kanatlı rotor ve büyütülmüş emme ağzı kullanılır. Debi ihtiyacı düşük devirde büyük gövdeyle karşılanır; bu, aşınma hızını doğrudan düşürür.',
      ],
      en: [
        'On abrasive duties the wear plates and rotor tips are separate parts. When the wear surface is spent, those parts are replaced instead of the casing.',
        'Rotors come out through the front cover. Because the pump stays coupled to the line and to its drive, service time is measured in minutes rather than hours.',
        'For fibrous content a bi-wing rotor and an enlarged suction port are specified. Flow demand is met with a larger frame at low speed, which lowers the wear rate directly.',
      ],
    },
    materials: {
      tr: 'Gövde EN-GJL-250 dökme demir veya 1.4404 paslanmaz çelik olarak seçilir. Rotorlar elastomer kaplı veya sertleştirilmiş yüzeyli olarak üretilir. Bağlantılar DIN EN 1092-1 flanş standardındadır.',
      en: 'The casing is specified as EN-GJL-250 cast iron or 1.4404 stainless steel. Rotors are produced elastomer-coated or with a hardened surface. Connections are made to DIN EN 1092-1 flange standard.',
    },
    models: [
      { slug: 'lql-200', note: { tr: 'Çürütücü sirkülasyonu', en: 'Digester circulation' } },
      { slug: 'lql-100', note: { tr: 'Susuzlaştırma beslemesi', en: 'Dewatering feed' } },
      { slug: 'lql-25', note: { tr: 'Polimer dozajlama', en: 'Polymer dosing' } },
    ],
  },
  {
    key: 'industrial-process',
    slug: { tr: 'endustriyel-proses', en: 'industrial-process' },
    icon: 'industrial',
    name: { tr: 'Endüstriyel Proses', en: 'Industrial Process' },
    short: {
      tr: 'Yağ, gres ve dolgu malzemelerinde yüksek viskoziteli transfer.',
      en: 'High-viscosity transfer of oils, greases and filler compounds.',
    },
    fluids: {
      tr: 'Yağlar, gresler, dolgu macunları, boya, bitüm, biyodizel hammaddeleri',
      en: 'Oils, greases, filler compounds, paint, bitumen, biodiesel feedstock',
    },
    lead: {
      tr: 'Yüksek viskoziteli akışkanlarda seçim, emme tarafının doğru boyutlandırılmasıyla başlar. Pompa çıkışı değil, girişi hattın kapasitesini belirler.',
      en: 'With high-viscosity media, selection starts by sizing the suction side correctly. It is the inlet, not the outlet, that sets the capacity of the line.',
    },
    process: {
      tr: [
        'Depolama tankından üretim hattına besleme, karıştırıcı boşaltma, dolum ve variller arası transfer tipik uygulamalardır.',
        'Bitüm ve gres gibi akışkanlarda hat ve pompa ısıtmalı çalışır; sıcaklık düştüğünde viskozite hızla yükselir.',
      ],
      en: [
        'Typical duties are feeding the production line from storage, emptying mixers, filling and drum-to-drum transfer.',
        'With media such as bitumen and grease, both the line and the pump are heat-traced. As temperature falls, viscosity rises quickly.',
      ],
    },
    characteristics: {
      tr: [
        'Viskozite sıcaklığa güçlü şekilde bağlıdır; 20 °C ve 60 °C arasında birkaç kat fark görülebilir.',
        'Dolgu malzemeleri abrazif mineral içerir.',
        'Akışkanların çoğu düşük buhar basıncına sahiptir; emme tarafı kavitasyona nispeten dayanıklıdır.',
        'Kesintisiz üretim hatlarında pompa 7/24 çalışır.',
      ],
      en: [
        'Viscosity depends strongly on temperature. Between 20 °C and 60 °C the difference can be several times over.',
        'Filler compounds contain abrasive mineral content.',
        'Most of these media have low vapour pressure, so the suction side is relatively resistant to cavitation.',
        'On continuous lines the pump runs around the clock.',
      ],
    },
    challenges: {
      tr: [
        'Yetersiz emme kesiti, yüksek viskozitede pompanın dolmasını engeller ve debi düşer.',
        'Abrazif dolgu malzemeleri rotor ve gövde arasındaki toleransı hızla açar.',
        'Soğuk başlangıçta tork ihtiyacı normal işletmenin çok üzerine çıkar.',
      ],
      en: [
        'An undersized suction cross-section stops the pump filling at high viscosity and the flow rate drops.',
        'Abrasive fillers open the clearance between rotor and casing quickly.',
        'On a cold start the torque demand rises far above normal operation.',
      ],
    },
    approach: {
      tr: [
        'Yüksek viskoziteli akışkanlarda pompa düşük devirde ve büyük gövdeyle seçilir. Bu, emme tarafına dolma zamanı tanır ve hacimsel verimi yüksek tutar.',
        'Isıtmalı ceket, gövde ve kapak üzerinde uygulanabilir. Soğuk başlangıç torku, tahrik seçiminde ayrı bir kriter olarak hesaba katılır.',
        'Abrazif dolgu malzemelerinde sertleştirilmiş rotor yüzeyleri ve değiştirilebilir aşınma plakaları kullanılır.',
      ],
      en: [
        'For high-viscosity media the pump is selected with a larger frame at low speed. That gives the suction side time to fill and keeps volumetric efficiency high.',
        'A heating jacket can be applied to the casing and cover. Cold-start torque is treated as a separate criterion in the drive selection.',
        'For abrasive fillers, hardened rotor surfaces and replaceable wear plates are specified.',
      ],
    },
    materials: {
      tr: 'Gövde 1.4404 paslanmaz çelik veya EN-GJL-250 dökme demir olarak seçilir. Elastomerler NBR veya FKM olarak akışkana göre belirlenir. Bağlantılar DIN EN 1092-1 flanş standardındadır.',
      en: 'The casing is specified as 1.4404 stainless steel or EN-GJL-250 cast iron. Elastomers are chosen as NBR or FKM to suit the medium. Connections are made to DIN EN 1092-1 flange standard.',
    },
    models: [
      { slug: 'lql-100', note: { tr: 'Yağ ve macun transferi', en: 'Oil and compound transfer' } },
      { slug: 'lql-200', note: { tr: 'Depo ve hat besleme', en: 'Storage and line feed' } },
      { slug: 'lql-50', note: { tr: 'Dolum ve variller arası', en: 'Filling and drum transfer' } },
    ],
  },
]

export function applicationByKey(key: string): Application | undefined {
  return APPLICATIONS.find((a) => a.key === key)
}

export function applicationBySlug(locale: 'tr' | 'en', slug: string): Application | undefined {
  return APPLICATIONS.find((a) => a.slug[locale] === slug)
}
