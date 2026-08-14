# 游戏设计框架研究报告：面向 CreatorEngine 的方法库与产品化建议

> 研究日期：2026-08-13  
> 研究目的：寻找能帮助创作者从模糊想法走到可验证设计的框架，并判断哪些适合内化为 CreatorEngine 的流程、数据结构、提示卡和检查规则。  
> 结论性质：本报告优先采用原论文、作者文章、大学/出版社页面和官方资料；来自实践者的模板被明确标为实践工具，而不包装成学术定论。

## 一、结论摘要

用户记得的“一句话填空模板”，最可能属于 **High Concept / Core Gameplay Sentence（高概念句、核心玩法句）** 这一类工具，而不是唯一、统一命名的行业标准。两个早期实践来源给出了相近结构：

- Jerome Goomba 把游戏句子拆成“主语＝玩家、动词＝核心机制、补语＝玩家目标”，强调用一个可执行的动词来暴露游戏的真正核心。[Game Design as a Sentence](https://www.gamedeveloper.com/design/game-design-as-a-sentence-)
- Chris Taylor 建议概念文档以一句涵盖类型、方向、背景、差异点和平台的话开场，再用第二人称描述玩家实际做什么、看到什么。[The Anatomy of a Design Document, Part 1](https://www.gamedeveloper.com/design/the-anatomy-of-a-design-document-part-1-documentation-guidelines-for-the-game-concept-and-proposal)

适合 CreatorEngine 的合成版本是：

> **玩家作为［身份］，反复［核心动词］，以达成［目标］；但必须面对［关键约束／独特反转］。**

这不是对某位作者原句的冒充引用，而是基于上述资料、结合产品现有字段形成的工作模板。它比单纯的电梯演讲更适合生成后续结构，因为“身份、动作、目标、约束”都能转成可连接的数据节点。

研究的主要判断如下：

1. **没有一个框架能独立完成游戏设计。** 框架分别处理愿景压缩、系统完整性、玩家体验因果、受众动机、经济与关卡平衡、叙事结构、原型验证等不同问题。
2. **CreatorEngine 已经有一个不错的创意漏斗。** “原始想法 → 核心火花/玩家行为/体验承诺 → 玩家幻想 → 类型/受众/差异点 → 叙事/机制/美学/技术”已经覆盖高概念句、体验意图和 Jesse Schell 的 Elemental Tetrad（元素四分法）的主要部分。
3. **当前最明显的缺口不是再加更多创意分类，而是补上因果与证据。** 现有流程能说“想做什么”，但还不能清楚表达“哪条规则会产生什么玩家行为，凭什么相信它会带来目标体验，以及如何验证”。
4. **不建议把二十多个框架串成一张巨型表单。** 更合适的产品形态是“一个最短主干 + 按风险调用的模块 + 可追踪的设计关系图”。框架应由系统在需要时路由，用户不必先懂 MDA、PENS 或 Machinations 的名称。
5. **最高优先级的新增能力** 是：项目特有设计支柱、嵌套玩家循环、Mechanic→Dynamic→Experience 因果假设、风险驱动原型、测试证据与变更记录。

## 二、那句“一句话模板”应该怎样设计

### 2.1 三种句子解决三个不同问题

“一句话”常被混用为营销文案、玩法定义和体验承诺。CreatorEngine 应把它们分开：

| 句子 | 模板 | 用途 |
|---|---|---|
| 核心玩法句 | 玩家作为 **［身份］**，反复 **［核心动词］**，以达成 **［目标］**；但 **［约束/反转］**。 | 生成机制、循环和风险假设 |
| 体验承诺句 | 为 **［目标玩家］** 提供 **［核心感受］**，主要通过 **［关键动态］**，而不是依赖 **［常规方案］**。 | 对齐受众、体验与差异化 |
| 可验证假设句 | 如果让玩家 **［执行某机制］**，那么他们会 **［产生某种行为/策略］**，进而感到 **［目标体验］**；证据是 **［可观察信号］**。 | 把愿景转成原型和测试任务 |

第一句回答“这是个什么游戏”，第二句回答“它要为谁带来什么”，第三句回答“设计团队如何知道自己没有想当然”。三句之间应建立字段引用，而不是重复填写。

### 2.2 好句子的自动检查规则

系统可进行温和提示，而非判定“对错”：

- 必须包含一个可观察的玩家动词；“探索感”“沉浸式”“开放世界”都不是动作。
- 必须有玩家追求或避免的结果；只有世界观和身份还不是玩法。
- 最好只有一个主导动词；列出五个同等重要的动作通常说明核心尚未收敛。
- 约束或反转必须影响决策，而非只是题材装饰。
- 体验形容词要能被行为证据解释。例如“紧张”可对应犹豫时间、资源保留、风险回避或讨论内容。
- 句子不应堆平台、商业模式、功能列表和制作技术；这些应进入各自字段。

### 2.3 示例

以仓库现有的“堆叠奇怪物件”方向为例：

> 玩家作为一名废墟修复师，反复挑选、旋转并堆叠形状古怪的遗物，以重建不断升高的纪念塔；但每件遗物都会改变整座塔的受力和居民对它的用途。

由此可以直接派生：

- 核心动词：挑选、旋转、堆叠；
- 短循环：观察稳定性 → 选物 → 放置 → 即时物理/社会反馈；
- 长目标：重建纪念塔；
- 系统约束：全局受力、用途变化；
- 动态假设：玩家会在高度、稳定、用途之间形成权衡；
- 体验假设：既有精巧掌控，也有荒诞的意外；
- 首个原型问题：不用剧情和美术，仅凭 10 种形状与受力反馈，玩家会不会形成不同堆叠策略？

## 三、框架地图：按它们解决的问题分类

```mermaid
flowchart LR
    A["模糊灵感"] --> B["愿景：一句话 / 设计支柱"]
    B --> C["结构：循环 / Formal Elements / 四分法"]
    C --> D["因果：Mechanics → Dynamics → Experience"]
    D --> E["专项：叙事 / 经济 / 关卡 / 价值"]
    E --> F["风险：原型问题与测试标准"]
    F --> G["证据：观察 / 结论 / 变更"]
    G --> B
```

| 设计问题 | 优先框架 | 产出物 | 推荐产品位置 |
|---|---|---|---|
| 一句话说清游戏 | High Concept / Core Gameplay Sentence | 核心玩法句 | 主流程 |
| 用少数原则取舍 | 项目设计支柱 | 2–4 条可检验原则 | 主流程 |
| 游戏是否结构完整 | Formal Elements | 玩家、目标、规则等清单 | 主流程检查器 |
| 玩家每秒/每局/长期做什么 | Core Loop / Nested Loops | 三层循环 | 主流程 |
| 规则如何产生体验 | MDA / DDE | 因果链与反向设计图 | 主流程 |
| 叙事与互动是否相连 | Narrative Design Canvas | 体验—互动—叙事映射 | 可选模块 |
| 目标玩家为何愿意玩 | Quantic Foundry、PENS/SDT | 动机画像、需求假设 | 主流程轻量版 |
| 体验是否清晰顺畅 | Meaningful Play、GameFlow | 启发式检查与测试题 | 测试模块 |
| 资源经济是否可持续 | Machinations | 来源—存量—消耗图 | 高级模块 |
| 关卡难度如何系统化 | Rational Design / RLD | 参数表、难度矩阵 | 高级模块 |
| 如何复用既有设计知识 | Game Design Patterns、Deck of Lenses | 可搜索模式与诊断卡 | 灵感/复盘模块 |
| 如何验证最大风险 | Playcentric、Prototype Dimensions、RITE | 原型任务、测试证据 | 主流程 |
| 教育/严肃游戏如何扩展 | DPE、Values at Play | 学习与价值目标映射 | 领域扩展包 |

## 四、框架详解与适用边界

### 4.1 High Concept / Core Gameplay Sentence

**核心问题：** 能否用一个玩家动作中心的句子说明游戏？

它适合做入口和对齐工具，但不能代替设计。David Mullich 的可执行 GDD 模板同样把 High Concept 定义为一句话，随后仍需要玩法、规则和测试信息。[An Actionable Game Design Document Template](https://davidmullich.com/2018/06/25/an-actionable-game-design-document-template/)

**引擎化方式：** 把身份、核心动词、目标、约束拆成结构化字段；允许系统生成自然语言，但不把一句话当作不可修改的最终答案。

**风险：** 容易写成题材句、营销句或功能列表；某些开放式玩具、社交空间和实验作品没有单一胜利目标，需要允许“持续状态/自定目标”。

### 4.2 项目设计支柱（Design Pillars）

**核心问题：** 当两个方案冲突时，团队凭什么取舍？

设计支柱不是“叙事、机制、美学、技术”这类通用分类，而应是某个项目特有的 2–4 条决策原则。实践资料强调它们应短、可执行、能贯穿制作，而非口号。[Design Pillars Toolkit](https://tkdev.dss.cloud/gamedesign/toolkit/design-pillars/)、[Level Design Book: Preproduction](https://book.leveldesignbook.com/process/preproduction)

推荐字段：

- 支柱名称；
- 玩家承诺；
- 我们会做什么；
- 我们明确不做什么；
- 可观察的证明；
- 与其他支柱冲突时的优先级。

**引擎化方式：** 后续每个机制、内容和原型都可关联“支持哪个支柱”；无支柱支持的高成本功能会被标记为待质疑项。

### 4.3 Elemental Tetrad（元素四分法）

Jesse Schell 将游戏拆为 **Mechanics、Story、Aesthetics、Technology**，并强调四者相互依赖，而非四个独立部门。[The Art of Game Design：The Game Consists of Elements（出版社章节页）](https://www.taylorfrancis.com/chapters/mono/10.1201/b22101-5/game-consists-elements-jesse-schell)

**对 CreatorEngine 的意义：** 现有“叙事、机制、美学、技术”四类设计点已经几乎完整采用该框架。建议把 UI 文案从“四大支柱”改为“四类设计维度”或“元素四分法”，另设真正的项目设计支柱，避免概念冲突。

**局限：** 四分法是覆盖检查，不表达因果，也不告诉团队哪个设想最危险。必须与 MDA/DDE 和原型流程连接。

### 4.4 Formal Elements（形式元素）

Tracy Fullerton 的 playcentric 方法中，常用的形式元素包括 **玩家、目标、程序、规则、资源、冲突、边界、结果**。它们适合检查“这是不是一个可运行的系统”。可参见 [Game Design Workshop 书摘](https://www.gamedeveloper.com/design/book-excerpt-game-design-workshop) 和 [Formal Elements Toolkit](https://tkdev.dss.cloud/gamedesign/toolkit/the-formal-elements/)。

**引擎化方式：** 不增加一个八页表单，而是从核心句和循环自动预填，再只询问缺失项。例如已经有“目标”和“动作”，就追问失败/终止条件、资源变化和规则边界。

**局限：** 结构齐全不等于有趣；它无法说明规则运行后会出现何种行为。

### 4.5 Core Loop / Nested Loops（核心与嵌套循环）

Epic 的官方说明把 gameplay loop 表达为重复直到目标达成的动作、反馈/奖励与再次投入。[Epic Games: Gameplay Loop](https://dev.epicgames.com/documentation/en-us/fortnite/gameplay-loop) 实践中常再区分微观、局内和长期循环；GDC 案例也展示了 micro/macro/meta 的分层方式。[GDC Europe: Fear, Love and Great Game Design](https://media.gdcvault.com/gdceurope2015/Evans%20Jonathan%20Fear%20Love%20Great.pdf)

为避免不同团队对 micro/meta 命名不一致，建议产品使用中性时间尺度：

1. **原子循环（秒）：** 感知 → 决策 → 行动 → 反馈；
2. **局面/会话循环（分钟）：** 目标 → 挑战 → 结果/奖励 → 下一目标；
3. **进展循环（小时/天）：** 累积/解锁/建造身份或世界 → 获得新可能。

每一步记录：玩家动作、系统状态变化、信息反馈、产生的下一项决策。系统应检查“只有奖励、没有新决策”或“有操作、无状态变化”的弱环。

**局限：** 循环是设计表示法，不是所有作品都必须采用留存或“强迫循环”；叙事短篇、玩具和开放社交空间应允许非循环结构。

### 4.6 MDA：Mechanics–Dynamics–Aesthetics

Hunicke、LeBlanc、Zubek 的原论文将设计者视角表示为 **Mechanics → Dynamics → Aesthetics**：规则与组件在运行时形成行为，行为带来目标体验；玩家则从体验反向接触系统。论文还列出 sensation、fantasy、narrative、challenge、fellowship、discovery、expression、submission 八种审美/体验词汇。[MDA: A Formal Approach to Game Design and Game Research](https://www.cs.northwestern.edu/~hunicke/MDA.pdf)

**引擎化方式：** 每个体验承诺至少连接一条动态假设，每条动态再连接具体规则、资源、反馈或内容。编辑器可从体验向后问，也可从新机制向前检查它会支持或破坏什么。

**关键提醒：** 这里的 Aesthetics 指玩家体验，不等同于视听美术；CreatorEngine 的“美学设计点”和 MDA 的 A 应分开命名。

### 4.7 DDE：Design–Dynamics–Experience

DDE 被作者定义为对 MDA 的推进：用更广的 **Design** 容纳蓝图、机制、界面等设计对象，用主观 **Experience** 替代容易歧义的 Aesthetics。[Springer 图书页](https://link.springer.com/book/10.1007/978-3-319-53088-8)、[DDE 章节 DOI](https://doi.org/10.1007/978-3-319-53088-8_3)

**引擎化建议：** 用户界面直接使用“设计元素 → 运行动态 → 玩家体验”，比展示缩写更易懂；内部数据仍可兼容 MDA 标签。DDE 是更好的产品语言，MDA 是更好的知识来源。

### 4.8 Meaningful Play（有意义的游玩）

Salen 与 Zimmerman 将 meaningful play 的核心放在行动与结果的关系：结果应能被玩家辨识，并被整合进更大的游戏上下文。[Rules of Play（MIT Press）](https://mitpress.mit.edu/9780262240451/rules-of-play/) 对引擎而言，可转换成两个检查问题：

1. 玩家能否理解“我的哪个行动导致了这个结果”？
2. 这个结果是否影响之后的状态、选择或意义，而非一次性噪声？

它很适合作为每个循环步骤的反馈检查，但不是完整创作流程。

### 4.9 Game Design Canvas

实践者提出的 Game Design Canvas 用 **Core Experience、Base Mechanics、Reward/Punishment、Long-term Incentive、Aesthetic Layout** 把早期设计压到一页。[Introduction to the Game Design Canvas](https://www.gamedeveloper.com/design/introduction-to-the-game-design-canvas)

**适用：** 工作坊、快速概览、团队沟通。

**对 CreatorEngine：** 可作为自动生成的“单页视图”，不必再变成一套主数据模型。其字段已被体验、机制、循环、反馈和四分法覆盖。

### 4.10 Quantic Foundry Gamer Motivation Model

该模型基于大规模玩家调查，把 12 个动机组织为 6 组：

- Action：destruction、excitement；
- Social：competition、community；
- Mastery：challenge、strategy；
- Achievement：completion、power；
- Immersion：fantasy、story；
- Creativity：design、discovery。

来源与方法说明见 [Gamer Motivation Model](https://quanticfoundry.com/gamer-motivation-model/) 和 [模型开发说明](https://quanticfoundry.com/2015/07/20/how-we-developed-the-gamer-motivation-profile-v2/)。

**引擎化方式：** 把它作为“目标玩家为何来玩”的假设词表，允许选择 1–2 个主导动机和一个明确不服务的动机，再要求给出设计证据。

**局限：** 它是受众偏好模型，不是机制框架；人口统计、类型标签也不能替代真实用户研究。Bartle 类型源于 MUD 语境，不应未经验证地泛化到所有游戏；可把它保留在多人在线领域包中。[Bartle 原文档案](https://db.barbanon.org/source/00032673)

### 4.11 PENS / Self-Determination Theory

PENS 关注游玩是否支持三种心理需要：**自主（autonomy）、胜任（competence）、联结（relatedness）**。原始研究发现这些需要与游戏享受及未来游玩意愿相关，并讨论了控制/反馈、目标与策略选择、合作互动等设计因素。[Ryan, Rigby & Przybylski, 2006](https://selfdeterminationtheory.org/SDT/documents/2006_RyanRigbyPrzybylski_MandE.pdf)、[PENS 官方简介](https://selfdeterminationtheory.org/player-experience-of-needs-satisfaction-pens/)

**引擎化方式：** 用于体验假设和测试问卷，而不是把玩家分成三类。每个需要都应记录“设计支持方式”和“可能破坏方式”。

### 4.12 Four Keys to Fun

Nicole Lazzaro 将游戏乐趣讨论为 **Hard Fun、Easy Fun、People Fun、Serious Fun**，分别偏向挑战克服、好奇探索、人与人互动、游戏对情绪/意义的影响。[GDC Tutorial: Emotion Boot Camp](https://www.gamedeveloper.com/design/gdc-tutorial-emotion-boot-camp-putting-more-emotion-into-play)

**适用：** 情绪方向发散和体验组合检查。

**局限：** 它是启发式分类，不是穷尽的人类情绪理论；不要要求每个游戏四项齐全。

### 4.13 GameFlow

GameFlow 把游戏愉悦的启发式标准整理为 **专注、挑战、技能、控制、清晰目标、反馈、沉浸、社交互动** 八项。[Sweetser & Wyeth, GameFlow](https://www.valuesatplay.org/wp-content/uploads/2007/09/sweetser.pdf)

**引擎化方式：** 在可玩原型出现后生成测试清单和访谈题，不宜在最初灵感阶段强制填写。它能暴露“难，但不清楚为什么”“有目标，但反馈太迟”等具体问题。

### 4.14 Narrative Design Canvas

Teun Dubbelman 的 Narrative Design Canvas 以三大支柱组织叙事设计：

- **Experience：** emotion、motivation、identification、presence、experiential flow；
- **Interaction：** core mechanics、player goal、player role、player space、progression；
- **Narrative Context：** events、conflict、characters、setting、story。

开放获取章节见 [Narrative Design Canvas](https://www.degruyterbrill.com/document/doi/10.1515/9783839453452-004/pdf?licenseType=open-access)。

**引擎化方式：** 当用户选择“叙事驱动”或出现角色/情节风险时才展开。关键不是填满 15 个格子，而是检查“叙事事件由什么玩家行动触发”“角色冲突如何改变目标与空间”。

### 4.15 Game Design Patterns

Björk、Lundgren、Holopainen 把模式定义为反复出现、与玩法相关的互动结构，并研究模式之间的支持、冲突和调制关系。[Game Design Patterns 论文](https://www.cp.eng.chula.ac.th/~vishnu/gameResearch/design/game-design-patterns.pdf)、[Patterns in Game Design 书摘](https://www.gamedeveloper.com/design/book-excerpt-i-patterns-in-game-design-i-using-design-patterns)

**引擎化方式：** 做成可搜索的“设计模式库”，每张卡包含适用意图、前置条件、产生的动态、支持/冲突模式、成本和失败案例。它应服务于具体问题，例如“怎样制造信息不对称”，而非按顺序填写。

### 4.16 Deck of Lenses（透镜卡）

Schell 的 Deck of Lenses 把大量审视问题制成卡片，适合在停滞或复盘时切换观察角度。[The Art of Game Design: Deck of Lenses](https://deck.artofgamedesign.com/)

**引擎化方式：** 由当前设计缺口和风险定向推荐 1–3 张，而不是随机向用户倾倒问题。卡片回答应能链接回具体设计节点和决策。

### 4.17 Machinations

Machinations 用图形描述游戏内部经济与资源流，并支持模拟，从而在完整实现前讨论平衡。原论文将其定位为把资源流、结构和动态变得可见的设计工具。[Machinations: The Game Mechanics Diagramming Language](https://ojs.aaai.org/index.php/AIIDE/article/view/12477)、[Machinations Documentation](https://machinations.io/docs)

常见节点包括资源、来源、池、消耗、转换、交易和门。

**引擎化方式：** MVP 先提供轻量“来源 → 存量 → 转换 → 消耗”图和守恒/无穷增长提示；不要一开始重做完整模拟器。后续可导出到专业工具或添加参数模拟。

### 4.18 Rational Game Design / Rational Level Design

Ubisoft 相关实践把机制拆成可变化参数，用矩阵系统地探索挑战、组合和难度曲线；RLD 则把这种思路用于关卡。[Chris McEntee 的 Rational Design 访谈](https://www.gamedeveloper.com/design/-em-rayman-origins-em-designer-chris-mcentee-s-rational-approach-to-game-design)、[The Rational Design Handbook: An Intro to RLD](https://www.gamedeveloper.com/design/the-rational-design-handbook-an-intro-to-rld)

**引擎化方式：** 高级模块可从一个机制生成参数表，例如速度、空间、信息、时限、资源、敌人组合，再建立测试矩阵与难度假设。

**局限：** 表格精确不代表体验真实；过早参数化会制造“科学感”并压平惊喜，必须配合试玩证据。

### 4.19 Playcentric Design（以玩家为中心的迭代）

Fullerton 的流程从玩家体验目标开始：构思 → 原型 → 试玩 → 对照目标评估 → 排序修改 → 再测，循环进行。[Game Design Workshop 书摘](https://www.gamedeveloper.com/design/book-excerpt-game-design-workshop) Eric Zimmerman 也把快速原型、试玩和根据体验持续演化视为游戏设计发生的核心位置。[How I Teach Game Design, Lesson 1](https://www.gamedeveloper.com/design/how-i-teach-game-design-lesson-1-the-game-design-process-)

**对 CreatorEngine 的意义：** 当前导出 Markdown 不应是终点。项目应进入“假设—原型—观察—决策”的活文档状态，每次测试都能更新设计可信度。

### 4.20 What Do Prototypes Prototype?

Houde 与 Hill 提出用三个问题区分原型关注点：**Role（它在用户生活/体验中做什么）、Look and Feel（交互感受如何）、Implementation（技术如何工作）**，另有整合型原型。[What Do Prototypes Prototype?](https://creativetech.mat.ucsb.edu/readings/Prototypes_prototype.pdf)

映射到游戏：

- Role：玩家是否理解目标、身份和价值？
- Look and Feel：操作、反馈、节奏是否产生目标感受？
- Implementation：网络、AI、物理、生成系统是否可行？
- Integration：垂直切片能否把关键链路放在一起？

**引擎化方式：** 原型任务必须先选择风险类型和一个问题，防止团队用高完成度美术掩盖尚未验证的玩法。

### 4.21 RITE：Rapid Iterative Testing and Evaluation

RITE 的特点是在每轮少量用户测试后，对证据充分且修复明确的问题立即修改，而不是等完整研究结束。该方法曾用于《帝国时代 II》教程的快速测试迭代。[RITE Method 论文](https://citeseerx.ist.psu.edu/document?doi=5340ef8a91900840263a4036b0433a389b7097b2&repid=rep1&type=pdf)

**引擎化方式：** 测试记录区分“立即修”“需要更多样本”“与目标冲突但暂不改”，并保留版本与理由。RITE 适合明确的可用性/理解问题，不代表一次观察就能证实所有体验结论。

### 4.22 DPE：Design–Play–Experience

Brian Winn 的 DPE 框架面向严肃游戏，把 **学习/教学、叙事、玩法、用户体验、技术** 等层连接到 Design–Play–Experience 过程。[Michigan State University: Serious Game Construction Worksheet](https://gel.msu.edu/winn/Serious%20Game%20Construction%20Worksheet.pdf)、[The Design, Play, and Experience Framework](https://edutainment.pbworks.com/f/winn_2008.pdf)

**引擎化方式：** 作为教育、训练或行为改变项目的扩展包，增加学习目标、教学策略、评估证据及其与玩法的映射。普通娱乐游戏不应被迫填写教学层。

### 4.23 Values at Play

Values at Play 提供在概念、设计和测试中有意识处理价值观的方法，避免价值只停留在主题声明。[MIT Press: Values at Play in Digital Games](https://mitpress.mit.edu/9780262529976/values-at-play-in-digital-games/)

**引擎化方式：** 对涉及社会模拟、历史、政治、儿童、社区治理或生成内容的项目，增加“系统奖励了什么、让谁有能动性、谁承担代价、哪些结果被自然化”的检查模块。

## 五、不要把相似词表混为一谈

| 名称 | 它描述什么 | 典型问题 | 不应该被当作什么 |
|---|---|---|---|
| MDA 的 Aesthetics | 设计者期望的体验类别 | 希望玩家感到挑战还是表达？ | 美术风格 |
| Elemental Tetrad 的 Aesthetics | 感官呈现与审美元素 | 视觉、声音、触感如何服务整体？ | 完整玩家体验 |
| Quantic Foundry | 玩家偏好/动机画像 | 目标玩家为何愿意来玩？ | 玩法质量评分 |
| PENS | 游戏过程对心理需要的支持 | 是否给了自主、胜任和联结？ | 玩家类型 |
| Four Keys | 乐趣和情绪方向 | 这次体验偏挑战、探索、社交还是意义？ | 穷尽的情绪科学 |
| GameFlow | 原型后的体验启发式 | 目标、挑战、反馈和控制是否匹配？ | 创意生成器 |
| 设计支柱 | 单个项目的取舍原则 | 这个功能是否支持我们的承诺？ | 固定通用分类 |
| Elemental Tetrad | 通用设计维度 | 四类元素是否协同？ | 项目特有支柱 |

这一区分应进入产品术语表和字段帮助，否则系统会产生看似丰富、实则重复的回答。

## 六、对当前 CreatorEngine 的诊断

### 6.1 已经覆盖得较好的部分

| 当前步骤/字段 | 对应方法 | 价值 |
|---|---|---|
| 原始想法 | 发散入口 | 保留创作者原话，门槛低 |
| 核心火花、玩家行为、体验承诺、重写一句话 | High Concept + 体验意图 | 从题材转向行动与感受 |
| 玩家 Fantasy | MDA 的 fantasy 及动机启发 | 帮助创作者思考玩家扮演/欲望 |
| 类型、目标受众、差异化 X | 市场定位 + 约束创意 | 强制说明“为谁、与常规有何不同” |
| 叙事、机制、美学、技术 | Elemental Tetrad | 对设计维度做覆盖检查 |
| 总结与 Markdown 导出 | 概念文档 | 便于沟通和留档 |

### 6.2 主要缺口

1. **Fantasy 与受众混在同一抽象层。** “我想成为谁”和“我为什么持续游玩”不同；建议保留 Fantasy，再增加 1–2 个动机假设。
2. **“四大支柱”实际是通用四分法。** 缺少项目自己的 2–4 条取舍原则。
3. **没有循环结构。** 玩家行为字段是静态描述，不能看出反馈、状态变化、下一次决策和时间尺度。
4. **机制到体验之间缺少 Dynamics。** 系统容易生成“加一个机制来获得某种情绪”的跳跃推理。
5. **缺少规则完整性检查。** 玩家、目标、资源、冲突、边界、结果等没有被系统性追踪。
6. **缺少假设与证据状态。** 所有设计陈述看起来同样确定，无法区分灵感、推测、原型观察和已重复验证结果。
7. **导出被当成终点。** 没有测试轮次、决策日志、废弃原因和版本间差异。
8. **没有按风险展开专项工具。** 叙事、资源经济、关卡参数、多人关系等需要不同模块，不宜用同一组通用问题处理。

## 七、建议的 CreatorEngine 主流程

主流程应尽可能短，并把框架名藏在产品背后：

### 第 0 步：保存原始火花

保留原话，不急于规范化。记录创作者最不愿丢掉的元素。

### 第 1 步：形成核心玩法句

结构化身份、核心动词、目标、约束/反转；同时生成体验承诺句。系统给出缺项和过度宽泛提示。

### 第 2 步：确定玩家与体验

记录目标受众、玩家 Fantasy、1–2 个主导动机、目标体验和明确不服务的体验。避免“适合所有人”。

### 第 3 步：建立项目设计支柱

创建 2–4 条项目特有支柱，每条包含承诺、做/不做和验证信号。现有叙事/机制/美学/技术改名为“设计维度”，作为后续覆盖视图。

### 第 4 步：画出玩家循环与形式结构

先画原子循环，再按项目需要添加会话和进展循环。由系统从循环推导 Formal Elements 的已知项，只追问关键空白。

### 第 5 步：建立体验因果图

从目标体验向后连接：

> 目标体验 ← 可观察动态 ← 规则/资源/反馈/叙事/呈现

每条连接都是待验证假设。四类设计元素在这里服务于因果链，而不是四段互不相干的文字。

### 第 6 步：选择最大风险并定义原型

让创作者从“角色/价值理解、操作感受、技术可行性、系统平衡、内容生产、市场/受众”等风险中排序，只为最大风险设计最小原型：问题、保留内容、刻意省略内容、成功/失败信号、期限。

### 第 7 步：测试、记录证据、迭代

每次试玩记录观察而非先记录解释；把结论链接到原假设，决定保留、修改、继续取样或废弃。总结页实时更新，并保留决策历史。

## 八、推荐的数据模型：从线性问卷变成类型化设计图

只用嵌套表单会让后续框架不断复制字段。更稳健的内部模型是“节点 + 关系 + 证据”。

### 8.1 关键节点

```text
Project
├─ Intent: spark, conceptSentence, experiencePromise
├─ Audience: segment, fantasy, motivation
├─ Pillar: promise, do, dont, proof
├─ Experience: desiredEmotion, need, antiExperience
├─ Loop: horizon, goal, steps[]
├─ Action: verb, input, cost, target
├─ System: rule, resource, state, boundary, outcome
├─ Dynamic: predictedBehavior, tradeoff, emergentPattern
├─ Element: narrative | mechanics | aesthetics | technology
├─ Risk: type, severity, uncertainty, dependency
├─ Prototype: question, dimension, scope, successSignal
└─ Evidence: observation, source, confidence, decision, version
```

### 8.2 关键关系

- `supports`：设计元素支持体验或支柱；
- `causes`：机制被假设会造成动态；
- `constrains`：规则/支柱约束方案；
- `conflicts_with`：两个目标或设计相冲突；
- `appears_in`：动作/资源出现在哪层循环；
- `validated_by`：假设由哪个原型/证据验证；
- `derived_from`：改写结果源于哪段用户原话；
- `replaced_by`：废弃决策由哪个版本取代。

### 8.3 可信度状态

建议每个关键陈述具有状态，而不是统一显示为“设计”：

1. `idea`：未经推理的想法；
2. `hypothesis`：有因果理由但未测试；
3. `prototyped`：已在原型中实现；
4. `observed`：至少有一次观察；
5. `supported`：重复证据支持；
6. `contradicted`：证据不支持；
7. `retired`：已废弃但保留历史。

这会让 CreatorEngine 从“文案生成器”升级为“设计推理与证据系统”。

## 九、可自动化但不武断的检查规则

### 概念层

- 核心句是否包含身份、玩家动词、目标和有决策影响的约束？
- 目标受众是否只写了年龄/平台，而没有动机或情境？
- 差异点是否真的改变动作、规则、关系或节奏？

### 结构层

- 每层循环是否都有玩家决策、状态变化、反馈和下一次投入？
- 是否存在没有来源的消耗资源，或没有消耗口的无限积累资源？
- 是否定义边界、结束/转阶段条件和失败后的状态？

### 因果层

- 每个关键体验是否至少有一条动态和一条具体设计元素支持？
- 是否把内容量或美术质量直接等同于体验，而没有行为机制？
- 两个机制是否对同一动态给出相反激励？

### 取舍层

- 高成本功能支持哪个项目支柱？
- 某项设计是否违反“明确不做”？如果是，是否记录了例外理由？
- 支柱之间发生冲突时是否有优先级或情境规则？

### 验证层

- 每个最高风险是否有原型问题和可观察信号？
- 成功标准是否只是“玩家说喜欢”，还是包含实际行为？
- 结论是否超出样本与原型能证明的范围？
- 修改是否保留原因和受影响的设计节点？

提示语应使用“这里可能缺少……”“这两个假设似乎冲突……”，而不是把启发式规则伪装成设计真理。

## 十、框架路由：系统问问题，不考用户术语

CreatorEngine 可以先问“你现在卡在哪里”，再调用框架：

| 用户状态 | 系统路由 |
|---|---|
| 想法太散，说不清 | 核心玩法句 + 项目支柱 |
| 有题材，没有玩法 | 玩家动词 + Formal Elements + 原子循环 |
| 有很多机制，不知道是否协同 | MDA/DDE 因果图 + 支柱冲突检查 |
| 不知道玩家为何持续 | 动机模型 + 会话/进展循环 + PENS |
| 剧情与玩法脱节 | Narrative Design Canvas |
| 经济总是崩 | 轻量 Machinations 资源图 |
| 关卡难度凭感觉 | Rational Design 参数矩阵 |
| 不知道下一步做什么 | 最大风险排序 + 原型维度 |
| 试玩信息很多但无法决策 | Playcentric/RITE 证据与决策日志 |
| 团队陷入熟悉套路 | Patterns + Deck of Lenses 触发卡 |

卡片系统可借鉴设计工具包的分层思路：

- **知识卡：** 简述一种框架或模式；
- **触发卡：** 提供变体、反转和案例；
- **反思卡：** 指向当前设计的矛盾、缺口或风险；
- **自定义卡：** 团队沉淀自己的原则和复盘问题。

教育游戏卡片工具 LEAGUE 也使用 Primary、Trigger、Reflection、Custom 等卡片角色，证明这种“知识—触发—反思—自定义”的产品化结构具有参考价值。[LEAGUE: A Game Design Card Toolkit](https://www.mdpi.com/2071-1050/12/20/8487)

## 十一、实现优先级

### P0：形成真正闭环的最小版本

1. 一句话编辑器：身份/动词/目标/约束字段与质量提示；
2. 项目特有设计支柱：承诺、做、不做、证明；
3. 三层可选玩家循环，至少要求动作—状态—反馈；
4. 简化 DDE 因果图：设计元素 → 动态假设 → 体验；
5. 最大风险与原型卡：问题、类型、成功信号；
6. 证据状态和一次测试记录。

P0 的完成标准不是“支持几个框架”，而是一个项目能从概念走到一次有记录的验证，再返回修改概念。

### P1：提高完整性与团队可用性

- Formal Elements 自动补全/缺口检查；
- Quantic Foundry 动机轻量词表与 PENS 检查；
- 节点关系、冲突提示和影响范围；
- 版本、决策日志、导出变更摘要；
- 自动生成 Game Design Canvas/一页概览，而非重复输入。

### P2：专项设计模块

- Narrative Design Canvas；
- 资源来源—存量—转换—消耗图；
- GameFlow 原型评估表；
- 关卡参数与难度矩阵；
- 多人关系、价值与安全性扩展检查。

### P3：知识与模拟生态

- 带关系和案例的 Game Design Pattern 库；
- 按当前缺口推荐的 Lens 卡；
- 资源流参数模拟与外部工具导出；
- 类型/平台/商业模式专项包；
- 团队自定义框架、字段和检查规则。

## 十二、建议的导出结构

```text
1. 原始火花与版本信息
2. 核心玩法句 / 体验承诺句
3. 目标玩家、Fantasy 与动机假设
4. 项目设计支柱（含做/不做/证明）
5. 原子、会话、进展循环
6. 玩家/目标/规则/资源/冲突/边界/结果
7. 体验因果图：设计元素 → 动态 → 体验
8. 叙事/机制/美学/技术覆盖视图
9. 最大风险、原型问题与成功信号
10. 测试证据、结论、未决问题
11. 决策日志与版本差异
12. 可选专项附录：叙事、经济、关卡、价值等
```

报告应同时提供“阅读版 Markdown/PDF”和“机器可读 JSON”。Markdown 用于沟通，JSON 保留节点、关系、状态和证据，避免导出后无法继续编辑。

## 十三、应避免的产品陷阱

1. **框架堆叠：** 框架数量成为卖点，用户却要填几十页同义问题。
2. **伪确定性：** 系统生成的句子语气很完整，但尚无试玩证据。
3. **表单完成主义：** 把填满字段误当成做好设计。
4. **体验词漂移：** “幻想、沉浸、美学、乐趣、动机”混用，导致无法验证。
5. **错误泛化：** 把 Bartle、Four Keys 或某类商业游戏循环当作普遍人性。
6. **过早数值化：** 难度矩阵和资源公式制造精确幻觉，却没验证核心动作是否好玩。
7. **用文档替代试玩：** 完美的 GDD 不能证明运行时动态。
8. **只记录结论，不记录反证：** 团队会反复走回已失败方案。
9. **暗黑模式默认化：** 不应把留存、变现或无尽投入默认成所有游戏的成功标准。
10. **AI 替代作者判断：** 系统应指出缺口、生成候选、追踪推理；最终取舍与审美判断属于创作者。

## 十四、推荐参考书目与一手资料

以下资料按用途整理，便于后续建立框架知识库：

### 愿景与概念

- Jerome Goomba, [Game Design as a Sentence](https://www.gamedeveloper.com/design/game-design-as-a-sentence-)
- Chris Taylor, [The Anatomy of a Design Document, Part 1](https://www.gamedeveloper.com/design/the-anatomy-of-a-design-document-part-1-documentation-guidelines-for-the-game-concept-and-proposal)
- David Mullich, [An Actionable Game Design Document Template](https://davidmullich.com/2018/06/25/an-actionable-game-design-document-template/)
- [Introduction to the Game Design Canvas](https://www.gamedeveloper.com/design/introduction-to-the-game-design-canvas)

### 结构与体验因果

- Hunicke, LeBlanc, Zubek, [MDA: A Formal Approach to Game Design and Game Research](https://www.cs.northwestern.edu/~hunicke/MDA.pdf)
- Jesse Schell, [The Art of Game Design：The Game Consists of Elements](https://www.taylorfrancis.com/chapters/mono/10.1201/b22101-5/game-consists-elements-jesse-schell) 与 [Deck of Lenses](https://deck.artofgamedesign.com/)
- Salen & Zimmerman, [Rules of Play（MIT Press）](https://mitpress.mit.edu/9780262240451/rules-of-play/)
- Walk, Görlich, Barrett, [Design, Dynamics, Experience (DDE)](https://doi.org/10.1007/978-3-319-53088-8_3)
- Tracy Fullerton, [Game Design Workshop 书摘](https://www.gamedeveloper.com/design/book-excerpt-game-design-workshop)
- Steve Swink, Eric Zimmerman 等相关当代综述脉络可参见 Robert Zubek, [Elements of Game Design（MIT Press）](https://mitpress.mit.edu/9780262043915/elements-of-game-design/)

### 玩家体验与动机

- Quantic Foundry, [Gamer Motivation Model](https://quanticfoundry.com/gamer-motivation-model/)
- Ryan, Rigby, Przybylski, [The Motivational Pull of Video Games](https://selfdeterminationtheory.org/SDT/documents/2006_RyanRigbyPrzybylski_MandE.pdf)
- Sweetser & Wyeth, [GameFlow](https://www.valuesatplay.org/wp-content/uploads/2007/09/sweetser.pdf)
- Nicole Lazzaro, [Four Keys / Emotion Boot Camp](https://www.gamedeveloper.com/design/gdc-tutorial-emotion-boot-camp-putting-more-emotion-into-play)

### 专项设计

- Dubbelman, [Narrative Design Canvas](https://www.degruyterbrill.com/document/doi/10.1515/9783839453452-004/pdf?licenseType=open-access)
- Dormans, [Machinations: The Game Mechanics Diagramming Language](https://ojs.aaai.org/index.php/AIIDE/article/view/12477)
- Björk, Lundgren, Holopainen, [Game Design Patterns](https://www.cp.eng.chula.ac.th/~vishnu/gameResearch/design/game-design-patterns.pdf)
- Chris McEntee, [Rational Game Design](https://www.gamedeveloper.com/design/-em-rayman-origins-em-designer-chris-mcentee-s-rational-approach-to-game-design)
- Flanagan & Nissenbaum, [Values at Play in Digital Games](https://mitpress.mit.edu/9780262529976/values-at-play-in-digital-games/)

### 原型与迭代

- Houde & Hill, [What Do Prototypes Prototype?](https://creativetech.mat.ucsb.edu/readings/Prototypes_prototype.pdf)
- Medlock et al., [The Rapid Iterative Test and Evaluation Method](https://citeseerx.ist.psu.edu/document?doi=5340ef8a91900840263a4036b0433a389b7097b2&repid=rep1&type=pdf)
- Eric Zimmerman, [How I Teach Game Design: The Game Design Process](https://www.gamedeveloper.com/design/how-i-teach-game-design-lesson-1-the-game-design-process-)
- Brian Winn, [Serious Game Construction Worksheet（Michigan State University）](https://gel.msu.edu/winn/Serious%20Game%20Construction%20Worksheet.pdf) 与 [The Design, Play, and Experience Framework](https://edutainment.pbworks.com/f/winn_2008.pdf)

## 十五、最终建议

CreatorEngine 不应定位为“把常见 GDD 问题搬到网页上”，而应定位为：

> **把创作者的直觉压缩成可讨论的概念，把概念展开成可追踪的设计因果，再把最大的不确定性转成最小可验证原型。**

一句话模板是很好的入口，但真正形成差异化的是它之后的链路：**句子里的动作能生成循环，循环里的规则能连接动态，动态能连接体验，体验声明能连接证据，证据能反过来改变设计。** 这条闭环比收集更多孤立模板更值得成为游戏创作引擎的核心。
