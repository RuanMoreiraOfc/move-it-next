export function CalculateAscendingSequence( limit = 0, callback: ( accumulation: number, index: number ) => number ) {
    const array = new Array(limit).fill(null);
    const result: number = array.reduce( (a, _, i) => callback( a, i ), 0 );

    return result;
}
export function CalculateDecendingSequence( limit = 0, callback: ( accumulation: number, index: number ) => number ) {
    const array = new Array(limit).fill(null);
    const result: number = array.reduceRight( (a, _, i) => callback( a, i ), 0 );

    return result;
}