import { Link } from 'react-router-dom';

// 옵션 1: 그래디언트 로고
export function GradientLogo() {
  return (
    <Link to="/" className="block">
      <div className="flex items-center space-x-2">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-75"></div>
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black text-2xl px-3 py-1 rounded-lg">
            D
          </div>
        </div>
        <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          oguri
        </span>
      </div>
    </Link>
  );
}

// 옵션 2: 모던 미니멀 로고
export function ModernLogo() {
  return (
    <Link to="/" className="block">
      <div className="flex items-center">
        <span className="text-3xl font-black text-gray-900 tracking-tighter">
          do<span className="text-blue-600">guri</span>
        </span>
        <div className="ml-2 w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
      </div>
    </Link>
  );
}

// 옵션 3: 박스 스타일 로고
export function BoxLogo() {
  return (
    <Link to="/" className="block">
      <div className="flex items-center space-x-1">
        <div className="bg-blue-600 text-white font-bold text-xl px-2 py-1 rounded">
          도구
        </div>
        <div className="bg-gray-800 text-white font-bold text-xl px-2 py-1 rounded">
          리
        </div>
      </div>
    </Link>
  );
}

// 옵션 4: 개발자 스타일 로고 (코드 느낌)
export function DevLogo() {
  return (
    <Link to="/" className="block">
      <div className="font-mono">
        <span className="text-gray-400 text-2xl">&lt;</span>
        <span className="text-2xl font-bold text-blue-600">Doguri</span>
        <span className="text-gray-400 text-2xl"> /&gt;</span>
      </div>
    </Link>
  );
}

// 옵션 5: 아이콘과 함께
export function IconLogo() {
  return (
    <Link to="/" className="block">
      <div className="flex items-center space-x-2">
        <div className="relative">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <span className="text-2xl font-bold text-gray-900">
          도구리
        </span>
      </div>
    </Link>
  );
}

// 옵션 6: 네온 효과 로고
export function NeonLogo() {
  return (
    <Link to="/" className="block">
      <div className="relative">
        <span className="text-3xl font-black text-blue-600 tracking-wider"
          style={{
            textShadow: '0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3), 0 0 30px rgba(59, 130, 246, 0.2)'
          }}>
          DOGURI
        </span>
      </div>
    </Link>
  );
}

// 옵션 7: 영어 버전 1 - 소문자 doguri
export function LowercaseLogo() {
  return (
    <Link to="/" className="block">
      <div className="flex items-center space-x-2">
        <span className="text-3xl font-black text-blue-600 tracking-tight">
          doguri
        </span>
        <div className="flex space-x-1">
          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </Link>
  );
}

// 옵션 7-1: 영어 버전 2 - 첫글자 대문자 Doguri
export function CapitalizedLogo() {
  return (
    <Link to="/" className="block">
      <div className="relative">
        <span className="text-3xl font-black tracking-tight">
          <span className="text-blue-600">D</span>
          <span className="text-gray-800">oguri</span>
        </span>
        <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 via-blue-400 to-transparent"></div>
      </div>
    </Link>
  );
}

// 옵션 7-2: 영어 버전 3 - 대문자 DOGURI
export function UppercaseLogo() {
  return (
    <Link to="/" className="block">
      <div className="relative group">
        <span className="text-2xl font-black text-gray-800 tracking-wider hover:text-blue-600 transition-colors">
          DOGURI
        </span>
        <span className="absolute -right-1 -top-1 text-xs font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
          DEV
        </span>
      </div>
    </Link>
  );
}

// 옵션 7-3: 한글 폰트 로고 (Black Han Sans) - 기존 한글 버전
export function KoreanLogo() {
  return (
    <Link to="/" className="block">
      <div className="flex items-center space-x-2">
        <span className="text-3xl text-blue-600" style={{ fontFamily: "'Black Han Sans', sans-serif" }}>
          도구리
        </span>
        <div className="flex space-x-1">
          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </Link>
  );
}

// 옵션 8: Orbitron 테크 스타일
export function TechLogo() {
  return (
    <Link to="/" className="block">
      <div className="relative">
        <span className="text-2xl font-black uppercase tracking-wider"
          style={{ fontFamily: "'Orbitron', monospace" }}>
          <span className="text-gray-900">Do</span>
          <span className="text-blue-600">guri</span>
        </span>
        <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-transparent"></div>
      </div>
    </Link>
  );
}

// 옵션 9: Space Grotesk 미니멀
export function MinimalLogo() {
  return (
    <Link to="/" className="block">
      <div className="flex items-baseline space-x-1">
        <span className="text-3xl font-bold text-gray-900"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          doguri
        </span>
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
          TOOLS
        </span>
      </div>
    </Link>
  );
}

// 옵션 10: Bebas Neue 임팩트
export function ImpactLogo() {
  return (
    <Link to="/" className="block">
      <div className="relative">
        <span className="text-4xl text-gray-900 tracking-wider"
          style={{ fontFamily: "'Bebas Neue', cursive" }}>
          DOGURI
        </span>
        <div className="absolute -bottom-1 left-0 text-xs text-blue-600 font-mono">
          &lt;/&gt; Dev Tools
        </div>
      </div>
    </Link>
  );
}

// 추가 영어 스타일들
// 옵션 11: 모던 그래디언트 영어
export function ModernEnglishLogo() {
  return (
    <Link to="/" className="block">
      <div className="relative">
        <span className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Doguri
        </span>
        <div className="absolute -bottom-2 left-0 text-[10px] font-medium text-gray-500 tracking-widest uppercase">
          Developer Toolkit
        </div>
      </div>
    </Link>
  );
}

// 옵션 12: 타이핑 효과 스타일
export function TypewriterLogo() {
  return (
    <Link to="/" className="block">
      <div className="font-mono">
        <span className="text-2xl font-bold text-gray-900">
          doguri
          <span className="animate-pulse text-blue-600">_</span>
        </span>
      </div>
    </Link>
  );
}

// 옵션 13: 플랫 디자인
export function FlatLogo() {
  return (
    <Link to="/" className="block">
      <div className="flex items-center">
        <div className="bg-blue-600 text-white font-bold text-xl px-3 py-1.5 rounded-l-lg">
          Do
        </div>
        <div className="bg-gray-800 text-white font-bold text-xl px-3 py-1.5 rounded-r-lg">
          guri
        </div>
      </div>
    </Link>
  );
}

// 옵션 14: 미니멀 언더라인
export function UnderlineLogo() {
  return (
    <Link to="/" className="block">
      <div className="relative inline-block">
        <span className="text-3xl font-bold text-gray-900">
          doguri
        </span>
        <div className="absolute bottom-0 left-0 w-full">
          <div className="h-1 bg-blue-600 rounded-full transform origin-left hover:scale-x-110 transition-transform"></div>
        </div>
      </div>
    </Link>
  );
}

// 옵션 15: 3D 효과
export function ThreeDLogo() {
  return (
    <Link to="/" className="block">
      <div className="relative">
        <span
          className="text-3xl font-black text-blue-600 tracking-tight"
          style={{
            textShadow: '2px 2px 0px rgba(0,0,0,0.1), 4px 4px 0px rgba(0,0,0,0.05)'
          }}
        >
          DOGURI
        </span>
      </div>
    </Link>
  );
}

// 기본 내보내기 - 원하는 스타일을 선택하세요
export default CapitalizedLogo;