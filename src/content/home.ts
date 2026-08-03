export const nfcJourneyContent = {
  heading: ["DOKUNDURDUĞUN ANDA", "GÖKYÜZÜN AÇILIR."],
  description:
    "ORBIA anahtarlığını telefonuna yaklaştır. Sana ait burç deneyimi birkaç saniye içinde canlansın.",
  steps: [
    {
      n: "01",
      title: "Burcunu seç",
      text: "12 burçtan sana ait olanı seç.",
    },
    {
      n: "02",
      title: "Anahtarlığını oluştur",
      text: "Burç sembolünü ve görünümünü kişiselleştir.",
    },
    {
      n: "03",
      title: "Telefonuna dokundur",
      text: "NFC bağlantısı deneyimi saniyeler içinde açar.",
    },
    {
      n: "04",
      title: "Günlük gökyüzünü keşfet",
      text: "Enerjini, Ay’ın ritmini ve bugünün yorumunu gör.",
    },
  ],
} as const;

export const zodiacCollectionContent = {
  heading: ["ON İKİ BURÇ.", "ON İKİ FARKLI ENERJİ."],
  description:
    "Her burç kendi sembolü, ritmi ve günlük gökyüzü deneyimiyle yaşar.",
} as const;

export const dailySkyContent = {
  heading: ["HER GÜN FARKLI BİR GÖKYÜZÜ."],
  description:
    "Anahtarlığını her okuttuğunda o güne ait enerji, Ay hareketleri ve burcuna özel kısa yorum açılır.",
  sample: {
    signSlug: "aslan",
    signName: "ASLAN",
    headline: "Bugün ışığını saklaman gerekmiyor.",
    energy: 78,
    emotional: 72,
    focus: 84,
    social: 81,
    advice: "Enerjini tek bir hedefe yönelt.",
  },
} as const;

export const astronomyLayerContent = {
  heading: ["YORUMUN ARKASINDA", "BUGÜNÜN GÖKYÜZÜ VAR."],
  description:
    "Ay’ın fazı, aydınlanma oranı ve güncel gökyüzü hareketleri deneyimin astronomik katmanını oluşturur.",
  fallbackMessage: "Gökyüzü verisi güncelleniyor.",
} as const;

export const pairingContent = {
  heading: ["İKİ ENERJİ. TEK GÖKYÜZÜ."],
  description:
    "Kendi ORBIA anahtarlığını okuttuktan sonra bir başkasının ORBIA anahtarlığını okut. İki burcun bugüne özel ortak ritmini keşfet.",
  flow: [
    "İlk ORBIA okutulur.",
    "“Bir Anahtarlık Daha Okut” seçilir.",
    "İkinci ORBIA okutulur.",
    "İki burç ortak günlük deneyimi oluşturur.",
  ],
  sample: {
    signA: "ASLAN",
    signB: "TERAZİ",
    generalRhythm: 82,
    communication: 88,
    emotionalFlow: 74,
    movementEnergy: 85,
    message:
      "Biri yönü belirlerken diğeri dengeyi kurabilir. Bugün birbirinize alan bırakmak ortak ritmi güçlendirebilir.",
  },
  cta: "İki Burcun Ritmini Keşfet",
  ctaHref: "/uyum",
} as const;

export const physicalProductContent = {
  heading: ["GÖKYÜZÜNÜN FİZİKSEL HALİ."],
  description:
    "Her ORBIA, günlük dijital deneyimi taşıyan koleksiyonluk bir fiziksel obje olarak tasarlanır.",
  features: [
    "NFC çip",
    "Minimal burç sembolü",
    "Premium koyu yüzey",
    "Metal anahtarlık halkası",
    "Opsiyonel kişiselleştirme",
    "Mobil NFC deneyimi",
    "12 burç seçeneği",
  ],
} as const;

export const personalizationContent = {
  heading: ["SENİN BURCUN. SENİN ANAHTARIN."],
  description:
    "Burcunu seç, görünümünü kişiselleştir ve sana ait ORBIA’nı oluştur.",
  steps: [
    "Burcunu seç",
    "Yüzey seçeneğini belirle",
    "Metal rengini seç",
    "İsim veya kısa mesaj ekle",
    "Önizlemeyi görüntüle",
    "Sipariş talebi oluştur",
  ],
  surfaces: [
    { id: "obsidian", label: "Obsidyen Siyah", tone: "#0A0C10" },
    { id: "lunar", label: "Lunar Silver", tone: "#C5C8CE" },
    { id: "midnight", label: "Midnight Blue", tone: "#131D35" },
  ],
  metals: [
    { id: "silver", label: "Fırçalanmış Gümüş", tone: "#D7D9DF" },
    { id: "gold", label: "Ay Altını", tone: "#B7A16A" },
    { id: "graphite", label: "Grafit", tone: "#6B7078" },
  ],
  maxPersonalizationLength: 18,
  orderHref: "/siparis",
} as const;

export const astrologyNoticeContent = {
  heading: ["GÖKYÜZÜ BİR REHBERDİR.", "KESİN BİR CEVAP DEĞİL."],
  text: "ORBIA’da yer alan astrolojik yorumlar eğlence ve kişisel farkındalık amacıyla sunulur. Ay fazı ve astronomik gökyüzü bilgileri hesaplanan verilerden ayrı olarak gösterilir.",
} as const;

export const finalCtaContent = {
  heading: ["GÖKYÜZÜNÜ CEBİNDE TAŞI."],
  description:
    "Burcuna özel anahtarlığını oluştur. Günlük gökyüzü deneyimin her dokunuşta seninle olsun.",
  primary: { label: "ORBIA’nı Oluştur", href: "/siparis" },
  secondary: { label: "Nasıl Çalışır?", href: "/nasil-calisir" },
} as const;
