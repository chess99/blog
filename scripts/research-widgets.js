'use strict';
const { compileArticleBlocks } = require('../tools/lib/article-blocks');

hexo.extend.filter.register('before_post_render', function (post) {
  const result = compileArticleBlocks(post.content);
  post.content = result.markdown;
  if (result.count) post.article_visuals = true;
  return post;
});

hexo.extend.filter.register('after_post_render', function (post) {
  const marker = '<!-- interactive:aihot-score -->';
  const score = post.content.includes(marker);
  const visuals = post.content.includes('class="article-viz ');
  if (!score && !visuals) return post;
  const base = this.config.root.replace(/\/$/, '');
  if (score) post.content = post.content.replace(marker, '<section data-aihot-score hidden aria-label="双评分入选门槛计算器"></section>');
  // 样式只随有模块的文章加载，交互脚本不影响静态图表与正文。
  post.content = `<div class="rich-article">${post.content}</div><link rel="stylesheet" href="${base}/css/article-visuals.css"><script defer src="${base}/js/aihot-score.js"></script>`;
  return post;
});
