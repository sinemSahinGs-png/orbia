import { NextResponse } from "next/server";
import { z } from "zod";
import { resolveTag } from "@/lib/nfc/resolve-tag";
import { createPairSession, createPairToken, PAIR_TTL_MS } from "@/lib/nfc/pair-session";

export async function POST(request: Request) {
  const body = z.object({ code: z.string() }).safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ ok: false, error: "Geçersiz kod." }, { status: 400 });
  }

  const tag = resolveTag(body.data.code);
  if (!tag.ok) return NextResponse.json(tag, { status: 404 });

  const session = createPairSession(tag.tag.code, tag.tag.sign.slug);
  return NextResponse.json({
    ok: true,
    session,
    token: createPairToken(session),
    ttlMs: PAIR_TTL_MS,
  });
}
