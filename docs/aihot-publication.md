# AIHOT 文章维护

源稿位于内容资产库 `topics/20261023-aihot-architecture/longform/article.md`，图表规格为同目录的 `figures.json`。博客保留发布副本，编辑应先回到源稿，再使用 Content Studio 的 `wxp prepare` 同步；具体命令见该仓库 `apps/wx-publisher/docs/dual-channel-publication.md`。

## 渲染

- `scripts/research-widgets.js` 识别 `<!-- interactive:aihot-score -->`，只为含此标记的文章加载轻量 CSS 与脚本。
- 静态正文保留完整阈值表、算例与理论衰减数据；禁用 JavaScript 或打印时不影响核心结论。
- 配图改用浏览器原生懒加载并补充尺寸，避免 NexT 的 `data-src` 机制在无 JavaScript 时丢图。
- 计算器只说明两次评分与分级门槛的数学关系，不模拟模型评分，也不把够分等同于入选。
- 静态图使用精确比例与与微信技术简报主题一致的蓝灰配色。JS 无第三方依赖，其他文章不加载计算器资源。

## 预览与验证

```sh
npm ci
npm run build
npm run server
```

打开 `/posts/aihot-architecture/`。检查 1440、390、320 px 宽度，两个评分的键盘调整、T1/T1.5/T2 阈值、半分展示取整，以及关闭 JavaScript 后的三张图片与正文。页面包含标题、description、canonical，并继续使用 NexT 的文章与目录结构。

源码审查固定到 AIHOT `b3998dc6fc138eb9659f33f55eb38c1c716f0d57`。更新文章时应重新核对来源配置、评分 Prompt、双评分门槛、热度窗口和出刊规则，不直接修改图中的数字。
