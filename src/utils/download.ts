/**
 * Download content as a file
 * Creates a temporary anchor element to trigger the download
 *
 * @param content - The content to download
 * @param filename - Name of the file to download
 * @param mimeType - MIME type of the content (defaults to 'text/plain')
 *
 * @example
 * downloadAsFile('Hello World', 'greeting.txt')
 * downloadAsFile(JSON.stringify(data), 'data.json', 'application/json')
 * downloadAsFile(csvContent, 'export.csv', 'text/csv')
 */
export function downloadAsFile(
  content: string,
  filename: string,
  mimeType: string = 'text/plain'
): void {
  try {
    // Create a Blob with the content
    const blob = new Blob([content], { type: mimeType });

    // Create object URL
    const url = URL.createObjectURL(blob);

    // Create temporary anchor element
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.style.display = 'none';

    // Append to body, click, and remove
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    // Clean up the object URL after a short delay
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('Failed to download file:', error);
    throw new Error(`Failed to download file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
