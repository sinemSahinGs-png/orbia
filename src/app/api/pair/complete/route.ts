import { NextResponse } from "next/server";
import { z } from "zod";
import { resolveTag } from "@/lib/nfc/resolve-tag";
import { getCompatibility } from "@/lib/astrology/compatibility-engine";

export async function POST(request: Request) {
  const body = z
    .object({ firstCode: z.string(), secondCode: z.string() })
    .safeParse(await request.json());

  if (!body.success) {
    return NextResponse.json({ ok: false, error: "Geçersiz eşleştirme." }, { status: 400 });
  }

  const first = resolveTag(body.data.firstCode);
  const second = resolveTag(body.data.secondCode);

  if (!first.ok || !second.ok) {
    return NextResponse.json({ ok: false, error: "Anahtar kodu bulunamadı." }, { status: 404 });
  }

  const compatibility = getCompatibility(first.tag.sign.slug, second.tag.sign.slug);
  if (!compatibility) {
    return NextResponse.json({ ok: false, error: "Uyum hesaplanamadı." }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    signA: first.tag.sign.nameTr,
    signB: second.tag.sign.nameTr,
    result: compatibility,
  });
}
