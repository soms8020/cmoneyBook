# 🎊 경조사비 관리 앱 — AI 페어 프로그래밍 전체 개발기

> **프로젝트명**: 경조사 장부 (Congratulatory Money Book)
> **배포 URL**: [https://cmoney-book.vercel.app](https://cmoney-book.vercel.app)
> **GitHub**: [https://github.com/soms8020/cmoneyBook](https://github.com/soms8020/cmoneyBook)
> **개발 도구**: Antigravity (Google DeepMind AI Coding Agent)
> **개발 기간**: 2026.08.18 ~ 08.19

---

# Part 1. 프롬프트 전체 기록 및 개발 과정

## 🟢 Step 0: 최초 기획 의뢰 (프로젝트 킥오프)

### 프롬프트
> **"경조사비 관리 앱을 만들어줘"**

### AI가 한 일
사용자가 "경조사비 관리 앱"이라는 한 줄의 아이디어만 던졌고, AI가 이를 바탕으로 기획 전체를 설계했습니다.

- 제품 비전 및 문제 정의
- 목표 사용자(20~60대 직장인/가정주부) 도출 
- **핵심 기능 5개 (MVP)** 정의: 경조사 지출/수입 기록, 인물별 내역 조회, 대시보드, 인물 관리
- **부가 기능 3개 (v2.0)** 정의: 금액 추천, 검색/필터, 데이터 내보내기
- 기술 스택 선정 (React + Express + Drizzle ORM + Neon PostgreSQL + Vercel)
- **7개 설계 문서 초안** 자동 생성

### 생성된 산출물
| 문서 | 파일명 | 내용 |
|------|--------|------|
| 제품 요구사항 정의서 | `01_PRD.md` | 제품 비전, MVP 기능 5개, 릴리스 계획 |
| 기술 요구사항 정의서 | `02_TRD.md` | 3-Tier 아키텍처, API 설계 원칙, 디자인 토큰 |
| 데이터 모델 설계서 | `03_DataModel.md` | persons, events, groups 테이블 ERD |
| API 명세서 | `04_API_Spec.md` | REST 엔드포인트, 요청/응답 포맷 |
| 컴포넌트 명세서 | `05_Component_Spec.md` | React 컴포넌트 트리, Props 정의 |
| 요구사항 명세서 | `06_Requirements_Spec.md` | 기능/비기능 요구사항 테이블 |
| 테스트 케이스 | `07_Test_Cases.md` | 서비스별 단위 테스트 케이스 |

> 📌 **Git 커밋**: `docs: 경조사비 관리 앱 기획 문서 세트 작성 (PRD, TRD, DataModel, API, Component, Requirements, TestCases)`

---

## 🟢 Step 1: 설계 승인 및 전체 구현 착수

### 프롬프트
> **"이대로 진행해줘" / "추천대로 진행해줘" / "구현해줘"**

### AI가 한 일
7개 설계 문서 기반으로 **백엔드 + 프론트엔드 전체 구현**을 한 번에 수행했습니다.

**백엔드 (server/):**
- Drizzle ORM 스키마 구현 (`schema.js` — persons, events, groups 테이블)
- Neon PostgreSQL 연결 (`db/index.js`)
- Service Layer — `personService.js`, `eventService.js`, `statsService.js`
- Controller Layer — Zod 검증 + 표준 응답 포맷팅
- Express Router 설정
- 에러 핸들링 미들웨어 (`AppError` 클래스)
- `drizzle-kit push`로 Neon DB에 실제 테이블 생성

**프론트엔드 (client/):**
- Vite + React 프로젝트 셋업
- CSS 디자인 시스템 (`index.css` — 디자인 토큰, 반응형 브레이크포인트)
- 공통 컴포넌트 — Button, Input, Modal, Card, Badge, Toast
- Layout 컴포넌트 — 사이드바 + 메인 영역 반응형
- 6개 페이지 구현:
  - `DashboardPage` — 수입/지출 요약, 최근 내역, 월별 통계
  - `EventListPage` — 경조사 내역 목록 + 필터 + 페이지네이션
  - `EventFormPage` — 경조사 등록/수정 폼
  - `PersonListPage` — 인물 목록 관리
  - `PersonDetailPage` — 인물별 경조사 이력
  - `StatsPage` — 관계별/유형별/월별 통계 차트
- API Client Layer (`client/src/api/`) — fetch 래퍼 + 도메인별 API 모듈
- React Router v6 라우팅

> 📌 **Git 커밋**: `feat: 경조사비 관리 앱 전체 구현 (백엔드+프론트엔드)`

---

## 🟢 Step 2: 추가 구현 및 기능 보완

### 프롬프트
> **"이어서 진행해줘"**

### AI가 한 일
- 앞서 미완성된 부분(통계 서비스 로직, 인물 상세 보기 등)의 보완
- 앱 전체 동작 검증 및 로컬 개발 서버 기동 테스트
- 브라우저를 열어 각 페이지의 렌더링 상태를 스크린샷으로 촬영하며 시각 검증

---

## 🟢 Step 3: Vercel 배포 준비

### 프롬프트
> **"vercel에 deploy 하려는데, 이에 맞게 git에 push해줘"**

### AI가 한 일
- **`vercel.json`** 작성 — 빌드 커맨드(`cd client && npm install && npm run build`), 출력 디렉터리(`client/dist`), API Rewrite 규칙(`/api/:path*` → `/api/index`)
- **`api/index.js`** 생성 — Express `app` 객체를 Vercel Serverless Function으로 export
- **Vite Proxy 설정** — 로컬 `npm run dev` 시 `/api` 경로를 `localhost:3001`로 프록시
- **Git 초기 설정** — `.gitignore`, 원격 저장소 연결, 최초 push
- Vercel 자동 배포 트리거

> 📌 **Git 커밋**: `chore: Vercel 배포 설정 추가 (서버리스 함수 및 라우팅)`

---

## 🟢 Step 4: 빌드 오류 해결

### 프롬프트
> **"이어서 처리해줘"** / **"vercel에서 deploy 오류가 나는데, 문제 해결해줘"**

### AI가 한 일
- **빌드 에러 해결**: `useToast` 훅의 import 경로가 잘못 지정되어 Vercel 빌드 실패 → `../components/common`으로 수정
- 로컬 빌드(`npm run build`) 통과 확인 후 재배포

> 📌 **Git 커밋**: `fix: resolve unresolved useToast import in Auth pages`

---

## 🟢 Step 5: 인증(로그인) 기능 설계 문서화

### 프롬프트
> **"로그인 기능을 개발하려고 해. 로그인 기능 개발을 위해서 SDD, TDD를 위한 문서들 업데이트 해줘"**

### AI가 한 일
기존 7개 문서에 인증 기능 관련 내용을 일괄 추가/갱신했습니다.

| 문서 | 추가된 내용 |
|------|------------|
| `01_PRD.md` | F-000(회원가입/로그인) 기능 정의 추가 |
| `02_TRD.md` | JWT + bcrypt 보안 설계, 멀티테넌트 설계 원칙 반영 |
| `03_DataModel.md` | `users` 테이블 스키마 + 기존 테이블에 `userId` FK 추가 |
| `04_API_Spec.md` | `/api/v1/auth/register`, `/login`, `/me` 엔드포인트 |
| `05_Component_Spec.md` | AuthContext, ProtectedRoute, LoginPage, RegisterPage 컴포넌트 |
| `06_Requirements_Spec.md` | FR-A01~A05 인증 관련 기능 요구사항 |
| `07_Test_Cases.md` | TC-AS01~AS05 인증 테스트 케이스 |

---

## 🟢 Step 6: 인증 기능 풀스택 구현

### 프롬프트
> **"계획한대로 구현해줘"**

### AI가 한 일

**백엔드:**
- `authService.js` — 회원가입(bcrypt 해싱), 로그인(비밀번호 비교), JWT 발급(7일 만료)
- `authController.js` — Zod 입력값 검증 + 응답 처리
- `authRoutes.js` — `POST /register`, `POST /login`, `GET /me`
- `authHandler.js` — JWT 검증 미들웨어
- 기존 모든 라우트에 `authenticate` 미들웨어 적용
- 모든 Service 메서드에 `userId` 기반 데이터 격리 필터 추가

**프론트엔드:**
- `AuthContext.jsx` — 전역 인증 상태 관리
- `ProtectedRoute.jsx` — 미인증 사용자 접근 차단 → `/login`으로 리다이렉트
- `LoginPage.jsx` — 로그인 폼 UI
- `RegisterPage.jsx` — 회원가입 폼 UI
- `client.js` — API 요청 시 JWT 토큰 자동 주입 인터셉터 + 401 자동 로그아웃
- `Layout.jsx` — 사이드바에 사용자 이름 표시 및 로그아웃 버튼

> 📌 **Git 커밋**: `feat: Implement authentication and data isolation`

---

## 🟢 Step 7: 변경사항 배포

### 프롬프트
> **"git에 변경사항 반영해서 push 해줘"**

### AI가 한 일
- 인증 시스템 전체 코드 커밋 & push
- Vercel 자동 재배포 트리거

---

## 🟢 Step 8: 초기 화면 UI 반응형 최적화

### 프롬프트
> **"로그인 기능을 구현하고 초화면이 모바일과 pc환경에 최적화가 안되어 있는데, UI 신경써서 초화면을 최적화 구현해줘"**

### AI가 한 일
- **문제 진단**: Tailwind CSS 유틸리티 클래스가 남아있었으나 Tailwind가 설치되지 않아 스타일이 전혀 적용되지 않음 → SVG 아이콘이 화면 전체 차지, 레이아웃 완전 붕괴
- **해결**: `LoginPage.jsx`, `RegisterPage.jsx`의 모든 Tailwind 클래스 제거 후 순수 Vanilla CSS로 재작성
- **디자인 개선**:
  - 은은한 그라데이션 배경 (`linear-gradient`)
  - 모던 카드 레이아웃 + Box Shadow
  - SVG 아이콘 크기 고정
  - 입력 필드 Focus 애니메이션
  - 버튼 Hover/Active 마이크로 인터랙션
- **모바일 반응형** (`@media max-width: 480px`): 카드 UI가 화면 폭에 꽉 차게 확장, 세로 짧은 화면에서 자연스러운 스크롤

> 📌 **Git 커밋**: `style: optimize ui for auth pages and remove tailwind references`

---

## 🟢 Step 9: Vercel 500 에러 대장정 (3단계 디버깅)

### 프롬프트
> **"로그인하거나 회원가입하면 에러가 나는데, 해결해줘"**
> **"deploy후 로그인하려고 하면 똑같이 500에러가 발생하고 있어. 오류 없도록 해결해주고, 테스트해서 문제가 없을 경우 git에 push해줘"**

### 발견 및 해결한 문제 — 총 3건

#### 🔴 버그 1: 프론트 JSON 파싱 크래시
- **증상**: 화면에 `Unexpected token 'A', "A server e"... is not valid JSON` 표시
- **원인**: Vercel 서버가 크래시 나면 JSON이 아닌 HTML 텍스트(`"A server error has occurred"`)를 반환 → 프론트가 `res.json()`으로 강제 파싱 시도하다 폭발
- **해결**: `client.js`에서 `content-type` 헤더를 먼저 확인하여 JSON이 아닌 응답은 별도 예외처리

#### 🔴 버그 2: Vercel 서버리스 모듈 번들링 실패
- **증상**: `FUNCTION_INVOCATION_FAILED`
- **원인**: Vercel은 `api/index.js` 기준으로 루트 폴더의 `package.json`만 참조하여 모듈 번들링 → `server/package.json`에만 있던 `bcryptjs`, `jsonwebtoken` 등을 찾지 못함
- **해결**: 루트 `package.json`에 백엔드 dependencies 전체 복제

#### 🔴 버그 3: 누락 파일 + 미정의 에러 클래스 (핵심 원인!)
- **증상**: 계속되는 `FUNCTION_INVOCATION_FAILED`
- **디버깅 방법**: `api/index.js`를 비동기 try-catch 래퍼로 임시 교체 → Vercel 런타임 에러 스택을 JSON으로 출력하도록 변경 → node 스크립트로 직접 호출
- **1차 발견**: `Cannot find module 'response.js'` → `server/src/utils/response.js` 파일이 아예 없었음 → 신규 작성
- **2차 발견**: `'ConflictError' is not exported` → `errorHandler.js`에 `AppError`만 있고 `ValidationError`, `UnauthorizedError`, `NotFoundError`, `ConflictError` 전부 미정의 → 4개 클래스 전체 신규 구현
- 최종 테스트: API에 직접 요청 → `401 Unauthorized` (정상 JSON 응답) 확인 ✅

> 📌 **관련 Git 커밋들:**
> - `docs: Document error handling principles...`
> - `fix: configure root package.json for Vercel serverless lambda module resolution`
> - `fix: add seamless fallback envs for Vercel deployments`
> - `fix: restore missing response.js module causing application boot crash`
> - `fix: export missing custom error classes causing functional failure`

---

## 🟢 Step 10: 개발 서버 종료 및 정리

### 프롬프트
> **"로컬에 개발할 때 사용한 웹서버 등 서비스 종료해줘"**

### AI가 한 일
- 로컬 프론트엔드 Dev 서버(`npm run dev`)와 백엔드 API 서버(`node server.js`) 전체 종료

---

# Part 2. 실제 웹 사용 방법

## 접속
- 브라우저에서 **[https://cmoney-book.vercel.app](https://cmoney-book.vercel.app)** 접속
- PC, 태블릿, 모바일 모두 반응형 지원

## 회원가입
1. 초기 화면(로그인 페이지) 하단의 **"회원가입"** 링크 클릭
2. **이메일**, **이름**, **비밀번호**(6자 이상) 입력
3. **"회원가입"** 버튼 클릭 → 자동 로그인 후 대시보드 진입

## 로그인
1. 가입한 이메일과 비밀번호 입력
2. **"로그인"** 버튼 클릭 → 7일간 자동 로그인 유지 (JWT)

## 주요 메뉴 사용법

| 메뉴 | 기능 | 사용법 |
|------|------|--------|
| **대시보드** | 전체 요약 | 총 수입/지출 카드, 최근 내역, 월별 통계 확인 |
| **경조사 내역** | 내역 관리 | "새 내역 등록" → 유형·금액·인물·날짜 입력 → 저장 |
| **인물 관리** | 인물 등록/조회 | 인물 추가(이름·관계·그룹), 클릭 시 거래 이력 확인 |
| **통계** | 차트 분석 | 관계별·유형별·월별 수입/지출 시각화 |
| **로그아웃** | 세션 종료 | 사이드바 하단 로그아웃 버튼 클릭 |

## 데이터 보안
- 모든 데이터는 **로그인한 사용자만** 조회/수정 가능 (멀티테넌트)
- 다른 사용자의 데이터는 절대 보이지 않음

---

# Part 3. 기술 스택 요약

| 계층 | 기술 | 비고 |
|------|------|------|
| **프론트엔드** | React 18 + Vite | SPA, React Router v6 |
| **스타일링** | Vanilla CSS | 디자인 토큰 + 미디어 쿼리 반응형 |
| **백엔드** | Node.js + Express | REST API |
| **인증** | JWT + bcryptjs | 7일 만료, 단방향 해싱 |
| **ORM** | Drizzle ORM | Type-safe, `drizzle-kit push` 마이그레이션 |
| **DB** | PostgreSQL (Neon) | Serverless 드라이버 |
| **배포** | Vercel | Serverless Functions + 정적 호스팅 |

---

# Part 4. 프로젝트 구조

```
con_money_book/
├── api/                    # Vercel Serverless 엔트리
│   └── index.js            # Express app export
├── client/                 # React 프론트엔드
│   └── src/
│       ├── api/            # fetch 래퍼 + 도메인별 API
│       ├── components/     # 공통 UI (Button, Modal, Toast...)
│       ├── contexts/       # AuthContext (전역 인증 상태)
│       ├── pages/          # Login, Dashboard, EventList...
│       └── index.css       # 디자인 시스템
├── server/                 # Node.js 백엔드
│   └── src/
│       ├── controllers/    # 요청 핸들링
│       ├── services/       # 비즈니스 로직
│       ├── middleware/     # JWT 인증, 에러 핸들링
│       ├── db/             # Drizzle 스키마 + DB 연결
│       └── routes/         # Express 라우터
├── docs/                   # 설계 문서 7종
├── vercel.json             # Vercel 배포 설정
└── package.json            # 루트 의존성
```

---

# Part 5. 향후 과제

- [ ] 비밀번호 찾기 / 이메일 인증
- [ ] 경조사비 적정 금액 AI 추천
- [ ] 고급 검색 및 복합 필터링
- [ ] CSV/Excel 내보내기
- [ ] 대시보드/상세 페이지 반응형 고도화
- [ ] E2E 테스트 (Playwright)
- [ ] 프로덕션용 JWT_SECRET 분리 (환경변수 마이그레이션)
