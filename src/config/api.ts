// API 설정 및 상수
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:7071',
  TIMEOUT: Number(process.env.REACT_APP_API_TIMEOUT) || 30000,
  ENDPOINTS: {
    CORRECTIONS: '/corrections',
    FAVORITES: '/corrections/favorites',
    // 🆕 통합 통계 API (메인)
    UNIFIED_STATISTICS: '/statistics',
    // 🔄 기존 API (Deprecated - 하위 호환성)
    STATISTICS: '/corrections/statistics',
    AVERAGE_SCORE: '/corrections/average-score',
    DAILY_DASHBOARD: '/corrections/dashboard/daily',
    SCORE_TREND: '/corrections/dashboard/score-trend',
    ERROR_PATTERNS: '/corrections/dashboard/error-patterns',
    GOOD_EXPRESSIONS: '/corrections/users/{userId}/good-expressions',
  },
} as const;

// HTTP 상태 코드
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// 에러 메시지
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '네트워크 연결을 확인해주세요.',
  SERVER_ERROR: '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
  VALIDATION_ERROR: '입력값을 확인해주세요.',
  NOT_FOUND: '요청한 데이터를 찾을 수 없습니다.',
  UNAUTHORIZED: '인증이 필요합니다.',
  FORBIDDEN: '권한이 없습니다.',
  TIMEOUT: '요청 시간이 초과되었습니다.',
  UNKNOWN: '알 수 없는 오류가 발생했습니다.',
} as const;