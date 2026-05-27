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
source/images/<slug>/   # 发布用图片
drafts/<slug>/          # 创作过程原始素材（不混用）
```

文档内引用：`![说明](/images/<slug>/image.jpg)`

跨文章共用图片放 `source/images/` 根目录。

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
├── drafts/          # 创作工作区（每篇文章一个子目录，不被 Hexo 构建）
├── skills/
│   └── blog-workflow/  # 博客创作流水线 skill
├── _config.yml
└── _config.next.yml
```

## 创作流程

使用 `blog-workflow` skill 驱动，自动检测文章阶段并执行对应角色。

详见 `skills/blog-workflow/SKILL.md`。
