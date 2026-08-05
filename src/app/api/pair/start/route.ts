import { NextResponse } from "next/server";
import { z } from "zod";
import { resolveTag } from "@/lib/nfc/resolve-tag";
import { PAIR_COOKIE_KEY, PAIR_TTL_MS, createPairSession } from "@/lib/nfc/pair-session";
import { createPairToken } from "@/lib/nfc/pair-session-server";

export async function POST(request: Request) {
  const body = z.object({ code: z.string().min(1) }).safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ ok: false, error: "Geçersiz kod." }, { status: 400 });
  }

  const tag = resolveTag(body.data.code);
  if (!tag.ok) return NextResponse.json(tag, { status: 404 });

  const session = createPairSession(tag.tag.code, tag.tag.sign.slug);
  const token = createPairToken(session);

  const res = NextResponse.json({
    ok: true,
    session,
    token,
    ttlMs: PAIR_TTL_MS,
  });

  res.cookies.set(PAIR_COOKIE_KEY, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(PAIR_TTL_MS / 1000),
  });

  return res;
}
