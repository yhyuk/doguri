import { useState } from 'react';
import Header from '../../components/Layout/Header';
import Button from '../../components/common/Button';
import {
  generateMultipleUUIDs,
  generateMultipleCustomIds,
  generateNanoId,
  removeHyphens,
  toUpperCase
} from './utils';

type IdType = 'uuid' | 'custom' | 'nano';

export default function UuidGenerator() {
  const [idType, setIdType] = useState<IdType>('uuid');
  const [output, setOutput] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [customLength, setCustomLength] = useState(8);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [withHyphens, setWithHyphens] = useState(true);
  const [isUpperCase, setIsUpperCase] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleGenerate = () => {
    try {
      let results: string[] = [];

      if (idType === 'uuid') {
        results = generateMultipleUUIDs(count);
        if (!withHyphens) {
          results = results.map(removeHyphens);
        }
      } else if (idType === 'custom') {
        results = generateMultipleCustomIds(
          count,
          customLength,
          includeUppercase,
          includeLowercase,
          includeNumbers,
          includeSymbols
        );
      } else if (idType === 'nano') {
        results = [];
        for (let i = 0; i < count; i++) {
          results.push(generateNanoId(customLength));
        }
      }

      if (isUpperCase) {
        results = results.map(toUpperCase);
      }

      setOutput(results);
      setToastMessage('ID가 생성되었습니다!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (error) {
      setToastMessage(error instanceof Error ? error.message : 'ID 생성 중 오류가 발생했습니다.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setToastMessage('클립보드에 복사되었습니다!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(output.join('\n'));
    setToastMessage('모든 ID가 클립보드에 복사되었습니다!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleClear = () => {
    setOutput([]);
  };

  const idTypes = [
    { value: 'uuid', label: 'UUID v4' },
    { value: 'custom', label: '커스텀 ID' },
    { value: 'nano', label: 'Nano ID (URL-safe)' }
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <Header
        title="UUID 생성기"
        description="UUID v4, 커스텀 길이 ID, Nano ID를 생성합니다. 원하는 길이와 문자 유형을 선택할 수 있습니다"
      />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* 옵션 패널 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* ID 유형 선택 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">ID 유형</label>
                <div className="flex flex-wrap gap-2">
                  {idTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setIdType(type.value as IdType)}
                      className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                        idType === type.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 생성 개수 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">생성 개수</label>
                <input
                  type="number"
                  value={count}
                  onChange={(e) => setCount(Math.min(1000, Math.max(1, parseInt(e.target.value) || 1)))}
                  min="1"
                  max="1000"
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* ID 길이 (custom/nano) */}
              {(idType === 'custom' || idType === 'nano') && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">ID 길이</label>
                  <input
                    type="number"
                    value={customLength}
                    onChange={(e) => setCustomLength(Math.min(128, Math.max(1, parseInt(e.target.value) || 8)))}
                    min="1"
                    max="128"
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
            </div>

            {/* 커스텀 ID 옵션 */}
            {idType === 'custom' && (
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-700 mb-2 block">포함할 문자 유형</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeUppercase}
                      onChange={(e) => setIncludeUppercase(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mr-2"
                    />
                    <span className="text-sm text-gray-700">대문자 (A-Z)</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeLowercase}
                      onChange={(e) => setIncludeLowercase(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mr-2"
                    />
                    <span className="text-sm text-gray-700">소문자 (a-z)</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeNumbers}
                      onChange={(e) => setIncludeNumbers(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mr-2"
                    />
                    <span className="text-sm text-gray-700">숫자 (0-9)</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeSymbols}
                      onChange={(e) => setIncludeSymbols(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mr-2"
                    />
                    <span className="text-sm text-gray-700">특수문자</span>
                  </label>
                </div>
              </div>
            )}

            {/* UUID 옵션 */}
            {idType === 'uuid' && (
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-700 mb-2 block">UUID 옵션</label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={withHyphens}
                      onChange={(e) => setWithHyphens(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mr-2"
                    />
                    <span className="text-sm text-gray-700">하이픈 포함</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isUpperCase}
                      onChange={(e) => setIsUpperCase(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mr-2"
                    />
                    <span className="text-sm text-gray-700">대문자</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* 생성 버튼 */}
          <div className="flex gap-3 mt-6">
            <Button onClick={handleGenerate}>생성하기</Button>
            <Button variant="secondary" onClick={handleClear}>초기화</Button>
          </div>

          {/* 생성된 ID 목록 */}
          {output.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-gray-700">
                  생성된 ID ({output.length}개)
                </h3>
                {output.length > 1 && (
                  <Button onClick={handleCopyAll} variant="secondary">
                    모두 복사
                  </Button>
                )}
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {output.map((id, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 group hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-mono text-sm text-gray-700 break-all">{id}</span>
                    <button
                      onClick={() => handleCopy(id)}
                      className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                    >
                      복사
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 사용 팁 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 mt-6">
            <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <span className="text-lg">💡</span> 사용 팁
            </h3>
            <ul className="space-y-1 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>UUID v4는 128비트 랜덤 식별자로 충돌 가능성이 거의 없습니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Nano ID는 URL에 안전한 문자만 사용하여 짧고 효율적입니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>커스텀 ID는 원하는 길이와 문자 조합으로 생성할 수 있습니다</span>
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