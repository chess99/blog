---
title: 人格测试的结果，15.8% 由数组顺序决定
date: 2026-04-11 00:00:00
tags:
  - 前端
  - JavaScript
  - 算法
categories: 技术
---

[SBTI](https://sbti.jerryz.com.cn/) 是一个最近在传的人格测试，27种人格全是互联网黑话：CTRL（拿捏者）、Dior-s（屌丝）、DRUNK（酒鬼）……整个网站三个静态文件，没有后端，部署在 Cloudflare Pages。

把源码扒下来看了一遍，核心算法很简单：用户的答题结果转成一个15维向量，然后和25种人格的标准向量逐一比距离，最近的就是你的人格。

但把 3^15 = **1400万种**可能的输入全部枚举一遍之后，发现了一个问题：**15.8% 的情况下，结果由代码里的数组顺序决定，而不是你的答案。**

<!-- more -->

## 答题过程变成一个15维向量

先说清楚算法的输入是怎么来的。

SBTI 有 15 个测评维度，分5个模型：

| 模型 | 维度 |
|------|------|
| 自我模型 | S1 自尊自信 / S2 自我清晰度 / S3 核心价值 |
| 情感模型 | E1 依恋安全感 / E2 情感投入度 / E3 边界与依赖 |
| 态度模型 | A1 世界观倾向 / A2 规则与灵活度 / A3 人生意义感 |
| 行动驱力模型 | Ac1 动机导向 / Ac2 决策风格 / Ac3 执行模式 |
| 社交模型 | So1 社交主动性 / So2 人际边界感 / So3 表达与真实度 |

30道正式题，每个维度对应2道题，每题选项值 1/2/3。两题加起来，每个维度原始分 2-6分，然后用这个函数压缩成三档：

```js
function sumToLevel(score) {
  if (score <= 3) return 'L';
  if (score === 4) return 'M';
  return 'H';    // score >= 5
}
```

注意这里的分布是不对称的：L 覆盖 2-3 分（两档），M 只覆盖 4 分（一档），H 覆盖 5-6 分（两档）。M 区间最窄，稍微偏一点就掉进 L 或 H。

15个维度各得到 L/M/H，拼在一起就是用户的"人格向量"，比如 `HHH-HMH-MHH-HHH-MHM`。

## 匹配算法：曼哈顿距离

25种常规人格，每种预设了一个标准向量：

```js
const NORMAL_TYPES = [
  { code: "CTRL",   pattern: "HHH-HMH-MHH-HHH-MHM" },
  { code: "BOSS",   pattern: "HHH-HMH-MMH-HHH-LHL" },
  { code: "DEAD",   pattern: "LLL-LLM-LML-LLL-LHM" },
  // ...共25种
];
```

把 L/M/H 映射成 1/2/3，然后计算用户向量与每种人格标准向量的曼哈顿距离，距离最小的就是结果：

```js
const ranked = NORMAL_TYPES.map(type => {
  const vector = parsePattern(type.pattern).map(levelNum);
  let distance = 0;
  let exact = 0;
  for (let i = 0; i < vector.length; i++) {
    const diff = Math.abs(userVector[i] - vector[i]);
    distance += diff;
    if (diff === 0) exact += 1;  // 精准命中的维度数
  }
  const similarity = Math.max(0, Math.round((1 - distance / 30) * 100));
  return { ...type, distance, exact, similarity };
}).sort((a, b) => {
  if (a.distance !== b.distance) return a.distance - b.distance;
  if (b.exact !== a.exact) return b.exact - a.exact;   // 距离相同，精准命中多的优先
  return b.similarity - a.similarity;                  // 还相同，相似度高的优先
});
```

最大距离是 30（15个维度，每个维度最多差2），所以相似度 = `(1 - distance/30) * 100`。

排序有三级：先比距离，距离相同比精准命中维度数，还相同比相似度。

## 第三级排序是冗余的

注意到第三条了吗？

```js
return b.similarity - a.similarity;
```

`similarity` 是由 `distance` 唯一决定的——`(1 - distance/30) * 100`，distance 相同则 similarity 必然相同。所以第三条永远不会产生任何区分效果，是一段无用代码。

实际上只有两级排序：距离，然后精准命中数。

## 1400万种输入，全部枚举

3^15 = 14,348,907。每个维度取 L/M/H 三种值，15个维度，全部组合枚举一遍，看看有多少会出现并列。

```js
// 枚举所有 3^15 种向量
const vec = new Array(15).fill(1);  // 1=L, 2=M, 3=H
while (true) {
  const scores = typeVecs.map((tv, idx) => {
    let dist = 0, exact = 0;
    for (let i = 0; i < 15; i++) {
      const d = Math.abs(vec[i] - tv[i]);
      dist += d;
      if (d === 0) exact++;
    }
    return { dist, exact, idx };
  });
  scores.sort((a, b) => a.dist - b.dist || b.exact - a.exact);

  const best = scores[0], second = scores[1];
  if (best.dist === second.dist && best.exact === second.exact) {
    // 真正无法区分
  }
  // 进位...
}
```

结果：

| 情况 | 向量数 | 占比 |
|------|--------|------|
| 总向量数 | 14,348,907 | 100% |
| 第1名和第2名距离相同（第一级排序能区分） | 5,094,857 | **35.5%** |
| 距离+精准命中都相同（真正无法区分） | 2,270,028 | **15.8%** |

**35.5% 的输入会触发并列**，其中 15.8% 是代码完全无法区分的——这时候谁赢，取决于谁在 `NORMAL_TYPES` 数组里下标更小。JavaScript 的 `Array.sort` 是稳定排序，下标小的人格会稳定赢得这场平局。

## 最容易碰撞的人格对

枚举结果里，最常产生真正并列的人格对：

| 人格对 | 并列向量数 |
|--------|-----------|
| CTRL vs GOGO | 149,867 |
| THIN-K vs WOC! | 128,700 |
| OJBK vs THAN-K | 113,152 |
| MONK vs ZZZZ | 107,303 |
| DEAD vs SOLO | 100,142 |

CTRL（拿捏者）和 GOGO（行者）是最严重的一对，有 **14.9 万种**不同的答题组合，两者距离和精准命中完全相同，最终结果由数组顺序决定——而 CTRL 排在第0位，GOGO 排在第6位，所以 CTRL 赢。

## 最相似的两个人格

JOKE-R（小丑）和 IMFW（废物）的标准向量距离只有 **1**：

```
JOKE-R: LLH-LHL-LML-LLL-MLM
IMFW:   LLH-LHL-LML-LLL-MLL
```

15个维度里14个完全相同，唯一差异是最后一个维度 So3（表达与真实度）：JOKE-R 是 M，IMFW 是 L。

也就是说，So3 维度两题加起来得4分（转成 M）→ 你是小丑；得3分（转成 L）→ 你是废物。差一分，换一个人格。

从人格描述看，这两个确实高度重叠：小丑"用最大的笑声，盖住心碎的声音"，废物"太没防备，太容易认真"。设计上本来就是两个相邻的人格，标准向量几乎相同是预期内的。

## 这是 bug 吗？

不是。这是人格测试这类产品的本质。

1400万种输入 → 25个输出，平均每个人格对应 **57万种**不同的答题组合。你和另一个答法完全不同的人，可能得到同一个结果。

MBTI 也一样：16种类型覆盖所有人，每种类型内部的差异可以非常大。把连续的人格空间离散化成有限的类型，本来就是有损压缩——这是设计目标，不是缺陷。有损压缩的结果就是信息丢失，边界附近的输入被强行归到某一侧。

15.8% 的"由数组顺序决定"，换个说法是：这些人处于人格空间的边界地带，距离两种人格等距，系统必须选一个，选哪个都有道理。

真正值得关注的是 JOKE-R 和 IMFW 这种情况——两个标准向量距离只有1的人格，意味着设计者把两个极度相似的类型放进了同一个系统，它们之间的边界太窄，一道题的一分之差就能切换结果。如果想让25种人格都有清晰的区分度，标准向量之间的最小距离应该更大一些。

---

## 附：其他实现细节

**特殊人格触发**：DRUNK（酒鬼）通过隐藏题触发——答了"爱好是饮酒"才会出现追加题，追加题选"习惯将白酒灌保温杯当白开水喝"，直接跳过所有常规匹配，强制输出 DRUNK，匹配度显示 100%。HHHH（傻乐者）是兜底人格，最高相似度低于 60% 时触发，描述里直接承认"作者设置人格时没有考虑全面"。

**Canvas 导出图片**：结果页可以导出 1080×1440 的分享图，没有用 html2canvas，完全手写 Canvas 绘图，包括自动换行（逐字 `measureText`）、圆角矩形、图片 cover 裁剪、QR码（调 quickchart.io API，base64 缓存）。

**分享降级链**：`navigator.share` → `navigator.clipboard.writeText` → `document.execCommand('copy')`，三级降级。

**localStorage 探测**：存结果前先写一个探针 key 再删掉，确认 localStorage 可用，处理隐私模式下被禁用的情况。

**题目随机顺序**：每次开始测试 Fisher-Yates 洗牌，`drink_gate_q1`（爱好题）随机插入题目列表中间，不固定位置。
