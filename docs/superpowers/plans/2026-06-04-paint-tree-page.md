# Paint Tree Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/pages/paint-tree/` Hexo page that recreates the original tree-canvas layout, with the site’s own identity and assets.

**Architecture:** Use a standalone Hexo page directory under `source/pages/paint-tree/` so the route is generated naturally as `/pages/paint-tree/`. Keep the page logic split into a Markdown entry file plus colocated CSS and ES module script, mirroring the original page’s structure while keeping the implementation easy to reason about. The rendering will be done with plain DOM and Canvas 2D API so the page does not depend on any site-level framework injection.

**Tech Stack:** Hexo, NexT theme, plain HTML/CSS/JavaScript, Canvas 2D API.

---

### Task 1: Create the page entry and page assets

**Files:**
- Create: `source/pages/paint-tree/index.md`
- Create: `source/pages/paint-tree/index.css`
- Create: `source/pages/paint-tree/index.js`

- [ ] **Step 1: Write the page markup**

```markdown
---
title: 随机绘制一棵树
comments: false
---

<link rel="stylesheet" href="./index.css">

<div id="app"></div>
<script type="module" src="./index.js"></script>
```

- [ ] **Step 2: Write the page styles**

```css
#container {
  width: 100%;
  max-width: 500px;
  aspect-ratio: 1 / 1;
  position: relative;
  margin: 0 auto;
  background: #fffbed;
}

#container::before,
#container::after {
  content: "";
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  border-radius: 50%;
}

#container::before {
  background-color: #9dbeb7;
}

#container::after {
  background-color: #2a574d;
  clip-path: circle(150% at 50% 218%);
}

canvas {
  position: relative;
  aspect-ratio: 1 / 1;
  z-index: 2;
}

#cloud {
  background: rgb(255, 255, 255);
  width: 300px;
  height: 100px;
  border-radius: 150px;
  box-shadow: 10px 10px rgba(0, 0, 0, 0.2);
  animation: move 16s ease-in-out infinite;
  position: absolute;
  inset: auto 0 10% 0;
  margin: auto;
  z-index: 1;
  opacity: 0.5;
}

#cloud:nth-child(2) {
  animation-delay: -4s;
  bottom: 0;
  scale: 0.7;
}

#cloud::before,
#cloud::after {
  content: "";
  background: rgba(255, 255, 255);
  position: absolute;
  border-radius: 50%;
}

#cloud::after {
  width: 100px;
  height: 100px;
  top: -50px;
  left: 50px;
}

#cloud::before {
  width: 170px;
  height: 150px;
  top: -90px;
  right: 40px;
}

@keyframes move {
  0% {
    transform: translatex(-100px);
  }

  50% {
    transform: translatex(100px);
  }

  100% {
    transform: translatex(-100px);
  }
}
```

- [ ] **Step 3: Write the canvas renderer**

```js
const app = document.getElementById("app");

const container = document.createElement("div");
container.id = "container";

const canvas = document.createElement("canvas");
canvas.id = "patternCanvas";

const cloud1 = document.createElement("div");
cloud1.id = "cloud";

const cloud2 = document.createElement("div");
cloud2.id = "cloud";

container.append(canvas, cloud1, cloud2);
app.append(container);

const ctx = canvas.getContext("2d");
let blossomIndex = 1;

const drawBlossom = (x, y, isOrange) => {
  ctx.save();

  if (isOrange) {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#e66e4a";
    ctx.fill();
    ctx.shadowColor = "rgb(255, 102, 0)";
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.shadowColor = "rgb(255, 255, 255)";
    ctx.shadowBlur = 2;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
};

const drawBranch = (depth, x, y, angle, length, width) => {
  if (length < 5) {
    const isOrange = blossomIndex % 50 === 0;
    blossomIndex += 1;
    drawBlossom(x, y, isOrange);
    return;
  }

  ctx.lineWidth = width;
  ctx.strokeStyle = "#412e1f";
  ctx.beginPath();
  ctx.moveTo(x, y);

  const nextX = x + Math.cos(angle) * length;
  const nextY = y + Math.sin(angle) * length;
  ctx.lineTo(nextX, nextY);
  ctx.stroke();

  const direction = Math.random() < 0.5 ? 1 : -1;
  const spread = Math.floor(Math.random() * 20) + 21;

  for (let i = 0; i < 3; i += 1) {
    if (i !== 0 && (depth >= 3 && (i & 1) === 0 || Math.random() * 100 < 39)) {
      continue;
    }

    const nextAngle = angle + direction * (Math.PI / (180 / spread)) * (i - 1);
    const nextLength = length * (0.6 + Math.random() * 0.2);
    drawBranch(depth + 1, nextX, nextY, nextAngle, nextLength, width * 0.8);
  }
};

const render = () => {
  const width = container.clientWidth;
  const height = container.clientWidth;

  canvas.width = width;
  canvas.height = height;
  ctx.clearRect(0, 0, width, height);
  blossomIndex = 1;

  const x = width / 2;
  const y = height / 2 + 145;
  const angle = -Math.PI / 2;
  const length = Math.min(120, Math.min(height / 4, height / 5.5));

  drawBranch(1, x, y, angle, length, 7);
};

render();
window.addEventListener("resize", render);
```

- [ ] **Step 4: Verify the page source is in the correct route**

Run:
```bash
sed -n '1,220p' source/pages/paint-tree/index.md
```
Expected:
The file contains the page front matter, `./index.css`, and `./index.js` references under `source/pages/paint-tree/`.

### Task 2: Keep the page discoverable only through the intended route

**Files:**
- No source file changes required.

- [ ] **Step 1: Add no menu entry**

```yml
menu:
  home: / || fas fa-home
  tags: /tags/ || fas fa-tags
  categories: /categories/ || fas fa-stream
  友链: /friends/ || fas fa-link
```

- [ ] **Step 2: Keep the page out of the visible navigation**

No code change is required beyond leaving the menu unchanged. The route stays reachable at `/pages/paint-tree/` without adding a top-level menu item.

- [ ] **Step 3: Record the final route**

```text
/pages/paint-tree/
```
