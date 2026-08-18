import jwt from 'jsonwebtoken';
import { UnauthorizedError } from './errorHandler.js';

/**
 * JWT 토큰 검증 및 사용자 인증 미들웨어
 */
export const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedError('인증 토큰이 제공되지 않았습니다.');
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // req.user에 사용자 정보 저장
        req.user = {
            id: decoded.id,
            email: decoded.email,
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            next(new UnauthorizedError('토큰이 만료되었습니다. 다시 로그인해주세요.'));
        } else if (error.name === 'JsonWebTokenError') {
            next(new UnauthorizedError('유효하지 않은 토큰입니다.'));
        } else {
            next(error);
        }
    }
};
