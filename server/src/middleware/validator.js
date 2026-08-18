import { AppError } from './errorHandler.js';

export function validate(schema) {
    return (req, res, next) => {
        try {
            req.body = schema.parse(req.body);
            next();
        } catch (err) {
            const details = err.errors?.map(e => ({
                field: e.path.join('.'),
                message: e.message,
            })) || [];
            next(new AppError(400, 'VALIDATION_ERROR', '입력 데이터가 유효하지 않습니다.', details));
        }
    };
}
