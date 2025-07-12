# ✍️ WriteBuddy

**AI 기반 영어 문법 교정 서비스**

WriteBuddy는 OpenAI를 활용한 실시간 영어 문법 교정 웹 애플리케이션입니다. 영어 학습자들이 보다 정확하고 자연스러운 영어 문장을 작성할 수 있도록 도와줍니다.

## 🌟 주요 기능

### 📝 AI 문법 교정
- **실시간 교정**: OpenAI 기반 즉시 문법 검사 및 교정
- **품질 평가**: 1-10점 척도로 문장 품질 평가
- **자동 번역**: 원문과 교정문의 한국어 번역 제공
- **친근한 피드백**: 재미있고 이해하기 쉬운 설명

### 📊 학습 관리
- **교정 내역**: 과거 교정 기록 저장 및 조회
- **즐겨찾기**: 중요한 교정 내용 북마크
- **학습 통계**: 개인별 학습 진도 및 성취도 추적
- **좋은 표현**: 10점 만점 문장들을 별도 분류

### 💬 영어 도우미
- **AI 채팅**: 영어 학습 관련 질문 및 상담
- **실시간 대화**: 사이드 패널을 통한 편리한 접근

## 🛠️ 기술 스택

### Frontend
- **React 19** - 메인 프레임워크
- **TypeScript** - 타입 안전성
- **React Router** - SPA 라우팅
- **CSS Modules** - 컴포넌트 스타일링

### Backend
- **Spring Boot** - REST API 서버
- **Kotlin** - 백엔드 언어
- **JPA/Hibernate** - 데이터베이스 ORM
- **H2 Database** - 개발용 인메모리 DB

### AI Integration
- **OpenAI API** - GPT 기반 문법 교정
- **통합 JSON 응답** - 교정과 예시를 한 번에 생성
- **최적화된 성능** - API 호출 50% 감소

## 🚀 시작하기

### 사전 요구사항
- Node.js 16+
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
# 개발 환경
REACT_APP_API_BASE_URL=http://localhost:9091
REACT_APP_API_TIMEOUT=30000

# 프로덕션 환경 (자동 설정됨)
# REACT_APP_API_BASE_URL=https://writebuddy.up.railway.app
```

## 📱 주요 페이지

- **홈페이지** (`/`) - 문법 교정 입력 및 결과
- **교정 내역** (`/history`) - 과거 교정 기록 조회
- **학습 통계** (`/stats`) - 개인 학습 데이터 분석

## 🏗️ 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 UI 컴포넌트
├── pages/              # 페이지 컴포넌트
├── contexts/           # React Context (상태 관리)
├── hooks/              # 커스텀 훅
├── services/           # API 서비스
├── types/              # TypeScript 타입 정의
├── config/             # 설정 파일
└── utils/              # 유틸리티 함수
```

## 🔨 빌드

```bash
# 프로덕션 빌드
npm run build
```

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 생성해 주세요.

---

**Happy Writing with WriteBuddy! ✨**