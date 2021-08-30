export type { FixedLengthArrayType };

type FixedLengthArrayType<L extends number, T> = Array<T> & {
  length: L;
};
