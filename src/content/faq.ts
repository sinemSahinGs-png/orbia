export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const homeFaqItems: readonly FaqItem[] = [
  {
    id: "how-works",
    question: "ORBIA nasıl çalışır?",
    answer:
      "Her ORBIA bir burca atanmış NFC anahtarlıktır. Telefona dokundurduğunda o güne ait burç deneyimi, enerji göstergeleri ve Ay bilgileri açılır.",
  },
  {
    id: "app-needed",
    question: "Telefonuma uygulama yüklemem gerekir mi?",
    answer:
      "Hayır. Desteklenen telefonlarda NFC okutma tarayıcı deneyimini açar. Ayrı bir uygulama zorunlu değildir.",
  },
  {
    id: "nfc-phones",
    question: "NFC hangi telefonlarda çalışır?",
    answer:
      "NFC destekleyen ve NFC’si açık olan çoğu modern Android telefon ile birçok iPhone modelinde çalışır. Cihaz ayarlarından NFC’nin etkin olduğundan emin olun.",
  },
  {
    id: "daily-diff",
    question: "Her gün farklı yorum mu gösterilir?",
    answer:
      "Evet. Günlük deneyim tarihe ve burcunuza göre yenilenir; enerji değerleri ve kısa yorum o güne ait ritmi yansıtır.",
  },
  {
    id: "energy-random",
    question: "Günlük enerji değeri rastgele mi belirlenir?",
    answer:
      "Hayır. Değerler rastgele üretilmez; burç ve gün bağlamına göre tutarlı bir hesaplama katmanından türetilir.",
  },
  {
    id: "second-key",
    question: "İkinci bir anahtarlık nasıl okutulur?",
    answer:
      "İlk anahtarlığınızı okuttuktan sonra “Bir Anahtarlık Daha Okut” adımını seçin. İkinci ORBIA okutulunca iki burcun ortak ritmi açılır.",
  },
  {
    id: "couples-only",
    question: "İki burç deneyimi yalnızca sevgililer için mi?",
    answer:
      "Hayır. İki burç deneyimi arkadaşlar, aile üyeleri veya hediye edilen herhangi iki ORBIA arasında kullanılabilir.",
  },
  {
    id: "rebind",
    question: "Anahtarlığın bağlantısı sonradan değiştirilebilir mi?",
    answer:
      "Ürün bağlantı politikası sipariş ve aktivasyon sürecine bağlıdır. Değişiklik talepleri için destek kanallarından bilgi alabilirsiniz.",
  },
  {
    id: "personalize",
    question: "Ürün kişiselleştirilebilir mi?",
    answer:
      "Evet. Burç seçimi, yüzey ve metal seçenekleri ile kısa bir isim veya mesaj ekleyerek anahtarlığınızı kişiselleştirebilirsiniz.",
  },
  {
    id: "astro-basis",
    question: "Astrolojik yorumlar neye göre hazırlanır?",
    answer:
      "Yorumlar burç kimliği ve gün bağlamına dayalı kişisel farkındalık metinleridir; kesin kehanet veya tıbbi/finansal tavsiye değildir.",
  },
  {
    id: "astro-real",
    question: "Astronomik bilgiler gerçek veriler mi?",
    answer:
      "Ay fazı, aydınlanma ve ilgili gökyüzü değerleri hesaplanan astronomik verilerden türetilir ve yorum katmanından ayrı gösterilir.",
  },
  {
    id: "troubleshoot",
    question: "Anahtarlık çalışmazsa ne yapmalıyım?",
    answer:
      "Telefonunuzun NFC’sinin açık olduğundan emin olun, kılıfı çıkarmayı deneyin ve çipi telefonun NFC alanına yaklaştırın. Sorun sürerse destek ile iletişime geçin.",
  },
] as const;
