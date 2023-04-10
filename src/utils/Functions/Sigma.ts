export { kSigma, kSquaredSigma, kCubedSigma };

const getSigmaEvaluator =
  (fn: (n: number) => number) =>
  ({ n, k = 1 }: { n: number; k?: number }) => {
    if (n < k) return 0;
    return fn(n) - fn(k - 1);
  };

/** Σ(k) from `k=1` up to `n` */
const kSigma = getSigmaEvaluator(
  (n: number) => (n * (n + 1)) / 2, //
);

/** Σ(k²) from `k=1` up to `n` */
const kSquaredSigma = getSigmaEvaluator(
  (n: number) => (n * (n + 1) * (2 * n + 1)) / 6,
);

/** Σ(k³) from `k=1` up to `n` */
const kCubedSigma = getSigmaEvaluator(
  (n: number) => kSigma({ n }) ** 2, //
);
