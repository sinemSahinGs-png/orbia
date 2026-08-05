/** Deterministic celestial signature geometry from date + sign. */

export type CelestialSignatureParams = {
  orbitR: number;
  arcA: number;
  arcB: number;
  arcC: number;
  moonAngle: number;
  lineA: string;
  lineB: string;
  glyphScale: number;
};

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h = Math.imul(h ^ input.charCodeAt(i), 16777619);
  }
  return h >>> 0;
}

function unit(n: number, shift: number): number {
  return ((n >>> shift) & 0xff) / 255;
}

export function createDailyCelestialSignature(
  dateKey: string,
  signSlug: string,
  energy: number,
  illumination: number,
): CelestialSignatureParams {
  const seed = hashSeed(`${dateKey}:${signSlug}`);
  const e = Math.min(100, Math.max(0, energy)) / 100;
  const illum = Math.min(1, Math.max(0, illumination));

  const cx = 50;
  const cy = 50;
  const orbitR = 28 + unit(seed, 0) * 8 + e * 6;
  const moonAngle = unit(seed, 8) * Math.PI * 2;
  const mx = cx + Math.cos(moonAngle) * (orbitR + 6);
  const my = cy + Math.sin(moonAngle) * (orbitR + 6);

  const p1x = 18 + unit(seed, 16) * 14;
  const p1y = 22 + unit(seed, 20) * 20;
  const p2x = 70 + unit(seed, 24) * 16;
  const p2y = 18 + unit(seed, 28) * 24;

  return {
    orbitR,
    arcA: 0.35 + e * 0.55,
    arcB: 0.25 + illum * 0.5,
    arcC: 0.2 + unit(seed, 4) * 0.55,
    moonAngle,
    lineA: `M ${p1x.toFixed(1)} ${p1y.toFixed(1)} Q ${cx} ${(cy - 8).toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`,
    lineB: `M ${p2x.toFixed(1)} ${p2y.toFixed(1)} Q ${cx} ${(cy + 10).toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`,
    glyphScale: 0.85 + unit(seed, 12) * 0.25,
  };
}
