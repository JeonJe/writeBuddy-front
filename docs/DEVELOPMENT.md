# WriteBuddy 개발 가이드

## 🎨 현재 디자인 시스템

### 색상 팔레트 (Harmonized Blue Theme)
```css
:root {
  /* Background Colors */
  --bg-base: #f5f7fa;           /* 연한 블루 그레이 */
  --bg-elevated: #ffffff;
  --bg-card: #ffffff;
  --bg-highlight: #edf2f7;

  /* Accent Colors - 토스 스타일 */
  --accent-primary: #3182f6;    /* 메인 블루 */
  --accent-primary-hover: #1a6de3;
  --accent-gradient: linear-gradient(135deg, #3182f6 0%, #6366f1 100%);

  /* Text Colors */
  --text-primary: #1a1a1a;
  --text-secondary: #4a5568;
  --text-muted: #718096;

  /* Status Colors */
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;

  /* Spacing (8px 단위) */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;

  /* Border Radius */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
}
```
---
## 🛠️ Upcoming Work – UI/UX 개선 작업 (1차 적용)

### 1️⃣ Enter 기반 교정 실행 플로우
- Enter 입력 시 교정 실행 (기존 Cmd/Ctrl+Enter 대체)
- Shift+Enter는 줄바꿈 유지
- 로딩 중 Enter는 무시하여 중복 요청 방지
- 교정 완료 후 입력창 자동 포커스 유지

### 2️⃣ 입력 / 결과 레이아웃 개선
- 메인 레이아웃을 좌(입력+결과) 70% / 우(질문 사이드바) 30% 비율로 재정렬
- 입력창 아래에 결과 영역이 자연스럽게 이어지는 수직 흐름 구성
- Idle / Loading / Result 상태를 동일한 박스 레이아웃 내에서 표시

### 3️⃣ 사이드바 단일 기능화
- 예시 문장, 오늘의 표현, 팁 카드 제거
- 사이드바를 "AI 질문하기" 기능만 포함하도록 단일화
- 기존 우측 하단 플로팅 도우미 및 오버레이 팝업 제거

### 4️⃣ 스크롤 및 인터랙션 정리
- 좌측 메인 영역만 스크롤되도록 유지
- 사이드바는 자체 스크롤 영역 구성
- 입력창 하단 안내 문구를 “Enter로 교정하기 / Shift+Enter 줄바꿈”으로 수정

## 🛠️ Upcoming Work – UI/UX 개선 작업 (2차 적용)

### 1️⃣ 입력/교정 플로우 고도화
- [ ] 교정 결과에서 특정 단어 클릭 시 의미/예문 팝업 제공
- [ ] 교정 결과에서 "다시 문장 만들기" 기능 추가
- [ ] 교정 API 지연 시 타임아웃/재시도 UX 추가

### 2️⃣ AI 질문하기 패널 개선
- [ ] 질문 히스토리 localStorage에 저장
- [ ] 질문/답변 사이 간격 축소 및 가독성 개선
- [ ] 사이드바 자동 스크롤(최근 메시지로 이동)

### 3️⃣ 기록 기능 확장
- [ ] 개별 교정 결과를 즐겨찾기/보관함으로 이동
- [ ] 검색(문장/날짜 기반) 기능 추가
- [ ] 태그 기반 필터링 기능

### 4️⃣ 반응형 최적화 (모바일 중심)
- [ ] 모바일에서 입력창 → 결과창 전환 애니메이션 추가
- [ ] 모바일 사이드바는 슬라이드 인 방식으로 변경
- [ ] 키보드 상승 시 레이아웃 깨짐 보정

### 5️⃣ 접근성 & 성능 개선
- [ ] Skeleton 품질 개선 (단락형, 문장형 구조로)
- [ ] Lazy-load 최적화 (결과 캐러셀)
- [ ] aria-controls / aria-expanded 적용
- [ ] 이미지/아이콘 Sprite 적용

### 6️⃣ 에러 UX 개선
- [ ] AI 오류 시 "다시 시도" 버튼 표시
- [ ] 네트워크 오류 레이어 추가
- [ ] API timeout 시 사용자 안내 모달

### 7️⃣ 개발자 품질 작업
- [ ] 컴포넌트 단위 스냅샷 테스트 추가
- [ ] 주요 훅(hooks) 유닛 테스트
- [ ] ChatSidePanel, ResultCarousel 리팩토링 (Props 단순화)

## 🛠️ Upcoming Work – UI/UX 개선 작업 (추가 디테일)

### 1️⃣ 결과 카드(“훨씬 더 멋져졌어요!”) 가독성 개선
- [ ] 메인 결과 카드 전체 가로 폭을 넓혀, 원문/교정 카드가 더 넓게 보이도록 레이아웃 조정
  - 좌/우 여백(padding/margin)을 조정하여, 카드 내용이 한 화면에 더 많이 보이도록 함
  - Desktop 기준에서 Result 카드 컨테이너의 max-width 상향 (예: 880px 등), 반응형 고려
- [ ] 원문/교정 카드 내부 텍스트 영역 높이를 자동 확장(auto-height) 되도록 조정
  - 긴 문장도 스크롤 없이 1~2줄 이상 한눈에 볼 수 있도록 line-height, padding 재조정
- [ ] 점수/즐겨찾기 아이콘이 카드 내용과 시각적으로 더 잘 정렬되도록 정렬/여백 미세 조정

### 2️⃣ AI 질문하기 패널 레이아웃 & 메시지 스타일 개선
- [ ] AI 질문하기 패널을 상단 헤더 / 메시지 리스트 / 입력 영역 3단 구조의 flex 레이아웃으로 변경
  - 메시지 리스트 영역이 남는 세로 공간을 모두 차지하도록 `flex: 1` + `overflow-y: auto` 적용
  - 하단의 큰 빈 공간이 생기지 않도록, 패널 전체 높이 대비 메시지 리스트가 유동적으로 확장되게 구성
- [ ] 메시지 버블 스타일 적용
  - 사용자 메시지와 AI 메시지를 좌/우 정렬로 구분하고, 서로 다른 배경색/텍스트색 사용
  - 각 버블에 적절한 padding, border-radius, margin-bottom을 적용하여 “그냥 텍스트 블록”이 아닌 대화 느낌으로 표현
  - 긴 메시지는 가독성을 위해 max-width를 제한하고, 줄 간격(line-height)을 조정
- [ ] 메시지 리스트 상/하단 여백 정리
  - 리스트 상/하단 padding을 통일하여, 첫 메시지와 마지막 메시지가 패널 경계에 붙어 보이지 않도록 조정
---
---

## 🏗️ 현재 레이아웃 구조

### HomePage - 좌우 분할 레이아웃
```
┌──────────────────────────────────────────────────┐
│  WriteBuddy                    [교정하기] [기록] │  ← Navigation (72px)
├────────────┬─────────────────────────────────────┤
│            │      ◀  1/3  ▶                      │
│   입력창   │ ┌─────────────────────────────────┐ │
│  (380px)   │ │  ResultCarousel                 │ │
│   sticky   │ │  - 결과 카드 슬라이더            │ │
│            │ │  - 로딩 카드 (교정 중...)        │ │
│ [교정하기] │ └─────────────────────────────────┘ │
│            │         ● ○ ○  (인디케이터)        │
└────────────┴─────────────────────────────────────┘
```

### 반응형 브레이크포인트
- **Desktop**: > 1024px - 좌우 분할 (380px | 나머지)
- **Tablet**: 768px ~ 1024px - 좌우 분할 (320px | 나머지)
- **Mobile**: < 768px - 상하 배치

---

## ✅ 구현 완료 항목

### UI/UX 개선
- [x] **색상 시스템 통일**: Harmonized Blue Theme (#3182f6 기반)
- [x] **터치 타겟 44px**: 즐겨찾기 버튼, 네비게이션 버튼 등
- [x] **좌우 분할 레이아웃**: 입력(좌) / 결과(우) 배치
- [x] **결과 캐러셀**: 세션 내 교정 히스토리 슬라이더
- [x] **인라인 로딩**: 버튼 내 스피너 (별도 로딩 카드 제거)
- [x] **로딩 카드**: 교정 중 스피너 + 프로그레스 바
- [x] **채팅 오버레이**: 반투명 배경 + 블러 효과
- [x] **글자수 카운터**: 입력창 하단 표시
- [x] **복사 버튼**: 교정 결과 복사 기능
- [x] **즐겨찾기 툴팁**: 호버 시 안내 메시지

### 접근성
- [x] **prefers-reduced-motion**: 애니메이션 비활성화 지원
- [x] **aria-label**: 주요 버튼에 적용
- [x] **focus-visible**: 키보드 포커스 스타일

---

## 🔄 주요 컴포넌트

### ResultCarousel
세션 내 교정 결과를 슬라이드로 관리
```tsx
<ResultCarousel
  corrections={sessionCorrections}  // 세션 히스토리
  currentIndex={currentIndex}       // 현재 인덱스
  isLoading={isLoading}            // 로딩 상태
  onIndexChange={setCurrentIndex}   // 인덱스 변경
  onToggleFavorite={toggleFavorite}
  getScoreLevel={getScoreLevel}
/>
```

### CorrectionInput
좌측 사이드바에 고정된 입력창
```tsx
<CorrectionInput
  onCorrect={handleCreateCorrection}
  isLoading={isLoading}  // 버튼 내 스피너 표시
/>
```

### ChatSidePanel
오버레이 방식의 채팅 패널
- 열릴 때 반투명 배경 표시
- 배경 클릭 시 닫힘

---

## 📱 반응형 동작

### Desktop (> 1024px)
- 좌우 분할: 380px (입력) | 나머지 (결과)
- 입력창 sticky 고정

### Tablet (768px ~ 1024px)
- 좌우 분할: 320px (입력) | 나머지 (결과)

### Mobile (< 768px)
- 상하 배치: 입력창 → 결과
- 입력창 sticky 해제
- 채팅 패널 100% 너비

---

## 🎯 UX 핵심 원칙

1. **44px 룰**: 모든 터치 타겟은 최소 44×44px
2. **4.5:1 룰**: 텍스트 대비는 최소 4.5:1
3. **3초 룰**: 주요 액션은 3초 내 완료 가능해야 함
4. **1 화면 룰**: 중요 정보는 스크롤 없이 보여야 함

---

## 🔜 추후 개선 예정

### High Priority
- [ ] 기록 검색/필터 기능
- [ ] 채팅 기록 localStorage 저장
- [ ] XSS 취약점 수정 (DOMPurify)

### Medium Priority
- [ ] 다크모드 지원
- [ ] 스와이프 제스처 (모바일 캐러셀)
- [ ] 키보드 단축키 (← → 캐러셀 이동)

### Low Priority
- [ ] 애니메이션 개선
- [ ] 오프라인 지원 (Service Worker)

---

## 📁 주요 파일 구조

```
src/
├── components/
│   ├── CorrectionInput/     # 입력창
│   ├── CorrectionResult/    # 결과 카드
│   ├── ResultCarousel/      # 결과 캐러셀 (NEW)
│   ├── ChatSidePanel/       # 채팅 패널
│   ├── Navigation/          # 상단 네비게이션
│   └── Toast/               # 토스트 알림
├── contexts/
│   └── CorrectionsContext.tsx  # 전역 상태 (sessionCorrections 포함)
├── pages/
│   ├── HomePage.tsx         # 메인 페이지
│   └── HistoryPage.tsx      # 기록 페이지
└── styles/
    └── globals.css          # 디자인 시스템 변수
```


