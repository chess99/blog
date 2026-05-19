---
name: blog-workflow
description: 博客文章创作流水线。当用户提到写文章、新选题、继续某篇文章、审校、发布等创作相关任务时触发。自动检测当前文章处于哪个阶段，告知下一步该做什么，并扮演对应角色执行任务。即使用户只说"继续写那篇文章"或"帮我看看这篇"，也应该触发此 skill。
---

# 博客创作流水线

## 流程总览

```
原始想法 → [选题编辑] → [素材研究员] → [主笔] → [图片编辑*] → [同行审校] → [渠道适配] → 发布
```

*图片编辑可选，有图片素材时介入。

## 阶段检测

收到任务后，先确定 slug，然后检查 `drafts/YYYYMMDD-<slug>/` 下存在哪些文件。目录命名必须带日期前缀（如 `20260519-codex-cheatsheet`），日期取创建当天。

| 已有文件 | 当前阶段 | 下一步角色 |
|---------|---------|-----------|
| 无（或只有原始素材） | 未开始 | 选题编辑 |
| `topic-card.md` | 选题完成 | 素材研究员 |
| `research.md` | 素材完成 | 主笔 |
| `draft.md`（无图片任务） | 初稿完成 | 同行审校（派独立 agent） |
| `draft.md`（有图片素材） | 初稿完成 | 图片编辑 |
| `review.md` | 审校完成 | 主笔处理意见 → 生成 `final.md` |
| `final.md` | 终稿完成 | 渠道适配 |

如果用户明确指定了角色（如"帮我做审校"），跳过检测直接执行。

## 执行方式

确定角色后，读取对应的 SOP 文件并按其指示执行：

- 选题编辑：`.claude/skills/blog-workflow/roles/topic-editor.md`
- 素材研究员：`.claude/skills/blog-workflow/roles/researcher.md`
- 主笔：`.claude/skills/blog-workflow/roles/writer.md`
- 同行审校：`.claude/skills/blog-workflow/roles/reviewer.md`（**独立 agent 执行，见 SOP 里的触发方式**）
- 图片编辑：`.claude/skills/blog-workflow/roles/photo-editor.md`
- 渠道适配：`.claude/skills/blog-workflow/roles/publisher.md`

## 工作区结构

```
drafts/YYYYMMDD-<slug>/     # 日期取创建当天，如 20260519-codex-cheatsheet
├── topic-card.md            # 选题卡
├── research.md              # 素材清单
├── draft.md                 # 初稿
├── review.md                # 审校意见
└── final.md                 # 终稿

source/images/<slug>/        # 图片资产（不带日期前缀）
```

## 质量门禁

`review.md` 中的 🔴 必须修改项全部处理完，才能进入渠道适配。
