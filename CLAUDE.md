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

**字段说明**：

| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | 是 | 文章标题（中文） |
| `date` | 是 | 发布日期 |
| `tags` | 否 | 标签列表 |
| `categories` | 否 | 分类 |

### 文件命名与 URL

文章存放在 `source/_posts/YYYY/MM/` 子目录下，文件名格式为 `YYYYMMDD-slug.md`：

```
source/_posts/
  2026/
    03/
      20260326-hexo-permalink-deep-dive.md
      20260325-interview-strategy-ai-era.md
```

日期前缀保证目录内文件按发布日期自然排序。

**URL 由 front matter 的 `permalink` 字段决定**，与文件名无关：

```yaml
permalink: /posts/hexo-permalink-deep-dive/
```

每篇新文章都必须在 front matter 里显式写 `permalink: /posts/<slug>/`，slug 取文件名去掉日期前缀和扩展名。

slug 命名规则：
- **独立文章**：主题即 slug，如 `clean-skill-architecture`
- **有时效的活动系列**（大会、课程等）：`活动名-年份-主题`，如 `qcon-2026-taobao-ai-coding`
- **无时效的内容系列**（读书、源码分析等）：`系列名-主题`，如 `book-walden-review`、`gemini-cli-source`

### 图片存放

图片按文章分目录，目录名 = slug（与文章文件名去掉日期前缀和扩展名一致）：

```
source/images/<slug>/
  image1.jpg
  image2.png
```

文档内引用：

```markdown
![说明](/images/taobao-ai-coding/image1.jpg)
```

跨文章共用的图片（如主题背景图）直接放 `source/images/` 根目录。

`source/_drafts/<slug>/` 里存放的是创作过程中的原始素材，图片编辑处理后才移入 `source/images/<slug>/`，两者不混用。

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
│   ├── _drafts/         # 创作过程工作区（每篇文章一个子目录）
│   └── images/          # 图片资源
├── themes/
│   └── next/            # NexT 主题
├── .claude/
│   └── skills/
│       └── blog-workflow/   # 博客创作流水线 skill
├── _config.yml          # Hexo 配置
└── _config.next.yml     # 主题配置
```

## 自媒体工作室

这个博客使用 AI native 的创作流程，每篇文章经过若干角色依次处理。

### 团队角色

| 角色 | SOP 文件 | 职责 | 输出 |
|------|----------|------|------|
| 选题编辑 | `.claude/skills/blog-workflow/roles/topic-editor.md` | 评估原始想法，输出选题卡 | `topic-card.md` |
| 素材研究员 | `.claude/skills/blog-workflow/roles/researcher.md` | 收集支撑素材 | `research.md` |
| 主笔 | `.claude/skills/blog-workflow/roles/writer.md` | 根据选题卡+素材写初稿 | `draft.md` |
| 同行审校 | `.claude/skills/blog-workflow/roles/reviewer.md` | 挑逻辑/事实/表述问题 | `review.md` |
| 图片编辑 | `.claude/skills/blog-workflow/roles/photo-editor.md` | 从图片素材中选图、OCR 理解内容、压缩后插入文档 | 文档内图片引用 |
| 渠道适配 | `.claude/skills/blog-workflow/roles/publisher.md` | 生成各渠道版本并发布 | 各渠道文件 |

### 流程

标准流程（无图片素材）：
```
原始想法 → [选题编辑] → [素材研究员] → [主笔] → [同行审校] → [渠道适配] → 发布
```

有图片素材时，图片编辑在主笔完成初稿后介入：
```
原始想法 → [选题编辑] → [素材研究员] → [主笔] → [图片编辑] → [同行审校] → [渠道适配] → 发布
```

图片编辑也可以在终稿阶段补充（如后来拿到了现场照片）：
```
... → [同行审校] → [图片编辑] → [渠道适配] → 发布
```

### 工作区约定

每篇文章的创作过程产物放在 `source/_drafts/<slug>/`：

```
source/_drafts/<slug>/
├── topic-card.md   # 选题卡（选题编辑输出）
├── research.md     # 素材清单（素材研究员输出）
├── draft.md        # 初稿（主笔输出）
├── review.md       # 审校意见（同行审校输出）
└── final.md        # 终稿（处理审校意见后）
```

图片资产统一放在 `source/images/<slug>/`，文档内用相对路径引用。

### 质量门禁

- 审校意见中的 🔴 必须修改项全部处理完，才能进入渠道适配环节
- 发布到博客的文件路径：`source/_posts/YYYY/MM/<slug>.md`

### 渠道

同源多渠道，不做轻量化改写，同一篇文章直接发布到所有渠道：
- **博客**：`source/_posts/YYYY/MM/<slug>.md`
- **内部知识库**：发布命令见 memory（含 internal-parent-id 和 内部账号）
- **公众号**：通过 `~/code2/wx-publisher` 发布，发布命令见 memory