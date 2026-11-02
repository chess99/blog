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
  assert.equal(compileArticleBlocks(article).count, 4);
  assert.doesNotMatch(article, /!\[[^\]]*\]\(\/images\/aihot/);
  assert.match(article, /permalink: \/posts\/aihot-architecture\//);
  assert.match(article, /b3998dc6fc138eb9659f33f55eb38c1c716f0d57/);
  assert.match(article, /## 热度：独立参与方，24 小时半衰期/);
});

test('同一评分模块接受不同文章的门槛和文案，无脚本仍有默认计算结果', () => {
  const { JSDOM } = require('jsdom');
  const script = readFileSync('source/js/article-visuals.js', 'utf8');
  for (const [name, threshold] of [['初审', 40], ['复审', 85]]) {
    const source = `:::score[通用门槛演示]\nfirst: 60\nsecond: 70\ngroupLabel: 审核阶段\n${name} | ${threshold}\nnote: 本文的独立说明\n:::`;
    const html = compileArticleBlocks(source).markdown.replace(/\{% (?:end)?raw %\}/g, '');
    const dom = new JSDOM(html, { runScripts: 'outside-only' });
    const d = dom.window.document;
    const staticResult = d.querySelector('[role=status]').textContent;
    assert.equal(d.querySelector('[data-score-form]').hidden, true);
    assert.ok(staticResult.includes(threshold === 40 ? '达到门槛 ·' : '未达到门槛 ·'));
    assert.equal(d.querySelector('select option').value, String(threshold));
    assert.equal(d.querySelector('.score-tier-label').textContent, '审核阶段');
    dom.window.eval(script);
    assert.equal(d.querySelector('[data-score-form]').hidden, false);
    assert.equal(d.querySelector('[role=status]').textContent, staticResult);
    d.querySelector('[name=first]').value = '100';
    d.querySelector('[name=second]').value = '100';
    d.querySelector('form').dispatchEvent(new dom.window.Event('input', { bubbles: true }));
    assert.match(d.querySelector('[role=status]').textContent, /100 \+ 100 ≥/);
    assert.ok(d.querySelector('.score-note').textContent.includes('独立说明'));
    dom.window.close();
  }
});

test('评分参数校验与共享算法保留临界值和半分取整', () => {
  const { compareScores } = require('../source/js/article-visuals');
  assert.equal(compareScores(75, 77, 76).passes, true);
  assert.equal(compareScores(74, 77, 76).passes, false);
  assert.equal(compareScores(76, 77, 76).mean, 76.5);
  assert.equal(compareScores(76, 77, 76).floored, 76);
  for (const body of ['first: 101\n一级 | 60', 'selected: 2\n一级 | 60', '一级 | 101', '一级 | NaN']) {
    assert.throws(() => compileArticleBlocks(`:::score[演示]\n${body}\n:::`));
  }
});

test('公共脚本、样式与构建插件不包含文章名和固定业务档位', () => {
  for (const file of ['source/js/article-visuals.js', 'source/css/article-visuals.css', 'scripts/article-visuals.js', 'tools/lib/article-blocks.js']) {
    const text = readFileSync(file, 'utf8');
    assert.doesNotMatch(text, /aihot|T1_5|T1|T2|官方一手|信源等级/i, file);
  }
});
