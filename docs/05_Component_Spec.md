# 🧩 컴포넌트 명세서
## 경조사비 관리 앱 - React Component Specification

---

## 1. 컴포넌트 트리 구조

```
App
├── Layout
│   ├── Header (+ MobileMenu)
│   ├── Sidebar (Desktop)
│   ├── BottomNav (Mobile)
│   └── Main Content Area
│       ├── DashboardPage
│       │   ├── SummaryCards
│       │   ├── MonthlyChart
│       │   ├── RecentEventList
│       │   └── RelationshipPieChart
│       ├── EventListPage
│       │   ├── EventFilters
│       │   ├── EventTable / EventCardList
│       │   └── Pagination
│       ├── EventFormPage
│       │   ├── PersonSelector
│       │   ├── EventTypeSelector
│       │   ├── AmountInput
│       │   ├── DatePicker
│       │   └── FormActions
│       ├── PersonListPage
│       │   ├── PersonSearchBar
│       │   ├── PersonCardList
│       │   └── Pagination
│       ├── PersonDetailPage
│       │   ├── PersonInfo
│       │   ├── BalanceSummary
│       │   └── PersonEventHistory
│       └── StatsPage
│           ├── YearSelector
│           ├── MonthlyBarChart
│           ├── TypeStatsTable
│           └── RelationshipStats
└── Common Components
    ├── Button, IconButton
    ├── Input, Select, Textarea
    ├── Modal, ConfirmDialog
    ├── Card, Badge
    ├── EmptyState, LoadingSpinner
    ├── Toast / Notification
    └── PageHeader
```

---

## 2. 레이아웃 컴포넌트

### Layout
| 속성 | 설명 |
|------|------|
| **역할** | 전체 앱 레이아웃 (Header + Sidebar + Content) |
| **반응형** | Mobile: 하단 네비, Desktop: 좌측 사이드바 |
| **Props** | `children` |

### Header
| 속성 | 설명 |
|------|------|
| **역할** | 앱 타이틀 + 모바일 메뉴 토글 |
| **Props** | `onMenuToggle` |

### Sidebar
| 속성 | 설명 |
|------|------|
| **역할** | 네비게이션 메뉴 (Desktop) |
| **메뉴** | 대시보드, 경조사 내역, 인물 관리, 통계 |
| **Props** | `isOpen`, `onClose` |

### BottomNav
| 속성 | 설명 |
|------|------|
| **역할** | 하단 네비게이션 바 (Mobile only) |
| **표시** | 화면 너비 < 600px |

---

## 3. 페이지 컴포넌트

### DashboardPage
| 속성 | 설명 |
|------|------|
| **경로** | `/` |
| **데이터** | stats/summary, stats/monthly, events(recent) |
| **하위** | SummaryCards, MonthlyChart, RecentEventList |

### EventListPage
| 속성 | 설명 |
|------|------|
| **경로** | `/events` |
| **데이터** | events (paginated, filtered) |
| **기능** | 필터링, 정렬, 페이지네이션 |
| **하위** | EventFilters, EventTable, Pagination |

### EventFormPage
| 속성 | 설명 |
|------|------|
| **경로** | `/events/new`, `/events/:id/edit` |
| **데이터** | persons (목록), event (수정시) |
| **기능** | 경조사비 등록/수정 폼 |
| **하위** | PersonSelector, EventTypeSelector, AmountInput |

### PersonListPage
| 속성 | 설명 |
|------|------|
| **경로** | `/persons` |
| **데이터** | persons (paginated) |
| **기능** | 인물 검색, 관계별 필터 |

### PersonDetailPage
| 속성 | 설명 |
|------|------|
| **경로** | `/persons/:id` |
| **데이터** | person (상세 + 내역) |
| **기능** | 인물 상세, 잔액원황, 이력 조회 |

### StatsPage
| 속성 | 설명 |
|------|------|
| **경로** | `/stats` |
| **데이터** | stats/* 전체 |
| **기능** | 연도별 통계, 차트 표시 |

---

## 4. 공통 컴포넌트

### Button
```jsx
<Button variant="primary|secondary|danger|ghost" size="sm|md|lg"
  icon={<Icon/>} loading={false} disabled={false} fullWidth={false}>
  텍스트
</Button>
```

### Input
```jsx
<Input type="text|number|tel" label="라벨" placeholder="..." 
  value={v} onChange={fn} error="에러 메시지" required={true} />
```

### Select
```jsx
<Select label="관계" options={[{value, label}]} 
  value={v} onChange={fn} placeholder="선택하세요" />
```

### Modal
```jsx
<Modal isOpen={bool} onClose={fn} title="제목" size="sm|md|lg">
  <ModalBody>내용</ModalBody>
  <ModalFooter><Button/></ModalFooter>
</Modal>
```

### Card
```jsx
<Card variant="default|elevated|outlined" padding="sm|md|lg">
  내용
</Card>
```

### Badge
```jsx
<Badge variant="success|danger|warning|info|neutral" size="sm|md">
  텍스트
</Badge>
```

### EmptyState
```jsx
<EmptyState icon={<Icon/>} title="내역이 없습니다" 
  description="경조사비를 등록해주세요" action={<Button/>} />
```

### Toast
```jsx
toast.success("저장되었습니다")
toast.error("삭제에 실패했습니다")
```

---

## 5. 도메인 컴포넌트

### SummaryCards
| Props | 타입 | 설명 |
|-------|------|------|
| `totalSent` | number | 총 지출 |
| `totalReceived` | number | 총 수입 |
| `balance` | number | 잔액 |
| `eventCount` | number | 총 건수 |

### EventTypeSelector
| Props | 타입 | 설명 |
|-------|------|------|
| `value` | string | 선택된 유형 |
| `onChange` | function | 변경 핸들러 |
| **표시** | 아이콘 그리드 | 유형별 아이콘+라벨 |

### AmountInput
| Props | 타입 | 설명 |
|-------|------|------|
| `value` | number | 금액 |
| `onChange` | function | 변경 핸들러 |
| **기능** | 금액 포맷팅 | 1,000원 단위 콤마, 빠른입력 버튼 |

### PersonSelector
| Props | 타입 | 설명 |
|-------|------|------|
| `value` | string | 선택된 인물 ID |
| `onChange` | function | 변경 핸들러 |
| **기능** | 검색+드롭다운 | 새 인물 등록 링크 |

### BalanceSummary
| Props | 타입 | 설명 |
|-------|------|------|
| `sent` | number | 총 지출 |
| `received` | number | 총 수입 |
| **표시** | 시각적 바 | 지출/수입 비교 바차트 |

---

## 6. 커스텀 Hooks

| Hook | 용도 | 반환값 |
|------|------|--------|
| `useEvents(filters)` | 내역 목록 조회 | `{ data, loading, error, refetch }` |
| `useEvent(id)` | 내역 상세 조회 | `{ data, loading, error }` |
| `usePersons(filters)` | 인물 목록 조회 | `{ data, loading, error, refetch }` |
| `usePerson(id)` | 인물 상세 조회 | `{ data, loading, error }` |
| `useStats(type)` | 통계 조회 | `{ data, loading, error }` |
| `useToast()` | 토스트 알림 | `{ success, error, info }` |
| `useForm(schema)` | 폼 상태+검증 | `{ values, errors, handleChange, handleSubmit }` |
| `useDebounce(val, ms)` | 디바운스 | `debouncedValue` |
