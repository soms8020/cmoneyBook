export class AppError extends Error {
    constructor(statusCode, code, message, details = []) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
    }
}

export class ValidationError extends AppError {
    constructor(message, details) {
        super(400, 'VALIDATION_ERROR', message, details);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message) {
        super(401, 'UNAUTHORIZED', message);
    }
}

export class NotFoundError extends AppError {
    constructor(message) {
        super(404, 'NOT_FOUND', message);
    }
}

export class ConflictError extends AppError {
    constructor(message) {
        super(409, 'CONFLICT', message);
    }
}

export function errorHandler(err, req, res, next) {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            error: {
                code: err.code,
                message: err.message,
                details: err.details,
            },
        });
    }

    console.error('Unhandled error:', err);
    return res.status(500).json({
        success: false,
        error: {
            code: 'INTERNAL_ERROR',
            message: '서버 내부 오류가 발생했습니다.',
        },
    });
}
