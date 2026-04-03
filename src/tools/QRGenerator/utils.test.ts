import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  validateInput,
  generateQRCode,
  downloadQRCode,
  copyQRCodeToClipboard,
} from './utils';

// QRCode 모듈 모킹
vi.mock('qrcode', () => ({
  default: {
    toDataURL: vi.fn((text: string) => {
      if (!text) throw new Error('Invalid input');
      return Promise.resolve(`data:image/png;base64,mockQRCode_${text}`);
    }),
  },
}));

describe('QRGenerator utils', () => {
  describe('validateInput', () => {
    it('유효한 텍스트를 검증해야 함', () => {
      expect(validateInput('Hello World')).toBe(true);
      expect(validateInput('https://example.com')).toBe(true);
      expect(validateInput('12345')).toBe(true);
    });

    it('빈 문자열을 거부해야 함', () => {
      expect(validateInput('')).toBe(false);
      expect(validateInput('   ')).toBe(false);
    });

    it('null이나 undefined를 거부해야 함', () => {
      expect(validateInput(null as any)).toBe(false);
      expect(validateInput(undefined as any)).toBe(false);
    });

    it('너무 긴 텍스트를 거부해야 함', () => {
      const longText = 'a'.repeat(4297);
      expect(validateInput(longText)).toBe(false);
    });

    it('최대 길이 이하의 텍스트를 허용해야 함', () => {
      const maxText = 'a'.repeat(4296);
      expect(validateInput(maxText)).toBe(true);
    });
  });

  describe('generateQRCode', () => {
    it('유효한 텍스트로 QR 코드를 생성해야 함', async () => {
      const result = await generateQRCode('Test text');
      expect(result).toBe('data:image/png;base64,mockQRCode_Test text');
    });

    it('빈 텍스트에 대해 에러를 발생시켜야 함', async () => {
      await expect(generateQRCode('')).rejects.toThrow(
        '유효하지 않은 입력값입니다. 텍스트를 입력해주세요.'
      );
    });

    it('옵션을 적용하여 QR 코드를 생성해야 함', async () => {
      const options = {
        errorCorrectionLevel: 'H' as const,
        width: 512,
        margin: 2,
        color: {
          dark: '#FF0000',
          light: '#FFFFFF',
        },
      };

      const result = await generateQRCode('Test', options);
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });
  });

  describe('downloadQRCode', () => {
    let createElementSpy: any;
    let appendChildSpy: any;
    let removeChildSpy: any;
    let clickSpy: any;

    beforeEach(() => {
      clickSpy = vi.fn();
      const mockLink = {
        href: '',
        download: '',
        click: clickSpy,
      };

      createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
      appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink as any);
      removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink as any);
    });

    it('QR 코드를 다운로드해야 함', () => {
      const dataUrl = 'data:image/png;base64,test';
      downloadQRCode(dataUrl, 'test-qr');

      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(appendChildSpy).toHaveBeenCalled();
      expect(clickSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
    });

    it('기본 파일명으로 다운로드해야 함', () => {
      const dataUrl = 'data:image/png;base64,test';
      downloadQRCode(dataUrl);

      expect(clickSpy).toHaveBeenCalled();
    });

    it('빈 데이터 URL에 대해 에러를 발생시켜야 함', () => {
      expect(() => downloadQRCode('')).toThrow('다운로드할 QR 코드가 없습니다.');
    });
  });

  describe('copyQRCodeToClipboard', () => {
    beforeEach(() => {
      // fetch와 clipboard API 모킹
      global.fetch = vi.fn(() =>
        Promise.resolve({
          blob: () => Promise.resolve(new Blob(['mock'], { type: 'image/png' })),
        } as Response)
      );

      // ClipboardItem 생성자 모킹
      global.ClipboardItem = class ClipboardItem {
        items: any;
        constructor(items: any) {
          this.items = items;
        }
      } as any;

      Object.assign(navigator, {
        clipboard: {
          write: vi.fn(() => Promise.resolve()),
        },
      });
    });

    it('QR 코드를 클립보드에 복사해야 함', async () => {
      const dataUrl = 'data:image/png;base64,test';
      await copyQRCodeToClipboard(dataUrl);

      expect(global.fetch).toHaveBeenCalledWith(dataUrl);
      expect(navigator.clipboard.write).toHaveBeenCalled();
    });

    it('빈 데이터 URL에 대해 에러를 발생시켜야 함', async () => {
      await expect(copyQRCodeToClipboard('')).rejects.toThrow(
        '복사할 QR 코드가 없습니다.'
      );
    });

    it('클립보드 API 실패 시 에러를 발생시켜야 함', async () => {
      Object.assign(navigator, {
        clipboard: {
          write: vi.fn(() => Promise.reject(new Error('Clipboard error'))),
        },
      });

      const dataUrl = 'data:image/png;base64,test';
      await expect(copyQRCodeToClipboard(dataUrl)).rejects.toThrow(
        '클립보드 복사 중 오류가 발생했습니다.'
      );
    });
  });
});
