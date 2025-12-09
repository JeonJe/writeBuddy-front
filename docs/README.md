# WriteBuddy

AI 기반 영어 문법 교정 서비스

## 기술 스택

| 구분 | 기술 |
|------|------|
| Frontend | React 19 + TypeScript |
| Backend | Spring Boot + Kotlin |
| 인증 | Google OAuth2 |

## 개발 환경

```bash
# Frontend: http://localhost:8080
npm install && npm start

# Backend: http://localhost:9091
```

## 주요 기능

- **교정**: AI 기반 영어 문법 교정 + 점수 (1-10)
- **즐겨찾기**: 중요한 교정 결과 북마크
- **실제 예시**: 교정 결과와 관련된 실제 사용 사례 (영화, 음악 등)

## API

### 교정
```http
POST /corrections          # 교정 요청
GET  /corrections          # 목록 조회
PUT  /corrections/{id}/favorite  # 즐겨찾기 토글
PUT  /corrections/{id}/memo      # 메모 수정
```

### 인증
```http
GET  /auth/status          # 로그인 상태
GET  /auth/user            # 사용자 정보
POST /logout               # 로그아웃
GET  /oauth2/authorization/google  # Google 로그인
```

## 프로젝트 구조

```
src/
├── components/   # UI 컴포넌트
├── pages/        # 페이지
├── hooks/        # 커스텀 훅
├── services/     # API 서비스
├── types/        # TypeScript 타입
├── contexts/     # React Context
└── utils/        # 유틸리티
```

## 환경 변수

```bash
# .env
REACT_APP_API_BASE_URL=http://localhost:9091
PORT=8080

# Backend
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```
