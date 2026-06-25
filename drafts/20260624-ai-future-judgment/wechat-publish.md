# 公众号发布准备

## 文件

- 公众号稿：`drafts/20260624-ai-future-judgment/wechat.md`
- 封面：`drafts/20260624-ai-future-judgment/cover.jpg`

## 标题

AI 普及后的未来判断：就业、分配、教育、资产与个体策略

## 摘要

AI 不会平均替代所有工作，而会先重写任务层、入门岗位和中产路径。真正要准备的，是可迁移现金流能力与更少单点依赖。

## 发布命令

```bash
wxp publish \
  --file drafts/20260624-ai-future-judgment/wechat.md \
  --cover drafts/20260624-ai-future-judgment/cover.jpg \
  --theme warm-tech \
  --title "AI 普及后的未来判断：就业、分配、教育、资产与个体策略" \
  --digest "AI 不会平均替代所有工作，而会先重写任务层、入门岗位和中产路径。真正要准备的，是可迁移现金流能力与更少单点依赖。"
```

## 状态

- 公众号稿已生成：Markdown 超链接已降级为纯文本，文末已集中保留完整 URL。
- 封面已由内置 image_gen 生成，并验证为 900×383 JPEG。
- 已尝试创建公众号草稿，但发布器配置不完整：`wechat_secret` 未配置（或缺少环境变量 `WXP_SECRET`）。
- 补齐微信配置后，可直接重跑上面的发布命令。
