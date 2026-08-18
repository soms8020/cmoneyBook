import { authService } from '../services/authService.js';
import { z } from 'zod';
import { sendSuccess } from '../utils/response.js';
import { ValidationError } from '../middleware/errorHandler.js';

// 입력값 검증 스키마
const registerSchema = z.object({
    email: z.string().email('유효한 이메일을 입력해주세요.'),
    password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다.'),
    name: z.string().min(1, '이름을 입력해주세요.').max(50, '이름은 50자 이내여야 합니다.'),
});

const loginSchema = z.object({
    email: z.string().email('유효한 이메일을 입력해주세요.'),
    password: z.string().min(1, '비밀번호를 입력해주세요.'),
});

export const authController = {
    /**
     * 회원가입
     */
    async register(req, res, next) {
        try {
            const validatedData = registerSchema.parse(req.body);

            const authData = await authService.register(validatedData);

            sendSuccess(res, authData, 201);
        } catch (error) {
            if (error instanceof z.ZodError) {
                next(new ValidationError('입력값이 올바르지 않습니다.', error.errors));
            } else {
                next(error);
            }
        }
    },

    /**
     * 로그인
     */
    async login(req, res, next) {
        try {
            const { email, password } = loginSchema.parse(req.body);

            const authData = await authService.login(email, password);

            sendSuccess(res, authData);
        } catch (error) {
            if (error instanceof z.ZodError) {
                next(new ValidationError('입력값이 올바르지 않습니다.', error.errors));
            } else {
                next(error);
            }
        }
    },

    /**
     * 유저 정보 확인 (Me)
     */
    async getMe(req, res, next) {
        try {
            // authenticate 미들웨어를 통해 설정된 req.user.id 접근
            const userId = req.user.id;
            const user = await authService.getUserById(userId);

            sendSuccess(res, user);
        } catch (error) {
            next(error);
        }
    }
};
