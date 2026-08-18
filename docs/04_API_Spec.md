# 📡 API 명세서
## 경조사비 관리 앱 - REST API Specification

---

## 1. API 개요

| 항목 | 값 |
|------|-----|
| **Base URL** | `/api/v1` |
| **Content-Type** | `application/json` |
| **인증** | Request Header: `Authorization: Bearer <토큰>` |

### 공통 응답 형식
```json
{ "success": true, "data": {...}, "meta": { "page": 1, "limit": 20, "total": 100 } }
```
### 에러 응답
```json
{ "success": false, "error": { "code": "ERROR_CODE", "message": "설명" } }
```

| HTTP | 코드 | 설명 |
|------|------|------|
| 400 | `VALIDATION_ERROR` | 유효성 검증 실패 |
| 404 | `NOT_FOUND` | 리소스 없음 |
| 409 | `CONFLICT` | 중복 충돌 |
| 500 | `INTERNAL_ERROR` | 서버 오류 |

---

## 2. 인증/계정 API (Auth)

| 메서드 | 엔드포인트 | 설명 | 인증 필요 |
|--------|-----------|------|-----------|
| POST | `/api/v1/auth/register` | 회원가입 | X |
| POST | `/api/v1/auth/login` | 로그인 | X |
| GET | `/api/v1/auth/me` | 현재 내 정보 조회 | O |

### POST /auth/register - Request Body
| 필드 | 타입 | 필수 | 유효성 |
|------|------|------|--------|
| `email` | string | Y | 이메일 형식, 유니크 |
| `password` | string | Y | 최소 6자 이상 |
| `name` | string | Y | 1~50자 |

### POST /auth/login - Request Body
| 필드 | 타입 | 필수 | 유효성 |
|------|------|------|--------|
| `email` | string | Y | 이메일 형식 |
| `password` | string | Y | 필수 |

### 로그인 응답 예시
```json
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "email": "a@a.com", "name": "가입자" },
    "token": "eyJhbGciOiJIUzI1NiIsIn..."
  }
}
```

---

## 3. 인물 API (Persons)

| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| GET | `/api/v1/persons` | 인물 목록 조회 |
| GET | `/api/v1/persons/:id` | 인물 상세 조회 (내역 포함) |
| POST | `/api/v1/persons` | 인물 등록 |
| PUT | `/api/v1/persons/:id` | 인물 수정 |
| DELETE | `/api/v1/persons/:id` | 인물 삭제 (CASCADE) |

### GET /persons - Query Parameters
| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| `page` | int | 1 | 페이지 번호 |
| `limit` | int | 20 | 항목 수 (max 100) |
| `search` | string | - | 이름 검색 |
| `relationship` | string | - | 관계 필터 |
| `sort` | string | `name` | 정렬 (name, created_at) |
| `order` | string | `asc` | 순서 (asc, desc) |

### POST /persons - Request Body
| 필드 | 타입 | 필수 | 유효성 |
|------|------|------|--------|
| `name` | string | Y | 1~100자 |
| `relationship` | string | Y | enum |
| `phone` | string | N | 전화번호 형식 |
| `memo` | string | N | max 500자 |
| `groupIds` | string[] | N | UUID 배열 |

---

## 3. 경조사 내역 API (Events)

| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| GET | `/api/v1/events` | 내역 목록 조회 |
| GET | `/api/v1/events/:id` | 내역 상세 조회 |
| POST | `/api/v1/events` | 내역 등록 |
| PUT | `/api/v1/events/:id` | 내역 수정 |
| DELETE | `/api/v1/events/:id` | 내역 삭제 |

### GET /events - Query Parameters
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `page`, `limit` | int | 페이지네이션 |
| `personId` | UUID | 인물 필터 |
| `type` | string | 경조사 유형 필터 |
| `direction` | string | SENT/RECEIVED 필터 |
| `startDate`, `endDate` | date | 날짜 범위 (YYYY-MM-DD) |
| `minAmount`, `maxAmount` | int | 금액 범위 |

### POST /events - Request Body
| 필드 | 타입 | 필수 | 유효성 |
|------|------|------|--------|
| `personId` | UUID | Y | 존재하는 인물 |
| `type` | string | Y | eventType enum |
| `direction` | string | Y | SENT/RECEIVED |
| `amount` | int | Y | 양수 |
| `eventDate` | string | Y | YYYY-MM-DD |
| `memo` | string | N | max 500자 |

---

## 4. 그룹 API (Groups)

| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| GET | `/api/v1/groups` | 그룹 목록 |
| POST | `/api/v1/groups` | 그룹 등록 |
| PUT | `/api/v1/groups/:id` | 그룹 수정 |
| DELETE | `/api/v1/groups/:id` | 그룹 삭제 |

### POST /groups - Request Body
| 필드 | 타입 | 필수 | 유효성 |
|------|------|------|--------|
| `name` | string | Y | 1~100자, 유니크 |
| `description` | string | N | max 500자 |

---

## 5. 통계 API (Stats)

| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| GET | `/api/v1/stats/summary` | 대시보드 요약 (총 지출/수입/잔액) |
| GET | `/api/v1/stats/monthly` | 월별 통계 (?year=2024) |
| GET | `/api/v1/stats/by-relationship` | 관계별 통계 |
| GET | `/api/v1/stats/by-type` | 경조사 유형별 평균/최소/최대 금액 |
| GET | `/api/v1/stats/recommendation` | 경조사비 추천 (?type=WEDDING&personId=...) |

### GET /stats/summary 응답
```json
{
  "totalSent": 5000000, "totalReceived": 3200000, "balance": -1800000,
  "eventCount": 48, "sentCount": 30, "receivedCount": 18
}
```

### GET /stats/recommendation 응답
```json
{
  "recommendedAmount": 100000,
  "basis": { "avgByType": 95000, "avgByRelationship": 105000 },
  "range": { "min": 50000, "max": 150000 }
}
```
