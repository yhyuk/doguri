import { useState, useRef } from 'react';
import Header from '../../components/Layout/Header';
import Button from '../../components/common/Button';
import {
  convertImage,
  formatFileSize,
  detectFormat,
  calcSizeChange,
  FORMATS,
  type ImageFormat,
  type ConvertedImage,
} from './utils';

export default function ImageConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [sourceFormat, setSourceFormat] = useState<string>('');
  const [targetFormat, setTargetFormat] = useState<ImageFormat>('webp');
  const [quality, setQuality] = useState(92);
  const [result, setResult] = useState<ConvertedImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!selected.type.startsWith('image/')) {
      setError('이미지 파일만 선택할 수 있습니다.');
      return;
    }

    setFile(selected);
    setError('');
    setResult(null);

    const detected = detectFormat(selected.name);
    setSourceFormat(detected || selected.type.split('/')[1]);

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(selected);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type.startsWith('image/')) {
      const fakeEvent = { target: { files: [dropped] } } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(fakeEvent);
    }
  };

  const handleConvert = async () => {
    if (!file) {
      setError('이미지 파일을 선택해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const converted = await convertImage(file, targetFormat, quality / 100);
      setResult(converted);
    } catch (err) {
      setError(err instanceof Error ? err.message : '변환 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;

    const format = FORMATS.find((f) => f.value === targetFormat);
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const url = URL.createObjectURL(result.blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${baseName}${format?.extension || '.png'}`;
    link.click();
    URL.revokeObjectURL(url);

    showToastMsg('파일이 다운로드되었습니다!');
  };

  const handleClear = () => {
    setFile(null);
    setPreview('');
    setSourceFormat('');
    setResult(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const showToastMsg = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const sizeChange = result ? calcSizeChange(result.originalSize, result.convertedSize) : null;

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <Header
        title="이미지 형식 변환"
        description="PNG, JPG, WebP 간 이미지 형식을 변환합니다"
      />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* 파일 업로드 영역 */}
          <div
            className={`bg-white rounded-xl shadow-sm border-2 border-dashed p-8 mb-6 text-center transition-colors ${
              file ? 'border-blue-300 bg-blue-50/30' : 'border-gray-300 hover:border-blue-400'
            }`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            {!file ? (
              <div>
                <div className="text-4xl mb-3 text-gray-400">🖼️</div>
                <p className="text-sm text-gray-600 mb-3">
                  이미지를 드래그 앤 드롭하거나 아래 버튼을 클릭하세요
                </p>
                <p className="text-xs text-gray-500 mb-4">PNG, JPG, WebP 지원</p>
                <Button onClick={() => fileInputRef.current?.click()}>
                  파일 선택
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                {preview && (
                  <img
                    src={preview}
                    alt="미리보기"
                    className="w-24 h-24 object-contain rounded-lg border border-gray-200 bg-white"
                  />
                )}
                <div className="text-left flex-1">
                  <p className="text-sm font-medium text-gray-800">{file.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatFileSize(file.size)} | {sourceFormat.toUpperCase()}
                  </p>
                </div>
                <Button variant="secondary" size="sm" onClick={handleClear}>
                  제거
                </Button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* 변환 옵션 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 타겟 포맷 선택 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">변환 형식</label>
                <div className="flex gap-2">
                  {FORMATS.map((format) => (
                    <button
                      key={format.value}
                      onClick={() => setTargetFormat(format.value)}
                      className={`flex-1 px-4 py-2.5 text-sm rounded-md transition-colors ${
                        targetFormat === format.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {format.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 품질 슬라이더 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  품질: {quality}%
                  {targetFormat === 'png' && (
                    <span className="text-xs text-gray-500 ml-2">(PNG는 무손실이므로 품질 설정 무시)</span>
                  )}
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  disabled={targetFormat === 'png'}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-50"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>낮음 (작은 파일)</span>
                  <span>높음 (좋은 품질)</span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <Button onClick={handleConvert} disabled={!file || loading}>
                {loading ? '변환 중...' : '변환하기'}
              </Button>
            </div>
          </div>

          {/* 에러 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* 변환 결과 */}
          {result && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">변환 결과</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                {/* 미리보기 */}
                <div>
                  <p className="text-xs text-gray-500 mb-2">변환된 이미지</p>
                  <div className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                    <img
                      src={result.dataUrl}
                      alt="변환 결과"
                      className="max-w-full max-h-64 mx-auto object-contain"
                    />
                  </div>
                </div>

                {/* 정보 */}
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500">원본 크기</p>
                        <p className="font-medium text-gray-800">{formatFileSize(result.originalSize)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">변환 후 크기</p>
                        <p className="font-medium text-gray-800">{formatFileSize(result.convertedSize)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">크기 변화</p>
                        <p className={`font-medium ${
                          sizeChange && sizeChange.percent < 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {sizeChange?.label}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">해상도</p>
                        <p className="font-medium text-gray-800">{result.width} x {result.height}</p>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleDownload} className="w-full">
                    다운로드 ({FORMATS.find((f) => f.value === targetFormat)?.label})
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 사용 팁 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
            <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <span className="text-lg">💡</span> 사용 팁
            </h3>
            <ul className="space-y-1 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>WebP는 PNG/JPG보다 파일 크기가 작으면서 좋은 품질을 제공합니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>PNG는 무손실 형식으로, 투명 배경을 지원합니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>JPG로 변환 시 투명 배경은 흰색으로 대체됩니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>모든 변환은 브라우저에서 처리되며 서버로 전송되지 않습니다</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg animate-pulse">
            <p className="text-sm font-medium">{toastMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
