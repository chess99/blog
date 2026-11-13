---
title: DeepSeek Harness 深度拆解：从 Agent 原理到架构设计，再到实际玩法
date: 2026-10-29 12:24:00
tags:
  - DeepSeek
  - Agent
  - Harness
  - Cordis
  - 架构设计
categories: AI 工程
permalink: /posts/deepseek-harness/
mathjax: true
rich_content: true
---

基于 DeepSeek 官方网站、开源仓库、架构文档及技术论文 · 截至 2026 年 10 月 29 日

{% raw %}<div class="article-image-group" aria-label="DeepSeek Harness 界面配图"><a href="/images/deepseek-harness/original-1.jpg" target="_blank" rel="noopener"><img src="/images/deepseek-harness/original-1.jpg" alt="DeepSeek Harness | Explore the limits of intelligence" loading="lazy"></a><a href="/images/deepseek-harness/original-2.jpg" target="_blank" rel="noopener"><img src="/images/deepseek-harness/original-2.jpg" alt="DeepSeek Harness｜共探智能上限" loading="lazy"></a><a href="/images/deepseek-harness/original-3.jpg" target="_blank" rel="noopener"><img src="/images/deepseek-harness/original-3.jpg" alt="DeepSeek製コーディングエージェント「DeepSeek Harness」のデスクトップ版が登場 - GIGAZINE" loading="lazy"></a></div>{% endraw %}

DeepSeek 官方开源了 **DeepSeek Harness（简称 DSH）**。它已经从最初面向开发者的预览项目，发展到提供 Windows、macOS 桌面端的公开测试版本。

这个项目挺值得研究的。尤其是对于接触 AI 编程、GitHub、多仓库开发，也对 OpenClaw 这类自主运行的 Agent 感兴趣的人。

不过，我觉得它最值得了解的地方，甚至不在于 DeepSeek 模型有多强。

**它是在尝试回答一个更基础的问题：能不能把 AI Agent 的整个运行系统拆成一组可以自由替换、组合、动态扩展的零件？**

DeepSeek 给出的答案是：Everything is a Plugin（一切皆插件）。

这套设计有一些很有意思的工程思想，也有一些必须警惕的复杂性。

<!-- more -->

我们分几个层次来看：

1. Harness 到底是什么，它与模型、Agent、OpenClaw 的关系。
2. DeepSeek Harness 整体架构，以及 Cordis 的核心设计。
3. 模型如何一步步操作计算机：Agent Loop、工具、沙箱、权限、上下文。
4. 插件的动态装卸、作用域与生命周期，为什么它比普通插件系统复杂。
5. 会话日志、记忆、压缩、恢复、分叉与运行回放。
6. PTC、子 Agent、多智能体与自动化机制。
7. 真实使用、安装、成本、风险，与 Codex、Claude Code、OpenClaw 的比较。
8. 哪些技术设计值得借鉴，哪些目前还属于实验探索。

---

## 一、先弄清楚：Harness 究竟是什么？

### 1. Model、Agent、Harness 是三种不同的东西

DeepSeek 官方给出了一个简化公式：

$$
\boxed{\text{Agent}=\text{Model}+\text{Harness}}
$$

它很适合理解现代 Agent 的基本构造。<span class="article-citation"><button type="button" class="article-citation-label" aria-expanded="false" aria-controls="article-source-1" aria-label="查看引用来源：deepseek.com"><span class="article-citation-name">deepseek.com</span><small class="article-citation-count">+1</small></button><span class="article-citation-popup" id="article-source-1"><a href="https://www.deepseek.com/en/harness/" target="_blank" rel="noopener">DeepSeek Harness｜共探智能上限</a><a href="https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.zh.md" target="_blank" rel="noopener">DeepSeek Harness 架构文档</a></span></span>

:::diagram[Model + Harness = Agent]
{
  "layout": "stack",
  "items": [
    {
      "title": "Model · 大语言模型",
      "text": "理解、推理、生成内容、提出工具调用",
      "surface": "fill",
      "align": "center",
      "tone": "plain"
    },
    {
      "title": "Harness · 运行与执行系统",
      "chips": [
        "工具调用",
        "运行循环",
        "文件操作",
        "沙箱权限",
        "上下文管理",
        "会话记录",
        "任务调度",
        "插件管理",
        "用户界面"
      ],
      "surface": "fill",
      "align": "center",
      "tone": "plain",
      "chipsColumns": 3,
      "chipsStyle": "filled"
    },
    {
      "title": "Agent · 能执行任务的智能体",
      "text": "观察环境 → 决策 → 执行 → 获取反馈 → 继续工作",
      "tone": "plain",
      "surface": "outline",
      "align": "center"
    }
  ],
  "arrows": true,
  "connectors": [
    "+",
    "↓"
  ],
  "showTitle": false,
  "variant": "panel",
  "surface": "outline",
  "align": "center"
}
:::

假设你给 AI 一个任务：

> 检查我本地的十几个 Git 仓库，把有远程更新的仓库拉取下来；如果出现冲突，分析原因，能安全解决的就解决，最后生成报告。

模型自身能做的是理解指令、写出 Git 命令、分析文本。

真正执行时却需要更多东西：

- **工具层**：提供 `git status`、`git fetch`、读取文件等能力。
- **执行层**：调用操作系统，获得命令输出。
- **控制循环**：根据执行结果，决定下一步做什么。
- **上下文层**：把刚刚发生的事情告诉模型。
- **权限层**：判断哪些操作可以自动执行，哪些需要你确认。
- **持久化层**：任务中断之后，保存运行记录以便继续。

这些构成了 Harness。

因此，模型性能相同的情况下，不同 Harness 也可能表现出明显不同的任务完成率。

一个可以调用工具、验证结果、修正错误的模型，通常比只能连续输出文字的同一个模型更有机会完成复杂任务。

### 2. Harness 并不是 DeepSeek 发明的新概念

Coding Agent 的运行系统一直包含这些部分。

Claude Code、Codex CLI、OpenClaw 等都需要某种 Harness。只是不同产品对它的实现方式、开放程度、运行环境和产品目标不同。

DeepSeek Harness 的特殊性，是把这套系统本身作为一个独立的、可编程、可重组的开源项目发布。

| 概念 | 主要职责 | 类比 |
|--------|--------|--------|
| LLM | 思考与决策 | 大脑 |
| Harness | 组织模型、工具和环境执行任务 | 神经系统与工作机制 |
| Agent | 最终表现出的自主执行能力 | 能行动的整体 |
| Skill | 告诉 Agent 如何完成某类任务 | 工作手册 |
| Plugin | 往 Harness 中增加或替换功能 | 可安装的功能模块 |
| MCP | 连接外部工具与数据的协议 | 通用连接接口 |

有一个关键区别：**Skill 和 Plugin 不在同一个层级。**

Skill 往往是一套提示词、说明文件或辅助脚本，模型读取后学会怎么使用已有能力。

Plugin 则可以从程序层直接改变 Agent 能拥有什么能力。比如增加一个新工具、替换模型提供方、修改上下文生成逻辑，甚至换掉整个 Agent Loop。

后者能够触及更底层的运行机制。

## 二、DeepSeek Harness 的整体架构

### 1. 看懂它的各个层次

根据官方架构文档，DSH 被拆分为几十个 `@deepseek-ai/*` 包，形成一个多层系统。<span class="article-citation"><button type="button" class="article-citation-label" aria-expanded="false" aria-controls="article-source-2" aria-label="查看引用来源：GitHub"><span class="article-citation-name">GitHub</span></button><span class="article-citation-popup" id="article-source-2"><a href="https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.zh.md" target="_blank" rel="noopener">DeepSeek Harness 架构文档</a></span></span>

下面是我根据官方实现整理的逻辑图（做了简化）。

:::diagram[DeepSeek Harness 逻辑架构]
{
  "layout": "stack",
  "items": [
    {
      "title": "交互入口",
      "text": "桌面端 · Web UI · CLI · SDK · ACP",
      "surface": "fill",
      "align": "center",
      "tone": "plain"
    },
    {
      "title": "Agent 执行层",
      "chips": [
        "Agent Loop",
        "Prompt 组装",
        "模型适配器",
        "工具调度"
      ],
      "surface": "outline",
      "align": "center",
      "tone": "plain",
      "chipsColumns": 2,
      "chipsStyle": "filled"
    },
    {
      "title": "能力插件层",
      "chips": [
        "Shell",
        "Filesystem",
        "Session",
        "Compaction",
        "Subagent",
        "Scheduler",
        "Sandbox",
        "MCP",
        "UI"
      ],
      "surface": "outline",
      "align": "center",
      "tone": "plain",
      "chipsColumns": 3,
      "chipsStyle": "filled"
    },
    {
      "title": "Cordis 框架",
      "text": "Context · Service · Event · Effect · Fiber\n依赖管理 · 作用域 · 生命周期 · 组合配置",
      "tone": "accent",
      "surface": "outline",
      "align": "center"
    },
    {
      "layout": "row",
      "items": [
        {
          "title": "操作系统 / 文件",
          "surface": "fill",
          "align": "center",
          "tone": "plain"
        },
        {
          "title": "LLM API",
          "surface": "fill",
          "align": "center",
          "tone": "plain"
        },
        {
          "title": "外部服务",
          "surface": "fill",
          "align": "center",
          "tone": "plain"
        }
      ],
      "surface": "none"
    }
  ],
  "arrows": true,
  "connectors": [
    "↓",
    "↕",
    "↕",
    "↕"
  ],
  "note": "逻辑架构示意。实际实现是插件依赖网络，并非固定逐层调用的流水线。",
  "showTitle": false,
  "variant": "panel",
  "surface": "outline",
  "align": "center"
}
:::

最需要注意的是，图里看起来居中的 Agent Loop，在 DSH 中也只是一个插件。

这意味着：

- 你可以只替换模型适配器，把 DeepSeek 换成 Claude 或 GPT。
- 可以把 Shell 执行从本地进程换成远程沙箱。
- 可以替换会话存储后端。
- 可以给模型额外装一个工具。
- 甚至可以替换整个 Agent 的决策与执行循环。

最后一项尤为重要。

大多数插件系统只允许扩展已有功能，而 DSH 把运行机制本身也暴露为可替换的构件。它的灵活性主要来自这里。

### 2. 它在源码里是怎么组织的？

重点目录可以先看这些：

| 目录 | 职责 |
|--------|--------|
| `packages/core/` | Agent、Loop、工具注册、会话、提示词等抽象 |
| `packages/llm/` | 模型接口和不同供应商适配器 |
| `packages/sandbox/` | 进程执行、沙箱与策略 |
| `packages/session/` | 会话持久化、投影和运行数据 |
| `packages/compaction/` | 长上下文压缩 |
| `packages/workflow/` | 多步骤工作流和子 Agent 编排 |
| `packages/bundle/` | 把不同插件组装为可运行产品 |
| `apps/` | 应用入口，包括桌面相关实现 |
| `python/` | Python SDK 及运行时集成 |

官方源码：[deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)。

这套分包方式体现了一个设计原则：定义能力的接口，和真正执行能力的实现，应该能够独立变化。

例如，文件操作工具不应该非得知道自己操作的是 Windows 本地磁盘、Linux 容器，还是远程服务器文件系统。

这点后面会深入讲。

---

## 三、Cordis：这才是 DeepSeek Harness 最值得研究的部分

DeepSeek Harness 的插件架构基于 Cordis。

Cordis 的设计对应一篇由北京大学与 DeepSeek-AI 研究人员参与完成的论文：

[A Programming Paradigm for Spatiotemporal Composability](https://arxiv.org/abs/2608.25512)

论文于 2026 年 8 月 26 日提交，全文 92 页。它尝试从编程语言与形式化方法层面，解释动态插件组合为什么可以可靠工作。<span class="article-citation"><button type="button" class="article-citation-label" aria-expanded="false" aria-controls="article-source-3" aria-label="查看引用来源：arxiv.org"><span class="article-citation-name">arxiv.org</span></button><span class="article-citation-popup" id="article-source-3"><a href="https://arxiv.org/abs/2608.25512" target="_blank" rel="noopener">A Programming Paradigm for Spatiotemporal Composability</a></span></span>

### 1. 普通插件架构有什么问题？

设想一个应用：

- 插件 A 提供模型服务。
- 插件 B 提供搜索工具。
- 插件 C 依赖 A 和 B。
- 插件 D 监听 C 的任务执行事件。

现在用户把 B 卸载了。

一个简单的插件系统可能会遇到：

- C 仍然保留着已经失效的搜索服务引用。
- B 注册的事件监听器没有清理。
- C 执行到一半报错。
- D 不知道哪些功能已经不可用了。
- 如果重新安装 B，又注册了一批重复监听器。

类似的问题，在前端热更新、依赖注入系统、微服务启动与关闭、IDE 插件中都能遇到。

Cordis 针对这些问题提出两个概念。

### 2. 时间可组合性：插件卸载后，撤销它带来的副作用

英文叫 *Temporal Composability*。

一个插件加载时往往不只是提供函数，还会改变运行环境：

- 注册工具；
- 订阅事件；
- 创建定时器；
- 打开连接；
- 向上下文添加能力。

Cordis 尝试要求这些操作具有可追踪、可撤销的生命周期。

例如，概念上可以写成：

```typescript
export function apply(ctx: Context) {
  ctx.on("agent/created", onAgentCreated);

  ctx.effect(() => {
    const timer = setInterval(runCheck, 5000);

    return () => clearInterval(timer);
  });
}
```

这里 `ctx.effect()` 接收一个创建资源的操作，以及对应的清理函数。

当插件卸载：

1. 事件监听被移除。
2. 定时器被清除。
3. 插件自己注册的服务和工具被撤销。
4. 相关资源完成清理。

官方文档还说明，清理函数会按注册的逆序开始执行，但异步清理不保证逐个顺序完成。<span class="article-citation"><button type="button" class="article-citation-label" aria-expanded="false" aria-controls="article-source-4" aria-label="查看引用来源：DeepSeek Harness"><span class="article-citation-name">DeepSeek Harness</span></button><span class="article-citation-popup" id="article-source-4"><a href="https://deepseek-harness.github.io/deepseek-harness/develop/framework/" target="_blank" rel="noopener">插件与生命周期</a></span></span>

你可以把它理解成：**每个插件都携带一份自己在系统中留下了什么痕迹、如何撤销的账本。**

但要注意，这不等于数据库事务回滚。它不能自动撤销插件已经写入磁盘的文件、发出的网络请求，或者已经发送的邮件。

Cordis 保障的是受到其生命周期机制管理的程序内部副作用。

### 3. 空间可组合性：依赖变化时自动调整插件状态

英文叫 *Spatial Composability*。

假设插件 C 需要搜索和模型两个服务：

```typescript
export const inject = ["search", "llm"];

export function apply(ctx: Context) {
  // 依赖准备完成后才会执行
}
```

Cordis 会管理它的生命周期。

:::diagram[依赖变化与插件生命周期]
{
  "layout": "stack",
  "items": [
    {
      "title": "插件 C 已声明",
      "badge": "PENDING",
      "surface": "fill",
      "align": "left",
      "tone": "plain"
    },
    {
      "title": "依赖服务全部就绪",
      "text": "自动加载，执行 apply()",
      "badge": "ACTIVE",
      "tone": "accent",
      "surface": "fill",
      "align": "left",
      "badgePosition": "after"
    },
    {
      "title": "search 服务被卸载",
      "text": "C 自动失活并清理资源\nUNLOADING → DISPOSED",
      "surface": "fill",
      "align": "left",
      "tone": "plain"
    },
    {
      "title": "search 服务重新出现",
      "text": "依赖恢复，C 重新加载",
      "surface": "fill",
      "align": "left",
      "tone": "accent"
    }
  ],
  "arrows": true,
  "showTitle": false,
  "variant": "panel",
  "surface": "outline"
}
:::

这和普通的 `import` 语句不同。

`import` 主要描述代码模块之间的依赖；Cordis 管理的是**运行中的动态依赖**。某个服务可能在系统运行五分钟后才出现，也可能在第十分钟消失。

对应地，插件拥有自己的生命周期状态机：

`PENDING → LOADING → ACTIVE → UNLOADING → DISPOSED`

加载失败也可能进入 `FAILED`。<span class="article-citation"><button type="button" class="article-citation-label" aria-expanded="false" aria-controls="article-source-5" aria-label="查看引用来源：DeepSeek Harness"><span class="article-citation-name">DeepSeek Harness</span></button><span class="article-citation-popup" id="article-source-5"><a href="https://deepseek-harness.github.io/deepseek-harness/develop/framework/" target="_blank" rel="noopener">插件与生命周期</a></span></span>

### 4. Context：所有插件通过它认识彼此

Cordis 最重要的对象之一是 `ctx`（Context）。

可以把它视为插件进入系统的上下文入口。

例如：

```typescript
ctx.llm       // 模型服务
ctx.tools     // 工具注册和执行
ctx.sessions  // 会话服务
ctx.agents    // Agent 管理
```

插件可以通过 Context 使用服务、注册能力、监听事件。

但不同插件并不一定看到相同的服务实例。

Cordis 提供了 `isolate` 机制，可以让不同插件组拥有独立的某些服务。

例如：

- 组 A 的 Shell 服务连接本地进程，执行超时为 5 秒。
- 组 B 的 Shell 服务使用另一套执行配置，超时为 60 秒。

它们可以同时存在于一套 Harness 中。

**这里的隔离是服务作用域隔离，不等于操作系统级安全隔离。** 别把它和 Docker、虚拟机混为一谈。<span class="article-citation"><button type="button" class="article-citation-label" aria-expanded="false" aria-controls="article-source-6" aria-label="查看引用来源：DeepSeek Harness"><span class="article-citation-name">DeepSeek Harness</span></button><span class="article-citation-popup" id="article-source-6"><a href="https://deepseek-harness.github.io/deepseek-harness/develop/framework/service" target="_blank" rel="noopener">服务与依赖</a></span></span>

### 5. Event：插件之间如何相互协作

Cordis 也提供类型化的事件机制，包括：

| 事件模式 | 作用 | 适用场景 |
|--------|--------|--------|
| `emit` | 广播通知 | 工具执行完毕 |
| `bail` | 依次询问，符合条件时提前返回 | 选择处理器 |
| `serial` | 顺序运行并等待 | 初始化、审批 |
| `waterfall` | 一个处理器包装下一个处理器 | 工具拦截、策略、请求加工 |

特别值得注意的是 `waterfall`。

假设 Agent 准备执行：

```bash
rm -rf ./build
```

它可以经过一连串处理：

:::diagram[工具调用的中间件链]
{
  "layout": "stack",
  "items": [
    {
      "title": "Agent 发出删除命令",
      "badge": "1",
      "surface": "outline",
      "tone": "plain"
    },
    {
      "title": "插件 A：检查路径是否允许",
      "badge": "2",
      "surface": "outline",
      "tone": "plain"
    },
    {
      "title": "插件 B：判断是否需要审批",
      "badge": "3",
      "surface": "outline",
      "tone": "plain"
    },
    {
      "title": "插件 C：记录审计信息",
      "badge": "4",
      "surface": "outline",
      "tone": "plain"
    },
    {
      "title": "执行 Shell 工具",
      "badge": "5",
      "surface": "outline",
      "tone": "plain"
    },
    {
      "title": "插件 D：处理与展示结果",
      "badge": "6",
      "surface": "outline",
      "tone": "plain"
    }
  ],
  "arrows": true,
  "showTitle": false,
  "variant": "numbered",
  "surface": "outline"
}
:::

其中一个插件可以拦截调用，阻止后续操作。

这是典型的中间件模式。你可能会联想到 Koa、Express、HTTP middleware。

区别在于，Cordis 把这套机制与插件作用域、依赖管理、生命周期结合起来，并广泛应用于模型请求、工具调用和 Agent 执行。

官方文档：[Cordis 事件系统](https://deepseek-harness.github.io/deepseek-harness/develop/framework/events)。

### 6. Cordis 最核心的创新到底是什么？

我认为它有三个层次：

**第一层：插件化。** 常见的模块化思想，把不同能力解耦。

**第二层：插件动态重组。** 能在系统运行时安装、卸载、替换服务，并自动处理依赖。

**第三层：把插件组合的正确性变成可以讨论、建模、证明的程序语义问题。**

第三层才是那篇论文的技术野心。

论文借用了 *effect* 和 *coeffect* 的概念，分别研究组件向环境施加的影响，以及组件依赖环境提供哪些能力。

它还引入上下文转换、逆操作和观察等价性等机制，试图说明：在给定约束下，组件如何交错执行而不意外破坏彼此的行为。<span class="article-citation"><button type="button" class="article-citation-label" aria-expanded="false" aria-controls="article-source-7" aria-label="查看引用来源：arxiv.org"><span class="article-citation-name">arxiv.org</span></button><span class="article-citation-popup" id="article-source-7"><a href="https://arxiv.org/abs/2608.25512" target="_blank" rel="noopener">A Programming Paradigm for Spatiotemporal Composability</a></span></span>

这部分很有研究价值，但不能简单理解成“论文证明了 DSH 所有插件都是安全的”。

论文提供的是一种形式化架构；实际软件是否正确，仍取决于每个插件是否遵守约定、异常处理是否完整，以及实际实现有没有 bug。

我的判断是：**Cordis 的思想价值可能比 DSH 这款具体应用更持久。** 即使未来 DeepSeek Harness 的产品形态发生变化，这套动态组合的设计仍值得单独研究。

## 四、Agent Loop：AI 到底是怎样一步步完成工作的？

这一部分可以把 DSH 从抽象架构拉回到实际执行过程。

### 1. 一次用户提问，并不等于一次模型调用

官方对执行层次的定义非常明确：

- **Turn（轮次）**：围绕一条用户输入展开的完整处理过程。
- **Step（步骤）**：一次模型请求，以及它随后发起的工具调用。
- **Tool Call（工具调用）**：某一步中具体执行的命令或功能。

一个 Turn 可以包含零个或多个 Step。

假设你说：

> 检查我的博客仓库，找出最近一周改动过的文件，运行测试，如果发现简单错误就修复。

它可能变成这样的执行树：

:::diagram[Turn #1：检查博客仓库]
{
  "layout": "stack",
  "items": [
    {
      "title": "Step 1",
      "text": "理解任务与探索环境",
      "badge": "模型调用一次",
      "chips": [
        "git log --since=1.week",
        "git status",
        "读取 package.json"
      ],
      "surface": "fill",
      "tone": "plain",
      "chipsStyle": "filled"
    },
    {
      "title": "Step 2",
      "text": "分析项目并执行测试",
      "badge": "模型调用一次",
      "chips": [
        "读取修改文件",
        "运行 npm test"
      ],
      "surface": "fill",
      "tone": "plain",
      "chipsStyle": "filled"
    },
    {
      "title": "Step 3",
      "text": "发现问题并修复",
      "badge": "模型调用一次",
      "chips": [
        "读取失败日志",
        "修改代码",
        "重新运行测试"
      ],
      "surface": "fill",
      "tone": "plain",
      "chipsStyle": "filled"
    },
    {
      "title": "Step 4",
      "text": "复核并总结",
      "badge": "模型调用一次",
      "chips": [
        "git diff --check",
        "生成最终说明"
      ],
      "surface": "fill",
      "tone": "plain",
      "chipsStyle": "filled"
    },
    {
      "title": "最终回复用户",
      "text": "任务完成，Turn 结束",
      "tone": "plain",
      "surface": "none",
      "icon": "check",
      "align": "center"
    }
  ],
  "arrows": false,
  "showTitle": false,
  "variant": "tree",
  "surface": "outline",
  "title": "Turn #1：检查博客仓库",
  "badge": "1 个用户请求"
}
:::

这里一共可能发生四次模型调用、十次左右工具调用，但你只向它发出了一条用户消息。

这也解释了为什么不能只根据“发了几条提示词”来评价 Agent 的成本或效率。

### 2. 一次 Step 的内部顺序

官方架构文档详细列出了实际事件顺序。简化之后是：

:::diagram[一次 Step 的内部顺序]
{
  "layout": "stack",
  "items": [
    {
      "title": "① 领取输入",
      "text": "从会话队列取出待处理消息",
      "surface": "none",
      "tone": "plain"
    },
    {
      "title": "② 确认模型和环境",
      "text": "锁定本步骤的模型选择，收集运行环境",
      "surface": "none",
      "tone": "plain"
    },
    {
      "title": "③ 组装提示词",
      "text": "系统提示词 + 会话历史 + 当前环境 + 工具 Schema",
      "surface": "none",
      "tone": "plain"
    },
    {
      "title": "④ 冻结请求",
      "text": "生成这一次模型真正看到的内容",
      "surface": "none",
      "tone": "plain"
    },
    {
      "title": "⑤ 流式调用模型",
      "text": "模型生成文本或工具调用",
      "surface": "none",
      "tone": "plain"
    },
    {
      "title": "⑥ 执行工具",
      "text": "经过权限检查、执行器、结果处理",
      "surface": "none",
      "tone": "accent"
    },
    {
      "title": "⑦ 记录结果",
      "text": "保存消息、工具调用、结果和步骤状态",
      "surface": "none",
      "tone": "plain"
    },
    {
      "title": "⑧ 决定是否继续",
      "text": "还有工作就进入下一步，否则结束",
      "surface": "none",
      "tone": "plain"
    }
  ],
  "arrows": false,
  "showTitle": false,
  "variant": "timeline",
  "surface": "outline"
}
:::

实际实现还包含 `agent/pre-step`、`agent/request`、`llm/stream`、`tools/pre-execute` 等事件钩子。插件可以在这些节点观察、修改、拒绝或扩展操作。<span class="article-citation"><button type="button" class="article-citation-label" aria-expanded="false" aria-controls="article-source-8" aria-label="查看引用来源：GitHub"><span class="article-citation-name">GitHub</span></button><span class="article-citation-popup" id="article-source-8"><a href="https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md" target="_blank" rel="noopener">DeepSeek Harness Architecture</a></span></span>

### 3. 一个容易忽视的设计：先冻结模型请求，再发送

假设某个工具刚刚更新了工作目录，或者用户在任务进行中又追加了一条信息。

如果系统一边发送模型请求，一边随意修改模型输入，很容易造成状态不一致。

DSH 因此会在调用模型之前：

1. 生成本步骤可见的消息历史。
2. 确定使用哪个模型、哪些工具。
3. 创建一次不可变的模型请求快照。
4. 然后才开始实际推理。

这样，日志里能够记录当时模型究竟基于什么上下文作出了决策。

这对于任务失败后的复盘非常重要。

不过，“可复盘”不意味着完全确定性重放。因为重新执行时，模型输出、网络内容、磁盘状态甚至当前时间，都可能已经变化。

### 4. Agent 如何知道下一步该干什么？

通常不是 Harness 事先写好一个完整流程。

模型会收到：

- 当前任务目标；
- 前几步已经发生的事情；
- 工具执行结果；
- 可调用工具的名称、参数和说明；
- 限制条件和系统指令。

然后模型生成下一步动作。

例如：

```json
{
  "tool": "bash",
  "arguments": {
    "command": "git status --short"
  }
}
```

Harness 负责把这个结构化请求映射到真正的 `bash` 工具，执行之后再把结果送回模型。

工具结果可能是：

```text
 M src/article.ts
?? notes.md
```

接下来模型可能决定读取 `src/article.ts`，也可能决定先检查差异。

换言之，传统脚本的流程通常由程序员事先确定，而 Agent 的部分控制流程是在运行过程中，由模型根据反馈生成的。

这给了它处理未知情况的灵活性，也带来了不可预测性。

---

## 五、工具调用：普通模式和 PTC 模式有什么本质区别？

这是 DSH 另一个特别值得研究的地方。

它提供了不同的工具调用模式，其中 **PTC（Programmatic Tool Calling，程序化工具调用）** 是一个重要实验方向。

### 1. 传统工具调用：模型逐个收到执行结果

假设需要检查十个 Git 仓库。

普通模式下，模型可能发出十个工具调用：

```text
调用 git status（仓库 A）
    ↓
返回完整文本
调用 git status（仓库 B）
    ↓
返回完整文本
……
调用 git status（仓库 J）
    ↓
返回完整文本
```

这些调用不一定全部串行执行——支持并行调用的模型和 Harness 也可以一次发起多个工具。

但关键是：每次工具的结果通常会作为模型可见的内容进入上下文。

假如每个仓库返回 200 行文本，十个仓库就会产生大量需要模型读取的内容。

这会增加 token 消耗，也可能把真正重要的信息淹没。

### 2. PTC：让模型生成一段程序来编排工具

PTC 的思路是，让模型生成一段可执行的工具编排代码，在受控运行时中调用其他工具，最后只把所需结果返回模型。

例如下面是概念性示例，函数名与参数需要以运行时生成的实际 SDK 为准：

```typescript
const repos = [
  "blog",
  "content-studio",
  "quant-research",
];

const results = await Promise.all(
  repos.map(async (repo) => {
    const result = await tools.bash({
      command: `git -C /workspace/${repo} status --short`,
    });

    return {
      repo,
      dirty: result.stdout.trim().length > 0,
    };
  })
);

return results;
```

运行时执行这段程序，并把一个很小的汇总结果送给模型：

```json
[
  {"repo": "blog", "dirty": true},
  {"repo": "content-studio", "dirty": false},
  {"repo": "quant-research", "dirty": true}
]
```

:::diagram[普通调用与 PTC 的信息流]
{
  "layout": "grid",
  "items": [
    {
      "layout": "stack",
      "items": [
        {
          "title": "模型",
          "surface": "fill",
          "align": "center",
          "tone": "plain"
        },
        {
          "title": "工具 A/B/C",
          "surface": "fill",
          "align": "center",
          "tone": "plain"
        },
        {
          "title": "每个工具的原始结果",
          "surface": "fill",
          "align": "center",
          "tone": "plain"
        }
      ],
      "title": "普通工具调用",
      "arrows": true,
      "connectors": [
        "↕",
        "↕"
      ],
      "note": "模型需要处理更多中间数据",
      "variant": "panel",
      "surface": "outline"
    },
    {
      "layout": "stack",
      "items": [
        {
          "title": "模型生成程序",
          "surface": "fill",
          "align": "center",
          "tone": "plain"
        },
        {
          "title": "程序执行多个工具",
          "surface": "fill",
          "align": "center",
          "tone": "accent"
        },
        {
          "title": "过滤 / 汇总结果",
          "surface": "fill",
          "align": "center",
          "tone": "plain"
        }
      ],
      "title": "PTC 程序化调用",
      "arrows": true,
      "note": "模型只接收必要信息",
      "variant": "panel",
      "surface": "outline"
    }
  ],
  "columns": 2,
  "showTitle": false,
  "variant": "comparison",
  "surface": "none"
}
:::

官方实现提供 `run_code` 入口和工具 SDK，支持在代码中调用、组合、并发执行已注册工具。它设有并发和执行时限等控制机制。<span class="article-citation"><button type="button" class="article-citation-label" aria-expanded="false" aria-controls="article-source-9" aria-label="查看引用来源：GitHub"><span class="article-citation-name">GitHub</span><small class="article-citation-count">+1</small></button><span class="article-citation-popup" id="article-source-9"><a href="https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/core/tools/README.md" target="_blank" rel="noopener">工具系统 README</a><a href="https://deepseek-harness.github.io/deepseek-harness/reference/subsystems/ptc-runtime" target="_blank" rel="noopener">PTC 运行时</a></span></span>

### 3. PTC 为什么可能更省钱？

假设有 20 次工具调用，每次返回 2,000 token，而模型真正需要的只有每次结果中的一个状态值。

|  | 普通调用 | PTC |
|--------|--------|--------|
| 中间工具输出 | 约 40,000 token | 在程序内部处理 |
| 回传给模型 | 大量原始数据 | 可能仅数百 token |
| 过滤与汇总 | 主要由模型完成 | 由程序完成 |
| 额外成本 | 较少编排代码 | 需要生成、执行代码 |

这里的数字只是帮助理解的假设，并不是 DSH 的实测成绩。

PTC 的优势来自**让确定性的计算留在程序里，让模型只处理需要智能判断的部分**。

例如：

- 一万行日志中提取错误码；
- 批量请求 API 后做排序；
- 计算所有仓库的 Git 状态；
- 在多个文件中进行固定模式搜索；
- 分组、过滤、去重、聚合。

这些工作通常没必要把每条原始数据都喂给模型。

### 4. 那是不是应该永远使用 PTC？

不是。

PTC 有四个代价。

**第一，模型要先写对程序。** 如果工具参数不对、路径不对、并发逻辑有问题，执行仍会失败。

**第二，复杂的程序执行需要自己的防护。** 外层 `run_code` 的资源限制、内层工具的执行权限、并发控制不是同一回事。

**第三，可能隐藏重要的中间信息。** 如果过滤逻辑写错，模型可能根本看不到被过滤掉的异常。

**第四，小任务未必划算。** 为了读取一个文件而先生成几十行代码，反而可能增加延迟和成本。

所以更合理的判断是：

| 场景 | 更合适的倾向 |
|--------|--------|
| 读取单个文件、执行一条命令 | 普通工具调用 |
| 大规模搜索、批处理和汇总 | PTC |
| 大量可并行、相互独立的任务 | PTC 值得尝试 |
| 高风险操作、需要逐项审批 | 根据审批粒度设计，不能只追求批量 |
| 需要复杂开放式判断 | 保留模型多轮决策，必要时局部使用 PTC |

我认为 PTC 背后有个很重要的思想：**Agent 不应该用语言模型去完成所有计算。**

语言模型擅长理解意图、处理模糊情况和制定策略；传统代码擅长可重复、确定性和大规模计算。好的 Harness 要让它们各自做适合的工作。

### 5. 工具并不是模型想调用就能直接调用

DSH 的工具链有明确的执行过程：

```text
模型请求调用某工具
       ↓
注册工具是否存在？
       ↓
参数验证与执行前策略
       ↓
权限和审批判断
       ↓
调用实际执行器
       ↓
超时、错误、输出处理
       ↓
执行后处理
       ↓
记录工具结果
       ↓
返回模型
```

其中 `tools/pre-execute`、`tools/execute`、`tools/post-execute` 是独立的可扩展环节。<span class="article-citation"><button type="button" class="article-citation-label" aria-expanded="false" aria-controls="article-source-10" aria-label="查看引用来源：GitHub"><span class="article-citation-name">GitHub</span></button><span class="article-citation-popup" id="article-source-10"><a href="https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/tool-execution-pipeline.md" target="_blank" rel="noopener">工具执行流水线</a></span></span>

还要理解一个关键的抽象层：**工具接口不一定等于底层执行器。**

例如：

:::diagram[工具接口与执行后端]
{
  "layout": "stack",
  "items": [
    {
      "title": "模型看到 bash 工具",
      "text": "输入一条命令，获得输出",
      "surface": "fill",
      "align": "center",
      "tone": "plain"
    },
    {
      "title": "Shell 服务接口",
      "text": "定义执行语义，不固定执行环境",
      "tone": "plain",
      "surface": "outline",
      "align": "center"
    },
    {
      "layout": "row",
      "items": [
        {
          "title": "本机进程",
          "surface": "fill",
          "align": "center",
          "tone": "plain"
        },
        {
          "title": "Docker / 沙箱",
          "surface": "fill",
          "align": "center",
          "tone": "plain"
        },
        {
          "title": "远程服务器",
          "surface": "fill",
          "align": "center",
          "tone": "plain"
        }
      ],
      "surface": "none"
    }
  ],
  "arrows": true,
  "showTitle": false,
  "variant": "panel",
  "surface": "outline",
  "align": "center"
}
:::

同一个模型工具接口，可以通过替换底层服务提供者改变执行位置。

这有两个好处：

一是模型不需要知道执行环境的具体实现；二是可以在不重写工具说明和 Agent Loop 的情况下切换执行后端。

这也是 Cordis 的可组合性最终落到实际工程中的一个典型例子。

## 六、会话、记忆与上下文：它究竟记住了什么？

这一部分我觉得非常重要，因为很多 Agent 产品会把“会话历史”“上下文”和“长期记忆”混着讲。

实际上，这是三套不同的东西。

### 1. DSH 采用 Event Sourcing：记录发生过的事件

传统聊天软件可能只保存这样的记录：

```text
用户：检查仓库。
AI：检查好了，发现两个问题。
```

但是这两句话之间可能发生了几十次操作。只保存最终对话，对调试来说远远不够。

DSH 的核心会话系统采用**仅追加事件日志（Append-only Event Log）**。

概念上，一次任务的日志是：

```text
0001  turn/start
0002  user/message
0003  step/start
0004  request/header
0005  assistant/message
0006  tool/call
0007  tool/result
0008  step/end
0009  step/start
0010  assistant/message
0011  step/end
0012  turn/end
```

每条记录带有类型、顺序号、时间和数据。

从这些事件可以重建不同的视图，而不是为每种视图单独存储一份互相可能冲突的状态。

:::diagram[从事件日志投影出不同视图]
{
  "layout": "stack",
  "items": [
    {
      "title": "Session Event Log",
      "text": "记录系统实际发生过的事件",
      "tone": "plain",
      "surface": "fill",
      "align": "center"
    },
    {
      "layout": "grid",
      "items": [
        {
          "title": "模型上下文",
          "text": "模型当前能看到什么",
          "surface": "fill",
          "align": "left",
          "tone": "plain"
        },
        {
          "title": "对话界面",
          "text": "用户看到的消息",
          "surface": "fill",
          "align": "left",
          "tone": "plain"
        },
        {
          "title": "执行轨迹",
          "text": "工具、步骤、耗时、错误",
          "surface": "fill",
          "align": "left",
          "tone": "plain"
        },
        {
          "title": "会话恢复",
          "text": "中断后重建执行状态",
          "surface": "fill",
          "align": "left",
          "tone": "plain"
        }
      ],
      "columns": 2,
      "surface": "none"
    }
  ],
  "arrows": true,
  "connectors": [
    "⑂"
  ],
  "showTitle": false,
  "variant": "panel",
  "surface": "outline",
  "align": "center"
}
:::

技术上，这种做法叫 *Event Sourcing*（事件溯源）。

它在金融账本、业务审计、分布式系统等领域也有应用，并不是 Agent 专属技术。

DSH 有个值得注意的细节：模型最终可见的历史，是通过 `deriveMessages()` 从日志投影出来的。系统甚至把没有成为正式模型消息的失败、重试和中断尝试，作为单独事件保存。<span class="article-citation"><button type="button" class="article-citation-label" aria-expanded="false" aria-controls="article-source-11" aria-label="查看引用来源：DeepSeek Harness"><span class="article-citation-name">DeepSeek Harness</span></button><span class="article-citation-popup" id="article-source-11"><a href="https://deepseek-harness.github.io/deepseek-harness/reference/subsystems/session" target="_blank" rel="noopener">会话</a></span></span>

这带来几个能力：

- **审计**：查清模型实际做了哪些操作。
- **复现输入**：重建某一次模型调用之前的上下文。
- **Fork**：从某个历史位置派生新的会话分支。
- **Resume**：恢复已有会话，而不必从头开始。
- **调试**：区分“模型生成错了”和“工具执行错了”。

注意，Fork 是会话历史分叉。它不会自动把文件系统也变回过去的状态。要实现完整的环境快照，还需要 Git、容器快照或其他版本管理机制配合。

### 2. 会话记录怎么存到磁盘？

官方提供了一个 JSONL 持久化后端，同时把持久化本身也定义为可替换服务。

它采用会话句柄管理读写，并处理单写者所有权、数据刷新、日志恢复等问题。官方还设计了日志损坏或进程中断时的恢复路径。<span class="article-citation"><button type="button" class="article-citation-label" aria-expanded="false" aria-controls="article-source-12" aria-label="查看引用来源：DeepSeek Harness"><span class="article-citation-name">DeepSeek Harness</span></button><span class="article-citation-popup" id="article-source-12"><a href="https://deepseek-harness.github.io/deepseek-harness/reference/subsystems/persistence" target="_blank" rel="noopener">会话持久化</a></span></span>

这说明 DSH 没有只把会话当作聊天窗口里的临时字符串。

它已经把会话视为 Agent 的一种核心持久化运行数据。

当然，这也意味着日志可能包含敏感信息：文件内容、工具结果、模型请求等。使用时需要考虑本地存储保护和数据保留策略。

### 3. 上下文压缩：为什么日志还在，模型却可能忘记？

先区分三个东西：

| 层次 | 内容 | 核心限制 |
|--------|--------|--------|
| 原始会话日志 | 历史事件和工具记录 | 磁盘空间、持久化策略 |
| 当前模型上下文 | 本次模型请求真正包含的信息 | 模型上下文窗口与 token 成本 |
| 长期记忆 | 跨会话提取、存储并检索的知识 | 记忆写入、检索和维护机制 |

假设你让 Agent 连续工作八小时。

它已经执行了几百条命令，记录了大量结果。原始日志可以保留，但模型不可能无限制地每次重新读入所有原始内容。

于是需要 Compaction（上下文压缩）。

例如原始历史：

```text
检查了 31 个文件
执行了 8 次测试
修复了 3 个问题
尝试了两套实现方案
……
累计 100,000 token
```

压缩后可能变成：

```text
当前目标：完成登录模块重构。

已完成：
- 重构认证逻辑
- 修复三个测试失败

当前状态：
- 31 个文件已检查
- 仍有两个集成测试需要运行

重要约束：
- 不修改公共 API
```

后续模型主要接收这份摘要以及最近保留的原始上下文。

DSH 的实现很有意思：它通过新的事件，**在模型可见的历史中用摘要遮蔽一段旧内容，但原始日志并没有被直接抹掉**。

源码中相应的事件包括 `compaction/start`、`compaction/summary`、`compaction/end`，同时还有历史消息替换操作。<span class="article-citation"><button type="button" class="article-citation-label" aria-expanded="false" aria-controls="article-source-13" aria-label="查看引用来源：DeepSeek Harness"><span class="article-citation-name">DeepSeek Harness</span></button><span class="article-citation-popup" id="article-source-13"><a href="https://deepseek-harness.github.io/deepseek-harness/reference/subsystems/compaction" target="_blank" rel="noopener">压缩（compaction）</a></span></span>

这相当于：

- 存储层保留证据；
- 推理层使用更短的视图；
- 调试时还能查看旧事件。

但压缩本身仍可能损失重要细节。摘要没写进去的信息，即使磁盘上还保存着，模型也不会自动知道。

### 4. DSH 有真正的跨会话长期记忆吗？

它有会话持久化能力，也有接入长期记忆系统的能力，但不应把两者等同。

官方提供了几套默认关闭的 MCP 记忆集成示例：

| 记忆系统 | 大致机制 |
|--------|--------|
| Memorix | 本地项目记忆，支持启发式方式运行 |
| MCP Reference Memory | 本地知识图谱式实体、关系、观察存储 |
| Engram | 可通过 MCP 接入的外部记忆服务 |

这些属于额外接入的系统，不是所有用户安装 DSH 后就自动拥有一套成熟的、会持续整理个人生活的记忆。<span class="article-citation"><button type="button" class="article-citation-label" aria-expanded="false" aria-controls="article-source-14" aria-label="查看引用来源：DeepSeek Harness"><span class="article-citation-name">DeepSeek Harness</span></button><span class="article-citation-popup" id="article-source-14"><a href="https://deepseek-harness.github.io/deepseek-harness/guide/mcp-memory" target="_blank" rel="noopener">连接第三方记忆 MCP 服务</a></span></span>

**即使接上记忆服务，也还有三个独立问题：**

什么信息应该被存入记忆？什么时候应该检索？发现两条记忆互相矛盾时怎么处理？

仅仅拥有数据库和检索工具，并不会自动解决这些问题。

这也正是“人格化 AI”和“真正有持续自我历史的 Agent”之间的重要技术差距之一。

---

## 七、从单 Agent 到多 Agent，再到主动运行

前面讲的是一个 Agent 如何工作。接下来看看 DSH 如何扩展到更加自主的场景。

### 1. Subagent：主 Agent 可以把任务交给其他 Agent

例如，你让主 Agent：

> 研究我的内容发布系统，给出性能优化方案，同时检查前端设计和 GitHub Actions。

它可以把任务拆开：

:::diagram[主 Agent 与子 Agent 分工]
{
  "layout": "stack",
  "items": [
    {
      "title": "主 Agent · 项目负责人",
      "text": "拆分任务、整合结果、决定下一步",
      "tone": "plain",
      "surface": "outline",
      "align": "center"
    },
    {
      "layout": "row",
      "items": [
        {
          "title": "子 Agent A",
          "text": "分析性能",
          "surface": "fill",
          "align": "center",
          "tone": "plain"
        },
        {
          "title": "子 Agent B",
          "text": "检查前端",
          "surface": "fill",
          "align": "center",
          "tone": "plain"
        },
        {
          "title": "子 Agent C",
          "text": "审查 CI",
          "surface": "fill",
          "align": "center",
          "tone": "plain"
        }
      ],
      "surface": "none"
    },
    {
      "title": "汇总结果",
      "text": "交给主 Agent 继续决策",
      "surface": "fill",
      "align": "center",
      "tone": "plain"
    }
  ],
  "arrows": true,
  "connectors": [
    "⑂",
    "↕"
  ],
  "showTitle": false,
  "variant": "panel",
  "surface": "outline",
  "align": "center"
}
:::

DSH 的子 Agent 系统支持不同的执行后端、本地可持续会话、任务结果回传、取消操作，以及部分独立模型或预设选项。

本地子 Agent 有自己的会话历史；它不需要把父 Agent 的全部上下文都复制进去。<span class="article-citation"><button type="button" class="article-citation-label" aria-expanded="false" aria-controls="article-source-15" aria-label="查看引用来源：DeepSeek Harness"><span class="article-citation-name">DeepSeek Harness</span></button><span class="article-citation-popup" id="article-source-15"><a href="https://deepseek-harness.github.io/deepseek-harness/reference/subsystems/subagent" target="_blank" rel="noopener">子代理</a></span></span>

这有利于控制上下文长度，也有利于让多个研究任务并行。

但多 Agent 不一定比单 Agent 更聪明。

假如三个 Agent 都在修改同一份代码文件，很可能互相覆盖。

因此多 Agent 能否有效，取决于任务拆分、资源隔离和结果合并机制。

### 2. Workflow：让程序负责协调多个 Agent

前面提到的 PTC 可以编排工具，Workflow 则更进一步，可以编排子 Agent。

例如：

```text
主 Agent
    ↓
创建三个研究任务
    ↓
并行启动三个子 Agent
    ↓
等待三个结果
    ↓
程序检查结果是否齐全
    ↓
交给模型做综合判断
```

官方 `packages/workflow/` 已经包含通过程序脚本扇出子任务的能力，并复用 PTC 执行运行时。<span class="article-citation"><button type="button" class="article-citation-label" aria-expanded="false" aria-controls="article-source-16" aria-label="查看引用来源：GitHub"><span class="article-citation-name">GitHub</span></button><span class="article-citation-popup" id="article-source-16"><a href="https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/workflow/README.md" target="_blank" rel="noopener">Workflow README</a></span></span>

这两层结合起来其实很有潜力：

**模型负责复杂决策，程序负责可靠编排，子 Agent 负责独立执行。**

如果以后你想做自动化软件研究、SEO 调研、代码检查，完全可以设计这样一套混合工作流。

### 3. Scheduler：Agent 可以在没有新用户消息时被重新唤醒

DSH 官方演示中，有这样的例子：

> 每周五 17:00 整理项目记录，生成周报。

它会创建一个持久化的定时任务，到期后把任务内容投递给相关会话。<span class="article-citation"><button type="button" class="article-citation-label" aria-expanded="false" aria-controls="article-source-17" aria-label="查看引用来源：deepseek.com"><span class="article-citation-name">deepseek.com</span></button><span class="article-citation-popup" id="article-source-17"><a href="https://www.deepseek.com/en/harness/" target="_blank" rel="noopener">DeepSeek Harness｜共探智能上限</a></span></span>

调度层支持：

- 指定时间或延迟后触发；
- 固定间隔；
- 每日、每周计划；
- Cron 表达式及指定时区。

这些定时任务的记录独立于某个会话当前是否加载在内存里。<span class="article-citation"><button type="button" class="article-citation-label" aria-expanded="false" aria-controls="article-source-18" aria-label="查看引用来源：DeepSeek Harness"><span class="article-citation-name">DeepSeek Harness</span></button><span class="article-citation-popup" id="article-source-18"><a href="https://deepseek-harness.github.io/deepseek-harness/reference/subsystems/schedule" target="_blank" rel="noopener">宿主级 Schedule</a></span></span>

但这里有个常见误解：

**有 Scheduler，不意味着安装在笔记本上的 Agent 会在关机后继续工作。**

如果执行宿主已经停止，就没有正在运行的进程替你执行任务。需要真正的 24 小时运行，通常还要考虑常开电脑、服务器、系统服务、断线恢复等部署问题。

所以 DSH 已经拥有构造自主运行 Agent 的重要基础设施，但实际自主程度仍取决于你怎么部署、授权、触发和监控它。

### 4. Creator Mode：让 Agent 给自己安装新能力

官方展示了一个挺有代表性的例子：用户说“帮我写一个番茄时钟插件”。

Agent 随后读取插件开发资料、编写前端代码、调用插件管理器安装插件，最后验证运行。官方演示记录了完整过程。<span class="article-citation"><button type="button" class="article-citation-label" aria-expanded="false" aria-controls="article-source-19" aria-label="查看引用来源：deepseek.com"><span class="article-citation-name">deepseek.com</span></button><span class="article-citation-popup" id="article-source-19"><a href="https://www.deepseek.com/en/harness/" target="_blank" rel="noopener">DeepSeek Harness｜共探智能上限</a></span></span>

这意味着系统具备某种**运行时扩展自身功能**的能力。

不过要谨慎理解“自我进化”这个词。

它并没有修改底层大模型的权重，也不代表它自动获得了新的推理能力。

它改变的是：

- 可调用工具；
- 工作流程；
- 用户界面；
- 运行时服务；
- 一部分行为规则。

这更接近软件系统的动态自我扩展，而不是生物意义上的进化。

### 5. 它能像一个人一样自己逛社交媒体吗？

从架构上看，可以在现有能力上构建。

但“能接入网页工具”和“像真人一样长期运营账号”，两者之间还有不少距离。

要实现一个能自己关注信息、阅读帖子、筛选内容、生成回复的 Agent，通常需要：

1. 网页或社交平台 API 访问能力。
2. 身份认证及必要授权。
3. 定时或事件触发机制。
4. 长期记忆和信息去重。
5. 决定何时回复、何时保持沉默的策略。
6. 对外发送内容的审批与审计。
7. 账号异常、工具失败、内容冲突后的恢复机制。

DSH 已经提供其中不少底层能力，但不能据此认定这些完整应用全部开箱即用。

它目前更像一个允许你构建这些能力的通用运行平台。

而“大肥鱼”式人格化玩法，重点往往是**持续身份、社交渠道、主动行为和人格表达**；DSH 目前最突出的工程特色，则是**运行时可组合、动态插件和完整执行基础设施**。

两条路线可以结合，但关注点不同。

## 八、安全与隐私：有几件事比功能更值得提前知道

研究到这里，我发现了几项容易被“开源”“本地运行”“沙箱保护”这些词掩盖的细节。

### 1. 官方自己明确说：这是尚未完成安全审计的实验软件

DeepSeek 仓库中的安全声明很直接：

> 它是实验性的开发者预览软件，尚未接受安全审计，不应视为可用于生产环境的安全软件。

这不是我对它安全性的主观猜测，而是项目官方写明的当前状态。<span class="article-citation"><button type="button" class="article-citation-label" aria-expanded="false" aria-controls="article-source-20" aria-label="查看引用来源：GitHub"><span class="article-citation-name">GitHub</span></button><span class="article-citation-popup" id="article-source-20"><a href="https://github.com/deepseek-ai/deepseek-harness/blob/master/SAFETY.zh.md" target="_blank" rel="noopener">安全声明</a></span></span>

为什么？

因为 Harness 可以运行模型生成的代码、装载插件、读写本地文件、接触网络和凭据。

假如模型判断错误，或者某个网页里埋入恶意指令，后果可能不仅是答错一句话。

### 2. 沙箱具体限制了什么？

DSH 提供三种主要的文件系统权限模式：

| 模式 | 设计目标 | 需要注意 |
|--------|--------|--------|
| `read-only` | 限制写入 | 不代表不能读取敏感文件 |
| `workspace-write` | 允许修改工作区及特定临时目录 | 不自动禁止网络访问 |
| `danger-full-access` | 不施加这层文件系统沙箱 | 可能访问执行账户可访问的资源 |

这些模式针对的是**文件系统操作效果**。官方文档明确说明，网络和进程可见性不属于这组模式本身的定义范围。

不同平台使用不同实现：

- Linux：Bubblewrap / Landlock。
- macOS：Seatbelt。
- Windows：ACL 和受限令牌。

而且有的后端只提供 `partial`（部分强制执行），并不保证每种限制都完整实现。<span class="article-citation"><button type="button" class="article-citation-label" aria-expanded="false" aria-controls="article-source-21" aria-label="查看引用来源：DeepSeek Harness"><span class="article-citation-name">DeepSeek Harness</span></button><span class="article-citation-popup" id="article-source-21"><a href="https://deepseek-harness.github.io/deepseek-harness/reference/subsystems/sandbox" target="_blank" rel="noopener">进程沙箱</a></span></span>

这里有个尤其值得注意的细节：

**标准 Web 配置的新会话默认倾向 `workspace-write`，但独立的 Python `sdk-minimal` 预设使用 `danger-full-access`，并不挂载同样的审批服务。** <span class="article-citation"><button type="button" class="article-citation-label" aria-expanded="false" aria-controls="article-source-22" aria-label="查看引用来源：GitHub"><span class="article-citation-name">GitHub</span><small class="article-citation-count">+1</small></button><span class="article-citation-popup" id="article-source-22"><a href="https://github.com/deepseek-ai/deepseek-harness/blob/master/apps/cli/reference/README.md" target="_blank" rel="noopener">CLI 运行参考</a><a href="https://deepseek-harness.github.io/deepseek-harness/guide/python-sdk" target="_blank" rel="noopener">Python SDK 入门</a></span></span>

这意味着，你把一个 Python SDK 示例直接指向装有重要文件的工作目录，和在一个受限工作区里使用 Web UI，风险并不相同。

### 3. 另一个重要发现：会话日志可能随 DeepSeek 请求上传

我们前面说 DSH 的原始会话日志主要保存在本地。但这并不意味着它绝不会被传输。

根据官方 CLI 运行参考：

**基础组合默认启用了 DeepSeek 会话日志贡献功能。** 它会把尚未提交过的会话日志片段，随之后的 DeepSeek 模型请求一起发送。

这可能包含消息、工具参数、工具结果和工作目录路径等信息。

官方同时提供关闭方式：

- Web UI：**设置 → 通用 → Upload Session Log**。
- 自定义组合：将对应的 `session-log-deepseek.enabled` 设为 `false`。

这是与另一个遥测系统分开的设置。<span class="article-citation"><button type="button" class="article-citation-label" aria-expanded="false" aria-controls="article-source-23" aria-label="查看引用来源：GitHub"><span class="article-citation-name">GitHub</span></button><span class="article-citation-popup" id="article-source-23"><a href="https://github.com/deepseek-ai/deepseek-harness/blob/master/apps/cli/reference/README.md" target="_blank" rel="noopener">CLI 运行参考</a></span></span>

另一个遥测系统使用 OTel，基础配置默认为 `FEEDBACK_ONLY`：通常在用户主动提交反馈时上传相关日志，而不是普通每条对话都持续上报。它可以单独禁用。

也就是说，至少要区分：

| 数据流 | 用途 | 关键点 |
|--------|--------|--------|
| 模型请求 | 让模型理解并执行任务 | 使用云模型就需要发送相关输入 |
| DeepSeek 会话日志贡献 | 附带额外历史日志 | 官方配置默认开启，可单独关闭 |
| OTel 遥测 / 反馈 | 诊断和产品反馈 | 默认反馈触发，可单独关闭 |
| 第三方 MCP / 插件 | 使用外部服务 | 取决于插件自身行为 |

另外，DeepSeek 的 2026 年 9 月隐私政策明确提到，使用官方模型服务时会处理交互日志，也可能在所述条件下将输入输出用于训练和优化，并提供联系退出的途径；自定义模型服务则适用不同的数据处理安排。<span class="article-citation"><button type="button" class="article-citation-label" aria-expanded="false" aria-controls="article-source-24" aria-label="查看引用来源：隐私政策"><span class="article-citation-name">隐私政策</span></button><span class="article-citation-popup" id="article-source-24"><a href="https://www.deepseek.com/en/harness/privacy/" target="_blank" rel="noopener">DeepSeek Harness 隐私政策</a></span></span>

所以如果你准备接触私人文件、商业代码或凭据，应该在选择模型和使用模式时就把这些数据流理清。

### 4. 插件可能比模型生成的命令更加危险

一个插件可以在宿主程序中运行代码，并不一定要等模型主动调用工具才执行。

例如恶意插件可能在初始化时就：

- 读取环境变量；
- 扫描特定目录；
- 启动后台进程；
- 通过网络发送数据。

这属于插件供应链风险，不能只依赖模型的工具审批机制来防护。

Cordis 的插件卸载与资源清理机制能帮助管理程序生命周期，却不能保证一个不可信插件不会做坏事。

再加上网页、README、日志、搜索结果都可能包含诱导 Agent 执行危险命令的内容，所以真正的安全边界还必须覆盖外部输入和执行环境。

我的建议是：**第一次体验 DSH，最好给它一个没有重要凭据、可随时删除的独立工作区。** 如果要研究自动化或插件生成，优先使用隔离的虚拟机、容器或专门的测试账户。

这不是说 DSH 特别危险；而是它的能力范围已经大到不能再按普通聊天应用的安全假设来使用。

## 九、安装、开发与使用成本：实际玩起来麻不麻烦？

### 1. 有三种主要使用路线



{% raw %}<div class="article-resource-list"><section class="article-resource-card"><div class="article-resource-media"><img class="article-resource-image" src="/images/deepseek-harness/original-4.jpg" alt="DeepSeek Harness 桌面版實測：修 Bug、報表、排程，交付紀錄不代表做完" loading="lazy"></div><div class="article-resource-content"><strong>桌面版：最快体验产品</strong><p>官方提供 macOS Apple Silicon 和 Windows 64 位版本。可以直接使用图形界面，体验任务执行、文件工作区、模型配置、插件和轨迹查看。</p><a href="https://deepseek.com/harness/" target="_blank" rel="noopener">官方下载页面 ↗</a></div></section><section class="article-resource-card"><div class="article-resource-media"><svg class="article-resource-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"></rect><path d="m7 9 3 3-3 3m6 0h4"></path></svg><span class="article-resource-badge">CLI + Web</span></div><div class="article-resource-content"><strong>npm 版：最快研究运行机制</strong><p>安装 Node.js，运行一条命令即可启动本地 Web UI。适合查看运行日志、尝试不同工具模式和配置。</p><a href="https://github.com/deepseek-ai/deepseek-harness" target="_blank" rel="noopener">GitHub 官方仓库 ↗</a></div></section><section class="article-resource-card"><div class="article-resource-media"><svg class="article-resource-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 7-4 5 4 5m10-10 4 5-4 5M14 4l-4 16"></path></svg><span class="article-resource-badge">SDK / 插件</span></div><div class="article-resource-content"><strong>源码或 SDK：适合深入研究与二次开发</strong><p>可以修改插件组合、自己添加工具、研究 Cordis，或者从 Python 程序调用 Harness。</p><a href="https://deepseek-harness.github.io/deepseek-harness/guide/python-sdk" target="_blank" rel="noopener">Python SDK 官方教程 ↗</a></div></section></div>{% endraw %}

### 2. 最短启动命令

安装 Node.js 后：

```bash
npx @deepseek-ai/dsh web
```

默认会在浏览器打开：

```text
http://127.0.0.1:3080
```

这是官方 README 当前提供的启动方式。<span class="article-citation"><button type="button" class="article-citation-label" aria-expanded="false" aria-controls="article-source-25" aria-label="查看引用来源：GitHub"><span class="article-citation-name">GitHub</span></button><span class="article-citation-popup" id="article-source-25"><a href="https://github.com/deepseek-ai/deepseek-harness" target="_blank" rel="noopener">DeepSeek Harness GitHub 仓库</a></span></span>

想读源码、改插件，则是：

```bash
git clone https://github.com/deepseek-ai/deepseek-harness.git
cd deepseek-harness

pnpm install
pnpm run build
pnpm dsh web
```

源码开发会多一些依赖和构建时间，但并不是部署一个大规模分布式系统；它主要还是 Node.js / TypeScript 应用及其相关原生组件。

### 3. 它一定要用 DeepSeek 模型吗？

不用。

模型提供方同样是可替换的。官方设置页面支持：

- DeepSeek 官方模型及 API 凭据；
- Anthropic、OpenAI、Moonshot/Kimi、智谱等已提供适配的供应商；
- 自定义 API 网关；
- 兼容 OpenAI Chat Completions、OpenAI Responses、Anthropic Messages 的接口。

用户可以根据模型能力选择不同推理档位和输入模态。<span class="article-citation"><button type="button" class="article-citation-label" aria-expanded="false" aria-controls="article-source-26" aria-label="查看引用来源：DeepSeek Harness"><span class="article-citation-name">DeepSeek Harness</span></button><span class="article-citation-popup" id="article-source-26"><a href="https://deepseek-harness.github.io/deepseek-harness/guide/providers" target="_blank" rel="noopener">配置模型</a></span></span>

如果你自己有能提供兼容 API 的本地推理服务，也可以尝试把它作为自定义提供方；实际能不能顺利执行，还要看该模型和接口对工具调用等功能的支持。

这也说明一件事：**DSH 和 DeepSeek 模型之间不是强绑定关系。**

你甚至可以拿它研究“同一个 Harness，换不同模型时行为如何变化”。

### 4. 如何写第一个插件？

官方示例足够简单。

创建一个 TypeScript 文件：

```typescript
import type { Context } from "@deepseek-ai/cordis";

export const name = "hello-plugin";

export function apply(ctx: Context) {
  console.log("Hello from DSH!");
}
```

然后用一份 `cordis.yml` 声明加载位置：

```yaml
- insert:
    - id: hello
      name: "/absolute/path/to/hello-plugin.ts"
```

源码工作区中可以通过类似命令加载：

```bash
pnpm dsh web --patch ./cordis.yml
```

这只是最基础的插件；真正扩展工具还需要调用 `ctx.tools.register()` 并定义具体的工具 Schema。<span class="article-citation"><button type="button" class="article-citation-label" aria-expanded="false" aria-controls="article-source-27" aria-label="查看引用来源：DeepSeek Harness"><span class="article-citation-name">DeepSeek Harness</span></button><span class="article-citation-popup" id="article-source-27"><a href="https://deepseek-harness.github.io/deepseek-harness/develop/basic/" target="_blank" rel="noopener">第一个插件</a></span></span>

我建议先掌握这种手写形式，再去玩 Creator Mode 自动生成插件。这样更容易看懂它到底改了哪些东西。

### 5. Profiles 和 Bundles：它怎么把插件装成一款产品？

DSH 不是简单扫描一个 `plugins/` 目录，然后启动所有插件。

它通过 Profile、Bundle 和 Patch 组合出最终运行配置。

:::diagram[插件配置的覆盖顺序]
{
  "layout": "stack",
  "items": [
    {
      "title": "Bundle 层",
      "text": "官方基础能力与应用能力",
      "badge": "1",
      "surface": "fill",
      "align": "left",
      "tone": "plain"
    },
    {
      "title": "Profile Patch",
      "text": "这个运行模式的自定义配置",
      "badge": "2",
      "surface": "fill",
      "align": "left",
      "tone": "plain"
    },
    {
      "title": "Home Patch",
      "text": "这台机器的通用覆盖配置",
      "badge": "3",
      "surface": "fill",
      "align": "left",
      "tone": "plain"
    },
    {
      "title": "CLI --patch",
      "text": "这次启动的临时覆盖配置",
      "badge": "4",
      "tone": "plain",
      "surface": "fill",
      "align": "left"
    }
  ],
  "arrows": true,
  "note": "越靠后的层优先级越高",
  "showTitle": false,
  "variant": "panel",
  "surface": "outline",
  "align": "center"
}
:::

官方提供 `web`、`headless`、`sdk`、`sdk-minimal`、`acp` 等 Profile。桌面版还有自己的专用组合。<span class="article-citation"><button type="button" class="article-citation-label" aria-expanded="false" aria-controls="article-source-28" aria-label="查看引用来源：GitHub"><span class="article-citation-name">GitHub</span></button><span class="article-citation-popup" id="article-source-28"><a href="https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md" target="_blank" rel="noopener">DeepSeek Harness Architecture</a></span></span>

可以通过：

```bash
dsh --profile web --dump-config
```

查看实际组合出来的插件配置树。

这条命令非常值得记住，它相当于直接查看 DSH 这台机器目前是怎么组装起来的。

还有个容易踩的坑：Patch 覆盖某个配置条目时，可能替换其完整配置，而不是像 JavaScript 对象那样逐字段深度合并。自定义时要保留其他需要的字段。

### 6. 费用到底怎么算？

首先，DSH 源码采用 MIT 开源许可，不等于它调用的模型和外部服务都免费。

如果用 DeepSeek API，实际按模型的输入、输出、缓存命中等情况计费。

**DeepSeek 官方 API 价格 · 截至 2026 年 10 月 29 日**

以下均为人民币，每 100 万 tokens

| 计费项目 | V4.1 Flash 空闲 / 高峰 | V4 Pro 空闲 / 高峰 |
| --- | --- | --- |
| 输入，缓存命中 | ¥0.02 / ¥0.04 | ¥0.15 / ¥0.30 |
| 输入，缓存未命中 | ¥1 / ¥2 | ¥4.5 / ¥9 |
| 输出 | ¥4 / ¥8 | ¥13.5 / ¥27 |

<span class="article-citation"><button type="button" class="article-citation-label" aria-expanded="false" aria-controls="article-source-29" aria-label="查看引用来源：DeepSeek API Docs"><span class="article-citation-name">DeepSeek API Docs</span></button><span class="article-citation-popup" id="article-source-29"><a href="https://api-docs.deepseek.com/zh-cn/quick_start/pricing/" target="_blank" rel="noopener">模型 &amp; 价格</a></span></span>

这里有几件容易产生误解的地方：

**第一，缓存命中价非常便宜，但不是所有输入都会命中缓存。** 工具配置变动、上下文变化、不同调用路径都可能影响缓存复用。

**第二，Agent 完成一个任务可能连续调用模型多次。** 如果还有子 Agent、反复测试、失败重试和摘要压缩，实际调用量会继续增加。

**第三，PTC 通常有机会减少中间结果的 token 消耗，但也需要模型生成代码。** 不能简单把它理解成固定节省多少百分比。

**第四，网页搜索和抓取可能另外计费。** 官方价格页写明 Search 和 Fetch 每 1,000 次成功请求分别为 ¥5。通过 DSH 等 Agent 使用 DeepSeek API 的相关服务端工具调用，计划从 **2026 年 11 月 1 日** 开始按次收费；截至原文写作时尚未到这个日期。<span class="article-citation"><button type="button" class="article-citation-label" aria-expanded="false" aria-controls="article-source-30" aria-label="查看引用来源：DeepSeek API Docs"><span class="article-citation-name">DeepSeek API Docs</span></button><span class="article-citation-popup" id="article-source-30"><a href="https://api-docs.deepseek.com/zh-cn/quick_start/pricing/" target="_blank" rel="noopener">模型 &amp; 价格</a></span></span>

顺便一提，目前 API 中 `deepseek-flash` 对应的是 DeepSeek-V4.1-Flash-1017，而 `deepseek-v4-pro` 仍列为可调用模型。前者支持图像输入，后者当前不支持。旧的 V4 Flash 模型名被兼容路由到新版 Flash。<span class="article-citation"><button type="button" class="article-citation-label" aria-expanded="false" aria-controls="article-source-31" aria-label="查看引用来源：DeepSeek API Docs"><span class="article-citation-name">DeepSeek API Docs</span></button><span class="article-citation-popup" id="article-source-31"><a href="https://api-docs.deepseek.com/zh-cn/quick_start/pricing/" target="_blank" rel="noopener">模型 &amp; 价格</a></span></span>

因此真正的成本公式更接近：

$$
C_{\text{任务}} =
C_{\text{模型调用}} +
C_{\text{外部工具}} +
C_{\text{运行环境}} +
C_{\text{重试与验证}}
$$

对于小规模个人任务，通常无需昂贵硬件；如果使用云端 API，本机主要承担 Harness、工具和界面的运行工作。

真正需要观察的是任务的 token 用量、模型调用次数，以及它有没有因为循环尝试而浪费大量调用。

## 十、它跟 OpenClaw、Codex、Claude Code 到底有什么不同？

这几个系统有很多重合能力，但产品出发点不同。

| | DeepSeek Harness | OpenClaw | Codex | Claude Code |
| --- | --- | --- | --- | --- |
| 核心定位 | 可重组的 Agent 运行平台 | 长期在线的个人 AI 助手 | 软件开发 Agent | 软件开发 Agent |
| 主要入口 | 桌面、Web、CLI、SDK | 通讯平台、Gateway、客户端 | CLI、应用、SDK | CLI、IDE 等 |
| 典型场景 | 自定义 Agent、插件、工作流、通用任务 | 消息收发、日常助理、主动任务 | 代码理解、开发、测试、PR | 代码开发、分析、自动化 |
| 扩展重点 | Cordis 插件、运行时服务替换 | Skills、渠道、工具和 Gateway | 工具、扩展、自动化和平台接口 | Skills、Hooks、Subagents、MCP |
| 最有代表性的特色 | Agent Loop 本身也是可替换插件 | 多平台消息接入与持续运行 | 深度软件开发工作流 | 编程工具链与指令控制体系 |

以上是架构与产品重点的对照，不能当作任务完成率排名。OpenClaw、Codex 和 Claude Code 也都有相当丰富的扩展机制。<span class="article-citation"><button type="button" class="article-citation-label" aria-expanded="false" aria-controls="article-source-32" aria-label="查看引用来源：OpenClaw"><span class="article-citation-name">OpenClaw</span><small class="article-citation-count">+2</small></button><span class="article-citation-popup" id="article-source-32"><a href="https://docs.openclaw.ai/help/faq/what-is-openclaw" target="_blank" rel="noopener">What is OpenClaw?</a><a href="https://developers.openai.com/blog/codex-as-a-platform" target="_blank" rel="noopener">Codex as a platform: build on the open agent harness</a><a href="https://claude.com/resources/articles/steering-claude-code-skills-hooks-rules-subagents-and-more" target="_blank" rel="noopener">Steering Claude Code: when to use CLAUDE.md, skills, hooks, and subagents</a></span></span>

### DSH vs OpenClaw

这两个是最容易被放在一起讨论的。

OpenClaw 有成熟得多的通讯渠道体系，包括 Telegram、WhatsApp、Slack、Discord 等，并围绕 Gateway、个人助理、记忆和自动化持续发展。

DSH 更着重让开发者重组 Agent 的运行机制。

举个例子：

你想让 AI 每天在 Telegram 上向你汇报科技新闻，偶尔主动发消息，还能记住你上个月说过的偏好。

OpenClaw 的产品路线更贴近这个目标。

而如果你想研究：

> 能否动态替换 Agent Loop，增加一个自定义审批模块，再把 Shell 服务切换到另一台电脑，并让模型自动编写一个插件？

DSH 的架构设计更贴近这个目标。

当然，也可以给 DSH 加入通讯渠道，把它做成个人助理。只是从现阶段看，这通常意味着更多集成和工程工作。

### DSH vs Codex / Claude Code

这两者都已经拥有成熟的编程 Agent 运行机制，也都支持多种形式的扩展。

需要澄清的是，开源 Agent Harness 并不是 DSH 独有的卖点。Codex 本身也有开放的 Agent Harness 和平台接口。<span class="article-citation"><button type="button" class="article-citation-label" aria-expanded="false" aria-controls="article-source-33" aria-label="查看引用来源：OpenAI Developers"><span class="article-citation-name">OpenAI Developers</span></button><span class="article-citation-popup" id="article-source-33"><a href="https://developers.openai.com/blog/codex-as-a-platform" target="_blank" rel="noopener">Codex as a platform: build on the open agent harness</a></span></span>

DSH 更特别的是：

**它从底层就把模型适配器、工具、会话、Agent Loop 和界面看作可以参与动态组合的插件。**

所以我会这样理解：

- 如果目标是尽快完成软件开发任务，优先考察工具实际表现、模型能力与自己的工作流契合度。
- 如果目标是研究和改造 Agent 的运行系统，DSH 的源码与 Cordis 值得优先研究。
- 如果目标是做长期在线、接入各种通讯软件的私人 AI，OpenClaw 的现有生态更直接。

目前我没有找到足够严谨的同模型、同任务、同预算的独立对照实验，来支持“DSH 比 Codex 或 Claude Code 更强”这类笼统结论。

---

## 十一、从工程角度看，DSH 解决了什么，又制造了什么问题？

到这一步，我们可以把视角再抬高一点。

### 1. Agent 的能力不完全由模型决定

把系统在某一时刻的状态定义为：

$$
S_t=(L_t,W_t,P_t,R_t)
$$

其中：

- $L_t$：会话日志；
- $W_t$：工作区和外部环境；
- $P_t$：当前加载的插件与服务；
- $R_t$：权限与执行策略。

模型基于状态投影决定动作：

$$
a_t=M(\operatorname{Prompt}(S_t))
$$

Harness 执行动作，并得到新状态：

$$
S_{t+1}=H(S_t,a_t)
$$

这套表达式虽然简化，但能说明一件事：

**换掉 Harness，就改变了模型能看到的信息、能执行的动作，以及执行后获得的反馈。**

所以，同一个模型在不同 Agent 系统中的表现可能不同。

模型本身没有学会新的知识，但执行系统可以通过搜索、验证、调用程序、委托子任务，使它完成原本仅靠文本生成无法完成的工作。

DeepSeek 官方事实上已经把 DSH 的极简模式用于部分 Code Agent 基准评测。2026 年 7—8 月的模型发布文档注明了相关评测所使用的 Harness、推理档位及其他设置。<span class="article-citation"><button type="button" class="article-citation-label" aria-expanded="false" aria-controls="article-source-34" aria-label="查看引用来源：DeepSeek API Docs"><span class="article-citation-name">DeepSeek API Docs</span><small class="article-citation-count">+1</small></button><span class="article-citation-popup" id="article-source-34"><a href="https://api-docs.deepseek.com/zh-cn/updates/" target="_blank" rel="noopener">更新日志</a><a href="https://api-docs.deepseek.com/zh-cn/news/news260813/" target="_blank" rel="noopener">DeepSeek-V4-Pro 正式版上线</a></span></span>

这说明 Harness 已经是模型评估条件的一部分。

但要注意，这些是模型在特定 Harness 配置下的成绩，不能直接拿来证明 Harness 本身相对其他系统更优秀。

### 2. “一切皆插件”的代价是复杂性

把几乎所有模块都做成插件，灵活性当然很强。

但问题也来了：

**系统行为不再仅由源码决定，还由当前到底装了哪些插件、使用什么配置、依赖关系处于什么状态决定。**

举个例子。

Agent 的模型请求突然出现了两个额外工具。

要找出原因，你可能需要追踪：

- 哪个 Bundle 注入了工具注册插件；
- 哪个 Profile 加载了 Bundle；
- 有没有用户层 Patch 改动配置；
- 哪个插件动态注册了工具；
- 有没有作用域隔离影响该 Agent；
- 本次 Step 是否允许这些工具进入模型 Schema。

这比一个固定、封闭的运行系统更难理解和调试。

DSH 提供配置转储、运行轨迹和日志来缓解这些问题，但系统复杂性不会凭空消失。

### 3. 动态加载工具还涉及模型的上下文成本

假设你给 Agent 安装了 200 个工具。

即使这些工具本身几乎不运行，只要把所有工具的详细 Schema 放进模型上下文，就会增加请求长度。

这可能带来：

- Token 成本增加；
- 模型选择工具时更容易混淆；
- 上下文缓存受到影响；
- 模型请求延迟增加。

因此成熟的 Agent 平台不能只考虑“怎么注册新工具”，还要考虑**什么工具应该在什么时候向模型暴露**。

这与传统程序的插件管理不同。

传统程序添加一百个函数，不一定影响程序运行时的每一步决策；Agent 增加一百个可选工具，却可能影响模型的推理质量。

### 4. PTC 同时优化了成本，也改变了可观察性

PTC 可以让程序聚合大量工具结果，降低模型上下文消耗。

但原本由模型直接查看的中间结果，现在被转移到执行代码里。

于是你需要另外解决：

- 如何发现过滤代码写错；
- 如何记录程序内部的中间工具执行；
- 如何定位一组并行调用中的失败；
- 如何控制一次 `run_code` 的资源消耗；
- 如何处理部分成功、部分失败的情况。

这说明一个更广泛的规律：

**优化 Agent 系统时，经常是在延迟、成本、可靠性和可观察性之间做权衡。**

PTC 可能降低 token 消耗，但不自动提升所有任务的正确率。

### 5. 自动生成插件是能力扩展，也可能是权限升级

假设用户原本只允许 Agent 读取文件。

Agent 后来给自己生成了一个可以联网、可以执行命令的新插件。

如果系统不检查新插件的权限，等于通过“添加能力”绕过了原来的安全假设。

因此，未来真正成熟的插件式 Agent，应该为能力增加明确的权限约束。

例如：

- 哪些插件允许加载；
- 插件可以访问哪些资源；
- 插件由谁批准；
- 子 Agent 能否继承父 Agent 的权限；
- 动态插件有没有权限创建新的执行器；
- 关键操作是否具备独立于模型的审批机制。

这些问题不会因为 Cordis 提供自动生命周期管理就自动得到解决。

### 6. 多 Agent 的难点在共享状态，而不是多开几个模型

三个 Agent 并行搜索资料，通常容易协调。

三个 Agent 并行修改同一个代码仓库，就复杂得多。

如果它们分别做出不同假设，甚至修改同一个文件，那么需要：

- 独立工作目录或 Git Worktree；
- 明确的任务边界；
- 结果冲突检测；
- 合并策略；
- 验证和回滚。

所以多 Agent 真正需要的是某种并发控制与任务协调机制。

这也是我觉得 DSH 的工作流、作用域、事件日志和子 Agent 结合起来很值得研究的原因。

它们实际上在逐步构建一套能够管理自主执行程序的基础设施。

---

## 十二、如果亲自研究，我最建议做的三个实验

与其一下子搭一个复杂的长期在线 AI，不如用三个小实验把核心机制摸透。

:::diagram[三个研究实验]
{
  "layout": "stack",
  "items": [
    {
      "title": "实验 A：Git 仓库巡检",
      "badge": "入门",
      "surface": "outline",
      "tone": "plain",
      "richText": "让 DSH 检查一组测试仓库，报告每个仓库的工作区状态、本地和远端分支关系，以及可能需要同步的项目。\n\n**重点观察：**它如何选择工具、调用多少次模型、如何解释 Git 输出、如何生成最终报告。\n\n第一次只读检查，不自动 pull、reset 或 push。"
    },
    {
      "title": "实验 B：编写一个自己的工具插件",
      "badge": "进阶",
      "surface": "outline",
      "tone": "plain",
      "richText": "自己提供一个 `list_git_repositories` 工具，让它直接以结构化 JSON 返回所有仓库的状态，而不需要模型逐个运行 Git 命令。\n\n**重点观察：**插件加载、`ctx.tools` 注册、服务依赖、动态卸载，以及工具接口如何改变模型工作流程。"
    },
    {
      "title": "实验 C：Native vs PTC 对照",
      "badge": "深入",
      "surface": "outline",
      "tone": "plain",
      "richText": "对同一组任务，分别使用普通工具模式和 PTC 模式，保持模型、工作区、任务输入尽可能一致。\n\n**重点记录：**成功率、模型调用次数、工具调用次数、总 token、真实费用、总耗时以及失败原因。"
    }
  ],
  "showTitle": false,
  "variant": "panel",
  "surface": "none"
}
:::

这三个实验的价值不只是学会 DSH。

你会真正理解现代 Coding Agent 的一些核心设计取舍：

- 为什么工具 Schema 会影响模型表现；
- 为什么 Agent 需要一个可靠的执行循环；
- 为什么保存完整执行轨迹很重要；
- 为什么提示词与代码的边界需要精心设计；
- 为什么插件化系统需要严格的依赖和生命周期管理。

做完之后，再去研究 OpenClaw、Codex 或自己设计 Agent，思路会清晰很多。

---

## 十三、我的总体判断

我把它分成三个角度。

:::diagram[三个角度的判断]
{
  "layout": "stack",
  "items": [
    {
      "title": "作为技术研究对象：很值得",
      "text": "Cordis 的时空可组合性、Agent Loop 的事件机制、会话事件溯源、PTC 编排，以及插件动态重组，都有实质性的工程内容。深入读源码能学到不少东西。",
      "tone": "plain",
      "surface": "none",
      "icon": "brain"
    },
    {
      "title": "作为现成生产力工具：值得试，但不必立刻替换已有工具",
      "text": "它目前仍是预览版，安全、兼容性与插件生态存在不确定性。先拿测试项目评估真实任务表现，再决定是否用于长期工作。",
      "surface": "none",
      "tone": "plain",
      "icon": "laptop"
    },
    {
      "title": "作为人格化自主 Agent 的基础：潜力很大，但还需要产品层建设",
      "text": "想让它长期在线、拥有稳定人格、能管理社交账号并主动开展任务，还需要补充记忆、身份、渠道、触发策略和严格权限管理。OpenClaw 目前更贴近这类开箱即用的体验。",
      "surface": "none",
      "tone": "plain",
      "icon": "bot"
    }
  ],
  "showTitle": false,
  "variant": "list",
  "surface": "none"
}
:::

我最感兴趣的其实是它所代表的技术方向。

以前讨论大模型能力，大家主要关注模型参数量、训练方法、推理能力、上下文窗口。

现在 Agent 发展起来以后，另一个变量越来越重要：

**模型之外，整个能够观察世界、调用工具、执行代码、保存历史、并持续运行的系统，究竟该怎样设计？**

DeepSeek Harness 提供了一种非常激进的答案：尽可能把整个运行系统都做成可组合的插件。

它的优势是开放、灵活、可研究、可替换；代价是工程复杂度、配置管理难度和安全边界问题。

这条路线最终是不是 Agent 平台的最佳架构，目前还不能下结论。但它已经是一个相当完整、值得认真研究的实现。

### 深入阅读的资料

我建议按以下顺序阅读，而不用一开始就钻进庞大的源码目录：

1. [DeepSeek Harness GitHub 仓库](https://github.com/deepseek-ai/deepseek-harness)：先看 README、架构与整体组织。
2. [官方开发者文档](https://deepseek-harness.github.io/deepseek-harness/)：研究 Agent 生命周期、Session、Tool、PTC、Sandbox。
3. [Cordis 论文：A Programming Paradigm for Spatiotemporal Composability](https://arxiv.org/abs/2608.25512)：理解动态插件组合背后的理论。
4. [第一个 Cordis 插件教程](https://deepseek-harness.github.io/deepseek-harness/develop/basic/)：从最小的 `apply(ctx)` 入手实际动手。
5. [DeepSeek Harness Architecture](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md)：带着源码看 Bundle、Agent Loop、事件和服务边界。

如果只记住一条主线，我建议是：

**先看 Cordis 怎样组装 Agent，再看 Agent Loop 怎样驱动模型，最后看 Session 怎样记录一切。**

理解了这三件事，DSH 绝大部分设计就能串起来了。
