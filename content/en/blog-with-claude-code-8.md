---
title: "Whipping Up a Blog with Claude Code (Part 8: A Mascot Character)"
description: "A floating brain mascot built with Framer Motion. Eye tracking, shy dodging, click reactions."
date: "2026-02-04"
tags: ["claude-code", "nextjs", "blog", "framer-motion", "animation", "Develop"]
series: "Whipping Up a Blog with Claude Code"
---

## Something's missing

Part 7 ended with "everything's done," but the blog felt a bit dull. All the features are there and none of it is fun.

```
make me a mascot character. floats around, eyes follow the mouse,
reacts when clicked, and slips away gently when the mouse gets close.
the blog is called "Brain Garbage Collector" so make it brain-shaped.
```

## Design

Claude drew up a plan and it was pretty reasonable.

| Feature | Implementation |
|------|------|
| Floating | Framer Motion variants |
| Eyes tracking the mouse | global mousemove event |
| Random movement | setInterval every 8–12 seconds |
| Shy dodging | distance-based position calculation |
| Click reaction | random animation (jump, spin, wobble, bounce) |
| Toggle | saved in localStorage |

File structure:
```
src/components/mascot/
├── Mascot.tsx           # main wrapper (visibility)
├── MascotCharacter.tsx  # SVG + animation
├── MascotToggle.tsx     # toggle button
└── mascotAnimations.ts  # animation variants
```

## 1. Character design

Drawn directly in SVG. Brain shape + neuron tentacles + big eyes.

```tsx
<svg viewBox="0 0 80 80">
  {/* neuron tentacles */}
  <motion.path d="M15 55 Q5 65 8 72" variants={tentacleVariants} />
  <motion.path d="M25 60 Q20 72 25 78" variants={tentacleVariants} />
  {/* ... */}

  {/* brain body */}
  <ellipse cx="40" cy="35" rx="28" ry="25" fill="var(--mascot-body)" />

  {/* brain folds */}
  <path d="M20 25 Q30 20 40 25 Q50 20 60 25" stroke="var(--mascot-fold)" />
  {/* ... */}

  {/* eyes */}
  <ellipse cx="30" cy="32" rx="8" ry="9" fill="white" />
  <circle cx={30 + eyeOffset.x} cy={32 + eyeOffset.y} r="4" fill="var(--mascot-pupil)" />
  {/* ... */}

  {/* blush + smile */}
  <ellipse cx="20" cy="40" rx="5" ry="3" fill="var(--mascot-blush)" opacity="0.5" />
  <path d="M35 48 Q40 53 45 48" stroke="var(--mascot-pupil)" />
</svg>
```

Theme support via CSS variables:
```css
:root {
  --mascot-body: #ffb6c1;    /* light pink */
  --mascot-fold: #f08080;    /* brain folds */
  --mascot-pupil: #2d1f28;   /* pupils */
  --mascot-blush: #ff69b4;   /* blush */
}

.dark {
  --mascot-body: #dda0dd;    /* purple-tinted pink */
  --mascot-fold: #ba55d3;
  /* ... */
}
```

## 2. Floating

Natural movement through Framer Motion variants.

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

Each tentacle waves on its own timing:
```typescript
export const tentacleVariants: Variants = {
  animate: (i: number) => ({
    rotate: [0, 8, -8, 4, 0],
    transition: {
      duration: 2 + i * 0.3,  // different speed per tentacle
      repeat: Infinity,
      delay: i * 0.2,
    },
  }),
};
```

## 3. Eye tracking

At first it only tracked while over the mascot, but tracking across the whole screen feels more natural.

```typescript
useEffect(() => {
  const handleGlobalMouseMove = (e: MouseEvent) => {
    const rect = mascotRef.current.getBoundingClientRect();
    const mascotCenterX = rect.left + MASCOT_SIZE / 2;
    const mascotCenterY = rect.top + MASCOT_SIZE / 2;

    const dx = e.clientX - mascotCenterX;
    const dy = e.clientY - mascotCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxOffset = 4;  // max pupil travel
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

## 4. Random movement

Every 8–12 seconds it moves to a random spot on screen.

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
    const delay = Math.random() * 4000 + 8000;  // 8–12 seconds
    return setTimeout(() => {
      setPosition(getRandomPosition());
      timeoutId = scheduleNextMove();
    }, delay);
  };

  let timeoutId = scheduleNextMove();
  return () => clearTimeout(timeoutId);
}, []);
```

Smoothed out with a spring animation:
```typescript
<motion.div
  animate={{ left: position.x, top: position.y }}
  transition={{ type: "spring", stiffness: 50, damping: 20 }}
/>
```

## 5. Shy dodging

It slips away when the mouse gets close. The first version was so fast you couldn't ever catch it.

```typescript
// when the mouse comes within 100px
const avoidanceThreshold = 100;
if (distance < avoidanceThreshold) {
  // dodge slowly (3–8px)
  const avoidStrength = ((avoidanceThreshold - distance) / avoidanceThreshold) * 5 + 3;

  let newX = position.x - (dx / distance) * avoidStrength;
  let newY = position.y - (dy / distance) * avoidStrength;

  // keep it on screen
  newX = Math.max(PADDING, Math.min(viewportWidth - MASCOT_SIZE - PADDING, newX));
  newY = Math.max(PADDING, Math.min(viewportHeight - MASCOT_SIZE - PADDING, newY));

  setPosition({ x: newX, y: newY });
}
```

The closer you get the faster it dodges, but it caps at 8px, so you can catch it if you chase slowly.

## 6. Click reactions

Clicking picks one of four reactions at random:

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

## 7. Toggle

A toggle button in the bottom right. State saved to localStorage.

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

I added opacity too. 60% by default, 85% on hover.

```typescript
<motion.div
  initial={{ opacity: 0.6 }}
  animate={{ opacity: 0.6, left: position.x, top: position.y }}
  whileHover={{ scale: 1.05, opacity: 0.85 }}
/>
```

## Part 8 summary

- **SVG character** → brain + neuron tentacles + big eyes
- **Framer Motion** → floating, waving tentacles
- **Global mouse tracking** → pupils follow the cursor
- **Random movement** → relocates every 8–12 seconds
- **Shy dodging** → runs away gently when the mouse is near (almost catchable)
- **Click reactions** → random jump, spin, wobble, bounce
- **Toggle + localStorage** → hide/show persisted

I said feature work was over and then added more. Though this is less a feature than just something fun.

---

*Saying "I breathed life into the blog" would be too much, so let's just say I added something cute.*
