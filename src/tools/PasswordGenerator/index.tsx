import { useState } from 'react';
import Header from '../../components/Layout/Header';
import Button from '../../components/common/Button';
import {
  generatePassword,
  calculatePasswordStrength,
  getStrengthColor,
  getStrengthText,
  getStrengthProgress,
  type PasswordOptions,
  type PasswordStrength
} from './utils';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState<PasswordStrength | null>(null);
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleGenerate = () => {
    try {
      const options: PasswordOptions = {
        length,
        includeUppercase,
        includeLowercase,
        includeNumbers,
        includeSymbols
      };

      const newPassword = generatePassword(options);
      setPassword(newPassword);
      setStrength(calculatePasswordStrength(newPassword));

      setToastMessage('비밀번호가 생성되었습니다!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (error) {
      setToastMessage(error instanceof Error ? error.message : '비밀번호 생성 중 오류가 발생했습니다.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleCopy = () => {
    if (!password) return;

    navigator.clipboard.writeText(password);
    setToastMessage('클립보드에 복사되었습니다!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleClear = () => {
    setPassword('');
    setStrength(null);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <Header
        title="비밀번호 생성기"
        description="안전하고 강력한 비밀번호를 생성합니다. 길이와 문자 유형을 선택하여 원하는 강도의 비밀번호를 만들 수 있습니다"
      />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* 옵션 패널 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
            {/* 비밀번호 길이 */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">비밀번호 길이</label>
                <span className="text-lg font-semibold text-blue-600">{length}</span>
              </div>
              <input
                type="range"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                min="8"
                max="128"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>8</span>
                <span>128</span>
              </div>
            </div>

            {/* 문자 유형 선택 */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">포함할 문자 유형</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="flex items-center cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={includeUppercase}
                    onChange={(e) => setIncludeUppercase(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mr-3"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-700">대문자</span>
                    <span className="text-xs text-gray-500 ml-2">(A-Z)</span>
                  </div>
                </label>
                <label className="flex items-center cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={includeLowercase}
                    onChange={(e) => setIncludeLowercase(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mr-3"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-700">소문자</span>
                    <span className="text-xs text-gray-500 ml-2">(a-z)</span>
                  </div>
                </label>
                <label className="flex items-center cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mr-3"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-700">숫자</span>
                    <span className="text-xs text-gray-500 ml-2">(0-9)</span>
                  </div>
                </label>
                <label className="flex items-center cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mr-3"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-700">특수문자</span>
                    <span className="text-xs text-gray-500 ml-2">(!@#$%...)</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* 생성 버튼 */}
          <div className="flex gap-3">
            <Button onClick={handleGenerate}>비밀번호 생성</Button>
            <Button variant="secondary" onClick={handleClear}>초기화</Button>
          </div>

          {/* 생성된 비밀번호 표시 */}
          {password && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">생성된 비밀번호</h3>

              {/* 비밀번호 */}
              <div className="mb-4">
                <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                  <span className="font-mono text-lg text-green-400 break-all flex-1">{password}</span>
                  <button
                    onClick={handleCopy}
                    className="ml-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors flex-shrink-0"
                  >
                    복사
                  </button>
                </div>
              </div>

              {/* 비밀번호 강도 */}
              {strength && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">비밀번호 강도</span>
                    <span className={`text-sm font-semibold px-3 py-1 rounded-full border ${getStrengthColor(strength)}`}>
                      {getStrengthText(strength)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        strength === 'weak' ? 'bg-red-500' :
                        strength === 'fair' ? 'bg-orange-500' :
                        strength === 'good' ? 'bg-green-500' :
                        'bg-blue-500'
                      }`}
                      style={{ width: `${getStrengthProgress(strength)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 사용 팁 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 mt-6">
            <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <span className="text-lg">💡</span> 비밀번호 보안 팁
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>최소 12자 이상의 길이를 권장합니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>대문자, 소문자, 숫자, 특수문자를 모두 포함하면 더욱 안전합니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>같은 비밀번호를 여러 서비스에서 재사용하지 마세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>비밀번호 관리자를 사용하여 안전하게 보관하세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>정기적으로 비밀번호를 변경하는 것이 좋습니다</span>
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
