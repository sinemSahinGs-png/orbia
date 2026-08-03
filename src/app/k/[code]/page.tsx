import { notFound } from "next/navigation";
import { resolveTag } from "@/lib/nfc/resolve-tag";
import { getDailyForSign } from "@/lib/daily-reading/get-daily";
import { KeyExperience } from "@/components/nfc/KeyExperience";
import { MarketingChrome } from "@/components/layout/MarketingChrome";

export default async function KeyPage({ params }: { params: Promise<{ code: string }> }) {
  const code = (await params).code;
  const tag = resolveTag(code);
  if (!tag.ok) notFound();

  const daily = getDailyForSign(tag.tag.sign.slug);
  if (!daily) notFound();

  return (
    <MarketingChrome>
      <KeyExperience code={tag.tag.code} sign={daily.sign} reading={daily.reading} astronomy={daily.astronomy} />
    </MarketingChrome>
  );
}
