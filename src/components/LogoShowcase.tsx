import {
  GradientLogo,
  ModernLogo,
  BoxLogo,
  DevLogo,
  IconLogo,
  NeonLogo,
  LowercaseLogo,
  CapitalizedLogo,
  UppercaseLogo,
  KoreanLogo,
  TechLogo,
  MinimalLogo,
  ImpactLogo,
  ModernEnglishLogo,
  TypewriterLogo,
  FlatLogo,
  UnderlineLogo,
  ThreeDLogo
} from './Logo';

export default function LogoShowcase() {
  const logos = [
    { Component: LowercaseLogo, name: 'LowercaseLogo', desc: 'doguri (소문자) - 친근하고 캐주얼' },
    { Component: CapitalizedLogo, name: 'CapitalizedLogo', desc: 'Doguri (첫글자 대문자) - 파란 D + 그래디언트 언더라인' },
    { Component: UppercaseLogo, name: 'UppercaseLogo', desc: 'DOGURI (대문자) + DEV 뱃지' },
    { Component: ModernEnglishLogo, name: 'ModernEnglishLogo', desc: '그래디언트 텍스트 + Developer Toolkit' },
    { Component: TypewriterLogo, name: 'TypewriterLogo', desc: 'doguri_ 타이핑 커서 효과' },
    { Component: FlatLogo, name: 'FlatLogo', desc: 'Do | guri 박스 분리 디자인' },
    { Component: UnderlineLogo, name: 'UnderlineLogo', desc: '호버시 늘어나는 언더라인' },
    { Component: ThreeDLogo, name: 'ThreeDLogo', desc: 'DOGURI 3D 그림자 효과' },
    { Component: GradientLogo, name: 'GradientLogo', desc: '파란색-보라색 그래디언트 + 블러' },
    { Component: ModernLogo, name: 'ModernLogo', desc: 'do + guri 색상 분리 + 펄스 애니메이션' },
    { Component: BoxLogo, name: 'BoxLogo', desc: '도구 | 리 한글 박스 스타일' },
    { Component: DevLogo, name: 'DevLogo', desc: '<Doguri /> 개발자 코드 스타일' },
    { Component: IconLogo, name: 'IconLogo', desc: '코드 아이콘 + 도구리' },
    { Component: NeonLogo, name: 'NeonLogo', desc: 'DOGURI 네온 빛 효과' },
    { Component: KoreanLogo, name: 'KoreanLogo', desc: '도구리 (Black Han Sans 한글)' },
    { Component: TechLogo, name: 'TechLogo', desc: 'Orbitron 테크 폰트' },
    { Component: MinimalLogo, name: 'MinimalLogo', desc: 'Space Grotesk + TOOLS 뱃지' },
    { Component: ImpactLogo, name: 'ImpactLogo', desc: 'Bebas Neue 임팩트 + Dev Tools' },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(`import { ${text} as Logo } from '../Logo';`);
    alert(`복사됨: ${text}`);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-900">로고 스타일 쇼케이스</h1>
        <p className="text-gray-600 mt-2">원하는 로고를 선택하고 이름을 클릭하면 import 코드가 복사됩니다.</p>
      </div>

      <div className="flex-1 overflow-auto p-8 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {logos.map(({ Component, name, desc }, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              {/* 로고 미리보기 영역 */}
              <div className="h-20 flex items-center justify-center mb-4 border-b border-gray-100 pb-4">
                <Component />
              </div>

              {/* 로고 정보 */}
              <div className="space-y-2">
                <button
                  onClick={() => copyToClipboard(name)}
                  className="text-sm font-mono text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                >
                  {name}
                </button>
                <p className="text-xs text-gray-600">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 사용법 안내 */}
        <div className="max-w-7xl mx-auto mt-8 p-6 bg-blue-50 rounded-lg">
          <h2 className="text-lg font-bold text-blue-900 mb-3">사용 방법</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
            <li>원하는 로고 스타일을 선택하세요</li>
            <li>로고 이름(파란색)을 클릭하면 import 코드가 복사됩니다</li>
            <li><code className="bg-blue-100 px-2 py-1 rounded">src/components/Layout/Sidebar.tsx</code> 파일을 열어주세요</li>
            <li>13번째 줄의 import 문을 복사한 코드로 교체하세요</li>
            <li>저장 후 <code className="bg-blue-100 px-2 py-1 rounded">npm run build</code> 실행</li>
          </ol>
        </div>

        {/* 현재 선택된 로고 */}
        <div className="max-w-7xl mx-auto mt-6 p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>현재 선택:</strong> CapitalizedLogo (Doguri - 첫글자 대문자)
          </p>
        </div>
      </div>
    </div>
  );
}