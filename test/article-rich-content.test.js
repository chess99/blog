'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const { JSDOM } = require('jsdom');

let render;
let renderPriority;
vm.runInNewContext(readFileSync('scripts/article-rich-content.js', 'utf8'), {
  hexo: { extend: { filter: { register: (name, callback, priority) => { render = callback; renderPriority = priority; } } } }
});

test('宽对照表可横向滚动，普通表格和代码高亮保留原结构', () => {
  const wide = '<table><tr><th></th><th>A</th><th>B</th><th>C</th><th>D</th></tr><tr><td>定位</td><td>甲</td><td>乙</td><td>丙</td><td>丁</td></tr></table>';
  const narrow = '<table><tr><th>名称</th><th>说明</th></tr></table>';
  const highlight = '<figure class="highlight"><table><tr><td class="code"><pre>git status</pre></td></tr></table></figure>';
  const result = render.call({ config: { root: '/blog/' } }, { rich_content: true, content: wide + narrow + highlight });
  const doc = new JSDOM(result.content).window.document;
  assert.equal(doc.querySelectorAll('.article-table-scroll').length, 1);
  assert.equal(doc.querySelector('.article-table-scroll').tabIndex, 0);
  assert.equal(doc.querySelector('.article-table-scroll').getAttribute('role'), 'region');
  assert.equal(doc.querySelector('.article-table-scroll table').textContent, new JSDOM(wide).window.document.querySelector('table').textContent);
  assert.ok(result.content.includes(highlight));
  assert.equal(doc.querySelectorAll('body > table').length, 1);
  assert.equal(doc.querySelector('link').getAttribute('href'), '/blog/css/article-rich-content.css');
});

test('普通文章不加载富内容样式，也不改表格', () => {
  const post = { content: '<p>普通正文</p>' };
  assert.equal(render.call({ config: { root: '/' } }, post), post);
  assert.equal(post.content, '<p>普通正文</p>');
});

test('引用交互按需加载并支持子路径', () => {
  const plain = render.call({ config: { root: '/preview/' } }, { rich_content: true, content: '<p>正文</p>' });
  assert.ok(!plain.content.includes('<script'));
  const citation = render.call({ config: { root: '/preview/' } }, { rich_content: true, content: '<button class="article-citation-label">来源</button>' });
  const doc = new JSDOM(citation.content).window.document;
  assert.equal(doc.querySelector('script').getAttribute('src'), '/preview/js/article-rich-content.js');
  assert.equal(doc.querySelector('script').defer, true);
});

test('在 Hexo 拆分摘要后分别增强全文、摘要和 more，不向无引用的摘要加载交互', () => {
  const excerptFilter = require('hexo/dist/plugins/filter/after_post_render/excerpt');
  const gallery = '<div class="article-image-group"><a href="/images/a.jpg"><img src="/images/a.jpg" alt="配图"></a></div>';
  const citation = '<span class="article-citation"><button class="article-citation-label" type="button">来源</button></span>';
  const post = { rich_content: true, content: `${gallery}<!-- more -->${citation}` };
  excerptFilter(post);
  render.call({ config: { root: '/preview/' } }, post);
  assert.ok(renderPriority > 10, '增强在内置 excerpt filter 默认优先级之后执行');
  for (const field of ['content', 'excerpt', 'more']) {
    const doc = new JSDOM(post[field]).window.document;
    assert.equal(doc.querySelector('link').getAttribute('href'), '/preview/css/article-rich-content.css', field);
    assert.equal(doc.querySelectorAll('script').length, field === 'excerpt' ? 0 : 1, field);
  }
  assert.ok(post.excerpt.includes(gallery));
  assert.ok(post.more.includes(citation));
});

test('含引用的独立摘要加载交互，重复增强不重复资源或嵌套表格', () => {
  const wide = '<table><tr><th>A</th><th>B</th><th>C</th><th>D</th></tr></table>';
  const citation = '<button class="article-citation-label" type="button">来源</button>';
  const post = { rich_content: true, content: wide, excerpt: citation, more: '' };
  const context = { config: { root: '/' } };
  render.call(context, post);
  render.call(context, post);
  const content = new JSDOM(post.content).window.document;
  const excerpt = new JSDOM(post.excerpt).window.document;
  assert.equal(content.querySelectorAll('.article-table-scroll').length, 1);
  assert.equal(content.querySelectorAll('link').length, 1);
  assert.equal(content.querySelectorAll('script').length, 0);
  assert.equal(excerpt.querySelectorAll('link').length, 1);
  assert.equal(excerpt.querySelectorAll('script').length, 1);
  assert.equal(post.more, '');
});

function citationDOM() {
  const item = id => `<span class="article-citation"><button class="article-citation-label" type="button" aria-expanded="false" aria-controls="${id}"><span class="article-citation-name">资料</span></button><span class="article-citation-popup" id="${id}"><a href="https://example.com/one">第一份资料</a><a href="https://example.com/two">第二份资料</a></span></span>`;
  const dom = new JSDOM(`<div class="post-body">${item('source-a')}${item('source-b')}<button id="outside">正文操作</button><span class="article-citation"><a class="article-citation-label" href="https://example.com">旧来源</a><span class="article-citation-popup"><a href="https://example.com/source">旧资料</a></span></span></div>`, { runScripts: 'outside-only', pretendToBeVisual: true });
  dom.window.document.querySelector('.post-body').getBoundingClientRect = () => ({ left: 200, right: 900, width: 700 });
  dom.window.document.querySelectorAll('button.article-citation-label').forEach(button => {
    button.getBoundingClientRect = () => ({ left: 850, right: 900, top: 700, bottom: 722, width: 50, height: 22 });
  });
  dom.window.document.querySelectorAll('.article-citation-popup').forEach(popup => {
    popup.getBoundingClientRect = () => ({ left: 0, right: 320, top: 0, bottom: 160, width: 320, height: 160 });
  });
  dom.window.eval(readFileSync('source/js/article-rich-content.js', 'utf8'));
  return dom;
}

test('引用点击展开、切换和关闭，Esc回到来源按钮，旧来源链接不被改成按钮', () => {
  const dom = citationDOM();
  const d = dom.window.document;
  const [a, b] = [...d.querySelectorAll('button.article-citation-label')];
  const isOpen = button => button.closest('.article-citation').hasAttribute('data-citation-open');
  a.click();
  assert.equal(a.getAttribute('aria-expanded'), 'true');
  assert.equal(a.getAttribute('aria-controls'), 'source-a');
  assert.ok(isOpen(a));
  b.click();
  assert.equal(a.getAttribute('aria-expanded'), 'false');
  assert.ok(!isOpen(a));
  assert.ok(isOpen(b));
  d.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  assert.equal(b.getAttribute('aria-expanded'), 'false');
  assert.ok(!isOpen(b));
  assert.equal(d.activeElement, b);
  a.click();
  a.click();
  assert.ok(!isOpen(a));
  a.click();
  d.querySelector('#outside').click();
  assert.ok(!isOpen(a));
  const old = d.querySelector('a.article-citation-label');
  assert.equal(old.href, 'https://example.com/');
  assert.ok(!old.parentElement.hasAttribute('data-citation-enhanced'));
  dom.window.close();
});

test('引用保留Tab访问来源，焦点离开后关闭，重复初始化不会重复绑定', () => {
  const dom = citationDOM();
  const d = dom.window.document;
  const button = d.querySelector('button.article-citation-label');
  d.dispatchEvent(new dom.window.Event('page:loaded'));
  button.focus();
  button.click();
  d.querySelector('#source-a a').focus();
  assert.equal(button.getAttribute('aria-expanded'), 'true');
  d.querySelector('#outside').focus();
  assert.equal(button.getAttribute('aria-expanded'), 'false');
  button.click();
  assert.equal(button.getAttribute('aria-expanded'), 'true');
  dom.window.close();
});

test('引用弹层在桌面阅读列内定位，手机贴近屏幕底部', () => {
  const dom = citationDOM();
  const d = dom.window.document;
  const button = d.querySelector('button.article-citation-label');
  const popup = d.getElementById('source-a');
  button.click();
  assert.equal(popup.style.width, '320px');
  assert.equal(popup.style.left, '580px');
  assert.equal(popup.style.top, '532px');
  button.click();
  Object.defineProperty(dom.window, 'innerWidth', { value: 390 });
  Object.defineProperty(dom.window, 'innerHeight', { value: 844 });
  button.click();
  assert.equal(popup.style.width, '366px');
  assert.equal(popup.style.left, '12px');
  assert.equal(popup.style.top, '668px');
  dom.window.close();
});

test('代码复制保留普通代码和 Mermaid，不给图示内的代码片段增加按钮', () => {
  const dom = new JSDOM('<div class="post-body"><pre class="article-diagram-code"><code>git status</code></pre><pre class="mermaid">graph TD</pre><pre><code>npm test</code></pre></div>', { runScripts: 'outside-only' });
  dom.window.eval(readFileSync('source/js/code-blocks.js', 'utf8'));
  assert.equal(dom.window.document.querySelectorAll('.code-block').length, 1);
  assert.equal(dom.window.document.querySelector('.code-block code').textContent, 'npm test');
  assert.equal(dom.window.document.querySelector('.article-diagram-code').parentElement.className, 'post-body');
  dom.window.close();
});
