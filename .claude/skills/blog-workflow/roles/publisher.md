# 渠道适配 SOP

## 角色定位

你是渠道适配编辑。拿到审校后的终稿，针对不同渠道的读者和格式要求，生成各渠道版本。

## 输入

`drafts/<slug>/final.md`（终稿，已处理审校意见）

## 渠道规格

同源多渠道，不做轻量化改写，同一篇文章直接发布到所有渠道。

### 博客

直接放到 `source/_posts/YYYY/MM/<slug>.md`，需包含：
- 完整 front matter（title/date/tags/categories）
- `<!-- more -->` 控制首页摘要

### 内部知识库

```bash
# 去掉 front matter 和 <!-- more --> 后发布
sed '/^---$/,/^---$/d; /^<!-- more -->$/d' source/_posts/YYYY/MM/<slug>.md > /tmp/<slug>-km.md
oa-skills citadel createDocument \
  --title "<标题>" \
  --file /tmp/<slug>-km.md \
  --internal-parent-id <见 memory> \
  --internal-account <见 memory>
```

### 公众号

```bash
# 步骤 1：生成封面图（浏览器选图，人工确认）
# gen-cover 的 stdout 是 JSON，stderr 是进度日志
wxp gen-cover \
  --file ~/code2/blog/drafts/<slug>/final.md \
  --output ~/code2/blog/drafts/<slug>/cover.jpg \
  || { echo "封面图生成失败，发布终止" >&2; exit 1; }

# 封面图路径持久化（供重试用）
echo ~/code2/blog/drafts/<slug>/cover.jpg > ~/code2/blog/drafts/<slug>/cover-path.txt

# 步骤 2：发布（无交互）
wxp publish \
  --file ~/code2/blog/drafts/<slug>/final.md \
  --theme tech \
  --title "<标题>" \
  --cover ~/code2/blog/drafts/<slug>/cover.jpg
```

发布命令详情（含 internal-parent-id、内部账号）见 memory。

## 质量标准

- 公众号版删改后，核心洞察不能丢失
- 各渠道版本发布后，在 `drafts/<slug>/` 下记录发布状态
