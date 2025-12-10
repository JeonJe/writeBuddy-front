# ✍️ WriteBuddy

**AI 기반 영어 문법 교정 서비스**

WriteBuddy는 OpenAI를 활용한 실시간 영어 문법 교정 웹 애플리케이션입니다. 영어 학습자들이 보다 정확하고 자연스러운 영어 문장을 작성할 수 있도록 도와줍니다.

## 🌟 주요 기능

### 📝 AI 문법 교정
- **실시간 교정**: OpenAI 기반 즉시 문법 검사 및 교정
- **품질 평가**: 1-10점 척도로 문장 품질 평가
- **자동 번역**: 원문과 교정문의 한국어 번역 제공
- **친근한 피드백**: 재미있고 이해하기 쉬운 설명
- **단어 학습**: 클릭으로 단어 의미 및 예문 확인

### 📊 학습 관리
- **교정 내역**: 과거 교정 기록 저장 및 조회
- **즐겨찾기**: 중요한 교정 내용 북마크
- **필터링**: 고득점/복습필요 문장 분류
- **검색**: 교정 기록 내 키워드 검색

### 💬 AI 영어 도우미
- **AI 채팅**: 영어 학습 관련 질문 및 상담
- **마크다운 지원**: 구조화된 답변 렌더링
- **사이드 패널**: 교정하면서 바로 질문 가능

## 🛠️ 기술 스택

### Frontend
- **React 19** - UI 프레임워크
- **TypeScript** - 타입 안전성
- **React Router 7** - SPA 라우팅
- **react-markdown** - AI 응답 마크다운 렌더링
- **DOMPurify** - XSS 방지

### Backend
- **Spring Boot** - REST API 서버
- **Kotlin** - 백엔드 언어
- **JPA/Hibernate** - 데이터베이스 ORM

### AI Integration
- **OpenAI API** - GPT 기반 문법 교정 및 채팅

### Deployment
- **Vercel** - 프론트엔드 호스팅
- **Railway** - 백엔드 호스팅

## 🚀 시작하기

### 사전 요구사항
- Node.js 18+
- npm 또는 yarn

### 설치 및 실행

```bash
# 레포지토리 클론
git clone https://github.com/your-username/writebuddy.git
cd writebuddy

# 의존성 설치
npm install

# 개발 서버 시작
npm start
```

애플리케이션이 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

### 환경 설정

프로젝트 루트에 `.env` 파일을 생성하고 필요한 환경 변수를 설정하세요:

```env
REACT_APP_API_BASE_URL=http://localhost:7071
REACT_APP_API_TIMEOUT=30000
```

## 📱 주요 페이지

| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/` | 홈페이지 | 문법 교정 입력 및 결과, AI 채팅 |
| `/history` | 교정 내역 | 과거 교정 기록 조회 및 검색 |

## 🏗️ 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 UI 컴포넌트
│   ├── ChatInterface/   # AI 채팅 인터페이스
│   ├── CorrectionInput/ # 입력 폼
│   ├── CorrectionResult/# 교정 결과 표시
│   ├── CorrectionHistory/# 교정 기록 리스트
│   ├── ResultCarousel/  # 세션 결과 캐러셀
│   ├── Navigation/      # 상단 네비게이션
│   └── Toast/           # 토스트 알림
├── pages/               # 페이지 컴포넌트
│   ├── HomePage.tsx     # 메인 교정 페이지
│   └── HistoryPage.tsx  # 교정 기록 페이지
├── contexts/            # React Context (상태 관리)
├── hooks/               # 커스텀 훅
├── services/            # API 서비스
├── types/               # TypeScript 타입 정의
├── config/              # 설정 파일
└── utils/               # 유틸리티 함수
```

## 🔨 스크립트

```bash
npm start      # 개발 서버 시작
npm run build  # 프로덕션 빌드
npm test       # 테스트 실행
npm run prod   # 프로덕션 환경으로 실행
```

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

---

**Happy Writing with WriteBuddy! ✨**
