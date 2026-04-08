import { NavLink, Link } from 'react-router-dom';
import { TOOLS, CATEGORIES } from '../../utils/constants';
import { VERSION, COPYRIGHT_YEAR, COPYRIGHT_HOLDER } from '../../config/version';
// 원하는 로고 스타일을 import하세요
// import { GradientLogo as Logo } from '../Logo'; // 그래디언트 효과
// import { ModernLogo as Logo } from '../Logo'; // 모던 미니멀
// import { BoxLogo as Logo } from '../Logo'; // 박스 스타일
// import { DevLogo as Logo } from '../Logo'; // 개발자 스타일
// import { IconLogo as Logo } from '../Logo'; // 아이콘과 함께
// import { NeonLogo as Logo } from '../Logo'; // 네온 효과

// === 영어 버전 ===
// import { LowercaseLogo as Logo } from '../Logo'; // doguri (소문자)
// import { CapitalizedLogo as Logo } from '../Logo'; // Doguri (첫글자 대문자)
// import { UppercaseLogo as Logo } from '../Logo'; // DOGURI (대문자)
import { TypewriterLogo as Logo } from '../Logo'; // doguri_ (타이핑 효과) - 현재 선택

// === 한글 버전 ===
// import { KoreanLogo as Logo } from '../Logo'; // 도구리 (한글)

// === 특수 폰트 ===
// import { TechLogo as Logo } from '../Logo'; // Orbitron 테크 스타일
// import { MinimalLogo as Logo } from '../Logo'; // Space Grotesk 미니멀
// import { ImpactLogo as Logo } from '../Logo'; // Bebas Neue 임팩트

export default function Sidebar() {
  const toolsByCategory = CATEGORIES.map(category => ({
    ...category,
    tools: TOOLS.filter(tool => tool.category === category.id)
  })).filter(cat => cat.tools.length > 0);

  return (
    <aside className="w-60 bg-gray-50 border-r border-gray-200 h-screen flex flex-col">
      <Link to="/" className="block p-6 border-b border-gray-200 hover:bg-gray-100 transition-colors">
        <Logo />
      </Link>

      <nav className="flex-1 overflow-y-auto p-4">
        {toolsByCategory.map(category => (
          <div key={category.id} className="mb-6">
            <h2 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {category.name}
            </h2>
            <ul className="space-y-1">
              {category.tools.map(tool => (
                <li key={tool.id}>
                  <NavLink
                    to={tool.path}
                    className={({ isActive }) =>
                      `block px-3 py-2 text-sm rounded-md transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-medium border-l-3 border-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    {tool.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* 버전 정보 */}
      <div className="border-t border-gray-200 px-6 py-3 bg-white/50">
        <div className="flex items-center justify-between text-[11px]">
          <Link
            to="/changelog"
            className="flex items-center space-x-2 hover:opacity-70 transition-opacity group"
            title="변경 이력 보기"
          >
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded font-mono group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
              v{VERSION}
            </span>
            <span className="text-[10px] text-gray-400 group-hover:text-blue-500">
              변경 이력
            </span>
          </Link>
          <div className="text-gray-400">
            © {COPYRIGHT_YEAR} {COPYRIGHT_HOLDER}
          </div>
        </div>
      </div>
    </aside>
  );
}