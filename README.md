# 🧠 뇌 용량 확보용

머릿속 비우고 RAM 확보하는 블로그. 개발, AI, 잡생각 투기장.

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS + CSS Variables
- **Content**: MDX with Shiki syntax highlighting
- **Deployment**: Static Site Generation (SSG)

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

## 새 글 추가하기

### 1. 마크다운 파일 생성

`content/[카테고리]/[slug].md` 경로에 파일 생성

```bash
# 예시
content/dev/my-first-post.md
content/ai/chatgpt-tips.md
content/life/random-thoughts.md
```

### 2. Frontmatter 작성

파일 상단에 메타데이터 추가 (필수: title, description, date)

```yaml
---
title: "글 제목"
description: "글 설명 (목록에 표시됨)"
date: "2025-02-04"
tags: ["태그1", "태그2"]
thumbnail: "/images/my-post/cover.png"
---
```

### 3. 본문 작성

Frontmatter 아래에 마크다운으로 본문 작성

```markdown
---
title: "예시 글"
description: "이건 예시입니다"
date: "2025-02-04"
---

## 소제목

본문 내용...

### 코드 블록

\`\`\`typescript
const hello = "world";
\`\`\`

### 이미지

![설명](/images/my-post/screenshot.png)
```

### 4. 이미지 추가 (선택)

`public/images/[slug]/` 폴더에 이미지 저장

```bash
public/images/my-first-post/
├── cover.png
├── screenshot1.png
└── diagram.png
```

본문에서 참조: `![설명](/images/my-first-post/screenshot1.png)`

### 5. 확인

```bash
npm run dev
```

`http://localhost:3000`에서 확인. 새 카테고리 폴더를 만들면 자동으로 네비게이션에 추가됨.

## 폴더 구조

```
├── content/              # 블로그 글 (마크다운)
│   ├── dev/
│   ├── ai/
│   └── [category]/
├── public/images/        # 이미지 파일
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React 컴포넌트
│   └── lib/              # 유틸리티 (MDX 파싱 등)
└── CLAUDE.md             # AI 어시스턴트 가이드
```

## 테마 커스터마이징

`src/app/globals.css`에서 CSS 변수 수정

- `:root` - 라이트 모드
- `.dark` - 다크 모드

```css
:root {
  --accent-primary: #ff1493;  /* 메인 악센트 색상 */
  --bg-primary: #ffffff;       /* 배경색 */
  /* ... */
}
```
