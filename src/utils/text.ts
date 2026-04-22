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

export function deterministicEmbedding(input: string, dimensions = 384): number[] {
  const vector = new Array<number>(dimensions).fill(0);
  const words = normalizeWords(input);

  if (!words.length) {
    return vector;
  }

  for (const word of words) {
    for (let index = 0; index < word.length; index += 1) {
      const code = word.charCodeAt(index);
      const slot = (code + index * 31) % dimensions;
      vector[slot] += 1;
    }
  }

  const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
  if (magnitude === 0) {
    return vector;
  }

  return vector.map((value) => Number((value / magnitude).toFixed(6)));
}
