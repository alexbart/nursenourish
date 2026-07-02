/**
 * API Response helpers adhering to the standard:
 *
 * Success (200):       { data: T }
 * Created (201):       { message: string, data: T }
 * Deleted (204):       No body
 * Error (4xx/5xx):     { error: { code: string, message: string } }
 */

export const apiSuccess = <T>(data: T) => ({
  data,
});

export const apiCreated = <T>(message: string, data: T) => ({
  message,
  data,
});

export const apiError = (code: string, message: string) => ({
  error: { code, message },
});