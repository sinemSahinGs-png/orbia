import { redirect } from "next/navigation";
import { resolveTag } from "@/lib/nfc/resolve-tag";
import { InvalidKeyState } from "@/components/nfc/experience/InvalidKeyState";
import "@/app/nfc-experience.css";

/** Legacy NFC URLs (`/k/AX7K29P`) → burç path (`/aslan`). */
export default async function LegacyKeyPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const code = (await params).code;
  const tag = resolveTag(code);

  if (!tag.ok) {
    return (
      <InvalidKeyState
        title="BU YILDIZ TANINMIYOR."
        body="ORBIA kodu geçersiz veya henüz tanımlanmamış olabilir."
      />
    );
  }

  redirect(`/${tag.tag.sign.slug}`);
}
