'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const { JSDOM } = require('jsdom');

let render;
vm.runInNewContext(readFileSync('scripts/article-rich-content.js', 'utf8'), {
  hexo: { extend: { filter: { register: (name, callback) => { render = callback; } } } }
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

test('代码复制保留普通代码和 Mermaid，不给图示内的代码片段增加按钮', () => {
  const dom = new JSDOM('<div class="post-body"><pre class="article-diagram-code"><code>git status</code></pre><pre class="mermaid">graph TD</pre><pre><code>npm test</code></pre></div>', { runScripts: 'outside-only' });
  dom.window.eval(readFileSync('source/js/code-blocks.js', 'utf8'));
  assert.equal(dom.window.document.querySelectorAll('.code-block').length, 1);
  assert.equal(dom.window.document.querySelector('.code-block code').textContent, 'npm test');
  assert.equal(dom.window.document.querySelector('.article-diagram-code').parentElement.className, 'post-body');
  dom.window.close();
});
