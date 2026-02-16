# blog

Hexo + NexT 博客仓库运维与日常操作说明。

## Repository Overview

- 技术栈：`Hexo 7` + `hexo-theme-next`
- 主要目录：
  - `source/_posts/`：文章 Markdown
  - `source/_posts/<post-name>/`：文章资源目录（`post_asset_folder: true`）
  - `source/images/`：全站公共图片（如背景图、头像）
  - `source/_data/`：NexT 自定义样式/模板覆盖
  - `tools/`：仓库级工具脚本（不会被 Hexo 当作插件加载）
- 关键配置：
  - `_config.yml`：Hexo 主配置
  - `_config.next.yml`：NexT 主题配置

## Prerequisites

- Node.js：建议与 CI 一致，使用 `Node 20`
- 包管理：`npm`

安装依赖：

```bash
npm install
```

## Daily Commands

本地启动开发服务器：

```bash
npm run server
```

构建静态站点：

```bash
npm run build
```

清理生成产物：

```bash
npm run clean
```

校验文章图片链接：

```bash
npm run check:post-images
```

校验文章 `pid`（当 permalink 使用 `:pid` 时）：

```bash
npm run check:post-pid
```

## Post and Image Conventions

### Writing Posts

- 文章文件放在 `source/_posts/*.md`
- 使用 front matter（至少包含 `title`、`date`、`tags`、`categories`）
- 永久链接格式由 `_config.yml` 的 `permalink` 控制
- 当前为 `permalink: posts/:pid/`，因此每篇文章都需要设置唯一 `pid`
  - 缺失 `pid` 时会生成 `posts/undefined` 这类异常链接

### Image References

- 优先使用文章资源目录（post asset folder）
  - 例如：`source/_posts/011-分析el-upload/http-request.png`
  - 文章内写相对路径：`![](http-request.png)`
- 公共图片放在 `source/images/`，文章中使用绝对路径：`![](/images/xxx.png)`
- 迁移文章图片目录：`source/images/notes/`

### Link Checker

`tools/check_post_images.py` 会：

- 扫描 `source/_posts/*.md` 的 Markdown 图片链接
- 跳过远程链接（`http/https/data`）
- 同时检查两类本地路径：
  - 文章同级路径
  - 文章资源目录路径（`foo.md` -> `foo/`）
- 识别子路径部署前缀（来自 `_config.yml` 的 `root`）
- 忽略文档示例文章：`005-Hexo博客插入图片.md`

## Subpath Deployment Rules

当前以子路径方式部署（`/blog`），统一规则：

- `_config.yml`：
  - `url: https://cearl.cc/blog`
  - `root: /blog/`
- 不在文章和主题配置里硬编码 `/blog`
- 主题自定义样式通过 `hexo-config('root')` 拼接资源路径
  - 当前 `source/_data/variables.styl`：`hexo-config('root') + 'images/'`

未来改路径时，只需要调整 `_config.yml` 的 `url/root`。

## Deployment

### GitHub Actions (Primary)

工作流：`.github/workflows/pages.yml`

流程：

1. push 到 `main`
2. CI 执行 `npm install` + `npm run build`
3. 上传 `public/` 并通过 `actions/deploy-pages` 发布

### Manual Deploy (Optional)

```bash
npm run deploy
```

## Quick Troubleshooting

- 背景图/公共图片 404：
  - 检查请求路径是否含 `/blog/`
  - 检查 `_config.yml` 的 `url/root`
  - 检查 `source/_data/variables.styl` 是否仍为 root-aware 写法
- 文章图片 404：
  - 运行 `npm run check:post-images`
  - 判断是公共路径缺失还是 post asset 缺失
- 自定义脚本触发 Hexo 加载异常：
  - 不要把 Python 工具放在仓库根 `scripts/` 目录
  - 放在 `tools/` 目录

