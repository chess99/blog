---
title: 拆解一个人格测试：结果页藏着淘宝链接，"同类人"数字是随机数
date: 2026-04-13 00:00:00
tags:
  - 前端
  - JavaScript
  - 产品分析
categories: 技术
---

[XPTI](https://xpti.pages.dev/) 是最近在传的另一个人格测试，20道题，16种人格类型，界面比 SBTI 精致很多——React + Framer Motion，题目切换有滑动动画，结果页有雷达图。

测完之后页面底部会出现一行字：**"全国有 X.X% 的人拥有和你一样的极品 XP。"**

把源码下载下来看了一眼，这个数字是这样生成的：

```js
const count = Math.floor(Math.random() * 8000) + 1000;
const percent = (Math.random() * 3 + 1).toFixed(1);
```

每次刷新都不同。没有任何统计数据支撑，纯粹是让结果看起来"稀有"的心理设计。

<!-- more -->

## 人格测试只是流量入口

结果页除了人格类型描述，还有一个"理想伴侣"推荐模块，根据你的测试结果匹配一种角色形象：纯情小女仆、温情猫娘、高冷御姐、抖S女王……每种形象下面有一个按钮，点击跳转淘宝。

8种形象，8个链接，全部指向同一个淘宝短链 `https://s.tb.cn/c.0DFCI5`。

这不是什么隐秘的设计——代码里写得很清楚：

```js
DVP: {
  name: "纯情小女仆",
  imageUrls: ["/images/女仆2.webp", "/images/女仆.webp"],
  taobaoUrl: "https://s.tb.cn/c.0DFCI5",
  desc: "乖巧听话，满眼都是你",
  quote: "..."
},
SVN: {
  name: "抖S女王",
  imageUrls: ["/images/旋风.webp"],
  taobaoUrl: "https://s.tb.cn/c.0DFCI5",  // 同一个链接
  desc: "绝对的支配者，让你欲罢不能",
  quote: "..."
}
```

人格测试的本质是一个流量漏斗：用有趣的题目吸引用户完成测试，在结果页完成转化。这个模型不新鲜，但 XPTI 做得比较直接——没有绕弯子，结果页就是购物推荐页。

## 算法：和 MBTI 完全一样

XPTI 的人格体系是 4 个二元维度：

| 维度 | 方向A | 方向B |
|------|-------|-------|
| 支配感 | D（支配） | S（顺从） |
| 吸引力来源 | V（视觉/颜控） | E（情感/走心） |
| 关系观 | P（纯爱/专一） | N（混沌/猎奇） |
| 幻想倾向 | F（幻想/二次元） | R（现实） |

20道题，每道题的选项直接标注维度字母，选了就给对应维度加1分，有些选项标 `null`（不计入任何维度，纯娱乐题）：

```js
{ text: "狂喜！直接往地上一躺：'姐姐踩我！'", value: "S" },
{ text: "邪魅一笑：'今晚看我怎么收拾你。'", value: "D" },
{ text: "我只玩亚索，只要我E得够快……", value: null }  // 废题
```

计分完成后，4对维度各取得分较高的方向，拼成4位代码：

```js
const f = scores.D >= scores.S ? "D" : "S";
const d = scores.V >= scores.E ? "V" : "E";
const h = scores.P >= scores.N ? "P" : "N";
const v = scores.F >= scores.R ? "F" : "R";
const typeCode = `${f}${d}${h}${v}`;  // 例如 "DVPF"
```

2⁴ = 16种类型，覆盖所有组合。这和 MBTI 的逻辑完全相同，只是把 I/E/S/N/T/F/J/P 换成了 D/S/V/E/P/N/F/R。

## 平局怎么处理？不处理

XPTI 用 `>=` 比较，D 和 S 得分相等时，D 赢。4个维度都是这样——平局时永远取前者（D、V、P、F）。

没有任何平局处理逻辑，没有追加题，没有二次排序。如果你在某个维度上答题完全中立，结果就由运算符方向决定。

这比 SBTI 的处理还要粗糙。SBTI 至少有三级排序（距离 → 精准命中数 → 相似度），XPTI 直接用 `>=` 了事。

## 技术栈：628KB 的 bundle

SBTI 是三个静态文件，零框架，1705 行原生 JS。

XPTI 是 React + Vite 打包，628KB 的 bundle，包含：
- React + ReactDOM
- Framer Motion（题目切换动画、结果页入场动画）
- Recharts（雷达图）
- 51la 统计（`sdk.51.la/js-sdk-pro.min.js`）

题目切换的滑动动画用 Framer Motion 的 `AnimatePresence` 实现，每道题进场时从右侧 50px 滑入，退场时向左滑出：

```jsx
<AnimatePresence mode="wait">
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -50 }}
    transition={{ duration: 0.3 }}
  >
    {/* 题目内容 */}
  </motion.div>
</AnimatePresence>
```

这是 XPTI 和 SBTI 最明显的体验差异来源——不是算法，不是题目质量，是动画。

## 没有结果持久化

测完关掉页面，结果消失。没有 localStorage，没有 URL 参数，没有任何持久化机制。

想分享结果只能截图，或者复制网址让朋友自己测。这是一个有意为之的设计还是遗漏，不好判断——但结果是：每个想分享结果的用户都会主动传播网站链接，而不是分享一个带结果的 URL。

---

两个测试放在一起看，技术选型和产品逻辑完全不同：

SBTI 是作者自己玩出来的东西，原生 JS 写完，算法花了心思（向量距离匹配），题目文案有强烈的个人风格，没有任何变现设计。

XPTI 从一开始就想清楚了：用精致的 UI 降低跳出率，用有趣的题目完成测试，在结果页完成转化。"同类人"的随机数字、伴侣形象的推荐文案、淘宝链接——每个细节都在服务这个目标。

两种路子，都跑通了。
