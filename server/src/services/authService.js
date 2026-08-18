import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ValidationError, NotFoundError, ConflictError, UnauthorizedError } from '../middleware/errorHandler.js';

export class AuthService {
    /**
     * 회원가입
     */
    async register(data) {
        // 이메일 중복 체크
        const existingUser = await db.select().from(users).where(eq(users.email, data.email));
        if (existingUser.length > 0) {
            throw new ConflictError('이미 가입된 이메일입니다.');
        }

        // 비밀번호 해싱
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);

        // 사용자 생성
        const [newUser] = await db.insert(users).values({
            email: data.email,
            password: hashedPassword,
            name: data.name,
        }).returning({
            id: users.id,
            email: users.email,
            name: users.name,
            createdAt: users.createdAt,
        });

        return this.generateAuthResponse(newUser);
    }

    /**
     * 로그인
     */
    async login(email, password) {
        const [user] = await db.select().from(users).where(eq(users.email, email));

        if (!user) {
            throw new UnauthorizedError('이메일 또는 비밀번호가 올바르지 않습니다.');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new UnauthorizedError('이메일 또는 비밀번호가 올바르지 않습니다.');
        }

        const userInfo = {
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
        };

        return this.generateAuthResponse(userInfo);
    }

    /**
     * 사용자 ID로 정보 조회
     */
    async getUserById(id) {
        const [user] = await db.select({
            id: users.id,
            email: users.email,
            name: users.name,
            createdAt: users.createdAt,
        }).from(users).where(eq(users.id, id));

        if (!user) {
            throw new NotFoundError('사용자를 찾을 수 없습니다.');
        }

        return user;
    }

    /**
     * JWT 토큰 발급 및 응답 객체 생성
     */
    generateAuthResponse(user) {
        const secret = process.env.JWT_SECRET || "super-secret-jwt-key-for-dev-12345";
        const token = jwt.sign(
            { id: user.id, email: user.email },
            secret,
            { expiresIn: '7d' } // 7일 유지
        );

        return {
            user,
            token,
        };
    }
}

export const authService = new AuthService();
