# Week 1 프론트엔드 작업 계획서 (P0 개선)

> **작성일**: 2026-01-06
> **담당**: WriteBuddy PM
> **목표**: 만족도 3.4 → 4.5+ 달성, 복습률 0% → 30% 달성 (4주 내)
> **예상 기간**: 5일 (Day 1-5)

---

## 📋 목차

1. [기능 요구사항 (Feature Requirements)](#1-기능-요구사항-feature-requirements)
2. [사용자 시나리오 (User Scenarios)](#2-사용자-시나리오-user-scenarios)
3. [수용 기준 (Acceptance Criteria)](#3-수용-기준-acceptance-criteria)
4. [성공 지표 (Success Metrics)](#4-성공-지표-success-metrics)
5. [개발 우선순위](#5-개발-우선순위)
6. [기술 스택 제약사항](#6-기술-스택-제약사항)
7. [상세 구현 가이드](#7-상세-구현-가이드)
8. [UI/UX 명세](#8-uiux-명세)
9. [테스트 시나리오](#9-테스트-시나리오)
10. [리스크 & 대응](#10-리스크--대응)

---

## 1. 기능 요구사항 (Feature Requirements)

### 🎯 Feature 1: 복습 목표 설정 + 진도 표시

**문제 인식**:
- 5명 모두 "언제 끝나는지 모름", "몇 개 해야 하지?" 불안 호소
- 성취감 없음, 목표 없이 무한 반복

**해결 방안**:

#### 1.1 복습 시작 모달 (Goal Setting)

**표시 시점**: PracticePanel에서 "복습 시작" 버튼 클릭 시

**UI 구성**:
```
┌─────────────────────────────────────────┐
│  🎯 오늘의 복습 목표를 선택해주세요!      │
├─────────────────────────────────────────┤
│                                         │
│   ┌──────┐  ┌──────┐  ┌──────┐         │
│   │  5개  │  │ 10개 │  │ 20개 │         │
│   │ 가볍게│  │ 기본 │  │ 열심 │         │
│   └──────┘  └──────┘  └──────┘         │
│                                         │
│            [시작하기 →]                  │
│                                         │
└─────────────────────────────────────────┘
```

**기능 상세**:
1. 3가지 옵션 제공: 5개(가볍게), 10개(기본), 20개(열심히)
2. 기본값: 10개 (자동 선택)
3. localStorage에 사용자 선호 목표 저장 (`reviewGoalPreference`)
4. 다음 복습 시 이전 선택값 자동 적용 (변경 가능)

**엣지 케이스**:
- 복습 가능한 즐겨찾기가 목표보다 적을 경우:
  - 예: 목표 10개인데 즐겨찾기 3개만 있음
  - 동작: "현재 즐겨찾기 3개만 있어요. 3개 복습하시겠어요?" 메시지 표시
  - 선택: [3개만 복습] [취소] 버튼 제공

#### 1.2 진도 표시 (Progress Bar)

**표시 위치**: PracticePanel 상단 (practice-header 바로 아래)

**UI 구성**:
```
┌─────────────────────────────────────────┐
│  ✏️ 오늘의 연습                     ↻   │
├─────────────────────────────────────────┤
│  복습 중 3/10                            │
│  ▓▓▓▓▓▓░░░░░░░░░░░░░ 30%               │
└─────────────────────────────────────────┘
```

**기능 상세**:
1. 현재 진행 상태: "복습 중 3/10" 텍스트
2. 프로그레스 바: 시각적 진행률 (0-100%)
3. 퍼센트: "30%" 표시 (소수점 없이)
4. 색상:
   - 0-50%: 파란색 (#0284c7)
   - 51-80%: 노란색 (#eab308)
   - 81-100%: 초록색 (#16a34a)

**엣지 케이스**:
- 목표보다 많이 복습한 경우 (예: 10개 목표인데 12개 복습):
  - 진행률: "복습 중 12/10 (120%)" 표시
  - 프로그레스 바: 100%로 고정 (넘치지 않음)
  - 색상: 보라색 (#a855f7) - "목표 초과 달성" 의미

#### 1.3 완료 축하 메시지 (Completion Modal)

**표시 시점**: 목표 개수 달성 시 (10개 목표 → 10번째 문장 "다음 문장" 클릭 시)

**UI 구성**:
```
┌─────────────────────────────────────────┐
│                                         │
│              🎉                         │
│                                         │
│        10개 복습 완료!                   │
│                                         │
│    오늘도 성장하고 있어요! 💪            │
│    내일도 함께 해요!                     │
│                                         │
│         [계속 복습하기]  [종료]          │
│                                         │
└─────────────────────────────────────────┘
```

**기능 상세**:
1. 축하 애니메이션: 🎉 이모지 bounce 효과 (0.5초)
2. 격려 메시지: 랜덤 3가지 중 1개
   - "오늘도 성장하고 있어요! 💪 내일도 함께 해요!"
   - "10개 복습 완료! 꾸준함이 실력이 돼요! 🌟"
   - "목표 달성! 이런 열정이면 금방 늘 거예요! 🔥"
3. 액션 버튼:
   - [계속 복습하기]: 목표 재설정 모달 표시
   - [종료]: 모달 닫기 + 복습 통계 저장

**localStorage 저장**:
```typescript
interface ReviewSession {
  date: string;         // "2026-01-06"
  goal: number;         // 10
  completed: number;    // 10
  achievedGoal: boolean; // true
  timestamp: number;    // Date.now()
}

// 저장 키: 'reviewSessions'
// 저장 예시: ReviewSession[] (최근 30일만 보관)
```

---

### 🔍 Feature 2: 내 답 vs Best Answer 비교 UI

**문제 인식**:
- 4명이 "내 답이랑 뭐가 달랐는지 모르겠어요" 호소
- 입력한 답이 사라져서 학습 효과 반감
- "왜 틀렸는지" 이해 못 함 → 반복 오류

**해결 방안**:

#### 2.1 사용자 답변 보존

**기술 구현**:
```typescript
// PracticePanel 상태 추가
const [userAnswer, setUserAnswer] = useState('');        // 현재 입력
const [submittedAnswer, setSubmittedAnswer] = useState(''); // 제출된 답 (보존)

// "정답 보기" 클릭 시
const handleShowAnswer = () => {
  setSubmittedAnswer(userAnswer); // 제출 시점 답변 저장
  setShowAnswer(true);
};
```

**엣지 케이스**:
- 빈 답변으로 정답 보기 클릭:
  - 제출된 답: "(작성하지 않음)" 표시
  - 비교 UI는 정상 표시
- 매우 긴 답변 (200자 이상):
  - 말줄임 없이 전체 표시
  - 스크롤 가능하게 처리

#### 2.2 비교 UI (Comparison View)

**표시 위치**: Best Answer 바로 위 (showAnswer=true 시)

**UI 구성**:
```
┌─────────────────────────────────────────┐
│  내 답:                                  │
│  ┌─────────────────────────────────┐   │
│  │ I will write the report.        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ✨ Best:                               │
│  ┌─────────────────────────────────┐   │
│  │ I'll write the report.          │   │
│  └─────────────────────────────────┘   │
│                                         │
│  💡 Tip:                                │
│  일상 대화에서는 축약형(I'll)이 더      │
│  자연스러워요                            │
└─────────────────────────────────────────┘
```

**기능 상세**:

1. **내 답 영역**:
   - 배경색: 연한 회색 (#f3f4f6)
   - 테두리: 1px solid #d1d5db
   - 패딩: 12px
   - 폰트: 0.9rem, 일반체 (400)

2. **Best Answer 영역**:
   - 배경색: 연한 노란색 (#fefce8) - 기존 스타일 재사용
   - 테두리: 1px solid #fde047
   - 패딩: 12px
   - 폰트: 0.9rem, 중간체 (500)

3. **Tip 영역**:
   - 배경색: 연한 파란색 (#eff6ff)
   - 테두리: 1px solid #bfdbfe
   - 패딩: 10px 12px
   - 폰트: 0.8rem, 일반체 (400)
   - 색상: #1e40af
   - 아이콘: 💡 (전구)

#### 2.3 AI 차이점 설명 생성

**생성 시점**: showAnswer=true 될 때 (비동기)

**기능 상세**:

**Option A: localStorage 기반 (Week 1 MVP)** - 추천
```typescript
// 간단한 규칙 기반 Tip 생성
function generateTip(userAnswer: string, bestAnswer: string): string {
  // 1. 축약형 차이
  if (bestAnswer.includes("'ll") && userAnswer.includes("will")) {
    return "일상 대화에서는 축약형(I'll, You'll)이 더 자연스러워요";
  }

  // 2. 시제 차이
  if (bestAnswer.includes("have been") && userAnswer.includes("am")) {
    return "현재완료 시제를 사용하면 계속된 상태를 더 명확히 표현할 수 있어요";
  }

  // 3. 관사 차이
  if (bestAnswer.includes("the") && !userAnswer.includes("the")) {
    return "특정한 대상을 가리킬 때는 정관사 'the'를 사용하세요";
  }

  // 4. 전치사 차이
  if (bestAnswer.includes(" on ") && userAnswer.includes(" in ")) {
    return "시간/날짜를 표현할 때는 전치사 선택에 주의하세요";
  }

  // 기본값
  return "Best Answer를 참고하여 자연스러운 표현을 익혀보세요!";
}
```

**Option B: AI API 기반 (Week 2 이후)** - 추후 확장
```typescript
// chatService 활용하여 실시간 차이점 분석
const diffAnalysis = await chatService.analyzeDifference({
  userAnswer,
  bestAnswer,
  koreanSentence: sentence.korean
});
```

**엣지 케이스**:
- 내 답 = Best Answer (완전 일치):
  - Tip: "🎉 완벽해요! Best Answer와 같은 표현을 사용하셨네요!"
  - 배경색: 연한 초록색 (#dcfce7)
- API 오류로 Tip 생성 실패:
  - Tip: "Best Answer를 참고하여 자연스러운 표현을 익혀보세요!" (기본값)
  - 콘솔 에러 로깅

---

## 2. 사용자 시나리오 (User Scenarios)

### 페르소나 1: 초보 지수 (24세, 영어 왕초보)

**니즈**: 쉬운 사용법, 친근한 메시지, 성취감

**시나리오 1: 첫 복습 시작**
1. PracticePanel 페이지 진입
2. "🔄 복습 시작" 버튼 클릭
3. 목표 선택 모달 표시:
   - "🎯 오늘의 복습 목표를 선택해주세요!"
   - 버튼: [5개 가볍게] [10개 기본] [20개 열심히]
   - 지수 선택: "5개 가볍게" (부담 없게)
4. 복습 시작:
   - 헤더: "✏️ 오늘의 연습" + 진도 "복습 중 1/5"
   - 프로그레스 바: ▓▓▓▓░░░░ 20%
5. 첫 문장 풀이:
   - 한국어: "나는 3년 동안 영어를 공부하고 있어"
   - 힌트: "💡 현재완료 시제 사용"
   - 지수 입력: "I am studying English for 3 years"
   - Enter 또는 "👀 정답 보기" 클릭
6. 비교 화면 표시:
   ```
   내 답:
   I am studying English for 3 years

   ✨ Best:
   I have been studying English for 3 years

   💡 Tip:
   현재완료 시제를 사용하면 계속된 상태를 더 명확히 표현할 수 있어요
   ```
7. "아하! 이래서 틀렸구나" 이해 → 학습 효과 ⬆️
8. "➡️ 다음 문장" 클릭
9. 진도 업데이트: "복습 중 2/5" (40%)
10. 5개 완료 후 축하 모달:
    ```
    🎉
    5개 복습 완료!
    오늘도 성장하고 있어요! 💪
    내일도 함께 해요!

    [계속 복습하기]  [종료]
    ```
11. 지수: "오늘은 여기까지!" → [종료] 클릭
12. 만족감 ⬆️ → 내일 또 복습하러 옴

**기대 효과**:
- 목표가 명확해서 불안감 해소 ✅
- 진도 표시로 성취감 증가 ✅
- 축하 메시지로 동기부여 ✅
- 만족도: 3점 → 5점 예상

---

### 페르소나 2: 직장인 민호 (32세, 업무 영어 필요)

**니즈**: 시간 효율, 명확한 목표, 빠른 학습

**시나리오 2: 출근 전 짧은 복습**
1. 아침 7시, 출근 전 10분 시간
2. WriteBuddy 접속 → "🔄 복습 시작"
3. 목표 선택:
   - 이전 선택: "10개 기본" (localStorage 저장됨)
   - 오늘: 시간 부족 → "5개 가볍게" 선택
4. 복습 시작:
   - 진도: "복습 중 1/5"
   - 민호: "5개면 5분이면 되겠네!" → 안심
5. 빠르게 5개 완료:
   - 각 문장마다 "내 답 vs Best" 비교로 틀린 부분 빠르게 파악
   - Tip으로 핵심만 학습 (상세 설명 불필요)
6. 5개 완료 → 축하 모달:
   - 민호: [종료] 클릭 (시간 부족)
7. 출근 → "오늘 아침 5개 했다!" 뿌듯함
8. 저녁에 시간 나면 다시 복습 (재방문율 ⬆️)

**기대 효과**:
- 목표 설정으로 시간 관리 가능 ✅
- 진도 표시로 "언제 끝나지?" 불안 해소 ✅
- 빠른 학습 루프 → 재방문율 증가 ✅
- 만족도: 3점 → 4.5점 예상

---

### 페르소나 3: 완벽주의 수진 (26세, 디테일 중시)

**니즈**: 학습 효과, 답 비교, 정확한 피드백

**시나리오 3: 꼼꼼한 복습**
1. WriteBuddy 접속 → 복습 시작
2. 목표 선택: "20개 열심히" (완벽하게 학습하고 싶음)
3. 복습 진행:
   - 진도: "복습 중 3/20" (15%)
   - 수진: "아직 멀었네, 더 집중하자!"
4. 각 문장마다:
   - 내 답 vs Best 비교 꼼꼼히 확인
   - Tip 메시지 여러 번 읽기
   - 차이점 메모 (별도 노트)
5. 15개 완료 시점:
   - 진도: "복습 중 15/20" (75%)
   - 수진: "5개만 더 하면 끝!" → 동기부여
6. 20개 완료 → 축하 모달:
   ```
   🎉
   20개 복습 완료!
   목표 달성! 이런 열정이면 금방 늘 거예요! 🔥

   [계속 복습하기]  [종료]
   ```
7. 수진: "더 할까?" → [계속 복습하기] 클릭
8. 추가 목표 설정: "10개 기본"
9. 총 30개 복습 → 초과 달성 뿌듯함

**기대 효과**:
- 답 비교 기능으로 학습 효과 극대화 ✅
- 진도 표시로 목표 의식 강화 ✅
- 디테일한 Tip으로 만족도 증가 ✅
- 만족도: 3점 → 5점 예상

---

### 페르소나 4: 개발자 전제 (32세, UX 중시)

**니즈**: 직관적 UI, 키보드 단축키, 효율적 워크플로우

**시나리오 4: 효율적인 복습 워크플로우**
1. 복습 시작 → 목표 선택: "10개 기본"
2. 키보드만으로 복습:
   - Enter: 정답 보기
   - Tab: "다음 문장" 버튼 포커스
   - Enter: 다음 문장 이동
3. 진도 표시로 실시간 진행률 확인:
   - "복습 중 7/10" (70%) → 거의 끝!
4. 10개 완료 → 축하 모달:
   - ESC 키로 빠르게 닫기 (키보드 접근성)
5. 전제: "UX 편하다!" → 재방문 의향 ⬆️

**기대 효과**:
- 키보드 접근성 ✅ (기존 Enter 지원 유지)
- 진도 표시로 효율적 시간 관리 ✅
- 만족도: 4점 → 5점 예상

---

### 페르소나 5: 김상현 (32세, 현지 표현 중시)

**니즈**: Best Answer 신뢰도, 자연스러운 표현 학습

**시나리오 5: Best Answer 신뢰 강화**
1. 복습 시작 → 목표: "10개 기본"
2. 각 문장마다:
   - 내 답: "I will go to the store"
   - Best: "I'll head to the store"
   - Tip: "일상 대화에서는 'head to'가 'go to'보다 자연스럽고, 축약형을 많이 써요"
3. 상현: "오! 이런 표현도 있구나" → 새로운 표현 학습
4. Tip의 구체적인 설명으로 신뢰도 증가
5. 10개 완료 → "Best Answer 진짜 유용하네!" → 재방문

**기대 효과**:
- Tip으로 Best Answer 신뢰도 강화 ✅
- 자연스러운 표현 학습 ✅
- 만족도: 4점 → 5점 예상

---

## 3. 수용 기준 (Acceptance Criteria)

### Feature 1: 복습 목표 설정 + 진도 표시

**AC 1.1: 목표 선택 모달**
- [ ] "복습 시작" 버튼 클릭 시 목표 선택 모달 표시
- [ ] 3가지 옵션 제공 (5개, 10개, 20개)
- [ ] 기본값 10개 자동 선택
- [ ] [시작하기] 버튼 클릭 시 복습 시작
- [ ] localStorage에 선택값 저장 (`reviewGoalPreference`)
- [ ] 다음 복습 시 이전 선택값 자동 적용
- [ ] 모달 외부 클릭 시 닫힘
- [ ] ESC 키로 닫힘

**AC 1.2: 진도 표시**
- [ ] PracticePanel 상단에 진도 텍스트 표시 ("복습 중 3/10")
- [ ] 프로그레스 바 시각적 표시 (0-100%)
- [ ] 퍼센트 텍스트 표시 ("30%")
- [ ] 진행률에 따른 색상 변화:
  - [ ] 0-50%: 파란색
  - [ ] 51-80%: 노란색
  - [ ] 81-100%: 초록색
  - [ ] 100% 초과: 보라색
- [ ] "다음 문장" 클릭 시 진도 업데이트
- [ ] 모바일 반응형 (화면 작아도 깨지지 않음)

**AC 1.3: 완료 축하 메시지**
- [ ] 목표 개수 달성 시 축하 모달 표시
- [ ] 🎉 이모지 bounce 애니메이션 (0.5초)
- [ ] 격려 메시지 랜덤 표시 (3가지 중 1개)
- [ ] [계속 복습하기] 버튼: 목표 재설정 모달 표시
- [ ] [종료] 버튼: 모달 닫기
- [ ] localStorage에 복습 세션 저장 (`reviewSessions`)
- [ ] 저장 데이터: date, goal, completed, achievedGoal, timestamp
- [ ] 최근 30일 데이터만 보관 (오래된 것 자동 삭제)

**엣지 케이스**:
- [ ] 즐겨찾기가 목표보다 적을 때: 경고 메시지 + 선택지 제공
- [ ] 목표 초과 달성 시: "복습 중 12/10 (120%)" 표시
- [ ] localStorage 꽉 찼을 때: 오래된 세션 자동 삭제

---

### Feature 2: 내 답 vs Best Answer 비교 UI

**AC 2.1: 사용자 답변 보존**
- [ ] "정답 보기" 클릭 시 사용자 입력값 `submittedAnswer`에 저장
- [ ] "다음 문장" 클릭 시에도 이전 답변 유지 (화면에서 사라져도 OK)
- [ ] 빈 답변 제출 시: "(작성하지 않음)" 표시
- [ ] 200자 이상 긴 답변: 말줄임 없이 전체 표시, 스크롤 가능

**AC 2.2: 비교 UI**
- [ ] showAnswer=true 시 비교 UI 표시
- [ ] 내 답 영역: 회색 배경, 사용자 입력값 표시
- [ ] Best Answer 영역: 노란색 배경 (기존 스타일 재사용)
- [ ] 두 영역 사이 간격: 8px
- [ ] 모바일 반응형: 세로 스택 (위: 내 답, 아래: Best)

**AC 2.3: Tip 생성**
- [ ] showAnswer=true 시 Tip 자동 생성 (규칙 기반)
- [ ] Tip 영역: 파란색 배경, 💡 아이콘
- [ ] 규칙 적용:
  - [ ] 축약형 차이 감지 (will → 'll)
  - [ ] 시제 차이 감지 (am → have been)
  - [ ] 관사 차이 감지 (생략 → the)
  - [ ] 전치사 차이 감지 (in → on)
- [ ] 완전 일치 시: "🎉 완벽해요!" 메시지 + 초록색 배경
- [ ] Tip 생성 실패 시: 기본 메시지 표시 + 콘솔 에러 로깅
- [ ] 모바일 반응형: 폰트 크기 조정 (0.75rem)

**엣지 케이스**:
- [ ] 내 답 = Best Answer: "🎉 완벽해요!" 메시지
- [ ] 규칙에 맞지 않는 차이: 기본 Tip 메시지
- [ ] 특수문자 포함 답변: 정상 표시 (escape 처리)

---

## 4. 성공 지표 (Success Metrics)

### 주요 지표 (Primary Metrics)

| 지표 | 현재 (Before) | 목표 (After 4주) | 측정 방법 |
|------|--------------|-----------------|-----------|
| **만족도** | 3.4/5점 | **4.5+/5점** | 5명 사용자 재평가 |
| **복습률** | 0% | **30%** | 즐겨찾기 재방문 / 전체 즐겨찾기 |
| **복습 완료율** | - | **80%** | 완료 세션 / 시작 세션 |
| **재방문율 (7일)** | 기준선 | **+20%p** | 7일 내 재방문 사용자 비율 |

### 세부 지표 (Secondary Metrics)

#### 목표 설정 관련
- **목표 선택 분포**: 5개(25%), 10개(50%), 20개(25%) 예상
- **평균 복습 개수**: 8-12개 (목표 10개 기준)
- **목표 초과 달성률**: 20% (열정적인 사용자)

#### 진도 표시 관련
- **진도 확인 빈도**: 복습당 평균 3-5회 (시각적 체크)
- **중도 이탈률**: 30% → **15%** (진도 표시로 감소 예상)

#### 답 비교 관련
- **Tip 열람률**: 90% (거의 모든 사용자 확인)
- **완전 일치 비율**: 15% (학습 효과로 점진적 증가)
- **Tip 유용성 평가**: 4.5/5점 (재평가 시)

#### 축하 메시지 관련
- **[계속 복습하기] 클릭률**: 30% (추가 복습 의향)
- **축하 메시지 후 재방문율**: +15%p (동기부여 효과)

### 측정 방법

#### localStorage 기반 추적
```typescript
interface ReviewSession {
  date: string;
  goal: number;
  completed: number;
  achievedGoal: boolean;
  timestamp: number;
}

// 복습률 계산
const reviewRate = (복습한 즐겨찾기 개수) / (전체 즐겨찾기 개수) * 100;

// 복습 완료율 계산
const completionRate = (목표 달성 세션) / (전체 시작 세션) * 100;
```

#### 사용자 피드백 수집
1. **Week 1 종료 시**: 5명 페르소나 재평가
2. **Week 2**: 추가 피드백 수집 (선택 사항)
3. **Week 4**: 최종 평가 + 지표 분석

---

## 5. 개발 우선순위

### Day 1-2: 복습 목표 설정 + 진도 표시 (핵심 기능)

**우선순위**: P0 (최우선)

**작업 목록**:
1. **Day 1 오전**: 목표 선택 모달 구현
   - [ ] GoalSelectionModal 컴포넌트 생성
   - [ ] 3가지 옵션 버튼 UI
   - [ ] localStorage 저장/불러오기 로직
   - [ ] PracticePanel에 모달 연동

2. **Day 1 오후**: 진도 표시 구현
   - [ ] ProgressBar 컴포넌트 생성
   - [ ] PracticePanel 상태 관리 (current, total)
   - [ ] 색상 변화 로직 (0-50%, 51-80%, 81-100%, 100%+)
   - [ ] 모바일 반응형 스타일

3. **Day 2 오전**: 완료 축하 메시지
   - [ ] CompletionModal 컴포넌트 생성
   - [ ] 🎉 애니메이션 (bounce)
   - [ ] 격려 메시지 랜덤 선택 로직
   - [ ] [계속 복습하기] / [종료] 버튼 동작

4. **Day 2 오후**: localStorage 통합 + 테스트
   - [ ] ReviewSession 인터페이스 정의
   - [ ] 세션 저장/불러오기 로직
   - [ ] 30일 자동 삭제 로직
   - [ ] 엣지 케이스 테스트 (즐겨찾기 부족, 목표 초과 등)

**의존성**:
- GoalSelectionModal → PracticePanel
- ProgressBar → PracticePanel 상태
- CompletionModal → 목표 달성 조건

**리스크**:
- localStorage 용량 제한: 최근 30일만 저장으로 대응
- 모바일 진도 표시 깨짐: 반응형 테스트 필수

---

### Day 3-4: 내 답 vs Best Answer 비교 UI

**우선순위**: P0 (최우선)

**작업 목록**:
1. **Day 3 오전**: 사용자 답변 보존
   - [ ] PracticePanel 상태 추가 (`submittedAnswer`)
   - [ ] "정답 보기" 클릭 시 답변 저장 로직
   - [ ] "다음 문장" 클릭 시 상태 초기화

2. **Day 3 오후**: 비교 UI 구현
   - [ ] AnswerComparison 컴포넌트 생성
   - [ ] 내 답 영역 (회색 배경)
   - [ ] Best Answer 영역 (노란색 배경, 기존 스타일 재사용)
   - [ ] 모바일 반응형 스타일

3. **Day 4 오전**: Tip 생성 로직
   - [ ] generateTip 함수 작성 (규칙 기반)
   - [ ] 축약형 차이 감지
   - [ ] 시제 차이 감지
   - [ ] 관사 차이 감지
   - [ ] 전치사 차이 감지
   - [ ] 완전 일치 감지

4. **Day 4 오후**: Tip UI + 테스트
   - [ ] Tip 영역 스타일 (파란색 배경, 💡 아이콘)
   - [ ] 완전 일치 시 특별 메시지 + 초록색 배경
   - [ ] 엣지 케이스 테스트 (빈 답, 긴 답, 특수문자)
   - [ ] 모바일 반응형 확인

**의존성**:
- AnswerComparison → submittedAnswer 상태
- generateTip → userAnswer, bestAnswer

**리스크**:
- Tip 규칙 부족: 기본 메시지로 대응
- 긴 답변 UI 깨짐: 스크롤 처리

---

### Day 5: 통합 테스트 + 버그 수정 + 문서화

**우선순위**: P0

**작업 목록**:
1. **Day 5 오전**: 5명 페르소나 시나리오 테스트
   - [ ] 초보 지수: 5개 목표 → 완료 → 축하 메시지
   - [ ] 직장인 민호: 5개 목표 → 빠른 복습 → 종료
   - [ ] 완벽주의 수진: 20개 목표 → 꼼꼼한 비교 → 초과 달성
   - [ ] 개발자 전제: 키보드 단축키 → 진도 확인 → 효율적 워크플로우
   - [ ] 김상현: Tip 신뢰도 → 새로운 표현 학습

2. **Day 5 오후**: 버그 수정 + 문서화
   - [ ] 발견된 버그 수정 (우선순위 높은 것만)
   - [ ] README 업데이트 (새 기능 설명)
   - [ ] localStorage 데이터 구조 문서화
   - [ ] 컴포넌트 주석 추가

**의존성**:
- 전체 기능 완성 후 테스트

**리스크**:
- 치명적 버그 발견 시: Day 6으로 연장 가능

---

## 6. 기술 스택 제약사항

### 프론트엔드 기술 스택

**확정 사항** (변경 불가):
- **프레임워크**: React 18.x + TypeScript
- **스타일링**: CSS Modules (PracticePanel.css 패턴 따름)
- **상태 관리**: React useState, useEffect (Redux 사용 안 함)
- **데이터 저장**: localStorage (서버 API는 Week 2 이후)
- **빌드 도구**: Create React App (CRA)

### 재사용 가능한 기존 코드

#### 1. PracticePanel 스타일 재사용
```css
/* 기존 스타일 그대로 활용 */
.practice-panel { /* 연한 파란색 배경, 그라디언트 */ }
.practice-header { /* 헤더 레이아웃 */ }
.practice-label { /* "✏️ 오늘의 연습" 스타일 */ }
.action-btn { /* 버튼 기본 스타일 */ }
.best-answer { /* 노란색 배경 (Best Answer 영역) */ }
```

**적용 방법**:
- GoalSelectionModal, CompletionModal: `.practice-panel` 스타일 상속
- ProgressBar: 새로운 `.progress-bar` 클래스 추가 (practice-panel 안에 배치)
- AnswerComparison: `.best-answer` 스타일 재사용 (Best Answer 영역)

#### 2. 기존 컴포넌트 패턴
```typescript
// PracticePanel 패턴 따르기
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

// 로딩 처리
if (isLoading) return <div className="practice-loading">...</div>;

// 에러 처리
if (error) return <div className="practice-error">...</div>;
```

#### 3. localStorage 유틸리티
```typescript
// 기존 패턴 (CorrectionsContext 참고)
const saveToLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('localStorage save error:', error);
  }
};

const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('localStorage load error:', error);
    return defaultValue;
  }
};
```

### 제약사항 & 금지사항

**금지**:
- ❌ 외부 라이브러리 추가 (lodash, moment.js 등)
- ❌ CSS-in-JS (styled-components, emotion)
- ❌ 서버 API 호출 (Week 1은 localStorage만)
- ❌ Redux, MobX 등 상태 관리 라이브러리
- ❌ Chart.js, D3.js 등 차트 라이브러리 (Week 3 이후)

**허용**:
- ✅ React 기본 Hooks (useState, useEffect, useCallback, useMemo)
- ✅ CSS 애니메이션 (@keyframes)
- ✅ localStorage API
- ✅ 타입스크립트 인터페이스/타입 정의

### 브라우저 호환성

**지원 브라우저**:
- Chrome 90+ (주요 타겟)
- Safari 14+ (iOS 포함)
- Firefox 88+
- Edge 90+

**localStorage 용량**:
- 브라우저당 5-10MB 제한
- WriteBuddy 사용량: 최대 1MB 예상 (30일 데이터 기준)
- 초과 시 오래된 데이터 자동 삭제

---

## 7. 상세 구현 가이드

### 7.1 GoalSelectionModal 컴포넌트

**파일 경로**: `/src/components/GoalSelectionModal/GoalSelectionModal.tsx`

**인터페이스**:
```typescript
interface GoalSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGoal: (goal: number) => void;
  defaultGoal?: number; // localStorage에서 불러온 값
}
```

**구현 예시**:
```typescript
import React, { useState } from 'react';
import './GoalSelectionModal.css';

export const GoalSelectionModal: React.FC<GoalSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectGoal,
  defaultGoal = 10
}) => {
  const [selectedGoal, setSelectedGoal] = useState(defaultGoal);

  if (!isOpen) return null;

  const handleStart = () => {
    onSelectGoal(selectedGoal);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🎯 오늘의 복습 목표를 선택해주세요!</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="goal-options">
          <button
            className={`goal-btn ${selectedGoal === 5 ? 'selected' : ''}`}
            onClick={() => setSelectedGoal(5)}
          >
            <div className="goal-number">5개</div>
            <div className="goal-label">가볍게</div>
          </button>

          <button
            className={`goal-btn ${selectedGoal === 10 ? 'selected' : ''}`}
            onClick={() => setSelectedGoal(10)}
          >
            <div className="goal-number">10개</div>
            <div className="goal-label">기본</div>
          </button>

          <button
            className={`goal-btn ${selectedGoal === 20 ? 'selected' : ''}`}
            onClick={() => setSelectedGoal(20)}
          >
            <div className="goal-number">20개</div>
            <div className="goal-label">열심히</div>
          </button>
        </div>

        <button className="start-btn" onClick={handleStart}>
          시작하기 →
        </button>
      </div>
    </div>
  );
};
```

**CSS** (`GoalSelectionModal.css`):
```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
  animation: slideUp 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #f3f4f6;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  color: #6b7280;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #e5e7eb;
  color: #1f2937;
}

.goal-options {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.goal-btn {
  flex: 1;
  padding: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.goal-btn:hover {
  border-color: #0284c7;
  background: #f0f9ff;
}

.goal-btn.selected {
  border-color: #0284c7;
  background: #e0f2fe;
}

.goal-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
}

.goal-label {
  font-size: 0.85rem;
  color: #6b7280;
}

.start-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: #0284c7;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.start-btn:hover {
  background: #0369a1;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .modal-content {
    padding: 20px;
  }

  .goal-number {
    font-size: 1.3rem;
  }

  .goal-label {
    font-size: 0.75rem;
  }
}
```

---

### 7.2 ProgressBar 컴포넌트

**파일 경로**: `/src/components/ProgressBar/ProgressBar.tsx`

**인터페이스**:
```typescript
interface ProgressBarProps {
  current: number;   // 현재 진행 개수 (3)
  total: number;     // 목표 개수 (10)
}
```

**구현 예시**:
```typescript
import React from 'react';
import './ProgressBar.css';

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = Math.min((current / total) * 100, 100);
  const overGoal = current > total;

  // 색상 결정
  const getColor = () => {
    if (overGoal) return 'purple'; // 목표 초과
    if (percentage >= 81) return 'green';
    if (percentage >= 51) return 'yellow';
    return 'blue';
  };

  const color = getColor();

  return (
    <div className="progress-container">
      <div className="progress-text">
        복습 중 {current}/{total}
        {overGoal && ' 🎉'}
      </div>

      <div className="progress-bar-wrapper">
        <div
          className={`progress-bar-fill ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="progress-percentage">
        {Math.round(percentage)}%
      </div>
    </div>
  );
};
```

**CSS** (`ProgressBar.css`):
```css
.progress-container {
  margin: 12px 0;
}

.progress-text {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 6px;
}

.progress-bar-wrapper {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 4px;
}

.progress-bar-fill {
  height: 100%;
  transition: width 0.3s ease, background-color 0.3s ease;
  border-radius: 4px;
}

.progress-bar-fill.blue {
  background: linear-gradient(90deg, #0284c7 0%, #0ea5e9 100%);
}

.progress-bar-fill.yellow {
  background: linear-gradient(90deg, #eab308 0%, #facc15 100%);
}

.progress-bar-fill.green {
  background: linear-gradient(90deg, #16a34a 0%, #22c55e 100%);
}

.progress-bar-fill.purple {
  background: linear-gradient(90deg, #a855f7 0%, #c084fc 100%);
}

.progress-percentage {
  font-size: 0.75rem;
  color: #6b7280;
  text-align: right;
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .progress-text {
    font-size: 0.8rem;
  }

  .progress-bar-wrapper {
    height: 6px;
  }
}
```

---

### 7.3 CompletionModal 컴포넌트

**파일 경로**: `/src/components/CompletionModal/CompletionModal.tsx`

**인터페이스**:
```typescript
interface CompletionModalProps {
  isOpen: boolean;
  goal: number;           // 목표 개수
  completed: number;      // 완료 개수
  onContinue: () => void; // "계속 복습하기" 클릭
  onClose: () => void;    // "종료" 클릭
}
```

**구현 예시**:
```typescript
import React, { useState, useEffect } from 'react';
import './CompletionModal.css';

const MESSAGES = [
  "오늘도 성장하고 있어요! 💪 내일도 함께 해요!",
  "{goal}개 복습 완료! 꾸준함이 실력이 돼요! 🌟",
  "목표 달성! 이런 열정이면 금방 늘 거예요! 🔥"
];

export const CompletionModal: React.FC<CompletionModalProps> = ({
  isOpen,
  goal,
  completed,
  onContinue,
  onClose
}) => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      // 랜덤 메시지 선택
      const randomIndex = Math.floor(Math.random() * MESSAGES.length);
      const selectedMessage = MESSAGES[randomIndex].replace('{goal}', String(goal));
      setMessage(selectedMessage);
    }
  }, [isOpen, goal]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="completion-modal" onClick={(e) => e.stopPropagation()}>
        <div className="celebration-icon">🎉</div>

        <h2 className="completion-title">
          {completed}개 복습 완료!
        </h2>

        <p className="completion-message">{message}</p>

        <div className="completion-actions">
          <button className="continue-btn" onClick={onContinue}>
            계속 복습하기
          </button>
          <button className="close-btn" onClick={onClose}>
            종료
          </button>
        </div>
      </div>
    </div>
  );
};
```

**CSS** (`CompletionModal.css`):
```css
.completion-modal {
  background: white;
  border-radius: 20px;
  padding: 40px 32px;
  max-width: 380px;
  width: 90%;
  text-align: center;
  animation: slideUp 0.4s ease;
}

.celebration-icon {
  font-size: 4rem;
  animation: bounce 0.5s ease;
  margin-bottom: 16px;
}

.completion-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 12px 0;
}

.completion-message {
  font-size: 1rem;
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 28px 0;
}

.completion-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.continue-btn,
.close-btn {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.continue-btn {
  background: #0284c7;
  border: none;
  color: white;
}

.continue-btn:hover {
  background: #0369a1;
}

.close-btn {
  background: white;
  border: 2px solid #e5e7eb;
  color: #6b7280;
}

.close-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .completion-modal {
    padding: 32px 24px;
  }

  .celebration-icon {
    font-size: 3rem;
  }

  .completion-title {
    font-size: 1.3rem;
  }

  .completion-message {
    font-size: 0.9rem;
  }
}
```

---

### 7.4 AnswerComparison 컴포넌트

**파일 경로**: `/src/components/AnswerComparison/AnswerComparison.tsx`

**인터페이스**:
```typescript
interface AnswerComparisonProps {
  userAnswer: string;      // 사용자 입력
  bestAnswer: string;      // Best Answer
  koreanSentence: string;  // 원본 한국어 (Tip 생성용)
}
```

**구현 예시**:
```typescript
import React, { useMemo } from 'react';
import './AnswerComparison.css';

// Tip 생성 로직
const generateTip = (userAnswer: string, bestAnswer: string): { message: string; isPerfect: boolean } => {
  const userLower = userAnswer.toLowerCase().trim();
  const bestLower = bestAnswer.toLowerCase().trim();

  // 완전 일치
  if (userLower === bestLower) {
    return {
      message: "🎉 완벽해요! Best Answer와 같은 표현을 사용하셨네요!",
      isPerfect: true
    };
  }

  // 축약형 차이
  if (bestLower.includes("'ll") && userLower.includes("will")) {
    return {
      message: "일상 대화에서는 축약형(I'll, You'll)이 더 자연스러워요",
      isPerfect: false
    };
  }

  if (bestLower.includes("'m") && userLower.includes("am")) {
    return {
      message: "구어체에서는 축약형(I'm, You're)을 많이 사용해요",
      isPerfect: false
    };
  }

  // 시제 차이
  if (bestLower.includes("have been") && (userLower.includes(" am ") || userLower.includes(" is "))) {
    return {
      message: "현재완료 시제를 사용하면 계속된 상태를 더 명확히 표현할 수 있어요",
      isPerfect: false
    };
  }

  // 관사 차이
  if (bestLower.includes(" the ") && !userLower.includes(" the ")) {
    return {
      message: "특정한 대상을 가리킬 때는 정관사 'the'를 사용하세요",
      isPerfect: false
    };
  }

  if (!bestLower.includes(" the ") && userLower.includes(" the ")) {
    return {
      message: "일반적인 대상을 가리킬 때는 관사를 생략하거나 'a/an'을 사용해요",
      isPerfect: false
    };
  }

  // 전치사 차이
  if ((bestLower.includes(" on ") && userLower.includes(" in ")) ||
      (bestLower.includes(" in ") && userLower.includes(" on "))) {
    return {
      message: "시간/장소 표현 시 전치사 선택에 주의하세요 (in/on/at)",
      isPerfect: false
    };
  }

  // 기본값
  return {
    message: "Best Answer를 참고하여 자연스러운 표현을 익혀보세요!",
    isPerfect: false
  };
};

export const AnswerComparison: React.FC<AnswerComparisonProps> = ({
  userAnswer,
  bestAnswer,
  koreanSentence
}) => {
  const { message: tip, isPerfect } = useMemo(
    () => generateTip(userAnswer, bestAnswer),
    [userAnswer, bestAnswer]
  );

  const displayUserAnswer = userAnswer.trim() || "(작성하지 않음)";

  return (
    <div className="answer-comparison">
      <div className="user-answer-section">
        <div className="answer-label">내 답:</div>
        <div className="answer-text user-answer">{displayUserAnswer}</div>
      </div>

      <div className="best-answer-section">
        <div className="answer-label">✨ Best:</div>
        <div className="answer-text best-answer">{bestAnswer}</div>
      </div>

      <div className={`tip-section ${isPerfect ? 'perfect' : ''}`}>
        <div className="tip-icon">💡</div>
        <div className="tip-text">{tip}</div>
      </div>
    </div>
  );
};
```

**CSS** (`AnswerComparison.css`):
```css
.answer-comparison {
  margin-top: 16px;
}

.user-answer-section,
.best-answer-section {
  margin-bottom: 12px;
}

.answer-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 6px;
}

.answer-text {
  padding: 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  line-height: 1.5;
  word-wrap: break-word;
  max-height: 150px;
  overflow-y: auto;
}

.user-answer {
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  color: #1f2937;
  font-weight: 400;
}

.best-answer {
  background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%);
  border: 1px solid #fde047;
  color: #78350f;
  font-weight: 500;
}

.tip-section {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 12px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  margin-top: 12px;
}

.tip-section.perfect {
  background: #dcfce7;
  border-color: #86efac;
}

.tip-icon {
  font-size: 1rem;
  flex-shrink: 0;
  margin-top: 2px;
}

.tip-text {
  font-size: 0.8rem;
  color: #1e40af;
  line-height: 1.5;
}

.tip-section.perfect .tip-text {
  color: #166534;
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .answer-text {
    font-size: 0.85rem;
    padding: 10px;
  }

  .tip-text {
    font-size: 0.75rem;
  }
}
```

---

### 7.5 PracticePanel 통합

**수정 파일**: `/src/components/PracticePanel/PracticePanel.tsx`

**주요 변경 사항**:
```typescript
import React, { useState, useEffect, useCallback } from 'react';
import { practiceService } from '../../services';
import { PracticeSentence } from '../../types';
import { GoalSelectionModal } from '../GoalSelectionModal/GoalSelectionModal';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import { CompletionModal } from '../CompletionModal/CompletionModal';
import { AnswerComparison } from '../AnswerComparison/AnswerComparison';
import './PracticePanel.css';

interface ReviewSession {
  date: string;
  goal: number;
  completed: number;
  achievedGoal: boolean;
  timestamp: number;
}

export const PracticePanel: React.FC = () => {
  // 기존 상태
  const [sentence, setSentence] = useState<PracticeSentence | null>(null);
  const [userInput, setUserInput] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 새로운 상태 (복습 목표)
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [reviewGoal, setReviewGoal] = useState<number | null>(null);
  const [currentReviewCount, setCurrentReviewCount] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // 새로운 상태 (답변 비교)
  const [submittedAnswer, setSubmittedAnswer] = useState('');

  // localStorage에서 선호 목표 불러오기
  useEffect(() => {
    const savedPreference = localStorage.getItem('reviewGoalPreference');
    if (savedPreference) {
      const preference = parseInt(savedPreference, 10);
      if ([5, 10, 20].includes(preference)) {
        // 자동 적용하지 않고 모달만 준비
      }
    }
  }, []);

  const loadSentence = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setUserInput('');
    setSubmittedAnswer('');
    setIsCompleted(false);
    setShowAnswer(false);

    try {
      const data = await practiceService.getSentence();
      setSentence(data);
    } catch (err) {
      setError('문장을 불러오지 못했어요. 다시 시도해주세요!');
      console.error('Failed to load practice sentence:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // 초기 로딩은 하지 않고, 목표 설정 후 시작
  }, []);

  const handleStartReview = () => {
    setShowGoalModal(true);
  };

  const handleSelectGoal = (goal: number) => {
    setReviewGoal(goal);
    setCurrentReviewCount(0);
    localStorage.setItem('reviewGoalPreference', String(goal));
    setShowGoalModal(false);
    loadSentence(); // 첫 문장 로드
  };

  const handleNext = () => {
    setIsCompleted(true);

    // 진도 업데이트
    const newCount = currentReviewCount + 1;
    setCurrentReviewCount(newCount);

    // 목표 달성 체크
    if (reviewGoal && newCount >= reviewGoal) {
      // 완료 모달 표시
      setShowCompletionModal(true);

      // localStorage에 세션 저장
      saveReviewSession(reviewGoal, newCount, true);
    } else {
      // 다음 문장 로드
      setTimeout(() => {
        loadSentence();
      }, 500);
    }
  };

  const handleShowAnswer = () => {
    setSubmittedAnswer(userInput); // 답변 저장
    setShowAnswer(true);
  };

  const handleContinueReview = () => {
    setShowCompletionModal(false);
    setShowGoalModal(true); // 목표 재설정
  };

  const handleCloseCompletion = () => {
    setShowCompletionModal(false);
    setReviewGoal(null);
    setCurrentReviewCount(0);
  };

  const saveReviewSession = (goal: number, completed: number, achievedGoal: boolean) => {
    try {
      const session: ReviewSession = {
        date: new Date().toISOString().split('T')[0], // "2026-01-06"
        goal,
        completed,
        achievedGoal,
        timestamp: Date.now()
      };

      // 기존 세션 불러오기
      const savedSessions = localStorage.getItem('reviewSessions');
      const sessions: ReviewSession[] = savedSessions ? JSON.parse(savedSessions) : [];

      // 새 세션 추가
      sessions.push(session);

      // 30일 이상 된 세션 삭제
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      const filteredSessions = sessions.filter(s => s.timestamp > thirtyDaysAgo);

      // 저장
      localStorage.setItem('reviewSessions', JSON.stringify(filteredSessions));
    } catch (error) {
      console.error('Failed to save review session:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && userInput.trim()) {
      handleShowAnswer();
    }
  };

  // 복습 시작 전 (목표 미설정)
  if (!reviewGoal) {
    return (
      <div className="practice-panel">
        <div className="practice-header">
          <span className="practice-label">✏️ 오늘의 연습</span>
        </div>
        <div className="start-review-prompt">
          <button className="start-review-btn" onClick={handleStartReview}>
            🔄 복습 시작
          </button>
        </div>

        <GoalSelectionModal
          isOpen={showGoalModal}
          onClose={() => setShowGoalModal(false)}
          onSelectGoal={handleSelectGoal}
          defaultGoal={parseInt(localStorage.getItem('reviewGoalPreference') || '10', 10)}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="practice-panel">
        <div className="practice-header">
          <span className="practice-label">✏️ 오늘의 연습</span>
        </div>
        <ProgressBar current={currentReviewCount} total={reviewGoal} />
        <div className="practice-loading">문장을 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="practice-panel practice-error">
        <div className="practice-header">
          <span className="practice-label">✏️ 오늘의 연습</span>
          <button
            type="button"
            className="skip-btn"
            onClick={loadSentence}
            title="다시 시도"
          >
            ↻
          </button>
        </div>
        <ProgressBar current={currentReviewCount} total={reviewGoal} />
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!sentence) return null;

  return (
    <>
      <div className="practice-panel">
        <div className="practice-header">
          <span className="practice-label">✏️ 오늘의 연습</span>
          <button
            type="button"
            className="skip-btn"
            onClick={loadSentence}
            title="다른 문장"
          >
            ↻
          </button>
        </div>

        {/* 진도 표시 */}
        <ProgressBar current={currentReviewCount} total={reviewGoal} />

        <div className="practice-sentence">
          <p className="korean-text">{sentence.korean}</p>
          <p className="hint-text">💡 {sentence.hint}</p>
        </div>

        <div className="practice-input-area">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="영어로 작성해보세요... (Enter로 정답 확인)"
            className="practice-input"
            disabled={isCompleted}
          />
        </div>

        {/* 답변 비교 UI */}
        {showAnswer && (
          <AnswerComparison
            userAnswer={submittedAnswer}
            bestAnswer={sentence.bestAnswer}
            koreanSentence={sentence.korean}
          />
        )}

        {userInput.trim() && !isCompleted && (
          <div className="practice-actions">
            {!showAnswer && (
              <button
                type="button"
                className="action-btn show-answer"
                onClick={handleShowAnswer}
              >
                👀 정답 보기
              </button>
            )}
            <button
              type="button"
              className="action-btn next"
              onClick={handleNext}
            >
              ➡️ 다음 문장
            </button>
          </div>
        )}

        {isCompleted && (
          <div className="practice-complete">
            다음 문장을 불러오는 중...
          </div>
        )}
      </div>

      {/* 완료 축하 모달 */}
      <CompletionModal
        isOpen={showCompletionModal}
        goal={reviewGoal}
        completed={currentReviewCount}
        onContinue={handleContinueReview}
        onClose={handleCloseCompletion}
      />
    </>
  );
};
```

**추가 CSS** (`PracticePanel.css`):
```css
/* 복습 시작 프롬프트 */
.start-review-prompt {
  padding: 32px 0;
  text-align: center;
}

.start-review-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  background: #0284c7;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.start-review-btn:hover {
  background: #0369a1;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
}
```

---

## 8. UI/UX 명세

### 8.1 전체 사용자 플로우

```
┌─────────────────────────────────────────────────────┐
│  Step 1: PracticePanel 진입                          │
│  ┌──────────────────────────────────────────┐       │
│  │  ✏️ 오늘의 연습                            │       │
│  │  ┌────────────────────────────────┐      │       │
│  │  │  🔄 복습 시작                   │      │       │
│  │  └────────────────────────────────┘      │       │
│  └──────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────┘
                    ↓ 클릭
┌─────────────────────────────────────────────────────┐
│  Step 2: 목표 선택 모달                              │
│  ┌──────────────────────────────────────────┐       │
│  │  🎯 오늘의 복습 목표를 선택해주세요!     │       │
│  │  ┌──────┐  ┌──────┐  ┌──────┐           │       │
│  │  │ 5개  │  │ 10개 │  │ 20개 │           │       │
│  │  └──────┘  └──────┘  └──────┘           │       │
│  │           [시작하기 →]                   │       │
│  └──────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────┘
                    ↓ 선택
┌─────────────────────────────────────────────────────┐
│  Step 3: 복습 진행                                   │
│  ┌──────────────────────────────────────────┐       │
│  │  ✏️ 오늘의 연습                      ↻   │       │
│  │  복습 중 1/10                            │       │
│  │  ▓▓░░░░░░░░░░░░░░░░ 10%                │       │
│  │                                          │       │
│  │  나는 3년 동안 영어를 공부하고 있어       │       │
│  │  💡 현재완료 시제 사용                   │       │
│  │                                          │       │
│  │  ┌────────────────────────────────┐     │       │
│  │  │ I am studying English...       │     │       │
│  │  └────────────────────────────────┘     │       │
│  │                                          │       │
│  │  [👀 정답 보기]  [➡️ 다음 문장]          │       │
│  └──────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────┘
                    ↓ 정답 보기
┌─────────────────────────────────────────────────────┐
│  Step 4: 답변 비교                                   │
│  ┌──────────────────────────────────────────┐       │
│  │  내 답:                                  │       │
│  │  I am studying English for 3 years       │       │
│  │                                          │       │
│  │  ✨ Best:                                │       │
│  │  I have been studying English for 3 years│       │
│  │                                          │       │
│  │  💡 Tip:                                 │       │
│  │  현재완료 시제를 사용하면 계속된 상태를   │       │
│  │  더 명확히 표현할 수 있어요              │       │
│  │                                          │       │
│  │  [➡️ 다음 문장]                          │       │
│  └──────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────┘
                    ↓ 10개 완료
┌─────────────────────────────────────────────────────┐
│  Step 5: 완료 축하                                   │
│  ┌──────────────────────────────────────────┐       │
│  │            🎉                             │       │
│  │                                          │       │
│  │       10개 복습 완료!                    │       │
│  │                                          │       │
│  │  오늘도 성장하고 있어요! 💪              │       │
│  │  내일도 함께 해요!                       │       │
│  │                                          │       │
│  │  [계속 복습하기]  [종료]                 │       │
│  └──────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────┘
```

---

### 8.2 색상 팔레트

**기존 PracticePanel 색상 재사용**:
```css
/* 파란색 계열 (기본) */
--blue-50: #f0f9ff;
--blue-100: #e0f2fe;
--blue-200: #bae6fd;
--blue-300: #7dd3fc;
--blue-500: #0ea5e9;
--blue-600: #0284c7;
--blue-700: #0369a1;

/* 노란색 계열 (Best Answer) */
--yellow-50: #fefce8;
--yellow-100: #fef9c3;
--yellow-300: #fde047;
--yellow-500: #eab308;

/* 초록색 계열 (성공, 완료) */
--green-50: #dcfce7;
--green-300: #86efac;
--green-500: #22c55e;
--green-600: #16a34a;

/* 회색 계열 (사용자 답변) */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-500: #6b7280;
--gray-900: #1f2937;

/* 보라색 계열 (목표 초과) */
--purple-400: #c084fc;
--purple-500: #a855f7;
```

---

### 8.3 타이포그래피

```css
/* 제목 (모달 헤더) */
.modal-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
}

/* 본문 (메시지) */
.message-text {
  font-size: 1rem;
  font-weight: 400;
  color: #6b7280;
  line-height: 1.6;
}

/* 작은 텍스트 (라벨, Tip) */
.small-text {
  font-size: 0.8rem;
  font-weight: 400;
  color: #6b7280;
}

/* 진도 텍스트 */
.progress-text {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1f2937;
}

/* 버튼 텍스트 */
.button-text {
  font-size: 1rem;
  font-weight: 600;
}
```

---

### 8.4 애니메이션

**모달 진입 애니메이션**:
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 적용 */
.modal-overlay {
  animation: fadeIn 0.2s ease;
}

.modal-content {
  animation: slideUp 0.3s ease;
}
```

**축하 아이콘 애니메이션**:
```css
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.celebration-icon {
  animation: bounce 0.5s ease;
}
```

**프로그레스 바 애니메이션**:
```css
.progress-bar-fill {
  transition: width 0.3s ease, background-color 0.3s ease;
}
```

---

### 8.5 반응형 브레이크포인트

```css
/* 모바일 (768px 이하) */
@media (max-width: 768px) {
  .modal-content {
    width: 90%;
    padding: 20px;
  }

  .goal-btn {
    padding: 12px;
  }

  .goal-number {
    font-size: 1.3rem;
  }

  .progress-text {
    font-size: 0.8rem;
  }

  .answer-text {
    font-size: 0.85rem;
  }
}

/* 태블릿 (769px ~ 1024px) */
@media (min-width: 769px) and (max-width: 1024px) {
  .modal-content {
    max-width: 500px;
  }
}

/* 데스크탑 (1025px 이상) */
@media (min-width: 1025px) {
  .modal-content {
    max-width: 400px;
  }
}
```

---

## 9. 테스트 시나리오

### 9.1 기능 테스트 (Manual QA)

#### Test Case 1: 복습 목표 설정
**시나리오**: 사용자가 복습 시작 → 목표 선택 → 복습 진행

| Step | 동작 | 기대 결과 |
|------|------|-----------|
| 1 | PracticePanel 진입 | "🔄 복습 시작" 버튼 표시 |
| 2 | "복습 시작" 클릭 | 목표 선택 모달 표시, 10개 기본 선택됨 |
| 3 | "5개" 선택 | 5개 버튼 하이라이트 (파란색 배경) |
| 4 | "시작하기" 클릭 | 모달 닫힘, 첫 문장 로드, 진도 "복습 중 0/5" |
| 5 | localStorage 확인 | `reviewGoalPreference: "5"` 저장됨 |

**엣지 케이스**:
- [ ] 모달 외부 클릭 시 닫힘
- [ ] ESC 키로 닫힘
- [ ] "시작하기" 버튼 없이 목표만 선택 후 외부 클릭: 모달만 닫힘 (복습 시작 안 됨)

---

#### Test Case 2: 진도 표시
**시나리오**: 복습 진행 → 진도 업데이트 → 색상 변화 확인

| Step | 동작 | 기대 결과 |
|------|------|-----------|
| 1 | 목표 10개 설정 | 진도 "복습 중 0/10" (0%) |
| 2 | 첫 문장 "다음 문장" 클릭 | 진도 "복습 중 1/10" (10%), 파란색 |
| 3 | 5개 완료 | 진도 "복습 중 5/10" (50%), 파란색 |
| 4 | 6개 완료 | 진도 "복습 중 6/10" (60%), 노란색 |
| 5 | 9개 완료 | 진도 "복습 중 9/10" (90%), 초록색 |
| 6 | 10개 완료 | 축하 모달 표시 |

**엣지 케이스**:
- [ ] 목표 초과 (10개 목표인데 12개 복습): "복습 중 12/10 (120%)", 보라색
- [ ] 모바일에서 진도 표시 깨짐 없는지 확인

---

#### Test Case 3: 답변 비교 UI
**시나리오**: 사용자 입력 → 정답 보기 → 비교 UI 확인

| Step | 동작 | 기대 결과 |
|------|------|-----------|
| 1 | 한국어: "나는 보고서를 쓸 거야" | - |
| 2 | 사용자 입력: "I will write the report" | - |
| 3 | Enter 또는 "정답 보기" 클릭 | 비교 UI 표시 |
| 4 | 내 답 영역 확인 | "I will write the report" (회색 배경) |
| 5 | Best Answer 확인 | "I'll write the report" (노란색 배경) |
| 6 | Tip 확인 | "일상 대화에서는 축약형(I'll)이 더 자연스러워요" (파란색 배경) |

**엣지 케이스**:
- [ ] 빈 답변 제출: "(작성하지 않음)" 표시
- [ ] 완전 일치 답변: "🎉 완벽해요!" 메시지 + 초록색 배경
- [ ] 200자 이상 긴 답변: 스크롤 가능, 말줄임 없음
- [ ] 특수문자 포함 답변: 정상 표시 (escape 처리)

---

#### Test Case 4: 완료 축하 메시지
**시나리오**: 목표 달성 → 축하 모달 → 추가 복습 또는 종료

| Step | 동작 | 기대 결과 |
|------|------|-----------|
| 1 | 목표 10개 설정 | - |
| 2 | 10개 완료 | 축하 모달 표시, 🎉 bounce 애니메이션 |
| 3 | 격려 메시지 확인 | 3가지 중 1개 랜덤 표시 |
| 4 | [계속 복습하기] 클릭 | 목표 선택 모달 재표시 |
| 5 | "5개" 선택 → 시작 | 진도 "복습 중 0/5" (리셋됨) |
| 6 | 5개 완료 → [종료] 클릭 | 모달 닫힘, 복습 세션 종료 |

**엣지 케이스**:
- [ ] localStorage에 세션 저장 확인 (date, goal, completed, achievedGoal)
- [ ] 30일 이상 된 세션 자동 삭제 확인

---

### 9.2 통합 테스트 (E2E)

#### E2E Test 1: 초보 지수 시나리오
```
1. PracticePanel 진입
2. "복습 시작" 클릭
3. "5개 가볍게" 선택 → 시작
4. 5개 문장 풀이:
   - 각 문장마다 답 입력
   - "정답 보기" 클릭
   - 내 답 vs Best 비교 확인
   - Tip 읽기
   - "다음 문장" 클릭
5. 5개 완료 → 축하 모달
6. [종료] 클릭
7. localStorage 확인:
   - reviewGoalPreference: "5"
   - reviewSessions: [{date, goal: 5, completed: 5, achievedGoal: true}]
```

**기대 결과**:
- ✅ 진도 표시로 "3/5" 확인 가능
- ✅ 축하 메시지로 성취감 증가
- ✅ Tip으로 학습 효과 증대

---

#### E2E Test 2: 직장인 민호 시나리오
```
1. 아침 7시, 출근 전
2. "복습 시작" → "5개 가볍게" 선택
3. 빠르게 5개 완료 (각 문장 30초 이내)
4. 축하 모달 → [종료] 클릭
5. 저녁 8시, 재방문
6. "복습 시작" → 이전 선택 "5개" 자동 적용 (localStorage)
7. 5개 더 복습
8. 총 10개 복습 (2세션)
```

**기대 결과**:
- ✅ 시간 효율적 (목표 명확)
- ✅ 재방문율 증가
- ✅ localStorage에 2개 세션 저장

---

#### E2E Test 3: 완벽주의 수진 시나리오
```
1. "복습 시작" → "20개 열심히" 선택
2. 꼼꼼하게 20개 풀이:
   - 각 문장마다 내 답 vs Best 비교
   - Tip 여러 번 읽기
   - 차이점 메모 (별도)
3. 20개 완료 → 축하 모달
4. [계속 복습하기] 클릭 → "10개" 선택
5. 추가 10개 복습
6. 총 30개 복습 (목표 초과)
```

**기대 결과**:
- ✅ 진도 표시로 "25/20 (125%)" 확인 (보라색)
- ✅ 답 비교 기능으로 학습 효과 극대화
- ✅ localStorage에 2개 세션 저장 (20개, 10개)

---

### 9.3 성능 테스트

#### Performance Test 1: localStorage 용량
**목적**: 30일 데이터 저장 시 용량 확인

**시나리오**:
1. 30일간 매일 3세션씩 저장 (총 90세션)
2. localStorage 용량 측정
3. 자동 삭제 로직 동작 확인

**기대 결과**:
- ✅ 90세션 저장 시 용량: 약 10-20KB (1MB 이하)
- ✅ 30일 이상 된 세션 자동 삭제
- ✅ 브라우저 제한(5MB) 미달

---

#### Performance Test 2: 애니메이션 성능
**목적**: 60fps 유지 확인

**시나리오**:
1. 모달 진입/퇴장 애니메이션
2. 🎉 bounce 애니메이션
3. 프로그레스 바 진행 애니메이션

**기대 결과**:
- ✅ 모든 애니메이션 60fps 유지
- ✅ 모바일에서도 버벅임 없음

---

### 9.4 접근성 테스트 (Accessibility)

#### A11y Test 1: 키보드 접근성
| 동작 | 기대 결과 |
|------|-----------|
| Tab 키로 버튼 포커스 이동 | 모든 버튼 포커스 가능 |
| Enter 키로 버튼 클릭 | 정상 동작 |
| ESC 키로 모달 닫기 | 모달 닫힘 |
| Enter 키로 정답 보기 | 기존 기능 유지 |

#### A11y Test 2: 스크린 리더
| 요소 | aria-label |
|------|-----------|
| "복습 시작" 버튼 | "복습 시작" |
| 목표 선택 버튼 | "5개 가볍게", "10개 기본", "20개 열심히" |
| 진도 표시 | "복습 중 3/10" |
| Tip 영역 | "학습 팁" |

---

## 10. 리스크 & 대응

### 10.1 기술적 리스크

#### Risk 1: localStorage 용량 제한
**발생 가능성**: 낮음 (30일 데이터만 저장)
**영향도**: 중간

**대응 방안**:
1. **예방**: 30일 자동 삭제 로직 구현
2. **감지**: localStorage.setItem 시 try-catch로 에러 감지
3. **복구**: 에러 발생 시 오래된 세션 강제 삭제 후 재시도
4. **장기 계획**: Week 2 이후 서버 저장으로 전환

```typescript
try {
  localStorage.setItem('reviewSessions', JSON.stringify(sessions));
} catch (error) {
  if (error.name === 'QuotaExceededError') {
    // 강제 정리: 최근 10일만 남기기
    const tenDaysAgo = Date.now() - (10 * 24 * 60 * 60 * 1000);
    const recentSessions = sessions.filter(s => s.timestamp > tenDaysAgo);
    localStorage.setItem('reviewSessions', JSON.stringify(recentSessions));
  }
}
```

---

#### Risk 2: 긴 답변으로 UI 깨짐
**발생 가능성**: 중간
**영향도**: 낮음

**대응 방안**:
1. **예방**: max-height + overflow-y: auto로 스크롤 처리
2. **테스트**: 200자 이상 답변으로 테스트
3. **모바일 확인**: 작은 화면에서도 깨지지 않는지 확인

```css
.answer-text {
  max-height: 150px;
  overflow-y: auto;
  word-wrap: break-word;
}
```

---

#### Risk 3: Tip 생성 규칙 부족
**발생 가능성**: 높음 (다양한 답변 패턴)
**영향도**: 낮음 (기본 메시지로 대응)

**대응 방안**:
1. **예방**: 5가지 주요 규칙 구현 (축약형, 시제, 관사, 전치사, 완전 일치)
2. **대응**: 규칙 미감지 시 기본 메시지 표시
3. **개선**: Week 2 이후 AI API 기반 Tip 생성으로 전환
4. **데이터 수집**: 규칙 미감지 케이스 로깅 → 추후 규칙 추가

```typescript
// 기본 메시지로 대응
return {
  message: "Best Answer를 참고하여 자연스러운 표현을 익혀보세요!",
  isPerfect: false
};
```

---

### 10.2 사용성 리스크

#### Risk 4: 복습 기능을 안 쓸 수 있음
**발생 가능성**: 중간
**영향도**: 높음 (핵심 기능)

**대응 방안**:
1. **예방**: "🔄 복습 시작" 버튼 눈에 잘 띄게 배치 (PracticePanel 상단)
2. **유도**: 첫 복습 시 온보딩 팝업 (Week 2)
3. **측정**: 복습 버튼 클릭률 추적
4. **개선**: 클릭률 낮으면 버튼 위치/문구 변경

**목표**: 즐겨찾기 사용자의 30% 이상 복습 버튼 클릭

---

#### Risk 5: 목표 설정이 번거로울 수 있음
**발생 가능성**: 낮음
**영향도**: 낮음

**대응 방안**:
1. **예방**: 기본값 10개 자동 선택 (클릭 1번으로 시작 가능)
2. **편의**: 이전 선택값 localStorage 저장 → 재방문 시 자동 적용
3. **빠른 경로**: "시작하기" 버튼만 클릭해도 복습 시작 (목표 변경 선택 사항)

---

#### Risk 6: 모바일 UX 불편
**발생 가능성**: 중간
**영향도**: 중간

**대응 방안**:
1. **예방**: 반응형 디자인 우선 설계
2. **테스트**: iPhone SE (작은 화면)부터 iPad (큰 화면)까지 테스트
3. **터치 영역**: 버튼 최소 44px × 44px (iOS 권장 크기)
4. **폰트 크기**: 모바일 0.75rem ~ 0.85rem (가독성 확보)

**필수 테스트 디바이스**:
- iPhone SE (375px)
- iPhone 14 Pro (393px)
- iPad (768px)

---

### 10.3 일정 리스크

#### Risk 7: 5일 안에 완성 못 할 수 있음
**발생 가능성**: 낮음 (단순 기능)
**영향도**: 중간

**대응 방안**:
1. **예방**: Day 1-2 진도 체크 (50% 완성 확인)
2. **우선순위**: P0 기능 먼저 완성, P1은 Week 2로 연기 가능
3. **버퍼**: Day 5는 테스트/버그 수정 전용 (새 기능 추가 금지)
4. **에스컬레이션**: Day 3 시점에 진도 부족하면 즉시 공유

**최소 완성 기준 (MVP)**:
- ✅ 목표 선택 모달
- ✅ 진도 표시
- ✅ 답변 비교 UI (Tip 제외 가능)
- ⚠️ 완료 축하 메시지 (선택 사항, Week 2 가능)

---

## 11. 최종 체크리스트 (Definition of Done)

### Week 1 완료 기준

**기능 완성도**:
- [ ] GoalSelectionModal 구현 완료
- [ ] ProgressBar 구현 완료
- [ ] CompletionModal 구현 완료
- [ ] AnswerComparison 구현 완료
- [ ] PracticePanel 통합 완료

**테스트 완료**:
- [ ] 5명 페르소나 시나리오 테스트 (각 1회씩)
- [ ] 엣지 케이스 테스트 (즐겨찾기 부족, 목표 초과 등)
- [ ] 모바일 반응형 테스트 (iPhone SE, iPad)
- [ ] localStorage 저장/불러오기 테스트
- [ ] 30일 자동 삭제 로직 테스트

**버그 제로**:
- [ ] 치명적 버그 0개 (앱 크래시, 데이터 손실 등)
- [ ] 사용성 저해 버그 0개 (UI 깨짐, 동작 안 됨 등)
- [ ] 경미한 버그 3개 이하 (문구 오타, 색상 살짝 다름 등)

**성능 기준**:
- [ ] 모달 로딩 시간 < 200ms
- [ ] 진도 업데이트 지연 < 100ms
- [ ] localStorage 저장 시간 < 50ms
- [ ] 애니메이션 60fps 유지

**문서화**:
- [ ] README 업데이트 (새 기능 설명)
- [ ] 컴포넌트 주석 추가 (인터페이스, 주요 로직)
- [ ] localStorage 데이터 구조 문서화

**지표 준비**:
- [ ] localStorage에 reviewSessions 저장 확인
- [ ] 복습률 측정 준비 (즐겨찾기 재방문 추적)
- [ ] 5명 페르소나 재평가 일정 잡기 (Week 1 종료 직후)

---

## 12. 다음 단계 (Week 2 Preview)

Week 1 완료 후 Week 2에서 진행할 사항:

**P1 개선 (학습 효과 집중)**:
1. **간격 반복 알고리즘**:
   - 오늘/3일/1주 복습 주기 구현
   - 복습 due date 계산 로직
   - 복습 알림 (브라우저 알림 또는 인앱)

2. **중복 방지**:
   - 오늘 이미 본 문장 제외
   - 복습 이력 관리 (localStorage)

3. **통계 확장**:
   - 이번 주 복습 개수
   - 연속 학습 일수 (streak)
   - 복습 완료율 차트

4. **AI 기반 Tip**:
   - chatService 활용한 실시간 차이점 분석
   - 더 정교한 Tip 생성

**예상 기간**: 7일 (Week 2 전체)

---

## 부록 A: localStorage 데이터 구조

### A.1 reviewGoalPreference
**타입**: string
**값**: "5" | "10" | "20"
**설명**: 사용자가 선호하는 복습 목표 개수

**예시**:
```json
"10"
```

---

### A.2 reviewSessions
**타입**: JSON string (ReviewSession[])
**설명**: 복습 세션 기록 (최근 30일)

**인터페이스**:
```typescript
interface ReviewSession {
  date: string;         // "2026-01-06"
  goal: number;         // 10
  completed: number;    // 10
  achievedGoal: boolean; // true
  timestamp: number;    // 1704556800000
}
```

**예시**:
```json
[
  {
    "date": "2026-01-06",
    "goal": 10,
    "completed": 10,
    "achievedGoal": true,
    "timestamp": 1704556800000
  },
  {
    "date": "2026-01-06",
    "goal": 5,
    "completed": 5,
    "achievedGoal": true,
    "timestamp": 1704570000000
  }
]
```

**자동 정리 로직**:
- 30일 이상 된 세션 자동 삭제
- 최대 100개 세션까지만 보관 (용량 제한)

---

## 부록 B: 컴포넌트 의존성 다이어그램

```
PracticePanel (기존)
├── GoalSelectionModal (신규)
│   ├── useState (목표 선택)
│   └── localStorage (선호 목표 저장/불러오기)
├── ProgressBar (신규)
│   ├── current (현재 진행 개수)
│   └── total (목표 개수)
├── CompletionModal (신규)
│   ├── useState (메시지 랜덤 선택)
│   └── onContinue / onClose
└── AnswerComparison (신규)
    ├── submittedAnswer (사용자 답변 보존)
    ├── bestAnswer (PracticeSentence)
    └── generateTip (규칙 기반 Tip 생성)
```

**의존성 순서**:
1. GoalSelectionModal (독립)
2. ProgressBar (독립)
3. AnswerComparison (독립)
4. CompletionModal (독립)
5. PracticePanel (1~4 통합)

---

## 부록 C: Git 브랜치 전략

**브랜치 구조**:
```
main
└── feature/week1-review-improvements
    ├── feature/goal-selection-modal
    ├── feature/progress-bar
    ├── feature/completion-modal
    └── feature/answer-comparison
```

**작업 순서**:
1. `feature/week1-review-improvements` 브랜치 생성
2. Day 1-2: `feature/goal-selection-modal`, `feature/progress-bar` 작업
3. Day 3-4: `feature/answer-comparison` 작업
4. Day 5: 통합 + 테스트
5. Week 1 종료: `feature/week1-review-improvements` → `main` PR

**커밋 메시지 컨벤션**:
```
feat: add GoalSelectionModal component
feat: add ProgressBar component
feat: add CompletionModal component
feat: add AnswerComparison component with rule-based Tip generation
refactor: integrate new components into PracticePanel
test: add E2E tests for 5 personas
fix: resolve mobile responsive issues on ProgressBar
docs: update README with new review features
```

---

## 부록 D: PM 한마디

> **PM 전제의 메시지**:
>
> "Week 1은 **속도**가 생명입니다! 5일 안에 P0 기능을 완성하고, 5명 사용자의 만족도를 3.4 → 4.5+로 올리는 게 목표예요.
>
> 핵심은 **복습 목표 설정**과 **내 답 비교**입니다. 이 두 기능만 잘 만들어도 사용자 반응이 확 달라질 거예요!
>
> Tip 생성은 규칙 기반으로 단순하게 시작하고, Week 2에 AI로 업그레이드하면 됩니다. 일단 빠르게 출시해서 사용자 반응을 보는 게 최고예요! 🚀
>
> 5일 후 5명이 '이제야 WriteBuddy가 완성된 것 같아요!'라고 말하는 모습을 기대합니다! 화이팅! 💪"

---

**문서 버전**: 1.0.0
**작성일**: 2026-01-06
**작성자**: WriteBuddy PM
**다음 리뷰**: Day 3 (중간 점검)
**최종 검토**: Day 5 (Week 1 종료)
