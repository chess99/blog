# 博客项目说明

这是一个基于 [Hexo](https://hexo.io/) 的静态博客，使用 [NexT](https://theme-next.js.org/) 主题。

## 文章规范

### Front Matter

```yaml
---
title: 文章标题
date: 2026-03-10 00:00:00
tags:
  - tag1
categories: 分类名
permalink: /posts/<slug>/
---
```

`permalink` 必填，slug 取文件名去掉日期前缀和扩展名。

slug 命名规则：
- **独立文章**：主题即 slug，如 `clean-skill-architecture`
- **有时效的活动系列**（大会、课程等）：`活动名-年份-主题`，如 `qcon-2026-taobao-ai-coding`
- **无时效的内容系列**（读书、源码分析等）：`系列名-主题`，如 `book-walden-review`

### 文件位置

```
source/_posts/YYYY/MM/YYYYMMDD-slug.md
```

### 摘要

每篇文章在简介后加 `<!-- more -->`，控制首页只显示摘要。

### 图片

```
source/images/<slug>/   # 博客发布用图片副本
```

文档内引用：`![说明](/images/<slug>/image.jpg)`

跨文章共用图片放 `source/images/` 根目录。

创作过程、研究、渠道稿件和原始素材统一保存在
`D:\code\content\topics\YYYYMMDD-<slug>\`。本仓库中的文章与图片是
`blog.cearl.cc` 的发布副本，不作为继续创作的唯一来源。

## 常用命令

```bash
hexo server    # 本地预览
hexo generate  # 生成静态文件
hexo deploy    # 部署
```

## 项目结构

```
.
├── source/
│   ├── _posts/      # 文章
│   └── images/      # 图片资源
├── tools/           # 博客构建和发布检查工具
├── _config.yml
└── _config.next.yml
```

## 项目边界

- 内容资产与渠道稿件位于 `D:\code\content`。
- 创作 skills、工具和工作流位于 `D:\code\content-workflows`。
- 本仓库只维护博客最终发布副本、Hexo 配置、站点页面和部署流程。
- 文章需要修改时，优先修改内容资产库中的来源，再同步发布副本，避免两边独立演化。
