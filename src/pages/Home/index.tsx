import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TOOLS, CATEGORIES } from '../../utils/constants';

const CATEGORY_STYLES: Record<string, { bg: string; iconBg: string; text: string; border: string; hoverBg: string }> = {
  text:       { bg: 'bg-blue-50',   iconBg: 'bg-blue-100',   text: 'text-blue-700',   border: 'border-blue-100',   hoverBg: 'hover:bg-blue-100/60' },
  encoding:   { bg: 'bg-purple-50', iconBg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-100', hoverBg: 'hover:bg-purple-100/60' },
  security:   { bg: 'bg-red-50',    iconBg: 'bg-red-100',    text: 'text-red-700',    border: 'border-red-100',    hoverBg: 'hover:bg-red-100/60' },
  conversion: { bg: 'bg-green-50',  iconBg: 'bg-green-100',  text: 'text-green-700',  border: 'border-green-100',  hoverBg: 'hover:bg-green-100/60' },
  time:       { bg: 'bg-amber-50',  iconBg: 'bg-amber-100',  text: 'text-amber-700',  border: 'border-amber-100',  hoverBg: 'hover:bg-amber-100/60' },
  calculator: { bg: 'bg-teal-50',   iconBg: 'bg-teal-100',   text: 'text-teal-700',   border: 'border-teal-100',   hoverBg: 'hover:bg-teal-100/60' },
  daily:      { bg: 'bg-pink-50',   iconBg: 'bg-pink-100',   text: 'text-pink-700',   border: 'border-pink-100',   hoverBg: 'hover:bg-pink-100/60' },
  developer:  { bg: 'bg-indigo-50', iconBg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-100', hoverBg: 'hover:bg-indigo-100/60' },
};

export default function Home() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    let result = TOOLS;

    if (activeCategory !== 'all') {
      result = result.filter((tool) => tool.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (tool) =>
          tool.name.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q) ||
          tool.id.toLowerCase().includes(q)
      );
    }

    return result;
  }, [search, activeCategory]);

  const getCategoryInfo = (categoryId: string) => {
    return CATEGORIES.find((c) => c.id === categoryId);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">도구리</h1>
          <p className="text-sm text-gray-500 mb-5">
            개발자와 비개발자 모두를 위한 유용한 도구 모음 ({TOOLS.length}개)
          </p>

          {/* 검색 */}
          <div className="relative mb-4">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="도구 검색..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
              >
                ✕
              </button>
            )}
          </div>

          {/* 카테고리 탭 */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                activeCategory === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              전체
            </button>
            {CATEGORIES.map((cat) => {
              const style = CATEGORY_STYLES[cat.id];
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? `${style.iconBg} ${style.text} font-medium`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-xs">{cat.icon}</span>
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 도구 그리드 */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-5xl mx-auto">
          {filtered.length > 0 ? (
            activeCategory === 'all' && !search ? (
              // 카테고리별 그룹
              CATEGORIES.map((cat) => {
                const tools = filtered.filter((t) => t.category === cat.id);
                if (tools.length === 0) return null;
                const style = CATEGORY_STYLES[cat.id];
                return (
                  <div key={cat.id} className="mb-8">
                    <div className="flex items-center gap-2 mb-3">
                      <span>{cat.icon}</span>
                      <h2 className={`text-sm font-semibold ${style.text}`}>
                        {cat.name}
                      </h2>
                      <span className="text-xs text-gray-400">({tools.length})</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {tools.map((tool) => (
                        <ToolCard
                          key={tool.id}
                          name={tool.name}
                          description={tool.description}
                          categoryId={tool.category}
                          onClick={() => navigate(tool.path)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              // 검색/필터 결과
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filtered.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    name={tool.name}
                    description={tool.description}
                    categoryId={tool.category}
                    onClick={() => navigate(tool.path)}
                  />
                ))}
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-sm">검색 결과가 없습니다</p>
              <button
                onClick={() => {
                  setSearch('');
                  setActiveCategory('all');
                }}
                className="mt-3 text-sm text-blue-600 hover:text-blue-700"
              >
                필터 초기화
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ToolCard({
  name,
  description,
  categoryId,
  onClick,
}: {
  name: string;
  description: string;
  categoryId: string;
  onClick: () => void;
}) {
  const style = CATEGORY_STYLES[categoryId] || CATEGORY_STYLES.text;

  return (
    <button
      onClick={onClick}
      className={`text-left p-4 rounded-xl border transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-95 bg-white ${style.border} ${style.hoverBg}`}
    >
      <p className={`text-sm font-semibold ${style.text} mb-1`}>{name}</p>
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{description}</p>
    </button>
  );
}
