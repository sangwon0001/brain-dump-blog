---
title: "Claude Code로 블로그 뚝딱 만들기 (8편: 마스코트 캐릭터)"
description: "Framer Motion으로 둥둥 떠다니는 뇌 마스코트 구현. 눈동자 추적, 수줍은 회피, 클릭 반응까지."
date: "2026-02-04"
tags: ["claude-code", "nextjs", "blog", "framer-motion", "animation", "Develop"]
series: "블로그 딸깍 해서 만들기"
---

## 뭔가 허전하다

7편에서 "할 거 다 했다"고 했는데, 블로그가 좀 심심하다. 기능은 다 있는데 재미가 없다.

```
마스코트 캐릭터 만들어줘. 둥둥 떠다니면서 마우스 따라 눈 움직이고,
클릭하면 반응하고, 마우스 가까이 가면 살살 피하는 느낌으로.
블로그 이름이 "뇌 가비지 컬렉터"니까 뇌 모양으로.
```

## 설계

Claude가 계획을 짜더니 꽤 그럴듯하다.

| 기능 | 구현 |
|------|------|
| 둥둥 떠다님 | Framer Motion variants |
| 눈 마우스 추적 | 전역 mousemove 이벤트 |
| 랜덤 이동 | 8-12초 간격 setInterval |
| 수줍은 회피 | 거리 기반 위치 계산 |
| 클릭 반응 | 랜덤 애니메이션 (점프, 회전, 흔들림, 바운스) |
| 토글 | localStorage 저장 |

파일 구조:
```
src/components/mascot/
├── Mascot.tsx           # 메인 래퍼 (visibility)
├── MascotCharacter.tsx  # SVG + 애니메이션
├── MascotToggle.tsx     # 토글 버튼
└── mascotAnimations.ts  # 애니메이션 variants
```

## 1. 캐릭터 디자인

SVG로 직접 그렸다. 뇌 모양 + 뉴런 촉수 + 큰 눈.

```tsx
<svg viewBox="0 0 80 80">
  {/* 뉴런 촉수 */}
  <motion.path d="M15 55 Q5 65 8 72" variants={tentacleVariants} />
  <motion.path d="M25 60 Q20 72 25 78" variants={tentacleVariants} />
  {/* ... */}

  {/* 뇌 몸체 */}
  <ellipse cx="40" cy="35" rx="28" ry="25" fill="var(--mascot-body)" />

  {/* 뇌 주름 */}
  <path d="M20 25 Q30 20 40 25 Q50 20 60 25" stroke="var(--mascot-fold)" />
  {/* ... */}

  {/* 눈 */}
  <ellipse cx="30" cy="32" rx="8" ry="9" fill="white" />
  <circle cx={30 + eyeOffset.x} cy={32 + eyeOffset.y} r="4" fill="var(--mascot-pupil)" />
  {/* ... */}

  {/* 볼터치 + 미소 */}
  <ellipse cx="20" cy="40" rx="5" ry="3" fill="var(--mascot-blush)" opacity="0.5" />
  <path d="M35 48 Q40 53 45 48" stroke="var(--mascot-pupil)" />
</svg>
```

CSS 변수로 테마 지원:
```css
:root {
  --mascot-body: #ffb6c1;    /* 연한 핑크 */
  --mascot-fold: #f08080;    /* 뇌 주름 */
  --mascot-pupil: #2d1f28;   /* 눈동자 */
  --mascot-blush: #ff69b4;   /* 볼터치 */
}

.dark {
  --mascot-body: #dda0dd;    /* 보라빛 핑크 */
  --mascot-fold: #ba55d3;
  /* ... */
}
```

## 2. 둥둥 떠다니기

Framer Motion variants로 자연스러운 움직임.

```typescript
export const floatingVariants: Variants = {
  animate: {
    y: [0, -8, 0, -4, 0],
    rotate: [-1, 1, -1, 0.5, -1],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};
```

촉수도 각각 다른 타이밍으로 흔들린다:
```typescript
export const tentacleVariants: Variants = {
  animate: (i: number) => ({
    rotate: [0, 8, -8, 4, 0],
    transition: {
      duration: 2 + i * 0.3,  // 각 촉수마다 다른 속도
      repeat: Infinity,
      delay: i * 0.2,
    },
  }),
};
```

## 3. 눈 마우스 추적

처음엔 마스코트 위에서만 추적했는데, 화면 전체에서 추적해야 자연스럽다.

```typescript
useEffect(() => {
  const handleGlobalMouseMove = (e: MouseEvent) => {
    const rect = mascotRef.current.getBoundingClientRect();
    const mascotCenterX = rect.left + MASCOT_SIZE / 2;
    const mascotCenterY = rect.top + MASCOT_SIZE / 2;

    const dx = e.clientX - mascotCenterX;
    const dy = e.clientY - mascotCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxOffset = 4;  // 눈동자 최대 이동
    const factor = Math.min(distance / 200, 1);

    setEyeOffset({
      x: (dx / distance) * maxOffset * factor,
      y: (dy / distance) * maxOffset * factor,
    });
  };

  window.addEventListener("mousemove", handleGlobalMouseMove);
  return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
}, []);
```

## 4. 랜덤 이동

8-12초마다 화면 내 랜덤 위치로 이동.

```typescript
useEffect(() => {
  const getRandomPosition = () => {
    const maxX = window.innerWidth - MASCOT_SIZE - PADDING;
    const maxY = window.innerHeight - MASCOT_SIZE - PADDING;
    return {
      x: Math.random() * (maxX - PADDING) + PADDING,
      y: Math.random() * (maxY - PADDING) + PADDING,
    };
  };

  const scheduleNextMove = () => {
    const delay = Math.random() * 4000 + 8000;  // 8-12초
    return setTimeout(() => {
      setPosition(getRandomPosition());
      timeoutId = scheduleNextMove();
    }, delay);
  };

  let timeoutId = scheduleNextMove();
  return () => clearTimeout(timeoutId);
}, []);
```

spring 애니메이션으로 부드럽게:
```typescript
<motion.div
  animate={{ left: position.x, top: position.y }}
  transition={{ type: "spring", stiffness: 50, damping: 20 }}
/>
```

## 5. 수줍은 회피

마우스가 가까워지면 살살 피한다. 처음엔 너무 빨라서 잡을 수가 없었다.

```typescript
// 마우스가 100px 이내로 오면
const avoidanceThreshold = 100;
if (distance < avoidanceThreshold) {
  // 느리게 피함 (3-8px)
  const avoidStrength = ((avoidanceThreshold - distance) / avoidanceThreshold) * 5 + 3;

  let newX = position.x - (dx / distance) * avoidStrength;
  let newY = position.y - (dy / distance) * avoidStrength;

  // 화면 밖으로 안 나가게
  newX = Math.max(PADDING, Math.min(viewportWidth - MASCOT_SIZE - PADDING, newX));
  newY = Math.max(PADDING, Math.min(viewportHeight - MASCOT_SIZE - PADDING, newY));

  setPosition({ x: newX, y: newY });
}
```

가까울수록 조금 더 빠르게 피하지만, 최대 8px라서 천천히 쫓아가면 잡을 수 있다.

## 6. 클릭 반응

클릭하면 4가지 반응 중 랜덤:

```typescript
export const clickReactions = {
  jump: {
    initial: { y: 0, scale: 1 },
    animate: { y: [-30, 0], scale: [1.1, 1] },
  },
  spin: {
    initial: { rotate: 0 },
    animate: { rotate: [0, 360] },
  },
  wobble: {
    initial: { rotate: 0 },
    animate: { rotate: [0, -10, 10, -10, 10, 0] },
  },
  bounce: {
    initial: { scale: 1 },
    animate: { scale: [1, 0.8, 1.2, 0.9, 1] },
  },
};

const handleClick = () => {
  const reactions = Object.keys(clickReactions);
  const reaction = reactions[Math.floor(Math.random() * reactions.length)];
  setReaction(reaction);
  setTimeout(() => setReaction(null), 500);
};
```

## 7. 토글

우하단에 토글 버튼. localStorage로 상태 저장.

```typescript
export default function Mascot() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("mascot-visible");
    if (stored !== null) setIsVisible(stored === "true");
  }, []);

  const toggleVisibility = () => {
    setIsVisible((prev) => {
      localStorage.setItem("mascot-visible", String(!prev));
      return !prev;
    });
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && <MascotCharacter />}
      </AnimatePresence>
      <MascotToggle isVisible={isVisible} onToggle={toggleVisibility} />
    </>
  );
}
```

투명도도 넣었다. 기본 60%, 호버하면 85%.

```typescript
<motion.div
  initial={{ opacity: 0.6 }}
  animate={{ opacity: 0.6, left: position.x, top: position.y }}
  whileHover={{ scale: 1.05, opacity: 0.85 }}
/>
```

## 8편 정리

- **SVG 캐릭터** → 뇌 + 뉴런 촉수 + 큰 눈
- **Framer Motion** → 둥둥 떠다니기, 촉수 흔들림
- **전역 마우스 추적** → 눈동자가 마우스 따라감
- **랜덤 이동** → 8-12초마다 화면 내 이동
- **수줍은 회피** → 마우스 가까우면 살살 도망 (잡힐 듯 말 듯)
- **클릭 반응** → 점프, 회전, 흔들림, 바운스 랜덤
- **토글 + localStorage** → 숨기기/보이기 저장

기능 추가는 끝났다고 했는데 또 추가했다. 근데 이건 기능이라기보다 그냥 재미.

---

*"블로그에 생명을 불어넣었다"라고 하면 좀 오글거리니까 그냥 귀여운 거 넣었다고 하자.*
