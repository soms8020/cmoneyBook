# 🧪 테스트 케이스 정의서
## 경조사비 관리 앱 - Test Case Specification

---

## 1. 테스트 전략

| 구분 | 도구 | 범위 |
|------|------|------|
| **단위 테스트** | Vitest | 서비스 로직, 유틸리티 |
| **컴포넌트 테스트** | Vitest + RTL | React 컴포넌트 |
| **API 통합 테스트** | Vitest + Supertest | 엔드포인트 |
| **E2E 테스트** | (v2) Playwright | 주요 시나리오 |

---

## 2. 백엔드 단위 테스트

### 2.1 PersonService

| TC-ID | 테스트 케이스 | 입력 | 기대 결과 |
|-------|-------------|------|-----------|
| TC-PS01 | 인물 생성 성공 | `{name:"김철수",relationship:"COLLEAGUE"}` | 생성된 인물 반환 |
| TC-PS02 | 이름 누락 시 에러 | `{relationship:"COLLEAGUE"}` | ValidationError |
| TC-PS03 | 빈 이름 시 에러 | `{name:"",relationship:"COLLEAGUE"}` | ValidationError |
| TC-PS04 | 유효하지 않은 관계 유형 | `{name:"김",relationship:"INVALID"}` | ValidationError |
| TC-PS05 | 인물 목록 조회 | 검색 없음 | 전체 목록 + 페이지네이션 |
| TC-PS06 | 이름 검색 | `search:"김"` | 매칭 결과만 반환 |
| TC-PS07 | 관계 필터링 | `relationship:"FAMILY"` | 가족만 반환 |
| TC-PS08 | 인물 수정 성공 | 유효한 데이터 | 수정된 인물 반환 |
| TC-PS09 | 존재하지 않는 인물 수정 | 잘못된 UUID | NotFoundError |
| TC-PS10 | 인물 삭제 + 관련 내역 삭제 | 유효 UUID | 인물 + 내역 삭제 |

### 2.2 EventService

| TC-ID | 테스트 케이스 | 입력 | 기대 결과 |
|-------|-------------|------|-----------|
| TC-ES01 | 지출 내역 생성 성공 | 유효 데이터, direction:SENT | 생성된 내역 |
| TC-ES02 | 수입 내역 생성 성공 | 유효 데이터, direction:RECEIVED | 생성된 내역 |
| TC-ES03 | 금액 0원 시 에러 | amount:0 | ValidationError |
| TC-ES04 | 음수 금액 시 에러 | amount:-50000 | ValidationError |
| TC-ES05 | 존재하지 않는 인물 ID | 잘못된 personId | NotFoundError |
| TC-ES06 | 날짜 범위 필터링 | startDate, endDate | 범위 내 결과만 |
| TC-ES07 | 유형별 필터링 | type:WEDDING | 결혼 내역만 |
| TC-ES08 | 방향별 필터링 | direction:SENT | 지출만 |
| TC-ES09 | 복합 필터링 | type+direction+dateRange | 교집합 |
| TC-ES10 | 페이지네이션 정확성 | page:2, limit:10 | 11~20번째 |

### 2.3 StatsService

| TC-ID | 테스트 케이스 | 기대 결과 |
|-------|-------------|-----------|
| TC-SS01 | 전체 요약 - 정상 | totalSent, totalReceived, balance 정확 |
| TC-SS02 | 전체 요약 - 데이터 없음 | 모든 값 0 |
| TC-SS03 | 월별 통계 정확성 | 월별 합계, 건수 정확 |
| TC-SS04 | 관계별 통계 정확성 | 관계 유형별 합계 정확 |
| TC-SS05 | 유형별 평균 금액 | avg, min, max 정확 |
| TC-SS06 | 연도 필터 | 해당 연도만 포함 |

---

## 3. API 통합 테스트

### 3.1 Persons API

| TC-ID | 메서드 | 경로 | 상태코드 | 검증 |
|-------|--------|------|----------|------|
| TC-AP01 | POST | /persons | 201 | 인물 생성 |
| TC-AP02 | POST | /persons | 400 | name 누락 |
| TC-AP03 | GET | /persons | 200 | 목록 + meta |
| TC-AP04 | GET | /persons?search=김 | 200 | 검색 결과 |
| TC-AP05 | GET | /persons/:id | 200 | 상세 + 내역 |
| TC-AP06 | GET | /persons/invalid | 404 | 에러 응답 |
| TC-AP07 | PUT | /persons/:id | 200 | 수정 반영 |
| TC-AP08 | DELETE | /persons/:id | 200 | 삭제 확인 |

### 3.2 Events API

| TC-ID | 메서드 | 경로 | 상태코드 | 검증 |
|-------|--------|------|----------|------|
| TC-AE01 | POST | /events | 201 | 내역 생성 |
| TC-AE02 | POST | /events | 400 | 금액 0 |
| TC-AE03 | POST | /events | 400 | 필수 필드 누락 |
| TC-AE04 | GET | /events | 200 | 목록 조회 |
| TC-AE05 | GET | /events?direction=SENT | 200 | 필터 결과 |
| TC-AE06 | PUT | /events/:id | 200 | 수정 반영 |
| TC-AE07 | DELETE | /events/:id | 200 | 삭제 확인 |

### 3.3 Stats API

| TC-ID | 메서드 | 경로 | 상태코드 | 검증 |
|-------|--------|------|----------|------|
| TC-AS01 | GET | /stats/summary | 200 | 합계 정확 |
| TC-AS02 | GET | /stats/monthly?year=2024 | 200 | 12개월 |
| TC-AS03 | GET | /stats/by-relationship | 200 | 유형 수 |
| TC-AS04 | GET | /stats/by-type | 200 | 평균값 |

---

## 4. 프론트엔드 컴포넌트 테스트

### 4.1 공통 컴포넌트

| TC-ID | 컴포넌트 | 테스트 케이스 |
|-------|----------|-------------|
| TC-CB01 | Button | variant별 스타일 렌더링 |
| TC-CB02 | Button | loading 상태 시 disabled |
| TC-CB03 | Button | onClick 호출 확인 |
| TC-CI01 | Input | label/placeholder 렌더링 |
| TC-CI02 | Input | onChange 값 전달 |
| TC-CI03 | Input | error 메시지 표시 |
| TC-CM01 | Modal | isOpen=true 시 표시 |
| TC-CM02 | Modal | onClose 호출 |
| TC-CM03 | Modal | ESC 키 닫기 |

### 4.2 도메인 컴포넌트

| TC-ID | 컴포넌트 | 테스트 케이스 |
|-------|----------|-------------|
| TC-SC01 | SummaryCards | 금액 포맷 표시 (₩1,000,000) |
| TC-SC02 | SummaryCards | 잔액 양수/음수 색상 구분 |
| TC-AI01 | AmountInput | 숫자 입력 시 콤마 자동 포맷 |
| TC-AI02 | AmountInput | 빠른 선택 버튼 동작 |
| TC-ET01 | EventTypeSelector | 유형 아이콘/라벨 렌더링 |
| TC-ET02 | EventTypeSelector | 선택 시 onChange 호출 |

### 4.3 페이지 테스트

| TC-ID | 페이지 | 테스트 케이스 |
|-------|--------|-------------|
| TC-PD01 | DashboardPage | 요약 카드 3개 렌더링 |
| TC-PD02 | DashboardPage | 최근 내역 표시 |
| TC-PE01 | EventListPage | 내역 목록 렌더링 |
| TC-PE02 | EventListPage | 필터 동작 |
| TC-PF01 | EventFormPage | 폼 필드 렌더링 |
| TC-PF02 | EventFormPage | 유효성 검증 에러 표시 |
| TC-PF03 | EventFormPage | 저장 성공 시 리다이렉트 |
| TC-PP01 | PersonListPage | 인물 카드 렌더링 |
| TC-PP02 | PersonDetailPage | 인물 정보 + 내역 표시 |

---

## 5. 테스트 실행 명령어

```bash
# 백엔드 단위 테스트
cd server && npx vitest run

# 백엔드 테스트 (watch 모드)
cd server && npx vitest

# 프론트엔드 테스트
cd client && npx vitest run

# 전체 테스트 (루트)
npm test

# 커버리지
cd server && npx vitest run --coverage
cd client && npx vitest run --coverage
```
