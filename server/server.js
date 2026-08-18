import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import app from './src/app.js';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`✅ 경조사 장부 API 서버가 포트 ${PORT}에서 실행 중입니다.`);
    console.log(`   http://localhost:${PORT}/api/health`);
});
