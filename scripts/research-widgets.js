'use strict';
const { readFileSync } = require('node:fs');
const { join } = require('node:path');

// 仅增强有静态评分说明的文章；其他页面不加载资源。
hexo.extend.filter.register('after_post_render', function (post) {
  const marker = '<!-- interactive:aihot-score -->';
  if (!post.content.includes(marker)) return post;
  const base = this.config.root.replace(/\/$/, '');
  // NexT 的 JS 懒加载会移除 src。研究配图改用原生懒加载，保证无 JS 可读。
  post.content = post.content.replace(/<img\b[^>]*>/g, tag => {
    const src = tag.match(/(?:data-)?src="([^"]+)"/)?.[1];
    if (!src || !src.startsWith(`${base}/images/aihot-architecture/`)) return tag;
    const bytes = readFileSync(join(this.source_dir, src.slice(base.length)));
    const dimensions = `width="${bytes.readUInt32BE(16)}" height="${bytes.readUInt32BE(20)}"`;
    return tag.replace('data-src=', 'src=').replace('<img ', `<img loading="lazy" decoding="async" ${dimensions} `);
  });
  post.content = post.content.replace(marker,
    '<section data-aihot-score hidden aria-label="双评分入选门槛计算器"></section>' +
    `<link rel="stylesheet" href="${base}/css/aihot-score.css">` +
    `<script defer src="${base}/js/aihot-score.js"></script>`);
  return post;
});
