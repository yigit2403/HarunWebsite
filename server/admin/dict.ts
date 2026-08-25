import type { Localised } from '@/lib/i18n'

/**
 * Admin panel strings. Kept beside the page rather than in content/dict.ts,
 * which holds public-site copy: nothing here is ever shown to a visitor.
 */
export const A = {
  panel: { tr: 'Yönetim', en: 'Admin' },
  analytics: { tr: 'Site istatistikleri', en: 'Site analytics' },
  backToSite: { tr: 'Siteye dön', en: 'Back to site' },

  range7: { tr: '7 gün', en: '7 days' },
  range30: { tr: '30 gün', en: '30 days' },
  range90: { tr: '90 gün', en: '90 days' },
  rangeLabel: { tr: 'Zaman aralığı', en: 'Time range' },

  views: { tr: 'Görüntülenme', en: 'Page views' },
  sessions: { tr: 'Oturum', en: 'Sessions' },
  inquiries: { tr: 'Teknik talep', en: 'Inquiries' },
  docRequests: { tr: 'Doküman talebi', en: 'Document requests' },
  vsPrevious: { tr: 'önceki döneme göre', en: 'vs previous period' },

  trendTitle: { tr: 'Günlük görüntülenme', en: 'Page views per day' },
  peak: { tr: 'En yüksek gün', en: 'Busiest day' },
  tableView: { tr: 'Tabloyu göster', en: 'Show table' },
  date: { tr: 'Tarih', en: 'Date' },

  topPages: { tr: 'En çok görüntülenen sayfalar', en: 'Most viewed pages' },
  referrers: { tr: 'Yönlendiren siteler', en: 'Referring sites' },
  referrersNote: { tr: 'Doğrudan ziyaretler sayılmaz', en: 'Direct visits are not counted' },
  docsWanted: { tr: 'En çok istenen dokümanlar', en: 'Most requested documents' },
  docsNote: {
    tr: 'Hangi dokümanı önce hazırlamak gerektiğini gösterir',
    en: 'Shows which document to produce first',
  },
  languageSplit: { tr: 'Dil dağılımı', en: 'Language split' },
  devices: { tr: 'Cihaz', en: 'Devices' },
  mobile: { tr: 'Mobil', en: 'Mobile' },
  tablet: { tr: 'Tablet', en: 'Tablet' },
  desktop: { tr: 'Masaüstü', en: 'Desktop' },

  recentInquiries: { tr: 'Son teknik talepler', en: 'Recent inquiries' },
  notForwarded: { tr: 'İletilmedi', en: 'Not forwarded' },
  noData: { tr: 'Bu aralıkta veri yok.', en: 'No data in this range.' },
  noInquiries: { tr: 'Bu aralıkta talep yok.', en: 'No inquiries in this range.' },

  storageTitle: { tr: 'Veri kalıcı değil', en: 'Data is not persisted' },
  storageBody: {
    tr: 'İstatistikler şu anda bellekte tutuluyor ve sunucu her yeniden başladığında sıfırlanıyor. Kalıcı kayıt için ANALYTICS_DATA_DIR (kendi sunucunuz) veya UPSTASH_REDIS_REST_URL (Vercel) tanımlayın.',
    en: 'Analytics are held in memory and reset every time the server restarts. For a durable log set ANALYTICS_DATA_DIR on your own server, or UPSTASH_REDIS_REST_URL on Vercel.',
  },

  mailOffTitle: { tr: 'E-posta yönlendirme kapalı', en: 'Email forwarding is off' },
  mailOffBody: {
    tr: 'Gelen talepler e-posta ile iletilmiyor, bu sayfada birikiyor. Açmak için INQUIRY_TO_EMAIL, INQUIRY_FROM_EMAIL ve RESEND_API_KEY tanımlayın.',
    en: 'Incoming inquiries are not being emailed, they are collecting on this page. To switch it on set INQUIRY_TO_EMAIL, INQUIRY_FROM_EMAIL and RESEND_API_KEY.',
  },
  mailOffCount: {
    tr: 'Bu aralıkta iletilmemiş talep',
    en: 'Inquiries in this range that were not forwarded',
  },

  fieldDoc: { tr: 'Talep edilen doküman', en: 'Requested document' },
  fieldName: { tr: 'Ad Soyad', en: 'Name' },
  fieldCompany: { tr: 'Firma', en: 'Company' },
  fieldEmail: { tr: 'E-posta', en: 'Email' },
  fieldPhone: { tr: 'Telefon', en: 'Phone' },
  fieldApplication: { tr: 'Uygulama', en: 'Application' },
  fieldFluid: { tr: 'Akışkan', en: 'Fluid' },
  fieldFlow: { tr: 'Debi', en: 'Flow rate' },
  fieldPressure: { tr: 'Basınç', en: 'Pressure' },
  fieldViscosity: { tr: 'Viskozite', en: 'Viscosity' },
  fieldTemperature: { tr: 'Sıcaklık', en: 'Temperature' },
  fieldMessage: { tr: 'Proses notları', en: 'Process notes' },
} satisfies Record<string, Localised>

export const INQUIRY_FIELD_ORDER = [
  // First, because it is why they wrote in.
  ['doc', A.fieldDoc],
  ['name', A.fieldName],
  ['company', A.fieldCompany],
  ['email', A.fieldEmail],
  ['phone', A.fieldPhone],
  ['application', A.fieldApplication],
  ['fluid', A.fieldFluid],
  ['flow', A.fieldFlow],
  ['pressure', A.fieldPressure],
  ['viscosity', A.fieldViscosity],
  ['temperature', A.fieldTemperature],
  ['message', A.fieldMessage],
] as const
