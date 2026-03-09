# 博客项目说明

这是一个基于 [Hexo](https://hexo.io/) 的静态博客，使用 [NexT](https://theme-next.js.org/) 主题。

## 文章写作规范

### 文章摘要

Hexo 支持 `<!-- more -->` 标签来控制首页摘要展示。标签之前的内容会在首页显示，之后的内容需要点击"阅读全文"才能看到。

```markdown
---
title: 文章标题
date: 2026-03-10 00:00:00
tags:
  - 标签1
  - 标签2
categories: 分类名
---

## 背景

这里写文章简介，会显示在首页。

<!-- more -->

这里写正文详细内容，只在文章页面显示。
```

**注意**：每篇文章都应该在背景/简介之后添加 `<!-- more -->`，避免首页展开全文。

### Front Matter

文章头部使用 YAML 格式：

```yaml
---
title: 文章标题
date: 2026-03-10 00:00:00
tags:
  - tag1
  - tag2
categories: 分类名
---
```

**重要字段说明**：

| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | 是 | 文章标题 |
| `date` | 是 | 发布日期 |
| `tags` | 否 | 标签列表 |
| `categories` | 否 | 分类 |

**pid 字段**：URL 格式为 `posts/:pid/`，pid 由 pre-commit 钩子自动分配，无需手动填写。

### 文件命名

文章存放在 `source/_posts/` 目录，命名格式：

- 新格式：`YYYYMMDD-标题.md`（推荐）
- 旧格式：`001-标题.md`、`002-标题.md`（历史遗留）

## 常用命令

```bash
# 本地预览
hexo server

# 生成静态文件
hexo generate

# 部署
hexo deploy

# 新建文章
hexo new "文章标题"
```

## 项目结构

```
.
├── source/
│   ├── _posts/          # 文章目录
│   └── images/          # 图片资源
├── themes/
│   └── next/            # NexT 主题
├── _config.yml          # Hexo 配置
└── _config.next.yml     # 主题配置
```