import Header from '../../components/Layout/Header';

interface VersionData {
  version: string;
  date: string;
  changes: string[];
}

const versions: VersionData[] = [
  {
    version: '1.2.0',
    date: '2026-06-11',
    changes: [
      'JSON 정리 결과를 접기/펼치기 가능한 트리 뷰로 표시',
      'JSON 오류 위치(행/열)와 원인을 한국어 설명, 해결 힌트와 함께 표시',
      'JSON 오류 문자 하이라이트 발췌 및 입력에서 오류 위치 선택 기능 추가'
    ]
  },
  {
    version: '1.1.0',
    date: '2026-04-08',
    changes: [
      '신규 도구 5종 추가: JWT 디코더, 진법 변환기, 이미지 형식 변환, .env 편집기, HTTP 상태 코드 사전',
      '카테고리별 카드 그리드 홈 화면 구현 (검색, 카테고리 필터)',
      '단위 변환기에 파일 크기(Data) 카테고리 추가',
      '카테고리별 아이콘/색상 체계 적용'
    ]
  },
  {
    version: '1.0.2',
    date: '2026-04-03',
    changes: [
      '7개 신규 도구 추가: 글자수 계산, 날짜 계산기, 나이 계산기, 랜덤 추첨기, 비밀번호 생성기, QR 코드 생성기, 색상 피커',
      '텍스트 카운터 UI 개선 (트위터 제한 기능 제거)',
      '새 카테고리 추가: 계산기, 일상'
    ]
  },
  {
    version: '1.0.1',
    date: '2026-03-25',
    changes: [
      'Cron 생성기 추가',
      '세계 시간 기능 추가 (한국/UTC 기준)',
      '실시간 시간 업데이트 개선'
    ]
  },
  {
    version: '1.0.0',
    date: '2026-03-15',
    changes: [
      '초기 릴리스',
      '13개 기본 도구 제공 (JSON 정리, 대소문자 변환, Base64, 해시 생성기 등)',
      'React 19 + TypeScript 기반 구축'
    ]
  }
];

export default function Changelog() {
  return (
    <div className="h-full flex flex-col bg-gray-50">
      <Header
        title="변경 이력"
        description="Doguri 프로젝트의 버전별 주요 변경사항"
      />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-4">
          {versions.map((version) => (
            <div
              key={version.version}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              {/* 버전 헤더 */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-900">
                    v{version.version}
                  </span>
                  {version.version === versions[0].version && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                      최신
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-500">{version.date}</span>
              </div>

              {/* 변경사항 */}
              <ul className="space-y-2">
                {version.changes.map((change, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="text-blue-500 text-sm leading-relaxed">•</span>
                    <span className="text-sm text-gray-700 flex-1 leading-relaxed">{change}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* 안내 문구 */}
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">
              더 자세한 변경 사항은 Git 커밋 히스토리를 참조하세요
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
