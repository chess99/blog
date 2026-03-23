---
title: Claude Code 速查手册：从入门到自动化的全部命令
pid: 119
date: 2026-03-23 00:00:00
tags:
  - Claude Code
  - AI 工具
  - 开发效率
categories: 工具
---

**TL;DR**：这是一份完整的 Claude Code 命令速查手册，按使用频率和学习顺序排列。新用户从第一组开始读，老用户直接跳到需要的部分。每个功能说清楚是什么、怎么用、什么时候用。

<!-- more -->

---

## 第一组：打好基础，这四个功能决定上限

### CLAUDE.md — 给项目的持久化说明书

**`CLAUDE.md`**：放在项目根目录的 Markdown 文件，写项目架构、编码规范、目录约定。Claude Code 每次启动自动读取，不占用对话上下文。

```
# 项目规范
- 使用 TypeScript，严格模式
- 组件放在 src/components/，工具函数放在 src/utils/
- 提交前运行 npm run lint
```

什么时候用：项目刚开始就创建。每次你发现自己重复告诉 Claude 同一件事（"我们用 pnpm 不用 npm"、"这个项目的 API 前缀是 /api/v2"），就把它写进 `CLAUDE.md`。这是单个操作里 ROI 最高的配置。

---

### /plan — 先出计划，再动代码

**`/plan`**：让 Claude 输出完整的实现计划，不写任何文件，等你确认后再执行。

```
/plan 给用户模块添加二次验证，支持 TOTP 和短信两种方式
```

什么时候用：任务跨越多个文件、需要新增数据库字段、或者你不确定正确的实现路径时。计划阶段发现方向错了比执行到一半便宜得多。复杂任务不用 `/plan` 直接开始，是新用户最常见的失误。

---

### /rewind — 后悔药，四种粒度可选

**`/rewind`**（或双击 Esc）：回退代码和对话的菜单，提供四个选项：
1. 回退代码 + 对话（完整撤销到上一步）
2. 只回退代码，保留对话
3. 只回退对话，保留代码
4. 回退到指定的检查点

选项 2 特别有用：Claude 改了代码，改动方向是对的，但你想重新描述需求、让它理解得更准。选项 3 反过来：代码不要，但对话里的分析和推理留着。

什么时候用：Claude 改了一堆文件后你发现思路不对，或者单次响应结果不理想，比开新会话重来省事得多。

---

### /btw — 临时提问，不污染主上下文

**`/btw`**：在当前任务中间插入一个独立的问题，答案不进入主对话上下文，不影响后续任务的理解。

```
/btw Redis 的 SETNX 和 SET NX 有什么区别？
```

什么时候用：你正在让 Claude 实现某个功能，中途需要查一个无关的 API 用法、确认一个概念定义、或者问一个不想记录在这次对话里的问题。直接问会让上下文变杂，用 `/btw` 问完即走。

---

## 第二组：会话管理，让工作跨天接续

### /rename + /resume + /continue — 给会话命名和恢复

- **`/rename 名称`**：给当前会话起名，方便之后找到。
- **`/resume`**：列出历史会话列表，选择恢复哪一个。
- **`/continue`**：不需要选择，直接恢复最近一次会话。

```
/rename feat-auth-2fa
```

什么时候用：开发一个持续多天的功能时，每天用 `/continue` 接着昨天进度，不用重新交代背景。`/resume` 适合在多个并行任务之间切换。

---

### /branch — 在同一上下文里探索两条路

**`/branch`**（也可以用 `/fork`）：从当前会话的某个时间点分叉出新会话，两边的修改互不干扰。

什么时候用：接口设计走到一半，你想试试另一种数据结构但不想丢掉现在的进展。分叉后可以在两个版本之间比较，决定用哪个。比"开新会话重新粘贴上下文"省事很多。

---

### /compact — 手动压缩上下文

**`/compact`**：把当前对话压缩成摘要，释放 token 空间。压缩后 Claude 仍知道做了什么，但不再逐字保留每一轮对话。

什么时候用：一个会话里做了大量工作，感觉响应变慢或者 `/context` 显示快到上限时。在开始新的大型子任务之前 compact 一次是好习惯。

---

### /context — 查看上下文健康度

**`/context`**：显示当前会话的上下文用量——已用多少、剩多少、是否接近限制。

什么时候用：开始一个新的大任务之前，或者感觉 Claude 的响应质量下降时先看一眼。如果剩余空间不多，用 `/compact` 释放后再继续。

---

## 第三组：模型与效率，在速度和质量之间调节

### /model opusplan — 规划用 Opus，执行用 Sonnet

**`/model opusplan`**：Pro 用户专用。规划阶段使用 Opus（更强的推理能力），执行阶段自动切换到 Sonnet（更快、消耗额度更少）。

什么时候用：有 Claude Pro 订阅，任务需要先规划再执行时。在复杂架构设计、难以描述清楚的需求上，Opus 的规划质量明显更好，而大量重复的代码生成用 Sonnet 就够了。

---

### /effort — 控制思考深度

**`/effort low`** / **`/effort medium`** / **`/effort high`** / **`/effort auto`**：控制 Claude 投入多少"思考"来处理当前任务。

```
/effort low 把这段注释翻译成英文
/effort high 分析这个系统的潜在竞争条件
```

什么时候用：简单的格式化、翻译、重命名任务用 `low`，响应更快；需要深度分析、架构设计、复杂调试用 `high`；不确定时用 `auto`，让 Claude 自己判断。

---

### /simplify — 三个 Agent 并行审查代码

**`/simplify`**：启动 3 个并行 Agent，分别从代码复用性、代码质量、执行效率三个角度审查当前代码，汇总结果。

什么时候用：功能已经实现，想在合并前做一次全面的代码审查。比让同一个 Claude 实例反复看自己写的代码有更多角度。

---

### Ctrl+B — 任务后台化，不阻塞主会话

**`Ctrl+B`**：把当前正在执行的任务移到后台，释放主会话。任务完成后会通知你。两下 `Ctrl+C` 可以杀死所有后台 Agent。

什么时候用：耗时较长的任务（批量生成文件、跑完整测试套件、大规模重构），不需要实时交互的情况下后台化，去做别的事。

---

## 第四组：自动化与多 Agent，重复性工作交给机器

### /loop — 定时重复任务

**`/loop 间隔 任务描述`**：按指定时间间隔重复执行一个任务。支持 `s`（秒）、`m`（分钟）、`h`（小时）、`d`（天）。

```
/loop 5m 检查 build 日志，如果有错误输出错误摘要
/loop 1h 同步远程分支并报告新增的 commit
```

什么时候用：需要持续监控某个状态、定期拉取数据、或者等待某个条件触发时。适合轻量的轮询任务，不需要另起脚本。

---

### Agent Teams — 多 Agent 并行分工

通过环境变量 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` 启用（实验功能）。启用后可以让 Claude Code 拆分任务，分配给多个并行 Agent，每个 Agent 有独立的上下文和角色。

```bash
CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 claude
```

什么时候用：有明确可拆分的并行子任务时，比如"同时重构三个独立模块"、"并行跑三种不同方案的 spike"。不适合有强依赖顺序的任务。

---

### 自定义 Slash 命令 — 把常用 prompt 变成命令

在 `.claude/commands/` 目录（项目级）或 `~/.claude/commands/` 目录（全局）创建 Markdown 文件，文件名即命令名。

```
.claude/commands/code-review.md  →  /code-review
```

文件内容是 prompt 模板，支持 `$ARGUMENTS` 占位符接收参数。

```markdown
# code-review.md
请从以下角度审查 $ARGUMENTS 文件：
1. 潜在的 null 引用
2. 未处理的异步错误
3. 不必要的重复逻辑
```

什么时候用：团队有固定的 code review 流程、统一的测试生成模板、或者个人有反复使用的 prompt 时。项目级命令放 `.claude/commands/` 可以提交到 git，团队共享。

---

### 自定义 Skill — 带配置的可复用工作流

**Skill** 比 Slash 命令更进一步：放在 `.claude/skills/` 目录，文件头部可以指定 effort 级别、模型、是否压缩上下文。支持热重载，修改文件后不需要重启。

```markdown
---
effort: high
model: opus
context: fresh
---
请对以下 PR 做深度安全审查，重点关注：
...
```

什么时候用：有需要高质量、固定配置的复杂任务流程时，比如安全审查、架构评审、性能分析报告生成。

**用之前先找找有没有现成的。** Skill 有一个开放生态，[skills.sh](https://skills.sh) 可以浏览，也可以直接让 Claude 帮你搜——安装 `find-skills` 这个 Skill 之后，告诉 Claude "帮我找个做 XXX 的 Skill"，它会自动搜索并给出安装建议：

```bash
npx skills add vercel-labs/skills@find-skills -g -y
```

没有合适的现成 Skill，再考虑自己写。推荐用 `skill-creator` 辅助，比手动写 SKILL.md 更系统——它会带你走完草稿 → 测试用例 → 对比效果 → 迭代 → 优化触发描述的完整流程：

```bash
npx skills add anthropics/skills@skill-creator -g -y
# 然后告诉 Claude："帮我创建一个 Skill，用来做 XXX"
```

---

## 第五组：权限与安全，控制 Claude 能做什么

### /permissions — 精细管理文件和命令权限

**`/permissions`**：交互式界面，管理 Claude Code 可以执行哪些操作。支持通配符规则。

常用规则示例：
```
Bash(npm *)        # 允许所有 npm 命令
Bash(git log *)    # 允许查看 git 日志，但不允许 push
Read(src/*)        # 只允许读取 src 目录
Write(src/*)       # 只允许写入 src 目录，不能动配置文件
```

什么时候用：在 CI 环境或者共享机器上运行 Claude Code 时，需要限制操作范围；或者把 Claude 接入自动化流水线前，先把权限边界划清楚。

---

### Hooks — 操作前后触发脚本

在配置文件里定义 Hooks，可以在四个时机触发自定义脚本：

- **`PreToolUse`**：Claude 要执行任何工具（写文件、运行命令）之前
- **`SessionStart`**：会话开始时
- **`SessionEnd`**：会话结束时
- **`PostCompact`**：上下文压缩后

```yaml
hooks:
  PreToolUse:
    - match: "Bash(git commit *)"
      run: "npm run lint && npm run test"
  SessionEnd:
    - run: "echo '会话结束' >> ~/.claude/session.log"
```

什么时候用：自动在每次提交前跑测试、在会话结束后保存日志、在执行危险操作前做备份。把团队的质量门禁嵌入 Claude Code 工作流里。

---

### /sandbox — 隔离执行环境

**`/sandbox`**：启用沙箱模式，Claude 的文件读写和命令执行被限制在指定目录内，操作不影响沙箱外的文件系统。

什么时候用：给 Claude 探索性的任务时（比如"试着重构这个模块看看效果"），不想让实验性改动污染工作目录。也适合运行来历不明的代码片段。

---

## 第六组：跨端与远程，不绑在一台机器上

### /remote-control — 手机控制本地 Claude Code

**`/remote-control`**（或 `/rc`）：生成一个临时 URL，用手机浏览器打开后可以向本地的 Claude Code 发送指令。代码始终留在本地机器，不上传到手机或云端。

什么时候用：不在电脑旁边，想通过手机推进一个长时间跑着的任务。适合在会议间隙检查进度、追加指令、查看输出结果。

---

### /teleport — 会话传送到网页端

**`/teleport`**：把当前 CLI 会话的上下文迁移到 claude.ai 网页端，可以在网页界面继续同一个对话。

什么时候用：在 CLI 里开始了一个对话，需要换到另一台设备继续；或者需要把对话分享给没有安装 CLI 的人查看。

---

### --worktree（-w）— 隔离 git 工作树

**`claude --worktree`** 或 **`claude -w`**：Claude Code 在独立的 git worktree 里工作，改动不影响主分支的工作目录。

```bash
claude -w "尝试把测试框架从 Jest 迁移到 Vitest"
```

什么时候用：需要做大范围的实验性修改，但又不想 stash 当前改动、也不想新建一个 git 分支手动切换。worktree 模式下可以随时抛弃整个实验，主分支保持干净。

---

## 第七组：诊断与 CLI，排查问题和脚本集成

### /doctor — 一键诊断环境

**`/doctor`**：检查 Claude Code 的运行环境，输出诊断报告，涵盖：配置文件格式错误、权限规则冲突、已安装的插件状态、MCP 连接状态、网络连通性。

什么时候用：升级后某个功能失效、MCP 工具连不上、权限规则没有生效时，先跑一下 `/doctor`，通常能直接指出问题所在。

---

### /insights — 分析使用习惯，给出优化建议

**`/insights`**：生成 HTML 格式的使用分析报告，分析最近一个月的使用模式——最常用的命令、上下文消耗规律、任务类型分布，并给出针对你习惯的优化建议。

什么时候用：用了一段时间后想知道自己有没有在低效地用 Claude Code，或者团队负责人想了解整体使用情况时。

---

### claude -p — 非交互模式，适合脚本和 CI/CD

**`claude -p "prompt"`**：在终端直接执行一次 prompt，输出结果后退出，不进入交互式会话。

```bash
# 在 CI 里自动生成 commit message
git diff HEAD~1 | claude -p "根据这个 diff 生成一行 commit message，遵循 Conventional Commits 规范"

# 批量处理文件
for f in src/**/*.ts; do
  claude -p "检查 $f 里是否有未处理的 Promise rejection"
done
```

什么时候用：把 Claude 集成进 CI/CD 流水线、写自动化脚本、或者需要把 Claude 的输出 pipe 给其他命令时。

---

### --bare — 跳过插件和 Hooks，启动更快

**`claude --bare`**：配合 `-p` 使用，跳过所有插件和 Hooks 的初始化，纯净启动。

```bash
claude --bare -p "把这段 JSON 格式化输出" <<< "$data"
```

什么时候用：在自动化脚本里需要低延迟、高频次调用时。Hooks 和插件会增加启动时间，在批量脚本场景里这个开销会累积。

---

## 快捷键速查表

| 快捷键 | 功能 |
|--------|------|
| 双击 Esc | 打开 `/rewind` 回退菜单 |
| Esc | 中断当前响应（有排队的 prompt 时，移到输入框） |
| Ctrl+B | 把当前任务移到后台执行 |
| 两下 Ctrl+C | 杀死所有后台 Agent |
| Ctrl+R | 搜索历史 prompt |
| Ctrl+G | 用外部编辑器编辑当前输入框内容 |
| Ctrl+S | 暂存当前 prompt 草稿（不提交） |
| Shift+Enter / Option+回车 | 输入框换行，不提交 |
| `!`（感叹号开头） | 进入 bash 模式，直接执行 shell 命令 |

---

## 组合使用示例

**开发新功能的标准流程：**
```
1. 确认 CLAUDE.md 里有最新的项目规范
2. /plan 描述功能需求
3. 确认计划后开始执行
4. 中途查 API 用 /btw
5. 改坏了用双击 Esc 回退
6. 功能完成用 /simplify 做代码审查
7. /rename 给会话命名，下次用 /resume 接续
```

**CI 集成示例：**
```bash
# .github/workflows/review.yml 里
- name: AI Code Review
  run: |
    git diff origin/main...HEAD | \
    claude --bare -p "审查这个 PR 的改动，重点检查潜在的 bug 和安全问题，输出 Markdown 格式"
```

**长期项目的上下文管理策略：**
- 每天开始前用 `/continue` 恢复会话
- 完成一个大的子任务后用 `/compact` 压缩
- 用 `/context` 监控剩余空间
- 接近上限时新建会话，把关键信息写进 `CLAUDE.md` 永久保存
