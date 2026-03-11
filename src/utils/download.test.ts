import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { downloadAsFile } from './download';

describe('downloadAsFile', () => {
  let mockCreateObjectURL: ReturnType<typeof vi.fn>;
  let mockRevokeObjectURL: ReturnType<typeof vi.fn>;
  let mockClick: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Mock URL.createObjectURL and URL.revokeObjectURL
    mockCreateObjectURL = vi.fn().mockReturnValue('blob:mock-url');
    mockRevokeObjectURL = vi.fn();

    (globalThis as any).URL.createObjectURL = mockCreateObjectURL;
    (globalThis as any).URL.revokeObjectURL = mockRevokeObjectURL;

    // Mock anchor click
    mockClick = vi.fn();
    vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'a') {
        const anchor = {
          href: '',
          download: '',
          style: { display: '' },
          click: mockClick,
        } as unknown as HTMLAnchorElement;
        return anchor;
      }
      return document.createElement(tagName);
    });

    // Mock appendChild and removeChild
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => null as any);
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => null as any);

    // Use fake timers for setTimeout
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should download a text file with default mime type', () => {
    downloadAsFile('Hello World', 'test.txt');

    expect(mockCreateObjectURL).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'text/plain',
      })
    );
    expect(mockClick).toHaveBeenCalled();
    expect(document.body.appendChild).toHaveBeenCalled();
    expect(document.body.removeChild).toHaveBeenCalled();
  });

  it('should download a JSON file with correct mime type', () => {
    const jsonData = JSON.stringify({ key: 'value' });
    downloadAsFile(jsonData, 'data.json', 'application/json');

    expect(mockCreateObjectURL).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'application/json',
      })
    );
    expect(mockClick).toHaveBeenCalled();
  });

  it('should download a CSV file with correct mime type', () => {
    const csvContent = 'Name,Age\nJohn,30\nJane,25';
    downloadAsFile(csvContent, 'data.csv', 'text/csv');

    expect(mockCreateObjectURL).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'text/csv',
      })
    );
    expect(mockClick).toHaveBeenCalled();
  });

  it('should set correct filename', () => {
    let anchorElement: any;
    vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'a') {
        anchorElement = {
          href: '',
          download: '',
          style: { display: '' },
          click: mockClick,
        };
        return anchorElement as HTMLAnchorElement;
      }
      return document.createElement(tagName);
    });

    downloadAsFile('content', 'myfile.txt');

    expect(anchorElement.download).toBe('myfile.txt');
  });

  it('should revoke object URL after timeout', () => {
    downloadAsFile('content', 'file.txt');

    expect(mockRevokeObjectURL).not.toHaveBeenCalled();

    // Advance timers by 100ms
    vi.advanceTimersByTime(100);

    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });

  it('should create hidden anchor element', () => {
    let anchorElement: any;
    vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'a') {
        anchorElement = {
          href: '',
          download: '',
          style: { display: '' },
          click: mockClick,
        };
        return anchorElement as HTMLAnchorElement;
      }
      return document.createElement(tagName);
    });

    downloadAsFile('content', 'file.txt');

    expect(anchorElement.style.display).toBe('none');
  });

  it('should handle empty content', () => {
    downloadAsFile('', 'empty.txt');

    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalled();
  });

  it('should handle large content', () => {
    const largeContent = 'x'.repeat(1000000); // 1MB of content
    downloadAsFile(largeContent, 'large.txt');

    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalled();
  });

  it('should handle special characters in filename', () => {
    let anchorElement: any;
    vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'a') {
        anchorElement = {
          href: '',
          download: '',
          style: { display: '' },
          click: mockClick,
        };
        return anchorElement as HTMLAnchorElement;
      }
      return document.createElement(tagName);
    });

    downloadAsFile('content', 'file with spaces & special.txt');

    expect(anchorElement.download).toBe('file with spaces & special.txt');
  });

  it('should handle Unicode content', () => {
    const unicodeContent = 'Hello 世界 🌍';
    downloadAsFile(unicodeContent, 'unicode.txt');

    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalled();
  });
});
