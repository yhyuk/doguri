export type SpaceRemoverMode =
  | 'all'           // Remove all spaces
  | 'duplicate'     // Remove duplicate spaces (keep single)
  | 'trim'          // Trim start/end spaces
  | 'linebreaks'    // Remove line breaks
  | 'preserve';     // Preserve single spaces between words

/**
 * Remove all spaces from text
 */
export function removeAllSpaces(text: string): string {
  return text.replace(/\s/g, '');
}

/**
 * Remove duplicate spaces, keeping only single spaces
 */
export function removeDuplicateSpaces(text: string): string {
  return text.replace(/\s+/g, ' ');
}

/**
 * Trim spaces from start and end of text
 */
export function trimSpaces(text: string): string {
  return text.trim();
}

/**
 * Remove all line breaks (newlines)
 */
export function removeLineBreaks(text: string): string {
  return text.replace(/[\r\n]+/g, '');
}

/**
 * Preserve single spaces between words, remove others
 * - Removes leading/trailing spaces
 * - Removes duplicate spaces
 * - Keeps single spaces between words
 */
export function preserveSingleSpaces(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
}

/**
 * Process text based on selected mode
 */
export function processText(text: string, mode: SpaceRemoverMode): string {
  if (!text) return '';

  switch (mode) {
    case 'all':
      return removeAllSpaces(text);
    case 'duplicate':
      return removeDuplicateSpaces(text);
    case 'trim':
      return trimSpaces(text);
    case 'linebreaks':
      return removeLineBreaks(text);
    case 'preserve':
      return preserveSingleSpaces(text);
    default:
      return text;
  }
}

/**
 * Count spaces in text
 */
export function countSpaces(text: string): number {
  const matches = text.match(/\s/g);
  return matches ? matches.length : 0;
}

/**
 * Get text statistics
 */
export function getTextStats(text: string) {
  return {
    total: text.length,
    spaces: countSpaces(text),
    nonSpaces: text.length - countSpaces(text),
    lines: text.split(/\r\n|\r|\n/).length
  };
}
