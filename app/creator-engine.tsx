"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ArrowCounterClockwise,
  ArrowRight,
  CaretDown,
  CaretLeft,
  Check,
  Copy,
  DownloadSimple,
  FloppyDisk,
  Lightbulb,
  Path,
  SidebarSimple,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import {
  buildMarkdown,
  deriveConceptSentence,
  deriveIssues,
  emptyProject,
  LEGACY_STORAGE_KEY,
  makeId,
  migrateLegacyProject,
  normalizeProject,
  STORAGE_KEY,
  type CompletionMode,
  type FeasibilityStatus,
  type ProjectState,
} from "./creator-engine-model";
import {
  nodeMap,
  nodes,
  nodesForPhase,
  phases,
  previousSequentialNode,
  nextSequentialNode,
  type NodeMeta,
} from "./creator-engine-nodes";

type Choice = { id: string; title: string; summary?: string; prompt?: string; examples?: string[] };

const fantasies: Choice[] = [
  { id: "identity", title: "成为另一种人", summary: "体验现实中难以拥有的身份与职责。", prompt: "我就是那个 ______ 的人。" },
  { id: "mastery", title: "掌握困难能力", summary: "从笨拙到熟练，获得理解与控制。", prompt: "我逐渐掌握了 ______。" },
  { id: "power", title: "拥有力量与影响", summary: "看见自己的决定改变局面。", prompt: "我有能力 ______。" },
  { id: "discovery", title: "发现未知规律", summary: "由好奇驱动，拼出世界背后的真相。", prompt: "我正在发现 ______。" },
  { id: "creation", title: "创造与表达", summary: "让选择变成独特、可见的结果。", prompt: "这是我亲手创造的 ______。" },
  { id: "care", title: "照顾与建立关系", summary: "通过保护、理解和陪伴形成联结。", prompt: "我正在照顾并理解 ______。" },
  { id: "social", title: "与他人共同经历", summary: "合作、竞争或沟通本身构成意义。", prompt: "我和其他人正在一起 ______。" },
  { id: "transformation", title: "突破限制完成改变", summary: "在困境中逐步实现逆转和成长。", prompt: "我从 ______ 变成了 ______。" },
  { id: "pure-action", title: "身份不是重点", summary: "主要价值来自纯操作、观察或系统实验。", prompt: "玩家主要在享受 ______ 本身。" },
];

const sparkChoices: Choice[] = [
  { id: "action", title: "动作与手感" },
  { id: "identity", title: "玩家身份" },
  { id: "relationship", title: "人与人的关系" },
  { id: "world", title: "世界条件" },
  { id: "emotion", title: "情绪时刻" },
  { id: "question", title: "值得追问的问题" },
  { id: "other", title: "其他" },
];

const experienceChoices = ["掌控", "挑战", "发现", "表达", "幻想", "叙事", "联结", "好奇", "紧张", "释然", "成就", "反思"];
const constraintChoices = ["资源", "时间", "空间", "信息", "风险", "关系", "规则反转", "不可逆结果", "操作难度"];
const motivationChoices = ["破坏", "刺激", "竞争", "社群", "挑战", "策略", "完成", "力量", "幻想", "故事", "设计", "发现"];
const genreChoices = ["动作", "冒险", "角色扮演", "策略", "模拟经营", "解谜", "生存", "叙事", "聚会/社交", "沙盒/创造"];
const differentiationChoices = ["不同寻常的规则", "独特核心操作", "不同身份/视角", "新的玩家关系", "强烈世界条件", "不同节奏", "意外的类型结合", "媒介/技术能力"];
const riskChoices = ["体验", "操作", "系统", "技术", "内容", "生产", "受众", "价值/安全"];
const decisionChoices = ["采用当前方向", "暂作工作假设", "并行验证两个方向", "信息不足，暂不决定", "放弃这一方向"];
const prototypeChoices = ["Role / 价值理解", "Look & Feel / 操作感受", "Implementation / 技术可行", "系统模拟", "内容管线", "受众访谈"];
const sessionGoalChoices: Choice[] = [
  { id: "clarify", title: "把想法说清", summary: "形成可继续设计的概念简报" },
  { id: "structure", title: "补全玩法结构", summary: "建立支柱、循环、选择与体验因果" },
  { id: "judge", title: "判断一个方案", summary: "用参考、约束和风险做当前取舍" },
  { id: "act", title: "制定工作路径", summary: "把最大未知变成一轮最小验证" },
  { id: "continue", title: "继续上次", summary: "由当前缺口与待复核项推荐下一问" },
];
const feasibilityAxes = [
  ["experience", "体验", "玩家是否可能获得目标感受"],
  ["system", "系统", "规则能否形成预期动态"],
  ["technology", "技术", "核心技术与目标设备是否可行"],
  ["content", "内容", "内容规模与生产速度是否匹配"],
  ["production", "生产", "团队、时间与依赖是否清楚"],
  ["reach", "触达", "目标玩家是否能理解并找到它"],
] as const;

const dimensionMeta = [
  ["narrative", "叙事", "玩家是谁、处于什么情境，意义如何显现？"],
  ["mechanics", "机制", "规则如何制造选择、反馈与成长？"],
  ["aesthetics", "美学", "画面、声音、动效和交互形成什么感受？"],
  ["technology", "技术", "哪些能力是体验成立的必要条件？"],
] as const;

const formalMeta = [
  ["players", "玩家/作用主体", "谁在行动，是否有不同角色？"],
  ["procedures", "程序", "轮到玩家时可以怎样行动？"],
  ["rules", "关键规则", "哪些规则改变行动结果？"],
  ["resources", "资源", "哪些东西会获得、消耗或转换？"],
  ["conflict", "冲突", "什么阻止玩家直接达成目标？"],
  ["boundaries", "边界", "何时开始、结束或转入下一阶段？"],
  ["outcomes", "结果", "成功、失败或持续状态如何变化？"],
] as const;

const completionLabels: Record<CompletionMode, string> = {
  answered: "已决定",
  assumption: "暂作假设",
  not_applicable: "不适用",
  deferred: "已延期",
};

function toggle(values: string[], value: string, max = Number.POSITIVE_INFINITY) {
  if (values.includes(value)) return values.filter((item) => item !== value);
  return values.length >= max ? [...values.slice(1), value] : [...values, value];
}

function recommendedNode(project: ProjectState) {
  const issues = deriveIssues(project);
  return issues.find((issue) => issue.severity === "blocking")?.nodeId ?? issues[0]?.nodeId ?? "D8";
}

function targetForSessionGoal(project: ProjectState) {
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

function validForNode(project: ProjectState, nodeId: string) {
  switch (nodeId) {
    case "S1": return Boolean(project.sessionGoal);
    case "A0": return Boolean(project.rawIdea.trim());
    case "A1": return Boolean(project.sparkCategory && project.spark.trim());
    case "A2": return Boolean(project.fantasyId && project.fantasyStatement.trim());
    case "A3": return Boolean(project.coreVerb.trim() && project.coreObject.trim());
    case "A4": return Boolean((project.shortGoal.trim() || project.longGoal.trim()) && project.outcomeState.trim());
    case "A5": return Boolean(project.constraintType && project.constraint.trim());
    case "A6": return Boolean(project.conceptSentence.trim());
    case "A7": return Boolean(project.experiences.length && project.experienceMoment.trim() && project.observableSignal.trim());
    case "B1": return project.pillars.filter((pillar) => pillar.name.trim() && pillar.promise.trim() && pillar.doNot.trim()).length >= 2;
    case "B2": return Object.values(project.atomicLoop).every((value) => value.trim());
    case "B3": return Boolean(project.coreDecision.moment.trim() && project.coreDecision.optionA.trim() && project.coreDecision.optionB.trim());
    case "B6": return Boolean(project.formal.players.trim() && project.formal.procedures.trim() && project.formal.rules.trim() && project.formal.outcomes.trim());
    case "B7": return Boolean(project.causal.design.trim() && project.causal.dynamic.trim() && project.causal.experience.trim() && project.causal.rationale.trim());
    case "B8": return Object.values(project.dimensions).every((value) => value.trim());
    case "C1": return Boolean(project.audienceMotivations.length && project.audienceContext.trim());
    case "C2": return Boolean((project.genres.length || project.genreCustom.trim()) && project.referenceTitle.trim() && project.referenceUse.trim());
    case "C3": return Boolean(project.differentiationType && project.differentiation.trim());
    case "C4": return Boolean(project.constraints.platform.trim() && project.constraints.team.trim() && project.constraints.time.trim());
    case "C5": return feasibilityAxes.every(([id]) => project.feasibility[id]);
    case "C7": return Boolean(project.topRisk.type && project.topRisk.statement.trim() && project.topRisk.impact && project.topRisk.uncertainty);
    case "C9": return Boolean(project.decision.choice && project.decision.rationale.trim() && project.decision.falsifier.trim());
    case "D0": return project.openQuestions.some((question) => question.trim());
    case "D2": return Boolean(project.nextQuestion.trim() && project.changeIfAnswered.trim());
    case "D3": return Object.values(project.hypothesis).every((value) => value.trim());
    case "D4": return Boolean(project.prototype.type && project.prototype.mustBuild.trim() && project.prototype.omit.trim() && project.prototype.timebox.trim());
    case "D5": return Boolean(project.testPlan.observe.trim() && project.testPlan.rounds.trim() && project.testPlan.stopCondition.trim());
    case "D6": return project.tasks.some((task) => task.action.trim() && task.deliverable.trim() && task.doneDefinition.trim());
    case "I0": return project.observations.some((observation) => observation.fact.trim());
    case "I1": return Boolean(project.evidenceAssessment.trim());
    case "I2": return Boolean(project.iterationDecision && project.iterationReason.trim());
    case "I3": return project.reviewNodes.length > 0;
    default: return true;
  }
}

export function CreatorEngine() {
  const [project, setProject] = useState<ProjectState>(() => emptyProject());
  const [hydrated, setHydrated] = useState(false);
  const [pathOpen, setPathOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      try {
        const current = window.localStorage.getItem(STORAGE_KEY);
        const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
        if (current) setProject(normalizeProject(JSON.parse(current)));
        else if (legacy) setProject(migrateLegacyProject(JSON.parse(legacy)));
      } catch {
        setProject(emptyProject());
      } finally {
        setHydrated(true);
      }
    }, 0);
    return () => window.clearTimeout(handle);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  }, [hydrated, project]);

  const currentNode = nodeMap[project.currentNodeId] ?? nodeMap.S0;
  const issues = useMemo(() => deriveIssues(project), [project]);
  const mainNodes = nodes.filter((node) => node.phase !== "start" && !node.checkpoint);
  const completeCount = mainNodes.filter((node) => project.statuses[node.id]).length;
  const progress = Math.round((completeCount / mainNodes.length) * 100);

  function edit(updater: Partial<ProjectState> | ((current: ProjectState) => ProjectState)) {
    setProject((current) => {
      const next = typeof updater === "function" ? updater(current) : { ...current, ...updater };
      const statuses = { ...next.statuses };
      const reviewNodes = new Set(next.reviewNodes);
      if (statuses[current.currentNodeId]) {
        delete statuses[current.currentNodeId];
        const currentIndex = nodes.findIndex((node) => node.id === current.currentNodeId);
        nodes.slice(currentIndex + 1).forEach((node) => {
          if (current.statuses[node.id]) reviewNodes.add(node.id);
        });
      }
      return { ...next, statuses, reviewNodes: [...reviewNodes], updatedAt: new Date().toISOString() };
    });
  }

  function go(nodeId: string) {
    setProject((current) => ({ ...current, currentNodeId: nodeId, updatedAt: new Date().toISOString() }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function complete(mode: CompletionMode = "answered", target?: string) {
    setProject((current) => ({
      ...current,
      currentNodeId: target ?? nextSequentialNode(current.currentNodeId),
      statuses: { ...current.statuses, [current.currentNodeId]: mode },
      reviewNodes: current.reviewNodes.filter((id) => id !== current.currentNodeId),
      evidenceStatus: current.currentNodeId === "D3" && current.evidenceStatus === "idea" ? "hypothesis" : current.evidenceStatus,
      updatedAt: new Date().toISOString(),
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function restart() {
    if (!window.confirm("重新开始会清除当前设备上的项目内容，确定继续吗？")) return;
    const fresh = emptyProject();
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    setProject(fresh);
  }

  const phaseIndex = phases.findIndex((phase) => phase.id === currentNode.phase);

  return (
    <div className="app-shell dialogue-workbench">
      <header className="topbar">
        <button className="brand-button" type="button" onClick={() => go("S0")} aria-label="返回项目入口">
          <span className="brand-mark">CE</span>
          <span><strong>创作引擎</strong><small>{project.name}</small></span>
        </button>
        <div className="top-progress" aria-label={`主干完成 ${progress}%`}>
          <span>{String(Math.max(1, phaseIndex + 1)).padStart(2, "0")}</span>
          <strong>{currentNode.short}</strong>
          <span className="stage-name">· {progress}% 主干</span>
        </div>
        <div className="top-actions">
          <span className="save-status"><FloppyDisk size={13} /> {hydrated ? "本地自动保存" : "读取中"}</span>
          <button className="restart-button" type="button" onClick={restart}><ArrowCounterClockwise size={14} /><span>重新开始</span></button>
        </div>
      </header>

      <button className={`side-toggle left ${pathOpen ? "open" : ""}`} type="button" aria-label={pathOpen ? "收起设计路径" : "展开设计路径"} aria-expanded={pathOpen} onClick={() => setPathOpen((value) => !value)}>
        {pathOpen ? <CaretLeft size={17} /> : <Path size={17} />}
      </button>
      <button className={`side-toggle right ${stateOpen ? "open" : ""}`} type="button" aria-label={stateOpen ? "收起当前设计状态" : "展开当前设计状态"} aria-expanded={stateOpen} onClick={() => setStateOpen((value) => !value)}>
        {stateOpen ? <X size={16} /> : <SidebarSimple size={17} />}
      </button>

      <PathPanel project={project} currentNode={currentNode} open={pathOpen} onClose={() => setPathOpen(false)} onGo={go} />
      <StatePanel project={project} issues={issues} progress={progress} open={stateOpen} onClose={() => setStateOpen(false)} onGo={go} />

      <main className={`conversation node-conversation ${currentNode.checkpoint ? "wide" : ""}`}>
        <NodeRenderer
          project={project}
          node={currentNode}
          issues={issues}
          edit={edit}
          go={go}
          complete={complete}
        />
      </main>
    </div>
  );
}

function PathPanel({ project, currentNode, open, onClose, onGo }: { project: ProjectState; currentNode: NodeMeta; open: boolean; onClose: () => void; onGo: (id: string) => void }) {
  return (
    <aside className={`side-panel path-panel dialogue-path ${open ? "open" : ""}`} aria-hidden={!open}>
      <div className="panel-header"><h2>设计路径</h2><button type="button" onClick={onClose} aria-label="关闭设计路径"><X size={16} /></button></div>
      <div className="phase-path-list">
        {phases.filter((phase) => phase.id !== "start").map((phase) => {
          const phaseNodes = nodesForPhase(phase.id);
          const done = phaseNodes.filter((node) => project.statuses[node.id]).length;
          const active = currentNode.phase === phase.id;
          return (
            <section className={`phase-path ${active ? "active" : ""}`} key={phase.id}>
              <div className="phase-path-heading">
                <span>{phase.short}</span>
                <strong>{phase.title}</strong>
                <small>{done}/{phaseNodes.length}</small>
              </div>
              {(active || done > 0) && (
                <ol>
                  {phaseNodes.map((node) => (
                    <li className={`${node.id === currentNode.id ? "current" : ""} ${project.statuses[node.id] ? "done" : ""}`} key={node.id}>
                      <button type="button" onClick={() => { onGo(node.id); onClose(); }}>
                        <span>{project.statuses[node.id] ? <Check size={10} /> : node.id}</span>{node.short}
                      </button>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          );
        })}
      </div>
    </aside>
  );
}

function StatePanel({ project, issues, progress, open, onClose, onGo }: { project: ProjectState; issues: ReturnType<typeof deriveIssues>; progress: number; open: boolean; onClose: () => void; onGo: (id: string) => void }) {
  const riskCount = issues.filter((issue) => issue.kind === "risk" || issue.severity === "blocking").length;
  return (
    <aside className={`side-panel state-panel dialogue-state ${open ? "open" : ""}`} aria-hidden={!open}>
      <div className="panel-header"><h2>当前设计状态</h2><button type="button" onClick={onClose} aria-label="关闭当前设计状态"><X size={16} /></button></div>
      <div className="status-metrics">
        <div><strong>{progress}%</strong><span>主干</span></div>
        <div><strong>{riskCount}</strong><span>高风险未知</span></div>
        <div><strong>{project.reviewNodes.length}</strong><span>待复核</span></div>
      </div>
      <div className="state-progress"><span style={{ width: `${progress}%` }} /></div>
      <StateItem label="原始火花" value={project.spark || project.rawIdea} />
      <StateItem label="核心玩法句" value={project.conceptSentence} />
      <StateItem label="目标体验" value={project.experiences.join(" · ")} />
      <StateItem label="最大风险" value={project.topRisk.statement} />
      <StateItem label="下一号问题" value={project.nextQuestion} />
      {issues.length > 0 && (
        <section className="issue-list">
          <span>建议处理</span>
          {issues.slice(0, 5).map((issue) => (
            <button type="button" key={issue.id} onClick={() => { onGo(issue.nodeId); onClose(); }}>
              <WarningCircle size={13} /><span>{issue.label}</span><small>{issue.nodeId}</small>
            </button>
          ))}
        </section>
      )}
      <p className="local-note">所有内容只保存在这台设备。状态标签区分决定、假设、延期与证据。</p>
    </aside>
  );
}

function StateItem({ label, value }: { label: string; value: string }) {
  return <div className="state-item"><span>{label}</span><p className={value ? "" : "empty"}>{value || "尚未形成"}</p></div>;
}

type RendererProps = {
  project: ProjectState;
  node: NodeMeta;
  issues: ReturnType<typeof deriveIssues>;
  edit: (updater: Partial<ProjectState> | ((current: ProjectState) => ProjectState)) => void;
  go: (id: string) => void;
  complete: (mode?: CompletionMode, target?: string) => void;
};

function NodeRenderer(props: RendererProps) {
  const { project, node, issues, edit, go, complete } = props;
  const valid = validForNode(project, node.id);
  const wrap = (content: ReactNode, options?: { valid?: boolean; context?: string; noAlternative?: boolean; nextLabel?: string }) => (
    <NodeFrame
      node={node}
      project={project}
      valid={options?.valid ?? valid}
      context={options?.context}
      noAlternative={options?.noAlternative}
      nextLabel={options?.nextLabel}
      onBack={() => go(previousSequentialNode(node.id))}
      onComplete={complete}
    >{content}</NodeFrame>
  );

  switch (node.id) {
    case "S0":
      return <StartNode project={project} issues={issues} edit={edit} go={go} />;
    case "S1": {
      const targetNodeId = targetForSessionGoal(project);
      const targetNode = nodeMap[targetNodeId];
      return <NodeFrame
        node={node}
        project={project}
        valid={valid}
        context={issues.length ? `当前有 ${issues.length} 项缺口、风险或待复核内容。` : "当前没有自动发现的阻断项。"}
        noAlternative
        nextLabel={targetNode ? `前往 ${targetNode.short}` : "开始本次工作"}
        onBack={() => go("S0")}
        onComplete={(mode) => complete(mode, targetNodeId)}
      >
        <ChoiceGrid label="这次希望推进到什么结果？" choices={sessionGoalChoices} selected={[project.sessionGoal]} onToggle={(sessionGoal) => edit({ sessionGoal })} single />
        <ChoiceGrid label="这次工作深度" choices={[{ id: "quick", title: "快速梳理", summary: "抓核心与下一步" }, { id: "standard", title: "标准设计", summary: "完成主干判断" }, { id: "deep", title: "深入检查", summary: "风险与证据优先" }]} selected={[project.depth]} onToggle={(depth) => edit({ depth: depth as ProjectState["depth"] })} single />
        {project.sessionGoal && targetNode && <ReferenceHint title="CE 建议的起点"><p>目标是“{sessionGoalChoices.find((choice) => choice.id === project.sessionGoal)?.title}”。根据当前状态，先处理 {targetNode.id} · {targetNode.title}；完成后继续前往目标阶段。</p></ReferenceHint>}
      </NodeFrame>;
    }
    case "A0":
      return wrap(<>
        <TextArea label="我的最初想法" value={project.rawIdea} onChange={(rawIdea) => edit({ rawIdea })} placeholder="例如：我想做一个需要不断把奇怪物件垒高的物理游戏……" large />
        <ReferenceHint title="没有完整想法也可以开始">
          <ul><li>我一直觉得反复 ______ 会很好玩。</li><li>我想让玩家体验成为 ______。</li><li>我脑中有一个画面：______。</li><li>如果把 ______ 的规则改成 ______ 会怎样？</li></ul>
        </ReferenceHint>
      </>, { noAlternative: true, context: "这里保存作者原话；后面的结构化改写不会覆盖它。", nextLabel: "找出不可失去的火花" });
    case "A1":
      return wrap(<>
        <ChoiceGrid label="这份火花主要属于哪一类？" choices={sparkChoices} selected={[project.sparkCategory]} onToggle={(sparkCategory) => edit({ sparkCategory })} single />
        <TextArea label="如果最后只能保住一件事，我最不愿失去……" value={project.spark} onChange={(spark) => edit({ spark })} placeholder="例如：物体已经摇摇欲坠，却还能被玩家救回来的那一刻。" />
      </>, { context: project.rawIdea });
    case "A2": {
      const fantasy = fantasies.find((item) => item.id === project.fantasyId);
      return wrap(<>
        <ChoiceList choices={fantasies} selected={project.fantasyId} onSelect={(fantasyId) => edit({ fantasyId, fantasyStatement: "" })} />
        {fantasy && <TextArea label={fantasy.prompt ?? "写成这个游戏专属的 Fantasy"} value={project.fantasyStatement} onChange={(fantasyStatement) => edit({ fantasyStatement })} placeholder="不要只复述选项，写出这个项目独有的愿望。" />}
      </>, { context: project.spark });
    }
    case "A3":
      return wrap(<>
        <div className="sentence-fields two-columns">
          <TextField label="主导动词" value={project.coreVerb} onChange={(coreVerb) => edit({ coreVerb })} placeholder="挑选、协商、建造……" />
          <TextField label="动作对象" value={project.coreObject} onChange={(coreObject) => edit({ coreObject })} placeholder="遗物、路线、关系……" />
        </div>
        <TextField label="最多两个辅助动作（可选）" value={project.supportActions} onChange={(supportActions) => edit({ supportActions })} placeholder="旋转、观察" />
        <InlineNotice>写玩家做什么，不写系统“拥有物理、开放世界、丰富剧情”。</InlineNotice>
      </>, { context: project.fantasyStatement || project.spark });
    case "A4":
      return wrap(<div className="stack-fields">
        <TextField label="短期目标或自定进展标准" value={project.shortGoal} onChange={(shortGoal) => edit({ shortGoal })} placeholder="完成一次稳定放置 / 找到一条新线索" />
        <TextField label="长期方向（可选）" value={project.longGoal} onChange={(longGoal) => edit({ longGoal })} placeholder="重建整座纪念塔 / 改变社区关系" />
        <TextArea label="做成以后，什么状态会发生可见变化？" value={project.outcomeState} onChange={(outcomeState) => edit({ outcomeState })} placeholder="玩家、世界、资源、关系或理解发生什么变化？" />
      </div>, { context: [project.coreVerb, project.coreObject].join("") });
    case "A5":
      return wrap(<>
        <ChoiceGrid label="张力主要来自" choices={constraintChoices.map((title) => ({ id: title, title }))} selected={[project.constraintType]} onToggle={(constraintType) => edit({ constraintType })} single />
        <TextArea label={`玩家想${project.shortGoal || "达成目标"}，但必须……`} value={project.constraint} onChange={(constraint) => edit({ constraint })} placeholder="写会迫使玩家改变选择的约束，而不只是题材装饰。" />
      </>, { context: `动作：${project.coreVerb}${project.coreObject}；目标：${project.shortGoal || project.longGoal}` });
    case "A6":
      return wrap(<>
        <div className="generated-sentence">
          <span>由前面答案组装的工作版本</span>
          <p>{deriveConceptSentence(project)}</p>
          <button type="button" onClick={() => edit({ conceptSentence: deriveConceptSentence(project) })}>采用这个版本</button>
        </div>
        <TextArea label="核心玩法句" value={project.conceptSentence} onChange={(conceptSentence) => edit({ conceptSentence })} placeholder="玩家作为［身份］，反复［动作］，以［目标］；但［约束］。" />
      </>, { context: project.spark });
    case "A7":
      return wrap(<>
        <ChoiceGrid label="最多选择两个主体验" choices={experienceChoices.map((title) => ({ id: title, title }))} selected={project.experiences} onToggle={(value) => edit({ experiences: toggle(project.experiences, value, 2) })} />
        <div className="stack-fields">
          <TextField label="明确不追求的体验" value={project.antiExperience} onChange={(antiExperience) => edit({ antiExperience })} placeholder="例如：不追求持续高压或无限刷取" />
          <TextArea label="在什么具体时刻，希望玩家感到这些？" value={project.experienceMoment} onChange={(experienceMoment) => edit({ experienceMoment })} placeholder="当玩家救回即将倒塌的结构时，希望先紧张、再释然。" />
          <TextArea label="什么可观察行为说明体验可能成立？" value={project.observableSignal} onChange={(observableSignal) => edit({ observableSignal })} placeholder="例如：玩家能解释调整理由，并主动尝试不同支撑策略。" />
        </div>
      </>, { context: project.conceptSentence });
    case "A8":
      return <Checkpoint node={node} title="概念已经从灵感变成可继续设计的工作版本。" items={[
        ["不可失去的火花", project.spark], ["核心玩法句", project.conceptSentence], ["体验承诺", `${project.experiences.join(" · ")}｜${project.experienceMoment}`], ["仍待验证", project.observableSignal],
      ]} primary="建立设计骨架" onPrimary={() => complete("answered", "B1")} actions={[
        ["修改核心", () => go("A1")], ["先判断可行性", () => go("C4")], ["先安排下一步", () => go("D0")],
      ]} />;
    case "B1":
      return wrap(<>
        <div className="pillar-editor-list">
          {project.pillars.map((pillar, index) => (
            <section className="pillar-editor" key={pillar.id}>
              <div className="editor-heading"><span>{String(index + 1).padStart(2, "0")}</span><strong>{pillar.name || "未命名支柱"}</strong>{project.pillars.length > 2 && <button type="button" aria-label="删除支柱" onClick={() => edit((current) => ({ ...current, pillars: current.pillars.filter((item) => item.id !== pillar.id) }))}>删除</button>}</div>
              <TextField label="支柱名称" value={pillar.name} onChange={(value) => edit((current) => ({ ...current, pillars: current.pillars.map((item) => item.id === pillar.id ? { ...item, name: value } : item) }))} placeholder="例如：每次失误都必须可读" />
              <TextField label="玩家承诺" value={pillar.promise} onChange={(value) => edit((current) => ({ ...current, pillars: current.pillars.map((item) => item.id === pillar.id ? { ...item, promise: value } : item) }))} placeholder="玩家会获得什么" />
              <div className="two-columns">
                <TextField label="我们会做" value={pillar.do} onChange={(value) => edit((current) => ({ ...current, pillars: current.pillars.map((item) => item.id === pillar.id ? { ...item, do: value } : item) }))} placeholder="设计决策" />
                <TextField label="我们明确不做" value={pillar.doNot} onChange={(value) => edit((current) => ({ ...current, pillars: current.pillars.map((item) => item.id === pillar.id ? { ...item, doNot: value } : item) }))} placeholder="范围边界" />
              </div>
              <TextField label="怎样看出成立" value={pillar.proof} onChange={(value) => edit((current) => ({ ...current, pillars: current.pillars.map((item) => item.id === pillar.id ? { ...item, proof: value } : item) }))} placeholder="可观察证明" />
            </section>
          ))}
        </div>
        {project.pillars.length < 4 && <button className="add-row" type="button" onClick={() => edit((current) => ({ ...current, pillars: [...current.pillars, { id: makeId("pillar"), name: "", promise: "", do: "", doNot: "", proof: "" }] }))}>＋ 增加一条支柱</button>}
      </>, { context: project.conceptSentence });
    case "B2":
      return wrap(<div className="loop-builder">
        <LoopField number="01" label="感知" prompt="玩家先看见、听见或知道什么？" value={project.atomicLoop.perceive} onChange={(perceive) => edit((current) => ({ ...current, atomicLoop: { ...current.atomicLoop, perceive } }))} />
        <LoopField number="02" label="决定" prompt="玩家要在什么之间做选择？" value={project.atomicLoop.decide} onChange={(decide) => edit((current) => ({ ...current, atomicLoop: { ...current.atomicLoop, decide } }))} />
        <LoopField number="03" label="行动" prompt="实际输入或操作是什么？" value={project.atomicLoop.act} onChange={(act) => edit((current) => ({ ...current, atomicLoop: { ...current.atomicLoop, act } }))} />
        <LoopField number="04" label="状态变化" prompt="系统中什么被改变？" value={project.atomicLoop.change} onChange={(change) => edit((current) => ({ ...current, atomicLoop: { ...current.atomicLoop, change } }))} />
        <LoopField number="05" label="反馈" prompt="玩家怎样理解结果并开始下一轮？" value={project.atomicLoop.feedback} onChange={(feedback) => edit((current) => ({ ...current, atomicLoop: { ...current.atomicLoop, feedback } }))} />
      </div>, { context: project.conceptSentence });
    case "B3":
      return wrap(<div className="stack-fields">
        <TextArea label="循环中的哪个时刻最能体现技巧或价值判断？" value={project.coreDecision.moment} onChange={(moment) => edit((current) => ({ ...current, coreDecision: { ...current.coreDecision, moment } }))} />
        <div className="comparison-columns">
          <section><span>选择 A</span><TextField label="做什么" value={project.coreDecision.optionA} onChange={(optionA) => edit((current) => ({ ...current, coreDecision: { ...current.coreDecision, optionA } }))} /><TextField label="收益与代价" value={project.coreDecision.tradeoffA} onChange={(tradeoffA) => edit((current) => ({ ...current, coreDecision: { ...current.coreDecision, tradeoffA } }))} /></section>
          <section><span>选择 B</span><TextField label="做什么" value={project.coreDecision.optionB} onChange={(optionB) => edit((current) => ({ ...current, coreDecision: { ...current.coreDecision, optionB } }))} /><TextField label="收益与代价" value={project.coreDecision.tradeoffB} onChange={(tradeoffB) => edit((current) => ({ ...current, coreDecision: { ...current.coreDecision, tradeoffB } }))} /></section>
        </div>
        <TextField label="做决定时，玩家知道什么？" value={project.coreDecision.information} onChange={(information) => edit((current) => ({ ...current, coreDecision: { ...current.coreDecision, information } }))} />
      </div>, { context: `循环：${Object.values(project.atomicLoop).filter(Boolean).join(" → ")}` });
    case "B6":
      return wrap(<div className="field-card-grid">
        {formalMeta.map(([id, label, prompt]) => <TextArea key={id} label={label} help={prompt} value={project.formal[id]} onChange={(value) => edit((current) => ({ ...current, formal: { ...current.formal, [id]: value } }))} compact />)}
      </div>, { context: project.conceptSentence });
    case "B7":
      return wrap(<>
        <div className="causal-chain">
          <TextArea label="设计元素" help="规则、资源、反馈或呈现" value={project.causal.design} onChange={(design) => edit((current) => ({ ...current, causal: { ...current.causal, design } }))} compact />
          <span>→</span>
          <TextArea label="玩家动态" help="玩家可能形成的行为与策略" value={project.causal.dynamic} onChange={(dynamic) => edit((current) => ({ ...current, causal: { ...current.causal, dynamic } }))} compact />
          <span>→</span>
          <TextArea label="目标体验" help="最终希望玩家感到什么" value={project.causal.experience} onChange={(experience) => edit((current) => ({ ...current, causal: { ...current.causal, experience } }))} compact />
        </div>
        <TextArea label="为什么相信这条因果链？" value={project.causal.rationale} onChange={(rationale) => edit((current) => ({ ...current, causal: { ...current.causal, rationale } }))} />
        <TextField label="什么条件下它可能不成立？" value={project.causal.counterCondition} onChange={(counterCondition) => edit((current) => ({ ...current, causal: { ...current.causal, counterCondition } }))} />
      </>, { context: `体验承诺：${project.experiences.join(" · ")}｜${project.experienceMoment}` });
    case "B8":
      return wrap(<div className="field-card-grid">
        {dimensionMeta.map(([id, label, prompt]) => <TextArea key={id} label={`${label}设计维度`} help={prompt} value={project.dimensions[id]} onChange={(value) => edit((current) => ({ ...current, dimensions: { ...current.dimensions, [id]: value } }))} />)}
      </div>, { context: `这些不是项目支柱，而是支持支柱和因果链的四类元素。` });
    case "B9":
      return <Checkpoint node={node} title="设计骨架已经能说明游戏如何运行，以及为什么可能产生目标体验。" items={[
        ["项目支柱", project.pillars.filter((p) => p.name).map((p) => p.name).join(" · ")],
        ["原子循环", Object.values(project.atomicLoop).filter(Boolean).join(" → ")],
        ["关键选择", `${project.coreDecision.optionA} / ${project.coreDecision.optionB}`],
        ["体验因果", `${project.causal.design} → ${project.causal.dynamic} → ${project.causal.experience}`],
      ]} primary="进入判断与取舍" onPrimary={() => complete("answered", "C1")} actions={[["回到结构缺口", () => go(issues.find((issue) => issue.nodeId.startsWith("B"))?.nodeId ?? "B1")], ["先看最大风险", () => go("C7")]]} />;
    case "C1":
      return wrap(<>
        <ChoiceGrid label="最多选择两个主导动机" choices={motivationChoices.map((title) => ({ id: title, title }))} selected={project.audienceMotivations} onToggle={(value) => edit({ audienceMotivations: toggle(project.audienceMotivations, value, 2) })} />
        <TextField label="明确不服务的动机" value={project.excludedMotivation} onChange={(excludedMotivation) => edit({ excludedMotivation })} placeholder="例如：不服务追求长期刷取与数值力量的玩家" />
        <TextArea label="这些玩家熟悉什么，通常在什么情境游玩，能接受怎样的失败与学习成本？" value={project.audienceContext} onChange={(audienceContext) => edit({ audienceContext })} />
      </>, { context: `目标体验：${project.experiences.join(" · ")}` });
    case "C2":
      return wrap(<>
        <ChoiceGrid label="1–2 个主类型 / 规则预期" choices={genreChoices.map((title) => ({ id: title, title }))} selected={project.genres} onToggle={(value) => edit({ genres: toggle(project.genres, value, 2) })} />
        <TextField label="自定义规则家族（可选）" value={project.genreCustom} onChange={(genreCustom) => edit({ genreCustom })} />
        <div className="reference-workbench">
          <TextField label="主参考作品、活动或设计模式" value={project.referenceTitle} onChange={(referenceTitle) => edit({ referenceTitle })} placeholder="不局限于游戏名" />
          <TextArea label="它帮助判断什么？" value={project.referenceUse} onChange={(referenceUse) => edit({ referenceUse })} placeholder="核心动作、循环、受众、视听、技术或反例" compact />
          <div className="two-columns">
            <TextArea label="借什么" value={project.referenceBorrow} onChange={(referenceBorrow) => edit({ referenceBorrow })} compact />
            <TextArea label="避开什么" value={project.referenceAvoid} onChange={(referenceAvoid) => edit({ referenceAvoid })} compact />
          </div>
        </div>
      </>, { context: project.conceptSentence });
    case "C3":
      return wrap(<>
        <ChoiceGrid label="如果只能保留一个不同点" choices={differentiationChoices.map((title) => ({ id: title, title }))} selected={[project.differentiationType]} onToggle={(differentiationType) => edit({ differentiationType })} single />
        <TextArea label="和同类相比，这个不同点怎样改变玩家的动作、规则、关系或节奏？" value={project.differentiation} onChange={(differentiation) => edit({ differentiation })} />
      </>, { context: `参考：${project.referenceTitle || "尚未填写"}` });
    case "C4":
      return wrap(<div className="field-card-grid constraints-grid">
        <TextField label="平台 / 设备" value={project.constraints.platform} onChange={(platform) => edit((current) => ({ ...current, constraints: { ...current.constraints, platform } }))} placeholder="PC、移动端、桌游……" />
        <TextField label="游玩方式" value={project.constraints.playMode} onChange={(playMode) => edit((current) => ({ ...current, constraints: { ...current.constraints, playMode } }))} placeholder="单人、本地多人、联网……" />
        <TextField label="团队与已有能力" value={project.constraints.team} onChange={(team) => edit((current) => ({ ...current, constraints: { ...current.constraints, team } }))} />
        <TextField label="时间窗口" value={project.constraints.time} onChange={(time) => edit((current) => ({ ...current, constraints: { ...current.constraints, time } }))} />
        <TextField label="预算级别" value={project.constraints.budget} onChange={(budget) => edit((current) => ({ ...current, constraints: { ...current.constraints, budget } }))} placeholder="未知也可以明确写未知" />
        <TextField label="内容规模边界" value={project.constraints.content} onChange={(content) => edit((current) => ({ ...current, constraints: { ...current.constraints, content } }))} />
      </div>, { context: `差异化：${project.differentiation}` });
    case "C5":
      return wrap(<div className="feasibility-list">
        {feasibilityAxes.map(([id, label, prompt]) => (
          <section className="feasibility-row" key={id}>
            <div><strong>{label}</strong><span>{prompt}</span></div>
            <select aria-label={`${label}可行性状态`} value={project.feasibility[id] ?? ""} onChange={(event) => edit((current) => ({ ...current, feasibility: { ...current.feasibility, [id]: event.target.value as FeasibilityStatus } }))}>
              <option value="">选择状态</option><option value="evidence">已有依据</option><option value="testable">可低成本验证</option><option value="uncertain">高不确定</option><option value="not_relevant">暂不相关</option>
            </select>
            <input aria-label={`${label}依据或依赖`} value={project.feasibilityNotes[id] ?? ""} onChange={(event) => edit((current) => ({ ...current, feasibilityNotes: { ...current.feasibilityNotes, [id]: event.target.value } }))} placeholder="依据、依赖或最小验证方式" />
          </section>
        ))}
      </div>, { context: "可行性不合成总分；高影响未知项会进入风险排序。" });
    case "C7":
      return wrap(<>
        <ChoiceGrid label="风险类型" choices={riskChoices.map((title) => ({ id: title, title }))} selected={[project.topRisk.type]} onToggle={(type) => edit((current) => ({ ...current, topRisk: { ...current.topRisk, type } }))} single />
        <TextArea label="什么最可能让整个方向不成立？" value={project.topRisk.statement} onChange={(statement) => edit((current) => ({ ...current, topRisk: { ...current.topRisk, statement } }))} />
        <div className="three-columns">
          <SelectField label="影响" value={project.topRisk.impact} onChange={(impact) => edit((current) => ({ ...current, topRisk: { ...current.topRisk, impact } }))} options={["低", "中", "高"]} />
          <SelectField label="未知程度" value={project.topRisk.uncertainty} onChange={(uncertainty) => edit((current) => ({ ...current, topRisk: { ...current.topRisk, uncertainty } }))} options={["低", "中", "高"]} />
          <SelectField label="验证成本" value={project.topRisk.validationCost} onChange={(validationCost) => edit((current) => ({ ...current, topRisk: { ...current.topRisk, validationCost } }))} options={["低", "中", "高"]} />
        </div>
      </>, { context: issues.filter((issue) => issue.kind === "risk" || issue.severity === "blocking").map((issue) => issue.label).join("；") || "当前没有自动发现的阻断项，仍需由作者判断最大未知。" });
    case "C9":
      return wrap(<>
        <ChoiceGrid label="当前怎么决定" choices={decisionChoices.map((title) => ({ id: title, title }))} selected={[project.decision.choice]} onToggle={(choice) => edit((current) => ({ ...current, decision: { ...current.decision, choice } }))} single />
        <TextArea label="为什么这样选？" value={project.decision.rationale} onChange={(rationale) => edit((current) => ({ ...current, decision: { ...current.decision, rationale } }))} />
        <TextArea label="什么证据会推翻这个决定？" value={project.decision.falsifier} onChange={(falsifier) => edit((current) => ({ ...current, decision: { ...current.decision, falsifier } }))} />
        <TextField label="什么时候复查？" value={project.decision.revisit} onChange={(revisit) => edit((current) => ({ ...current, decision: { ...current.decision, revisit } }))} placeholder="某个日期、原型完成或出现某种证据时" />
      </>, { context: `最大风险：${project.topRisk.statement}` });
    case "C10":
      return <Checkpoint node={node} title="现在有足够依据安排验证，但这不是对最终可行性的承诺。" items={[
        ["目标玩家", `${project.audienceMotivations.join(" · ")}｜${project.audienceContext}`],
        ["参考与差异", `${project.referenceTitle}｜${project.differentiation}`],
        ["最大风险", project.topRisk.statement],
        ["当前判断", `${project.decision.choice}｜${project.decision.rationale}`],
      ]} primary="形成行动路径" onPrimary={() => complete("answered", "D0")} actions={[["回到风险", () => go("C7")], ["修改硬约束", () => go("C4")]]} />;
    case "D0":
      return wrap(<>
        <div className="question-list-editor">
          {project.openQuestions.map((question, index) => (
            <div key={`question-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><input value={question} aria-label={`未决问题 ${index + 1}`} placeholder="一个会影响设计决定的问题" onChange={(event) => edit((current) => ({ ...current, openQuestions: current.openQuestions.map((item, itemIndex) => itemIndex === index ? event.target.value : item) }))} />{project.openQuestions.length > 1 && <button type="button" onClick={() => edit((current) => ({ ...current, openQuestions: current.openQuestions.filter((_, itemIndex) => itemIndex !== index) }))}>删除</button>}</div>
          ))}
        </div>
        {project.openQuestions.length < 7 && <button className="add-row" type="button" onClick={() => edit((current) => ({ ...current, openQuestions: [...current.openQuestions, ""] }))}>＋ 增加问题</button>}
        {issues.length > 0 && <ReferenceHint title="CE 从当前状态发现的问题"><ul>{issues.slice(0, 8).map((issue) => <li key={issue.id}>{issue.label}（{issue.nodeId}）</li>)}</ul></ReferenceHint>}
      </>, { context: `最大风险：${project.topRisk.statement || "尚未明确"}` });
    case "D2":
      return wrap(<>
        <label className="select-block"><span>下一轮只解决一个问题</span><select value={project.nextQuestion} onChange={(event) => edit({ nextQuestion: event.target.value })}><option value="">选择首要问题</option>{project.openQuestions.filter(Boolean).map((question) => <option value={question} key={question}>{question}</option>)}{project.topRisk.statement && <option value={project.topRisk.statement}>{project.topRisk.statement}</option>}</select></label>
        <TextArea label="知道答案后，会改变哪个决定？" value={project.changeIfAnswered} onChange={(changeIfAnswered) => edit({ changeIfAnswered })} />
      </>, { context: "如果答案不会改变任何决定，这个问题不应阻断下一轮。" });
    case "D3":
      return wrap(<>
        <div className="hypothesis-builder">
          <span>如果让玩家</span><input value={project.hypothesis.setup} onChange={(event) => edit((current) => ({ ...current, hypothesis: { ...current.hypothesis, setup: event.target.value } }))} placeholder="接触某项机制/情境" />
          <span>他们会</span><input value={project.hypothesis.behavior} onChange={(event) => edit((current) => ({ ...current, hypothesis: { ...current.hypothesis, behavior: event.target.value } }))} placeholder="产生某种行为/策略" />
          <span>进而</span><input value={project.hypothesis.result} onChange={(event) => edit((current) => ({ ...current, hypothesis: { ...current.hypothesis, result: event.target.value } }))} placeholder="获得某种体验/结果" />
        </div>
        <div className="two-columns">
          <TextArea label="支持信号" value={project.hypothesis.supportSignal} onChange={(supportSignal) => edit((current) => ({ ...current, hypothesis: { ...current.hypothesis, supportSignal } }))} placeholder="可观察行为，不只是‘玩家说好玩’" compact />
          <TextArea label="反驳信号" value={project.hypothesis.refuteSignal} onChange={(refuteSignal) => edit((current) => ({ ...current, hypothesis: { ...current.hypothesis, refuteSignal } }))} compact />
        </div>
      </>, { context: `一号问题：${project.nextQuestion}` });
    case "D4":
      return wrap(<>
        <ChoiceGrid label="原型主要验证什么" choices={prototypeChoices.map((title) => ({ id: title, title }))} selected={[project.prototype.type]} onToggle={(type) => edit((current) => ({ ...current, prototype: { ...current.prototype, type } }))} single />
        <div className="two-columns">
          <TextArea label="必须实现" value={project.prototype.mustBuild} onChange={(mustBuild) => edit((current) => ({ ...current, prototype: { ...current.prototype, mustBuild } }))} compact />
          <TextArea label="刻意不做" value={project.prototype.omit} onChange={(omit) => edit((current) => ({ ...current, prototype: { ...current.prototype, omit } }))} compact />
        </div>
        <div className="two-columns"><TextField label="参与者 / 环境" value={project.prototype.participants} onChange={(participants) => edit((current) => ({ ...current, prototype: { ...current.prototype, participants } }))} /><TextField label="时限" value={project.prototype.timebox} onChange={(timebox) => edit((current) => ({ ...current, prototype: { ...current.prototype, timebox } }))} placeholder="例如：2 天" /></div>
      </>, { context: `验证：${project.hypothesis.supportSignal}` });
    case "D5":
      return wrap(<div className="stack-fields">
        <TextArea label="实际观察什么？" value={project.testPlan.observe} onChange={(observe) => edit((current) => ({ ...current, testPlan: { ...current.testPlan, observe } }))} />
        <TextArea label="试玩后问什么？" value={project.testPlan.ask} onChange={(ask) => edit((current) => ({ ...current, testPlan: { ...current.testPlan, ask } }))} />
        <div className="two-columns"><TextField label="轮次 / 样本范围" value={project.testPlan.rounds} onChange={(rounds) => edit((current) => ({ ...current, testPlan: { ...current.testPlan, rounds } }))} /><TextField label="停止条件" value={project.testPlan.stopCondition} onChange={(stopCondition) => edit((current) => ({ ...current, testPlan: { ...current.testPlan, stopCondition } }))} /></div>
      </div>, { context: `支持：${project.hypothesis.supportSignal}｜反驳：${project.hypothesis.refuteSignal}` });
    case "D6":
      return wrap(<>
        <div className="task-editor-list">
          {project.tasks.map((task, index) => (
            <section className="task-editor" key={task.id}>
              <div className="editor-heading"><span>{String(index + 1).padStart(2, "0")}</span><strong>{task.deliverable || "未定义产物"}</strong>{project.tasks.length > 1 && <button type="button" onClick={() => edit((current) => ({ ...current, tasks: current.tasks.filter((item) => item.id !== task.id) }))}>删除</button>}</div>
              <div className="two-columns"><TextField label="动作" value={task.action} onChange={(action) => edit((current) => ({ ...current, tasks: current.tasks.map((item) => item.id === task.id ? { ...item, action } : item) }))} placeholder="搭建、招募、记录……" /><TextField label="可检查产物" value={task.deliverable} onChange={(deliverable) => edit((current) => ({ ...current, tasks: current.tasks.map((item) => item.id === task.id ? { ...item, deliverable } : item) }))} /></div>
              <div className="two-columns"><TextField label="负责人" value={task.owner} onChange={(owner) => edit((current) => ({ ...current, tasks: current.tasks.map((item) => item.id === task.id ? { ...item, owner } : item) }))} placeholder="我 / 程序 / 设计……" /><TextField label="完成定义" value={task.doneDefinition} onChange={(doneDefinition) => edit((current) => ({ ...current, tasks: current.tasks.map((item) => item.id === task.id ? { ...item, doneDefinition } : item) }))} /></div>
            </section>
          ))}
        </div>
        {project.tasks.length < 8 && <button className="add-row" type="button" onClick={() => edit((current) => ({ ...current, tasks: [...current.tasks, { id: makeId("task"), action: "", deliverable: "", owner: "", doneDefinition: "" }] }))}>＋ 增加任务</button>}
        <div className="two-columns scope-fields"><TextArea label="如果主假设失败，下一条最便宜的路" value={project.contingency} onChange={(contingency) => edit({ contingency })} compact /><TextArea label="本轮明确不做" value={project.notNow} onChange={(notNow) => edit({ notNow })} compact /></div>
      </>, { context: `原型：${project.prototype.type}｜时限：${project.prototype.timebox}` });
    case "D8":
      return <ActionWorkbench project={project} node={node} edit={edit} go={go} complete={complete} />;
    case "I0":
      return wrap(<>
        <div className="observation-editor-list">
          {project.observations.map((observation, index) => (
            <section className="observation-editor" key={observation.id}>
              <div className="editor-heading"><span>{String(index + 1).padStart(2, "0")}</span><strong>一次观察</strong>{project.observations.length > 1 && <button type="button" onClick={() => edit((current) => ({ ...current, observations: current.observations.filter((item) => item.id !== observation.id) }))}>删除</button>}</div>
              <TextField label="版本 / 参与者 / 环境" value={observation.context} onChange={(context) => edit((current) => ({ ...current, observations: current.observations.map((item) => item.id === observation.id ? { ...item, context } : item) }))} />
              <TextArea label="看见、听见或测得的事实" value={observation.fact} onChange={(fact) => edit((current) => ({ ...current, observations: current.observations.map((item) => item.id === observation.id ? { ...item, fact } : item) }))} />
              <TextArea label="可能的解释（与事实分开）" value={observation.interpretation} onChange={(interpretation) => edit((current) => ({ ...current, observations: current.observations.map((item) => item.id === observation.id ? { ...item, interpretation } : item) }))} compact />
            </section>
          ))}
        </div>
        <button className="add-row" type="button" onClick={() => edit((current) => ({ ...current, observations: [...current.observations, { id: makeId("observation"), context: "", fact: "", interpretation: "" }] }))}>＋ 增加观察</button>
      </>, { context: `原假设：如果${project.hypothesis.setup}，玩家会${project.hypothesis.behavior}，进而${project.hypothesis.result}` });
    case "I1":
      return wrap(<>
        <div className="evidence-compare"><section><span>支持信号</span><p>{project.hypothesis.supportSignal || "未定义"}</p></section><section><span>反驳信号</span><p>{project.hypothesis.refuteSignal || "未定义"}</p></section></div>
        <ChoiceGrid label="现有观察更接近" choices={["支持假设", "反驳假设", "没有出现", "无法判断"].map((title) => ({ id: title, title }))} selected={[project.evidenceAssessment]} onToggle={(evidenceAssessment) => edit({ evidenceAssessment })} single />
      </>, { context: project.observations.map((item) => item.fact).filter(Boolean).join("；") });
    case "I2":
      return wrap(<>
        <ChoiceGrid label="现在怎么处理这条假设" choices={["保留", "调整", "替换", "需要更多证据", "放弃"].map((title) => ({ id: title, title }))} selected={[project.iterationDecision]} onToggle={(iterationDecision) => edit({ iterationDecision })} single />
        <TextArea label="基于什么理由？" value={project.iterationReason} onChange={(iterationReason) => edit({ iterationReason })} />
      </>, { context: `证据判断：${project.evidenceAssessment}` });
    case "I3": {
      const candidates = ["A6", "A7", "B1", "B2", "B3", "B7", "C7", "C9", "D3", "D4", "D6"];
      return wrap(<ChoiceGrid label="哪些决定需要复核？" choices={candidates.map((id) => ({ id, title: `${id} · ${nodeMap[id]?.short}` }))} selected={project.reviewNodes} onToggle={(value) => edit({ reviewNodes: toggle(project.reviewNodes, value) })} />, { context: `迭代决定：${project.iterationDecision}｜${project.iterationReason}` });
    }
    case "I4":
      return <Checkpoint node={node} title="证据已经进入设计系统；请选择它真正需要改变的地方。" items={[
        ["证据判断", project.evidenceAssessment], ["迭代决定", `${project.iterationDecision}｜${project.iterationReason}`], ["待复核", project.reviewNodes.join(" · ")],
      ]} primary="回到设计骨架" onPrimary={() => complete("answered", "B1")} actions={[["改概念", () => complete("answered", "A1")], ["重做判断", () => complete("answered", "C7")], ["安排下一轮", () => complete("answered", "D0")], ["返回项目入口", () => complete("answered", "S0")]]} />;
    default:
      return wrap(<InlineNotice>这个节点尚未找到对应视图。请返回设计路径选择其他节点。</InlineNotice>);
  }
}

function StartNode({ project, issues, edit, go }: { project: ProjectState; issues: ReturnType<typeof deriveIssues>; edit: RendererProps["edit"]; go: (id: string) => void }) {
  const hasProject = Boolean(project.rawIdea.trim());
  return (
    <div className="start-view entrance">
      <p className="context-label">CreatorEngine · 对话工作台</p>
      <h1>让当前最重要的问题浮上来。</h1>
      <p className="supporting-copy">不是写满一份表格。CE 帮你澄清核心、补全结构、做好判断，再把最大未知变成下一项可验证工作。</p>
      <div className="start-settings">
        <TextField label="项目名称" value={project.name} onChange={(name) => edit({ name })} />
      </div>
      <div className="entry-grid">
        <EntryCard number="01" title={hasProject ? "继续当前项目" : "开始一个新想法"} body={hasProject ? `当前有 ${issues.length} 项建议；先确定这次希望推进的结果。` : "从一句不完整的动作、画面或题材开始。"} action={hasProject ? "选择目标" : "开始"} onClick={() => go(hasProject ? "S1" : "A0")} />
        <EntryCard number="02" title="诊断我卡在哪里" body="按当前缺口、风险和待复核状态推荐下一问。" action="开始诊断" onClick={() => go(recommendedNode(project))} disabled={!hasProject} />
        <EntryCard number="03" title="录入一次试玩" body="把实际观察对照原假设，让证据回流到设计。" action="记录证据" onClick={() => go(project.hypothesis.supportSignal ? "I0" : "D3")} disabled={!hasProject} />
        <EntryCard number="04" title="只安排下一步" body="汇总未知、选择一号问题并形成最小工作路径。" action="形成路径" onClick={() => go(hasProject ? "D0" : "A0")} />
      </div>
      <div className="principle-strip"><span>四项职责</span><p>澄清想法</p><p>构建设计</p><p>辅助判断</p><p>形成路径</p></div>
    </div>
  );
}

function NodeFrame({ node, project, valid, context, noAlternative, nextLabel, onBack, onComplete, children }: { node: NodeMeta; project: ProjectState; valid: boolean; context?: string; noAlternative?: boolean; nextLabel?: string; onBack: () => void; onComplete: (mode?: CompletionMode) => void; children: ReactNode }) {
  const status = project.statuses[node.id];
  return (
    <div className="guided-view node-view entrance">
      <div className="node-kicker"><span>{node.id}</span><span>{phases.find((phase) => phase.id === node.phase)?.title}</span>{status && <strong>{completionLabels[status]}</strong>}</div>
      <h1>{node.title}</h1>
      <p className="supporting-copy node-purpose">{node.purpose}</p>
      {context && <div className="node-context"><span>带着前面的答案</span><p>{context}</p></div>}
      <div className="node-body">{children}</div>
      {node.reference && <ReferenceHint title="为什么这样问"><p>{node.reference}</p></ReferenceHint>}
      <div className="node-decision-bar">
        <button className="back-button" type="button" onClick={onBack}><CaretLeft size={14} />上一问</button>
        <div className="completion-options">
          {!noAlternative && <>
            <button type="button" disabled={!valid} onClick={() => onComplete("assumption")}>暂作假设</button>
            <button type="button" onClick={() => onComplete("deferred")}>延期回答</button>
            <button type="button" onClick={() => onComplete("not_applicable")}>不适用</button>
          </>}
          <button className="primary-button inline" type="button" disabled={!valid} onClick={() => onComplete("answered")}>{nextLabel ?? "接受并继续"}<ArrowRight size={14} /></button>
        </div>
      </div>
      {!valid && <p className="validation-note">完成主要输入后可以确认；如果现在未知，可明确延期或标记不适用。</p>}
    </div>
  );
}

function Checkpoint({ node, title, items, primary, onPrimary, actions }: { node: NodeMeta; title: string; items: string[][]; primary: string; onPrimary: () => void; actions: Array<[string, () => void]> }) {
  return (
    <div className="checkpoint-view entrance">
      <div className="checkpoint-mark"><Check size={25} /></div>
      <p className="context-label">{node.id} · 阶段检查点</p>
      <h1>{title}</h1>
      <div className="checkpoint-grid">
        {items.map(([label, value]) => <section key={label}><span>{label}</span><p>{value || "仍未明确"}</p></section>)}
      </div>
      <div className="checkpoint-actions">
        <button className="primary-button" type="button" onClick={onPrimary}>{primary}<ArrowRight size={14} /></button>
        <div>{actions.map(([label, action]) => <button type="button" key={label} onClick={action}>{label}</button>)}</div>
      </div>
    </div>
  );
}

function ActionWorkbench({ project, node, edit, go, complete }: { project: ProjectState; node: NodeMeta; edit: RendererProps["edit"]; go: (id: string) => void; complete: RendererProps["complete"] }) {
  const markdown = buildMarkdown(project);
  async function copy() { await navigator.clipboard.writeText(markdown); }
  function download() {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${project.name || "game-design"}.md`;
    anchor.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div className="action-workbench entrance">
      <div className="node-kicker"><span>{node.id}</span><span>行动路径</span></div>
      <h1>下一轮不是“继续完善”，而是回答一个问题。</h1>
      <p className="supporting-copy">所有任务都应服务一号问题；失败时也有可回退的路径。</p>
      <section className="mission-card"><span>一号问题</span><h2>{project.nextQuestion || "尚未选择"}</h2><p>{project.changeIfAnswered}</p></section>
      <div className="workbench-grid">
        <section><span>可验证假设</span><p>如果让玩家{project.hypothesis.setup}，他们会{project.hypothesis.behavior}，进而{project.hypothesis.result}。</p></section>
        <section><span>最小原型</span><p>{project.prototype.type}：{project.prototype.mustBuild}</p><small>刻意不做：{project.prototype.omit}</small></section>
        <section><span>支持 / 反驳</span><p>{project.hypothesis.supportSignal}</p><small>{project.hypothesis.refuteSignal}</small></section>
        <section><span>备选路径</span><p>{project.contingency || "尚未填写"}</p><small>本轮不做：{project.notNow || "尚未填写"}</small></section>
      </div>
      <section className="work-path-list"><div className="section-title"><span>工作路径</span><strong>{project.tasks.filter((task) => task.action).length} 项</strong></div>{project.tasks.filter((task) => task.action || task.deliverable).map((task, index) => <div key={task.id}><span>{String(index + 1).padStart(2, "0")}</span><p><strong>{task.action}</strong>{task.deliverable}<small>{task.owner || "负责人待定"} · 完成：{task.doneDefinition || "待定义"}</small></p></div>)}</section>
      <div className="workbench-edit"><TextArea label="备选路径" value={project.contingency} onChange={(contingency) => edit({ contingency })} compact /><TextArea label="本轮不做" value={project.notNow} onChange={(notNow) => edit({ notNow })} compact /></div>
      <div className="workbench-actions">
        <button type="button" className="secondary-export" onClick={copy}><Copy size={15} />复制完整方案</button>
        <button type="button" className="secondary-export" onClick={download}><DownloadSimple size={15} />下载设计方案</button>
        <button type="button" className="secondary-export" onClick={() => go("D6")}>修改工作路径</button>
        <button type="button" className="primary-button" onClick={() => complete("answered", "I0")}>完成原型后记录证据<ArrowRight size={14} /></button>
      </div>
    </div>
  );
}

function EntryCard({ number, title, body, action, onClick, disabled }: { number: string; title: string; body: string; action: string; onClick: () => void; disabled?: boolean }) {
  return <button className="entry-card" type="button" onClick={onClick} disabled={disabled}><span>{number}</span><strong>{title}</strong><p>{body}</p><small>{disabled ? "先保存一个想法" : action} <ArrowRight size={12} /></small></button>;
}

function ChoiceList({ choices, selected, onSelect }: { choices: Choice[]; selected: string; onSelect: (id: string) => void }) {
  return <div className="selection-list node-choice-list" role="radiogroup">{choices.map((choice) => <button className={choice.id === selected ? "selected" : ""} type="button" role="radio" aria-checked={choice.id === selected} key={choice.id} onClick={() => onSelect(choice.id)}><span className="radio-mark">{choice.id === selected && <span />}</span><span><strong>{choice.title}</strong><small>{choice.summary}</small></span></button>)}</div>;
}

function ChoiceGrid({ label, choices, selected, onToggle, single }: { label: string; choices: Choice[]; selected: string[]; onToggle: (id: string) => void; single?: boolean }) {
  return <fieldset className="choice-grid-field"><legend>{label}</legend><div className="choice-grid">{choices.map((choice) => <button className={selected.includes(choice.id) ? "selected" : ""} type="button" aria-pressed={selected.includes(choice.id)} key={choice.id} onClick={() => onToggle(choice.id)}><strong>{choice.title}</strong>{choice.summary && <small>{choice.summary}</small>}{single && selected.includes(choice.id) && <Check size={13} />}</button>)}</div></fieldset>;
}

function TextField({ label, value, onChange, placeholder, help }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; help?: string }) {
  const id = `field-${label.replaceAll(" ", "-")}`;
  return <label className="field-control" htmlFor={id}><span>{label}</span>{help && <small>{help}</small>}<input id={id} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} /></label>;
}

function TextArea({ label, value, onChange, placeholder, help, large, compact }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; help?: string; large?: boolean; compact?: boolean }) {
  const id = `area-${label.replaceAll(" ", "-")}`;
  return <label className={`field-control textarea-control ${large ? "large" : ""} ${compact ? "compact" : ""}`} htmlFor={id}><span>{label}</span>{help && <small>{help}</small>}<textarea id={id} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} /></label>;
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return <label className="select-block"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}><option value="">选择</option>{options.map((option) => <option value={option} key={option}>{option}</option>)}</select></label>;
}

function LoopField({ number, label, prompt, value, onChange }: { number: string; label: string; prompt: string; value: string; onChange: (value: string) => void }) {
  return <section className="loop-field"><span>{number}</span><div><strong>{label}</strong><small>{prompt}</small><input value={value} onChange={(event) => onChange(event.target.value)} /></div></section>;
}

function ReferenceHint({ title, children }: { title: string; children: ReactNode }) {
  return <details className="reference-hint"><summary><span><Lightbulb size={15} />{title}</span><CaretDown className="hint-caret" size={14} /></summary><div className="reference-content">{children}</div></details>;
}

function InlineNotice({ children }: { children: ReactNode }) {
  return <div className="inline-notice"><Lightbulb size={15} /><p>{children}</p></div>;
}
