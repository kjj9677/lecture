# 강의 관리 시스템

온라인 강의 플랫폼의 핵심 기능을 구현한 프로젝트입니다. 학생과 강사 역할을 구분하여 강의 조회, 수강신청, 강의 개설 등의 기능을 제공합니다.

## 기술 스택

- **Framework**: Next.js 15.5.4 (App Router)
- **UI Library**: React 19.1.0
- **Language**: TypeScript
- **State Management**: TanStack Query (React Query) v5
- **Styling**: CSS Modules
- **Build Tool**: Turbopack

## 주요 기능

### 1. 인증 시스템
- 회원가입/로그인 (학생, 강사 역할 선택)
- 이메일 중복 검사
- 폼 유효성 검증 (이메일, 비밀번호, 휴대폰 번호)
- Context API 기반 인증 상태 관리

### 2. 강의 목록
- **무한 스크롤**: Intersection Observer + Infinite Query로 구현
- **정렬 옵션**: 최신순, 수강생순, 신청률순
- **뱃지 표시**: 본인 강의, 수강신청한 강의, 마감 임박 표시
- **일괄 신청**: 체크박스로 여러 강의 동시 수강신청

### 3. 강의 관리 (강사 전용)
- 강의 개설 (강의명, 가격, 최대 수강 인원 설정)
- 중복 강의명 검증

### 4. 마이페이지
- **학생**: 수강신청한 강의 목록 조회
- **강사**: 개설한 강의 목록 및 수강신청한 강의 조회(탭 전환 UI로 구분)

### 5. 데이터 초기화
- 마이페이지에서 초기 데이터로 리셋 가능
- 테스트 편의성을 위한 기능

## 구현 특징

### Mock API 설계
- `mockStorage`: localStorage 기반 데이터 저장소
- `mockApi`: 실제 API와 유사한 인터페이스 제공
- delay 함수로 비동기 동작 시뮬레이션
- 실제 백엔드 연동 시 API 레이어만 교체하면 되도록 설계

### React Query 활용
- `useInfiniteLectures`: 무한 스크롤 구현
- `useMyLectures`, `useMyTeachingLectures`: 사용자별 데이터 캐싱
- Query invalidation으로 데이터 동기화
- 낙관적 업데이트 없이 안전한 refetch 전략 사용

### 페이지네이션 전략
- 초기 로드: 5개
- 추가 로드: 5개씩
- `getNextPageParam`으로 다음 페이지 존재 여부 판단
- Intersection Observer로 스크롤 감지

### 웹 접근성
- **시맨틱 HTML**: header, section, nav 등 의미있는 태그 사용
- **ARIA 속성**: aria-label, aria-describedby, aria-pressed 등 스크린 리더 지원
- **키보드 네비게이션**: 모든 인터랙티브 요소 키보드로 조작 가능
- **폼 접근성**: label-input 연결
- **포커스 관리**: 모달 열림/닫힘 시 적절한 포커스 이동

### 컴포넌트 구조
```
src/
├── app/                     # 페이지 라우팅
│   ├── login/              # 로그인
│   ├── signup/             # 회원가입
│   ├── lectures/           # 강의 목록
│   └── mypage/             # 마이페이지
├── components/
│   ├── base/               # 재사용 가능한 기본 컴포넌트
│   └── layout/             # 레이아웃 컴포넌트
├── providers/              # Context Providers
├── hooks/                  # Custom Hooks
├── data/                   # Mock API & Storage
├── types/                  # TypeScript 타입 정의
└── utils.ts                # 유틸리티 함수
```

## 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
npm run start
```

개발 서버 실행 후 http://localhost:3000 접속

## 초기 계정

초기 데이터(`src/data/initialData.ts`)에 등록된 테스트 계정:

**학생**
- 이메일: student1@test.com / 비밀번호: test123

**강사**
- 이메일: instructor1@test.com / 비밀번호: test123

## 주요 의사결정

### 1. localStorage 사용
- 백엔드 없이 전체 기능 구현 가능
- 새로고침 후에도 데이터 유지
- 실제 API로 교체 용이한 구조

### 2. Infinite Query 도입
- 페이지네이션보다 자연스러운 사용자 경험

### 3. 권한 검증
- 강사만 강의 개설 가능
- 본인 강의는 수강 신청 불가

