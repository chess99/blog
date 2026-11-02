'use strict';
const { compileArticleBlocks } = require('../tools/lib/article-blocks');

hexo.extend.filter.register('before_post_render', function (post) {
  const result = compileArticleBlocks(post.content);
  post.content = result.markdown;
  return post;
});

hexo.extend.filter.register('after_post_render', function (post) {
  if (!post.content.includes('class="article-viz ') && !post.content.includes('<section data-score ')) return post;
  const base = this.config.root.replace(/\/$/, '');
  // 样式只随有模块的文章加载，交互脚本不影响静态图表与正文。
  post.content = `<div class="rich-article">${post.content}</div><link rel="stylesheet" href="${base}/css/article-visuals.css"><script defer src="${base}/js/article-visuals.js"></script>`;
  return post;
});
