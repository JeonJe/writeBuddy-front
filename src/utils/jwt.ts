/**
 * JWT Token Utilities
 *
 * SECURITY NOTE: These utilities only decode and validate token structure/expiry.
 * Actual signature verification must be done server-side.
 */

interface JWTPayload {
  exp?: number;
  iat?: number;
  sub?: string;
  [key: string]: unknown;
}

/**
 * Decodes a JWT token without verifying the signature.
 * WARNING: This should only be used for reading claims, not for security decisions.
 * Always verify tokens server-side.
 */
export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    // Base64Url decode
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

/**
 * Checks if a JWT token is expired.
 * Returns true if expired or invalid, false if still valid.
 *
 * @param token - JWT token string
 * @param bufferSeconds - Optional buffer time before actual expiry (default: 60 seconds)
 */
export const isTokenExpired = (token: string, bufferSeconds: number = 60): boolean => {
  const payload = decodeJWT(token);

  if (!payload || typeof payload.exp !== 'number') {
    // If we can't decode or no exp claim, consider it expired for safety
    return true;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  // Add buffer to handle clock skew and give time for refresh
  return payload.exp < currentTime + bufferSeconds;
};

/**
 * Gets the remaining time until token expiry in seconds.
 * Returns 0 if expired or invalid.
 */
export const getTokenRemainingTime = (token: string): number => {
  const payload = decodeJWT(token);

  if (!payload || typeof payload.exp !== 'number') {
    return 0;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const remaining = payload.exp - currentTime;

  return remaining > 0 ? remaining : 0;
};

/**
 * Validates token structure (not signature).
 * Returns true if token has valid JWT structure.
 */
export const isValidTokenStructure = (token: string): boolean => {
  if (!token || typeof token !== 'string') {
    return false;
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return false;
  }

  // Try to decode payload
  return decodeJWT(token) !== null;
};
