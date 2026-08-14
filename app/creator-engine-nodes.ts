export type PhaseId = "start" | "clarify" | "structure" | "judge" | "act" | "evidence";

export type NodeMeta = {
  id: string;
  phase: PhaseId;
  title: string;
  short: string;
  purpose: string;
  reference?: string;
  checkpoint?: boolean;
};

export const phases: Array<{ id: PhaseId; title: string; short: string; description: string }> = [
  { id: "start", title: "项目入口", short: "入口", description: "选择这次要推进的结果" },
  { id: "clarify", title: "澄清核心", short: "澄清", description: "保住火花，说清动作、目标与体验" },
  { id: "structure", title: "设计骨架", short: "构架", description: "建立支柱、循环、选择与因果" },
  { id: "judge", title: "判断与取舍", short: "判断", description: "用参考、约束与风险做决定" },
  { id: "act", title: "行动路径", short: "行动", description: "把未知变成最小验证工作" },
  { id: "evidence", title: "证据迭代", short: "迭代", description: "用观察修正设计而非装饰文档" },
];

export const nodes: NodeMeta[] = [
  { id: "S0", phase: "start", title: "从哪里开始", short: "项目入口", purpose: "选择这次工作的入口，而不是被迫从头填写。" },
  { id: "A0", phase: "clarify", title: "保存原始火花", short: "原始想法", purpose: "保留作者原话，后续改写永远不会覆盖它。" },
  { id: "A1", phase: "clarify", title: "找出不可失去的火花", short: "核心火花", purpose: "当方案膨胀时，知道什么值得被优先保护。" },
  { id: "A2", phase: "clarify", title: "确定玩家 Fantasy", short: "玩家身份", purpose: "说明玩家在行动中相信自己是谁、能做到什么。", reference: "Fantasy 与 PENS：身份愿望不是世界观标签。" },
  { id: "A3", phase: "clarify", title: "抓住核心动作", short: "核心动作", purpose: "用可观察动词定义玩家最常、最有意义地做什么。", reference: "High Concept：主语是玩家，动词是核心机制，补语是目标。" },
  { id: "A4", phase: "clarify", title: "说明目标与变化", short: "目标结果", purpose: "让动作指向一个可感知的状态变化。" },
  { id: "A5", phase: "clarify", title: "加入张力或约束", short: "关键张力", purpose: "让动作产生选择，而不只是机械重复。" },
  { id: "A6", phase: "clarify", title: "形成核心玩法句", short: "玩法句", purpose: "把身份、动作、目标与约束压缩成可继续设计的一句话。", reference: "模板：玩家作为［身份］，反复［动作］，以［目标］；但［约束］。" },
  { id: "A7", phase: "clarify", title: "写下体验承诺", short: "体验承诺", purpose: "把抽象感受绑定到具体时刻与可观察信号。", reference: "MDA / PENS / Four Keys 只提供词汇，答案必须回到本项目行为。" },
  { id: "A8", phase: "clarify", title: "概念检查点", short: "概念简报", purpose: "确认当前概念准确，或带着未知继续。", checkpoint: true },

  { id: "B1", phase: "structure", title: "建立项目设计支柱", short: "项目支柱", purpose: "用 2–4 条项目专属原则支持后续取舍。", reference: "支柱要包含承诺、会做、不做和成立证据。" },
  { id: "B2", phase: "structure", title: "画出原子玩家循环", short: "原子循环", purpose: "说明 5–30 秒内如何感知、决定、行动、变化并获得反馈。", reference: "有意义的循环必须让行动结果可辨识并影响下一次选择。" },
  { id: "B3", phase: "structure", title: "定义关键选择", short: "关键选择", purpose: "让核心循环包含真实权衡或可学习的操作挑战。" },
  { id: "B6", phase: "structure", title: "补齐规则边界", short: "形式元素", purpose: "检查玩家、程序、规则、资源、冲突、边界和结果。", reference: "Formal Elements 用于结构补漏，不负责证明有趣。" },
  { id: "B7", phase: "structure", title: "连接设计、动态与体验", short: "体验因果", purpose: "解释设计为什么可能让玩家形成某种行为并感到目标体验。", reference: "DDE：Design → Dynamics → Experience。每条连接都是待验证假设。" },
  { id: "B8", phase: "structure", title: "检查四类设计维度", short: "设计维度", purpose: "让叙事、机制、美学和技术共同服务支柱与因果链。", reference: "Elemental Tetrad 是通用设计维度，不等于项目特有支柱。" },
  { id: "B9", phase: "structure", title: "结构检查点", short: "设计骨架", purpose: "确认结构足以进入判断，或回到最重要的缺口。", checkpoint: true },

  { id: "C1", phase: "judge", title: "确定目标玩家与动机", short: "目标玩家", purpose: "说明谁会主动寻求这种体验、为何持续投入。", reference: "Quantic Foundry 描述偏好；PENS 检查自主、胜任和联结。" },
  { id: "C2", phase: "judge", title: "建立规则预期与参考", short: "参考对象", purpose: "借用参考来判断结构，而不是只模仿表面。", reference: "每个参考都要写清用途、借鉴和避免。" },
  { id: "C3", phase: "judge", title: "确认差异化", short: "差异化", purpose: "选择一个真正改变玩家决策或体验的不同点。" },
  { id: "C4", phase: "judge", title: "声明硬约束", short: "硬约束", purpose: "把平台、团队、时间和内容边界放进判断。" },
  { id: "C5", phase: "judge", title: "检查可行性分面", short: "可行性", purpose: "分别判断体验、系统、技术、内容、生产与触达，不制造虚假总分。" },
  { id: "C7", phase: "judge", title: "选出最大风险", short: "最大风险", purpose: "找到最可能让整个方向不成立的未知。" },
  { id: "C9", phase: "judge", title: "做出当前判断", short: "当前判断", purpose: "记录选择、理由、反证条件与复查时机。" },
  { id: "C10", phase: "judge", title: "判断检查点", short: "判断单", purpose: "确认依据足以安排工作，而不是宣告游戏已经可行。", checkpoint: true },

  { id: "D0", phase: "act", title: "汇总未决问题", short: "问题清单", purpose: "收集假设、风险、冲突和延期项。" },
  { id: "D2", phase: "act", title: "选择首要问题", short: "一号问题", purpose: "下一轮只解决最会改变决定的一个问题。" },
  { id: "D3", phase: "act", title: "写出可验证假设", short: "验证假设", purpose: "提前写清相信什么、什么观察会推翻它。", reference: "如果［设计］，玩家会［动态］，进而［体验/结果］。" },
  { id: "D4", phase: "act", title: "限定最小原型", short: "原型范围", purpose: "只实现回答当前问题所必需的内容。", reference: "原型可聚焦 Role、Look & Feel、Implementation 或系统模拟。" },
  { id: "D5", phase: "act", title: "定义测试与停止条件", short: "测试信号", purpose: "区分支持、反驳与仍然不知道。" },
  { id: "D6", phase: "act", title: "排出工作路径", short: "工作路径", purpose: "把动作变成有产物、负责人和完成定义的任务。" },
  { id: "D8", phase: "act", title: "行动工作台", short: "行动图", purpose: "从一号问题直接开始本轮工作，并保留备选与不做清单。", checkpoint: true },

  { id: "I0", phase: "evidence", title: "记录实际观察", short: "观察", purpose: "先记录发生了什么，再解释原因。" },
  { id: "I1", phase: "evidence", title: "对照假设", short: "证据判断", purpose: "判断观察支持、反驳还是不足以说明。" },
  { id: "I2", phase: "evidence", title: "做出迭代决定", short: "迭代决定", purpose: "保留、调整、替换、继续取样或放弃。" },
  { id: "I3", phase: "evidence", title: "标记影响范围", short: "影响复核", purpose: "让证据回流到概念、循环、风险与任务。" },
  { id: "I4", phase: "evidence", title: "选择下一轮", short: "下一轮", purpose: "回到需要被证据修正的阶段。", checkpoint: true },
];

export const nodeMap = Object.fromEntries(nodes.map((node) => [node.id, node])) as Record<string, NodeMeta>;

export function nodesForPhase(phase: PhaseId) {
  return nodes.filter((node) => node.phase === phase);
}

export function nextSequentialNode(nodeId: string) {
  const index = nodes.findIndex((node) => node.id === nodeId);
  return nodes[Math.min(nodes.length - 1, Math.max(0, index + 1))]?.id ?? "S0";
}

export function previousSequentialNode(nodeId: string) {
  const index = nodes.findIndex((node) => node.id === nodeId);
  return nodes[Math.max(0, index - 1)]?.id ?? "S0";
}
