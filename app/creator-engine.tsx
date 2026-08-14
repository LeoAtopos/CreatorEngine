"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowCounterClockwise,
  ArrowRight,
  CaretDown,
  CaretLeft,
  CaretRight,
  Check,
  Copy,
  DownloadSimple,
  FloppyDisk,
  Lightbulb,
  Path,
  PencilSimple,
  SidebarSimple,
  X,
} from "@phosphor-icons/react";

type Stage = "idea" | "refine" | "fantasy" | "framework" | "pillars" | "summary";
type PillarKey = "narrative" | "mechanics" | "aesthetics" | "technology";

type ProjectState = {
  version: 2;
  currentStage: Stage;
  rawIdea: string;
  refine: {
    spark: string;
    playerAction: string;
    experience: string;
    refinedIdea: string;
  };
  fantasyId: string | null;
  fantasyStatement: string;
  genreIds: string[];
  genreCustom: string;
  audienceIds: string[];
  audienceNote: string;
  xId: string | null;
  xStatement: string;
  pillars: Record<PillarKey, string>;
};

type Choice = {
  id: string;
  title: string;
  summary: string;
  prompt: string;
  examples: string[];
};

const STORAGE_KEY = "creator-engine.game-design.v2";

const stages: Array<{ id: Stage; title: string; short: string }> = [
  { id: "idea", title: "记录最初想法", short: "想法" },
  { id: "refine", title: "澄清与改写", short: "澄清" },
  { id: "fantasy", title: "选择玩家 Fantasy", short: "Fantasy" },
  { id: "framework", title: "建立设计框架", short: "框架" },
  { id: "pillars", title: "定义四类设计点", short: "设计点" },
  { id: "summary", title: "完成设计方案", short: "方案" },
];

const fantasies: Choice[] = [
  {
    id: "identity",
    title: "成为另一种人",
    summary: "体验一种现实中难以拥有的身份、职责或生活。",
    prompt: "让玩家感觉：我就是那个 ______ 的人。",
    examples: ["成为在荒野中独自求生的人", "成为经营一座城市的规划者", "成为能决定案件走向的侦探"],
  },
  {
    id: "mastery",
    title: "掌握一项困难能力",
    summary: "从笨拙到熟练，获得理解、控制和精通的满足感。",
    prompt: "让玩家感觉：我逐渐掌握了 ______。",
    examples: ["精确控制一辆高速赛车", "看懂复杂敌人的行动规律", "熟练运用物理规律完成搭建"],
  },
  {
    id: "power",
    title: "拥有力量与影响",
    summary: "获得强大能力，并看见自己的决定改变局面。",
    prompt: "让玩家感觉：我有能力 ______。",
    examples: ["以压倒性力量清除威胁", "指挥一支军队改变战局", "改变一个世界的生态与秩序"],
  },
  {
    id: "discovery",
    title: "探索未知并发现真相",
    summary: "被好奇心驱动，进入未知空间并拼出背后的规律。",
    prompt: "让玩家感觉：我正在发现 ______。",
    examples: ["深入一颗陌生星球", "破解一个失落文明的秘密", "在日常空间中发现隐藏规则"],
  },
  {
    id: "creation",
    title: "创造与表达",
    summary: "把自己的选择变成独特、可见且属于自己的结果。",
    prompt: "让玩家感觉：这是我亲手创造的 ______。",
    examples: ["建造独一无二的家园", "设计能实际运转的机器", "用系统表达自己的审美与策略"],
  },
  {
    id: "care",
    title: "照顾与建立关系",
    summary: "通过陪伴、保护和理解，与角色或生命建立情感联结。",
    prompt: "让玩家感觉：我正在照顾并理解 ______。",
    examples: ["陪伴一个角色走出困境", "培育一个会回应自己的生物", "保护一群依赖自己的居民"],
  },
  {
    id: "social",
    title: "与他人共同经历",
    summary: "合作、竞争、表演或交流本身构成游戏的核心意义。",
    prompt: "让玩家感觉：我和其他人正在一起 ______。",
    examples: ["在混乱中默契协作", "彼此猜测并隐藏身份", "共同创造只属于这群人的故事"],
  },
  {
    id: "transformation",
    title: "突破限制并完成改变",
    summary: "面对压迫、困境或自我局限，逐步实现逆转和成长。",
    prompt: "让玩家感觉：我从 ______ 变成了 ______。",
    examples: ["从弱小个体成长为可靠领袖", "让一片荒芜之地恢复生机", "挣脱一套看似无法改变的规则"],
  },
];

const genres = [
  ["action", "动作"], ["adventure", "冒险"], ["rpg", "角色扮演"], ["strategy", "策略"],
  ["simulation", "模拟经营"], ["puzzle", "解谜"], ["survival", "生存"], ["narrative", "叙事"],
  ["party", "聚会/社交"], ["sandbox", "沙盒/创造"],
] as const;

const audiences = [
  ["casual", "偏轻度、短时游玩"], ["core", "偏核心、愿意反复钻研"],
  ["creative", "喜欢创造和自我表达"], ["story", "重视人物与故事"],
  ["social", "喜欢共同游玩和社交"], ["strategy", "喜欢规划、推演与优化"],
  ["challenge", "享受高难度和技术成长"], ["explore", "喜欢探索、收集与发现"],
] as const;

const xElements: Choice[] = [
  {
    id: "rule",
    title: "一条不同寻常的规则",
    summary: "改变玩家熟悉的基本规则，让同类行为产生新问题。",
    prompt: "和同类游戏相比，只有本作规定 ______。",
    examples: ["时间只在玩家移动时流动", "失败不会重置世界，而会成为新条件", "所有资源都必须从其他玩家手中交易"],
  },
  {
    id: "action",
    title: "一种独特的核心操作",
    summary: "差异直接来自手感、输入和反复执行的核心行为。",
    prompt: "玩家不是通常地 ______，而是通过 ______ 来完成。",
    examples: ["用物理抓取而非菜单完成搭建", "通过声音而非武器影响敌人", "同时控制两个相互依赖的角色"],
  },
  {
    id: "perspective",
    title: "一个不同的身份或视角",
    summary: "同一题材因玩家身份、信息范围或立场变化而焕然一新。",
    prompt: "玩家不是常见的 ______，而是 ______。",
    examples: ["不是英雄，而是清理英雄战场的人", "不是城市建设者，而是城市里的小动物", "只能看到过去，无法直接看到现在"],
  },
  {
    id: "relationship",
    title: "一种新的玩家关系",
    summary: "用合作、竞争、依赖或沟通限制改变体验结构。",
    prompt: "玩家之间必须 ______，但同时 ______。",
    examples: ["共享生命但目标并不完全一致", "不能说话，只能用行动表达意图", "合作建造，同时争夺最后的归属权"],
  },
  {
    id: "world",
    title: "一个强烈的世界条件",
    summary: "让特殊环境或时代条件持续影响每一个设计决定。",
    prompt: "整个游戏都发生在一个 ______ 的世界中。",
    examples: ["每天都会缩小的世界", "没有地面的漂浮文明", "所有记忆都能被公开交易的社会"],
  },
  {
    id: "rhythm",
    title: "一种不同的体验节奏",
    summary: "通过时间结构、回合长度或紧张与舒缓的排列形成差异。",
    prompt: "本作把通常的 ______ 节奏改成 ______。",
    examples: ["一局只持续三分钟但结果永久保留", "战斗很短，准备过程很长", "现实一天对应游戏中的一代人"],
  },
  {
    id: "hybrid",
    title: "两种体验的意外组合",
    summary: "让本来分离的类型或行为彼此制约，而非简单并列。",
    prompt: "把 ______ 的体验与 ______ 的规则真正结合。",
    examples: ["烹饪操作与团队沟通相互制约", "城市规划直接决定动作关卡", "推理解谜改变长期经营资源"],
  },
  {
    id: "technology",
    title: "一种媒介或技术能力",
    summary: "使用设备、输入或模拟能力，创造此前难以成立的体验。",
    prompt: "利用 ______，让玩家可以 ______。",
    examples: ["利用空间音频在黑暗中定位", "利用触摸压力改变材料形态", "用高精度物理模拟实现不可预测的搭建"],
  },
];

const pillarMeta: Array<{
  id: PillarKey;
  title: string;
  question: string;
  placeholder: string;
  examples: string[];
  optional?: string;
}> = [
  {
    id: "narrative",
    title: "叙事设计点",
    question: "玩家是谁、处于什么情境，游戏如何让意义逐步显现？",
    placeholder: "例如：玩家是一位不断接手失败工程的修复师；每次搭建留下的痕迹构成世界的历史……",
    examples: ["环境叙事：通过空间变化而非对白揭示过去", "角色弧光：能力成长与人物改变同步", "玩家叙事：让系统结果自然形成可讲述的经历"],
    optional: "本作不以预设故事为重点，叙事主要由玩家行为和系统结果自然形成。",
  },
  {
    id: "mechanics",
    title: "机制设计点",
    question: "玩家反复做什么，规则如何产生选择、反馈和成长？",
    placeholder: "例如：抓取—放置—观察受力—调整结构；材料形状、重心与环境扰动持续制造新问题……",
    examples: ["核心循环：行动→反馈→资源/信息→更难的新行动", "关键选择：风险与收益必须同时可感知", "成长方式：玩家理解增长优先于单纯数值增长"],
  },
  {
    id: "aesthetics",
    title: "美学设计点",
    question: "画面、声音、动效和交互要共同形成什么感受？",
    placeholder: "例如：柔和材质与夸张物理反应形成轻松感；危险时不变红，而通过结构吱响和细微震动提示……",
    examples: ["视觉语法：哪些颜色、形状分别代表安全与风险", "声音反馈：关键状态能否闭眼辨认", "动效节奏：操作结果是轻快、沉重还是克制"],
  },
  {
    id: "technology",
    title: "技术设计点",
    question: "哪些技术能力是体验成立的必要条件，哪些风险要尽早验证？",
    placeholder: "例如：稳定且可预测的刚体物理；支持大量接触点；先用灰盒验证不同帧率下的结果一致性……",
    examples: ["核心技术：物理、AI、联网、生成、存档或工具链", "性能边界：目标设备、帧率、同屏规模", "验证原型：最早需要证明的技术风险是什么"],
  },
];

const emptyProject: ProjectState = {
  version: 2,
  currentStage: "idea",
  rawIdea: "",
  refine: { spark: "", playerAction: "", experience: "", refinedIdea: "" },
  fantasyId: null,
  fantasyStatement: "",
  genreIds: [],
  genreCustom: "",
  audienceIds: [],
  audienceNote: "",
  xId: null,
  xStatement: "",
  pillars: { narrative: "", mechanics: "", aesthetics: "", technology: "" },
};

function hasIdea(project: ProjectState) {
  return Boolean(project.rawIdea.trim());
}

function hasRefinedIdea(project: ProjectState) {
  return Boolean(
    project.refine.spark.trim() &&
    project.refine.playerAction.trim() &&
    project.refine.experience.trim() &&
    project.refine.refinedIdea.trim(),
  );
}

function hasFantasy(project: ProjectState) {
  return Boolean(project.fantasyId && project.fantasyStatement.trim());
}

function hasFramework(project: ProjectState) {
  return Boolean(
    (project.genreIds.length || project.genreCustom.trim()) &&
    (project.audienceIds.length || project.audienceNote.trim()) &&
    project.xId &&
    project.xStatement.trim(),
  );
}

function hasPillars(project: ProjectState) {
  return pillarMeta.every(({ id }) => project.pillars[id].trim());
}

function maxAccessibleStage(project: ProjectState) {
  if (!hasIdea(project)) return 0;
  if (!hasRefinedIdea(project)) return 1;
  if (!hasFantasy(project)) return 2;
  if (!hasFramework(project)) return 3;
  if (!hasPillars(project)) return 4;
  return 5;
}

function loadProject(): ProjectState {
  if (typeof window === "undefined") return emptyProject;
  try {
    const current = window.localStorage.getItem(STORAGE_KEY);
    if (current) {
      const parsed = { ...emptyProject, ...JSON.parse(current) } as ProjectState;
      parsed.refine = { ...emptyProject.refine, ...parsed.refine };
      parsed.pillars = { ...emptyProject.pillars, ...parsed.pillars };
      parsed.genreIds = Array.isArray(parsed.genreIds)
        ? parsed.genreIds.filter((id) => genres.some(([value]) => value === id))
        : [];
      parsed.audienceIds = Array.isArray(parsed.audienceIds)
        ? parsed.audienceIds.filter((id) => audiences.some(([value]) => value === id))
        : [];
      if (!fantasies.some(({ id }) => id === parsed.fantasyId)) parsed.fantasyId = null;
      if (!xElements.some(({ id }) => id === parsed.xId)) parsed.xId = null;
      const allowedIndex = maxAccessibleStage(parsed);
      const requestedIndex = stages.findIndex(({ id }) => id === parsed.currentStage);
      parsed.currentStage = stages[Math.min(Math.max(requestedIndex, 0), allowedIndex)].id;
      return parsed;
    }

    const legacy = window.localStorage.getItem("creator-engine.game-origin.v1");
    if (legacy) {
      const old = JSON.parse(legacy) as { idea?: string };
      return { ...emptyProject, rawIdea: old.idea ?? "", currentStage: old.idea ? "refine" : "idea" };
    }
  } catch {
    return emptyProject;
  }
  return emptyProject;
}

export function CreatorEngine() {
  const [project, setProject] = useState<ProjectState>(emptyProject);
  const [ready, setReady] = useState(false);
  const [pathOpen, setPathOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);

  useEffect(() => {
    const hydration = window.setTimeout(() => {
      setProject(loadProject());
      setReady(true);
    }, 0);
    return () => window.clearTimeout(hydration);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  }, [project, ready]);

  const stageIndex = stages.findIndex(({ id }) => id === project.currentStage);
  const accessibleIndex = maxAccessibleStage(project);
  const selectedFantasy = fantasies.find(({ id }) => id === project.fantasyId);
  const selectedX = xElements.find(({ id }) => id === project.xId);

  const completion = useMemo(() => {
    const checks = [hasIdea(project), hasRefinedIdea(project), hasFantasy(project), hasFramework(project), hasPillars(project)];
    return checks.filter(Boolean).length;
  }, [project]);

  function update(patch: Partial<ProjectState>) {
    setProject((current) => ({ ...current, ...patch }));
  }

  function updateRefine(patch: Partial<ProjectState["refine"]>) {
    setProject((current) => ({ ...current, refine: { ...current.refine, ...patch } }));
  }

  function updatePillar(id: PillarKey, value: string) {
    setProject((current) => ({ ...current, pillars: { ...current.pillars, [id]: value } }));
  }

  function goTo(stage: Stage) {
    const targetIndex = stages.findIndex(({ id }) => id === stage);
    if (targetIndex > maxAccessibleStage(project)) return;
    update({ currentStage: stage });
    setPathOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetProject() {
    if (!window.confirm("清空当前设计并从头开始？")) return;
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem("creator-engine.game-origin.v1");
    setProject(emptyProject);
    setPathOpen(false);
    setStateOpen(false);
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">创作引擎</div>
        <div className="top-progress" aria-label={`当前第 ${stageIndex + 1} 步，共 ${stages.length} 步`}>
          <strong>{stageIndex + 1}</strong><span>/</span><span>{stages.length}</span>
          <span className="stage-name">{stages[stageIndex].short}</span>
        </div>
        <div className="top-actions">
          <div className="save-status"><FloppyDisk size={15} /> 本地保存</div>
          <button className="restart-button" type="button" onClick={resetProject}>
            <ArrowCounterClockwise size={15} /> <span>重新开始</span>
          </button>
        </div>
      </header>

      <button
        className={`side-toggle left ${pathOpen ? "open" : ""}`}
        type="button"
        aria-expanded={pathOpen}
        aria-label={pathOpen ? "收起设计路径" : "展开设计路径"}
        onClick={() => setPathOpen((open) => !open)}
      >
        {pathOpen ? <CaretLeft size={17} /> : <Path size={18} />}
      </button>
      <button
        className={`side-toggle right ${stateOpen ? "open" : ""}`}
        type="button"
        aria-expanded={stateOpen}
        aria-label={stateOpen ? "收起当前设计状态" : "展开当前设计状态"}
        onClick={() => setStateOpen((open) => !open)}
      >
        {stateOpen ? <CaretRight size={17} /> : <SidebarSimple size={18} />}
      </button>

      <aside className={`side-panel path-panel ${pathOpen ? "open" : ""}`} aria-hidden={!pathOpen}>
        <PanelHeader title="设计路径" onClose={() => setPathOpen(false)} />
        <ol className="path-list">
          {stages.map((stage, index) => (
            <li
              className={`${index === stageIndex ? "active" : ""} ${index < stageIndex || index < accessibleIndex ? "done" : ""} ${index > accessibleIndex ? "locked" : ""}`}
              key={stage.id}
            >
              <span>{index < stageIndex || index < accessibleIndex ? <Check size={13} /> : index + 1}</span>
              <button type="button" disabled={index > accessibleIndex} onClick={() => goTo(stage.id)}>{stage.title}</button>
            </li>
          ))}
        </ol>
      </aside>

      <aside className={`side-panel state-panel ${stateOpen ? "open" : ""}`} aria-hidden={!stateOpen}>
        <PanelHeader title="当前设计状态" onClose={() => setStateOpen(false)} />
        <div className="state-progress"><span style={{ width: `${(completion / 5) * 100}%` }} /></div>
        <StateItem label="清晰想法" empty="尚未完成">{project.refine.refinedIdea || project.rawIdea || null}</StateItem>
        <StateItem label="玩家 Fantasy" empty="尚未选择">{selectedFantasy?.title || null}</StateItem>
        <StateItem label="类型" empty="尚未选择">{labelMany(project.genreIds, genres, project.genreCustom) || null}</StateItem>
        <StateItem label="目标用户" empty="尚未定义">{labelMany(project.audienceIds, audiences, project.audienceNote) || null}</StateItem>
        <StateItem label="差异化 X" empty="尚未定义">{selectedX?.title || null}</StateItem>
        <p className="local-note">不联网 · 不使用 AI · 内容只保存在这台设备</p>
      </aside>

      <section className={`conversation ${project.currentStage === "summary" ? "wide" : ""}`} aria-live="polite">
        {project.currentStage === "idea" && (
          <IdeaStep
            value={project.rawIdea}
            onChange={(rawIdea) => update({ rawIdea })}
            onContinue={() => update({ currentStage: "refine" })}
          />
        )}
        {project.currentStage === "refine" && (
          <RefineStep
            project={project}
            onChange={updateRefine}
            onBack={() => goTo("idea")}
            onContinue={() => update({ currentStage: "fantasy" })}
          />
        )}
        {project.currentStage === "fantasy" && (
          <FantasyStep
            idea={project.refine.refinedIdea}
            fantasyId={project.fantasyId}
            statement={project.fantasyStatement}
            onSelect={(fantasyId) => update({ fantasyId, fantasyStatement: "" })}
            onStatement={(fantasyStatement) => update({ fantasyStatement })}
            onBack={() => goTo("refine")}
            onContinue={() => update({ currentStage: "framework" })}
          />
        )}
        {project.currentStage === "framework" && selectedFantasy && (
          <FrameworkStep
            project={project}
            fantasy={selectedFantasy}
            onUpdate={update}
            onBack={() => goTo("fantasy")}
            onContinue={() => update({ currentStage: "pillars" })}
          />
        )}
        {project.currentStage === "pillars" && (
          <PillarsStep
            values={project.pillars}
            onChange={updatePillar}
            onBack={() => goTo("framework")}
            onContinue={() => update({ currentStage: "summary" })}
          />
        )}
        {project.currentStage === "summary" && selectedFantasy && selectedX && (
          <SummaryStep
            project={project}
            fantasy={selectedFantasy}
            xElement={selectedX}
            onEdit={goTo}
          />
        )}
      </section>
    </main>
  );
}

function IdeaStep({ value, onChange, onContinue }: { value: string; onChange: (value: string) => void; onContinue: () => void }) {
  return (
    <div className="focus-view entrance">
      <p className="context-label">01 · 最初想法</p>
      <h1>先把脑海里的东西写下来。</h1>
      <p className="supporting-copy">不必完整。一个动作、画面、题材或一句话都可以。</p>
      <textarea
        className="idea-input"
        maxLength={800}
        aria-label="我的最初想法"
        placeholder="例如：我想做一个需要不断把奇怪物体垒高的物理游戏……"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <ReferenceHint title="没有想法时，可以从哪里开始？">
        <p>任选一个句子补完，不需要同时回答：</p>
        <ul>
          <li>我一直觉得反复 ______ 会很好玩。</li>
          <li>我想让玩家体验成为 ______。</li>
          <li>我脑中有一个画面：______。</li>
          <li>如果把 ______ 的规则改成 ______ 会怎样？</li>
        </ul>
      </ReferenceHint>
      <div className="center-action">
        <button className="primary-button" type="button" disabled={!value.trim()} onClick={onContinue}>开始澄清想法</button>
      </div>
    </div>
  );
}

function RefineStep({
  project,
  onChange,
  onBack,
  onContinue,
}: {
  project: ProjectState;
  onChange: (patch: Partial<ProjectState["refine"]>) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const questions = [
    {
      key: "spark" as const,
      label: "先保住它的火花",
      question: "这个想法里，你最不愿意失去的部分是什么？",
      placeholder: "例如：物体摇摇欲坠、但还能被救回来的紧张瞬间……",
      examples: ["不是题材，而是一种手感", "一个很想亲自进入的世界", "某种人与人之间的关系", "一个值得反复追问的问题"],
    },
    {
      key: "playerAction" as const,
      label: "把玩家放进去",
      question: "玩家会反复做的核心事情是什么？",
      placeholder: "例如：抓起不同形状的物体，判断重心，把它们稳定地垒起来……",
      examples: ["用动词写：寻找、组合、协商、逃跑、照顾、建造", "写玩家做什么，不写系统有什么功能", "如果有多个动作，先写最常重复的一个"],
    },
    {
      key: "experience" as const,
      label: "明确体验承诺",
      question: "你希望玩家主要获得什么感受？",
      placeholder: "例如：先紧张、再因救回结构而松一口气，最后为高度感到自豪……",
      examples: ["掌控：从混乱中逐步获得控制", "发现：不断遇到出乎意料的新规律", "表达：结果能体现玩家自己的选择", "联结：和角色或其他玩家形成关系"],
    },
  ];

  return (
    <div className="guided-view entrance">
      <p className="context-label">02 · 澄清与改写</p>
      <h1>让这个想法可以继续被设计。</h1>
      <div className="user-utterance">“{project.rawIdea}”</div>
      <div className="question-flow">
        {questions.map((item, index) => (
          <section className="dialog-turn" key={item.key}>
            <div className="turn-number">{index + 1}</div>
            <div className="turn-content">
              <span>{item.label}</span>
              <h2>{item.question}</h2>
              <textarea
                aria-label={item.question}
                value={project.refine[item.key]}
                placeholder={item.placeholder}
                onChange={(event) => onChange({ [item.key]: event.target.value })}
              />
              <ReferenceHint title="参考提示与例子">
                <ul>{item.examples.map((example) => <li key={example}>{example}</li>)}</ul>
              </ReferenceHint>
            </div>
          </section>
        ))}
      </div>

      <section className="rewrite-block">
        <span>再次输入 · 形成当前版本</span>
        <h2>现在，用一句话重新写下这个游戏。</h2>
        <p>建议包含：玩家是谁或做什么、核心吸引力、主要体验。</p>
        <textarea
          aria-label="清晰后的游戏想法"
          value={project.refine.refinedIdea}
          placeholder="例如：一个让玩家用高精度物理操作不断垒高奇怪物体，在摇摇欲坠中追求掌控与纪录的挑战游戏。"
          onChange={(event) => onChange({ refinedIdea: event.target.value })}
        />
      </section>
      <Navigation
        backLabel="修改最初想法"
        nextLabel="用清晰想法选择 Fantasy"
        disabled={!hasRefinedIdea(project)}
        onBack={onBack}
        onNext={onContinue}
      />
    </div>
  );
}

function FantasyStep({
  idea,
  fantasyId,
  statement,
  onSelect,
  onStatement,
  onBack,
  onContinue,
}: {
  idea: string;
  fantasyId: string | null;
  statement: string;
  onSelect: (id: string) => void;
  onStatement: (value: string) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const selected = fantasies.find(({ id }) => id === fantasyId);
  return (
    <div className="guided-view entrance">
      <p className="context-label">03 · 玩家 Fantasy</p>
      <h1>玩家通过这个游戏，想象自己正在成为或做到什么？</h1>
      <p className="supporting-copy">Fantasy 不是世界观标签，而是玩家在行动中获得的身份感与愿望满足。</p>
      <div className="idea-context">“{idea}”</div>
      <div className="selection-list" role="radiogroup" aria-label="选择玩家 Fantasy">
        {fantasies.map((fantasy) => (
          <ChoiceRow
            key={fantasy.id}
            choice={fantasy}
            selected={fantasy.id === fantasyId}
            onSelect={() => onSelect(fantasy.id)}
          />
        ))}
      </div>
      {selected && (
        <section className="statement-block entrance">
          <span>把它写成这个游戏专属的 Fantasy</span>
          <h2>{selected.prompt}</h2>
          <textarea
            aria-label="游戏专属的玩家 Fantasy"
            value={statement}
            placeholder={`例如：${selected.examples[0]}。`}
            onChange={(event) => onStatement(event.target.value)}
          />
          <ReferenceHint title="参考案例">
            <ul>{selected.examples.map((example) => <li key={example}>{example}</li>)}</ul>
          </ReferenceHint>
        </section>
      )}
      <Navigation
        backLabel="返回澄清想法"
        nextLabel="进入设计框架"
        disabled={!fantasyId || !statement.trim()}
        onBack={onBack}
        onNext={onContinue}
      />
    </div>
  );
}

function ChoiceRow({ choice, selected, onSelect }: { choice: Choice; selected: boolean; onSelect: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`choice-row ${selected ? "selected" : ""}`}>
      <div className="choice-main">
        <button type="button" role="radio" aria-checked={selected} onClick={onSelect}>
          <span className="radio-mark">{selected && <span />}</span>
          <span><strong>{choice.title}</strong><small>{choice.summary}</small></span>
        </button>
        <button
          className="row-disclosure"
          type="button"
          aria-expanded={open}
          aria-label={`${open ? "收起" : "查看"}${choice.title}参考`}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <CaretDown size={17} /> : <Lightbulb size={17} />}
        </button>
      </div>
      {open && (
        <div className="row-reference-content entrance">
          <p>{choice.prompt}</p>
          <ul>{choice.examples.map((example) => <li key={example}>{example}</li>)}</ul>
        </div>
      )}
    </div>
  );
}

function FrameworkStep({
  project,
  fantasy,
  onUpdate,
  onBack,
  onContinue,
}: {
  project: ProjectState;
  fantasy: Choice;
  onUpdate: (patch: Partial<ProjectState>) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const selectedX = xElements.find(({ id }) => id === project.xId);
  return (
    <div className="guided-view entrance">
      <p className="context-label">04 · 设计框架</p>
      <h1>给这个想法一个可工作的设计框架。</h1>

      <FrameworkSection number="01" title="类型" question="它主要借用哪类游戏的规则预期？">
        <div className="chip-list" role="group" aria-label="选择游戏类型">
          {genres.map(([id, label]) => (
            <button
              className={project.genreIds.includes(id) ? "selected" : ""}
              type="button"
              aria-pressed={project.genreIds.includes(id)}
              key={id}
              onClick={() => onUpdate({ genreIds: toggle(project.genreIds, id) })}
            >{label}</button>
          ))}
        </div>
        <input
          className="line-input"
          aria-label="自定义游戏类型"
          value={project.genreCustom}
          placeholder="补充或自定义类型，例如：物理建造挑战……"
          onChange={(event) => onUpdate({ genreCustom: event.target.value })}
        />
        <ReferenceHint title="类型应该怎么选？">
          <p>类型用于告诉设计者和玩家“基本规则预期是什么”，可以选择 1–2 个主类型，不必把所有元素都列成类型。</p>
          <p>例：含有升级不一定就是 RPG；有对话也不一定就是叙事游戏。</p>
        </ReferenceHint>
      </FrameworkSection>

      <FrameworkSection number="02" title="Fantasy" question="玩家在这个框架里满足什么愿望？">
        <div className="fixed-answer"><strong>{fantasy.title}</strong><p>{project.fantasyStatement}</p></div>
      </FrameworkSection>

      <FrameworkSection number="03" title="目标用户" question="谁最可能理解并持续享受这个体验？">
        <div className="chip-list" role="group" aria-label="选择目标用户">
          {audiences.map(([id, label]) => (
            <button
              className={project.audienceIds.includes(id) ? "selected" : ""}
              type="button"
              aria-pressed={project.audienceIds.includes(id)}
              key={id}
              onClick={() => onUpdate({ audienceIds: toggle(project.audienceIds, id) })}
            >{label}</button>
          ))}
        </div>
        <textarea
          className="compact-textarea"
          aria-label="目标用户补充说明"
          value={project.audienceNote}
          placeholder="进一步描述：他们熟悉什么、为什么会被吸引、通常怎样游玩……"
          onChange={(event) => onUpdate({ audienceNote: event.target.value })}
        />
        <ReferenceHint title="不要只写年龄和性别">
          <p>对设计更有帮助的是玩家的动机、经验和游玩情境。</p>
          <ul>
            <li>弱：18–35 岁男性。</li>
            <li>强：喜欢物理实验、愿意反复挑战个人纪录、能接受短局失败的玩家。</li>
          </ul>
        </ReferenceHint>
      </FrameworkSection>

      <FrameworkSection number="04" title="体验差异化 X" question="如果只能保留一个与同类不同的元素，它是什么？">
        <div className="selection-list compact" role="radiogroup" aria-label="选择体验差异化 X">
          {xElements.map((choice) => (
            <ChoiceRow key={choice.id} choice={choice} selected={choice.id === project.xId} onSelect={() => onUpdate({ xId: choice.id, xStatement: "" })} />
          ))}
        </div>
        {selectedX && (
          <div className="x-statement entrance">
            <label htmlFor="x-statement">{selectedX.prompt}</label>
            <textarea
              id="x-statement"
              value={project.xStatement}
              placeholder={`例如：${selectedX.examples[0]}。`}
              onChange={(event) => onUpdate({ xStatement: event.target.value })}
            />
          </div>
        )}
      </FrameworkSection>
      <Navigation
        backLabel="返回 Fantasy"
        nextLabel="定义四类设计点"
        disabled={!hasFramework(project)}
        onBack={onBack}
        onNext={onContinue}
      />
    </div>
  );
}

function FrameworkSection({ number, title, question, children }: { number: string; title: string; question: string; children: React.ReactNode }) {
  return (
    <section className="framework-section">
      <div className="section-heading"><span>{number}</span><div><h2>{title}</h2><p>{question}</p></div></div>
      <div className="section-body">{children}</div>
    </section>
  );
}

function PillarsStep({
  values,
  onChange,
  onBack,
  onContinue,
}: {
  values: Record<PillarKey, string>;
  onChange: (id: PillarKey, value: string) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const firstIncomplete = Math.max(0, pillarMeta.findIndex(({ id }) => !values[id].trim()));
  const [openId, setOpenId] = useState<PillarKey>(pillarMeta[firstIncomplete]?.id ?? "narrative");
  return (
    <div className="guided-view entrance">
      <p className="context-label">05 · 四类设计点</p>
      <h1>让所有设计共同服务于同一个体验。</h1>
      <p className="supporting-copy">这里先定义支点，不需要写成完整 GDD。每类写下 1–3 个最关键决定。</p>
      <div className="pillar-list">
        {pillarMeta.map((pillar, index) => {
          const open = pillar.id === openId;
          const done = Boolean(values[pillar.id].trim());
          return (
            <section className={`pillar-item ${open ? "open" : ""}`} key={pillar.id}>
              <button className="pillar-heading" type="button" aria-expanded={open} onClick={() => setOpenId(pillar.id)}>
                <span className={`pillar-index ${done ? "done" : ""}`}>{done ? <Check size={13} /> : index + 1}</span>
                <span><strong>{pillar.title}</strong><small>{pillar.question}</small></span>
                {open ? <CaretDown size={18} /> : <CaretRight size={18} />}
              </button>
              {open && (
                <div className="pillar-body entrance">
                  <textarea
                    aria-label={pillar.title}
                    value={values[pillar.id]}
                    placeholder={pillar.placeholder}
                    onChange={(event) => onChange(pillar.id, event.target.value)}
                  />
                  {pillar.optional && !values[pillar.id].trim() && (
                    <button className="quick-fill" type="button" onClick={() => onChange(pillar.id, pillar.optional!)}>本作不以预设叙事为重点</button>
                  )}
                  <ReferenceHint title="参考提示与案例">
                    <ul>{pillar.examples.map((example) => <li key={example}>{example}</li>)}</ul>
                  </ReferenceHint>
                  {index < pillarMeta.length - 1 && values[pillar.id].trim() && (
                    <button className="next-pillar" type="button" onClick={() => setOpenId(pillarMeta[index + 1].id)}>
                      下一项：{pillarMeta[index + 1].title} <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              )}
            </section>
          );
        })}
      </div>
      <Navigation
        backLabel="返回设计框架"
        nextLabel="生成完整设计方案"
        disabled={!pillarMeta.every(({ id }) => values[id].trim())}
        onBack={onBack}
        onNext={onContinue}
      />
    </div>
  );
}

function SummaryStep({
  project,
  fantasy,
  xElement,
  onEdit,
}: {
  project: ProjectState;
  fantasy: Choice;
  xElement: Choice;
  onEdit: (stage: Stage) => void;
}) {
  const [copied, setCopied] = useState(false);
  const markdown = buildMarkdown(project, fantasy, xElement);

  async function copyDesign() {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function downloadDesign() {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "game-design-outline.md";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="summary-view entrance">
      <p className="context-label">06 · 游戏设计方案</p>
      <h1>{project.refine.refinedIdea}</h1>
      <p className="summary-intro">这是当前版本的设计框架。每一部分仍可返回修改，内容会继续保存在本地。</p>

      <SummarySection title="设计出发点" stage="refine" onEdit={onEdit}>
        <SummaryField label="原始想法" value={project.rawIdea} />
        <SummaryField label="核心火花" value={project.refine.spark} />
        <SummaryField label="核心行为" value={project.refine.playerAction} />
        <SummaryField label="体验承诺" value={project.refine.experience} />
      </SummarySection>

      <SummarySection title="玩家 Fantasy" stage="fantasy" onEdit={onEdit}>
        <SummaryField label={fantasy.title} value={project.fantasyStatement} />
      </SummarySection>

      <SummarySection title="核心框架" stage="framework" onEdit={onEdit}>
        <SummaryField label="类型" value={labelMany(project.genreIds, genres, project.genreCustom)} />
        <SummaryField label="目标用户" value={labelMany(project.audienceIds, audiences, project.audienceNote)} />
        <SummaryField label="体验差异化 X" value={`${xElement.title}：${project.xStatement}`} />
      </SummarySection>

      <SummarySection title="四类设计点" stage="pillars" onEdit={onEdit}>
        {pillarMeta.map((pillar) => <SummaryField key={pillar.id} label={pillar.title} value={project.pillars[pillar.id]} />)}
      </SummarySection>

      <div className="summary-actions">
        <button className="secondary-export" type="button" onClick={copyDesign}><Copy size={17} /> {copied ? "已复制" : "复制 Markdown"}</button>
        <button className="primary-button inline" type="button" onClick={downloadDesign}><DownloadSimple size={17} /> 下载设计方案</button>
      </div>
    </div>
  );
}

function SummarySection({ title, stage, onEdit, children }: { title: string; stage: Stage; onEdit: (stage: Stage) => void; children: React.ReactNode }) {
  return (
    <section className="summary-section">
      <div className="summary-heading"><h2>{title}</h2><button type="button" onClick={() => onEdit(stage)}><PencilSimple size={15} /> 修改</button></div>
      {children}
    </section>
  );
}

function SummaryField({ label, value }: { label: string; value: string }) {
  return <div className="summary-field"><span>{label}</span><p>{value}</p></div>;
}

function Navigation({
  backLabel,
  nextLabel,
  disabled,
  onBack,
  onNext,
}: {
  backLabel: string;
  nextLabel: string;
  disabled: boolean;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="bottom-actions">
      <button className="back-button" type="button" onClick={onBack}><CaretLeft size={15} /> {backLabel}</button>
      <button className="primary-button inline" type="button" disabled={disabled} onClick={onNext}>{nextLabel} <ArrowRight size={15} /></button>
    </div>
  );
}

function ReferenceHint({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="reference-hint">
      <summary><span><Lightbulb size={16} /> {title}</span><CaretDown className="hint-caret" size={15} /></summary>
      <div className="reference-content">{children}</div>
    </details>
  );
}

function PanelHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return <div className="panel-header"><h2>{title}</h2><button type="button" aria-label={`关闭${title}`} onClick={onClose}><X size={16} /></button></div>;
}

function StateItem({ label, empty, children }: { label: string; empty: string; children: React.ReactNode }) {
  return <div className="state-item"><span>{label}</span><p className={children ? "" : "empty"}>{children || empty}</p></div>;
}

function toggle(values: string[], id: string) {
  return values.includes(id) ? values.filter((value) => value !== id) : [...values, id];
}

function labelMany(ids: string[], options: readonly (readonly [string, string])[], custom: string) {
  return [...ids.map((id) => options.find(([value]) => value === id)?.[1]).filter(Boolean), custom.trim()].filter(Boolean).join("、");
}

function buildMarkdown(project: ProjectState, fantasy: Choice, xElement: Choice) {
  const pillarLines = pillarMeta.map((pillar) => `### ${pillar.title}\n\n${project.pillars[pillar.id]}`).join("\n\n");
  return `# 游戏设计方案\n\n## 一句话想法\n\n${project.refine.refinedIdea}\n\n## 设计出发点\n\n- 原始想法：${project.rawIdea}\n- 核心火花：${project.refine.spark}\n- 核心行为：${project.refine.playerAction}\n- 体验承诺：${project.refine.experience}\n\n## 核心框架\n\n- 类型：${labelMany(project.genreIds, genres, project.genreCustom)}\n- 玩家 Fantasy：${fantasy.title} — ${project.fantasyStatement}\n- 目标用户：${labelMany(project.audienceIds, audiences, project.audienceNote)}\n- 体验差异化 X：${xElement.title} — ${project.xStatement}\n\n## 四类设计点\n\n${pillarLines}\n`;
}
