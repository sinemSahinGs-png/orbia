import { notFound, redirect } from "next/navigation";
import { getDailyForSign } from "@/lib/daily-reading/get-daily";
import { getDemoCodeForSign } from "@/lib/nfc/demo-tags";
import { KeyExperience } from "@/components/nfc/KeyExperience";
import { InvalidKeyState } from "@/components/nfc/experience/InvalidKeyState";
import { allSigns, getSignBySlug } from "@/lib/zodiac/signs";
import { normalizeSignSlug } from "@/lib/zodiac/normalize-sign-slug";
import "@/app/nfc-experience.css";

type Props = { params: Promise<{ sign: string }> };

export function generateStaticParams() {
  return allSigns().map((s) => ({ sign: s.slug }));
}

export default async function SignExperiencePage({ params }: Props) {
  const raw = (await params).sign;
  const slug = normalizeSignSlug(raw);
  const sign = getSignBySlug(slug);

  if (!sign) notFound();

  if (raw !== slug) {
    redirect(`/${slug}`);
  }

  const daily = getDailyForSign(sign.slug);
  if (!daily) {
    return (
      <InvalidKeyState
        title="BU ORBIA HENÜZ UYANMADI."
        body="Anahtarlığın dijital deneyimi henüz etkinleştirilmemiş."
        primaryHref="/siparis"
        primaryLabel="Kurulumu Başlat"
      />
    );
  }

  const code = getDemoCodeForSign(sign.slug) ?? sign.slug;

  return (
    <KeyExperience
      code={code}
      sign={daily.sign}
      reading={daily.reading}
      astronomy={daily.astronomy}
    />
  );
}
