# 作为一名深耕技术领域多年的老程序员，你一定能敏锐地感受到AI技术正在重塑整个软件开发行业。从2022年的Prompt Engineering到2024年的Context Engineering，再到2026年OpenAI正式提出的\*\*Harness Engineering（驾驭工程）\*\*，AI工程化的演进速度

作为一名深耕技术领域多年的老程序员，你一定能敏锐地感受到 AI 技术正在重塑整个软件开发行业。从 2022 年的 Prompt Engineering 到 2024 年的 Context Engineering，再到 2026 年 OpenAI 正式提出的**Harness Engineering（驾驭工程）**，AI 工程化的演进速度超出了所有人的预期。这种全新的工程范式不仅重新定义了软件工程师的角色，更为我们这些拥有丰富经验的开发者带来了前所未有的机遇 —— 将数十年积累的架构设计能力、系统抽象思维和代码质量直觉，转化为驾驭 AI 智能体的核心竞争力[(165)](http://m.toutiao.com/group/7618788413872914995/?upstream_biz=doubao)。

## 一、Harness Engineering 的技术内涵与架构解析

### 1.1 概念溯源与定义演进

Harness Engineering 的概念最早由 OpenAI 在 2025 年底至 2026 年初正式提出并推广。OpenAI 官方将其定义为："**人类掌舵，AI 执行**"（Humans steer. Agents execute）的新学科，其中 Harness 是围绕智能体的工具、文档、架构约束和反馈循环的组合[(1)](https://www.eqengineered.com/insights/https/harness-engineering-and-continuous-ai-key-takeaways)。这一定义标志着软件工程领域的根本性转变 —— 人类工程师的工作重心从 "手动编写代码" 转向 "设计环境、明确意图，并构建自动化反馈循环与约束系统"。

从技术演进的角度看，Harness Engineering 代表了 AI 工程化的第三个阶段。\*\* 第一阶段 Prompt Engineering（2022-2023 年）\*\* 主要关注单次 LLM 调用的输入质量优化；\*\* 第二阶段 Context Engineering（2024-2025 年）**由 Anthropic 在 2025 年 9 月正式定义，关注信息层和会话层的上下文管理；而**第三阶段 Harness Engineering（2026 年）\*\* 则上升到系统层和生命周期层，构建模型之外的完整运行系统[(142)](https://www.iesdouyin.com/share/note/7619991841211851456/?region=&mid=7619294467664808740&u_code=0&did=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ&iid=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ&with_sec_did=1&video_share_track_ver=&titleType=title&schema_type=37&share_sign=fTC61eVrzozmTeZG_7EvTXJ_OISM1pXlJwPSRsKUbnE-&share_version=280700&ts=1774233276&from_aid=1128&from_ssr=1&share_track_info=%7B%22link_description_type%22%3A%22%22%7D)。这种演进呈现出明显的包含关系：**Prompt ⊂ Context ⊂ Harness**[(142)](https://www.iesdouyin.com/share/note/7619991841211851456/?region=&mid=7619294467664808740&u_code=0&did=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ&iid=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ&with_sec_did=1&video_share_track_ver=&titleType=title&schema_type=37&share_sign=fTC61eVrzozmTeZG_7EvTXJ_OISM1pXlJwPSRsKUbnE-&share_version=280700&ts=1774233276&from_aid=1128&from_ssr=1&share_track_info=%7B%22link_description_type%22%3A%22%22%7D)。

在 AI 语境下，Harness Engineer 被定义为能够系统性地驾驭 AI 模型和 Agent 系统，使其在复杂、长周期任务中稳定产出高质量结果的工程角色。这个角色要求工程师具备从单次推理的输入质量到多轮推理的全局上下文状态管理能力，工作对象从简单的文本指令扩展到系统指令、工具定义、消息历史、外部数据等复杂要素。

### 1.2 核心工作原理与技术机制

Harness Engineering 的核心原理可以用 OpenAI 官方提供的形象比喻来理解：将 AI 模型比作 "马"，Harness 比作 "马具 / 缰绳"，人类工程师比作 "骑手"。\*\* 马（Horse）\*\* 代表 AI 模型（如 Codex 等），速度极快、算力强大，但如果没有引导会四处乱跑（生成不符合规范的代码）；\*\* 马具 / 缰绳（Harness）\*\* 代表基础设施，包括代码检查工具（Linters）、自动化测试、架构约束、系统沙盒和反馈循环，将 AI 的力量限制在安全轨道内；\*\* 骑手（Rider）\*\* 代表人类工程师，不再亲自下场跑步（手写代码），而是提供方向、设定意图，并设计好这套 "马具" 来管理 AI。

从技术机制上看，Harness Engineering 包含四个核心要素：

**Agent 驱动执行（Agent-Driven Execution）**：人类仅通过声明式的 Prompt 描述任务，AI 智能体会直接使用开发工具（如 CLI 工具、脚本），自己拉取上下文，自己本地测试，自己提交 PR（Pull Request），并在通过所有机器和 Agent 审核前进行内部循环迭代。

**架构约束的机械化执行（Mechanically Enforced Constraints）**：AI 不能随心所欲地写代码，Harness 会将架构文档、依赖关系层级和格式规范转化为代码检查工具（Linters）和结构化测试。如果 AI 越界，系统会在物理层面进行拦截。

**将 "计划" 作为一等公民（Plans as First-class Artifacts）**：对于复杂的任务，AI 解决问题的 "执行计划"、决策日志和进度都会像源代码一样被提交到代码仓库中进行版本控制，使得不同的 AI 智能体在交接工作时不需要依赖外部上下文或人类记忆。

**渐进式的上下文展现（Progressive Disclosure）**：Harness 不会在一开始就把所有的系统背景塞给 AI，而是提供一个稳定、小巧的入口点，然后 "教"AI 根据当前任务按需检索和拉取更多的上下文。

### 1.3 技术架构与关键组件

根据 GitHub 上的 Harness Anatomy 文档，一个完整的 Harness 系统采用严格的分层架构设计：

| 层级                                 | 主要职责                                     | 薄弱时的典型故障             |
| ------------------------------------ | -------------------------------------------- | ---------------------------- |
| 执行内核（Execution kernel）         | 提供运行时环境、工具执行、权限管理、传输机制 | 不安全或不一致的执行         |
| 上下文引擎（Context engine）         | 检索、提示词组装、压缩、内存加载             | 噪音大、速度慢或决策信息不足 |
| 会话 / 状态层（Session/state layer） | 规范对话记录、工件、作业、检查点、提供器状态 | 脆弱的连续性和弱恢复能力     |
| 编排层（Orchestration layer）        | 路由、委托、验证、升级、修复                 | 浪费 token 或工作负载过重    |
| 操作界面（Operator surface）         | 可见性、检查、进度、恢复 UX                  | 低信任度和差的可委托性       |

每个层级都有明确的职责边界，当这些边界崩溃时，系统复杂性会迅速上升。支撑这些核心层级的是第二环支持系统，包括项目指令、工具和 MCP、询问用户协议、Git 和工作树、内存和技能、钩子和简报、验证器、后台工作者、资源调度器、成本预算、API 弹性、结果增强、基准测试等。

一个成熟的工业级 Agent Harness 通常包含四个核心模块[(21)](http://m.toutiao.com/group/7620079278742454818/?upstream_biz=doubao)：\*\* 隔离沙盒（The Execution Sandbox）\*\* 提供安全隔离的执行环境；\*\* 工具与环境感知层（Tooling & Perception）\*\* 负责工具调用和环境信息收集；\*\* 自动化裁判系统（The Evaluator / Metrics Engine）\*\* 实时评估执行结果；\*\* 闭环路由与状态机（Feedback Routing）\*\* 实现自动化反馈和状态流转。

从更宏观的视角看，Harness 系统还包含三大支撑协议[(176)](https://blog.csdn.net/m0_74382565/article/details/159280492)：**A2A - Agent-to-Agent 多 Agent 跨域协作层**（由 Google 开发）负责多智能体间的协调；**MCP - Model Context Protocol 工具 / 资源集成层**（由 Anthropic 开发）提供标准化的工具调用接口；以及核心的**运行时编排层**，作为核心推理循环的包装层，协调工具执行、上下文管理、安全执行和会话持久化[(116)](http://news.qq.com/rain/a/20260322A02XZ900)。

## 二、Harness Engineering 成为 AI 趋势的深层驱动力

### 2.1 技术驱动：大模型时代的复杂性挑战

Harness Engineering 在 2026 年 2 月集中爆发并非偶然，其背后存在深刻的技术驱动因素。首先是**量化证据的积累达到了引爆点**，OpenAI 等公司的成功实践为这一概念提供了强有力的实证支撑；其次是**OpenAI 提供了完整的工程范本**，其内部实验报告详细展示了如何通过 Harness 系统实现零手写代码的百万行软件交付；第三是当模型不再是差异化的核心变量时，竞争焦点自然转移到模型之外的系统设计 —— 也就是 Harness。

大模型时代带来的复杂性挑战主要体现在四个方面：**模型能力与环境完备性的矛盾**—— 模型已经强大到能规划、调用工具、跨多轮执行，但环境一旦欠定义就会卡住，OpenAI 明确指出问题不是 Codex 不会，而是环境不够完备；**上下文窗口的稀缺性**—— 上下文是有限资源，长时任务会跨多个 context window，需要精心设计的上下文管理策略；**工具调用的成本与复杂性**—— 工具一多，成本、延迟和错误率都会放大，需要有效的工具编排和资源管理机制。

更深层的技术挑战还包括 \*\*"复合错误率" 问题 \*\*—— 多步骤任务中每个环节的微小误差会累积放大，导致最终结果不可靠；**成本与效率的矛盾**—— 复杂 Agent 系统的开发维护成本高昂，包括框架部署、工具集成、数据标注等环节，而边缘设备部署时的算力限制又会降低运行效率，形成 "能力 - 成本" 的两难困境[(50)](https://blog.csdn.net/Everly_/article/details/152120219)。

AI Agent 在实际运行中面临的技术瓶颈进一步凸显了 Harness Engineering 的必要性[(54)](http://m.toutiao.com/group/7617700855042621994/?upstream_biz=doubao)。当前用户反馈的 "头重脚轻" 体验，根源在于 AI Agent 执行反馈闭环的断裂。这类产品虽具备强大的长链条推理和指令理解能力，却难以在执行过程中实时感知操作错误，更无法自主回溯、修正步骤，导致实际使用中频繁需要人工干预，与 "全自动化" 的产品预期形成落差。执行环节的反馈缺失，让 AI Agent 的能力停留在 "能想不会做" 的阶段，也成为其从实验室技术走向实用工具的核心技术痛点[(54)](http://m.toutiao.com/group/7617700855042621994/?upstream_biz=doubao)。

### 2.2 需求驱动：企业 AI 从实验到生产的质量跃迁

企业级 AI 应用需求的根本性转变是推动 Harness Engineering 成为趋势的关键因素。根据最新研究，企业 AI 已经从 2023-2024 年的 "实验时代" 正式进入 2026 年的 \*\*"问责阶段"（Accountability Phase）\*\*。在这个新阶段，组织不再问是否应该采用 AI，而是如何使其在规模上可靠工作，成功的主要指标从 "能力"（模型能做什么）转向 "可靠性"（如何始终如一地无错误执行）。

**生产级可靠性要求**成为企业 AI 部署的硬性标准。AI 系统必须满足与传统企业软件相同的可靠性标准 ——99.9% 的正常运行时间、灾难恢复计划和全面监控，当 AI 控制关键业务流程时，失败不再是可选项[(56)](https://img1.wsimg.com/blobby/go/2cacb495-d600-4bbd-8a3b-92b67e476ea7/downloads/f0d642fb-9407-410b-8936-cfb89f4bfe48/Enterprise-AI-Enters-the-Accountability-Phase-.pdf)。这种严格的可靠性要求推动了 "工业级 AI" 概念的兴起，包括不确定性量化、语义遥测和神经符号验证等技术，以防止在高风险环境中出现幻觉。

**经济问责制**的确立标志着 "为 AI 而 AI" 时代的终结。每个 AI 投资都必须通过具体指标证明清晰的投资回报率，取而代之的是严格的成本效益分析和与人类基线的性能基准测试。这种经济压力迫使企业必须确保 AI 系统的可预测性和可控性，而 Harness Engineering 提供的标准化环境和可观测性恰好满足了这一需求。

**合规性要求的日益严格**进一步推动了 Harness Engineering 的采用。欧盟 AI 法案的大部分规则于 2026 年 8 月 2 日生效，包括对高风险 AI 系统的应用和透明度要求[(61)](https://www.gigaspaces.com/blog/enterprise-ai-trends)。这些法规要求 AI 系统必须具备可审计性、可追溯性和明确的决策逻辑，而 Harness Engineering 通过提供完整的执行日志、决策轨迹和验证机制，为企业满足合规要求提供了技术基础。

企业 AI 成熟度模型的演进也印证了这一趋势。当企业的 AI 系统从 "实验室 Demo" 走进 "生产车间"，可靠性就从 "加分项" 变成了 "生命线"—— 它决定了 AI 能否真正为业务创造价值，而非沦为 "花瓶"[(64)](https://blog.csdn.net/2502_91869417/article/details/149945102)。在这个过程中，可靠性是贯穿始终的 "地基"：初始级要求 "不垮"，可重复级要求 "不漏"，定义级要求 "规范"，管理级要求 "可控"，优化级要求 "自适应"[(64)](https://blog.csdn.net/2502_91869417/article/details/149945102)。

### 2.3 市场驱动：科技巨头的战略布局与资本涌入

市场驱动因素为 Harness Engineering 的快速发展提供了强大动力。**科技巨头的巨额投资**创造了前所未有的基础设施支撑。谷歌、亚马逊、Meta、微软四大巨头 2026 年 AI 资本开支总额预计达 6100-6600 亿美元，同比增长超过 60%，其中亚马逊 2000 亿美元、谷歌 1850 亿美元、Meta 1350 亿美元、微软 1050 亿美元，主要用于数据中心扩建与 AI 芯片采购[(69)](https://news.sina.cn/bignews/insight/2026-02-25/detail-inhnyupw2367042.d.html)。

**OpenAI 的爆发式增长**成为 Harness Engineering 发展的重要催化剂。OpenAI 2025 年营收达 131 亿美元，超出预期 30%，2030 年目标更是高达 2800 亿美元[(69)](https://news.sina.cn/bignews/insight/2026-02-25/detail-inhnyupw2367042.d.html)。更引人注目的是，OpenAI 获得了创纪录的 1100 亿美元融资，公司估值达到 8400 亿美元，并可能在 2026 年底提交 IPO 申请，2027 年上市时估值可能达到 1 万亿美元[(71)](https://www.sci-tech-today.com/news/openai-110-billion-funding/)。这种资本的大量涌入不仅为 OpenAI 自身的 Harness Engineering 实践提供了资源支持，也向整个行业发出了明确的信号。

**行业认可度的快速提升**体现在多个层面。GitHub、Anthropic、OpenAI 等顶尖机构纷纷投入 Harness 研究，软件工程领域的权威 Martin Fowler 在 2026 年正式提出了 "Harness Engineering" 这一全新方向[(79)](http://m.toutiao.com/group/7617939827723403785/?upstream_biz=doubao)。这种来自学术界和工业界的双重认可，为 Harness Engineering 的标准化和普及奠定了坚实基础。

**"AI Agent 之年" 向 "Agent Harness 之年" 的转变**反映了市场关注点的转移。行业总结精准地指出：2025 年是 AI Agent 之年，而 2026 年则是 Agent Harness 之年[(79)](http://m.toutiao.com/group/7617939827723403785/?upstream_biz=doubao)。这种转变的背后是市场对 AI 系统可靠性、可维护性和可扩展性的迫切需求，而 Harness Engineering 恰好提供了解决这些问题的系统性方案。

**应用案例的成功验证**进一步推动了市场采用。OpenAI 通过 Harness 体系实现了零手写代码的百万行生产级软件交付，平均每名工程师每日完成 3.5 个 PR 合并，代码审查通过 Agent 对 Agent 的循环实现了大规模自动化，人工监督仅保留在高层架构决策环节[(114)](https://blog.csdn.net/lvaolan/article/details/159214075)。Stripe 的 Minions 系统每周自动合并超过 1000 个 Pull Request，展示了 Harness Engineering 在大规模企业中的实际应用价值[(167)](https://blog.csdn.net/fyfugoyfa/article/details/159080607)。这些成功案例为其他企业提供了可借鉴的实践模式，加速了 Harness Engineering 的市场普及。

## 三、Harness Engineering 的技术应用实践

### 3.1 模型训练阶段的 Harness 应用

在模型训练阶段，Harness Engineering 通过提供标准化的训练环境和自动化的实验管理，显著提升了训练效率和结果的可重复性。**自动化实验跟踪与管理**成为这一阶段的核心应用场景。使用 MLflow 等开源平台可以实现机器学习生命周期的端到端管理，提供统一的实验跟踪接口、将代码打包成可重现的运行以及模型共享功能[(128)](https://gurukulgalaxy.com/blog/top-10-experiment-tracking-tools-features-pros-cons-comparison/)。

**训练监控与早停策略**的实施体现了 Harness Engineering 在资源优化方面的价值。通过 PyTorch/TensorFlow 框架结合 MLflow 实验跟踪和 Weights & Biases 可视化监控，可以实现关键指标的实时跟踪和资源占用的动态调整[(102)](https://blog.csdn.net/zyxzyx49/article/details/155212228)。这种监控不仅提高了训练效率，还能防止模型过拟合，确保训练结果的质量。

**模型轻量化技术的集成**展示了 Harness Engineering 在部署准备阶段的前瞻性考虑。训练前采用知识蒸馏、量化压缩等技术减少模型参数量，能够显著降低后续部署的资源消耗[(102)](https://blog.csdn.net/zyxzyx49/article/details/155212228)。这种在训练阶段就考虑部署需求的做法，体现了 Harness Engineering 对整个 AI 生命周期的系统性思考。

**多模型对比与性能评估**通过基准测试系统实现了科学的模型选择。现代 Harness 系统能够并行执行任务、比较多个模型性能并进行失败分类，为模型选择提供了客观的数据支撑。这种能力在需要在多个模型架构或超参数配置中做出选择时尤为重要。

### 3.2 模型部署阶段的 Harness 应用

模型部署阶段是 Harness Engineering 展现其价值的关键环节。**自动化部署流水线**的构建实现了从训练到生产环境的无缝衔接。Harness AI 能够自动与可观测性工具集成以检测问题并触发回滚，用户只需用自然语言描述想要的流水线，系统就会自动生成[(86)](https://www.harness.io/products/continuous-delivery?gh_jid=5785110002)。这种 "声明式部署" 的方式极大降低了部署的复杂性。

**多服务 CD 阶段管理**体现了 Harness Engineering 在复杂系统部署中的优势。通过创建多服务 CD 阶段并选择要部署的服务或设置运行时输入，可以实现对复杂微服务架构的统一管理[(84)](https://developer.harness.io/docs/continuous-delivery/kb-articles/articles/cv-multi-service/)。这种能力在处理包含数十个甚至数百个微服务的大型系统时尤为重要。

**部署兼容性保障**通过环境标准化机制得到解决。在 GPU 部署时，确保 Docker 镜像包含对应版本的 CUDA/CuDNN；CPU 部署时，避免依赖 GPU 相关库，可使用 torch-cpu 版本减少镜像体积[(102)](https://blog.csdn.net/zyxzyx49/article/details/155212228)。这种细致的环境管理体现了 Harness Engineering 对部署可靠性的重视。

**实时性能监控与自动扩缩容**通过集成云原生技术实现了部署环境的智能化管理。SageMaker HyperPod 等平台提供自动预调配功能、以任务治理实现的计算资源管理、实时性能监控以及增强的可观测性，能够简化模型部署任务[(94)](https://aws.amazon.com/sagemaker-ai/hyperpod/)。这种智能化的资源管理不仅提高了系统性能，还能根据负载自动调整资源配置，实现成本优化。

### 3.3 模型监控与优化阶段的 Harness 应用

模型监控与优化阶段展现了 Harness Engineering 在 AI 系统全生命周期管理中的持续价值。**综合性能监控体系**的建立为系统健康度评估提供了全面的数据基础。智能体使用包括日志、指标和跨度在内的遥测技术监控应用性能，并能在隔离的开发环境中重现 bug[(83)](https://www.infoq.com/news/2026/02/openai-harness-engineering-codex/)。这种全方位的监控能力使得问题能够被及时发现和定位。

**自动化错误检测与恢复机制**体现了 Harness Engineering 的智能化特征。AI 分析日志记录和 APM 遥测数据以跟踪部署健康状况，系统能够与 12 种以上的工具协作，实现问题的自动检测和故障的自动恢复[(101)](https://www.harness.io/platform/continuous-delivery)。这种自动化能力大大减少了人工干预的需求，提高了系统的稳定性。

**成本监控与预算管理**成为企业级应用中不可忽视的功能。通过部署 API 调用预算监控与硬限制，可以有效控制 AI 服务的成本支出[(169)](https://juejin.cn/post/7617728986828177435)。这种成本意识的融入体现了 Harness Engineering 对企业实际需求的深刻理解。

**长期一致性维护**通过后台守护进程实现了系统的自我修复能力。部署后台 GC Agent 可以观察代码库的长期一致性变化，随着模型能力提升，周期性审视并精简 Harness，拥抱 "可撕裂" 原则[(169)](https://juejin.cn/post/7617728986828177435)。这种持续优化的机制确保了系统能够适应不断变化的需求。

### 3.4 典型应用场景与最佳实践

Harness Engineering 在不同应用场景中展现出了强大的适应性和价值创造能力。\*\* 编码智能体（Coding agents）\*\* 场景因其代码的可验证性、可测试性和可回滚性而具有很强的反馈循环。这种特性使得编码智能体成为 Harness Engineering 最成功的应用领域之一，OpenAI 的零手写代码实验就是最好的证明。

**数据分析智能体**需要跨多源数据探索、编写 SQL、运行查询、验证结果、生成报告等复杂操作。Harness Engineering 通过提供统一的数据访问接口和标准化的分析流程，使得这类复杂任务能够被可靠地自动化执行。

**多智能体协作场景**在任务可并行且不同子任务需要不同上下文或工具时展现出独特优势，尽管成本通常更高。这种协作模式特别适合处理需要多领域知识或多工具集成的复杂任务，如跨部门的业务流程自动化。

**企业级 DevOps 自动化**案例展示了 Harness Engineering 在实际业务中的巨大价值。某企业软件公司通过 Harness 的高级编排功能，实现了新应用的自动配置和安全合规内置，将开发人员的生产力提升了数倍，并减少了 80% 的手动 DevOps 工单[(108)](https://www.harness.io/case-studies/enterprise-software-and-it-company-80-percent-reduction-in-manual-devops-tickets)。这种显著的效率提升证明了 Harness Engineering 在规模化应用中的价值。

**持续交付优化**通过标准化部署流程实现了效率的大幅提升。LogMeIn 的开发团队获得了自助式持续交付和标准化的微服务部署流水线，Harness CD 抽象模型（CDAM）使得团队能够在 1 小时内完成安装、使用和上线，无论其服务容器编排器或云基础设施如何[(110)](https://www.harness.io/case-studies/standardized-ci-cd-pipelines)。这种标准化能力大大降低了技术栈的复杂性。

**安全合规集成**成为企业采用 Harness Engineering 的重要考量因素。通过将安全扫描直接集成到 AI 生成代码的 "内环" 中，2026 年的技术趋势显示 Harness 正在将安全扫描与 AI 编码深度融合。这种内置的安全机制确保了 AI 生成的代码能够满足企业的安全标准。

## 四、工具选择与实操方法指南

### 4.1 主流开源 Harness Engineering 工具生态

开源 Harness Engineering 工具生态的成熟为不同规模的组织提供了丰富的选择。**MLflow**作为 Databricks 开发的最广泛采用的开源机器学习生命周期管理平台，提供了实验跟踪、代码打包成可重现运行以及模型共享的通用接口[(128)](https://gurukulgalaxy.com/blog/top-10-experiment-tracking-tools-features-pros-cons-comparison/)。其开源特性和强大的功能使其成为许多组织的首选，特别是在需要与现有数据处理流程集成的场景中。

**Polyaxon**作为平台无关的云原生 MLOps 工具，专门用于在 Kubernetes 上编排和跟踪实验[(127)](https://www.scmgalaxy.com/tutorials/top-10-experiment-tracking-tools-features-pros-cons-comparison/)。其 Kubernetes 原生设计使其能够无缝运行在 EKS、GKE 或 AKS 等主流容器平台上，特别适合已经采用容器化架构的组织。

**Weights & Biases 和 Comet**在功能深度与易用性方面表现出色，为团队提供了丰富的比较和协作工作流程[(129)](https://www.bestdevops.com/top-10-experiment-tracking-tools-features-pros-cons-and-comparison/)。这两个平台都提供了强大的实验可视化功能和团队协作工具，但在定价策略和功能侧重点上有所不同，用户需要根据具体需求进行选择。

**LangSmith**作为 AI 可观测性工具，提供免费版本和团队及企业部署的付费计划[(131)](https://www.onpage.com/top-12-ai-and-llm-observability-tools-in-2026-compared-open-source-and-paid/)。其专注于 AI 系统的可观测性，特别适合需要对 AI 智能体行为进行深度分析的场景。

**Braintrust**在性能监控方面展现出独特优势，该平台能够自动捕获详尽的追踪信息，包括持续时间、token 计数、工具调用、错误和成本，查询性能比替代品快 80 倍[(133)](https://www.braintrust.dev/articles/best-ai-observability-tools-2026)。这种高性能的监控能力对于大规模 AI 部署特别重要。

### 4.2 商业化 Harness 平台的功能特性与对比

商业化 Harness 平台在功能完整性和企业级支持方面具有明显优势。**Harness AI 平台**提供了灵活的模块化定价策略，包括个人开发者和小团队的免费计划、成长型组织的 Essentials 计划以及大型企业的 Enterprise 计划[(135)](https://www.harness.io/pricing)。其核心功能包括 AI 驱动的 DevOps 工具，提供现代化的 AI 原生 CI/CD、功能标志、基础设施管理和混沌工程工具[(134)](https://devsuite.co/harness)。

Harness 平台的**模块化设计**体现了其对企业多样化需求的深刻理解。Essentials 计划包含持续交付与 GitOps（世界上最先进的 CD 平台，设计用于将任何应用部署到任何云，内置高级部署策略、AI 驱动的部署验证和自动回滚）、持续集成（世界上最快的 CI，见证 4 倍更快的构建、强大的安全性和成本效率）、基础设施即代码管理、安全测试编排等核心功能[(135)](https://www.harness.io/pricing)。

**企业级安全功能**的集成展示了商业化平台在合规性方面的优势。Harness 宣布了两个新产品：**AI Security**用于发现、测试和保护运行在应用程序中的 AI；**Secure AI Coding**作为 Harness SAST 的新功能，用于保护 AI 工具编写的代码[(136)](https://www.harness.io/blog/securing-ai-and-securing-with-ai-ai-security-from-code-to-runtime-with-harness)。这种端到端的安全解决方案对于需要满足严格合规要求的企业特别有价值。

**性能优势**的量化展示体现了商业化平台的技术实力。Harness 能够在任何源代码、任何语言和任何操作系统上实现 8 倍更快的构建速度[(137)](https://www.harness.io/)。这种性能提升不仅提高了开发效率，还能显著降低计算成本。

### 4.3 工具学习路径与成本分析

对于老程序员而言，学习 Harness Engineering 工具需要采用渐进式的方法。**入门阶段**建议从 AGENTS.md/CLAUDE.md 文件开始，这是最简单的入门方式。在仓库根目录放置一个 Markdown 文件，写入架构约定、命名规范、测试期望等基本规则[(144)](https://m.sohu.com/a/999768879_122189055/)。这种方法的优势在于不需要复杂的配置，能够快速看到效果。

**实践步骤**的设计体现了循序渐进的学习理念[(141)](https://jishuzhan.net/article/2033727838759747586)：

第一步：在现有项目中创建 AGENTS.md，记录下一周 Agent 犯的每一个错误。这一步的目的是建立对问题的认知，了解当前系统的痛点。

第二步：为最高频的错误添加 Linter 规则或文档约束，验证 Agent 不再重蹈覆辙。这一步开始建立具体的约束机制，解决最紧迫的问题。

第三步：为多步骤任务添加跨会话进度追踪，引入 Build-Verify 强制循环。这一步提升到流程管理的层面，确保复杂任务能够可靠执行。

第四步：部署后台 GC Agent，观察代码库的长期一致性变化。这一步关注系统的可持续性，处理技术债务问题。

第五步：随着模型能力提升，周期性审视并精简 Harness，拥抱 "可撕裂" 原则。这一步体现了持续优化的理念，避免过度工程化。

**成本分析**需要从多个维度考虑。Harness AI 提供免费计划（个人开发者和小团队）、Essentials 计划（成长型组织）和 Enterprise 计划（大型企业），采用按需付费模式[(135)](https://www.harness.io/pricing)。这种定价策略使得不同规模的组织都能找到适合的方案。

**学习资源**的丰富性为快速入门提供了支撑。Harness Developer Hub 提供了课程、指南、视频和参考文档来帮助用户创建和交付软件，包括认证课程和导师指导培训[(171)](https://developer.harness.io/#community)。这些资源的系统性和权威性确保了学习路径的科学性。

### 4.4 老程序员的实操建议

作为老程序员，在学习 Harness Engineering 时应该充分发挥自身的技术优势。**渐进式构建约束**是核心原则 —— 从最基本的代码检查入手，随着团队对 AI 工作方式理解的加深，再逐步增加更复杂的架构约束，不必一开始就设计出完美的 Harness[(167)](https://blog.csdn.net/fyfugoyfa/article/details/159080607)。这种方法体现了 "小步快跑" 的敏捷理念，能够在实践中不断优化。

**多提供商设计**的理念应该贯穿始终。Harness 应兼容 Claude、GPT、Gemini 等不同模型，确保切换模型时无需重建整套系统[(167)](https://blog.csdn.net/fyfugoyfa/article/details/159080607)。这种设计理念体现了对技术演进的前瞻性思考，避免了技术锁定。

**实践策略**的设计需要结合老程序员的经验优势[(156)](http://m.toutiao.com/group/7616734587578597940/?upstream_biz=doubao)：

起步阶段：把同一个任务做两遍。先自己手动完成，再让 Agent 做一遍，通过对比发现差异和改进空间。

养成习惯：每天下班前 30 分钟启动 Agent。这种规律性的实践能够逐步建立对系统的熟悉感，同时不会过度占用工作时间。

基础内容：从项目的核心架构说明、常见的 Agent 错误及应对方式、测试和 Lint 命令、Agent 绝对不能碰的部分开始。这些内容都是老程序员熟悉的领域，能够自然地转化为 Harness 规则。

**技术优势的发挥**体现在对系统复杂性的理解上。老程序员具备的系统抽象能力、架构判断力、对代码质量的直觉，这些都是从大量手动开发经验中提炼出来的，正是 Harness Engineering 所需要的核心能力[(165)](http://m.toutiao.com/group/7618788413872914995/?upstream_biz=doubao)。因此，应该将这些经验自信地应用到 Harness 设计中。

## 五、学习路径规划与实践建议

### 5.1 老程序员的技术优势与学习策略

作为老程序员，在学习 Harness Engineering 时拥有独特的优势。**丰富的问题解决经验**是最大的资产，资深程序员积累了大量跨项目、跨场景的问题解决经验，能为企业节省巨额试错成本[(157)](https://blog.csdn.net/2503_92604243/article/details/149868229)。这种经验在设计 Harness 约束规则时特别有价值，能够预见到新手可能忽略的边界情况和异常场景。

**主动学习策略**的掌握体现了成熟开发者的智慧。老程序员的学习方式与年轻人不同 —— 他们不是 "被动追赶所有新技术"，而是主动筛选、精准学习，始终聚焦 "高价值知识"[(157)](https://blog.csdn.net/2503_92604243/article/details/149868229)。这种选择性学习能力使得他们能够快速抓住 Harness Engineering 的核心要点，避免在细枝末节上浪费时间。

**系统化思维能力**是工程经验的重要体现。工程师和数学家接受的训练是将复杂问题分解为更小、可管理的部分 —— 这种技能直接适用于编程中的算法思维，他们的分析方法与编程的系统性本质完美契合[(159)](https://algocademy.com/blog/crossing-over-how-skills-from-other-industries-can-boost-your-coding-career/)。这种系统化思维在设计复杂的 Harness 架构时尤为重要。

**核心使命的认知**帮助老程序员准确定位自己在 AI 时代的价值。Harness 工程师的核心任务是将不稳定、易幻觉的 LLM，通过一整套工程系统，转化为一个可预测、可评估、可运维的智能执行系统，因此 Harness 工程师的核心使命是成为一名 AI 系统的架构师。这种角色认知与老程序员的架构设计经验高度吻合。

### 5.2 渐进式学习方案设计

基于老程序员的优势，渐进式学习方案应该分为四个阶段：

**第一阶段：概念理解与环境搭建（1-2 周）**

重点学习 Harness Engineering 的基本概念和核心原理，理解其与传统软件工程的区别。同时搭建基础的实验环境，包括安装必要的工具（如 MLflow、LangSmith 等），熟悉 AGENTS.md 文件的编写规则。这个阶段的目标是建立对 Harness Engineering 的基本认知，能够理解相关技术文档和案例。

**第二阶段：基础实践与规则制定（2-3 周）**

开始在实际项目中应用 Harness Engineering 理念。从最简单的代码规范检查开始，逐步扩展到架构约束、测试验证等方面。重点学习如何将传统的代码审查标准转化为可执行的 Harness 规则，如何设计有效的反馈循环。这个阶段应该能够独立编写简单的 Harness 配置，并看到明显的效果改善。

**第三阶段：复杂场景与多智能体协作（3-4 周）**

深入学习多智能体协作模式、复杂工作流管理、性能优化等高级主题。重点掌握如何设计可扩展的 Harness 架构，如何处理跨服务、跨工具的复杂任务。这个阶段应该能够设计和实现中等复杂度的 Harness 系统，解决实际的业务问题。

**第四阶段：最佳实践与持续优化（持续进行）**

学习行业最佳实践，了解不同场景下的 Harness 设计模式。重点关注性能监控、成本优化、安全合规等企业级需求。这个阶段应该能够根据业务需求独立设计完整的 Harness 解决方案，并具备持续优化的能力。

### 5.3 技术障碍识别与应对策略

在学习 Harness Engineering 的过程中，老程序员可能遇到以下技术障碍：

**思维模式的转变**是首要挑战。从 "编写代码" 到 "设计环境" 的思维转变需要时间适应。应对策略是采用渐进式方法，从熟悉的代码规范开始，逐步扩展到更抽象的系统设计。可以先将现有的代码审查标准转化为 Harness 规则，建立成就感后再逐步深入。

**新技术栈的学习成本**可能带来压力。Harness Engineering 涉及多个新技术，包括 AI 模型接口、容器技术、监控系统等。应对策略是采用模块化学习方式，每次只专注于一个技术点，利用已有的编程经验快速掌握新工具的使用方法。

**AI 模型特性的理解难度**可能影响 Harness 设计的有效性。不同 AI 模型有不同的特性和限制，需要深入了解才能设计出合适的约束规则。应对策略是从简单的模型开始，逐步尝试更复杂的模型，通过实践积累对模型行为的理解。

**团队协作的挑战**可能出现在推广 Harness Engineering 时。其他团队成员可能对这种新方法持怀疑态度，或者缺乏相关的技术背景。应对策略是采用试点项目的方式，先在小范围内验证效果，用实际成果说服团队，同时提供必要的培训和支持。

### 5.4 学习资源与实践项目推荐

**官方文档与权威资料**是学习的基础：

1. **OpenAI 官方报告**：《Harness Engineering: Leveraging Codex in an Agent-First World》（2026 年 2 月 11 日发布），这是 Harness Engineering 概念的权威来源，包含了 OpenAI 内部实验的详细信息。

2. **Harness Developer Hub**：提供了完整的课程、指南、视频和参考文档，包括认证课程和导师指导培训[(171)](https://developer.harness.io/#community)。

3. **GitHub 资源**：如 OpenAI 内部实验的详细解析，包含 100 万行代码零手写的完整案例分析[(192)](https://github.com/Quriosity-agent/articles/blob/main/2026-03-01/openai-harness-engineering-codex.md)。

**实践项目建议**按难度递进：

**初级项目（1-2 周）**：

- 为现有项目创建基础的 AGENTS.md 文件，定义基本的代码规范和架构约定

- 实现简单的 Linter 规则，自动检查代码风格和基本逻辑错误

- 搭建基础的实验跟踪系统，使用 MLflow 或 Weights & Biases 记录实验过程

**中级项目（3-4 周）**：

- 设计并实现多智能体协作系统，处理简单的业务流程

- 创建完整的持续交付流水线，包括构建、测试、部署的全流程自动化

- 实现基本的性能监控和成本管理功能

**高级项目（1-2 个月）**：

- 开发生产级的 Harness 系统，支持复杂的业务场景

- 实现完整的安全合规功能，包括数据保护、访问控制、审计日志等

- 设计可扩展的架构，支持多种 AI 模型和工具的集成

**社区参与建议**：

- 参与开源 Harness 项目的贡献，如为 LangChain、MLflow 等项目贡献 Harness 相关功能

- 在技术博客上分享学习心得和实践经验，与社区互动交流

- 参加相关的技术会议和研讨会，了解最新的技术发展趋势

## 六、实践记录撰写指南

### 6.1 技术博客撰写的最佳实践

撰写高质量的 Harness Engineering 实践记录需要遵循专业的技术写作规范。**结构化表达**是基础要求，应该使用多级标题（H2、H3）将主题分解为逻辑清晰的小节，段落控制在 2-4 个句子以提高可读性[(183)](https://www.eesel.ai/blog/tech-blog-writing)。这种结构化的表达方式不仅便于读者理解，也有助于作者整理思路。

**内容组织的逻辑框架**应该遵循 "场景切入 + 原理拆解 + 案例落地 + 总结升华" 的公式[(202)](https://blog.csdn.net/LplLpl11/article/details/155831259)。这种结构既满足了 "懂原理" 的技术要求，又兼顾了 "会落地" 的实践需求，是 AI 技术文章的最优结构。

**金字塔原理的应用**能够显著提升文章的逻辑性。先提出核心结论（如 "Harness Engineering 重构了 AI 开发流程"），再从技术架构、场景落地、商业价值等维度展开论证，每个维度下又细分具体模块[(193)](https://blog.csdn.net/u012380034/article/details/148493850)。这种自上而下的表达方式符合读者的认知习惯，能够快速传达核心观点。

**写作风格的把握**需要平衡专业性和可读性。确保内容能够解释各种项目和工具，在相关位置融入代码片段，采用既提供信息又带有幽默感的写作风格以保持读者参与度[(184)](https://docsbot.ai/prompts/writing/tech-blog-article-writing)。这种轻松但专业的风格能够降低技术内容的阅读门槛。

### 6.2 案例分析的结构设计

Harness Engineering 案例分析应该采用标准化的结构设计。**经典三段式结构**包括：首先描述客户挑战，然后解释解决方案如何应对该挑战，最后展示可量化的成果[(197)](https://www.xgrid.co/resources/effective-case-studies-whitepapers-technical-audiences/)。这种结构逻辑清晰，能够有效传达项目的价值。

**标准化场景结构**遵循 "场景定义 - 技术实现 - 标杆案例" 的模式[(193)](https://blog.csdn.net/u012380034/article/details/148493850)。这种结构特别适合技术深度较高的内容，能够让读者从概念理解逐步过渡到实践应用。

**学术化案例分析**的标准结构包括：引言、背景、问题陈述、方法论、解决方案等部分[(196)](https://www.docsity.com/en/docs/case-studies-learning-from-real-world-scenarios/11372419/)。如果需要发表在技术期刊或会议上，这种结构能够提供充分的技术细节和严谨的论证过程。

**商业价值导向的结构**重点突出 "痛点 + 技术 + 成果" 的标题公式和 "教育 + 技术" 融合的解决方案描述[(203)](https://www.iesdouyin.com/share/note/7491660435180080411/?region=&mid=7460154641456679707&u_code=0&did=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ&iid=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ&with_sec_did=1&video_share_track_ver=&titleType=title&schema_type=37&share_sign=mSJJBOsGfqiaKckgaM2Kc3F.DNlsGqdLjAxvZd98JBI-&share_version=280700&ts=1774233319&from_aid=1128&from_ssr=1&share_track_info=%7B%22link_description_type%22%3A%22%22%7D)。这种结构特别适合面向企业读者的内容，能够快速传达项目的商业价值。

### 6.3 技术深度与可读性的平衡

在撰写 Harness Engineering 实践记录时，需要在技术深度和可读性之间找到平衡点。**专业术语的处理**应该遵循 "定义优先" 的原则，在首次使用专业术语时给出清晰的定义，确保不同技术背景的读者都能理解。

**代码示例的选择**需要精心设计。应该选择最能说明问题的代码片段，避免冗长的完整代码。同时，代码注释应该详细，解释关键逻辑和设计思路。对于复杂的算法或架构，应该配合图表进行说明。

**循序渐进的解释方式**能够帮助读者逐步理解复杂概念。从简单的例子开始，逐步引入复杂的细节，让读者能够建立完整的知识体系。这种方法特别适合介绍 Harness Engineering 这种相对新颖的技术。

**互动性元素的加入**能够提升阅读体验。可以在适当的位置加入思考问题、实践建议或讨论话题，鼓励读者参与思考和实践。这种互动性不仅能够提高文章的价值，还能增强读者的参与感。

### 6.4 案例选择与呈现建议

案例的选择和呈现直接影响实践记录的价值。**多样化的案例类型**能够展示 Harness Engineering 的广泛应用。建议选择不同规模、不同行业、不同复杂度的案例，如 OpenAI 的大规模零手写代码实验、Stripe 的 Minions 系统、小型项目的基础 Harness 应用等[(176)](https://blog.csdn.net/m0_74382565/article/details/159280492)。

**案例的结构化分析**应该采用专业的方法。可以使用对比分析法（对比计划与实际结果）、SWOT 分析（案例的优劣势、机会与威胁）、PEST 分析（宏观环境影响因素）、数据模型分析（如回归分析用户行为数据）等方法，确保分析过程客观、有依据[(206)](https://m.book118.com/html/2026/0320/6031100044012113.shtm)。

**案例的价值提炼**是实践记录的核心。真正的案例学习需要像咨询顾问那样，运用结构化分析框架，从案例中提炼出可操作的决策模型[(201)](https://developer.aliyun.com:443/article/1708905)。这种提炼不仅要总结成功经验，还要分析失败教训，为读者提供全面的参考。

**案例的可复制性设计**能够提升实践记录的实用价值。在描述解决方案时，应该突出 "教育 + 技术" 融合，避免罗列硬件，强调教育价值。使用流程图或时间轴展示关键阶段（如试点→迭代→推广），让读者能够清晰地了解实施步骤[(203)](https://www.iesdouyin.com/share/note/7491660435180080411/?region=&mid=7460154641456679707&u_code=0&did=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ&iid=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ&with_sec_did=1&video_share_track_ver=&titleType=title&schema_type=37&share_sign=mSJJBOsGfqiaKckgaM2Kc3F.DNlsGqdLjAxvZd98JBI-&share_version=280700&ts=1774233319&from_aid=1128&from_ssr=1&share_track_info=%7B%22link_description_type%22%3A%22%22%7D)。

### 6.5 学习心得的结构化记录

学习心得的记录应该采用系统化的方法，确保能够形成可复用的知识资产。**技术要点的总结**应该突出核心概念和关键技术。例如，Harness Engineering 的六个核心要素：架构约束、自验证循环、规划 - 执行 - 验证三阶段推理、上下文隔离、熵治理、可拆卸性[(177)](https://www.iesdouyin.com/share/video/7618086164930579764/?region=&mid=7618086210522712875&u_code=0&did=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ&iid=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ&with_sec_did=1&video_share_track_ver=&titleType=title&share_sign=YucPgBeeQCPkqSAcbDZkqM9AmBhY2AJ8UKJtHVltOBU-&share_version=280700&ts=1774233300&from_aid=1128&from_ssr=1&share_track_info=%7B%22link_description_type%22%3A%22%22%7D)。

**实践经验的提炼**应该关注可操作的方法论。如 "渐进式构建约束" 原则、"多提供商设计" 理念、"把同一个任务做两遍" 的实践策略等[(167)](https://blog.csdn.net/fyfugoyfa/article/details/159080607)。这些经验应该以清晰、可执行的方式呈现。

**错误模式的识别**是学习过程的重要收获。应该记录常见的错误类型、错误原因分析、解决方案等信息。例如，"大提示词文件综合征"（monolithic prompt syndrome）、"对话历史作为状态"（transcript-as-state）等常见陷阱。

**改进建议的提出**体现了持续学习的态度。可以从技术优化、流程改进、工具选择等多个角度提出建议。这些建议应该具体、可操作，并说明预期效果。

**未来展望的思考**能够展示对技术发展趋势的理解。可以基于当前的学习和实践，预测 Harness Engineering 的发展方向，提出值得探索的新技术或新应用场景。这种前瞻性思考不仅对读者有启发价值，也有助于作者建立技术洞察力。

## 结语

Harness Engineering 作为 2026 年 AI 领域的最新趋势，正在重新定义软件工程师的角色和价值。对于我们这些拥有丰富经验的老程序员而言，这既是挑战更是机遇。通过系统学习和实践，我们可以将数十年积累的架构设计能力、系统思维和工程经验，转化为驾驭 AI 智能体的核心竞争力。

学习 Harness Engineering 的过程，本质上是一个 \*\* 从 "代码编写者" 到 "系统设计者"\*\* 的角色转变过程。这个转变不是对过去经验的否定，而是对其价值的升华 —— 我们不再是代码的直接生产者，而是代码生产系统的架构师和管理者。这种角色转变不仅能够让我们继续在技术领域发挥重要作用，还能为企业创造更大的价值。

在学习和实践的道路上，我们应该保持开放的心态，勇于尝试新的技术和方法。同时，要充分发挥我们的经验优势，将对代码质量的直觉、对系统复杂性的理解、对工程实践的洞察，都融入到 Harness 的设计中。记住，**Harness Engineering 需要的不是最新的技术知识，而是最深的工程智慧**。

最后，希望这篇全面的学习指南能够帮助你顺利踏上 Harness Engineering 的学习之旅。在这个 AI 重塑世界的时代，让我们一起成为驾驭智能的工程师，创造更加美好的技术未来。无论你是刚刚开始探索，还是已经有了一定的实践经验，都请记住：**最好的学习方式就是实践，最好的成长方式就是分享**。期待在 Harness Engineering 的技术社区中与你相遇，共同推动这个领域的发展和进步。

**参考资料&#x20;**

\[1] Harness Engineering and Continuous AI: Key Takeaways by Dakota Kim[ https://www.eqengineered.com/insights/https/harness-engineering-and-continuous-ai-key-takeaways](https://www.eqengineered.com/insights/https/harness-engineering-and-continuous-ai-key-takeaways)

\[2] AI Harness for PLM and Manufacturing: Files, Workflows, or Product Memory?[ https://beyondplm.com/2026/03/08/ai-harness-plm-manufacturing/](https://beyondplm.com/2026/03/08/ai-harness-plm-manufacturing/)

\[3] Transforming Performance Engineering with Generative AI(pdf)[ https://www.scirp.org/pdf/jcc2025133_31733078.pdf](https://www.scirp.org/pdf/jcc2025133_31733078.pdf)

\[4] 从“提示工程”到“驾驭工程”:AI开发范式的又一次跃迁\_harness engineering-CSDN博客[ https://blog.csdn.net/weixin_53961451/article/details/158598575](https://blog.csdn.net/weixin_53961451/article/details/158598575)

\[5] Harness Engineering:人与AI的协作范式转变\_人人都是产品经理[ http://m.toutiao.com/group/7615519343778169387/?upstream_biz=doubao](http://m.toutiao.com/group/7615519343778169387/?upstream_biz=doubao)

\[6] 【人工智能】AI 智能体驾驭工程(Harness Engineering)全解析\_openai 驾驭工程-CSDN博客[ https://blog.csdn.net/wstever/article/details/159114681](https://blog.csdn.net/wstever/article/details/159114681)

\[7] 为什么顶级团队开始重押 Harness Engineering?AI Agent 时代的底层答案来了-CSDN博客[ https://blog.csdn.net/fyfugoyfa/article/details/159080607](https://blog.csdn.net/fyfugoyfa/article/details/159080607)

\[8] Harness Engineering 让 AI 高效 可靠 自主 工作 2026 年 ， Harness Engineering 驾驭 工程 这个 概念 一定 要 了解 ， 是 让 你 能 指挥 多个 AI Agent 实现 高效 可靠 自主 干活 的 关键 ， 核心 就是 给 AI 搭 一个 好 的 环境 。 就 跟 让 人 高效 可靠 自主 干活 ， 也 需要 一个 好 的 环境 一样 。 # Harness Engineering # AI Agent # AI # harness # 驾驭 工程[ https://www.iesdouyin.com/share/video/7614160630451536753/?region=\&mid=7614160575806982954\&u_code=0\&did=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ\&iid=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ\&with_sec_did=1\&video_share_track_ver=\&titleType=title\&share_sign=3wVTdphsKzPBLXMBFcmcaulKL0_lLj65Xx_WQZef4Ko-\&share_version=280700\&ts=1774233150\&from_aid=1128\&from_ssr=1\&share_track_info=%7B%22link_description_type%22%3A%22%22%7D](https://www.iesdouyin.com/share/video/7614160630451536753/?region=&mid=7614160575806982954&u_code=0&did=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ&iid=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ&with_sec_did=1&video_share_track_ver=&titleType=title&share_sign=3wVTdphsKzPBLXMBFcmcaulKL0_lLj65Xx_WQZef4Ko-&share_version=280700&ts=1774233150&from_aid=1128&from_ssr=1&share_track_info=%7B%22link_description_type%22%3A%22%22%7D)

\[9] OpenClaw 之后，Harness Engineering 又是什么?-AI.x-AIGC专属社区-51CTO.COM[ https://www.51cto.com/aigc/11037.html](https://www.51cto.com/aigc/11037.html)

\[10] Harness Engineering 深度解读:AI Agent 时代的工程范式革命 - 技术栈[ https://jishuzhan.net/article/2033802581378662402](https://jishuzhan.net/article/2033802581378662402)

\[11] Harness Anatomy[ https://github.com/subinium/ddududdudu/blob/main/docs/harness-anatomy.md](https://github.com/subinium/ddududdudu/blob/main/docs/harness-anatomy.md)

\[12] Harness[ https://github.com/cgast/harness](https://github.com/cgast/harness)

\[13] How to Create a Harness Pipeline and integrate with Azure[ https://techcommunity.microsoft.com/blog/azureinfrastructureblog/how-to-create-a-harness-pipeline-and-integrate-with-azure/4499862](https://techcommunity.microsoft.com/blog/azureinfrastructureblog/how-to-create-a-harness-pipeline-and-integrate-with-azure/4499862)

\[14] Harness[ https://github.com/jmoyers/harness](https://github.com/jmoyers/harness)

\[15] FallTech Unveils FT-One Ultra-Litetm Full-Body Harness[ https://www.lelezard.com/en/news-22146273.html](https://www.lelezard.com/en/news-22146273.html)

\[16] Harness Engineering:重塑Al Agent时代的软件工程Harness Engineering:重塑A - 掘金[ https://juejin.cn/post/7617728986828177435](https://juejin.cn/post/7617728986828177435)

\[17] Harness Engineering 深度解读:AI Agent 时代的工程范式革命一、什么是 Harness Eng - 掘金[ https://juejin.cn/post/7617781226363256866](https://juejin.cn/post/7617781226363256866)

\[18] 什么 是 Harness ？ 一个 公式 ： Agent = Model + Harness 模型 是 原始 智能 ， Harness 是 让 智能 变得 可用 的 一切 包括 工具 调用 、 记忆 系统 、 沙箱 环境 、 编排 逻辑 Harness 这个 词 来自 马具 （ 缰绳 + 马鞍 ） 驯服 和 引导 大模型 的 力量 【 裸 模型 的 四 个 缺陷 】 没有 跨 会话 记忆 ， 每次 都是 初见 不能 执行 代码 、 搜索 网页 、 操作 文件 知识 截止 于 训练 日期 ， 不 知道 今天 的 新闻 没有 运行 环境 ， 不能 装包 跑 程序 这 四 个 缺陷 都 需要 Harness 来 补齐 【 六大 核心 组件 】 System Prompt （ 定义 Agent 身份 和 行为 规则 ） Tools / MCP （ 让 Agent 调用 外部 工具 ） File system / Sandbox （ 安全 隔离 的 执行 环境 ） Memory （ 跨 会话 记忆 系统 ） Orchestration （ 子 Agent 编排 和 任务 路由 ） Hooks / Middleware （ 确定性 质量 关卡 ） 【 三代 AI 工程 的 演进 】 Prompt Engineering （ 2022 - 2023 ） 只管 输入 文本 Context Engineering （ 2024 - 2025 ） 管理 整个 上下文 窗口 Harness Engineering （ 2026 ） 构建 模型 之外 的 完整 系统 Prompt ⊂ Context ⊂ Harness ， 每 一代 包含 前 一代 【 实战 案例 】 OpenAI 团队 ： 5 个 月 零 行 手写 代码 ， 100 万 行 AI 生成 Anthropic Claude Agent SDK ： 压缩 策略 让 Agent 跨 窗口 持续 工作 Lang Chain ReAct 循环 ： 推理 → 行动 → 观察 → 再 推理 核心 发现 ： 改进 Harness 比 改进 模型 本身 更 能 提升 表现 【 未来 展望 】 Harness 可能 变成 开箱 即 用 的 服务 模板 技术 栈 选型 将 考虑 AI 友好 性 和 Harness 兼容性 Pre - AI 和 Post - AI 代码 库 的 维护 方式 将 分叉 最大 挑战 不是 生成 代码 ， 而是 设计 环境 和 反馈 循环 # Harness Engineering # AI 工程 # Agent # Prompt 工程 # 上下文 工程[ https://www.iesdouyin.com/share/note/7619991841211851456/?region=\&mid=7619294467664808740\&u_code=0\&did=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ\&iid=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ\&with_sec_did=1\&video_share_track_ver=\&titleType=title\&schema_type=37\&share_sign=fTC61eVrzozmTeZG_7EvTXJ_OISM1pXlJwPSRsKUbnE-\&share_version=280700\&ts=1774233175\&from_aid=1128\&from_ssr=1\&share_track_info=%7B%22link_description_type%22%3A%22%22%7D](https://www.iesdouyin.com/share/note/7619991841211851456/?region=&mid=7619294467664808740&u_code=0&did=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ&iid=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ&with_sec_did=1&video_share_track_ver=&titleType=title&schema_type=37&share_sign=fTC61eVrzozmTeZG_7EvTXJ_OISM1pXlJwPSRsKUbnE-&share_version=280700&ts=1774233175&from_aid=1128&from_ssr=1&share_track_info=%7B%22link_description_type%22%3A%22%22%7D)

\[19] Harness Engineering:给 AI 套上缰绳的工程学(通俗易懂)-CSDN博客[ https://blog.csdn.net/m0_74382565/article/details/159280492](https://blog.csdn.net/m0_74382565/article/details/159280492)

\[20] 模型不是关键，Harness 才是\_腾讯新闻[ http://news.qq.com/rain/a/20260322A02XZ900](http://news.qq.com/rain/a/20260322A02XZ900)

\[21] 告别提示词:AI Agent 时代的脚手架工程-Harness Engineering_AnnZhou[ http://m.toutiao.com/group/7620079278742454818/?upstream_biz=doubao](http://m.toutiao.com/group/7620079278742454818/?upstream_biz=doubao)

\[22] 从“提示工程”到“驾驭工程”:AI开发范式的又一次跃迁\_harness engineering-CSDN博客[ https://blog.csdn.net/weixin_53961451/article/details/158598575](https://blog.csdn.net/weixin_53961451/article/details/158598575)

\[23] Traditional vs AI-Driven Software Development: Differences and Benefits[ https://www.lastingdynamics.com/ar/entity/ai-powered-software-development-kb/traditional-vs-ai-driven-software-development-differences-and-benefits/](https://www.lastingdynamics.com/ar/entity/ai-powered-software-development-kb/traditional-vs-ai-driven-software-development-differences-and-benefits/)

\[24] AI Agents: Models Aren’t Enough for Production[ https://www.archyworldys.com/ai-agents-models-arent-enough-for-production/](https://www.archyworldys.com/ai-agents-models-arent-enough-for-production/)

\[25] 为什么顶级团队开始重押 Harness Engineering?AI Agent 时代的底层答案来了-CSDN博客[ https://blog.csdn.net/fyfugoyfa/article/details/159080607](https://blog.csdn.net/fyfugoyfa/article/details/159080607)

\[26] AI engineers vs. software engineers: how AI is changing the experience of building software[ https://getdx.com/blog/ai-engineer-vs-software-engineer/](https://getdx.com/blog/ai-engineer-vs-software-engineer/)

\[27] stefanberreth / Agentic-Engineering-Harness · GitLab[ https://gitlab.com/stefanberreth/agentic-engineering-harness/-/tree/main](https://gitlab.com/stefanberreth/agentic-engineering-harness/-/tree/main)

\[28] Harness Engineering:重塑Al Agent时代的软件工程Harness Engineering:重塑A - 掘金[ https://juejin.cn/post/7617728986828177435](https://juejin.cn/post/7617728986828177435)

\[29] 提示词工程、上下文工程都过时了，现在是 Harness Engineering 的时代 - 智源社区[ https://hub.baai.ac.cn/view/53120](https://hub.baai.ac.cn/view/53120)

\[30] Harness Engineering:给 AI 套上缰绳的工程学(通俗易懂)-CSDN博客[ https://blog.csdn.net/m0_74382565/article/details/159280492](https://blog.csdn.net/m0_74382565/article/details/159280492)

\[31] OpenClaw 之后，Harness Engineering 又是什么?-AI.x-AIGC专属社区-51CTO.COM[ https://www.51cto.com/aigc/11037.html](https://www.51cto.com/aigc/11037.html)

\[32] 2026最值得PM学的AI能力，比写Prompt重要10倍\_人人都是产品经理[ http://m.toutiao.com/group/7619548763060765227/?upstream_biz=doubao](http://m.toutiao.com/group/7619548763060765227/?upstream_biz=doubao)

\[33] AI Adoption Trends in the Enterprise 2026[ https://www.techrepublic.com/sponsored/ai-adoption-trends-enterprise/](https://www.techrepublic.com/sponsored/ai-adoption-trends-enterprise/)

\[34] 10predictionsfor2026[ https://isg-one.com/research/predictions](https://isg-one.com/research/predictions)

\[35] AI Hype vs. Reality: Deloitte's Tech Trends 2026 Exposes the Gap Between Talk and Deployment[ https://quasa.io/media/ai-hype-vs-reality-deloitte-s-tech-trends-2026-exposes-the-gap-between-talk-and-deployment](https://quasa.io/media/ai-hype-vs-reality-deloitte-s-tech-trends-2026-exposes-the-gap-between-talk-and-deployment)

\[36] Digital Progress and Trends Report 2025[ https://www.worldbank.org/en/publication/dptr2025-ai-foundations?intcid=ecr_hp_dataA_es_ext](https://www.worldbank.org/en/publication/dptr2025-ai-foundations?intcid=ecr_hp_dataA_es_ext)

\[37] The 2026 AI Integration Trends: What Every CTO Needs to Know[ https://www.elinext.com/solutions/ai/trends/ai-integration-trends/](https://www.elinext.com/solutions/ai/trends/ai-integration-trends/)

\[38] Generative Artificial Intelligence (AI) In Engineering Market Report 2026[ https://www.thebusinessresearchcompany.com/report/generative-artificial-intelligence-ai-in-engineering-global-market-report](https://www.thebusinessresearchcompany.com/report/generative-artificial-intelligence-ai-in-engineering-global-market-report)

\[39] 提示词工程、上下文工程都过时了，现在是Harness Engineering 的时代-虎嗅网[ https://www.huxiu.com/article/4841931.html](https://www.huxiu.com/article/4841931.html)

\[40] 模型不是关键，Harness 才是\_搜狐网[ https://m.sohu.com/a/999768879_122189055/](https://m.sohu.com/a/999768879_122189055/)

\[41] Harness Engineering 让 AI 高效 可靠 自主 工作 2026 年 ， Harness Engineering 驾驭 工程 这个 概念 一定 要 了解 ， 是 让 你 能 指挥 多个 AI Agent 实现 高效 可靠 自主 干活 的 关键 ， 核心 就是 给 AI 搭 一个 好 的 环境 。 就 跟 让 人 高效 可靠 自主 干活 ， 也 需要 一个 好 的 环境 一样 。 # Harness Engineering # AI Agent # AI # harness # 驾驭 工程[ https://www.iesdouyin.com/share/video/7614160630451536753/?region=\&mid=7614160575806982954\&u_code=0\&did=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ\&iid=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ\&with_sec_did=1\&video_share_track_ver=\&titleType=title\&share_sign=3wVTdphsKzPBLXMBFcmcaulKL0_lLj65Xx_WQZef4Ko-\&share_version=280700\&ts=1774233199\&from_aid=1128\&from_ssr=1\&share_track_info=%7B%22link_description_type%22%3A%22%22%7D](https://www.iesdouyin.com/share/video/7614160630451536753/?region=&mid=7614160575806982954&u_code=0&did=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ&iid=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ&with_sec_did=1&video_share_track_ver=&titleType=title&share_sign=3wVTdphsKzPBLXMBFcmcaulKL0_lLj65Xx_WQZef4Ko-&share_version=280700&ts=1774233199&from_aid=1128&from_ssr=1&share_track_info=%7B%22link_description_type%22%3A%22%22%7D)

\[42] 狠人揭秘ClaudeCode、Cursor、OpenAI智能体工程技术:模型几乎无关紧要，而是构建正确的工程环境!Harness就是一切\![ https://www.aitntnews.com/newDetail.html?newId=23313](https://www.aitntnews.com/newDetail.html?newId=23313)

\[43] Harness Engineering:同一个模型，排名差了25位，改的不是模型\_VibeCoder[ http://m.toutiao.com/group/7612520981202092596/?upstream_biz=doubao](http://m.toutiao.com/group/7612520981202092596/?upstream_biz=doubao)

\[44] 从单智能体Agent向多智能体Agent协作演进面临哪些挑战?\_闪电星河张[ http://m.toutiao.com/group/7614082800173498932/?upstream_biz=doubao](http://m.toutiao.com/group/7614082800173498932/?upstream_biz=doubao)

\[45] 2026 goals for AI and technology leaders: AI agents and AI governance[ https://www.ibm.com/think/insights/2026-resolutions-for-ai-and-technology-leaders](https://www.ibm.com/think/insights/2026-resolutions-for-ai-and-technology-leaders)

\[46] Security Considerations for Artificial Intelligence Agents (Perplexity Response to NIST/CAISI Request for Information 2025-0035)(pdf)[ https://arxiv.org/pdf/2603.12230.pdf](https://arxiv.org/pdf/2603.12230.pdf)

\[47] AI Agent泡沫现象揭秘:从开发者狂欢到使用者福音，挑战与机遇并存!\_ai agent滔天泡沫:从资本狂欢到价值回归,看清智能体的真与伪-CSDN博客[ https://blog.csdn.net/2401_84494441/article/details/154130849](https://blog.csdn.net/2401_84494441/article/details/154130849)

\[48] Agentic AI: The Six Biggest Deployment Challenges[ https://www.dataiq.global/articles/agentic-ai-the-six-biggest-challenges/](https://www.dataiq.global/articles/agentic-ai-the-six-biggest-challenges/)

\[49] ai agent jailbreak risks: The 2025 Definitive Guide[ https://pingax.com/ai-agent-jailbreak-risks/](https://pingax.com/ai-agent-jailbreak-risks/)

\[50] 大模型 Agent:从技术原型到产业核心的进化与实践\_agent 从实验到产业-CSDN博客[ https://blog.csdn.net/Everly\_/article/details/152120219](https://blog.csdn.net/Everly_/article/details/152120219)

\[51] 【值得收藏】大模型智能体:从堪堪用到真正智能的技术挑战与解决方案-CSDN博客[ https://blog.csdn.net/kaka0722ww/article/details/154114566](https://blog.csdn.net/kaka0722ww/article/details/154114566)

\[52] AI 智能体开发中的技术难点-阿里云开发者社区[ https://developer.aliyun.com/article/1713697](https://developer.aliyun.com/article/1713697)

\[53] AI+Agent技术演进与核心挑战解析[ https://www.iesdouyin.com/share/note/7515432830705454376/?region=\&mid=7202902945938196482\&u_code=0\&did=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ\&iid=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ\&with_sec_did=1\&video_share_track_ver=\&titleType=title\&schema_type=37\&share_sign=xHjjkPId2bX3Z65vcfhOyduSx2hobTceePhTyeENwNE-\&share_version=280700\&ts=1774233203\&from_aid=1128\&from_ssr=1\&share_track_info=%7B%22link_description_type%22%3A%22%22%7D](https://www.iesdouyin.com/share/note/7515432830705454376/?region=&mid=7202902945938196482&u_code=0&did=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ&iid=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ&with_sec_did=1&video_share_track_ver=&titleType=title&schema_type=37&share_sign=xHjjkPId2bX3Z65vcfhOyduSx2hobTceePhTyeENwNE-&share_version=280700&ts=1774233203&from_aid=1128&from_ssr=1&share_track_info=%7B%22link_description_type%22%3A%22%22%7D)

\[54] OpenClaw引爆AI Agent浪潮:技术重构、生态变革与风险审视\_中国日报网[ http://m.toutiao.com/group/7617700855042621994/?upstream_biz=doubao](http://m.toutiao.com/group/7617700855042621994/?upstream_biz=doubao)

\[55] 收藏!小白程序员必看:如何让AI Agent从“看起来容易”变“真正好用”?\_ai-agent 常见问题-CSDN博客[ https://blog.csdn.net/CSDN_224022/article/details/158735529](https://blog.csdn.net/CSDN_224022/article/details/158735529)

\[56] Enterprise AI Enters the 'Accountability Phase' as 2026 Focus Shifts to Reliability(pdf)[ https://img1.wsimg.com/blobby/go/2cacb495-d600-4bbd-8a3b-92b67e476ea7/downloads/f0d642fb-9407-410b-8936-cfb89f4bfe48/Enterprise-AI-Enters-the-Accountability-Phase-.pdf](https://img1.wsimg.com/blobby/go/2cacb495-d600-4bbd-8a3b-92b67e476ea7/downloads/f0d642fb-9407-410b-8936-cfb89f4bfe48/Enterprise-AI-Enters-the-Accountability-Phase-.pdf)

\[57] AI应用架构师必看!2025年AI系统可靠性设计的6大趋势，提前准备-CSDN博客[ https://blog.csdn.net/2501_91483145/article/details/149881367](https://blog.csdn.net/2501_91483145/article/details/149881367)

\[58] Enterprise AI Observability in 2026: Metrics, Best Practices & Frameworks for Autonomous Systems[ https://www.fluid.ai/blog/enterprise-ai-observability-in-2026](https://www.fluid.ai/blog/enterprise-ai-observability-in-2026)

\[59] Amazon Implements 90-Day Code Safety Reset After AI Agent Causes Series of Retail Website Outages[ https://creati.ai/ai-news/2026-03-13/amazon-90-day-code-safety-reset-ai-agent-retail-outages-2026/](https://creati.ai/ai-news/2026-03-13/amazon-90-day-code-safety-reset-ai-agent-retail-outages-2026/)

\[60] AI in Production: The 2026 Checklist for Reliability and Cost Control[ https://thedatascientist.com/ai-in-production-2026-reliability-cost-control/](https://thedatascientist.com/ai-in-production-2026-reliability-cost-control/)

\[61] 2026 Enterprise AI Trends: What’s Next After the Demo Era[ https://www.gigaspaces.com/blog/enterprise-ai-trends](https://www.gigaspaces.com/blog/enterprise-ai-trends)

\[62] Why reliability in AI applications is now a competitive differentiator[ https://portkey.ai/blog/reliability-in-ai-applications-is-now-a-competitive-differentiator/](https://portkey.ai/blog/reliability-in-ai-applications-is-now-a-competitive-differentiator/)

\[63] AI应用架构师必学:5大可维护性设计技巧，让你的AI系统少出故障-CSDN博客[ https://blog.csdn.net/2401_85133351/article/details/149730256](https://blog.csdn.net/2401_85133351/article/details/149730256)

\[64] 企业AI成熟度模型中的可靠性要求:AI应用架构师的保障技巧-CSDN博客[ https://blog.csdn.net/2502_91869417/article/details/149945102](https://blog.csdn.net/2502_91869417/article/details/149945102)

\[65] ZGI深度解读:企业如何构建可观测、可运维的下一代AI操作系统当AI从概念验证转向生产部署，中国企业面临工程化挑战。ZG - 掘金[ https://juejin.cn/post/7581752508780855339](https://juejin.cn/post/7581752508780855339)

\[66] 企业AI服务系统选型关键因素解析[ https://www.iesdouyin.com/share/note/7486302648086383912/?region=\&mid=0\&u_code=0\&did=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ\&iid=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ\&with_sec_did=1\&video_share_track_ver=\&titleType=title\&schema_type=37\&share_sign=siAeNq.Jt_Ui_mqWjkiFMc6qGVeg.ibljTHpkLQ6nzQ-\&share_version=280700\&ts=1774233208\&from_aid=1128\&from_ssr=1\&share_track_info=%7B%22link_description_type%22%3A%22%22%7D](https://www.iesdouyin.com/share/note/7486302648086383912/?region=&mid=0&u_code=0&did=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ&iid=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ&with_sec_did=1&video_share_track_ver=&titleType=title&schema_type=37&share_sign=siAeNq.Jt_Ui_mqWjkiFMc6qGVeg.ibljTHpkLQ6nzQ-&share_version=280700&ts=1774233208&from_aid=1128&from_ssr=1&share_track_info=%7B%22link_description_type%22%3A%22%22%7D)

\[67] AI模型需要定期维护吗?企业持续运维的实战经验 | 帆软数字化转型知识库[ https://www.fanruan.com/blog/article/1810887/](https://www.fanruan.com/blog/article/1810887/)

\[68] AI 应用浪潮的弹性态势 | IBM[ https://www.ibm.com/cn-zh/think/insights/generative-ai-application-resilience](https://www.ibm.com/cn-zh/think/insights/generative-ai-application-resilience)

\[69] 当AI资本开支年增千亿美元，科技巨头如何平衡技术创新与股东回报?(含视频)|deepseek相关基金|人工智能相关基金|机器人相关基金|国内生产总值|AI投资\_手机新浪网[ https://news.sina.cn/bignews/insight/2026-02-25/detail-inhnyupw2367042.d.html](https://news.sina.cn/bignews/insight/2026-02-25/detail-inhnyupw2367042.d.html)

\[70] Billion-Dollar Infrastructure Deals Fueling the AI Boom as Tech Giants Race for Supremacy[ https://creati.ai/ai-news/2026-03-01/billion-dollar-ai-infrastructure-deals/](https://creati.ai/ai-news/2026-03-01/billion-dollar-ai-infrastructure-deals/)

\[71] OpenAI Secures Record \$110 Billion War Chest as Amazon, Nvidia, and SoftBank Bet Big on the AI Arms Race[ https://www.sci-tech-today.com/news/openai-110-billion-funding/](https://www.sci-tech-today.com/news/openai-110-billion-funding/)

\[72] Big Tech to invest about \$650 billion in AI in 2026, Bridgewater says[ https://m.economictimes.com/tech/artificial-intelligence/big-tech-to-invest-about-650-billion-in-ai-in-2026-bridgewater-says/articleshow/128721675.cms](https://m.economictimes.com/tech/artificial-intelligence/big-tech-to-invest-about-650-billion-in-ai-in-2026-bridgewater-says/articleshow/128721675.cms)

\[73] The \$38 Billion Blueprint: OpenAI and Amazon Redefine the Infrastructure of Intelligence[ http://business.times-online.com/times-online/article/marketminute-2026-3-16-the-38-billion-blueprint-openai-and-amazon-redefine-the-infrastructure-of-intelligence](http://business.times-online.com/times-online/article/marketminute-2026-3-16-the-38-billion-blueprint-openai-and-amazon-redefine-the-infrastructure-of-intelligence)

\[74] Alliance Capitalism in AI: Why Three Hyperscalers Are Spending \$400B+ Together[ https://fourweekmba.com/alliance-capitalism-in-ai-why-three-hyperscalers-are-spending-400b-together/](https://fourweekmba.com/alliance-capitalism-in-ai-why-three-hyperscalers-are-spending-400b-together/)

\[75] Microsoft invests US\$17.5 billion in India to drive AI diffusion at population scale[ https://news.microsoft.com/source/asia/2025/12/09/microsoft-invests-us17-5-billion-in-india-to-drive-ai-diffusion-at-population-scale/](https://news.microsoft.com/source/asia/2025/12/09/microsoft-invests-us17-5-billion-in-india-to-drive-ai-diffusion-at-population-scale/)

\[76] 提示词工程、上下文工程都过时了，现在是Harness Engineering 的时代-虎嗅网[ https://m.huxiu.com/article/4841931.html](https://m.huxiu.com/article/4841931.html)

\[77] Agent 工程最新共识:模型在卷，应用在死，Harness 是新护城河[ https://m.aitntnews.com/newDetail.html?newId=23220](https://m.aitntnews.com/newDetail.html?newId=23220)

\[78] NVIDIA GTC 2026:实时了解 AI 的未来发展 | NVIDIA 英伟达博客[ https://blogs.nvidia.cn/?p=93259](https://blogs.nvidia.cn/?p=93259)

\[79] 别再死磕GPT了!同一颗AI大脑换套马具就封神，OpenClaw就是明证\_卫斯里[ http://m.toutiao.com/group/7617939827723403785/?upstream_biz=doubao](http://m.toutiao.com/group/7617939827723403785/?upstream_biz=doubao)

\[80] Multi-Agent系统Harness Engineering架构的思考与实践-腾讯云开发者社区-腾讯云[ https://cloud.tencent.com/developer/article/2638304](https://cloud.tencent.com/developer/article/2638304)

\[81] Harness raises \$230M at \$3.7B valuation to help developers build software faster - SiliconANGLE[ https://siliconangle.com/2022/04/26/harness-raises-230m-3-7b-valuation-help-developers-build-software-faster/](https://siliconangle.com/2022/04/26/harness-raises-230m-3-7b-valuation-help-developers-build-software-faster/)

\[82] MLOps with Harness[ https://developer.harness.io/docs/continuous-integration/development-guides/mlops/mlops-overview/](https://developer.harness.io/docs/continuous-integration/development-guides/mlops/mlops-overview/)

\[83] OpenAI Introduces Harness Engineering: Codex Agents Power Large‑Scale Software Development[ https://www.infoq.com/news/2026/02/openai-harness-engineering-codex/](https://www.infoq.com/news/2026/02/openai-harness-engineering-codex/)

\[84] Introduction[ https://developer.harness.io/docs/continuous-delivery/kb-articles/articles/cv-multi-service/](https://developer.harness.io/docs/continuous-delivery/kb-articles/articles/cv-multi-service/)

\[85] Open Source MLOps Orchestration | MLRun[ https://www.mlrun.org/](https://www.mlrun.org/)

\[86] AI for Continuous Delivery[ https://www.harness.io/products/continuous-delivery?gh_jid=5785110002](https://www.harness.io/products/continuous-delivery?gh_jid=5785110002)

\[87] AI 工程化核心技巧:从模型训练到自动化部署的全流程优化-CSDN博客[ https://blog.csdn.net/zyxzyx49/article/details/155212228](https://blog.csdn.net/zyxzyx49/article/details/155212228)

\[88] HPE Machine Learning Inference Software[ https://www.hpe.com/psnow/doc/a00140893enw?jumpId=in_nosite_307bd113-8610-43cd-9378-7a27ea7e2cfc_gaiw](https://www.hpe.com/psnow/doc/a00140893enw?jumpId=in_nosite_307bd113-8610-43cd-9378-7a27ea7e2cfc_gaiw)

\[89] Harness Engineering:重塑Al Agent时代的软件工程Harness Engineering:重塑A - 掘金[ https://juejin.cn/post/7617728986828177435](https://juejin.cn/post/7617728986828177435)

\[90] Agent 工程最新共识:模型在卷，应用在死，Harness 是新护城河[ http://www.m.aitntnews.com/newDetail.html?newId=23220](http://www.m.aitntnews.com/newDetail.html?newId=23220)

\[91] 为什么顶级团队开始重押 Harness Engineering?AI Agent 时代的底层答案来了-CSDN博客[ https://blog.csdn.net/fyfugoyfa/article/details/159080607](https://blog.csdn.net/fyfugoyfa/article/details/159080607)

\[92] AI智商爆表却偶有“失手”?别换模型，这套“顶级装备”是关键!\_容智信息[ http://m.toutiao.com/group/7619241948230844937/?upstream_biz=doubao](http://m.toutiao.com/group/7619241948230844937/?upstream_biz=doubao)

\[93] LangChain的最新总结:重构 AI Agent 效能边界系统工程实践\_人工智能微客的技术博客\_51CTO博客[ https://blog.51cto.com/aiweker/14518644](https://blog.51cto.com/aiweker/14518644)

\[94] 扩展生成式人工智能模型开发 — Amazon SageMaker HyperPod — AWS[ https://aws.amazon.com/sagemaker-ai/hyperpod/](https://aws.amazon.com/sagemaker-ai/hyperpod/)

\[95] Harness AI: The Platform for Everything After Code[ https://www.harness.io/blog/announcing-harness-ai?ref=news.dxable.com](https://www.harness.io/blog/announcing-harness-ai?ref=news.dxable.com)

\[96] AI-Native Software Delivery for DevOps[ https://www.harness.io/products/harness-ai](https://www.harness.io/products/harness-ai)

\[97] Harness Platform - Intelligent Software Delivery for AWS Marketplace[ https://aws.amazon.com/marketplace/pp/prodview-wrmqdjrxjdrf2](https://aws.amazon.com/marketplace/pp/prodview-wrmqdjrxjdrf2)

\[98] Overview of Harness AI[ https://developer.harness.io/docs/platform/harness-aida/aida-overview/](https://developer.harness.io/docs/platform/harness-aida/aida-overview/)

\[99] Autonomous Software Delivery: How Harness AI Is Transforming DevOps, Testing, FinOps, and Security Beyond Coding.[ https://www.harness.io/blog/unscripted-2025-announcements](https://www.harness.io/blog/unscripted-2025-announcements)

\[100] Continuous Delivery.[ https://www.harness.io/products/continuous-delivery?tag=true](https://www.harness.io/products/continuous-delivery?tag=true)

\[101] Modern CD[ https://www.harness.io/platform/continuous-delivery](https://www.harness.io/platform/continuous-delivery)

\[102] AI 工程化核心技巧:从模型训练到自动化部署的全流程优化-CSDN博客[ https://blog.csdn.net/zyxzyx49/article/details/155212228](https://blog.csdn.net/zyxzyx49/article/details/155212228)

\[103] 从Prompt到Harness:大模型工程化的三代范式演进与实践-CSDN博客[ https://blog.csdn.net/lvaolan/article/details/159214075](https://blog.csdn.net/lvaolan/article/details/159214075)

\[104] Harness Engineering:重塑Al Agent时代的软件工程Harness Engineering:重塑A - 掘金[ https://juejin.cn/post/7617728986828177435](https://juejin.cn/post/7617728986828177435)

\[105] 最近 爆 火 的 Harness Engineering 是 什么 ？ # ai # 技术 分享 # Agent[ https://www.iesdouyin.com/share/video/7618086164930579764/?region=\&mid=7618086210522712875\&u_code=0\&did=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ\&iid=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ\&with_sec_did=1\&video_share_track_ver=\&titleType=title\&share_sign=YucPgBeeQCPkqSAcbDZkqM9AmBhY2AJ8UKJtHVltOBU-\&share_version=280700\&ts=1774233237\&from_aid=1128\&from_ssr=1\&share_track_info=%7B%22link_description_type%22%3A%22%22%7D](https://www.iesdouyin.com/share/video/7618086164930579764/?region=&mid=7618086210522712875&u_code=0&did=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ&iid=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ&with_sec_did=1&video_share_track_ver=&titleType=title&share_sign=YucPgBeeQCPkqSAcbDZkqM9AmBhY2AJ8UKJtHVltOBU-&share_version=280700&ts=1774233237&from_aid=1128&from_ssr=1&share_track_info=%7B%22link_description_type%22%3A%22%22%7D)

\[106] 为什么顶级团队开始重押 Harness Engineering?AI Agent 时代的底层答案来了-CSDN博客[ https://blog.csdn.net/fyfugoyfa/article/details/159080607](https://blog.csdn.net/fyfugoyfa/article/details/159080607)

\[107] 2026 AI 新范式:Agent Harness 与 Harness Engineering 深度解析\_AI星人[ http://m.toutiao.com/group/7617850534384517674/?upstream_biz=doubao](http://m.toutiao.com/group/7617850534384517674/?upstream_biz=doubao)

\[108] Enterprise software company reduces DevOps tickets by 80%[ https://www.harness.io/case-studies/enterprise-software-and-it-company-80-percent-reduction-in-manual-devops-tickets](https://www.harness.io/case-studies/enterprise-software-and-it-company-80-percent-reduction-in-manual-devops-tickets)

\[109] Relativity enhances deployment efficiency with Harness[ https://www.harness.io/case-studies/secure-continuous-delivery](https://www.harness.io/case-studies/secure-continuous-delivery)

\[110] LogMeIn Standardized CI/CD Pipelines Across Teams[ https://www.harness.io/case-studies/standardized-ci-cd-pipelines](https://www.harness.io/case-studies/standardized-ci-cd-pipelines)

\[111] Public Cloud Migration[ https://www.harness.io/learn/use-cases/public-cloud](https://www.harness.io/learn/use-cases/public-cloud)

\[112] Entur enhances software deployment with Harness success story[ https://www.harness.io/case-studies/entur-improves-deployment-frequency-rollback-time](https://www.harness.io/case-studies/entur-improves-deployment-frequency-rollback-time)

\[113] COMPANY CASESTUDY Overcoming Jenkins Scalability Challenges with Avyka and Harness(pdf)[ https://www.avyka.com/\_files/ugd/e0801c_c058628ea8464be78c0b3d11f5a7226b.pdf](https://www.avyka.com/_files/ugd/e0801c_c058628ea8464be78c0b3d11f5a7226b.pdf)

\[114] 从Prompt到Harness:大模型工程化的三代范式演进与实践-CSDN博客[ https://blog.csdn.net/lvaolan/article/details/159214075](https://blog.csdn.net/lvaolan/article/details/159214075)

\[115] 一些 Harness Engineering 的实践-阿里云开发者社区[ https://developer.aliyun.com/article/1718179](https://developer.aliyun.com/article/1718179)

\[116] 模型不是关键，harness才是[ http://news.qq.com/rain/a/20260322A02XZ900](http://news.qq.com/rain/a/20260322A02XZ900)

\[117] 最近 爆 火 的 Harness Engineering 是 什么 ？ # ai # 技术 分享 # Agent[ https://www.iesdouyin.com/share/video/7618086164930579764/?region=\&mid=7618086210522712875\&u_code=0\&did=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ\&iid=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ\&with_sec_did=1\&video_share_track_ver=\&titleType=title\&share_sign=YucPgBeeQCPkqSAcbDZkqM9AmBhY2AJ8UKJtHVltOBU-\&share_version=280700\&ts=1774233247\&from_aid=1128\&from_ssr=1\&share_track_info=%7B%22link_description_type%22%3A%22%22%7D](https://www.iesdouyin.com/share/video/7618086164930579764/?region=&mid=7618086210522712875&u_code=0&did=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ&iid=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ&with_sec_did=1&video_share_track_ver=&titleType=title&share_sign=YucPgBeeQCPkqSAcbDZkqM9AmBhY2AJ8UKJtHVltOBU-&share_version=280700&ts=1774233247&from_aid=1128&from_ssr=1&share_track_info=%7B%22link_description_type%22%3A%22%22%7D)

\[118] 为什么顶级团队开始重押 Harness Engineering?AI Agent 时代的底层答案来了-CSDN博客[ https://blog.csdn.net/fyfugoyfa/article/details/159080607](https://blog.csdn.net/fyfugoyfa/article/details/159080607)

\[119] AI新范式:驾驭工程。从“野模型”到生产力，实战解读\_架构师勇哥[ http://m.toutiao.com/group/7619230911678202394/?upstream_biz=doubao](http://m.toutiao.com/group/7619230911678202394/?upstream_biz=doubao)

\[120] 提示词工程、上下文工程都过时了，现在是 Harness Engineering 的时代\_FounderPark[ http://m.toutiao.com/group/7616734587578597940/?upstream_biz=doubao](http://m.toutiao.com/group/7616734587578597940/?upstream_biz=doubao)

\[121] Harness Engineering:重塑Al Agent时代的软件工程Harness Engineering:重塑A - 掘金[ https://juejin.cn/post/7617728986828177435](https://juejin.cn/post/7617728986828177435)

\[122] 开源与第三方视角:Thoughtworks、LangChain等如何看待Harness Engineering?\_langchain 和harness-CSDN博客[ https://blog.csdn.net/weixin_53961451/article/details/158935562](https://blog.csdn.net/weixin_53961451/article/details/158935562)

\[123] 什么 是 Harness ？ 一个 公式 ： Agent = Model + Harness 模型 是 原始 智能 ， Harness 是 让 智能 变得 可用 的 一切 包括 工具 调用 、 记忆 系统 、 沙箱 环境 、 编排 逻辑 Harness 这个 词 来自 马具 （ 缰绳 + 马鞍 ） 驯服 和 引导 大模型 的 力量 【 裸 模型 的 四 个 缺陷 】 没有 跨 会话 记忆 ， 每次 都是 初见 不能 执行 代码 、 搜索 网页 、 操作 文件 知识 截止 于 训练 日期 ， 不 知道 今天 的 新闻 没有 运行 环境 ， 不能 装包 跑 程序 这 四 个 缺陷 都 需要 Harness 来 补齐 【 六大 核心 组件 】 System Prompt （ 定义 Agent 身份 和 行为 规则 ） Tools / MCP （ 让 Agent 调用 外部 工具 ） File system / Sandbox （ 安全 隔离 的 执行 环境 ） Memory （ 跨 会话 记忆 系统 ） Orchestration （ 子 Agent 编排 和 任务 路由 ） Hooks / Middleware （ 确定性 质量 关卡 ） 【 三代 AI 工程 的 演进 】 Prompt Engineering （ 2022 - 2023 ） 只管 输入 文本 Context Engineering （ 2024 - 2025 ） 管理 整个 上下文 窗口 Harness Engineering （ 2026 ） 构建 模型 之外 的 完整 系统 Prompt ⊂ Context ⊂ Harness ， 每 一代 包含 前 一代 【 实战 案例 】 OpenAI 团队 ： 5 个 月 零 行 手写 代码 ， 100 万 行 AI 生成 Anthropic Claude Agent SDK ： 压缩 策略 让 Agent 跨 窗口 持续 工作 Lang Chain ReAct 循环 ： 推理 → 行动 → 观察 → 再 推理 核心 发现 ： 改进 Harness 比 改进 模型 本身 更 能 提升 表现 【 未来 展望 】 Harness 可能 变成 开箱 即 用 的 服务 模板 技术 栈 选型 将 考虑 AI 友好 性 和 Harness 兼容性 Pre - AI 和 Post - AI 代码 库 的 维护 方式 将 分叉 最大 挑战 不是 生成 代码 ， 而是 设计 环境 和 反馈 循环 # Harness Engineering # AI 工程 # Agent # Prompt 工程 # 上下文 工程[ https://www.iesdouyin.com/share/note/7619991841211851456/?region=\&mid=7619294467664808740\&u_code=0\&did=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ\&iid=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ\&with_sec_did=1\&video_share_track_ver=\&titleType=title\&schema_type=37\&share_sign=fTC61eVrzozmTeZG_7EvTXJ_OISM1pXlJwPSRsKUbnE-\&share_version=280700\&ts=1774233257\&from_aid=1128\&from_ssr=1\&share_track_info=%7B%22link_description_type%22%3A%22%22%7D](https://www.iesdouyin.com/share/note/7619991841211851456/?region=&mid=7619294467664808740&u_code=0&did=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ&iid=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ&with_sec_did=1&video_share_track_ver=&titleType=title&schema_type=37&share_sign=fTC61eVrzozmTeZG_7EvTXJ_OISM1pXlJwPSRsKUbnE-&share_version=280700&ts=1774233257&from_aid=1128&from_ssr=1&share_track_info=%7B%22link_description_type%22%3A%22%22%7D)

\[124] 模型不是关键，Harness 才是\_搜狐网[ https://m.sohu.com/a/999768879_122189055/](https://m.sohu.com/a/999768879_122189055/)

\[125] 2026 AI 新范式:Agent Harness 与 Harness Engineering 深度解析\_AI星人[ http://m.toutiao.com/group/7617850534384517674/?upstream_biz=doubao](http://m.toutiao.com/group/7617850534384517674/?upstream_biz=doubao)

\[126] Multi-Agent系统Harness Engineering架构的思考与实践-腾讯云开发者社区-腾讯云[ https://cloud.tencent.com/developer/article/2638304](https://cloud.tencent.com/developer/article/2638304)

\[127] Top 10 Experiment Tracking Tools: Features, Pros, Cons & Comparison[ https://www.scmgalaxy.com/tutorials/top-10-experiment-tracking-tools-features-pros-cons-comparison/](https://www.scmgalaxy.com/tutorials/top-10-experiment-tracking-tools-features-pros-cons-comparison/)

\[128] Top 10 Experiment Tracking Tools: Features, Pros, Cons & Comparison[ https://gurukulgalaxy.com/blog/top-10-experiment-tracking-tools-features-pros-cons-comparison/](https://gurukulgalaxy.com/blog/top-10-experiment-tracking-tools-features-pros-cons-comparison/)

\[129] Top 10 Experiment Tracking Tools: Features, Pros, Cons and Comparison[ https://www.bestdevops.com/top-10-experiment-tracking-tools-features-pros-cons-and-comparison/](https://www.bestdevops.com/top-10-experiment-tracking-tools-features-pros-cons-and-comparison/)

\[130] Top 10 Experiment Tracking Tools: Features, Pros, Cons & Comparison[ https://www.devopsschool.com/blog/top-10-experiment-tracking-tools-features-pros-cons-comparison/](https://www.devopsschool.com/blog/top-10-experiment-tracking-tools-features-pros-cons-comparison/)

\[131] Top 12 AI and LLM Observability Tools in 2026 Compared: Open-Source and Paid[ https://www.onpage.com/top-12-ai-and-llm-observability-tools-in-2026-compared-open-source-and-paid/](https://www.onpage.com/top-12-ai-and-llm-observability-tools-in-2026-compared-open-source-and-paid/)

\[132] Best AI Observability Tools in 2026[ https://www.confident-ai.com/knowledge-base/best-ai-observability-tools-2026](https://www.confident-ai.com/knowledge-base/best-ai-observability-tools-2026)

\[133] AI observability tools: A buyer's guide to monitoring AI agents in production (2026)[ https://www.braintrust.dev/articles/best-ai-observability-tools-2026](https://www.braintrust.dev/articles/best-ai-observability-tools-2026)

\[134] Harness[ https://devsuite.co/harness](https://devsuite.co/harness)

\[135] Flexible and Modular Pricing[ https://www.harness.io/pricing](https://www.harness.io/pricing)

\[136] Securing AI and Securing With AI: AI Security from Code to Runtime With Harness[ https://www.harness.io/blog/securing-ai-and-securing-with-ai-ai-security-from-code-to-runtime-with-harness](https://www.harness.io/blog/securing-ai-and-securing-with-ai-ai-security-from-code-to-runtime-with-harness)

\[137] Harness: AI for DevOps, Testing, AppSec, and Cost Optimization[ https://www.harness.io/](https://www.harness.io/)

\[138] Harness AI February 2026 Updates: Securing & Making the SDLC Reliable and Shipping Faster with Agents[ https://www.harness.io/blog/harness-ai-february-2026-updates](https://www.harness.io/blog/harness-ai-february-2026-updates)

\[139] Harness Platform[ https://omr.com/de/reviews/product/harness](https://omr.com/de/reviews/product/harness)

\[140] Getting started with Harness Platform[ https://developer.harness.io/docs/platform/get-started/onboarding-guide/](https://developer.harness.io/docs/platform/get-started/onboarding-guide/)

\[141] Harness Engineering:重塑Al Agent时代的软件工程 - 技术栈[ https://jishuzhan.net/article/2033727838759747586](https://jishuzhan.net/article/2033727838759747586)

\[142] 什么 是 Harness ？ 一个 公式 ： Agent = Model + Harness 模型 是 原始 智能 ， Harness 是 让 智能 变得 可用 的 一切 包括 工具 调用 、 记忆 系统 、 沙箱 环境 、 编排 逻辑 Harness 这个 词 来自 马具 （ 缰绳 + 马鞍 ） 驯服 和 引导 大模型 的 力量 【 裸 模型 的 四 个 缺陷 】 没有 跨 会话 记忆 ， 每次 都是 初见 不能 执行 代码 、 搜索 网页 、 操作 文件 知识 截止 于 训练 日期 ， 不 知道 今天 的 新闻 没有 运行 环境 ， 不能 装包 跑 程序 这 四 个 缺陷 都 需要 Harness 来 补齐 【 六大 核心 组件 】 System Prompt （ 定义 Agent 身份 和 行为 规则 ） Tools / MCP （ 让 Agent 调用 外部 工具 ） File system / Sandbox （ 安全 隔离 的 执行 环境 ） Memory （ 跨 会话 记忆 系统 ） Orchestration （ 子 Agent 编排 和 任务 路由 ） Hooks / Middleware （ 确定性 质量 关卡 ） 【 三代 AI 工程 的 演进 】 Prompt Engineering （ 2022 - 2023 ） 只管 输入 文本 Context Engineering （ 2024 - 2025 ） 管理 整个 上下文 窗口 Harness Engineering （ 2026 ） 构建 模型 之外 的 完整 系统 Prompt ⊂ Context ⊂ Harness ， 每 一代 包含 前 一代 【 实战 案例 】 OpenAI 团队 ： 5 个 月 零 行 手写 代码 ， 100 万 行 AI 生成 Anthropic Claude Agent SDK ： 压缩 策略 让 Agent 跨 窗口 持续 工作 Lang Chain ReAct 循环 ： 推理 → 行动 → 观察 → 再 推理 核心 发现 ： 改进 Harness 比 改进 模型 本身 更 能 提升 表现 【 未来 展望 】 Harness 可能 变成 开箱 即 用 的 服务 模板 技术 栈 选型 将 考虑 AI 友好 性 和 Harness 兼容性 Pre - AI 和 Post - AI 代码 库 的 维护 方式 将 分叉 最大 挑战 不是 生成 代码 ， 而是 设计 环境 和 反馈 循环 # Harness Engineering # AI 工程 # Agent # Prompt 工程 # 上下文 工程[ https://www.iesdouyin.com/share/note/7619991841211851456/?region=\&mid=7619294467664808740\&u_code=0\&did=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ\&iid=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ\&with_sec_did=1\&video_share_track_ver=\&titleType=title\&schema_type=37\&share_sign=fTC61eVrzozmTeZG_7EvTXJ_OISM1pXlJwPSRsKUbnE-\&share_version=280700\&ts=1774233276\&from_aid=1128\&from_ssr=1\&share_track_info=%7B%22link_description_type%22%3A%22%22%7D](https://www.iesdouyin.com/share/note/7619991841211851456/?region=&mid=7619294467664808740&u_code=0&did=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ&iid=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ&with_sec_did=1&video_share_track_ver=&titleType=title&schema_type=37&share_sign=fTC61eVrzozmTeZG_7EvTXJ_OISM1pXlJwPSRsKUbnE-&share_version=280700&ts=1774233276&from_aid=1128&from_ssr=1&share_track_info=%7B%22link_description_type%22%3A%22%22%7D)

\[143] Harness 工程:构建让 AI 智能体真正发挥作用的系统全指南 (2026) | NxCode[ https://www.nxcode.io/zh/resources/news/harness-engineering-complete-guide-ai-agent-codex-2026](https://www.nxcode.io/zh/resources/news/harness-engineering-complete-guide-ai-agent-codex-2026)

\[144] 模型不是关键，Harness 才是\_搜狐网[ https://m.sohu.com/a/999768879_122189055/](https://m.sohu.com/a/999768879_122189055/)

\[145] 为什么顶级团队开始重押 Harness Engineering?AI Agent 时代的底层答案来了-CSDN博客[ https://blog.csdn.net/fyfugoyfa/article/details/159080607](https://blog.csdn.net/fyfugoyfa/article/details/159080607)

\[146] How to Create a Harness Pipeline and integrate with Azure[ https://techcommunity.microsoft.com/blog/azureinfrastructureblog/how-to-create-a-harness-pipeline-and-integrate-with-azure/4499862](https://techcommunity.microsoft.com/blog/azureinfrastructureblog/how-to-create-a-harness-pipeline-and-integrate-with-azure/4499862)

\[147] SEI 2.0 - Onboarding Guide[ https://developer.harness.io/docs/software-engineering-insights/harness-sei/get-started/sei-onboarding-guide/](https://developer.harness.io/docs/software-engineering-insights/harness-sei/get-started/sei-onboarding-guide/)

\[148] Harness Engineering with LangChain DeepAgents and LangSmith[ https://www.analyticsvidhya.com/blog/2026/03/harness-engineering/](https://www.analyticsvidhya.com/blog/2026/03/harness-engineering/)

\[149] Solidworks Electrical - Wiring harness design[ https://www.udemy.com/course/solidworks-electrical-wiring-harness-design/?srsltid=AfmBOopvGDCq1jE16SB3G1eHgbc47IXWV7U-8WHUgTEthd4nlnb257EP](https://www.udemy.com/course/solidworks-electrical-wiring-harness-design/?srsltid=AfmBOopvGDCq1jE16SB3G1eHgbc47IXWV7U-8WHUgTEthd4nlnb257EP)

\[150] Your first STO pipeline[ https://developer.harness.io/docs/security-testing-orchestration/get-started/your-first-sto-pipeline/](https://developer.harness.io/docs/security-testing-orchestration/get-started/your-first-sto-pipeline/)

\[151] Harness Engineering:重塑Al Agent时代的软件工程Harness Engineering:重塑A - 掘金[ https://juejin.cn/post/7617728986828177435](https://juejin.cn/post/7617728986828177435)

\[152] 最近 爆 火 的 Harness Engineering 是 什么 ？ # ai # 技术 分享 # Agent[ https://www.iesdouyin.com/share/video/7618086164930579764/?region=\&mid=7618086210522712875\&u_code=0\&did=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ\&iid=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ\&with_sec_did=1\&video_share_track_ver=\&titleType=title\&share_sign=YucPgBeeQCPkqSAcbDZkqM9AmBhY2AJ8UKJtHVltOBU-\&share_version=280700\&ts=1774233287\&from_aid=1128\&from_ssr=1\&share_track_info=%7B%22link_description_type%22%3A%22%22%7D](https://www.iesdouyin.com/share/video/7618086164930579764/?region=&mid=7618086210522712875&u_code=0&did=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ&iid=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ&with_sec_did=1&video_share_track_ver=&titleType=title&share_sign=YucPgBeeQCPkqSAcbDZkqM9AmBhY2AJ8UKJtHVltOBU-&share_version=280700&ts=1774233287&from_aid=1128&from_ssr=1&share_track_info=%7B%22link_description_type%22%3A%22%22%7D)

\[153] Harness Engineering 深度解读:AI Agent 时代的工程范式革命一、什么是 Harness Eng - 掘金[ https://juejin.cn/post/7617781226363256866](https://juejin.cn/post/7617781226363256866)

\[154] 开源与第三方视角:Thoughtworks、LangChain等如何看待Harness Engineering?\_langchain 和harness-CSDN博客[ https://blog.csdn.net/weixin_53961451/article/details/158935562](https://blog.csdn.net/weixin_53961451/article/details/158935562)

\[155] 从“调教”到“驾驭”:为什么 Harness Engineering 正在取代提示词工程?\_人人都是产品经理[ http://m.toutiao.com/group/7620270752893370914/?upstream_biz=doubao](http://m.toutiao.com/group/7620270752893370914/?upstream_biz=doubao)

\[156] 提示词工程、上下文工程都过时了，现在是 Harness Engineering 的时代\_FounderPark[ http://m.toutiao.com/group/7616734587578597940/?upstream_biz=doubao](http://m.toutiao.com/group/7616734587578597940/?upstream_biz=doubao)

\[157] 为什么有的程序员 “越老越吃香”?只因吃透了这 5 个技巧\_为什么这几年年龄大的程序员更吃香了-CSDN博客[ https://blog.csdn.net/2503_92604243/article/details/149868229](https://blog.csdn.net/2503_92604243/article/details/149868229)

\[158] Importance of Programming in Engineering[ https://data-flair.training/blogs/importance-of-programming-in-engineering/](https://data-flair.training/blogs/importance-of-programming-in-engineering/)

\[159] Crossing Over: How Skills from Other Industries Can Boost Your Coding Career[ https://algocademy.com/blog/crossing-over-how-skills-from-other-industries-can-boost-your-coding-career/](https://algocademy.com/blog/crossing-over-how-skills-from-other-industries-can-boost-your-coding-career/)

\[160] Programming for Engineers[ https://engineers.tools/articles/programming-for-engineers/](https://engineers.tools/articles/programming-for-engineers/)

\[161] How to become a better software engineer: A guide for all levels[ https://codesignal.com/blog/how-to-become-a-better-software-engineer/](https://codesignal.com/blog/how-to-become-a-better-software-engineer/)

\[162] Computer Programmers Benefits: 13 Reasons Coding Is Worth Learning[ https://blog.codeitbro.com/top-benefits-of-computer-programming/](https://blog.codeitbro.com/top-benefits-of-computer-programming/)

\[163] Effective_Engineer.md · GitHub[ https://gist.github.com/rondy/af1dee1d28c02e9a225ae55da2674a6f](https://gist.github.com/rondy/af1dee1d28c02e9a225ae55da2674a6f)

\[164] 打破35岁魔咒!资深程序员借助AI逆袭人生，在大模型时代成为真正的王者!-CSDN博客[ https://blog.csdn.net/m0_71746299/article/details/156151022](https://blog.csdn.net/m0_71746299/article/details/156151022)

\[165] 100万行代码0手写!工程师5个月只干1件事，AI环境设计成新护城河\_刊刊精选[ http://m.toutiao.com/group/7618788413872914995/?upstream_biz=doubao](http://m.toutiao.com/group/7618788413872914995/?upstream_biz=doubao)

\[166] 最近 爆 火 的 Harness Engineering 是 什么 ？ # ai # 技术 分享 # Agent[ https://www.iesdouyin.com/share/video/7618086164930579764/?region=\&mid=7618086210522712875\&u_code=0\&did=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ\&iid=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ\&with_sec_did=1\&video_share_track_ver=\&titleType=title\&share_sign=YucPgBeeQCPkqSAcbDZkqM9AmBhY2AJ8UKJtHVltOBU-\&share_version=280700\&ts=1774233294\&from_aid=1128\&from_ssr=1\&share_track_info=%7B%22link_description_type%22%3A%22%22%7D](https://www.iesdouyin.com/share/video/7618086164930579764/?region=&mid=7618086210522712875&u_code=0&did=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ&iid=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ&with_sec_did=1&video_share_track_ver=&titleType=title&share_sign=YucPgBeeQCPkqSAcbDZkqM9AmBhY2AJ8UKJtHVltOBU-&share_version=280700&ts=1774233294&from_aid=1128&from_ssr=1&share_track_info=%7B%22link_description_type%22%3A%22%22%7D)

\[167] 为什么顶级团队开始重押 Harness Engineering?AI Agent 时代的底层答案来了-CSDN博客[ https://blog.csdn.net/fyfugoyfa/article/details/159080607](https://blog.csdn.net/fyfugoyfa/article/details/159080607)

\[168] Harness Engineering:重塑Al Agent时代的软件工程Harness Engineering:重塑A - 掘金[ https://juejin.cn/post/7617728986828177435](https://juejin.cn/post/7617728986828177435)

\[169] Harness Engineering:重塑Al Agent时代的软件工程Harness Engineering:重塑A - 掘金[ https://juejin.cn/post/7617728986828177435](https://juejin.cn/post/7617728986828177435)

\[170] CD certification guide[ https://developer.harness.io/docs/continuous-delivery/cd-onboarding/onboarding-guide/](https://developer.harness.io/docs/continuous-delivery/cd-onboarding/onboarding-guide/)

\[171] Harness Developer Hub[ https://developer.harness.io/#community](https://developer.harness.io/#community)

\[172] How to Create a Harness Pipeline and integrate with Azure[ https://techcommunity.microsoft.com/blog/azureinfrastructureblog/how-to-create-a-harness-pipeline-and-integrate-with-azure/4499862](https://techcommunity.microsoft.com/blog/azureinfrastructureblog/how-to-create-a-harness-pipeline-and-integrate-with-azure/4499862)

\[173] SEI 2.0 - Onboarding Guide[ https://developer.harness.io/docs/software-engineering-insights/harness-sei/get-started/sei-onboarding-guide/](https://developer.harness.io/docs/software-engineering-insights/harness-sei/get-started/sei-onboarding-guide/)

\[174] stefanberreth / Agentic-Engineering-Harness · GitLab[ https://gitlab.com/stefanberreth/agentic-engineering-harness/-/tree/main](https://gitlab.com/stefanberreth/agentic-engineering-harness/-/tree/main)

\[175] Solidworks Electrical - Wiring harness design[ https://www.udemy.com/course/solidworks-electrical-wiring-harness-design/?srsltid=AfmBOopvGDCq1jE16SB3G1eHgbc47IXWV7U-8WHUgTEthd4nlnb257EP](https://www.udemy.com/course/solidworks-electrical-wiring-harness-design/?srsltid=AfmBOopvGDCq1jE16SB3G1eHgbc47IXWV7U-8WHUgTEthd4nlnb257EP)

\[176] Harness Engineering:给 AI 套上缰绳的工程学(通俗易懂)-CSDN博客[ https://blog.csdn.net/m0_74382565/article/details/159280492](https://blog.csdn.net/m0_74382565/article/details/159280492)

\[177] 最近 爆 火 的 Harness Engineering 是 什么 ？ # ai # 技术 分享 # Agent[ https://www.iesdouyin.com/share/video/7618086164930579764/?region=\&mid=7618086210522712875\&u_code=0\&did=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ\&iid=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ\&with_sec_did=1\&video_share_track_ver=\&titleType=title\&share_sign=YucPgBeeQCPkqSAcbDZkqM9AmBhY2AJ8UKJtHVltOBU-\&share_version=280700\&ts=1774233300\&from_aid=1128\&from_ssr=1\&share_track_info=%7B%22link_description_type%22%3A%22%22%7D](https://www.iesdouyin.com/share/video/7618086164930579764/?region=&mid=7618086210522712875&u_code=0&did=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ&iid=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ&with_sec_did=1&video_share_track_ver=&titleType=title&share_sign=YucPgBeeQCPkqSAcbDZkqM9AmBhY2AJ8UKJtHVltOBU-&share_version=280700&ts=1774233300&from_aid=1128&from_ssr=1&share_track_info=%7B%22link_description_type%22%3A%22%22%7D)

\[178] Harness Engineering — AI 时代的工程最佳实践大家好，我是桦说编程。 你正在经历这些痛点吗? 如果 - 掘金[ https://juejin.cn/post/7615250753935048723](https://juejin.cn/post/7615250753935048723)

\[179] 开源与第三方视角:Thoughtworks、LangChain等如何看待Harness Engineering?\_langchain 和harness-CSDN博客[ https://blog.csdn.net/weixin_53961451/article/details/158935562](https://blog.csdn.net/weixin_53961451/article/details/158935562)

\[180] 🏇Harness Engineer - 让Agent Coding从Assist到AutoHarness Engine - 掘金[ https://juejin.cn/post/7616576373167423530](https://juejin.cn/post/7616576373167423530)

\[181] AI 项目工程实践中的技术文档写作秘籍:结构思维 × 工具协同 × 可复用模板打造全流程指南\_使用ai互联网开发实践文档-CSDN博客[ https://blog.csdn.net/sinat_28461591/article/details/148349029](https://blog.csdn.net/sinat_28461591/article/details/148349029)

\[182] A practical guide to AI technical blog writing[ https://www.eesel.ai/blog/ai-technical-blog-writing](https://www.eesel.ai/blog/ai-technical-blog-writing)

\[183] Tech blog writing: A complete guide to creating content that ranks[ https://www.eesel.ai/blog/tech-blog-writing](https://www.eesel.ai/blog/tech-blog-writing)

\[184] Tech Blog Article Writing[ https://docsbot.ai/prompts/writing/tech-blog-article-writing](https://docsbot.ai/prompts/writing/tech-blog-article-writing)

\[185] AI in technical writing: comprehensive guide for documentation professionals[ https://instrktiv.com/en/ai-in-technical-writing/](https://instrktiv.com/en/ai-in-technical-writing/)

\[186] How AI is Enhancing Tech Content Writing[ https://coruzant.com/ai/tech-content-writing-with-ai/](https://coruzant.com/ai/tech-content-writing-with-ai/)

\[187] AI Impact on Tech Writers: Job Displacement and Automation[ https://ubos.tech/news/ai-impact-on-tech-writers-job-displacement-and-automation/](https://ubos.tech/news/ai-impact-on-tech-writers-job-displacement-and-automation/)

\[188] 深度AI生成内容账号运营策略教你打造爆款编程技术博客-CSDN博客[ https://blog.csdn.net/hy2057504081/article/details/153198126](https://blog.csdn.net/hy2057504081/article/details/153198126)

\[189] AI写作助手技术博客创作横向评测:从ChatGPT到Claude的实战对决\_claude和chatgpt生成文章最好的模型-CSDN博客[ https://blog.csdn.net/zzywxc787/article/details/156749141](https://blog.csdn.net/zzywxc787/article/details/156749141)

\[190] 当 自治 阈值 被 跨越 ： Agent 跑 通 开发 闭环 当 自治 阈值 被 跨越 ： Agent 跑 通 开发 闭环 - openai 《 Harness engineering : leveraging Codex in an agent - first world 》 ⑤ # 大模型 开发 # ai 应用 开发 # agent # codex # openai[ https://www.iesdouyin.com/share/video/7610389804173364516/?region=\&mid=7610390122688809791\&u_code=0\&did=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ\&iid=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ\&with_sec_did=1\&video_share_track_ver=\&titleType=title\&share_sign=cUl2AJjkUww7BkYCmC1E33.Nc4UzlGyvc7.2VkBUGNY-\&share_version=280700\&ts=1774233312\&from_aid=1128\&from_ssr=1\&share_track_info=%7B%22link_description_type%22%3A%22%22%7D](https://www.iesdouyin.com/share/video/7610389804173364516/?region=&mid=7610390122688809791&u_code=0&did=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ&iid=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ&with_sec_did=1&video_share_track_ver=&titleType=title&share_sign=cUl2AJjkUww7BkYCmC1E33.Nc4UzlGyvc7.2VkBUGNY-&share_version=280700&ts=1774233312&from_aid=1128&from_ssr=1&share_track_info=%7B%22link_description_type%22%3A%22%22%7D)

\[191] 从 AI Agent 到模型推理:端到端 AI 可观测实践\_alibabass的技术博客\_51CTO博客[ https://blog.51cto.com/u_13778063/13985486](https://blog.51cto.com/u_13778063/13985486)

\[192] OpenAI 内部实验：100 万行代码，0 行手写 — Codex Agent-First 工程实践全解析[ https://github.com/Quriosity-agent/articles/blob/main/2026-03-01/openai-harness-engineering-codex.md](https://github.com/Quriosity-agent/articles/blob/main/2026-03-01/openai-harness-engineering-codex.md)

\[193] 技术文档写作指南:从实践经验到结构化表达的全流程方法论\_文档结构化技术方法-CSDN博客[ https://blog.csdn.net/u012380034/article/details/148493850](https://blog.csdn.net/u012380034/article/details/148493850)

\[194] About Case Studies:[ https://procomm.ieee.org/transactions-of-professional-communication/for-prospective-authors/guidelines-to-follow/preparing-a-case-study/](https://procomm.ieee.org/transactions-of-professional-communication/for-prospective-authors/guidelines-to-follow/preparing-a-case-study/)

\[195] How to Write Case Studies That Work[ https://www.timelytext.com/how-to-write-case-studies/](https://www.timelytext.com/how-to-write-case-studies/)

\[196] Writing Effective Case Studies: A Step-by-Step Guide, Slides of Technical Writing[ https://www.docsity.com/en/docs/case-studies-learning-from-real-world-scenarios/11372419/](https://www.docsity.com/en/docs/case-studies-learning-from-real-world-scenarios/11372419/)

\[197] Crafting Effective Case Studies and Whitepapers for Technical Audiences[ https://www.xgrid.co/resources/effective-case-studies-whitepapers-technical-audiences/](https://www.xgrid.co/resources/effective-case-studies-whitepapers-technical-audiences/)

\[198] How to present a case study?[ https://www.clrn.org/how-to-present-a-case-study/](https://www.clrn.org/how-to-present-a-case-study/)

\[199] How to write up your case study[ https://www.monash.edu/student-academic-success/excel-at-writing/annotated-assessment-samples/business-and-economics/buseco-writing-case-studies/how-to-write-up-your-case-study](https://www.monash.edu/student-academic-success/excel-at-writing/annotated-assessment-samples/business-and-economics/buseco-writing-case-studies/how-to-write-up-your-case-study)

\[200] AI 项目工程实践中的技术文档写作秘籍:结构思维 × 工具协同 × 可复用模板打造全流程指南\_使用ai互联网开发实践文档-CSDN博客[ https://blog.csdn.net/sinat_28461591/article/details/148349029](https://blog.csdn.net/sinat_28461591/article/details/148349029)

\[201] 87%的案例学习都停留在"看热闹"——用这套AI指令把案例变成你的决策资产-阿里云开发者社区[ https://developer.aliyun.com:443/article/1708905](https://developer.aliyun.com:443/article/1708905)

\[202] CSDN 创作者干货:AI 技术文写作框架，从原理到案例快速出稿\_csdn大量ai文-CSDN博客[ https://blog.csdn.net/LplLpl11/article/details/155831259](https://blog.csdn.net/LplLpl11/article/details/155831259)

\[203] 桂林市教育数字化转型优秀案例结构化写作指南[ https://www.iesdouyin.com/share/note/7491660435180080411/?region=\&mid=7460154641456679707\&u_code=0\&did=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ\&iid=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ\&with_sec_did=1\&video_share_track_ver=\&titleType=title\&schema_type=37\&share_sign=mSJJBOsGfqiaKckgaM2Kc3F.DNlsGqdLjAxvZd98JBI-\&share_version=280700\&ts=1774233319\&from_aid=1128\&from_ssr=1\&share_track_info=%7B%22link_description_type%22%3A%22%22%7D](https://www.iesdouyin.com/share/note/7491660435180080411/?region=&mid=7460154641456679707&u_code=0&did=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ&iid=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ&with_sec_did=1&video_share_track_ver=&titleType=title&schema_type=37&share_sign=mSJJBOsGfqiaKckgaM2Kc3F.DNlsGqdLjAxvZd98JBI-&share_version=280700&ts=1774233319&from_aid=1128&from_ssr=1&share_track_info=%7B%22link_description_type%22%3A%22%22%7D)

\[204] Structuring Case Studies for AI Retrieval and Citations[ https://www.singlegrain.com/casestudies/structuring-case-studies-for-ai-retrieval-and-citations/](https://www.singlegrain.com/casestudies/structuring-case-studies-for-ai-retrieval-and-citations/)

\[205] 写作即思考:工程师如何用技术文档完成逻辑的『认知复利』-阿里云开发者社区[ https://developer.aliyun.com/article/1660248](https://developer.aliyun.com/article/1660248)

\[206] 案例分析报告撰写模板.doc-原创力文档[ https://m.book118.com/html/2026/0320/6031100044012113.shtm](https://m.book118.com/html/2026/0320/6031100044012113.shtm)

> （注：文档部分内容可能由 AI 生成）
