import express from 'express';
import cors from 'cors';
import personRoutes from './routes/personRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
app.use(cors({
    origin: allowedOrigin === '*' ? '*' : allowedOrigin.split(','),
    credentials: allowedOrigin !== '*',
}));

app.use(express.json());

// Routes
app.use('/api/v1/persons', personRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/groups', groupRoutes);
app.use('/api/v1/stats', statsRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: '경조사 장부 API 서버 정상 동작 중', timestamp: new Date().toISOString() });
});

// 404
app.use((req, res) => {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: '요청한 경로를 찾을 수 없습니다.' } });
});

// Error handler
app.use(errorHandler);

export default app;
