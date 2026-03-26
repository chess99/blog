---
title: Agents - Google智能体白皮书
pid: 110
slug: google-agents-whitepaper
alias:
  - /posts/110/
date: 2025-05-27 00:00:00
tags:
  - 智能体
  - Google
  - 白皮书
categories:
  - AI论文解读
---

原文: https://www.kaggle.com/whitepaper-agents

生成式 AI 模型可以通过训练来使用工具，以访问实时信息或建议现实世界中的行动。当模型具备推理、逻辑和外部信息获取能力时，就引出了**智能体（agent）**的概念——一种超越了独立生成式 AI 模型能力的程序。本文是 Google 发布的智能体白皮书中文整理。

<!-- more -->

## 引言

人类非常擅长处理复杂的模式识别任务。然而，在得出结论之前，他们通常依赖书籍、谷歌搜索或计算器等工具来补充先验知识。与人类一样，生成式 AI 模型也可以通过训练来使用工具，以访问实时信息或建议现实世界中的行动。例如，模型可以利用数据库检索工具访问特定信息，如客户的购买历史，从而生成量身定制的购物推荐。或者，根据用户的查询，模型可以进行各种 API 调用，以向同事发送电子邮件回复或代为完成金融交易。为此，模型不仅需要访问一组外部工具，还需要能够以自我指导的方式规划和执行任何任务。本白皮书将更详细地探讨所有这些方面及相关问题。

## 什么是智能体？

从最根本的形式上讲，生成式 AI 智能体可以定义为一种应用程序，它通过观察世界并使用其掌握的工具对其采取行动来尝试实现某个目标。智能体是自主的，可以独立于人类干预而行动，尤其是在为其提供了明确的目标或要实现的目的时。智能体在实现其目标的方法上也可以是主动的。即使在没有人类明确指令集的情况下，智能体也可以推理出下一步应该做什么来实现其最终目标。虽然人工智能中智能体的概念相当普遍且强大，但本白皮书侧重于截至发布时生成式 AI 模型能够构建的特定类型的智能体。

为了理解智能体的内部运作方式，让我们首先介绍驱动智能体行为、行动和决策的基础组件。这些组件的组合可以描述为一种认知架构，通过混合和匹配这些组件可以实现多种这样的架构。关注核心功能，智能体的认知架构中有三个基本组件，如图 1 所示。

![](/images/notes/14721d613f93e9fcba8e38ee5616ffa9387fc4a15478ec428f00067bdc82e1be.jpg)
图 1. 通用智能体架构和组件

### 模型

在智能体的范畴内，模型指的是语言模型 (LM)，它将作为智能体流程的中心决策者。智能体使用的模型可以是一个或多个任意大小（小型/大型）的语言模型，这些模型能够遵循基于指令的推理和逻辑框架，如 ReAct、思维链 (Chain-of-Thought) 或思维树 (Tree-of-Thoughts)。根据特定智能体架构的需求，模型可以是通用模型、多模态模型或经过微调的模型。为了获得最佳的生产效果，您应该利用最适合您期望的最终应用程序的模型，并且理想情况下，该模型应使用与您计划在认知架构中使用的工具相关的数据特征进行过训练。需要注意的是，模型通常不会针对智能体的特定配置设置（即工具选择、编排/推理设置）进行训练。然而，可以通过向模型提供展示智能体能力的示例，包括智能体在各种上下文中使用特定工具或推理步骤的实例，来进一步针对智能体的任务优化模型。

### 工具

基础模型尽管在文本和图像生成方面表现出色，但它们仍然受限于无法与外部世界互动。工具弥合了这一差距，使智能体能够与外部数据和服务进行交互，同时解锁了超出底层模型本身能力的更广泛行动。工具可以有多种形式，复杂程度也各不相同，但通常与常见的 Web API 方法（如 GET、POST、PATCH 和 DELETE）保持一致。例如，工具可以更新数据库中的客户信息，或获取天气数据以影响智能体向用户提供的旅行建议。借助工具，智能体可以访问和处理现实世界的信息。这使它们能够支持更专业的系统，如检索增强生成 (RAG)，从而显著扩展智能体的能力，使其超越基础模型自身所能达到的水平。我们将在下文更详细地讨论工具，但最重要的是要理解，工具弥合了智能体内部能力与外部世界之间的差距，解锁了更广泛的可能性。

### 编排层

编排层描述了一个循环过程，该过程管理智能体如何接收信息、执行一些内部推理，并使用该推理来指导其下一步行动或决策。通常，此循环将持续到智能体达到其目标或某个停止点。编排层的复杂性会因智能体及其执行的任务而有很大差异。有些循环可能是带有决策规则的简单计算，而另一些则可能包含链式逻辑、涉及额外的机器学习算法或实现其他概率推理技术。我们将在认知架构部分更详细地讨论智能体编排层的具体实现。

### 智能体与模型对比

为了更清楚地理解智能体和模型之间的区别，请参考下表：

| 模型                                                                                                            | 智能体                                                                                                                                                                                      |
| --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 知识仅限于其训练数据中可获得的内容。                                                                            | 通过工具与外部系统连接来扩展知识。                                                                                                                                                          |
| 基于用户查询的单次推理/预测。除非为模型明确实现，否则不管理会话历史或连续上下文（例如聊天历史）。               | 管理会话历史（例如聊天历史），以允许基于用户查询和编排层决策的多轮推理/预测。在此上下文中，"轮次 (turn)" 定义为交互系统与智能体之间的一次互动（例如，1 个传入事件/查询和 1 个智能体响应）。 |
| 没有原生工具实现。                                                                                              | 工具在智能体架构中原生实现。                                                                                                                                                                |
| 没有实现原生逻辑层。用户可以将提示构造为简单问题，或使用推理框架（CoT、ReAct 等）构造复杂提示来指导模型的预测。 | 使用 CoT、ReAct 等推理框架或 LangChain 等其他预构建智能体框架的原生认知架构。                                                                                                               |

### 认知架构：智能体如何运作

想象一位繁忙厨房里的厨师。他们的目标是为餐厅顾客烹制美味佳肴，这涉及计划、执行和调整的某种循环。

• 他们收集信息，例如顾客的订单以及储藏室和冰箱里有什么食材。
• 他们根据刚收集到的信息，对可以制作哪些菜肴和风味进行一些内部推理。
• 他们采取行动制作菜肴：切蔬菜、调配香料、煎肉。

在过程的每个阶段，厨师都会根据需要进行调整，随着食材的消耗或收到顾客反馈而优化他们的计划，并使用先前结果集来确定下一步的行动计划。这种信息接收、规划、执行和调整的循环描述了厨师为达到目标而采用的一种独特的认知架构。

与厨师一样，智能体可以使用认知架构，通过迭代处理信息、做出明智决策以及根据先前输出优化后续行动来达到其最终目标。智能体认知架构的核心是编排层，负责管理记忆、状态、推理和规划。它利用快速发展的提示工程领域及相关框架来指导推理和规划，使智能体能够更有效地与其环境交互并完成任务。语言模型的提示工程框架和任务规划领域的研究正在迅速发展，产生了各种有前景的方法。虽然并非详尽无遗，但以下是截至本出版物发布时一些最流行的框架和推理技术：

• ReAct，一种提示工程框架，为语言模型提供一种思维过程策略，使其能够针对用户查询进行推理并采取行动，无论有无上下文示例。ReAct 提示已显示出优于几种当前最优基准的性能，并提高了 LLM 的人机互操作性和可信度。

• 思维链 (CoT)，一种通过中间步骤实现推理能力的提示工程框架。CoT 有多种子技术，包括自洽性 (self-consistency)、主动提示 (active-prompt) 和多模态 CoT，每种技术根据具体应用场景各有优缺点。

• 思维树 (ToT)，一种非常适合探索或战略前瞻任务的提示工程框架。它泛化了思维链提示，并允许模型探索各种思维链，这些思维链可作为使用语言模型解决一般问题的中间步骤。

智能体可以利用上述推理技术之一或许多其他技术，为给定的用户请求选择下一个最佳行动。例如，让我们考虑一个被编程为使用 ReAct 框架为用户查询选择正确行动和工具的智能体。事件序列可能如下所示：

1. 用户向智能体发送查询
2. 智能体开始 ReAct 序列
3. 智能体向模型提供提示，要求其生成下一个 ReAct 步骤及其相应的输出：
    a. 问题：用户查询中的输入问题，随提示一同提供
    b. 思考：模型关于下一步应该做什么的想法
    c. 行动：模型关于下一步采取何种行动的决定
        i. 这里可能发生工具选择
        ii. 例如，行动可以是 [Flights, Search, Code, None] 之一，前三个代表模型可以选择的已知工具，最后一个代表“无工具选择”
    d. 行动输入：模型决定向工具提供哪些输入（如果有）
    e. 观察：行动/行动输入序列的结果
        i. 这个思考/行动/行动输入/观察的过程可能会根据需要重复 N 次
    f. 最终答案：模型为原始用户查询提供的最终答案
4. ReAct 循环结束，并将最终答案提供给用户

![](/images/notes/8237bcfa0131ae27c09f2754631c5cfea359ab6431e085f3f9c8c5139f0fa5a7.jpg)
图 2. 在编排层中使用 ReAct 推理的智能体示例

如图 2 所示，模型、工具和智能体配置协同工作，根据用户的原始查询向用户提供一个有根据的、简洁的回复。虽然模型本可以根据其先验知识猜测一个答案（产生幻觉），但它却使用了一个工具 (Flights) 来搜索实时的外部信息。这些额外的信息被提供给模型，使其能够根据真实的事实数据做出更明智的决定，并将这些信息总结给用户。

总之，智能体响应的质量直接关系到模型对这些各种任务进行推理和行动的能力，包括选择正确工具的能力，以及该工具定义的完善程度。就像厨师用新鲜食材精心烹制菜肴并关注顾客反馈一样，智能体依靠合理的推理和可靠的信息来交付最佳结果。在下一节中，我们将深入探讨智能体连接新鲜数据的各种方式。

## 工具：我们通往外部世界的钥匙

虽然语言模型擅长处理信息，但它们缺乏直接感知和影响现实世界的能力。这限制了它们在需要与外部系统或数据交互的情况下的实用性。这意味着，从某种意义上说，语言模型的好坏取决于它从训练数据中学到的东西。但无论我们向模型输入多少数据，它们仍然缺乏与外部世界交互的基本能力。那么，我们如何才能让我们的模型与外部系统进行实时、上下文感知的交互呢？函数 (Functions)、扩展 (Extensions)、数据存储 (Data Stores) 和插件 (Plugins) 都是为模型提供这种关键能力的方法。

尽管名称各异，但工具是连接我们基础模型与外部世界的桥梁。这种与外部系统和数据的连接使我们的智能体能够执行更多种类的任务，并且更准确、更可靠地完成这些任务。例如，工具可以使智能体调整智能家居设置、更新日历、从数据库中获取用户信息，或根据一组特定指令发送电子邮件。

截至本出版物发布之日，Google 模型能够与之交互的主要工具类型有三种：扩展 (Extensions)、函数 (Functions) 和数据存储 (Data Stores)。通过为智能体配备工具，我们释放了它们不仅能理解世界，还能对其采取行动的巨大潜力，从而为无数新的应用和可能性打开了大门。

### 扩展 (Extensions)

理解扩展最简单的方法是将它们视为以标准化方式弥合 API 和智能体之间差距的桥梁，使智能体能够无缝执行 API，而无需考虑其底层实现。假设您构建了一个旨在帮助用户预订航班的智能体。您知道要使用 Google Flights API 来检索航班信息，但不确定如何让您的智能体调用此 API 端点。

![](/images/notes/10f921748d9cbfe7a60e059109afbf8e6b904f4a0c47860a73a2449d12d15fc7.jpg)
图 3. 智能体如何与外部 API 交互？

一种方法是实现自定义代码，该代码将接收传入的用户查询，解析查询以获取相关信息，然后进行 API 调用。例如，在航班预订用例中，用户可能会说“我想预订从奥斯汀到苏黎世的航班。”在这种情况下，我们的自定义代码解决方案需要在尝试进行 API 调用之前，从用户查询中提取“奥斯汀”和“苏黎世”作为相关实体。但是，如果用户说“我想预订飞往苏黎世的航班”而从未提供出发城市，会发生什么情况呢？API 调用会因缺少所需数据而失败，并且需要实现更多代码来捕获此类边缘和极端情况。这种方法不具可扩展性，并且在任何超出已实现自定义代码范围的场景中都很容易中断。

一种更具弹性的方法是使用扩展。扩展通过以下方式弥合智能体和 API 之间的差距：

1. 通过示例教智能体如何使用 API 端点。
2. 教智能体成功调用 API 端点需要哪些参数。

![](/images/notes/c165386f9512d08227b59aff4980b5ad776998090efc76013a0a0fbe944603c0.jpg)
图 4. 扩展将智能体连接到外部 API

扩展可以独立于智能体创建，但应作为智能体配置的一部分提供。智能体在运行时使用模型和示例来决定哪个扩展（如果有）适合解决用户的查询。这突出了扩展的一个关键优势，即其内置的示例类型，这些示例类型允许智能体动态选择最适合任务的扩展。

![](/images/notes/9a58ad136dcd415a372225acbadbccb16159a35e4895715fa7ace249fdbf4109.jpg)
图 5. 智能体、扩展和 API 之间的一对多关系

可以将其视为软件开发人员在解决用户问题并制定解决方案时决定使用哪些 API 端点的方式。如果用户想预订航班，开发人员可能会使用 Google Flights API。如果用户想知道离他们位置最近的咖啡店在哪里，开发人员可能会使用 Google Maps API。同样，智能体/模型堆栈使用一组已知的扩展来决定哪一个最适合用户的查询。如果您想查看扩展的实际应用，可以在 Gemini 应用程序中进行尝试，方法是转到“设置” $>$ “扩展”，然后启用您想测试的任何扩展。例如，您可以启用 Google Flights 扩展，然后询问 Gemini：“Show me flights from Austin to Zurich leaving next Friday.”

#### 扩展示例

为了简化扩展的使用，Google 提供了一些开箱即用的扩展，可以快速导入到您的项目中，并且只需最少的配置即可使用。例如，代码片段 1 中的 Code Interpreter 扩展允许您通过自然语言描述生成并运行 Python 代码。

```python
import vertexai
import pprint

PROJECT_ID = "YOUR_PROJECT_ID"
REGION = "us-central1"

vertexai.init(project = PROJECT_ID, location = REGION)

from vertexai.preview.extensions import Extension

extension_code_interpreter = Extension.from_hub("code_interpreter")
CODE_QUERY = """Write a python method to invert a binary tree in O(n) time."""

response = extension_code_interpreter.execute( 
    operation_id = "generate_and_execute", 
    operation_params = {"query": CODE_QUERY} 
    )

print("Generated Code:")
pprint.pprint({response['generated_code']})

# The above snippet will generate the following code
# Generated Code:
class TreeNode: 
    def __init__(self, val = 0 , left = None, right = None): 
        self.val = val 
        self.left = left 
        self.right = right


def invert_binary_tree(root):
    """Inverts a binary tree.
    Args:
        root: The root of the binary tree.
    Returns:
        The root of the inverted binary tree.
    """

    if not root: 
        return None

    # Swap the left and right children recursively
    root.left, root.right = invert_binary_tree(root.right), invert_binary_tree(root.left)

    return root

# Example usage
# Construct a sample binary tree
root = TreeNode(4)
root.left = TreeNode(2)
root.right = TreeNode(7)
root.left.left = TreeNode(1)
root.left.right = TreeNode(3)
root.right.left = TreeNode(6)
root.right.right = TreeNode(9)

# Invert the binary tree
inverted_root = invert_binary_tree(root)
```

代码片段 1. Code Interpreter 扩展，用于从自然语言描述生成和执行 Python 代码。

总而言之，扩展为智能体提供了以多种方式感知、交互和影响外部世界的能力。这些扩展的选择和调用由作为扩展配置一部分定义的示例进行指导。

### 函数 (Functions)

在软件工程领域，函数被定义为完成特定任务并可根据需要重用的独立代码模块。软件开发人员在编写程序时，通常会创建许多函数来执行各种任务。他们还会定义何时调用 function_a 与 function_b 的逻辑，以及预期的输入和输出。

在智能体领域，函数的工作方式非常相似，但我们可以用模型来取代软件开发人员。模型可以获取一组已知的函数，并根据其规范决定何时使用每个函数以及该函数需要哪些参数。函数与扩展在几个方面有所不同，最显著的是：

1. 模型输出一个函数及其参数，但不进行实时的 API 调用。
2. 函数在客户端执行，而扩展在智能体端执行。

再次使用我们的 Google Flights 示例，一个简单的函数设置可能如图 7 中的示例所示。

![](/images/notes/4d9c5e1d4c717cd9c7c98d7df7e5446ffc15366f150e3bfcc6cc4a69d7efa0b2.jpg)
图 7. 函数如何与外部 API 交互？

请注意，这里的主要区别在于，函数和智能体都不直接与 Google Flights API 交互。那么 API 调用实际上是如何发生的呢？

对于函数，调用实际 API 端点的逻辑和执行被从智能体卸载回客户端应用程序，如下图 8 和图 9 所示。这为开发人员提供了对应用程序中数据流的更精细控制。开发人员选择使用函数而不是扩展的原因有很多，但一些常见的用例是：

• API 调用需要在应用程序堆栈的另一层进行，而不是在直接的智能体架构流程之外（例如，中间件系统、前端框架等）
• 安全或身份验证限制阻止智能体直接调用 API（例如，API 未暴露给互联网，或智能体基础设施无法访问）
• 时间或操作顺序限制阻止智能体实时进行 API 调用（即批处理操作、人工审核等）
• 需要对 API 响应应用智能体无法执行的额外数据转换逻辑。例如，考虑一个不提供限制返回结果数量的筛选机制的 API 端点。在客户端使用函数为开发人员提供了进行这些转换的额外机会。
• 开发人员希望在不为 API 端点部署额外基础设施的情况下迭代智能体开发（即函数调用可以充当 API 的“存根”）

虽然如图 8 所示，两种方法在内部架构上的差异是微妙的，但对外部基础设施的额外控制和解耦依赖性使得函数调用成为开发人员的一个有吸引力的选择。

![](/images/notes/e1492cce884f5caeb19fe3a16b7edb378cba4ae71a4942935d27fb308732b6db.jpg)
图 8. 区分扩展 (A) 和函数调用 (B) 中客户端与智能体端的控制

#### 使用场景

模型可以用于调用函数，以处理最终用户的复杂客户端执行流程，在这种情况下，智能体开发人员可能不希望语言模型管理 API 执行（与扩展的情况不同）。让我们考虑以下示例：一个智能体被训练为旅行礼宾员，与想要预订度假行程的用户进行交互。目标是让智能体生成一个城市列表，我们可以在中间件应用程序中使用该列表为用户的旅行计划下载图像、数据等。用户可能会说类似这样的话：

I’d like to take a ski trip with my family but I’m not sure where to go.
在典型的模型提示下，输出可能如下所示：
当然，这里有一些您可以考虑的适合家庭滑雪旅行的城市：

• 美国科罗拉多州克雷斯特德比特 (Crested Butte, Colorado, USA)
• 加拿大不列颠哥伦比亚省惠斯勒 (Whistler, BC, Canada)
• 瑞士采尔马特 (Zermatt, Switzerland)

虽然上述输出包含我们需要的数据（城市名称），但其格式并不适合解析。通过函数调用，我们可以教会模型以结构化样式（如 JSON）格式化此输出，这种格式更便于其他系统解析。对于来自用户的相同输入提示，函数的 JSON 输出示例可能如代码片段 5 所示。

```
function_call {
  name: "display_cities"
  args: {
    "cities": ["Crested Butte", "Whistler", "Zermatt"],
    "preferences": "skiing"
  }
}
```

代码片段 5. 用于显示城市列表和用户偏好的函数调用负载示例

此 JSON 负载由模型生成，然后发送到我们的客户端服务器以执行我们希望对其执行的任何操作。在此特定情况下，我们将调用 Google Places API，获取模型提供的城市并查找图像，然后将它们作为格式化的富内容返回给我们的用户。请看图 9 中的序列图，它逐步详细地显示了上述交互。

![](/images/notes/b9235c8cd1642c3ad24188e47e86cbdb9944496584a47fe5823cae234b631ee0.jpg)
图 9. 显示函数调用生命周期的序列图

图 9 中示例的结果是，模型被用来“填空”，提供客户端 UI 调用 Google Places API 所需的参数。客户端 UI 使用模型在返回的函数中提供的参数来管理实际的 API 调用。这只是函数调用的一个用例，但还有许多其他场景需要考虑，例如：

• 您希望语言模型建议一个可以在代码中使用的函数，但您不想在代码中包含凭据。因为函数调用不运行该函数，所以您无需在包含函数信息的代码中包含凭据。
• 您正在运行可能需要几秒钟以上的异步操作。这些场景非常适合函数调用，因为它是异步操作。
• 您希望在与生成函数调用及其参数的系统不同的设备上运行函数。

关于函数，需要记住的一个关键点是，它们旨在为开发人员提供对 API 调用的执行以及整个应用程序数据流的更大控制。在图 9 的示例中，开发人员选择不将 API 信息返回给智能体，因为它与智能体可能采取的未来行动无关。然而，根据应用程序的架构，将外部 API 调用数据返回给智能体以影响未来的推理、逻辑和行动选择可能是有意义的。最终，由应用程序开发人员选择适合特定应用程序的方式。

#### 函数示例代码

为了在我们的滑雪度假场景中实现上述输出，让我们构建每个组件，使其与我们的 `gemini-1.5-flash-001` 模型配合工作。

首先，我们将 `display_cities` 函数定义为一个简单的 Python 方法。

```python
def display_cities(cities: list[str], preferences: Optional[str] = None):
    """Provides a list of cities based on the user's search query and preferences.

    Args:
        preferences (str): The user's preferences for the search, like skiing,
        beach, restaurants, bbq, etc.
        cities (list[str]): The list of cities being recommended to the user.

    Returns:
        list[str]: The list of cities being recommended to the user.
    """

    return cities
```

代码片段 6. Python 方法，用于显示基于用户搜索查询和偏好的城市列表。

接下来，我们将实例化我们的模型，构建工具，然后将用户的查询和工具传递给模型。执行下面的代码将产生代码片段底部所示的输出。

```python
from vertexai.generative_models import GenerativeModel, Tool, FunctionDeclaration

model = GenerativeModel("gemini-1.5-flash-001")

display_cities_function = FunctionDeclaration.from_func(display_cities)
tool = Tool(function_declarations=[display_cities_function])

message = "I’d like to take a ski trip with my family but I’m not sure where to go."

res = model.generate_content(message, tools=[tool])

print(f"Function Name: {res.candidates[0].content.parts[0].function_call.name}")
print(f"Function Args: {res.candidates[0].content.parts[0].function_call.args}")

> Function Name: display_cities
> Function Args: {'preferences': 'skiing', 'cities': ['Aspen', 'Vail', 'Park City']}
```

代码片段 7. 构建一个工具，将其与用户查询一起发送到模型，并允许进行函数调用

总之，函数提供了一个直接的框架，使应用程序开发人员能够对数据流和系统执行进行细粒度控制，同时有效地利用智能体/模型生成关键输入。开发人员可以选择性地决定是否通过返回外部数据来让智能体“参与其中”，或者根据特定的应用程序架构要求将其省略。

### 数据存储 (Data Stores)

想象一下语言模型是一个巨大的图书库，其中包含其训练数据。但与不断获取新书的图书馆不同，这个图书馆保持静态，只拥有最初训练时获得的知识。这带来了一个挑战，因为现实世界的知识在不断发展。数据存储通过提供对更动态和最新信息的访问来解决此限制，并确保模型的响应始终以事实为依据且具有相关性。

考虑一个常见场景，开发人员可能需要向模型提供少量附加数据，也许是以电子表格或 PDF 的形式。

![](/images/notes/f96dd65a50eec5f6b0d95dfe1651cb8d05a457f0a3f2c8854334baa3ceebebcf.jpg)
图 10. 智能体如何与结构化和非结构化数据交互？

数据存储允许开发人员以其原始格式向智能体提供附加数据，从而消除了耗时的数据转换、模型重新训练或微调的需要。数据存储将传入的文档转换为一组向量数据库嵌入，智能体可以使用这些嵌入来提取所需信息，以补充其下一步行动或对用户的响应。

![](/images/notes/59e41a1da7f4c35bb5226d3a6f255af321a51c2c1329a8104ca95a8a5a2f22d0.jpg)
图 11. 数据存储将智能体连接到各种类型的新的实时数据源。

#### 实现与应用

在生成式 AI 智能体的背景下，数据存储通常实现为向量数据库，开发人员希望智能体在运行时能够访问该数据库。虽然我们在此不会深入介绍向量数据库，但关键是要理解它们以向量嵌入的形式存储数据，这是一种高维向量或所提供数据的数学表示。近年来，数据存储与语言模型结合使用的最普遍的例子之一是基于检索增强生成 (RAG) 的应用程序的实现。这些应用程序旨在通过使模型能够访问各种格式的数据来扩展模型知识的广度和深度，例如：

• 网站内容
• 结构化数据，格式如 PDF、Word 文档、CSV、电子表格等
• 非结构化数据，格式如 HTML、PDF、TXT 等

![](/images/notes/4d85f3c3f5cca517788c4c673ee8e9b0dabe3e44cfb4a43e44070a1f5e89f7b6.jpg)
图 12. 智能体和数据存储之间的一对多关系，数据存储可以表示各种类型的预索引数据

每个用户请求和智能体响应循环的底层过程通常如图 13 所示。

1. 用户查询被发送到嵌入模型以生成查询的嵌入
2. 然后使用诸如 SCaNN 之类的匹配算法将查询嵌入与向量数据库的内容进行匹配
3. 从向量数据库中以文本格式检索匹配的内容并发送回智能体
4. 智能体接收用户查询和检索到的内容，然后制定响应或行动
5. 最终响应发送给用户

![](/images/notes/9ff3f52007db8c5ad566171c6121ff1f0208134649ef68b0a31c6aa0dbe58b8b.jpg)
图 13. 基于 RAG 的应用程序中用户请求和智能体响应的生命周期

最终结果是一个应用程序，它允许智能体通过向量搜索将用户查询与已知数据存储匹配，检索原始内容，并将其提供给编排层和模型进行进一步处理。下一步行动可能是向用户提供最终答案，或执行额外的向量搜索以进一步优化结果。

图 14 展示了与实现 RAG 并采用 ReAct 推理/规划的智能体的示例交互。

![](/images/notes/7ee1263b3e70ed459f4416854addf0d1763a2219c85d11dbd201e7fd00ffd7c5.jpg)
图 14. 带有 ReAct 推理/规划的基于 RAG 的示例应用程序

### 工具回顾

总而言之，扩展、函数和数据存储构成了智能体在运行时可用的几种不同工具类型。每种工具都有其自身的用途，智能体开发人员可以自行决定将它们组合使用或独立使用。

| 工具类型                    | 执行位置     | 使用场景                                                                                                                                                                                                            |
| --------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 扩展 (Extensions)           | 智能体端执行 | • 开发人员希望智能体控制与 API 端点的交互<br>• 在利用原生预构建扩展（例如 Vertex Search、Code Interpreter 等）时非常有用<br>• 多次 API 调用和规划（例如，后续行动取决于先前行动/API 调用的输出）                    |
| 函数调用 (Function Calling) | 客户端执行   | • 安全或身份验证限制阻止智能体直接调用 API<br>• 时间限制或操作顺序限制阻止智能体进行 API 调用（例如批处理操作、人工审核等）<br>• API 未暴露给互联网，或 Google 系统无法访问                                         |
| 数据存储 (Data Stores)      | 智能体端执行 | 开发人员希望实现检索增强生成 (RAG)，并处理以下任何数据类型：<br>• 来自预索引域和 URL 的网站内容<br>• Word 文档、PDF、电子表格等格式的结构化数据<br>• 关系型/非关系型数据库<br>• HTML、PDF、TXT 等格式的非结构化数据 |

## 通过针对性学习提升模型性能

有效使用模型的一个关键方面是它们在生成输出时选择正确工具的能力，尤其是在生产环境中大规模使用工具时。虽然通用训练有助于模型发展这项技能，但现实世界的场景通常需要超出训练数据的知识。这可以想象成基本烹饪技能与掌握特定菜系之间的区别。两者都需要基础烹饪知识，但后者需要有针对性的学习才能获得更细致入微的结果。

为了帮助模型获取此类特定知识，存在几种方法：

• 上下文学习 (In-context learning)：此方法在推理时为通用模型提供提示、工具和少量示例 (few-shot examples)，使其能够“即时”学习如何在特定任务中以及何时使用这些工具。ReAct 框架是这种方法在自然语言中的一个例子。
• 基于检索的上下文学习 (Retrieval-based in-context learning)：此技术通过从外部存储器中检索最相关的信息、工具和相关示例来动态填充模型提示。Vertex AI 扩展中的“示例存储库 (Example Store)”或前面提到的基于 RAG 的数据存储架构就是这方面的一个例子。
• 基于微调的学习 (Fine-tuning based learning)：此方法涉及在推理之前使用更大的特定示例数据集训练模型。这有助于模型在收到任何用户查询之前了解何时以及如何应用某些工具。

为了对每种针对性学习方法提供更多见解，让我们回顾一下我们的烹饪类比。

• 想象一位厨师从顾客那里收到了一份特定的食谱（提示）、一些关键食材（相关工具）和一些示例菜肴（少量示例）。基于这些有限的信息和厨师的一般烹饪知识，他们需要“即时”弄清楚如何准备与食谱和顾客偏好最相符的菜肴。这就是上下文学习。
• 现在让我们想象一下我们的厨师在一个厨房里，这个厨房有一个储备充足的食品储藏室（外部数据存储），里面装满了各种食材和食谱（示例和工具）。厨师现在能够从食品储藏室动态选择食材和食谱，并更好地与顾客的食谱和偏好保持一致。这使得厨师能够利用现有知识和新知识来制作更明智、更精致的菜肴。这就是基于检索的上下文学习。
• 最后，让我们想象一下，我们把厨师送回学校学习一种新的菜系或一组菜系（在更大的特定示例数据集上进行预训练）。这使得厨师能够以更深入的理解来处理未来未见过的顾客食谱。如果我们希望厨师在特定菜系（知识领域）方面表现出色，这种方法是完美的。这就是基于微调的学习。

这些方法中的每一种在速度、成本和延迟方面都各有优缺点。然而，通过在智能体框架中结合这些技术，我们可以利用各种优势并最大限度地减少它们的弱点，从而实现更强大和适应性更强的解决方案。

## 使用 LangChain 快速开始智能体开发

为了提供一个真实世界中可执行的智能体示例，我们将使用 LangChain 和 LangGraph 库构建一个快速原型。这些流行的开源库允许用户通过将逻辑序列、推理和工具调用“链接”起来，以回答用户的查询，从而构建自定义智能体。我们将使用我们的 `gemini-1.5-flash-001` 模型和一些简单的工具来回答来自用户的多阶段查询，如代码片段 8 所示。

我们使用的工具是 SerpAPI (用于 Google 搜索) 和 Google Places API。在代码片段 8 中执行我们的程序后，您可以在代码片段 9 中看到示例输出。

```python
from langgraph.prebuilt import create_react_agent
from langchain_core.tools import tool
from langchain_community.utilities import SerpAPIWrapper
from langchain_community.tools import GooglePlacesTool

os.environ["SERPAPI_API_KEY"] = "XXXXX"
os.environ["GPLACES_API_KEY"] = "XXXXX"

@tool
def search(query: str): 
    """Use the SerpAPI to run a Google Search.""" 
    search = SerpAPIWrapper() 
    return search.run(query)

@tool
def places(query: str): 
    """Use the Google Places API to run a Google Places Query.""" 
    places = GooglePlacesTool() 
    return places.run(query)

model = ChatVertexAI(model = "gemini-1.5-flash-001")
tools = [search, places]

query = "Who did the Texas Longhorns play in football last week? What is the address of the other team's stadium?"

agent = create_react_agent(model, tools)
input = {"messages": [("human", query)]}

for s in agent.stream(input, stream_mode = "values"): 
    message = s["messages"][-1] 
    if isinstance(message, tuple): 
        print(message) 
    else: 
        message.pretty_print()
```

代码片段 8. 智能体及其使用的工具示例，使用 LangChain 和 LangGraph 构建。

```
=============================== Human Message ================================
Who did the Texas Longhorns play in football last week? What is the address
of the other team's stadium?
================================= Ai Message =================================
Tool Calls: search
Args:
query: Texas Longhorns football schedule
================================ Tool Message ================================
Name: search
{...Results: "NCAA Division I Football, Georgia, Date..."}
================================= Ai Message =================================
The Texas Longhorns played the Georgia Bulldogs last week.
Tool Calls: places
Args:
query: Georgia Bulldogs stadium
================================ Tool Message ================================
Name: places
{...Sanford Stadium Address: 100 Sanford...}
================================= Ai Message =================================
The address of the Georgia Bulldogs stadium is 100 Sanford Dr, Athens, GA
30602, USA.
```

代码片段 9. 执行代码片段 8 中的程序后的结果。

虽然这是一个相当简单的智能体示例，但它展示了模型、编排和工具这些基础组件如何协同工作以实现特定目标。在最后一节中，我们将探讨这些组件如何在 Google 规模的托管产品（如 Vertex AI 智能体和生成式操作手册 (Generative Playbooks)）中结合在一起。

## 使用 Vertex AI 智能体构建生产级应用

虽然本白皮书探讨了智能体的核心组件，但构建生产级应用程序需要将它们与用户界面、评估框架和持续改进机制等其他工具集成。Google 的 Vertex AI 平台通过提供一个完全托管的环境来简化此过程，该环境涵盖了前面讨论的所有基本要素。开发人员可以使用自然语言界面快速定义其智能体的关键要素——目标、任务指令、工具、用于任务委派的子智能体以及示例——从而轻松构建所需的系统行为。此外，该平台还附带一套开发工具，允许测试、评估、衡量智能体性能、调试以及提高已开发智能体的整体质量。这使开发人员能够专注于构建和优化其智能体，而基础设施、部署和维护的复杂性则由平台本身管理。

在图 15 中，我们提供了一个在 Vertex AI 平台上构建的智能体架构示例，该架构使用了 Vertex Agent Builder、Vertex Extensions、Vertex Function Calling 和 Vertex Example Store 等多种功能。该架构包含了生产就绪应用程序所需的许多各种组件。

![](/images/notes/1a6522d6ba8d009f3381b06bb1894d59bae4a5fb6c8cc50248912318a2072b44.jpg)
图 15. 在 Vertex AI 平台上构建的端到端智能体架构示例

您可以从我们的官方文档中尝试此预构建智能体架构的示例。

## 总结

在本白皮书中，我们讨论了生成式 AI 智能体的基础构建模块、它们的组成以及以认知架构形式有效实现它们的方法。本白皮书的一些关键要点包括：

1. 智能体通过利用工具访问实时信息、建议现实世界行动以及自主规划和执行复杂任务，扩展了语言模型的能力。智能体可以利用一个或多个语言模型来决定何时以及如何转换状态，并使用外部工具来完成模型自身难以或不可能完成的任意数量的复杂任务。
2. 智能体操作的核心是编排层，这是一种认知架构，它构建推理、规划、决策并指导其行动。诸如 ReAct、思维链和思维树等各种推理技术为编排层提供了一个框架，使其能够接收信息、执行内部推理并生成明智的决策或响应。
3. 工具，例如扩展、函数和数据存储，是智能体通往外部世界的钥匙，允许它们与外部系统交互并访问其训练数据之外的知识。扩展在智能体和外部 API 之间架起了一座桥梁，从而能够执行 API 调用和检索实时信息。函数通过分工为开发人员提供了更细致的控制，允许智能体生成可在客户端执行的函数参数。数据存储为智能体提供了对结构化或非结构化数据的访问，从而支持数据驱动的应用程序。

智能体的未来充满激动人心的进步，我们才刚刚开始触及可能性的表面。随着工具变得越来越复杂，推理能力得到增强，智能体将有能力解决日益复杂的问题。此外，“智能体链”的战略方法将继续获得发展势头。通过组合专门的智能体——每个智能体在特定领域或任务中都表现出色——我们可以创建一种“智能体专家混合”的方法，能够在各个行业和问题领域提供卓越的结果。

重要的是要记住，构建复杂的智能体架构需要一种迭代的方法。实验和优化是为特定业务案例和组织需求寻找解决方案的关键。由于支撑其架构的基础模型的生成特性，没有两个智能体是完全相同的。然而，通过利用这些基础组件各自的优势，我们可以创建有影响力的应用程序，扩展语言模型的能力并推动现实世界的价值。

## 尾注

1. Shafran, I., Cao, Y. et al., 2022, 'ReAct: Synergizing Reasoning and Acting in Language Models'. Available at: https://arxiv.org/abs/2210.03629
2. Wei, J., Wang, X. et al., 2023, 'Chain-of-Thought Prompting Elicits Reasoning in Large Language Models'. Available at: https://arxiv.org/pdf/2201.11903.pdf.
3. Wang, X. et al., 2022, 'Self-Consistency Improves Chain of Thought Reasoning in Language Models'. Available at: https://arxiv.org/abs/2203.11171.
4. Diao, S. et al., 2023, 'Active Prompting with Chain-of-Thought for Large Language Models'. Available at: https://arxiv.org/pdf/2302.12246.pdf.
5. Zhang, H. et al., 2023, 'Multimodal Chain-of-Thought Reasoning in Language Models'. Available at: https://arxiv.org/abs/2302.00923.
6. Yao, S. et al., 2023, 'Tree of Thoughts: Deliberate Problem Solving with Large Language Models'. Available at: https://arxiv.org/abs/2305.10601.
7. Long, X., 2023, 'Large Language Model Guided Tree-of-Thought'. Available at: https://arxiv.org/abs/2305.08291.
8. Google. 'Google Gemini Application'. Available at: http://gemini.google.com.
9. Swagger. 'OpenAPI Specification'. Available at: https://swagger.io/specification/.
10. Xie, M., 2022, 'How does in-context learning work? A framework for understanding the differences from traditional supervised learning'. Available at: https://ai.stanford.edu/blog/understanding-incontext/.
11. Google Research. 'ScaNN (Scalable Nearest Neighbors)'. Available at: https://github.com/google-research/google-research/tree/master/scann.
12. LangChain. 'LangChain'. Available at: https://python.langchain.com/v0.2/docs/introduction/.
