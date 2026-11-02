'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { compileArticleBlocks, decayWeight } = require('../tools/lib/article-blocks');

test('模块输出语义HTML和按同一数据绘制的宽窄SVG，无图片或外部依赖', () => {
  const source = ':::flow[处理链路]\n采集 | 先判重\n写作 | 忠于原文\n:::\n\n:::bars[信源]\n官方 | 10\n媒体 | 5\n个人 | 3\n:::\n\n:::decay[贡献]\nhalfLifeHours: 24\nwindowHours: 48\n:::';
  const result = compileArticleBlocks(source);
  assert.equal(result.count, 3);
  assert.match(result.markdown, /<ol class="article-flow" style="--flow-count:2">/);
  assert.match(result.markdown, /width:55\.555/);
  assert.match(result.markdown, /10<small> \/ 18/);
  assert.match(result.markdown, /decay-chart-wide/);
  assert.match(result.markdown, /decay-chart-compact/);
  assert.match(result.markdown, /<dt>48 小时<\/dt><dd>0%/);
  assert.doesNotMatch(result.markdown, /<img|<script|<iframe/);
});

test('严格处理48小时窗口边界，24小时减半', () => {
  assert.equal(decayWeight(0, 24, 48), 1);
  assert.equal(decayWeight(24, 24, 48), .5);
  assert.ok(Math.abs(decayWeight(12, 24, 48) - Math.SQRT1_2) < 1e-12);
  assert.ok(decayWeight(47.999, 24, 48) > .25);
  assert.equal(decayWeight(48, 24, 48), 0);
  assert.equal(decayWeight(49, 24, 48), 0);
});

test('保留代码围栏和普通文章，不把语法示例当成模块', () => {
  const source = '```markdown\n:::bars[示例]\n甲 | 1\n:::\n```\n\n普通正文';
  assert.deepEqual(compileArticleBlocks(source), { markdown: source, count: 0 });
  const tilde = '~~~~\n:::flow[示例]\n甲 | 乙\n:::\n~~~~';
  assert.equal(compileArticleBlocks(tilde).markdown, tilde);
});

test('损坏数据在构建时报错，不静默丢内容', () => {
  for (const source of [':::flow[标题]\n空行\n:::', ':::bars[标题]\n甲 | -3\n:::', ':::bars[标题]\n甲 | 0\n:::', ':::flow[标题]\n甲 | 乙', ':::decay[标题]\nhalfLifeHours: 0\nwindowHours: 48\n:::']) assert.throws(() => compileArticleBlocks(source));
});

test('文案转义，不能注入标签或Hexo模板指令', () => {
  const source = ':::flow[<script>]\n<img> | {% endraw %}<script>alert(1)</script>\n:::';
  const { markdown } = compileArticleBlocks(source);
  assert.match(markdown, /&lt;script&gt;/);
  assert.doesNotMatch(markdown, /<script>/);
  assert.doesNotMatch(markdown, /<span>\{% endraw %\}/);
});

test('文章仍沿用已发布章节锚点和固定源码版本', () => {
  const article = readFileSync('source/_posts/2026/10/20261023-aihot-architecture.md', 'utf8');
  assert.equal(compileArticleBlocks(article).count, 3);
  assert.doesNotMatch(article, /!\[[^\]]*\]\(\/images\/aihot/);
  assert.match(article, /permalink: \/posts\/aihot-architecture\//);
  assert.match(article, /b3998dc6fc138eb9659f33f55eb38c1c716f0d57/);
  assert.match(article, /## 热度：独立参与方，24 小时半衰期/);
});
