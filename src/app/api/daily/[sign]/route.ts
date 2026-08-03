import { NextResponse } from "next/server";
import { getDailyForSign } from "@/lib/daily-reading/get-daily";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ sign: string }> },
) {
  const { sign } = await params;
  const date = new URL(request.url).searchParams.get("date") || undefined;
  const result = getDailyForSign(sign, date ?? new Date());

  return NextResponse.json(result ?? { ok: false, error: "Burç bulunamadı." }, {
    status: result ? 200 : 404,
  });
}
