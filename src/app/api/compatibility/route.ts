import { NextResponse } from "next/server";
import { z } from "zod";
import { getCompatibility } from "@/lib/astrology/compatibility-engine";

const schema = z.object({
  signA: z.string(),
  signB: z.string(),
  date: z.string().optional(),
});

export async function POST(request: Request) {
  const body = schema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ ok: false, error: "Geçersiz istek." }, { status: 400 });
  }

  const result = getCompatibility(body.data.signA, body.data.signB, body.data.date);
  return NextResponse.json(
    result ? { ok: true, result } : { ok: false, error: "Burç bulunamadı." },
    { status: result ? 200 : 404 },
  );
}
