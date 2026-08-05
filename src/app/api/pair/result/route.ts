import { NextResponse } from "next/server";
import { z } from "zod";
import { resolveTag } from "@/lib/nfc/resolve-tag";
import { getCompatibility } from "@/lib/astrology/compatibility-engine";
import { verifyPairResultToken } from "@/lib/nfc/pair-session-server";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("t");
  const parsed = z.string().min(8).safeParse(token);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Geçersiz bağlantı." }, { status: 400 });
  }

  const payload = verifyPairResultToken(parsed.data);
  if (!payload) {
    return NextResponse.json({ ok: false, error: "Bağlantının süresi dolmuş veya geçersiz." }, { status: 404 });
  }

  const first = resolveTag(payload.codes[0]);
  const second = resolveTag(payload.codes[1]);
  if (!first.ok || !second.ok) {
    return NextResponse.json({ ok: false, error: "Anahtar kodu bulunamadı." }, { status: 404 });
  }

  const compatibility = getCompatibility(
    first.tag.sign.slug,
    second.tag.sign.slug,
    payload.date,
  );
  if (!compatibility) {
    return NextResponse.json({ ok: false, error: "Uyum hesaplanamadı." }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    signA: first.tag.sign.nameTr,
    signB: second.tag.sign.nameTr,
    slugA: first.tag.sign.slug,
    slugB: second.tag.sign.slug,
    dateKey: payload.date,
    result: compatibility,
  });
}
