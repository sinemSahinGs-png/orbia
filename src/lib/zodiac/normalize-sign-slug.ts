/** Normalize URL burç param (yengeç → yengec). */
export function normalizeSignSlug(raw: string): string {
  return decodeURIComponent(raw)
    .trim()
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ç", "c")
    .replaceAll("ğ", "g")
    .replaceAll("ı", "i")
    .replaceAll("ö", "o")
    .replaceAll("ş", "s")
    .replaceAll("ü", "u");
}
