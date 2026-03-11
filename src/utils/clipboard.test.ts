import { describe, it, expect, beforeEach, vi } from 'vitest';
import { copyToClipboard } from './clipboard';

describe('copyToClipboard', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';
  });

  it('should copy text using Clipboard API when available', async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    });

    const result = await copyToClipboard('test text');

    expect(result).toBe(true);
    expect(mockWriteText).toHaveBeenCalledWith('test text');
  });

  it('should fallback to execCommand when Clipboard API is not available', async () => {
    // Remove Clipboard API
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      writable: true,
    });

    const mockExecCommand = vi.fn().mockReturnValue(true);
    document.execCommand = mockExecCommand;

    const result = await copyToClipboard('fallback text');

    expect(result).toBe(true);
    expect(mockExecCommand).toHaveBeenCalledWith('copy');
    // Verify textarea was removed
    expect(document.querySelector('textarea')).toBeNull();
  });

  it('should return false when execCommand fails', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      writable: true,
    });

    const mockExecCommand = vi.fn().mockReturnValue(false);
    document.execCommand = mockExecCommand;

    const result = await copyToClipboard('fail text');

    expect(result).toBe(false);
    expect(document.querySelector('textarea')).toBeNull();
  });

  it('should return false when execCommand throws error', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      writable: true,
    });

    const mockExecCommand = vi.fn().mockImplementation(() => {
      throw new Error('execCommand failed');
    });
    document.execCommand = mockExecCommand;

    const result = await copyToClipboard('error text');

    expect(result).toBe(false);
    expect(document.querySelector('textarea')).toBeNull();
  });

  it('should return false when Clipboard API throws error', async () => {
    const mockWriteText = vi.fn().mockRejectedValue(new Error('Clipboard failed'));
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    });

    const result = await copyToClipboard('error text');

    expect(result).toBe(false);
  });
});
