import { useState, useMemo } from 'react';
import Header from '../../components/Layout/Header';
import {
  STATUS_CODES,
  CATEGORY_INFO,
  searchStatusCodes,
  filterByCategory,
  type StatusCategory,
  type StatusCode,
} from './utils';

export default function HttpStatusCode() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<StatusCategory | 'all'>('all');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const filtered = useMemo(() => {
    let result = filterByCategory(STATUS_CODES, category);
    result = searchStatusCodes(result, search);
    return result;
  }, [search, category]);

  const handleCopy = (code: StatusCode) => {
    navigator.clipboard.writeText(`${code.code} ${code.name}`);
    setToastMessage(`${code.code} ${code.name} 복사됨!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const toggleExpand = (code: number) => {
    setExpanded(expanded === code ? null : code);
  };

  const categories: { value: StatusCategory | 'all'; label: string }[] = [
    { value: 'all', label: '전체' },
    { value: 'info', label: '1xx 정보' },
    { value: 'success', label: '2xx 성공' },
    { value: 'redirect', label: '3xx 리다이렉션' },
    { value: 'client-error', label: '4xx 클라이언트 오류' },
    { value: 'server-error', label: '5xx 서버 오류' },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <Header
        title="HTTP 상태 코드 사전"
        description="HTTP 상태 코드의 의미와 사용 사례를 검색합니다"
      />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* 검색 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="상태 코드, 이름, 설명으로 검색... (예: 404, timeout, 인증)"
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            {/* 카테고리 필터 */}
            <div className="flex flex-wrap gap-2 mt-4">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    category === cat.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <p className="text-xs text-gray-500 mt-3">
              {filtered.length}개 결과
            </p>
          </div>

          {/* 상태 코드 목록 */}
          <div className="space-y-3">
            {filtered.map((sc) => {
              const catInfo = CATEGORY_INFO[sc.category];
              const isExpanded = expanded === sc.code;

              return (
                <div
                  key={sc.code}
                  className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all ${
                    isExpanded ? 'ring-1 ring-blue-200' : ''
                  }`}
                >
                  <button
                    onClick={() => toggleExpand(sc.code)}
                    className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                  >
                    {/* 상태 코드 */}
                    <span className={`text-2xl font-bold w-16 shrink-0 ${catInfo.color}`}>
                      {sc.code}
                    </span>

                    {/* 이름과 설명 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{sc.name}</span>
                        <span className={`px-2 py-0.5 text-xs rounded-full border ${catInfo.bgColor} ${catInfo.color}`}>
                          {catInfo.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5 truncate">{sc.description}</p>
                    </div>

                    {/* 토글 화살표 */}
                    <span className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>

                  {/* 확장된 상세 정보 */}
                  {isExpanded && (
                    <div className="px-5 pb-4 border-t border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">설명</p>
                          <p className="text-sm text-gray-800">{sc.description}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">사용 사례</p>
                          <p className="text-sm text-gray-800">{sc.useCase}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(sc);
                          }}
                          className="px-3 py-1.5 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors border border-blue-200"
                        >
                          복사
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <p className="text-gray-500 text-sm">검색 결과가 없습니다</p>
              </div>
            )}
          </div>

          {/* 사용 팁 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 mt-6">
            <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <span className="text-lg">💡</span> 사용 팁
            </h3>
            <ul className="space-y-1 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>숫자로 직접 검색하거나, 키워드(인증, 리다이렉트 등)로 검색할 수 있습니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>401(인증)과 403(인가)의 차이: 401은 "누구세요?", 403은 "당신은 접근 불가"입니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>302 vs 307: 302는 메서드가 GET으로 바뀔 수 있고, 307은 원래 메서드를 유지합니다</span>
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
