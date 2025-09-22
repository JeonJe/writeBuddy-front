export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:7071',
  TIMEOUT: Number(process.env.REACT_APP_API_TIMEOUT) || 30000,
  ENDPOINTS: {
    CORRECTIONS: '/corrections',
    FAVORITES: '/corrections/favorites',
    GOOD_EXPRESSIONS: '/corrections/users/{userId}/good-expressions',
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
  NETWORK_ERROR: '네트워크 연결을 확인해주세요.',
  SERVER_ERROR: '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
  VALIDATION_ERROR: '입력값을 확인해주세요.',
  NOT_FOUND: '요청한 데이터를 찾을 수 없습니다.',
  UNAUTHORIZED: '인증이 필요합니다.',
  FORBIDDEN: '권한이 없습니다.',
  TIMEOUT: '요청 시간이 초과되었습니다.',
  UNKNOWN: '알 수 없는 오류가 발생했습니다.',
} as const;
