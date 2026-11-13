'use strict';

// 图片组、资源卡片与可聚焦的来源卡片只随使用它们的文章加载。
hexo.extend.filter.register('after_post_render', function (post) {
  if (!post.rich_content) return post;
  const base = this.config.root.replace(/\/$/, '');
  post.content = post.content.replace(/<table(?:\s[^>]*)?>[\s\S]*?<\/table>/g, table => {
    const firstRow = table.match(/<tr(?:\s[^>]*)?>([\s\S]*?)<\/tr>/);
    const columns = firstRow && firstRow[1].match(/<th(?:\s|>)/g);
    if (!columns || columns.length < 4) return table;
    return `<div class="article-table-scroll" role="region" aria-label="对照表，可横向滚动" tabindex="0">${table}</div>`;
  });
  post.content += `<link rel="stylesheet" href="${base}/css/article-rich-content.css">`;
  return post;
});
