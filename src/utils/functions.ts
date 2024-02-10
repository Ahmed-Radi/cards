/**
 * Slices a given text to a specified length and appends '...' if the text is longer than the specified length.
 * If the text is shorter than the specified length, it returns the original text.
 *
 * @param {string} text - The text to be sliced.
 * @param {number} [length=50] - The length to slice the text to. Default is 50.
 * @returns {string} The sliced text, appended with '...' if original text is longer than the specified length.
 */
export const textSlicer = (text: string, length: number = 80): string => {
  if (text.length >= length) return `${text.slice(0, length)}...`;
  else return text;
};

/**
 *
 * @param {string} number - The numeric string to be formatted.
 * @returns {string} A formatted version of the input numeric string with commas as thousand separators.
 *
 */
export function numberWithCommas(number: string): string {
  return number?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}