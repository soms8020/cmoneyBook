import express from 'express';
import { authController } from '../controllers/authController.js';
import { authenticate } from '../middleware/authHandler.js';

const router = express.Router();

// Public 라우트
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected 라우트
router.get('/me', authenticate, authController.getMe);

export default router;
