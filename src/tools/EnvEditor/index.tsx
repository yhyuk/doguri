import { useState, useMemo } from 'react';
import Header from '../../components/Layout/Header';
import Button from '../../components/common/Button';
import TextArea from '../../components/common/TextArea';
import {
  parseEnv,
  sortEnv,
  maskValue,
  generateExample,
  removeDuplicates,
  EXAMPLE_ENV,
} from './utils';

export default function EnvEditor() {
  const [input, setInput] = useState('');
  const [isMasked, setIsMasked] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const parsed = useMemo(() => parseEnv(input), [input]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToastMsg(`${label}이(가) 복사되었습니다!`);
  };

  const handleSort = () => {
    setInput(sortEnv(input));
    showToastMsg('키가 알파벳 순으로 정렬되었습니다!');
  };

  const handleRemoveDuplicates = () => {
    setInput(removeDuplicates(input));
    showToastMsg('중복 키가 제거되었습니다!');
  };

  const handleGenerateExample = () => {
    const example = generateExample(input);
    handleCopy(example, '.env.example');
  };

  const handleClear = () => {
    setInput('');
    setIsMasked(false);
  };

  const handleExample = () => {
    setInput(EXAMPLE_ENV);
  };

  const showToastMsg = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <Header
        title=".env 편집기"
        description="환경 변수 파일을 정리하고, 중복 검사, 마스킹, 정렬 기능을 제공합니다"
      />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* 통계 바 */}
          {input && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="bg-white rounded-lg border border-gray-200 px-4 py-3 text-center">
                <p className="text-2xl font-bold text-blue-600">{parsed.totalKeys}</p>
                <p className="text-xs text-gray-500">환경 변수</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 px-4 py-3 text-center">
                <p className="text-2xl font-bold text-gray-600">{parsed.commentCount}</p>
                <p className="text-xs text-gray-500">주석</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 px-4 py-3 text-center">
                <p className={`text-2xl font-bold ${parsed.duplicates.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {parsed.duplicates.length}
                </p>
                <p className="text-xs text-gray-500">중복 키</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 px-4 py-3 text-center">
                <p className="text-2xl font-bold text-gray-600">{parsed.emptyCount}</p>
                <p className="text-xs text-gray-500">빈 줄</p>
              </div>
            </div>
          )}

          {/* 중복 경고 */}
          {parsed.duplicates.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-800">중복 키 발견!</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    {parsed.duplicates.join(', ')}
                  </p>
                </div>
                <Button size="sm" onClick={handleRemoveDuplicates}>
                  중복 제거
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* 입력 영역 */}
            <div className="flex flex-col">
              <div className="h-[400px]">
                <TextArea
                  label=".env 내용"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="KEY=VALUE 형식의 환경 변수를 입력하세요..."
                />
              </div>
              <div className="flex flex-wrap gap-3 mt-4">
                <Button variant="secondary" onClick={handleClear}>지우기</Button>
                <Button variant="secondary" onClick={handleExample}>예제</Button>
                <Button variant="secondary" onClick={handleSort}>키 정렬</Button>
                <Button variant="secondary" onClick={() => handleCopy(input, '.env')}>복사</Button>
                <Button variant="secondary" onClick={handleGenerateExample}>.env.example 복사</Button>
              </div>
            </div>

            {/* 테이블 뷰 */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">파싱 결과</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isMasked}
                    onChange={(e) => setIsMasked(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">값 마스킹</span>
                </label>
              </div>
              <div className="flex-1 border border-gray-200 rounded-lg bg-white overflow-auto max-h-[400px]">
                {parsed.entries.filter((e) => !e.isEmpty && !e.isComment).length > 0 ? (
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-4 py-2 text-gray-600 font-medium">줄</th>
                        <th className="text-left px-4 py-2 text-gray-600 font-medium">키</th>
                        <th className="text-left px-4 py-2 text-gray-600 font-medium">값</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsed.entries
                        .filter((e) => !e.isEmpty && !e.isComment)
                        .map((entry, idx) => (
                          <tr
                            key={idx}
                            className={`border-b border-gray-50 ${
                              entry.isDuplicate ? 'bg-yellow-50' : ''
                            }`}
                          >
                            <td className="px-4 py-2 text-gray-400 font-mono text-xs">{entry.line}</td>
                            <td className="px-4 py-2 font-mono font-medium text-blue-700">
                              {entry.key}
                              {entry.isDuplicate && (
                                <span className="ml-2 px-1.5 py-0.5 text-xs bg-yellow-200 text-yellow-800 rounded">
                                  중복
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-2 font-mono text-gray-800 break-all">
                              {isMasked ? maskValue(entry.value) : entry.value}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex items-center justify-center h-full text-sm text-gray-400 p-8">
                    .env 내용을 입력하면 파싱 결과가 표시됩니다
                  </div>
                )}
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
                <span>중복 키가 발견되면 자동으로 경고하며, 마지막 값을 유지하면서 제거할 수 있습니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>"값 마스킹"을 켜면 민감한 정보를 가린 상태로 확인할 수 있습니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>".env.example 복사"로 값이 비어있는 템플릿을 생성할 수 있습니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>모든 처리는 브라우저에서만 이루어지며, 서버로 전송되지 않습니다</span>
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
