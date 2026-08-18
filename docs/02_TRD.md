# 🔧 Technical Requirements Document (TRD)
## 경조사비 관리 앱 - 기술 요구사항 정의서

---

## 1. 시스템 아키텍처

### 1.1 전체 아키텍처

```
┌─────────────────────────────────────────────────┐
│                   Client (Browser)               │
│  ┌─────────────────────────────────────────────┐ │
│  │         React SPA (Vite Build)               │ │
│  │  ┌─────────┐ ┌──────────┐ ┌──────────────┐ │ │
│  │  │  Pages   │ │Components│ │   Hooks      │ │ │
│  │  └─────────┘ └──────────┘ └──────────────┘ │ │
│  │  ┌─────────────────────────────────────────┐ │ │
│  │  │        API Service Layer (fetch)        │ │ │
│  │  └─────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────┘ │
└───────────────────────┬─────────────────────────┘
                        │ HTTP/HTTPS (REST API)
┌───────────────────────▼─────────────────────────┐
│                Server (Node.js)                  │
│  ┌─────────────────────────────────────────────┐ │
│  │          Express.js Router                   │ │
│  │  ┌──────────┐ ┌──────────┐ ┌────────────┐  │ │
│  │  │Controller│ │Middleware │ │ Validator  │  │ │
│  │  └──────────┘ │ (Auth)   │ └────────────┘  │ │
│  │               └──────────┘                 │ │
│  │  ┌─────────────────────────────────────────┐ │ │
│  │  │          Service Layer                  │ │ │
│  │  └─────────────────────────────────────────┘ │ │
│  │  ┌─────────────────────────────────────────┐ │ │
│  │  │       Drizzle ORM (Repository)          │ │ │
│  │  └─────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────┘ │
└───────────────────────┬─────────────────────────┘
                        │ TCP (PostgreSQL Protocol)
┌───────────────────────▼─────────────────────────┐
│              Vercel Postgres                     │
│  ┌─────────────────────────────────────────────┐ │
│  │              PostgreSQL DB                   │ │
│  └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### 1.2 레이어 설계 원칙

| 레이어 | 역할 | 원칙 |
|--------|------|------|
| **Presentation** | React UI 컴포넌트 | 비즈니스 로직 배제, 순수 UI |
| **API Service** | HTTP 통신 | API 호출 추상화 |
| **Controller** | 요청/응답 핸들링 | 유효성 검증, 응답 포맷팅 |
| **Service** | 비즈니스 로직 | 핵심 도메인 로직 |
| **Repository** | 데이터 접근 | Drizzle ORM 기반 쿼리 |

---

## 2. 프로젝트 구조

```
con_money_book/
├── client/                     # React 프론트엔드
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api/                # API 서비스 레이어
│   │   │   ├── client.js       # axios/fetch 인스턴스
│   │   │   ├── events.js       # 경조사 API
│   │   │   ├── persons.js      # 인물 API
│   │   │   └── stats.js        # 통계 API
│   │   ├── components/         # 재사용 컴포넌트
│   │   │   ├── common/         # 공통 UI (Button, Input, Modal...)
│   │   │   ├── event/          # 경조사 관련 컴포넌트
│   │   │   ├── person/         # 인물 관련 컴포넌트
│   │   │   ├── dashboard/      # 대시보드 컴포넌트
│   │   │   └── layout/         # 레이아웃 컴포넌트
│   │   ├── hooks/              # 커스텀 Hooks
│   │   │   ├── useAuth.js      # 인증 훅
│   │   ├── contexts/           # 전역 상태 (Context API)
│   │   │   └── AuthContext.jsx # 로그인 상태 공유
│   │   ├── pages/              # 페이지 컴포넌트
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── EventListPage.jsx
│   │   │   ├── EventFormPage.jsx
│   │   │   ├── PersonListPage.jsx
│   │   │   ├── PersonDetailPage.jsx
│   │   │   └── StatsPage.jsx
│   │   ├── styles/             # CSS 파일
│   │   │   ├── index.css       # 글로벌 스타일/디자인 토큰
│   │   │   ├── components.css  # 컴포넌트 스타일
│   │   │   └── pages.css       # 페이지 스타일
│   │   ├── utils/              # 유틸리티 함수
│   │   ├── constants/          # 상수 정의
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tests/                  # 프론트엔드 테스트
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Node.js 백엔드
│   ├── src/
│   │   ├── controllers/        # 컨트롤러
│   │   │   ├── authController.js
│   │   │   ├── eventController.js
│   │   │   ├── personController.js
│   │   │   └── statsController.js
│   │   ├── services/           # 비즈니스 로직
│   │   │   ├── authService.js
│   │   │   ├── eventService.js
│   │   │   ├── personService.js
│   │   │   └── statsService.js
│   │   ├── db/                 # 데이터베이스
│   │   │   ├── schema.js       # Drizzle 스키마
│   │   │   ├── index.js        # DB 연결
│   │   │   └── migrations/     # 마이그레이션 파일
│   │   ├── middleware/         # 미들웨어
│   │   │   ├── authHandler.js  # JWT 인증 미들웨어
│   │   │   ├── errorHandler.js
│   │   │   ├── validator.js
│   │   │   └── cors.js
│   │   ├── routes/             # 라우트 정의
│   │   │   ├── authRoutes.js
│   │   │   ├── eventRoutes.js
│   │   │   ├── personRoutes.js
│   │   │   └── statsRoutes.js
│   │   ├── utils/              # 유틸리티
│   │   └── app.js              # Express 앱 설정
│   ├── tests/                  # 백엔드 테스트
│   ├── package.json
│   ├── drizzle.config.js       # Drizzle 설정
│   └── server.js               # 서버 엔트리포인트
│
├── docs/                       # 문서
└── package.json                # 루트 패키지 (워크스페이스)
```

---

## 3. 프론트엔드 기술 상세

### 3.1 React 설정
- **빌드 도구**: Vite 5+
- **React 버전**: React 18+
- **라우팅**: React Router v6 (Protected Routes 설정)
- **상태 관리**: Context API (Auth 관련), 커스텀 훅
- **HTTP 클라이언트**: fetch API + 인증 인터셉터 패턴

### 3.2 반응형 디자인 브레이크포인트

| 구분 | 범위 | 레이아웃 |
|------|------|----------|
| **Mobile** | ~599px | 1컬럼, 하단 네비게이션 |
| **Tablet** | 600~1023px | 2컬럼, 사이드바 축소 |
| **Desktop** | 1024px~ | 3컬럼, 풀 사이드바 |

### 3.3 디자인 시스템

```css
/* 디자인 토큰 */
:root {
  /* Colors */
  --color-primary: #6366f1;        /* Indigo */
  --color-primary-light: #818cf8;
  --color-primary-dark: #4f46e5;
  --color-success: #22c55e;        /* 수입 */
  --color-danger: #ef4444;         /* 지출 */
  --color-warning: #f59e0b;
  --color-neutral-50: #fafafa;
  --color-neutral-900: #171717;

  /* Typography */
  --font-family: 'Pretendard', -apple-system, sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;

  /* Border Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
}
```

---

## 4. 백엔드 기술 상세

### 4.1 Express 설정
- **Node.js**: v20 LTS+
- **Express**: v4.18+
- **보안 및 인증**: jsonwebtoken (JWT), bcryptjs (비밀번호 해싱)
- **유효성 검증**: Zod
- **에러 핸들링**: 커스텀 에러 클래스 + 글로벌 핸들러

### 4.2 API 설계 원칙
- RESTful 설계
- JWT를 `Authorization: Bearer <token>` 헤더로 처리
- 사용자 격리(Multi-tenant): 조회·수정 시 항상 `req.user.id` 활용
- JSON 응답 포맷 통일
- HTTP 상태 코드 준수
- 페이지네이션: cursor-based 또는 offset-based
- 에러 응답 표준화

### 4.3 응답 포맷

```json
// 성공 응답
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}

// 에러 응답
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "금액은 양수여야 합니다.",
    "details": [...]
  }
}
```

---

## 5. 데이터베이스 기술 상세

### 5.1 Drizzle ORM 설정
- **드라이버**: `@vercel/postgres` + `drizzle-orm/vercel-postgres`
- **마이그레이션**: `drizzle-kit` 사용
- **스키마**: TypeScript/JavaScript 기반 선언적 스키마

### 5.2 연결 설정
```javascript
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from './schema';

export const db = drizzle(sql, { schema });
```

### 5.3 환경 변수
```
POSTGRES_URL=postgres://...
POSTGRES_URL_NON_POOLING=postgres://...
POSTGRES_USER=...
POSTGRES_HOST=...
POSTGRES_PASSWORD=...
POSTGRES_DATABASE=...
```

---

## 6. 개발 방법론

### 6.1 SDD (Schema-Driven Development)
1. **스키마 우선**: Drizzle 스키마를 먼저 정의
2. **타입 자동 생성**: 스키마에서 TypeScript 타입 추론
3. **마이그레이션 자동 생성**: `drizzle-kit generate`
4. **API 자동 검증**: Zod 스키마와 DB 스키마 연동

### 6.2 TDD (Test-Driven Development)
1. **Red**: 실패하는 테스트 먼저 작성
2. **Green**: 테스트를 통과하는 최소 코드 작성
3. **Refactor**: 코드 정리 및 개선

### 6.3 테스트 전략

| 레벨 | 도구 | 커버리지 목표 |
|------|------|---------------|
| **단위 테스트** | Vitest | 서비스 레이어 80%+ |
| **컴포넌트 테스트** | React Testing Library | 주요 컴포넌트 100% |
| **API 통합 테스트** | Supertest + Vitest | 모든 엔드포인트 |
| **E2E 테스트** | (향후) Playwright | 주요 시나리오 |

---

## 7. 개발 환경 설정

### 7.1 개발 서버
- **프론트엔드**: `vite dev` (포트 5173)
- **백엔드**: `nodemon` (포트 3001)
- **프록시**: Vite의 proxy 설정으로 API 요청 전달

### 7.2 코드 품질 도구
| 도구 | 용도 |
|------|------|
| ESLint | 코드 린팅 |
| Prettier | 코드 포맷팅 |
| Husky | Git Hooks |

---

## 8. 배포 전략

### 8.1 Vercel 배포
- **프론트엔드**: Vercel 정적 배포
- **백엔드**: Vercel Serverless Functions 또는 별도 서버
- **DB**: Vercel Postgres (이미 통합)

### 8.2 CI/CD
- GitHub Actions 기반
- PR 시 자동 테스트
- main 브랜치 머지 시 자동 배포
