import { useState } from 'react';
import Header from '../../components/Layout/Header';
import Button from '../../components/common/Button';
import TextArea from '../../components/common/TextArea';
import {
  decodeJwt,
  formatTimestamp,
  getExpirationStatus,
  EXAMPLE_JWT,
  CLAIM_DESCRIPTIONS,
  type DecodedJwt,
} from './utils';

export default function JwtDecoder() {
  const [input, setInput] = useState('');
  const [decoded, setDecoded] = useState<DecodedJwt | null>(null);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleDecode = (value?: string) => {
    const token = value ?? input;
    if (!token.trim()) {
      setError('JWT 토큰을 입력해주세요.');
      setDecoded(null);
      return;
    }
    try {
      const result = decodeJwt(token);
      setDecoded(result);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '디코딩 오류가 발생했습니다.');
      setDecoded(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (e.target.value.trim()) {
      handleDecode(e.target.value);
    } else {
      setDecoded(null);
      setError('');
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setToastMessage(`${label}이(가) 복사되었습니다!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setDecoded(null);
    setError('');
  };

  const handleExample = () => {
    setInput(EXAMPLE_JWT);
    handleDecode(EXAMPLE_JWT);
  };

  const expStatus = decoded ? getExpirationStatus(decoded.payload.exp) : null;

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <Header
        title="JWT 디코더"
        description="JWT 토큰을 디코딩하여 Header, Payload, 만료 정보를 확인합니다"
      />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* 입력 영역 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
            <div className="h-[160px]">
              <TextArea
                label="JWT 토큰"
                value={input}
                onChange={handleInputChange}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIi..."
              />
            </div>
            <div className="flex gap-3 mt-4">
              <Button onClick={() => handleDecode()}>디코딩</Button>
              <Button variant="secondary" onClick={handleClear}>지우기</Button>
              <Button variant="secondary" onClick={handleExample}>예제</Button>
            </div>
          </div>

          {/* 에러 표시 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* 디코딩 결과 */}
          {decoded && (
            <>
              {/* 만료 상태 배너 */}
              {expStatus && (
                <div className={`rounded-lg p-4 mb-6 border ${
                  expStatus.color === 'text-red-600'
                    ? 'bg-red-50 border-red-200'
                    : expStatus.color === 'text-yellow-600'
                    ? 'bg-yellow-50 border-yellow-200'
                    : expStatus.color === 'text-green-600'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${expStatus.color}`}>
                      {expStatus.label}
                    </span>
                    {decoded.payload.exp && (
                      <span className="text-sm text-gray-600">
                        만료: {formatTimestamp(decoded.payload.exp)}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-700">Header</h3>
                    <button
                      onClick={() => handleCopy(JSON.stringify(decoded.header, null, 2), 'Header')}
                      className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      복사
                    </button>
                  </div>
                  <pre className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-sm font-mono text-gray-800 overflow-x-auto">
                    {JSON.stringify(decoded.header, null, 2)}
                  </pre>
                </div>

                {/* Payload */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-700">Payload</h3>
                    <button
                      onClick={() => handleCopy(JSON.stringify(decoded.payload, null, 2), 'Payload')}
                      className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      복사
                    </button>
                  </div>
                  <pre className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-sm font-mono text-gray-800 overflow-x-auto">
                    {JSON.stringify(decoded.payload, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Claims 상세 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Claims 상세</h3>
                <div className="divide-y divide-gray-100">
                  {Object.entries(decoded.payload).map(([key, value]) => (
                    <div key={key} className="flex items-center py-2.5 text-sm">
                      <div className="w-24 font-mono font-medium text-blue-700 shrink-0">{key}</div>
                      <div className="w-48 text-gray-500 shrink-0">
                        {CLAIM_DESCRIPTIONS[key] || '커스텀 클레임'}
                      </div>
                      <div className="flex-1 font-mono text-gray-800 break-all">
                        {(key === 'exp' || key === 'iat' || key === 'nbf') && typeof value === 'number'
                          ? `${value} (${formatTimestamp(value)})`
                          : typeof value === 'object'
                          ? JSON.stringify(value)
                          : String(value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Signature */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">Signature</h3>
                  <button
                    onClick={() => handleCopy(decoded.signature, 'Signature')}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    복사
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="font-mono text-sm text-gray-800 break-all">{decoded.signature}</p>
                </div>
              </div>
            </>
          )}

          {/* 사용 팁 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
            <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <span className="text-lg">💡</span> 사용 팁
            </h3>
            <ul className="space-y-1 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>JWT는 Header, Payload, Signature 세 부분으로 구성됩니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>이 도구는 클라이언트에서만 동작하며, 토큰이 외부로 전송되지 않습니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>exp, iat, nbf 클레임은 Unix 타임스탬프로 저장되며 자동으로 날짜로 변환됩니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Signature 검증은 비밀 키가 필요하므로 이 도구에서는 제공하지 않습니다</span>
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
