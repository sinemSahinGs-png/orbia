import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  sign: z.string(),
  phone: z.string().optional(),
  variant: z.string().optional(),
  personalization: z.string().max(120).optional(),
  quantity: z.number().min(1).max(20).optional(),
  note: z.string().max(1000).optional(),
  message: z.string().max(1000).optional(),
});

export async function POST(request: Request) {
  const body = schema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json(
      { ok: false, message: "Lütfen form alanlarını kontrol edin." },
      { status: 400 },
    );
  }

  return NextResponse.json(
    { ok: false, message: "Form backend bağlantısı bekliyor" },
    { status: 503 },
  );
}
