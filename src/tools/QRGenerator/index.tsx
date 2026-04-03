import { useState } from 'react';
import Header from '../../components/Layout/Header';
import Button from '../../components/common/Button';
import {
  generateQRCode,
  downloadQRCode,
  copyQRCodeToClipboard,
  errorCorrectionLevels,
  qrCodeSizes,
  type QRErrorCorrectionLevel,
  type QRCodeSize,
} from './utils';

export default function QRGenerator() {
  const [inputText, setInputText] = useState('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [size, setSize] = useState<QRCodeSize>(256);
  const [errorLevel, setErrorLevel] = useState<QRErrorCorrectionLevel>('M');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      showToastMessage('텍스트를 입력해주세요.');
      return;
    }

    setIsGenerating(true);
    try {
      const dataUrl = await generateQRCode(inputText, {
        errorCorrectionLevel: errorLevel,
        width: size,
      });
      setQrCodeDataUrl(dataUrl);
      showToastMessage('QR 코드가 생성되었습니다!');
    } catch (error) {
      showToastMessage(
        error instanceof Error ? error.message : 'QR 코드 생성 중 오류가 발생했습니다.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!qrCodeDataUrl) {
      showToastMessage('먼저 QR 코드를 생성해주세요.');
      return;
    }

    try {
      const filename = inputText.length > 20
        ? `qrcode-${inputText.substring(0, 20)}`
        : `qrcode-${inputText}`;
      downloadQRCode(qrCodeDataUrl, filename.replace(/[^a-zA-Z0-9-_]/g, '_'));
      showToastMessage('QR 코드가 다운로드되었습니다!');
    } catch (error) {
      showToastMessage(
        error instanceof Error ? error.message : '다운로드 중 오류가 발생했습니다.'
      );
    }
  };

  const handleCopyImage = async () => {
    if (!qrCodeDataUrl) {
      showToastMessage('먼저 QR 코드를 생성해주세요.');
      return;
    }

    try {
      await copyQRCodeToClipboard(qrCodeDataUrl);
      showToastMessage('QR 코드가 클립보드에 복사되었습니다!');
    } catch (error) {
      showToastMessage(
        error instanceof Error ? error.message : '복사 중 오류가 발생했습니다.'
      );
    }
  };

  const handleCopyText = () => {
    if (!inputText.trim()) {
      showToastMessage('복사할 텍스트가 없습니다.');
      return;
    }

    navigator.clipboard.writeText(inputText);
    showToastMessage('텍스트가 클립보드에 복사되었습니다!');
  };

  const handleClear = () => {
    setInputText('');
    setQrCodeDataUrl('');
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <Header
        title="QR 코드 생성기"
        description="텍스트나 URL을 입력하여 QR 코드를 생성하고 다운로드할 수 있습니다"
      />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* 입력 패널 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              텍스트 또는 URL 입력
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="QR 코드로 변환할 텍스트나 URL을 입력하세요"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={4}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">
                {inputText.length} / 4,296 자
              </span>
              {inputText && (
                <button
                  onClick={handleCopyText}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  텍스트 복사
                </button>
              )}
            </div>
          </div>

          {/* 옵션 패널 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* QR 코드 크기 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  QR 코드 크기
                </label>
                <div className="flex flex-wrap gap-2">
                  {qrCodeSizes.map((sizeOption) => (
                    <button
                      key={sizeOption.value}
                      onClick={() => setSize(sizeOption.value)}
                      className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                        size === sizeOption.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {sizeOption.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 에러 수정 레벨 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  에러 수정 레벨
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(errorCorrectionLevels).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => setErrorLevel(key as QRErrorCorrectionLevel)}
                      className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                        errorLevel === key
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <div className="text-left">
                        <div className="font-medium">{value.label}</div>
                        <div className="text-xs opacity-80">{value.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 생성 버튼 */}
          <div className="flex gap-3 mb-6">
            <Button onClick={handleGenerate} disabled={isGenerating || !inputText.trim()}>
              {isGenerating ? '생성 중...' : 'QR 코드 생성'}
            </Button>
            <Button variant="secondary" onClick={handleClear}>
              초기화
            </Button>
          </div>

          {/* QR 코드 미리보기 */}
          {qrCodeDataUrl && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-gray-700">QR 코드 미리보기</h3>
                <div className="flex gap-2">
                  <Button onClick={handleCopyImage} variant="secondary" size="sm">
                    이미지 복사
                  </Button>
                  <Button onClick={handleDownload} size="sm">
                    다운로드
                  </Button>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200">
                <img
                  src={qrCodeDataUrl}
                  alt="Generated QR Code"
                  className="max-w-full h-auto"
                  style={{ width: size, height: size }}
                />
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600 break-all max-w-md">
                    {inputText.length > 100
                      ? `${inputText.substring(0, 100)}...`
                      : inputText
                    }
                  </p>
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
                <span>URL, 텍스트, 이메일, 전화번호 등 다양한 정보를 QR 코드로 변환할 수 있습니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>에러 수정 레벨이 높을수록 손상된 QR 코드도 읽을 수 있지만, 코드가 더 복잡해집니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>인쇄하거나 멀리서 스캔할 경우 큰 크기(512px)를 사용하는 것이 좋습니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>웹사이트 URL을 입력할 때는 http:// 또는 https://를 포함해야 합니다</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Toast 메시지 */}
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
