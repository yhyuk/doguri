export type ImageFormat = 'png' | 'jpeg' | 'webp';

export interface FormatOption {
  value: ImageFormat;
  label: string;
  mimeType: string;
  extension: string;
}

export const FORMATS: FormatOption[] = [
  { value: 'png', label: 'PNG', mimeType: 'image/png', extension: '.png' },
  { value: 'jpeg', label: 'JPG', mimeType: 'image/jpeg', extension: '.jpg' },
  { value: 'webp', label: 'WebP', mimeType: 'image/webp', extension: '.webp' },
];

export interface ConvertedImage {
  dataUrl: string;
  blob: Blob;
  width: number;
  height: number;
  originalSize: number;
  convertedSize: number;
}

/**
 * 이미지 파일을 지정된 형식으로 변환
 */
export function convertImage(
  file: File,
  targetFormat: ImageFormat,
  quality: number = 0.92
): Promise<ConvertedImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas 컨텍스트를 가져올 수 없습니다.'));
          return;
        }

        // JPEG는 투명 배경을 흰색으로 처리
        if (targetFormat === 'jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);

        const format = FORMATS.find((f) => f.value === targetFormat);
        if (!format) {
          reject(new Error('지원하지 않는 형식입니다.'));
          return;
        }

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('이미지 변환에 실패했습니다.'));
              return;
            }

            const dataUrl = canvas.toDataURL(format.mimeType, quality);
            resolve({
              dataUrl,
              blob,
              width: img.width,
              height: img.height,
              originalSize: file.size,
              convertedSize: blob.size,
            });
          },
          format.mimeType,
          quality
        );
      };
      img.onerror = () => reject(new Error('이미지를 로드할 수 없습니다.'));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error('파일을 읽을 수 없습니다.'));
    reader.readAsDataURL(file);
  });
}

/**
 * 파일 크기를 사람이 읽기 좋은 형태로 포맷
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 2)} ${units[i]}`;
}

/**
 * 파일 확장자에서 포맷 감지
 */
export function detectFormat(fileName: string): ImageFormat | null {
  const ext = fileName.toLowerCase().split('.').pop();
  if (ext === 'png') return 'png';
  if (ext === 'jpg' || ext === 'jpeg') return 'jpeg';
  if (ext === 'webp') return 'webp';
  return null;
}

/**
 * 변환 크기 변화율 계산
 */
export function calcSizeChange(original: number, converted: number): { percent: number; label: string } {
  if (original === 0) return { percent: 0, label: '0%' };
  const change = ((converted - original) / original) * 100;
  const sign = change > 0 ? '+' : '';
  return {
    percent: change,
    label: `${sign}${change.toFixed(1)}%`,
  };
}
