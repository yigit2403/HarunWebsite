import type { Localised } from '@/lib/i18n'
import type { PageKey } from '@/lib/routes'

/**
 * Interface strings. Page prose lives in the per-section content modules;
 * this file holds labels, navigation, table headers and form chrome.
 *
 * Two contact intents exist on this site and they never gain a third label:
 *   - "Ürünleri İncele"  / "View Products"              -> the catalogue
 *   - "Teknik Destek Al" / "Request Technical Support"  -> the inquiry form
 */

export const NAV_LABEL: Record<PageKey, Localised> = {
  products: { tr: 'Ürünler', en: 'Products' },
  rotors: { tr: 'Rotorlar', en: 'Rotors' },
  applications: { tr: 'Uygulamalar', en: 'Applications' },
  engineering: { tr: 'Mühendislik', en: 'Engineering' },
  about: { tr: 'Kurumsal', en: 'About' },
  support: { tr: 'Kaynaklar', en: 'Resources' },
  contact: { tr: 'İletişim', en: 'Contact' },
}

export const UI = {
  skipToContent: { tr: 'İçeriğe geç', en: 'Skip to content' },
  openMenu: { tr: 'Menüyü aç', en: 'Open menu' },
  closeMenu: { tr: 'Menüyü kapat', en: 'Close menu' },
  primaryNav: { tr: 'Ana gezinme', en: 'Primary navigation' },
  breadcrumb: { tr: 'Sayfa yolu', en: 'Breadcrumb' },
  onThisPage: { tr: 'Sayfa içi bölümler', en: 'On this page' },
  language: { tr: 'Dil', en: 'Language' },
  home: { tr: 'Ana Sayfa', en: 'Home' },

  // The two contact intents, used verbatim everywhere.
  ctaProducts: { tr: 'Ürünleri İncele', en: 'View Products' },
  ctaSupport: { tr: 'Teknik Destek Al', en: 'Request Technical Support' },
  ctaContactShort: { tr: 'İletişim', en: 'Contact' },

  technicalDetails: { tr: 'Teknik Detaylar', en: 'Technical Details' },
  viewApplication: { tr: 'İncele', en: 'View' },
  allProducts: { tr: 'Tüm ürünler', en: 'All products' },
  allApplications: { tr: 'Tüm uygulamalar', en: 'All applications' },

  phone: { tr: 'Telefon', en: 'Phone' },
  callUs: { tr: 'Doğrudan arayın', en: 'Call us directly' },
  address: { tr: 'Adres', en: 'Address' },
  web: { tr: 'Web', en: 'Web' },

  // Specification vocabulary
  capacity: { tr: 'Kapasite', en: 'Capacity' },
  maxPressure: { tr: 'Maks. basınç', en: 'Max. pressure' },
  connection: { tr: 'Bağlantı', en: 'Connection' },
  viscosity: { tr: 'Viskozite', en: 'Viscosity' },
  temperature: { tr: 'Sıcaklık', en: 'Temperature' },
  speed: { tr: 'Devir', en: 'Speed' },
  rotor: { tr: 'Rotor', en: 'Rotor' },
  seal: { tr: 'Sızdırmazlık', en: 'Shaft seal' },
  materials: { tr: 'Malzemeler', en: 'Materials' },
  drive: { tr: 'Tahrik', en: 'Drive' },
  port: { tr: 'Ağız', en: 'Port' },
  frameSize: { tr: 'Gövde boyu', en: 'Frame size' },
  property: { tr: 'Özellik', en: 'Property' },
  value: { tr: 'Değer', en: 'Value' },
  model: { tr: 'Model', en: 'Model' },

  provisionalNote: {
    tr: 'Bu tabloda yer alan değerler ön tasarım değerleridir ve doğrulama sürecindedir. Bağlayıcı seçim için mühendislik ekibiyle teyit ediniz.',
    en: 'The values in this table are preliminary design figures under verification. Confirm with our engineering team before making a binding selection.',
  },

  // Document list
  documents: { tr: 'Dokümanlar', en: 'Documents' },
  onRequest: { tr: 'Talep üzerine', en: 'On request' },
  requestDocument: { tr: 'Talep Et', en: 'Request' },

  // Forms
  formName: { tr: 'Ad Soyad', en: 'Full name' },
  formCompany: { tr: 'Firma', en: 'Company' },
  formEmail: { tr: 'E-posta', en: 'Email' },
  formPhone: { tr: 'Telefon', en: 'Phone' },
  formApplication: { tr: 'Uygulama alanı', en: 'Application' },
  formFluid: { tr: 'Akışkan', en: 'Fluid' },
  formFluidHint: {
    tr: 'Örneğin: yoğurt, atık çamur, reçine',
    en: 'For example: yoghurt, waste sludge, resin',
  },
  formViscosity: { tr: 'Viskozite', en: 'Viscosity' },
  formViscosityHint: { tr: 'mPa·s, biliniyorsa', en: 'mPa·s, if known' },
  formFlow: { tr: 'İstenen debi', en: 'Required flow rate' },
  formFlowHint: { tr: 'm³/h', en: 'm³/h' },
  formPressure: { tr: 'Çalışma basıncı', en: 'Operating pressure' },
  formPressureHint: { tr: 'bar', en: 'bar' },
  formTemperature: { tr: 'Çalışma sıcaklığı', en: 'Operating temperature' },
  formTemperatureHint: { tr: '°C', en: '°C' },
  formMessage: { tr: 'Proses notları', en: 'Process notes' },
  formMessageHint: {
    tr: 'Katı madde oranı, CIP gereksinimi, çalışma rejimi ve mevcut ekipman.',
    en: 'Solids content, CIP requirement, duty cycle and existing equipment.',
  },
  formSelect: { tr: 'Seçiniz', en: 'Select' },
  formDocNotice: { tr: 'Talep ettiğiniz doküman', en: 'Document you requested' },
  formSubmit: { tr: 'Talebi Gönder', en: 'Send Request' },
  formSending: { tr: 'Gönderiliyor', en: 'Sending' },
  formRequired: { tr: 'zorunlu', en: 'required' },
  formPrivacy: {
    tr: 'Paylaştığınız proses bilgileri yalnızca pompa seçimi ve teklif hazırlığı için kullanılır.',
    en: 'The process information you share is used only for pump selection and quotation.',
  },
  formSuccess: {
    tr: 'Talebiniz alındı. Mühendislik ekibimiz proses verilerinizi inceleyip sizinle iletişime geçecek.',
    en: 'Your request has been received. Our engineering team will review your process data and get back to you.',
  },
  formErrorGeneric: {
    tr: 'Talep gönderilemedi. Lütfen doğrudan telefonla ulaşın.',
    en: 'The request could not be sent. Please reach us by phone instead.',
  },
  formErrorValidation: {
    tr: 'Lütfen zorunlu alanları doldurun.',
    en: 'Please complete the required fields.',
  },

  // Empty / pending states
  curvesTitle: { tr: 'Performans eğrileri', en: 'Performance curves' },
  curvesEmptyTitle: {
    tr: 'Eğriler çalışma noktasına göre düzenlenir',
    en: 'Curves are issued per duty point',
  },
  curvesEmptyBody: {
    tr: 'Debi, basınç, viskozite ve devir kombinasyonuna göre hazırlanan performans eğrilerini mühendislik ekibimizden talep edebilirsiniz.',
    en: 'Performance curves are prepared for your combination of flow, pressure, viscosity and shaft speed. Request them from our engineering team.',
  },
  dimensionsTitle: { tr: 'Ölçü resmi', en: 'Dimensional drawing' },
  dimensionsEmptyTitle: {
    tr: 'Ölçüler konfigürasyona bağlıdır',
    en: 'Dimensions depend on configuration',
  },
  dimensionsEmptyBody: {
    tr: 'Gövde boyu, bağlantı tipi ve tahrik seçimine göre onaylı ölçü resmi ve DWG dosyası hazırlanır.',
    en: 'An approved dimensional drawing and DWG file is prepared for your frame size, connection type and drive selection.',
  },

  notFoundTitle: { tr: 'Sayfa bulunamadı', en: 'Page not found' },
  notFoundBody: {
    tr: 'Aradığınız sayfa taşınmış veya adresi değişmiş olabilir.',
    en: 'The page you are looking for may have moved or changed address.',
  },
  backHome: { tr: 'Ana sayfaya dön', en: 'Back to home' },

  copyright: {
    tr: 'Tüm hakları saklıdır.',
    en: 'All rights reserved.',
  },
} satisfies Record<string, Localised>

/** Product-detail in-page section labels, shared by the anchor navigation. */
export const DETAIL_SECTIONS = {
  overview: { tr: 'Genel Bakış', en: 'Overview' },
  advantages: { tr: 'Avantajlar', en: 'Advantages' },
  applications: { tr: 'Uygulamalar', en: 'Applications' },
  technical: { tr: 'Teknik Veriler', en: 'Technical Data' },
  configuration: { tr: 'Konfigürasyon', en: 'Configuration' },
  documents: { tr: 'Dokümanlar', en: 'Documents' },
} satisfies Record<string, Localised>

export type DetailSectionKey = keyof typeof DETAIL_SECTIONS
