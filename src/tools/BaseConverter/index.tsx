import { useState } from 'react';
import Header from '../../components/Layout/Header';
import Button from '../../components/common/Button';
import {
  convertToAll,
  isValidForBase,
  formatBinary,
  formatHex,
  BASES,
  type Base,
} from './utils';

export default function BaseConverter() {
  const [input, setInput] = useState('');
  const [fromBase, setFromBase] = useState<Base>(10);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const results = convertToAll(input, fromBase);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    if (value && !isValidForBase(value, fromBase)) {
      setError(`${fromBase}진수에 유효하지 않은 값입니다.`);
    } else {
      setError('');
    }
  };

  const handleBaseChange = (base: Base) => {
    setFromBase(base);
    if (input && !isValidForBase(input, base)) {
      setError(`${base}진수에 유효하지 않은 값입니다.`);
    } else {
      setError('');
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setToastMessage(`${label} 값이 복사되었습니다!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setError('');
  };

  const handleExample = () => {
    const examples: Record<Base, string> = {
      2: '11010110',
      8: '326',
      10: '214',
      16: 'D6',
    };
    setInput(examples[fromBase]);
    setError('');
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <Header
        title="진법 변환기"
        description="2진수, 8진수, 10진수, 16진수 간 변환을 수행합니다"
      />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* 입력 진법 선택 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
            <label className="text-sm font-medium text-gray-700 mb-3 block">입력 진법</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {BASES.map((base) => (
                <button
                  key={base.value}
                  onClick={() => handleBaseChange(base.value)}
                  className={`px-4 py-2 text-sm rounded-md transition-colors ${
                    fromBase === base.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {base.label}
                </button>
              ))}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">값 입력</label>
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder={`${fromBase}진수 값을 입력하세요`}
                className={`w-full p-3 border rounded-lg font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                }`}
              />
              {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
            </div>

            <div className="flex gap-3 mt-4">
              <Button variant="secondary" onClick={handleClear}>지우기</Button>
              <Button variant="secondary" onClick={handleExample}>예제</Button>
            </div>
          </div>

          {/* 변환 결과 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {BASES.map((base) => {
              const value = results[base.value];
              const displayValue = base.value === 2
                ? formatBinary(value)
                : base.value === 16
                ? formatHex(value)
                : value;
              const isSource = base.value === fromBase;

              return (
                <div
                  key={base.value}
                  className={`bg-white rounded-xl shadow-sm border p-5 ${
                    isSource ? 'border-blue-300 ring-1 ring-blue-200' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-gray-700">{base.label}</h3>
                      {isSource && (
                        <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                          입력
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleCopy(value, base.label)}
                      disabled={!value}
                      className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      복사
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 min-h-[56px] flex items-center">
                    <p className="font-mono text-lg text-gray-800 break-all">
                      {displayValue ? (
                        <>
                          <span className="text-gray-400">{base.prefix}</span>
                          {displayValue}
                        </>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ASCII 표 (16진수 참고용) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">주요 값 참고표</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600 border-b border-gray-200">
                    <th className="pb-2 pr-4">10진수</th>
                    <th className="pb-2 pr-4">2진수</th>
                    <th className="pb-2 pr-4">8진수</th>
                    <th className="pb-2 pr-4">16진수</th>
                    <th className="pb-2">설명</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-gray-800">
                  {[
                    { dec: '0', bin: '0000', oct: '0', hex: '0', desc: '영' },
                    { dec: '8', bin: '1000', oct: '10', hex: '8', desc: '1바이트 절반' },
                    { dec: '16', bin: '0001 0000', oct: '20', hex: '10', desc: '16진수 한 자리 최대+1' },
                    { dec: '127', bin: '0111 1111', oct: '177', hex: '7F', desc: 'signed byte 최대' },
                    { dec: '255', bin: '1111 1111', oct: '377', hex: 'FF', desc: '1바이트 최대' },
                    { dec: '1024', bin: '0100 0000 0000', oct: '2000', hex: '400', desc: '1 KB' },
                    { dec: '65535', bin: '1111 1111 1111 1111', oct: '177777', hex: 'FFFF', desc: '2바이트 최대' },
                  ].map((row) => (
                    <tr key={row.dec} className="border-b border-gray-50">
                      <td className="py-1.5 pr-4">{row.dec}</td>
                      <td className="py-1.5 pr-4">{row.bin}</td>
                      <td className="py-1.5 pr-4">{row.oct}</td>
                      <td className="py-1.5 pr-4">{row.hex}</td>
                      <td className="py-1.5 font-sans text-gray-600">{row.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                <span>0x, 0b, 0o 접두사를 포함하여 입력해도 자동으로 인식합니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>16진수는 대소문자 구분 없이 입력할 수 있습니다 (a-f, A-F)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>2진수 결과는 4비트 단위로, 16진수는 2자리 단위로 그룹화됩니다</span>
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
