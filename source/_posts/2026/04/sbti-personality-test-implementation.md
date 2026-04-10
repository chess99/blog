---
title: 27种人格，1705行JS：SBTI测试的实现拆解
date: 2026-04-10 00:00:00
tags:
  - 前端
  - JavaScript
  - 产品设计
categories: 技术
---

## 背景

最近刷到一个叫 [SBTI](https://sbti.jerryz.com.cn/) 的人格测试，标榜"MBTI已经过时"，27种人格名字全是互联网黑话：CTRL（拿捏者）、Dior-s（屌丝）、FUCK（草者）、DRUNK（酒鬼）……

测了一下，发现结果页有雷达图、可以导出分享图片、还有隐藏人格触发机制。整个网站就三个文件：`index.html`、`styles.css`、`app.js`，没有任何框架，没有后端，纯静态部署在 Cloudflare Pages。

把源码扒下来仔细看了一遍，记录几个值得学的设计。

<!-- more -->

## 整体架构：没有框架的"框架"

整个应用 1705 行 JavaScript，零依赖（除了 Chart.js 画雷达图）。

页面结构是三个 `<section>`，用 CSS class `active` 控制显隐：

```html
<section id="intro" class="screen active">  <!-- 首页 -->
<section id="test" class="screen">          <!-- 答题 -->
<section id="result" class="screen">        <!-- 结果 -->
```

切换屏幕就是一个函数：

```js
function showScreen(name) {
  ['intro', 'test', 'result'].forEach(key => {
    const el = document.getElementById(key);
    if (el) el.classList.toggle('active', key === name);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
```

没有路由，没有状态管理库，所有状态放在一个全局 `app` 对象里：

```js
const app = {
  shuffledQuestions: [],
  answers: {},
  previewMode: false,
  currentResult: null,
  savedResult: null,
  qrDataUrl: '',
  radarChart: null,
  toastTimer: null
};
```

简单粗暴，但对这个体量的应用来说完全够用。

## 维度模型：15个维度，5个模型

SBTI 的测评体系比 MBTI 复杂，分5个模型，15个维度：

| 模型 | 维度 |
|------|------|
| 自我模型 | S1 自尊自信 / S2 自我清晰度 / S3 核心价值 |
| 情感模型 | E1 依恋安全感 / E2 情感投入度 / E3 边界与依赖 |
| 态度模型 | A1 世界观倾向 / A2 规则与灵活度 / A3 人生意义感 |
| 行动驱力模型 | Ac1 动机导向 / Ac2 决策风格 / Ac3 执行模式 |
| 社交模型 | So1 社交主动性 / So2 人际边界感 / So3 表达与真实度 |

30道正式题，每道题对应一个维度，每个维度两道题，每题选项值 1/2/3，所以每个维度原始分 2-6分。

分数转等级的逻辑极简：

```js
function sumToLevel(score) {
  if (score <= 3) return 'L';
  if (score === 4) return 'M';
  return 'H';
}
```

15个维度各得到 L/M/H 之一，就形成了一个15位的"人格向量"，比如 `HHH-HMH-MHH-HHH-MHM`。

## 人格匹配：向量距离算法

这是整个系统最核心的部分。

25种常规人格，每种都预设了一个15位的标准向量（pattern）：

```js
const NORMAL_TYPES = [
  { code: "CTRL",  pattern: "HHH-HMH-MHH-HHH-MHM" },
  { code: "BOSS",  pattern: "HHH-HMH-MMH-HHH-LHL" },
  { code: "DEAD",  pattern: "LLL-LLM-LML-LLL-LHM" },
  // ...25种
];
```

用户答完题后，计算用户向量与每种人格标准向量之间的曼哈顿距离（Manhattan Distance）：

```js
const ranked = NORMAL_TYPES.map(type => {
  const vector = parsePattern(type.pattern).map(levelNum);
  let distance = 0;
  let exact = 0;
  for (let i = 0; i < vector.length; i++) {
    const diff = Math.abs(userVector[i] - vector[i]);
    distance += diff;
    if (diff === 0) exact += 1;
  }
  const similarity = Math.max(0, Math.round((1 - distance / 30) * 100));
  return { ...type, distance, exact, similarity };
}).sort((a, b) => {
  if (a.distance !== b.distance) return a.distance - b.distance;
  if (b.exact !== a.exact) return b.exact - a.exact;
  return b.similarity - a.similarity;
});
```

L=1，M=2，H=3，距离最小的就是最匹配的人格。相似度公式：`(1 - distance/30) * 100`，最大距离是 30（每个维度最多差2，共15个维度），所以相似度范围是 0-100%。

## 特殊人格触发机制

除了25种常规人格，还有2种隐藏人格，触发条件硬编码：

**DRUNK（酒鬼）**：题目里有一道伪装成普通问题的"爱好题"（`drink_gate_q1`），选了"饮酒"之后才会出现追加题（`drink_gate_q2`）。如果追加题选了"习惯将白酒灌在保温杯当白开水喝"，直接触发 DRUNK，跳过所有常规匹配：

```js
if (drunkTriggered) {
  finalType = TYPE_LIBRARY.DRUNK;
  modeKicker = '隐藏人格已激活';
  badge = '匹配度 100% · 酒精异常因子已接管';
  special = true;
}
```

**HHHH（傻乐者）**：兜底人格，当最高匹配度低于 60% 时强制分配：

```js
} else if (bestNormal.similarity < 60) {
  finalType = TYPE_LIBRARY.HHHH;
  modeKicker = '系统强制兜底';
  badge = `标准人格库最高匹配仅 ${bestNormal.similarity}%`;
  special = true;
}
```

HHHH 的描述里直接承认这是作者的失误："作者设置人格时没有考虑全面，因此才会出现这样的状况。哈哈哈哈哈哈……"——这种自嘲式的设计挺有意思。

题目顺序是每次随机打乱的，`drink_gate_q1` 会被随机插入到题目列表中间某个位置，不会固定在某道题后面。

## 结果图片导出：纯 Canvas 绘图

结果页有一个"导出图片"功能，生成 1080×1440 的分享图。没有用任何截图库（html2canvas 之类），完全手写 Canvas 绘图。

整个流程：

1. 创建 1080×1440 的 `<canvas>`
2. 绘制渐变背景和装饰圆
3. 绘制白色卡片（圆角矩形）
4. 异步加载人格图片和二维码图片（并行 `Promise.all`）
5. 将人格图片 cover 裁剪到固定区域（和 CSS 的 `object-fit: cover` 效果一样，但用 Canvas 手算）
6. 绘制文字，包含自动换行和省略号截断
7. `canvas.toDataURL()` 转 PNG，创建 `<a>` 标签模拟点击下载

其中文字自动换行是手写的，逐字测量宽度：

```js
function wrapTextLines(ctx, text, maxWidth, maxLines = Infinity) {
  const normalized = String(text || '').replace(/\s+/g, ' ').trim();
  const lines = [];
  let current = '';

  for (const char of normalized) {
    const next = current + char;
    if (ctx.measureText(next).width <= maxWidth || !current) {
      current = next;
      continue;
    }
    lines.push(current);
    current = char;
    if (lines.length === maxLines) break;
  }
  // ...
}
```

二维码通过 quickchart.io 的 API 生成，第一次请求后缓存 base64 到 `app.qrDataUrl`，避免重复请求。

## 结果持久化：localStorage

测试结果存在 `localStorage`，key 是 `sbti:last-result:v2`（版本号 v2，说明数据格式曾经升级过）。

存储之前先探测 localStorage 是否可用（隐私模式下可能被禁用）：

```js
function storageAvailable() {
  try {
    const key = '__sbti_probe__';
    localStorage.setItem(key, '1');
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    return false;
  }
}
```

这个写法是标准的 localStorage 可用性检测，比直接 `typeof localStorage !== 'undefined'` 更可靠。

## 分享：Web Share API 降级到剪贴板

```js
async function sharePayload(payload) {
  if (navigator.share) {
    try {
      await navigator.share(payload);
      return;
    } catch (error) {
      if (error && error.name === 'AbortError') return;  // 用户取消
    }
  }
  // 降级：复制到剪贴板
  await copyText([payload.title, payload.text, payload.url].filter(Boolean).join('\n'));
  showToast('分享文案和链接已复制');
}
```

剪贴板写入也有降级：优先用 `navigator.clipboard.writeText`（需要 HTTPS），降级到 `document.execCommand('copy')`（已废弃但兼容性好）。

## CSS：设计系统

样式部分 934 行，用 CSS 变量维护了一套简单的设计 token：

```css
:root {
  --bg: #f6faf6;
  --panel: #ffffff;
  --text: #1e2a22;
  --muted: #6a786f;
  --line: #dbe8dd;
  --soft: #edf6ef;
  --accent: #6c8d71;
  --accent-strong: #4d6a53;
  --shadow: 0 16px 40px rgba(47, 73, 55, 0.08);
  --radius: 22px;
}
```

整体配色是低饱和度的绿色系，视觉上比较克制。背景用了两层叠加：`<html>` 上一个径向渐变，`body::before` 伪元素再叠一个半透明渐变，制造轻微的景深感。

标题字号用了 `clamp()`：

```css
.hero h1 {
  font-size: clamp(28px, 5vw, 52px);
}
```

移动端 28px，桌面端最大 52px，中间按视口宽度线性插值，不需要写 media query。

## 几个值得学的细节

**题目随机顺序**：每次开始测试都重新 Fisher-Yates 洗牌，避免顺序效应影响答题。

**进度条实时更新**：每次答题后立即更新进度条和"已答/总题数"，提交按钮在全部答完前禁用。

**雷达图懒渲染**：`renderRadarChart` 放在 `requestAnimationFrame` 里，等 DOM 更新完再渲染，避免尺寸计算错误。

**DocumentFragment 批量插入**：首页的27种人格卡片用 `createDocumentFragment()` 批量构建后一次性插入，减少 reflow 次数。

---

整个项目代码质量不错，在不用框架的情况下把交互逻辑组织得比较清晰。核心的向量距离匹配算法简单有效，特殊人格的触发条件设计也有趣。

唯一的槽点是题目文案……第一题直接放了一段很长的网络情绪文本，属于"你能接受就继续，不能接受就关掉"的风格，确实不是所有人都会喜欢。

代码在 Cloudflare Pages 上，三个静态文件，没有后端，零运维成本。
