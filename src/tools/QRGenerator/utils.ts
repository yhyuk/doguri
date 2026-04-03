/**
 * QR 코드 생성 유틸리티
 */

import QRCode from 'qrcode';

export type QRErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';
export type QRCodeSize = 128 | 256 | 512;

export interface QRCodeOptions {
  errorCorrectionLevel?: QRErrorCorrectionLevel;
  width?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
}

/**
 * 입력값 검증
 * @param text QR 코드로 변환할 텍스트
 * @returns 유효성 여부
 */
export function validateInput(text: string): boolean {
  if (!text || text.trim().length === 0) {
    return false;
  }

  // QR 코드는 최대 약 4,296자까지 지원 (숫자 기준)
  if (text.length > 4296) {
    return false;
  }

  return true;
}

/**
 * QR 코드 생성
 * @param text QR 코드로 변환할 텍스트
 * @param options QR 코드 옵션
 * @returns base64 형식의 데이터 URL
 */
export async function generateQRCode(
  text: string,
  options?: QRCodeOptions
): Promise<string> {
  if (!validateInput(text)) {
    throw new Error('유효하지 않은 입력값입니다. 텍스트를 입력해주세요.');
  }

  try {
    const qrOptions: QRCode.QRCodeToDataURLOptions = {
      errorCorrectionLevel: options?.errorCorrectionLevel || 'M',
      width: options?.width || 256,
      margin: options?.margin || 4,
      color: {
        dark: options?.color?.dark || '#000000',
        light: options?.color?.light || '#FFFFFF',
      },
    };

    const dataUrl = await QRCode.toDataURL(text, qrOptions);
    return dataUrl;
  } catch (error) {
    throw new Error('QR 코드 생성 중 오류가 발생했습니다.');
  }
}

/**
 * QR 코드를 파일로 다운로드
 * @param dataUrl base64 데이터 URL
 * @param filename 저장할 파일명 (확장자 제외)
 */
export function downloadQRCode(dataUrl: string, filename: string = 'qrcode'): void {
  if (!dataUrl) {
    throw new Error('다운로드할 QR 코드가 없습니다.');
  }

  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `${filename}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * QR 코드 이미지를 클립보드에 복사
 * @param dataUrl base64 데이터 URL
 */
export async function copyQRCodeToClipboard(dataUrl: string): Promise<void> {
  if (!dataUrl) {
    throw new Error('복사할 QR 코드가 없습니다.');
  }

  try {
    // data URL을 Blob으로 변환
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    // ClipboardItem으로 변환하여 클립보드에 복사
    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob,
      }),
    ]);
  } catch (error) {
    throw new Error('클립보드 복사 중 오류가 발생했습니다.');
  }
}

/**
 * 에러 수정 레벨 설명
 */
export const errorCorrectionLevels = {
  L: { label: 'L (낮음)', description: '약 7% 복구 가능' },
  M: { label: 'M (중간)', description: '약 15% 복구 가능' },
  Q: { label: 'Q (높음)', description: '약 25% 복구 가능' },
  H: { label: 'H (최고)', description: '약 30% 복구 가능' },
} as const;

/**
 * QR 코드 크기 옵션
 */
export const qrCodeSizes = [
  { value: 128, label: '소 (128px)' },
  { value: 256, label: '중 (256px)' },
  { value: 512, label: '대 (512px)' },
] as const;
