export const PAIR_TTL_MS = 600_000;
export const PAIR_STORAGE_KEY = "astra-key-pair";
export const PAIR_COOKIE_KEY = "astra-key-pair";

export type PairSession = {
  firstCode: string;
  firstSign: string;
  startedAt: number;
  expiresAt: number;
};

export type PairResultTokenPayload = {
  codes: [string, string];
  date: string;
  exp: number;
};

export const isPairSessionActive = (s: PairSession) => s.expiresAt > Date.now();
export const isPairSessionValid = isPairSessionActive;

export const createPairSession = (firstCode: string, firstSign: string): PairSession => ({
  firstCode: firstCode.trim().toUpperCase(),
  firstSign,
  startedAt: Date.now(),
  expiresAt: Date.now() + PAIR_TTL_MS,
});

/** Legacy unsigned JSON session from localStorage / client cookie. */
export function parseLegacyPairSession(raw: string): PairSession | null {
  try {
    const session = JSON.parse(raw) as PairSession;
    if (!session?.firstCode || !isPairSessionValid(session)) return null;
    return session;
  } catch {
    return null;
  }
}
