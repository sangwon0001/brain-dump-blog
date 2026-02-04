# Blog Roadmap

블로그 개선 계획을 칸반 스타일로 관리한다.

---

## 📋 To Do

(현재 계획된 작업 없음)

---

## 🔄 In Progress

(현재 진행 중인 작업 없음)

---

## ✅ Done

### 2026-02-04

- [x] **인기글 랭킹**
  - Neon PostgreSQL + Prisma 7 기반 조회수 추적
  - IP 해시로 10분 throttling (중복 조회 방지)
  - 일간/주간/월간/전체 기간별 랭킹
  - 홈 페이지에 인기글 섹션 표시
  - 글 페이지에 조회수 표시
  - 랭킹 API 1시간 캐싱

- [x] **Analytics 셋업**
  - GA4 스크립트 추가 (환경변수로 활성화)
  - Hotjar 스크립트 추가 (환경변수로 활성화)

- [x] **Back to Top 버튼**
  - 스크롤 400px 후 표시
  - 부드러운 스크롤 애니메이션
  - hover 시 scale 효과

- [x] **프린트 스타일**
  - 인쇄 친화적 CSS (@media print)
  - 불필요한 요소 숨김 (nav, buttons, ToC 등)
  - 외부 링크 URL 표시
  - 코드블록/이미지 page-break 처리

- [x] **태그 아카이브**
  - `/tags` 전체 태그 목록 (태그 클라우드)
  - `/tags/[tag]` 태그별 글 목록
  - 태그 크기 가중치 (사용 빈도 기반)

- [x] **댓글 시스템**
  - Giscus (GitHub Discussions 기반)
  - 다크모드 자동 연동 (MutationObserver)
  - 커스텀 테마 (`/giscus/theme-light.css`, `/giscus/theme-dark.css`)

- [x] **OG 이미지 자동 생성**
  - `@vercel/og` 사용한 Edge Function
  - 글 제목, 카테고리 포함
  - 다크 테마 기반 브랜딩

- [x] **JSON-LD 스키마**
  - Article, BlogPosting 마크업
  - WebSite 스키마 추가
  - 구조화된 데이터로 SEO 강화

- [x] **Vercel Analytics**
  - 페이지뷰 추적 활성화

- [x] **Callout 컴포넌트**
  - NOTE, WARNING, TIP, DANGER, INFO 타입 지원
  - MDX에서 `<Callout type="tip">` 형태로 사용

- [x] **읽기 진행 표시기**
  - 상단 고정 프로그레스 바
  - 스크롤에 따라 진행률 표시

### 2026-02-03

- [x] **Draft 기능**
  - `draft: true` frontmatter 지원
  - 빌드 시 draft 제외
  - dev 모드에서는 DRAFT 뱃지와 함께 표시

- [x] **TOC (목차)**
  - 헤딩 기반 자동 생성
  - 클릭 시 해당 위치로 스크롤
  - 접이식 UI

- [x] **RSS 피드**
  - `/feed.xml` 생성
  - 최신 20개 글 포함
  - 메타데이터에 RSS 링크 추가

- [x] **검색 기능**
  - 클라이언트 사이드 검색 (제목, 설명, 태그)
  - Cmd/Ctrl + K 단축키
  - 키보드 네비게이션 (↑↓ Enter ESC)
  - 검색 모달 UI

### 2026-02 (이전)

- [x] **시리즈 시스템** - 자동 감지 + 네비게이션
- [x] **관련 글 추천** - 태그 기반 추천
- [x] **다크모드** - 토글 + localStorage 저장
- [x] **SEO 기본** - sitemap, robots.txt, 메타데이터
- [x] **코드 하이라이트** - Shiki + 복사 버튼
- [x] **반응형 디자인** - 모바일 메뉴

---

## 📝 Notes

### 작업 규칙
1. Medium → Low 순서로 진행
2. 한 번에 하나씩 완료
3. 완료 시 Done으로 이동 + 날짜 기록

### 기술 참고
- OG 이미지: `@vercel/og` + Edge Function
- Giscus: GitHub repo 연동 필요
- Analytics: Vercel Analytics 무료 플랜 가능
