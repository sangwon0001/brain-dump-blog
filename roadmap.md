# Blog Roadmap

블로그 개선 계획을 칸반 스타일로 관리한다.

---

## 📋 To Do

### 🔴 High Priority


### 🟡 Medium Priority

- [ ] **OG 이미지 자동 생성**
  - `@vercel/og` 사용
  - 글 제목, 카테고리 포함
  - 일관된 브랜딩

- [ ] **JSON-LD 스키마**
  - Article, BlogPosting 마크업
  - 구조화된 데이터로 SEO 강화

- [ ] **Analytics**
  - Vercel Analytics 또는 Plausible
  - 페이지뷰, 인기글 추적

- [ ] **Callout 컴포넌트**
  - NOTE, WARNING, TIP 등
  - MDX에서 쉽게 사용

- [ ] **읽기 진행 표시기**
  - 상단 고정 프로그레스 바
  - 스크롤에 따라 진행률 표시

### 🟢 Low Priority

- [ ] **댓글 시스템**
  - Giscus (GitHub Discussions 기반)
  - 다크모드 연동

- [ ] **태그 아카이브**
  - `/tags` 전체 태그 목록
  - `/tags/[tag]` 태그별 글 목록

- [ ] **Back to Top 버튼**
  - 일정 스크롤 후 표시
  - 부드러운 스크롤 애니메이션

- [ ] **프린트 스타일**
  - 인쇄 친화적 CSS
  - 불필요한 요소 숨김

- [ ] **인기글 랭킹**
  - Analytics 기반
  - 사이드바 또는 홈에 표시

---

## 🔄 In Progress

(현재 진행 중인 작업 없음)

---

## ✅ Done

### 2025-02

- [x] **Draft 기능** (2025-02-04)
  - `draft: true` frontmatter 지원
  - 빌드 시 draft 제외
  - dev 모드에서는 DRAFT 뱃지와 함께 표시
- [x] **TOC (목차)** (2025-02-04)
  - 헤딩 기반 자동 생성
  - 클릭 시 해당 위치로 스크롤
  - 접이식 UI
- [x] **RSS 피드** (2025-02-04)
  - `/feed.xml` 생성
  - 최신 20개 글 포함
  - 메타데이터에 RSS 링크 추가
- [x] **검색 기능** (2025-02-04)
  - 클라이언트 사이드 검색 (제목, 설명, 태그)
  - Cmd/Ctrl + K 단축키
  - 키보드 네비게이션 (↑↓ Enter ESC)
  - 검색 모달 UI
- [x] **시리즈 시스템** - 자동 감지 + 네비게이션
- [x] **관련 글 추천** - 태그 기반 추천
- [x] **다크모드** - 토글 + localStorage 저장
- [x] **SEO 기본** - sitemap, robots.txt, 메타데이터
- [x] **코드 하이라이트** - Shiki + 복사 버튼
- [x] **반응형 디자인** - 모바일 메뉴

---

## 📝 Notes

### 작업 규칙
1. High → Medium → Low 순서로 진행
2. 한 번에 하나씩 완료
3. 완료 시 Done으로 이동 + 날짜 기록

### 참고 사항
- 검색: `fuse.js` 또는 직접 구현
- RSS: `feed` 패키지 사용
- OG 이미지: Vercel Edge Function 필요
- Giscus: GitHub repo 연동 필요
