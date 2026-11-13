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

test('diagram 保留嵌套布局、节点顺序、说明与代码，无脚本即可阅读', () => {
  const { JSDOM } = require('jsdom');
  const data = {
    layout: 'stack', arrows: true, note: '架构关系示意', items: [
      { title: '交互入口', chips: ['桌面端', 'CLI'], tone: 'accent', badge: '入口' },
      { layout: 'row', columns: 2, title: '执行层', items: [
        { title: '模型', text: '生成下一步动作' },
        { layout: 'grid', columns: 2, text: '运行时能力', items: [
          { title: '工具', code: ['ctx.tools', 'ctx.sessions'] },
          { text: '文件与会话', tone: 'muted' }
        ] }
      ] }
    ]
  };
  const result = compileArticleBlocks(`:::diagram[运行系统]\n${JSON.stringify(data)}\n:::`);
  assert.equal(result.count, 1);
  const dom = new JSDOM(result.markdown.replace(/\{% (?:end)?raw %\}/g, ''));
  const d = dom.window.document;
  assert.equal(d.querySelector('figcaption').textContent, '运行系统');
  assert.equal(d.querySelector('.article-diagram-root > ol').children.length, 2);
  assert.equal(d.querySelector('.article-diagram-root > ol > li > .article-diagram-card').textContent, '交互入口入口桌面端CLI');
  assert.equal(d.querySelector('.article-diagram-row').style.getPropertyValue('--diagram-columns'), '2');
  assert.equal(d.querySelector('.article-diagram-grid').children.length, 2);
  assert.equal(d.querySelector('.article-diagram-chips').textContent, '桌面端CLI');
  assert.equal(d.querySelector('pre code').textContent, 'ctx.tools\nctx.sessions');
  assert.equal(d.querySelector('.article-viz-note').textContent, '架构关系示意');
  assert.equal(d.querySelectorAll('script, iframe, img, [hidden]').length, 0);
  dom.window.close();
});

test('diagram 明确保留加号、等号和双向连接，默认箭头单独标记以适配窄屏', () => {
  const { JSDOM } = require('jsdom');
  const compile = data => new JSDOM(compileArticleBlocks(`:::diagram[关系]\n${JSON.stringify(data)}\n:::`).markdown.replace(/\{% (?:end)?raw %\}/g, ''));
  const symbols = ['↓', '→', '↕', '↔', '+', '=', '⑂'];
  const dom = compile({ layout: 'row', arrows: true, connectors: symbols, items: Array.from({ length: 8 }, (_, index) => ({ title: `节点${index}` })) });
  const connectors = [...dom.window.document.querySelectorAll('.article-diagram-connector')];
  assert.deepEqual(connectors.map(node => node.querySelector('svg') ? 'fork' : node.textContent), symbols.map(symbol => symbol === '⑂' ? 'fork' : symbol));
  const fork = connectors.at(-1).querySelector('svg.article-diagram-fork');
  assert.equal(fork.querySelectorAll('circle').length, 3);
  assert.equal(fork.getAttribute('focusable'), 'false');
  assert.equal(connectors.at(-1).textContent, '');
  assert.ok(connectors.every(node => node.getAttribute('aria-hidden') === 'true'));
  assert.equal(dom.window.document.querySelectorAll('.article-diagram-connector-auto').length, 0);
  assert.equal(dom.window.document.querySelector('.article-diagram-items > li:last-child > .article-diagram-connector'), null);
  dom.window.close();
  for (const layout of ['stack', 'row', 'grid']) {
    const defaults = compile({ layout, arrows: true, items: [{ title: '前' }, { title: '后' }] });
    const connector = defaults.window.document.querySelector('.article-diagram-connector');
    assert.equal(connector.textContent, layout === 'stack' ? '↓' : '→');
    assert.equal(connector.classList.contains('article-diagram-connector-auto'), layout !== 'stack');
    defaults.window.close();
  }
});

test('diagram 拒绝无箭头、数量错误或包含非白名单字符的 connectors', () => {
  const source = connectors => `:::diagram[关系]\n${JSON.stringify(connectors)}\n:::`;
  const items = [{ title: 'A' }, { title: 'B' }];
  for (const fields of [
    { connectors: ['+'] }, { arrows: false, connectors: ['+'] },
    { arrows: true, connectors: '+' }, { arrows: true, connectors: [] },
    { arrows: true, connectors: ['+', '='] }, { arrows: true, connectors: [null] },
    { arrows: true, connectors: ['<script>'] }, { arrows: true, connectors: ['⇌'] }
  ]) assert.throws(() => compileArticleBlocks(source({ layout: 'stack', items, ...fields })), /connectors/);
  assert.doesNotThrow(() => compileArticleBlocks(source({ layout: 'stack', arrows: true, connectors: [], items: [{ title: '单节点' }] })));
});

test('diagram 的所有文案字段转义 HTML 与模板指令', () => {
  const { JSDOM } = require('jsdom');
  const unsafe = '{% endraw %}<script>attack()</script><img src=x onerror=attack()>';
  const data = { layout: 'stack', title: unsafe, text: unsafe, note: unsafe, items: [{ title: unsafe, text: unsafe, badge: unsafe, chips: [unsafe], code: [unsafe] }] };
  const result = compileArticleBlocks(`:::diagram[${unsafe}]\n${JSON.stringify(data)}\n:::`);
  assert.equal((result.markdown.match(/\{% endraw %\}/g) || []).length, 1);
  const dom = new JSDOM(result.markdown.replace(/\{% (?:end)?raw %\}/g, ''));
  assert.equal(dom.window.document.querySelectorAll('script, img').length, 0);
  assert.equal(dom.window.document.querySelector('code').textContent, unsafe);
  assert.equal(dom.window.document.querySelector('figcaption').textContent, unsafe);
  dom.window.close();
});

test('diagram 对坏 JSON、空节点、错误字段、过深或过大数据在构建时报错', () => {
  const block = value => `:::diagram[示意]\n${JSON.stringify(value)}\n:::`;
  const invalid = [
    null, [], {}, { title: '缺少布局' },
    { layout: 'unknown', items: [{ text: '内容' }] },
    { layout: 'stack', items: [] }, { layout: 'stack', items: [null] },
    { layout: 'stack', items: [{}] }, { layout: 'stack', items: [{ badge: '只有角标' }] },
    { layout: 'row', columns: 0, items: [{ text: '内容' }] },
    { layout: 'row', columns: 4.5, items: [{ text: '内容' }] },
    { layout: 'row', arrows: 'true', items: [{ text: '内容' }] },
    { layout: 'stack', items: [{ text: ' ' }] },
    { layout: 'stack', items: [{ text: 7 }] },
    { layout: 'stack', items: [{ chips: [] }] },
    { layout: 'stack', items: [{ code: ['ok', false] }] },
    { layout: 'stack', items: [{ text: '内容', tone: 'alert' }] },
    { layout: 'stack', items: [{ text: '内容', onclick: 'attack()' }] },
    { layout: 'stack', items: [{ text: '内容' }], unknown: true }
  ];
  let deep = { text: '叶节点' };
  for (let i = 0; i < 8; i++) deep = { layout: 'stack', items: [deep] };
  invalid.push(deep, { layout: 'grid', items: Array.from({ length: 6 }, () => ({ layout: 'grid', items: Array.from({ length: 32 }, () => ({ text: '内容' })) })) });
  for (const data of invalid) assert.throws(() => compileArticleBlocks(block(data)), /diagram/);
  assert.throws(() => compileArticleBlocks(':::diagram[示意]\nnot json\n:::'), /有效 JSON/);
  assert.throws(() => compileArticleBlocks(':::diagram[示意]\n{}'), /未闭合/);
});

test('diagram 示例保留代码围栏，正常模块沿用文章资源加载与子路径', () => {
  const { runInNewContext } = require('node:vm');
  const example = ':::diagram[示例]\n{"layout":"stack","items":[{"text":"内容"}]}\n:::';
  for (const fence of ['```markdown', '~~~~markdown']) {
    const source = `${fence}\n${example}\n${fence.slice(0, fence.startsWith('`') ? 3 : 4)}`;
    assert.deepEqual(compileArticleBlocks(source), { markdown: source, count: 0 });
  }
  const filters = {};
  runInNewContext(readFileSync('scripts/article-visuals.js', 'utf8'), {
    require: () => ({ compileArticleBlocks }),
    hexo: { extend: { filter: { register: (name, fn) => { filters[name] = fn; } } } }
  });
  const post = filters.before_post_render({ content: example });
  const result = filters.after_post_render.call({ config: { root: '/preview/' } }, post);
  assert.match(result.content, /^<div class="rich-article">/);
  assert.match(result.content, /href="\/preview\/css\/article-visuals.css"/);
  assert.match(result.content, /src="\/preview\/js\/article-visuals.js"/);
});

test('面板可隐藏额外图题，保留居中平面内容、三列能力格与独立结果框', () => {
  const { JSDOM } = require('jsdom');
  const data = {
    layout: 'stack', variant: 'panel', align: 'center', showTitle: false, arrows: true, connectors: ['+', '↓'],
    items: [
      { title: 'Model', text: '理解与推理', surface: 'none' },
      { title: 'Harness', surface: 'none', chips: ['工具', '循环', '文件', '权限', '上下文', '会话', '调度', '插件', '界面'], chipsColumns: 3, chipsStyle: 'filled' },
      { title: 'Agent', surface: 'outline' }
    ]
  };
  const dom = new JSDOM(compileArticleBlocks(`:::diagram[关系图]\n${JSON.stringify(data)}\n:::`).markdown.replace(/\{% (?:end)?raw %\}/g, ''));
  const d = dom.window.document;
  assert.equal(d.querySelector('figcaption').textContent, '关系图');
  assert.ok(d.querySelector('figcaption').classList.contains('article-viz-title-hidden'));
  assert.equal(d.querySelectorAll('.article-diagram-root.article-diagram-variant-panel.article-diagram-align-center').length, 1);
  assert.equal(d.querySelectorAll('.article-diagram-surface-none').length, 2);
  assert.equal(d.querySelectorAll('.article-diagram-surface-outline').length, 1);
  const chips = d.querySelector('.article-diagram-chips-grid.article-diagram-chips-filled');
  assert.equal(chips.children.length, 9);
  assert.equal(chips.style.getPropertyValue('--diagram-chip-columns'), '3');
  dom.window.close();
});

test('编号流程将编号放在独立前导列，时间线保留步骤顺序与重点状态', () => {
  const { JSDOM } = require('jsdom');
  const diagram = data => new JSDOM(compileArticleBlocks(`:::diagram[流程]\n${JSON.stringify(data)}\n:::`).markdown.replace(/\{% (?:end)?raw %\}/g, ''));
  const numbered = diagram({ layout: 'stack', variant: 'numbered', arrows: true, items: [{ title: '检查路径', badge: '1' }, { title: '判断审批', badge: '2' }] });
  const d = numbered.window.document;
  assert.equal(d.querySelector('.article-diagram-items > li > .article-diagram-marker').textContent, '1');
  assert.equal(d.querySelectorAll('.article-diagram-badge').length, 0);
  assert.equal(d.querySelectorAll('.article-diagram-marker').length, 2);
  assert.equal(d.querySelector('.article-diagram-items > li > .article-diagram-card .article-diagram-header').textContent, '检查路径');
  assert.equal(d.querySelectorAll('.article-diagram-connector').length, 1);
  numbered.window.close();
  const timeline = diagram({ layout: 'stack', variant: 'timeline', items: [{ title: '领取输入' }, { title: '执行工具', tone: 'accent' }, { title: '保存结果' }] });
  assert.equal(timeline.window.document.querySelector('.article-diagram-variant-timeline > ol').children.length, 3);
  assert.equal(timeline.window.document.querySelectorAll('.article-diagram-item-accent').length, 1);
  assert.equal(timeline.window.document.querySelectorAll('.article-diagram-connector').length, 0);
  timeline.window.close();
});

test('标题与状态处于同一标题行，after 状态按正文顺序放在说明之后', () => {
  const { JSDOM } = require('jsdom');
  const data = { layout: 'stack', variant: 'tree', title: 'Turn', badge: '1 个请求', items: [
    { title: 'Step 1', badge: '调用一次', text: '探索环境', surface: 'fill' },
    { title: '依赖就绪', text: '开始执行', badge: 'ACTIVE', badgePosition: 'after' }
  ] };
  const dom = new JSDOM(compileArticleBlocks(`:::diagram[执行]\n${JSON.stringify(data)}\n:::`).markdown.replace(/\{% (?:end)?raw %\}/g, ''));
  const d = dom.window.document;
  assert.equal(d.querySelector('.article-diagram-root > .article-diagram-header').textContent, 'Turn1 个请求');
  assert.equal(d.querySelector('.article-diagram-card .article-diagram-header').textContent, 'Step 1调用一次');
  const after = d.querySelector('.article-diagram-badge-after');
  assert.equal(after.previousElementSibling.textContent, '开始执行');
  assert.equal(after.parentElement.querySelector('.article-diagram-header .article-diagram-badge'), null);
  dom.window.close();
});

test('图标白名单与限定富文本保留语义，仍拒绝 HTML 和模板注入', () => {
  const { JSDOM } = require('jsdom');
  const attack = '<img src=x onerror=attack()>{% endraw %}';
  const data = { layout: 'stack', variant: 'list', items: [{ title: '观察', icon: 'brain', richText: `**重点观察：** 使用 \`ctx.tools\`。\n\n${attack}` }] };
  const result = compileArticleBlocks(`:::diagram[说明]\n${JSON.stringify(data)}\n:::`);
  const dom = new JSDOM(result.markdown.replace(/\{% (?:end)?raw %\}/g, ''));
  const d = dom.window.document;
  assert.equal(d.querySelectorAll('.article-diagram-icon svg').length, 1);
  assert.equal(d.querySelector('.article-diagram-icon').getAttribute('aria-hidden'), 'true');
  assert.equal(d.querySelectorAll('.article-diagram-text').length, 2);
  assert.equal(d.querySelector('.article-diagram-text strong').textContent, '重点观察：');
  assert.equal(d.querySelector('.article-diagram-text code').textContent, 'ctx.tools');
  assert.equal(d.querySelectorAll('img, script, iframe').length, 0);
  assert.equal(d.querySelector('.article-diagram-text:last-child').textContent, attack);
  assert.equal((result.markdown.match(/\{% endraw %\}/g) || []).length, 1);
  dom.window.close();
});

test('图示表现字段限制值域，不接受任意样式或矛盾格式', () => {
  const root = { layout: 'stack', items: [{ text: '正文' }] };
  const source = data => `:::diagram[示意]\n${JSON.stringify(data)}\n:::`;
  for (const fields of [{ variant: 'arbitrary' }, { showTitle: 'false' }, { surface: 'url(x)' }, { align: 'right' }, { layout: 'row', variant: 'timeline' }]) {
    assert.throws(() => compileArticleBlocks(source({ ...root, ...fields })), /diagram/);
  }
  for (const node of [
    { text: '正文', surface: 'red' }, { text: '正文', align: 'justify' }, { text: '正文', icon: '<script>' },
    { text: '正文', showTitle: false }, { text: '正文', chipsColumns: 3 },
    { chips: ['一'], chipsColumns: 5 }, { chips: ['一'], chipsStyle: 'url(x)' },
    { text: '正文', badgePosition: 'after' }, { text: '正文', badge: '状态', badgePosition: 'below' },
    { text: '正文', richText: '**重复正文**' }, { richText: ' ' }, { icon: 'bot' }
  ]) assert.throws(() => compileArticleBlocks(source({ ...root, items: [node] })), /diagram/);
});
