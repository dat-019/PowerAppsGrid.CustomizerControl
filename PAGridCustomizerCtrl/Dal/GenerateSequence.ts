/**
 * Generates a number sequence in an incrementing fashion, starting from 0 or @offset, count number of times
 * @param count How many ascending numbers to create (zero based)
 * @param offset Starting offset (zero based)
 * @example ```GenerateSequence(8, 9)``` will create [ 9, 10, 11, 12, 13, 14, 15, 16 ]
 */
export const GenerateSequence = (count: number, offset = 0) =>
    [...Array.from(Array(count).keys()).map(k => k + offset)];