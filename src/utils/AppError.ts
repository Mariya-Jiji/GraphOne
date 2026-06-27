/**
 * AppError — typed application error that carries an HTTP status code
 * and a machine-readable error code string.
 *
 * Usage:
 *   throw new AppError('NOT_FOUND', 'Company not found', 404);
 *
 * The centralised errorHandler middleware catches AppError instances and
 * formats them into the standard { error: { code, message } } response shape.
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(code: string, message: string, statusCode = 500) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = true; // Distinguishes expected errors from programming bugs

    // Restore prototype chain (required when extending built-in classes in TS)
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

// ─── Convenience factories ────────────────────────────────────────────────────

export const notFound = (resource: string) =>
  new AppError('NOT_FOUND', `${resource} not found`, 404);

export const badRequest = (message: string) =>
  new AppError('BAD_REQUEST', message, 400);

export const unauthorized = (message = 'Unauthorized') =>
  new AppError('UNAUTHORIZED', message, 401);

export const forbidden = (message = 'Forbidden') =>
  new AppError('FORBIDDEN', message, 403);

export const conflict = (message: string) =>
  new AppError('CONFLICT', message, 409);

export const internalError = (message = 'Internal server error') =>
  new AppError('INTERNAL_ERROR', message, 500);
