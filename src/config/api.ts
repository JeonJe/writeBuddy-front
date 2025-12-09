export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:7071',
  TIMEOUT: Number(process.env.REACT_APP_API_TIMEOUT) || 30000,
  ENDPOINTS: {
    // Auth endpoints
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    // Correction endpoints
    CORRECTIONS: '/corrections',
    FAVORITES: '/corrections/favorites',
    GOOD_EXPRESSIONS: '/corrections/users/{userId}/good-expressions',
    // Chat endpoint
    CHAT: '/chat',
  },
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: '📡 인터넷 연결이 불안정해요. 연결 상태를 확인해주세요!',
  SERVER_ERROR: '🔧 서버가 잠시 쉬고 있어요. 조금만 기다려주세요!',
  VALIDATION_ERROR: '✏️ 입력 내용을 다시 확인해주세요.',
  NOT_FOUND: '🔍 요청한 내용을 찾을 수 없어요.',
  UNAUTHORIZED: '🔐 로그인이 필요합니다.',
  FORBIDDEN: '🚫 접근 권한이 없어요.',
  TIMEOUT: '⏰ 요청 시간이 초과됐어요. 다시 시도해주세요!',
  UNKNOWN: '😅 앗, 문제가 생겼어요. 다시 시도해주세요!',
} as const;
