import { NextResponse } from "next/server";
import { z } from "zod";
import { resolveTag } from "@/lib/nfc/resolve-tag";
import { getCompatibility } from "@/lib/astrology/compatibility-engine";
import { createPairResultToken } from "@/lib/nfc/pair-session-server";

function istanbulDateKey(d = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export async function POST(request: Request) {
  const body = z
    .object({ firstCode: z.string().min(1), secondCode: z.string().min(1) })
    .safeParse(await request.json());

  if (!body.success) {
    return NextResponse.json({ ok: false, error: "Geçersiz eşleştirme." }, { status: 400 });
  }

  const firstCode = body.data.firstCode.trim().toUpperCase();
  const secondCode = body.data.secondCode.trim().toUpperCase();

  if (firstCode === secondCode) {
    return NextResponse.json(
      { ok: false, error: "Aynı ORBIA’yı iki kez okuttun. İkinci, farklı bir anahtarlık gerekli." },
      { status: 400 },
    );
  }

  const first = resolveTag(firstCode);
  const second = resolveTag(secondCode);

  if (!first.ok || !second.ok) {
    return NextResponse.json(
      { ok: false, error: "Geçerli bir ORBIA kodu değil. Aktif anahtarlık kodunu kullan." },
      { status: 404 },
    );
  }

  const dateKey = istanbulDateKey();
  const compatibility = getCompatibility(first.tag.sign.slug, second.tag.sign.slug, dateKey);
  if (!compatibility) {
    return NextResponse.json({ ok: false, error: "Uyum hesaplanamadı." }, { status: 404 });
  }

  const pairToken = createPairResultToken(first.tag.code, second.tag.code, dateKey);

  return NextResponse.json({
    ok: true,
    signA: first.tag.sign.nameTr,
    signB: second.tag.sign.nameTr,
    slugA: first.tag.sign.slug,
    slugB: second.tag.sign.slug,
    dateKey,
    pairToken,
    result: compatibility,
  });
}
