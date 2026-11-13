# 引用来源与资源行

文章 front matter 设置 `rich_content: true` 后加载专用样式。全文、摘要和 `more` 片段分别补齐资源，首页摘要也保留图片组等布局。每个片段含引用标签时再加载引用交互脚本，重复处理不会重复注入，普通文章不受影响。

## 引用来源

```html
<span class="article-citation">
  <button class="article-citation-label" type="button" aria-expanded="false" aria-controls="citation-1">
    <span class="article-citation-name">来源名称</span>
    <small class="article-citation-count">+1</small>
  </button>
  <span class="article-citation-popup" id="citation-1">
    <a href="https://example.com/source">资料标题</a>
  </span>
</span>
```

每个弹层 ID 必须唯一。来源标签使用文字，不需要逐站准备图标资源，也不依赖第三方 favicon 服务；没有额外来源时省略数量。来源链接仍使用正常的 `href`。

按钮支持点击展开和收起、Esc 关闭并回到按钮、点击外部关闭，一次只打开一组。弹层按屏幕和阅读列边界定位；手机放在屏幕底部。脚本未加载时，鼠标停留或键盘焦点进入仍可访问来源链接。旧版链接标签保持可用。

## 资源行

```html
<div class="article-resource-list">
  <section class="article-resource-card">
    <div class="article-resource-media">
      <svg class="article-resource-icon" aria-hidden="true" viewBox="0 0 24 24">…</svg>
      <span class="article-resource-badge">CLI + Web</span>
    </div>
    <div class="article-resource-content">
      <strong>工具名称</strong>
      <p>用途说明。</p>
      <a href="https://example.com/">相关资料</a>
    </div>
  </section>
</div>
```

缩略图可替换媒体列中的 SVG 和标签，使用 `.article-resource-image`。资源行本身不画独立外框，行间用分隔线；窄屏保留紧凑的图文双列。

## 表格外观

正文表格统一使用内容区底色，以轻微的表头底色、细分隔线和悬停色区分层次，深浅色均在 `source/_data/styles.styl` 中定义。普通表格与横向滚动表格使用同一套颜色；代码高亮内部的表格不应用这些覆盖。
