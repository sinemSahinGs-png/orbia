import { createHmac, timingSafeEqual } from "crypto";
import {
  type PairResultTokenPayload,
  type PairSession,
  isPairSessionValid,
} from "@/lib/nfc/pair-session";

function secret() {
  return process.env.PAIR_SIGNING_SECRET || process.env.ORBIA_PAIR_SECRET || "orbia-demo-pair-secret-v1";
}

function b64url(input: string | Buffer) {
  const buf = typeof input === "string" ? Buffer.from(input, "utf8") : input;
  return buf.toString("base64url");
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

/** Signed cookie/session token for pending codeA (10 min). */
export function createPairToken(session: PairSession): string {
  const body = b64url(JSON.stringify(session));
  return `${body}.${sign(body)}`;
}

export function verifyPairToken(token: string): PairSession | null {
  const [body, sig] = token.split(".");
  if (!body || !sig || !safeEqual(sign(body), sig)) return null;
  try {
    const session = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as PairSession;
    if (!session?.firstCode || !isPairSessionValid(session)) return null;
    return session;
  } catch {
    return null;
  }
}

export function createPairResultToken(codeA: string, codeB: string, dateKey: string): string {
  const codes = [codeA.trim().toUpperCase(), codeB.trim().toUpperCase()].sort() as [string, string];
  const payload: PairResultTokenPayload = {
    codes,
    date: dateKey,
    exp: Date.now() + 86_400_000,
  };
  const body = b64url(JSON.stringify(payload));
  return `${body}.${sign(body)}`;
}

export function verifyPairResultToken(token: string): PairResultTokenPayload | null {
  const [body, sig] = token.split(".");
  if (!body || !sig || !safeEqual(sign(body), sig)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as PairResultTokenPayload;
    if (!payload?.codes?.[0] || !payload?.codes?.[1] || !payload.date) return null;
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}
