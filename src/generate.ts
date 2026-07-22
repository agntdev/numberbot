export interface GenerateOptions {
  min: number;
  max: number;
  count: number;
  isDecimal?: boolean;
  isUnique?: boolean;
}

export function generateNumbers(opts: GenerateOptions): number[] {
  const { min, max, count, isDecimal = false, isUnique = false } = opts;
  const results: number[] = [];
  const seen = new Set<number>();

  for (let i = 0; i < count; i++) {
    let n: number;
    if (isDecimal) {
      n = Math.round((Math.random() * (max - min) + min) * 1000) / 1000;
    } else {
      n = Math.floor(Math.random() * (max - min + 1)) + min;
    }

    if (isUnique) {
      const key = isDecimal ? Math.round(n * 1000) : n;
      if (seen.has(key)) {
        i--;
        continue;
      }
      seen.add(key);
    }

    results.push(n);
  }

  return results;
}

export function formatNumbers(numbers: number[], isDecimal: boolean): string {
  if (isDecimal) {
    return numbers.map((n) => n.toFixed(3)).join(", ");
  }
  return numbers.map((n) => String(n)).join(", ");
}
