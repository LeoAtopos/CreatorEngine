export type WorkDepth = "quick" | "standard" | "deep";
export type CompletionMode = "answered" | "assumption" | "not_applicable" | "deferred";
export type EvidenceStatus = "idea" | "hypothesis" | "observed" | "supported" | "contradicted" | "retired";
export type FeasibilityStatus = "evidence" | "testable" | "uncertain" | "not_relevant";

export type Pillar = {
  id: string;
  name: string;
  promise: string;
  do: string;
  doNot: string;
  proof: string;
};

export type TaskItem = {
  id: string;
  action: string;
  deliverable: string;
  owner: string;
  doneDefinition: string;
};

export type Observation = {
  id: string;
  context: string;
  fact: string;
  interpretation: string;
};

export type ProjectState = {
  version: 3;
  name: string;
  currentNodeId: string;
  depth: WorkDepth;
  sessionGoal: string;
  rawIdea: string;
  sparkCategory: string;
  spark: string;
  fantasyId: string;
  fantasyStatement: string;
  coreVerb: string;
  coreObject: string;
  supportActions: string;
  shortGoal: string;
  longGoal: string;
  outcomeState: string;
  constraintType: string;
  constraint: string;
  conceptSentence: string;
  experiences: string[];
  antiExperience: string;
  experienceMoment: string;
  observableSignal: string;
  pillars: Pillar[];
  atomicLoop: {
    perceive: string;
    decide: string;
    act: string;
    change: string;
    feedback: string;
  };
  coreDecision: {
    moment: string;
    optionA: string;
    tradeoffA: string;
    optionB: string;
    tradeoffB: string;
    information: string;
  };
  formal: {
    players: string;
    procedures: string;
    rules: string;
    resources: string;
    conflict: string;
    boundaries: string;
    outcomes: string;
  };
  causal: {
    design: string;
    dynamic: string;
    experience: string;
    rationale: string;
    counterCondition: string;
  };
  dimensions: {
    narrative: string;
    mechanics: string;
    aesthetics: string;
    technology: string;
  };
  audienceMotivations: string[];
  excludedMotivation: string;
  audienceContext: string;
  genres: string[];
  genreCustom: string;
  referenceTitle: string;
  referenceUse: string;
  referenceBorrow: string;
  referenceAvoid: string;
  differentiationType: string;
  differentiation: string;
  constraints: {
    platform: string;
    playMode: string;
    team: string;
    time: string;
    budget: string;
    content: string;
  };
  feasibility: Record<string, FeasibilityStatus>;
  feasibilityNotes: Record<string, string>;
  topRisk: {
    type: string;
    statement: string;
    impact: string;
    uncertainty: string;
    validationCost: string;
  };
  decision: {
    choice: string;
    rationale: string;
    falsifier: string;
    revisit: string;
  };
  openQuestions: string[];
  nextQuestion: string;
  changeIfAnswered: string;
  hypothesis: {
    setup: string;
    behavior: string;
    result: string;
    supportSignal: string;
    refuteSignal: string;
  };
  prototype: {
    type: string;
    mustBuild: string;
    omit: string;
    participants: string;
    timebox: string;
  };
  testPlan: {
    observe: string;
    ask: string;
    rounds: string;
    stopCondition: string;
  };
  tasks: TaskItem[];
  contingency: string;
  notNow: string;
  observations: Observation[];
  evidenceAssessment: string;
  iterationDecision: string;
  iterationReason: string;
  evidenceStatus: EvidenceStatus;
  statuses: Record<string, CompletionMode>;
  reviewNodes: string[];
  updatedAt: string;
};

export type DesignIssue = {
  id: string;
  label: string;
  kind: "gap" | "risk" | "review" | "deferred";
  nodeId: string;
  severity: "blocking" | "recommended" | "notice";
};

export const STORAGE_KEY = "creator-engine.game-design.v3";
export const LEGACY_STORAGE_KEY = "creator-engine.game-design.v2";

const blankPillar = (id: string): Pillar => ({ id, name: "", promise: "", do: "", doNot: "", proof: "" });
const blankTask = (id: string): TaskItem => ({ id, action: "", deliverable: "", owner: "", doneDefinition: "" });
const blankObservation = (id: string): Observation => ({ id, context: "", fact: "", interpretation: "" });

export function emptyProject(): ProjectState {
  return {
    version: 3,
    name: "未命名游戏",
    currentNodeId: "S0",
    depth: "standard",
    sessionGoal: "",
    rawIdea: "",
    sparkCategory: "",
    spark: "",
    fantasyId: "",
    fantasyStatement: "",
    coreVerb: "",
    coreObject: "",
    supportActions: "",
    shortGoal: "",
    longGoal: "",
    outcomeState: "",
    constraintType: "",
    constraint: "",
    conceptSentence: "",
    experiences: [],
    antiExperience: "",
    experienceMoment: "",
    observableSignal: "",
    pillars: [blankPillar("pillar-1"), blankPillar("pillar-2")],
    atomicLoop: { perceive: "", decide: "", act: "", change: "", feedback: "" },
    coreDecision: { moment: "", optionA: "", tradeoffA: "", optionB: "", tradeoffB: "", information: "" },
    formal: { players: "", procedures: "", rules: "", resources: "", conflict: "", boundaries: "", outcomes: "" },
    causal: { design: "", dynamic: "", experience: "", rationale: "", counterCondition: "" },
    dimensions: { narrative: "", mechanics: "", aesthetics: "", technology: "" },
    audienceMotivations: [],
    excludedMotivation: "",
    audienceContext: "",
    genres: [],
    genreCustom: "",
    referenceTitle: "",
    referenceUse: "",
    referenceBorrow: "",
    referenceAvoid: "",
    differentiationType: "",
    differentiation: "",
    constraints: { platform: "", playMode: "", team: "", time: "", budget: "", content: "" },
    feasibility: {},
    feasibilityNotes: {},
    topRisk: { type: "", statement: "", impact: "", uncertainty: "", validationCost: "" },
    decision: { choice: "", rationale: "", falsifier: "", revisit: "" },
    openQuestions: [""],
    nextQuestion: "",
    changeIfAnswered: "",
    hypothesis: { setup: "", behavior: "", result: "", supportSignal: "", refuteSignal: "" },
    prototype: { type: "", mustBuild: "", omit: "", participants: "", timebox: "" },
    testPlan: { observe: "", ask: "", rounds: "", stopCondition: "" },
    tasks: [blankTask("task-1"), blankTask("task-2")],
    contingency: "",
    notNow: "",
    observations: [blankObservation("observation-1")],
    evidenceAssessment: "",
    iterationDecision: "",
    iterationReason: "",
    evidenceStatus: "idea",
    statuses: {},
    reviewNodes: [],
    updatedAt: "",
  };
}

type LegacyProject = {
  version?: number;
  currentStage?: string;
  rawIdea?: string;
  refine?: { spark?: string; playerAction?: string; experience?: string; refinedIdea?: string };
  fantasyId?: string | null;
  fantasyStatement?: string;
  genreIds?: string[];
  genreCustom?: string;
  audienceIds?: string[];
  audienceNote?: string;
  xId?: string | null;
  xStatement?: string;
  pillars?: Partial<ProjectState["dimensions"]>;
};

export function migrateLegacyProject(legacy: LegacyProject): ProjectState {
  const project = emptyProject();
  const stageMap: Record<string, string> = {
    idea: "A0",
    refine: "A1",
    fantasy: "A2",
    framework: "C1",
    pillars: "B8",
    summary: "D8",
  };

  project.currentNodeId = stageMap[legacy.currentStage ?? ""] ?? "A0";
  project.rawIdea = legacy.rawIdea ?? "";
  project.spark = legacy.refine?.spark ?? "";
  project.coreVerb = legacy.refine?.playerAction ?? "";
  project.conceptSentence = legacy.refine?.refinedIdea ?? "";
  project.experienceMoment = legacy.refine?.experience ?? "";
  project.fantasyId = legacy.fantasyId ?? "";
  project.fantasyStatement = legacy.fantasyStatement ?? "";
  project.genres = legacy.genreIds ?? [];
  project.genreCustom = legacy.genreCustom ?? "";
  project.audienceMotivations = legacy.audienceIds ?? [];
  project.audienceContext = legacy.audienceNote ?? "";
  project.differentiationType = legacy.xId ?? "";
  project.differentiation = legacy.xStatement ?? "";
  project.dimensions = { ...project.dimensions, ...(legacy.pillars ?? {}) };

  if (project.rawIdea) project.statuses.A0 = "answered";
  if (project.spark) project.statuses.A1 = "answered";
  if (project.coreVerb) project.statuses.A3 = "answered";
  if (project.fantasyStatement) project.statuses.A2 = "answered";
  if (project.conceptSentence) project.statuses.A6 = "answered";
  if (project.experienceMoment) project.statuses.A7 = "answered";
  if (project.audienceMotivations.length || project.audienceContext) project.statuses.C1 = "answered";
  if (project.genres.length || project.genreCustom) project.statuses.C2 = "answered";
  if (project.differentiation) project.statuses.C3 = "answered";
  if (Object.values(project.dimensions).some(Boolean)) project.statuses.B8 = "answered";
  project.reviewNodes = ["A3", "A6", "A7", "C1"].filter((id) => project.statuses[id]);
  return project;
}

export function normalizeProject(value: unknown): ProjectState {
  if (!value || typeof value !== "object") return emptyProject();
  const candidate = value as Partial<ProjectState>;
  if (candidate.version !== 3) return migrateLegacyProject(value as LegacyProject);
  const base = emptyProject();
  return {
    ...base,
    ...candidate,
    atomicLoop: { ...base.atomicLoop, ...(candidate.atomicLoop ?? {}) },
    coreDecision: { ...base.coreDecision, ...(candidate.coreDecision ?? {}) },
    formal: { ...base.formal, ...(candidate.formal ?? {}) },
    causal: { ...base.causal, ...(candidate.causal ?? {}) },
    dimensions: { ...base.dimensions, ...(candidate.dimensions ?? {}) },
    constraints: { ...base.constraints, ...(candidate.constraints ?? {}) },
    topRisk: { ...base.topRisk, ...(candidate.topRisk ?? {}) },
    decision: { ...base.decision, ...(candidate.decision ?? {}) },
    hypothesis: { ...base.hypothesis, ...(candidate.hypothesis ?? {}) },
    prototype: { ...base.prototype, ...(candidate.prototype ?? {}) },
    testPlan: { ...base.testPlan, ...(candidate.testPlan ?? {}) },
    feasibility: candidate.feasibility ?? {},
    feasibilityNotes: candidate.feasibilityNotes ?? {},
    statuses: candidate.statuses ?? {},
    reviewNodes: candidate.reviewNodes ?? [],
    pillars: candidate.pillars?.length ? candidate.pillars : base.pillars,
    tasks: candidate.tasks?.length ? candidate.tasks : base.tasks,
    observations: candidate.observations?.length ? candidate.observations : base.observations,
  };
}

export function deriveConceptSentence(project: ProjectState) {
  const identity = project.fantasyStatement || "某种身份";
  const action = [project.coreVerb, project.coreObject].filter(Boolean).join("");
  const goal = project.shortGoal || project.longGoal || "某个目标";
  const constraint = project.constraint || "一项关键约束";
  return `玩家作为${identity}，反复${action || "执行核心动作"}，以${goal}；但必须面对${constraint}。`;
}

export function deriveIssues(project: ProjectState): DesignIssue[] {
  const issues: DesignIssue[] = [];
  const add = (id: string, label: string, nodeId: string, severity: DesignIssue["severity"] = "recommended", kind: DesignIssue["kind"] = "gap") =>
    issues.push({ id, label, nodeId, severity, kind });

  if (!project.rawIdea.trim()) add("raw", "还没有保存原始想法", "A0", "blocking");
  if (!project.spark.trim()) add("spark", "还没明确最不愿失去的火花", "A1");
  if (!project.coreVerb.trim()) add("verb", "核心动作缺少可观察动词", "A3", "blocking");
  if (!project.shortGoal.trim() && !project.longGoal.trim()) add("goal", "玩家目标或进展标准仍为空", "A4", "blocking");
  if (!project.constraint.trim()) add("constraint", "核心动作还缺少会改变决策的张力", "A5");
  if (project.experiences.length === 0) add("experience", "尚未选择主体验", "A7");
  if (project.pillars.filter((pillar) => pillar.name.trim()).length < 2) add("pillars", "项目至少需要两条取舍支柱", "B1");
  if (Object.values(project.atomicLoop).filter((value) => value.trim()).length < 5) add("loop", "原子循环缺少决定、状态变化或反馈", "B2");
  if (!project.causal.dynamic.trim() || !project.causal.design.trim()) add("causal", "体验承诺还没有设计→动态因果依据", "B7");
  if (Object.values(project.feasibility).some((value) => value === "uncertain")) add("feasibility", "存在高不确定的可行性分面", "C5", "recommended", "risk");
  if (!project.topRisk.statement.trim()) add("risk", "尚未选出最可能使方向失败的风险", "C7");
  if (project.topRisk.statement && !project.hypothesis.supportSignal.trim()) add("prototype", "最高风险还没有可观察的验证信号", "D3", "blocking", "risk");
  if (project.hypothesis.supportSignal && !project.prototype.mustBuild.trim()) add("scope", "验证假设还没有最小原型范围", "D4");

  for (const [nodeId, mode] of Object.entries(project.statuses)) {
    if (mode === "deferred") add(`deferred-${nodeId}`, `${nodeId} 已延期，需安排复查`, nodeId, "recommended", "deferred");
  }
  for (const nodeId of project.reviewNodes) add(`review-${nodeId}`, `${nodeId} 因上游变化需要复核`, nodeId, "notice", "review");

  return issues;
}

export function recommendedNode(project: ProjectState) {
  const issues = deriveIssues(project);
  return issues.find((issue) => issue.severity === "blocking")?.nodeId ?? issues[0]?.nodeId ?? "D8";
}

export function targetForSessionGoal(project: ProjectState) {
  const issues = deriveIssues(project);
  const firstIssueIn = (prefixes: string[]) => issues.find((issue) => prefixes.some((prefix) => issue.nodeId.startsWith(prefix)))?.nodeId;

  switch (project.sessionGoal) {
    case "clarify":
      return firstIssueIn(["A"]) ?? "A8";
    case "structure":
      return firstIssueIn(["A"]) ?? firstIssueIn(["B"]) ?? "B1";
    case "judge":
      return firstIssueIn(["A"]) ?? firstIssueIn(["B"]) ?? "C1";
    case "act":
      return issues.find((issue) => issue.severity === "blocking")?.nodeId ?? "D0";
    case "continue":
      return recommendedNode(project);
    default:
      return "A0";
  }
}

export function buildMarkdown(project: ProjectState) {
  const pillarLines = project.pillars
    .filter((pillar) => pillar.name.trim())
    .map((pillar) => `### ${pillar.name}\n\n- 玩家承诺：${pillar.promise}\n- 会做：${pillar.do}\n- 不做：${pillar.doNot}\n- 成立证据：${pillar.proof}`)
    .join("\n\n");
  const tasks = project.tasks
    .filter((task) => task.action.trim() || task.deliverable.trim())
    .map((task) => `- ${task.action} → ${task.deliverable}（负责人：${task.owner || "待定"}；完成：${task.doneDefinition || "待定"}）`)
    .join("\n");

  return `# ${project.name || "游戏设计项目"}\n\n## 一、概念简报\n\n### 原始火花\n\n${project.rawIdea}\n\n### 核心玩法句\n\n${project.conceptSentence || deriveConceptSentence(project)}\n\n### 体验承诺\n\n- 目标体验：${project.experiences.join("、")}\n- 发生时刻：${project.experienceMoment}\n- 可观察信号：${project.observableSignal}\n- 明确不追求：${project.antiExperience}\n\n## 二、设计骨架\n\n${pillarLines || "尚未定义项目设计支柱。"}\n\n### 原子循环\n\n1. 感知：${project.atomicLoop.perceive}\n2. 决定：${project.atomicLoop.decide}\n3. 行动：${project.atomicLoop.act}\n4. 状态变化：${project.atomicLoop.change}\n5. 反馈：${project.atomicLoop.feedback}\n\n### 体验因果\n\n${project.causal.design} → ${project.causal.dynamic} → ${project.causal.experience}\n\n理由：${project.causal.rationale}\n\n## 三、判断单\n\n- 目标玩家与情境：${project.audienceContext}\n- 参考：${project.referenceTitle}（用途：${project.referenceUse}）\n- 差异化：${project.differentiation}\n- 最大风险：${project.topRisk.statement}\n- 当前决定：${project.decision.choice}\n- 决定依据：${project.decision.rationale}\n- 推翻条件：${project.decision.falsifier}\n\n## 四、行动图\n\n### 首要问题\n\n${project.nextQuestion}\n\n### 可验证假设\n\n如果让玩家${project.hypothesis.setup}，他们会${project.hypothesis.behavior}，进而${project.hypothesis.result}。\n\n- 支持信号：${project.hypothesis.supportSignal}\n- 反驳信号：${project.hypothesis.refuteSignal}\n\n### 最小原型\n\n- 类型：${project.prototype.type}\n- 必须实现：${project.prototype.mustBuild}\n- 刻意不做：${project.prototype.omit}\n- 时限：${project.prototype.timebox}\n\n### 工作路径\n\n${tasks || "尚未安排任务。"}\n\n### 备选与范围\n\n- 假设失败后：${project.contingency}\n- 本轮不做：${project.notNow}\n\n## 五、证据与迭代\n\n- 当前证据状态：${project.evidenceStatus}\n- 证据判断：${project.evidenceAssessment}\n- 迭代决定：${project.iterationDecision}\n- 理由：${project.iterationReason}\n`;
}

export function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
