export function normalizeWords(input: string): string[] {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export function scoreTextSimilarity(a: string, b: string): number {
  const aWords = new Set(normalizeWords(a));
  const bWords = new Set(normalizeWords(b));

  if (aWords.size === 0 || bWords.size === 0) {
    return 0;
  }

  let overlap = 0;
  for (const word of aWords) {
    if (bWords.has(word)) {
      overlap += 1;
    }
  }

  return overlap / Math.max(aWords.size, bWords.size);
}
