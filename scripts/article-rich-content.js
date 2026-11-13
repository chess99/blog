'use strict';

// 图片组、资源卡片与可聚焦的来源卡片只随使用它们的文章加载。
hexo.extend.filter.register('after_post_render', function (post) {
  if (!post.rich_content) return post;
  const base = this.config.root.replace(/\/$/, '');
  const stylesheet = `${base}/css/article-rich-content.css`;
  const script = `${base}/js/article-rich-content.js`;
  // Hexo 先拆分摘要和 more；三个字段分别供首页、全文和主题片段使用。
  for (const field of ['content', 'excerpt', 'more']) {
    if (typeof post[field] !== 'string' || !post[field]) continue;
    let html = post[field];
    html = html.replace(/<table(?:\s[^>]*)?>[\s\S]*?<\/table>/g, (table, offset) => {
      const parent = html.slice(0, offset);
      if (/<div\b[^>]*class="[^"]*\barticle-table-scroll\b[^"]*"[^>]*>\s*$/.test(parent)) return table;
      const firstRow = table.match(/<tr(?:\s[^>]*)?>([\s\S]*?)<\/tr>/);
      const columns = firstRow && firstRow[1].match(/<th(?:\s|>)/g);
      if (!columns || columns.length < 4) return table;
      return `<div class="article-table-scroll" role="region" aria-label="对照表，可横向滚动" tabindex="0">${table}</div>`;
    });
    if (!html.includes(`href="${stylesheet}"`)) html += `<link rel="stylesheet" href="${stylesheet}">`;
    if (html.includes('class="article-citation-label"') && !html.includes(`src="${script}"`)) {
      html += `<script defer src="${script}"></script>`;
    }
    post[field] = html;
  }
  return post;
}, 20);
