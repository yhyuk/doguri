import { useState, useEffect } from 'react';
import Header from '../../components/Layout/Header';
import Button from '../../components/common/Button';
import {
  hexToRgb,
  hexToHsl,
  validateHex,
  generateRandomColor
} from './utils';

export default function ColorPicker() {
  const [color, setColor] = useState('#3B82F6');
  const [hexInput, setHexInput] = useState('#3B82F6');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // color가 변경될 때 hexInput도 업데이트
  useEffect(() => {
    setHexInput(color);
  }, [color]);

  const handleColorChange = (newColor: string) => {
    if (validateHex(newColor)) {
      setColor(newColor.toUpperCase());
      setHexInput(newColor.toUpperCase());
    }
  };

  const handleHexInputChange = (value: string) => {
    setHexInput(value);

    // # 없이 입력한 경우 자동으로 추가
    const hexValue = value.startsWith('#') ? value : `#${value}`;

    if (validateHex(hexValue)) {
      setColor(hexValue.toUpperCase());
    }
  };

  const handleRandomColor = () => {
    const randomColor = generateRandomColor();
    setColor(randomColor);
    setHexInput(randomColor);
    showToastMessage('랜덤 색상이 생성되었습니다!');
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToastMessage(`${label}이(가) 클립보드에 복사되었습니다!`);
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // RGB 계산
  const rgb = hexToRgb(color);
  const rgbString = rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : 'N/A';

  // HSL 계산
  const hsl = hexToHsl(color);
  const hslString = hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : 'N/A';

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <Header
        title="색상 피커"
        description="HEX, RGB, HSL 형식 간 색상 변환 도구입니다. 원하는 색상을 선택하고 다양한 형식으로 확인할 수 있습니다"
      />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* 색상 선택 패널 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 색상 선택기 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  색상 선택
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={hexInput}
                      onChange={(e) => handleHexInputChange(e.target.value)}
                      placeholder="#000000"
                      className={`w-full px-4 py-2 text-lg font-mono border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                        validateHex(hexInput.startsWith('#') ? hexInput : `#${hexInput}`)
                          ? 'border-gray-300 focus:border-blue-500'
                          : 'border-red-300 focus:border-red-500'
                      }`}
                    />
                    {!validateHex(hexInput.startsWith('#') ? hexInput : `#${hexInput}`) && hexInput && (
                      <p className="text-xs text-red-500 mt-1">유효하지 않은 HEX 값입니다</p>
                    )}
                  </div>
                </div>
              </div>

              {/* 랜덤 버튼 */}
              <div className="flex items-end">
                <Button onClick={handleRandomColor} className="w-full">
                  랜덤 색상 생성
                </Button>
              </div>
            </div>
          </div>

          {/* 색상 미리보기 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">미리보기</h3>
            <div
              className="w-full h-48 rounded-lg border-2 border-gray-300 shadow-inner"
              style={{ backgroundColor: color }}
            />
          </div>

          {/* 색상 값 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* HEX 카드 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700">HEX</h3>
                <button
                  onClick={() => handleCopy(color, 'HEX 값')}
                  className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                >
                  복사
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="font-mono text-lg text-gray-800 text-center break-all">
                  {color}
                </p>
              </div>
            </div>

            {/* RGB 카드 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700">RGB</h3>
                <button
                  onClick={() => handleCopy(rgbString, 'RGB 값')}
                  className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                >
                  복사
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="font-mono text-sm text-gray-800 text-center break-all">
                  {rgbString}
                </p>
                {rgb && (
                  <div className="mt-2 text-xs text-gray-600 space-y-1">
                    <p className="text-center">R: {rgb.r} / G: {rgb.g} / B: {rgb.b}</p>
                  </div>
                )}
              </div>
            </div>

            {/* HSL 카드 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700">HSL</h3>
                <button
                  onClick={() => handleCopy(hslString, 'HSL 값')}
                  className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                >
                  복사
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="font-mono text-sm text-gray-800 text-center break-all">
                  {hslString}
                </p>
                {hsl && (
                  <div className="mt-2 text-xs text-gray-600 space-y-1">
                    <p className="text-center">H: {hsl.h}° / S: {hsl.s}% / L: {hsl.l}%</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CSS 코드 예제 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">CSS 사용 예제</h3>
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium text-gray-600">HEX</p>
                  <button
                    onClick={() => handleCopy(`color: ${color};`, 'CSS 코드')}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    복사
                  </button>
                </div>
                <code className="text-sm font-mono text-gray-800">
                  color: {color};
                </code>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium text-gray-600">RGB</p>
                  <button
                    onClick={() => handleCopy(`color: ${rgbString};`, 'CSS 코드')}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    복사
                  </button>
                </div>
                <code className="text-sm font-mono text-gray-800">
                  color: {rgbString};
                </code>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium text-gray-600">HSL</p>
                  <button
                    onClick={() => handleCopy(`color: ${hslString};`, 'CSS 코드')}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    복사
                  </button>
                </div>
                <code className="text-sm font-mono text-gray-800">
                  color: {hslString};
                </code>
              </div>
            </div>
          </div>

          {/* 사용 팁 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
            <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <span className="text-lg">💡</span> 사용 팁
            </h3>
            <ul className="space-y-1 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>HEX는 웹 디자인에서 가장 일반적으로 사용되는 색상 형식입니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>RGB는 빨강(Red), 녹색(Green), 파랑(Blue)의 강도를 0-255로 표현합니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>HSL은 색조(Hue), 채도(Saturation), 명도(Lightness)로 색상을 직관적으로 조정할 수 있습니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>복사 버튼을 클릭하여 각 형식의 색상 값을 클립보드에 복사할 수 있습니다</span>
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
