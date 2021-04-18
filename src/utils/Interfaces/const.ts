export interface FixedLengthArray<L extends number, T> extends Array<T> {
    length: L
}