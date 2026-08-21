"use client";

import { useEffect, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import {
  ArrowCounterClockwise,
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  Check,
  Copy,
  DownloadSimple,
  FloppyDisk,
  PencilSimple,
  UploadSimple,
  X,
} from "@phosphor-icons/react";
import {
  buildMarkdown,
  emptyProject,
  hasStepContent,
  LEGACY_STORAGE_KEY,
  migrateLegacyProject,
  normalizeProject,
  parseMarkdownProject,
  STORAGE_KEY,
  TETRAD_RELATION_LABEL,
  type ProjectState,
  type TetradKey,
} from "./creator-engine-model";
import { creationSteps, stepMap, type StepId } from "./creator-engine-nodes";
import { tetradReferenceGames } from "./creator-engine-tetrad-references";

declare global {
  interface Window {
    __CREATOR_ENGINE_SAVE_MARKDOWN__?: (file: {
      content: string;
      defaultFileName: string;
    }) => Promise<boolean>;
  }
}

type SentenceTab = "gameplay" | "experience" | "hypothesis";
type PlayerTab = "firstLook" | "firstTen" | "arc";
type ReferenceContent = { title: string; body: ReactNode };

const tetradMeta: Array<{ id: TetradKey; label: string }> = [
  { id: "narrative", label: "叙事" },
  { id: "mechanics", label: "机制" },
  { id: "aesthetics", label: "美学" },
  { id: "technology", label: "技术" },
];

const sentenceMeta: Array<{ id: SentenceTab; label: string; title: string }> = [
  { id: "gameplay", label: "什么游戏", title: "一句话说明：什么游戏？" },
  { id: "experience", label: "什么体验", title: "一句话：什么体验" },
  { id: "hypothesis", label: "如何验证", title: "一句话：体验如何可行？" },
];

const playerMeta: Array<{ id: PlayerTab; label: string }> = [
  { id: "firstLook", label: "第一句话" },
  { id: "firstTen", label: "第二句话" },
  { id: "arc", label: "第三句话" },
];

const sentenceOrder: SentenceTab[] = ["gameplay", "experience", "hypothesis"];
const tetradOrder: TetradKey[] = ["narrative", "mechanics", "aesthetics", "technology"];
const playerOrder: PlayerTab[] = ["firstLook", "firstTen", "arc"];

const references: Partial<Record<StepId, ReferenceContent>> = {
  idea: {
    title: "最初想法参考",
    body: <ExampleList items={[
      ["动作火花", "玩家用一根会弯曲的钓线，在风暴里的高楼之间摆荡和救人。"],
      ["画面火花", "一座每天清晨都会重组街道的城市，居民靠在门上留下粉笔记号生活。"],
      ["关系火花", "两名玩家看见不同的世界规则，只能靠描述帮助对方通过同一空间。"],
      ["世界条件", "所有物品一旦被命名就会永久改变用途，玩家必须谨慎使用语言。"],
      ["情绪火花", "玩家照料一只注定会离开的生物，告别越近，它学会的能力越强。"],
      ["结构火花", "每次失败都会让关卡更容易，却也会让最终结局失去一部分可能性。"],
    ]} />,
  },
  sentences: {
    title: "三句话参考",
    body: <><p>以下 10 款游戏与四大支柱保持相同顺序，每款都分别示范“什么游戏、什么体验、如何验证”。</p><SentenceReferenceExamples /></>,
  },
  player: {
    title: "游戏侧构思参考",
    body: <><p>以下 10 款游戏与三句话、四大支柱保持相同顺序，每款都分别示范玩家看到游戏、体验十分钟和进入中后期时的变化。</p><PlayerReferenceExamples /></>,
  },
};

const tetradReferences: Record<TetradKey, ReferenceContent> = {
  narrative: {
    title: "叙事支柱参考",
    body: <><p>基础框架只写一个简短的叙事主题或类型短语，再说明它如何分别对另外三根支柱形成指导、支持或要求。以下 10 款游戏与其他支柱保持相同顺序，便于横向比较。</p><TetradReferenceExamples pillar="narrative" /></>,
  },
  mechanics: {
    title: "机制支柱参考",
    body: <><p>基础框架只写一个简短的玩法类型或核心机制短语，再说明它如何分别对另外三根支柱形成指导、支持或要求。以下 10 款游戏与其他支柱保持相同顺序，便于横向比较。</p><TetradReferenceExamples pillar="mechanics" /></>,
  },
  aesthetics: {
    title: "美学支柱参考",
    body: <><p>基础框架只写一个简短的视觉、听觉或整体风格短语，再说明它如何分别对另外三根支柱形成指导、支持或要求。以下 10 款游戏与其他支柱保持相同顺序，便于横向比较。</p><TetradReferenceExamples pillar="aesthetics" /></>,
  },
  technology: {
    title: "技术支柱参考",
    body: <><p>基础框架只写一个简短的引擎、平台或关键技术方案短语，再说明它如何分别对另外三根支柱形成指导、支持或要求。以下 10 款游戏与其他支柱保持相同顺序，便于横向比较。</p><TetradReferenceExamples pillar="technology" /></>,
  },
};

export function CreatorEngine() {
  const [project, setProject] = useState<ProjectState>(() => emptyProject());
  const [hydrated, setHydrated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [referenceOpen, setReferenceOpen] = useState<ReferenceContent | null>(null);
  const [activeSentence, setActiveSentence] = useState<SentenceTab>("gameplay");
  const [activeTetrad, setActiveTetrad] = useState<TetradKey>("narrative");
  const [activePlayer, setActivePlayer] = useState<PlayerTab>("firstLook");
  const [loadNotice, setLoadNotice] = useState("");
  const loadInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
        if (saved) setProject(normalizeProject(JSON.parse(saved)));
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

  const current = stepMap[project.currentStep];
  const progress = project.currentStep === "welcome" ? 0 : Math.round((current.index / creationSteps.length) * 100);
  const currentReference = project.currentStep === "tetrad" ? tetradReferences[activeTetrad] : references[project.currentStep];

  function edit(updater: (current: ProjectState) => ProjectState) {
    setProject((currentProject) => ({ ...updater(currentProject), updatedAt: new Date().toISOString() }));
  }

  function go(step: StepId, position: "first" | "last" = "first") {
    if (step === "sentences") setActiveSentence(position === "last" ? sentenceOrder.at(-1)! : sentenceOrder[0]);
    if (step === "tetrad") setActiveTetrad(position === "last" ? tetradOrder.at(-1)! : tetradOrder[0]);
    if (step === "player") setActivePlayer(position === "last" ? playerOrder.at(-1)! : playerOrder[0]);
    setProject((currentProject) => ({ ...currentProject, currentStep: step, updatedAt: new Date().toISOString() }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function advanceWithin<T>(order: T[], active: T, setActive: (value: T) => void) {
    const index = order.indexOf(active);
    if (index < order.length - 1) {
      setActive(order[index + 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return true;
    }
    return false;
  }

  function retreatWithin<T>(order: T[], active: T, setActive: (value: T) => void) {
    const index = order.indexOf(active);
    if (index > 0) {
      setActive(order[index - 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return true;
    }
    return false;
  }

  function goNextPage() {
    if (project.currentStep === "idea") return go("sentences");
    if (project.currentStep === "sentences") return advanceWithin(sentenceOrder, activeSentence, setActiveSentence) || Boolean(go("tetrad"));
    if (project.currentStep === "tetrad") return advanceWithin(tetradOrder, activeTetrad, setActiveTetrad) || Boolean(go("player"));
    if (project.currentStep === "player") return advanceWithin(playerOrder, activePlayer, setActivePlayer) || Boolean(go("summary"));
  }

  function goPreviousPage() {
    if (project.currentStep === "idea") return go("welcome");
    if (project.currentStep === "sentences") return retreatWithin(sentenceOrder, activeSentence, setActiveSentence) || Boolean(go("idea"));
    if (project.currentStep === "tetrad") return retreatWithin(tetradOrder, activeTetrad, setActiveTetrad) || Boolean(go("sentences", "last"));
    if (project.currentStep === "player") return retreatWithin(playerOrder, activePlayer, setActivePlayer) || Boolean(go("tetrad", "last"));
    if (project.currentStep === "summary") return go("player", "last");
  }

  function restart() {
    if (!window.confirm("重新开始会清除这台设备上当前项目的全部填写内容，确定继续吗？")) return;
    window.localStorage.removeItem(STORAGE_KEY);
    setProject(emptyProject());
  }

  async function loadMarkdown(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const loaded = parseMarkdownProject(await file.text());
      if (hasStepContent(project, "summary") && !window.confirm("载入会替换当前项目的填写内容，确定继续吗？")) return;
      setProject({ ...loaded, updatedAt: new Date().toISOString() });
      setActiveSentence("gameplay");
      setActiveTetrad("narrative");
      setActivePlayer("firstLook");
      setLoadNotice(`已载入 ${file.name}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "无法读取这个文件";
      setLoadNotice("载入失败");
      window.alert(`载入失败：${message}`);
    }
  }

  async function copySummary() {
    await navigator.clipboard.writeText(buildMarkdown(project));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  async function downloadSummary() {
    const content = buildMarkdown(project);
    const defaultFileName = markdownFileName(project.name);

    if (window.__CREATOR_ENGINE_SAVE_MARKDOWN__) {
      try {
        await window.__CREATOR_ENGINE_SAVE_MARKDOWN__({ content, defaultFileName });
      } catch (error) {
        const message = error instanceof Error ? error.message : "无法保存这个文件";
        window.alert(`保存失败：${message}`);
      }
      return;
    }

    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = defaultFileName;
    link.click();
    URL.revokeObjectURL(url);
  }

  return <div className="ce-shell">
    <header className="ce-topbar">
      <button className="ce-brand" type="button" onClick={() => go("welcome")} aria-label="返回欢迎页">
        <span className="ce-mark">CE</span>
        <span><strong>创作引擎</strong><small>{project.name}</small></span>
      </button>
      <div className="ce-progress" aria-label={`当前步骤进度 ${progress}%`}>
        <span className="ce-progress-copy">{current.index === 0 ? "开始" : `${String(current.index).padStart(2, "0")} · ${current.short}`}</span>
        <span className="ce-progress-track"><i style={{ width: `${progress}%` }} /></span>
        <span>{progress}%</span>
      </div>
      <div className="ce-actions">
        <input ref={loadInput} className="load-input" type="file" accept=".md,text/markdown,text/plain" onChange={loadMarkdown} />
        <button className="load-button" type="button" onClick={() => loadInput.current?.click()}><UploadSimple size={18} />载入</button>
        <span className="save-state" title={loadNotice || undefined}><FloppyDisk size={17} />{loadNotice || (hydrated ? "已保存" : "读取中")}</span>
        <button type="button" onClick={restart}><ArrowCounterClockwise size={18} />重新开始</button>
      </div>
    </header>

    <aside className="ce-rail" aria-label="创作步骤">
      <div className="rail-heading"><span>FLOW</span><strong>构思步骤</strong></div>
      <ol>{creationSteps.map((step) => {
        const filled = hasStepContent(project, step.id);
        const active = step.id === project.currentStep;
        return <li key={step.id} className={`${active ? "active" : ""} ${filled ? "filled" : ""}`}>
          <button type="button" onClick={() => go(step.id)} aria-current={active ? "step" : undefined}>
            <span>{filled ? <Check size={15} weight="bold" /> : String(step.index).padStart(2, "0")}</span>
            <strong>{step.short}</strong>
            <small>{step.id === "summary" ? "汇总" : filled ? "已填" : "空"}</small>
          </button>
        </li>;
      })}</ol>
    </aside>

    <main className={`ce-main step-${project.currentStep}`}>
      {project.currentStep === "welcome" ? <Welcome project={project} edit={edit} go={go} /> :
        <article className="step-page">
          {project.currentStep !== "sentences" && <header className="step-heading"><h1>{current.title}</h1></header>}
          <div className="step-content">{renderStep(project.currentStep, project, edit, copySummary, downloadSummary, copied, {
            sentence: activeSentence,
            setSentence: setActiveSentence,
            tetrad: activeTetrad,
            setTetrad: setActiveTetrad,
            player: activePlayer,
            setPlayer: setActivePlayer,
          })}</div>
          {currentReference && <button className="reference-trigger" type="button" onClick={() => setReferenceOpen(currentReference)}><BookOpenText size={19} weight="bold" />查看参考</button>}
          <footer className="step-navigation">
            <button className="back-button" type="button" onClick={goPreviousPage}><ArrowLeft size={19} />上一步</button>
            {project.currentStep !== "summary" && <button className="next-button" type="button" onClick={goNextPage}>下一步<ArrowRight size={19} /></button>}
          </footer>
        </article>}
    </main>

    <footer className="ce-footer">作者：李欧丁，Github：<a href="https://github.com/LeoAtopos/CreatorEngine" target="_blank" rel="noreferrer">https://github.com/LeoAtopos/CreatorEngine</a></footer>

    {referenceOpen && <ReferenceModal reference={referenceOpen} onClose={() => setReferenceOpen(null)} />}
  </div>;
}

function Welcome({ project, edit, go }: StepProps & { go: (step: StepId) => void }) {
  return <section className="welcome-page">
    <h1>把游戏想法说清楚。</h1>
    <p className="welcome-subtitle">适合言语化设计习惯的制作人，以及需要强沟通同步的团队。</p>
    <label className="project-name-field"><span>项目名称</span><input value={project.name} placeholder="请输入..." onChange={(event) => edit((current) => ({ ...current, name: event.target.value }))} /></label>
    <div className="welcome-actions"><button className="hero-button" type="button" onClick={() => go("idea")}><span>开始构思</span><ArrowRight size={22} /></button></div>
  </section>;
}

type SubpageProps = {
  sentence: SentenceTab;
  setSentence: (value: SentenceTab) => void;
  tetrad: TetradKey;
  setTetrad: (value: TetradKey) => void;
  player: PlayerTab;
  setPlayer: (value: PlayerTab) => void;
};

function renderStep(step: StepId, project: ProjectState, edit: StepProps["edit"], copySummary: () => Promise<void>, downloadSummary: () => Promise<void>, copied: boolean, subpage: SubpageProps) {
  switch (step) {
    case "idea": return <IdeaStep project={project} edit={edit} />;
    case "sentences": return <SentenceTabsStep project={project} edit={edit} active={subpage.sentence} setActive={subpage.setSentence} />;
    case "tetrad": return <TetradStep project={project} edit={edit} active={subpage.tetrad} setActive={subpage.setTetrad} />;
    case "player": return <PlayerStep project={project} edit={edit} active={subpage.player} setActive={subpage.setPlayer} />;
    case "summary": return <SummaryStep project={project} edit={edit} copySummary={copySummary} downloadSummary={downloadSummary} copied={copied} />;
    default: return null;
  }
}

function IdeaStep({ project, edit }: StepProps) {
  return <label className="large-field"><span>最初想法</span><textarea value={project.rawIdea} onChange={(event) => edit((current) => ({ ...current, rawIdea: event.target.value }))} placeholder="请输入..." /></label>;
}

function SentenceTabsStep({ project, edit, active, setActive }: StepProps & { active: SentenceTab; setActive: (value: SentenceTab) => void }) {
  const meta = sentenceMeta.find((item) => item.id === active)!;
  return <div className="compact-workspace sentence-workspace">
    <Tabs label="三句话">{sentenceMeta.map((item) => <Tab key={item.id} active={active === item.id} label={item.label} status={hasSentenceContent(project, item.id) ? "已填" : "空"} onClick={() => setActive(item.id)} />)}</Tabs>
    <section className="sentence-panel">
      <h1>{meta.title}</h1>
      {active === "gameplay" && <>
        <LiveSentence>{gameplayPreview(project)}</LiveSentence>
        <div className="sentence-fields"><TextField label="身份" value={project.gameplay.identity} onChange={(value) => updateRecord(edit, "gameplay", "identity", value)} /><TextField label="核心动作" value={project.gameplay.verb} onChange={(value) => updateRecord(edit, "gameplay", "verb", value)} /><TextField label="目标" value={project.gameplay.goal} onChange={(value) => updateRecord(edit, "gameplay", "goal", value)} /><TextField label="约束或反转" value={project.gameplay.constraint} onChange={(value) => updateRecord(edit, "gameplay", "constraint", value)} /></div>
      </>}
      {active === "experience" && <>
        <LiveSentence>{experiencePreview(project)}</LiveSentence>
        <div className="sentence-fields"><TextField label="目标玩家" value={project.experience.audience} onChange={(value) => updateRecord(edit, "experience", "audience", value)} /><TextField label="核心感受" value={project.experience.feeling} onChange={(value) => updateRecord(edit, "experience", "feeling", value)} /><TextField label="关键动态" value={project.experience.dynamic} onChange={(value) => updateRecord(edit, "experience", "dynamic", value)} /><TextField label="不依赖的常规方案" value={project.experience.alternative} onChange={(value) => updateRecord(edit, "experience", "alternative", value)} /></div>
      </>}
      {active === "hypothesis" && <>
        <LiveSentence>{hypothesisPreview(project)}</LiveSentence>
        <div className="sentence-fields"><TextField label="执行的机制" value={project.hypothesis.mechanism} onChange={(value) => updateRecord(edit, "hypothesis", "mechanism", value)} /><TextField label="产生的行为或策略" value={project.hypothesis.behavior} onChange={(value) => updateRecord(edit, "hypothesis", "behavior", value)} /><TextField label="目标体验" value={project.hypothesis.experience} onChange={(value) => updateRecord(edit, "hypothesis", "experience", value)} /><TextField label="可观察信号" value={project.hypothesis.signal} onChange={(value) => updateRecord(edit, "hypothesis", "signal", value)} /></div>
      </>}
    </section>
  </div>;
}

function TetradStep({ project, edit, active, setActive }: StepProps & { active: TetradKey; setActive: (value: TetradKey) => void }) {
  const dimension = tetradMeta.find((item) => item.id === active)!;
  return <div className="compact-workspace">
    <Tabs label="游戏设计四大支柱">{tetradMeta.map((item) => <Tab key={item.id} active={active === item.id} label={item.label} status={hasDimensionContent(project, item.id) ? "已填" : "空"} onClick={() => setActive(item.id)} />)}</Tabs>
    <section className="compact-panel">
      <TextField label={`${dimension.label}的基础框架（简短短语）`} placeholder={foundationPlaceholder(dimension.id)} value={project.tetrad[dimension.id].foundation} onChange={(value) => updateTetrad(edit, dimension.id, "foundation", value)} />
      <TextAreaField label={`${dimension.label}的风格特点`} value={project.tetrad[dimension.id].signature} onChange={(value) => updateTetrad(edit, dimension.id, "signature", value)} />
      {tetradMeta.filter((target) => target.id !== dimension.id).map((target) => <TextAreaField key={target.id} label={`${dimension.label}对${target.label}的${TETRAD_RELATION_LABEL}`} value={project.tetrad[dimension.id].support[target.id]} onChange={(value) => updateTetradSupport(edit, dimension.id, target.id, value)} />)}
    </section>
  </div>;
}

function PlayerStep({ project, edit, active, setActive }: StepProps & { active: PlayerTab; setActive: (value: PlayerTab) => void }) {
  return <div className="compact-workspace">
    <Tabs label="游戏侧三句话">{playerMeta.map((item) => <Tab key={item.id} active={active === item.id} label={item.label} status={hasPlayerSectionContent(project, item.id) ? "已填" : "空"} onClick={() => setActive(item.id)} />)}</Tabs>
    <section className="sentence-panel player-sentence-panel">
      {active === "firstLook" && <><LiveSentence>{playerFirstPreview(project)}</LiveSentence><div className="sentence-fields"><TextField label="主题" value={project.player.firstLook.theme} onChange={(value) => updatePlayer(edit, "firstLook", "theme", value)} /><TextField label="游戏类型" value={project.player.firstLook.genre} onChange={(value) => updatePlayer(edit, "firstLook", "genre", value)} /><TextField label="关联游戏" value={project.player.firstLook.references} onChange={(value) => updatePlayer(edit, "firstLook", "references", value)} /><TextField label="体验预期" value={project.player.firstLook.expectation} onChange={(value) => updatePlayer(edit, "firstLook", "expectation", value)} /></div></>}
      {active === "firstTen" && <><LiveSentence>{playerTenPreview(project)}</LiveSentence><div className="sentence-fields"><TextField label="会 / 不会" value={project.player.firstTen.fulfilment} onChange={(value) => updatePlayer(edit, "firstTen", "fulfilment", value)} /><TextField label="还能 / 而是" value={project.player.firstTen.outcome} onChange={(value) => updatePlayer(edit, "firstTen", "outcome", value)} /><TextField label="独特体验" value={project.player.firstTen.uniqueExperience} onChange={(value) => updatePlayer(edit, "firstTen", "uniqueExperience", value)} /><TextField label="目标 / 期待" value={project.player.firstTen.nextGoal} onChange={(value) => updatePlayer(edit, "firstTen", "nextGoal", value)} /></div></>}
      {active === "arc" && <><LiveSentence>{playerArcPreview(project)}</LiveSentence><div className="sentence-fields"><TextField label="机制 / 内容" value={project.player.arc.source} onChange={(value) => updatePlayer(edit, "arc", "source", value)} /><TextField label="游戏体验" value={project.player.arc.finale} onChange={(value) => updatePlayer(edit, "arc", "finale", value)} /></div></>}
    </section>
  </div>;
}

function SummaryStep({ project, edit, copySummary, downloadSummary, copied }: StepProps & { copySummary: () => Promise<void>; downloadSummary: () => Promise<void>; copied: boolean }) {
  const [editing, setEditing] = useState(false);
  return <div className="summary-layout">
    <div className="summary-actions">
      <button className={editing ? "primary" : ""} type="button" onClick={() => setEditing((value) => !value)}>{editing ? <Check size={18} /> : <PencilSimple size={18} />}{editing ? "完成" : "编辑"}</button>
      <button type="button" onClick={copySummary}>{copied ? <Check size={18} /> : <Copy size={18} />}{copied ? "已复制" : "复制"}</button>
      <button type="button" onClick={() => void downloadSummary()}><DownloadSimple size={18} />下载</button>
    </div>
    {editing ? <SummaryEditor project={project} edit={edit} /> : <SummaryReadView project={project} />}
  </div>;
}

function SummaryReadView({ project }: { project: ProjectState }) {
  return <>
    <section className="summary-section"><h2>最初想法</h2><p>{display(project.rawIdea)}</p></section>
    <section className="summary-section"><h2>三句话</h2><Statement label="一句话说明：什么游戏？">{gameplayPreview(project, "（空）")}</Statement><Statement label="一句话：什么体验">{experiencePreview(project, "（空）")}</Statement><Statement label="一句话：体验如何可行？">{hypothesisPreview(project, "（空）")}</Statement></section>
    <section className="summary-section"><h2>游戏设计四大支柱</h2><div className="summary-tetrad">{tetradMeta.map((meta) => <article key={meta.id}><strong>{meta.label}</strong><p>{display(project.tetrad[meta.id].foundation)}</p><p>{display(project.tetrad[meta.id].signature)}</p><div className="summary-support">{tetradMeta.filter((target) => target.id !== meta.id).map((target) => <small key={target.id}><b>{meta.label}对{target.label}的{TETRAD_RELATION_LABEL}：</b>{display(project.tetrad[meta.id].support[target.id])}</small>)}</div></article>)}</div></section>
    <section className="summary-section"><h2>游戏侧构思</h2><div className="summary-journey"><article><b>第一句话</b><p>{playerFirstPreview(project, "（空）")}</p></article><article><b>第二句话</b><p>{playerTenPreview(project, "（空）")}</p></article><article><b>第三句话</b><p>{playerArcPreview(project, "（空）")}</p></article></div></section>
  </>;
}

function SummaryEditor({ project, edit }: StepProps) {
  return <div className="summary-editor">
    <section className="summary-edit-section"><h2>最初想法</h2><TextAreaField label="最初想法" value={project.rawIdea} onChange={(value) => edit((current) => ({ ...current, rawIdea: value }))} /></section>
    <section className="summary-edit-section"><h2>三句话</h2>
      <EditSentenceBlock title="一句话说明：什么游戏？" preview={gameplayPreview(project)}><TextField label="身份" value={project.gameplay.identity} onChange={(value) => updateRecord(edit, "gameplay", "identity", value)} /><TextField label="核心动作" value={project.gameplay.verb} onChange={(value) => updateRecord(edit, "gameplay", "verb", value)} /><TextField label="目标" value={project.gameplay.goal} onChange={(value) => updateRecord(edit, "gameplay", "goal", value)} /><TextField label="约束或反转" value={project.gameplay.constraint} onChange={(value) => updateRecord(edit, "gameplay", "constraint", value)} /></EditSentenceBlock>
      <EditSentenceBlock title="一句话：什么体验" preview={experiencePreview(project)}><TextField label="目标玩家" value={project.experience.audience} onChange={(value) => updateRecord(edit, "experience", "audience", value)} /><TextField label="核心感受" value={project.experience.feeling} onChange={(value) => updateRecord(edit, "experience", "feeling", value)} /><TextField label="关键动态" value={project.experience.dynamic} onChange={(value) => updateRecord(edit, "experience", "dynamic", value)} /><TextField label="不依赖的常规方案" value={project.experience.alternative} onChange={(value) => updateRecord(edit, "experience", "alternative", value)} /></EditSentenceBlock>
      <EditSentenceBlock title="一句话：体验如何可行？" preview={hypothesisPreview(project)}><TextField label="执行的机制" value={project.hypothesis.mechanism} onChange={(value) => updateRecord(edit, "hypothesis", "mechanism", value)} /><TextField label="产生的行为或策略" value={project.hypothesis.behavior} onChange={(value) => updateRecord(edit, "hypothesis", "behavior", value)} /><TextField label="目标体验" value={project.hypothesis.experience} onChange={(value) => updateRecord(edit, "hypothesis", "experience", value)} /><TextField label="可观察信号" value={project.hypothesis.signal} onChange={(value) => updateRecord(edit, "hypothesis", "signal", value)} /></EditSentenceBlock>
    </section>
    <section className="summary-edit-section"><h2>游戏设计四大支柱</h2><div className="summary-edit-pillars">{tetradMeta.map((meta) => <div className="summary-edit-card" key={meta.id}><h3>{meta.label}</h3><TextField label="基础框架（简短短语）" placeholder={foundationPlaceholder(meta.id)} value={project.tetrad[meta.id].foundation} onChange={(value) => updateTetrad(edit, meta.id, "foundation", value)} /><TextAreaField label="风格特点" value={project.tetrad[meta.id].signature} onChange={(value) => updateTetrad(edit, meta.id, "signature", value)} />{tetradMeta.filter((target) => target.id !== meta.id).map((target) => <TextAreaField key={target.id} label={`${meta.label}对${target.label}的${TETRAD_RELATION_LABEL}`} value={project.tetrad[meta.id].support[target.id]} onChange={(value) => updateTetradSupport(edit, meta.id, target.id, value)} />)}</div>)}</div></section>
    <section className="summary-edit-section"><h2>游戏侧构思</h2>
      <EditSentenceBlock title="第一句话" preview={playerFirstPreview(project)}><TextField label="主题" value={project.player.firstLook.theme} onChange={(value) => updatePlayer(edit, "firstLook", "theme", value)} /><TextField label="游戏类型" value={project.player.firstLook.genre} onChange={(value) => updatePlayer(edit, "firstLook", "genre", value)} /><TextField label="关联游戏" value={project.player.firstLook.references} onChange={(value) => updatePlayer(edit, "firstLook", "references", value)} /><TextField label="体验预期" value={project.player.firstLook.expectation} onChange={(value) => updatePlayer(edit, "firstLook", "expectation", value)} /></EditSentenceBlock>
      <EditSentenceBlock title="第二句话" preview={playerTenPreview(project)}><TextField label="会 / 不会" value={project.player.firstTen.fulfilment} onChange={(value) => updatePlayer(edit, "firstTen", "fulfilment", value)} /><TextField label="还能 / 而是" value={project.player.firstTen.outcome} onChange={(value) => updatePlayer(edit, "firstTen", "outcome", value)} /><TextField label="独特体验" value={project.player.firstTen.uniqueExperience} onChange={(value) => updatePlayer(edit, "firstTen", "uniqueExperience", value)} /><TextField label="目标 / 期待" value={project.player.firstTen.nextGoal} onChange={(value) => updatePlayer(edit, "firstTen", "nextGoal", value)} /></EditSentenceBlock>
      <EditSentenceBlock title="第三句话" preview={playerArcPreview(project)}><TextField label="机制 / 内容" value={project.player.arc.source} onChange={(value) => updatePlayer(edit, "arc", "source", value)} /><TextField label="游戏体验" value={project.player.arc.finale} onChange={(value) => updatePlayer(edit, "arc", "finale", value)} /></EditSentenceBlock>
    </section>
  </div>;
}

type StepProps = { project: ProjectState; edit: (updater: (current: ProjectState) => ProjectState) => void };

function TextField({ label, value, placeholder = "请输入...", onChange }: { label: string; value: string; placeholder?: string; onChange: (value: string) => void }) {
  return <label className="field-control"><span>{label}</span><input value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} /></label>;
}

function TextAreaField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="field-control textarea-field"><span>{label}</span><textarea value={value} placeholder="请输入..." onChange={(event) => onChange(event.target.value)} /></label>;
}

function Tabs({ label, children }: { label: string; children: ReactNode }) { return <div className="mini-tabs" role="tablist" aria-label={label}>{children}</div>; }
function Tab({ active, label, status, onClick }: { active: boolean; label: string; status: string; onClick: () => void }) { return <button role="tab" aria-selected={active} className={active ? "active" : ""} type="button" onClick={onClick}><strong>{label}</strong><small>{status}</small></button>; }
function LiveSentence({ children }: { children: ReactNode }) { return <p className="live-sentence">{children}</p>; }
function Statement({ label, children }: { label: string; children: ReactNode }) { return <article className="summary-statement"><strong>{label}</strong><p>{children}</p></article>; }
function EditSentenceBlock({ title, preview, children }: { title: string; preview: ReactNode; children: ReactNode }) { return <article className="edit-sentence-block"><h3>{title}</h3><LiveSentence>{preview}</LiveSentence><div className="summary-edit-grid">{children}</div></article>; }
function DetailedExample({ title, children }: { title: string; children: ReactNode }) { return <article className="detailed-example"><h3>{title}</h3>{children}</article>; }
function ReferenceFill({ children }: { children: ReactNode }) { return <span className="reference-fill">{children}</span>; }
function SentenceReferenceExamples() {
  return <div className="detailed-examples">{tetradReferenceGames.map((game) => {
    const { gameplay, experience, hypothesis } = game.sentence;
    return <DetailedExample key={game.title} title={game.title}>
      <p><b>什么游戏：</b>玩家作为<ReferenceFill>{gameplay.identity}</ReferenceFill>，反复<ReferenceFill>{gameplay.verb}</ReferenceFill>，以<ReferenceFill>{gameplay.goal}</ReferenceFill>；但<ReferenceFill>{gameplay.constraint}</ReferenceFill>。</p>
      <p><b>什么体验：</b>为<ReferenceFill>{experience.audience}</ReferenceFill>提供<ReferenceFill>{experience.feeling}</ReferenceFill>，主要通过<ReferenceFill>{experience.dynamic}</ReferenceFill>来实现，而不是依赖<ReferenceFill>{experience.alternative}</ReferenceFill>。</p>
      <p><b>如何验证：</b>如果让玩家<ReferenceFill>{hypothesis.mechanism}</ReferenceFill>，那么他们会<ReferenceFill>{hypothesis.behavior}</ReferenceFill>，进而感到<ReferenceFill>{hypothesis.experience}</ReferenceFill>；证据是<ReferenceFill>{hypothesis.signal}</ReferenceFill>。</p>
    </DetailedExample>;
  })}</div>;
}
function PlayerReferenceExamples() {
  return <div className="detailed-examples">{tetradReferenceGames.map((game) => {
    const { firstLook, firstTen, arc } = game.player;
    return <DetailedExample key={game.title} title={game.title}>
      <p><b>第一句：</b>玩家看到游戏名称、介绍图，会认为这是一个关于<ReferenceFill>{firstLook.theme}</ReferenceFill>的<ReferenceFill>{firstLook.genre}</ReferenceFill>游戏，会和<ReferenceFill>{firstLook.references}</ReferenceFill>关联比较，并产生<ReferenceFill>{firstLook.expectation}</ReferenceFill>的预期。</p>
      <p><b>第二句：</b>玩家在体验游戏10分钟内<ReferenceFill>{firstTen.fulfilment}</ReferenceFill>获得体验预期，<ReferenceFill>{firstTen.outcome}</ReferenceFill>获得<ReferenceFill>{firstTen.uniqueExperience}</ReferenceFill>，玩家因此而不会离开游戏，并产生<ReferenceFill>{firstTen.nextGoal}</ReferenceFill>。</p>
      <p><b>第三句：</b>玩家中后期体验的变化是来自<ReferenceFill>{arc.source}</ReferenceFill>的出现，并最终在游戏结束时，获得<ReferenceFill>{arc.finale}</ReferenceFill>的终极体验。</p>
    </DetailedExample>;
  })}</div>;
}
function TetradReferenceExamples({ pillar }: { pillar: TetradKey }) {
  const source = tetradMeta.find((item) => item.id === pillar)!;
  return <div className="detailed-examples">{tetradReferenceGames.map((game) => {
    const example = game.examples[pillar];
    return <DetailedExample key={game.title} title={game.title}>
      <p><b>基础框架：</b><ReferenceFill>{example.foundation}</ReferenceFill></p>
      <p><b>风格特点：</b><ReferenceFill>{example.signature}</ReferenceFill></p>
      {tetradMeta.filter((target) => target.id !== pillar).map((target) => <p key={target.id}><b>{source.label}对{target.label}的{TETRAD_RELATION_LABEL}：</b><ReferenceFill>{example.support[target.id]}</ReferenceFill></p>)}
    </DetailedExample>;
  })}</div>;
}
function ExampleList({ items }: { items: Array<[string, string]> }) { return <div className="example-list">{items.map(([title, copy]) => <article key={title}><strong>{title}</strong><p><ReferenceFill>{copy}</ReferenceFill></p></article>)}</div>; }

function ReferenceModal({ reference, onClose }: { reference: { title: string; body: ReactNode }; onClose: () => void }) {
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [onClose]);
  return <div className="reference-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="reference-modal" role="dialog" aria-modal="true" aria-labelledby="reference-title"><header><span>参考</span><button type="button" onClick={onClose} aria-label="关闭参考"><X size={20} /></button></header><h2 id="reference-title">{reference.title}</h2><div>{reference.body}</div></section></div>;
}

function updateRecord(edit: StepProps["edit"], section: "gameplay" | "experience" | "hypothesis", field: string, value: string) { edit((current) => ({ ...current, [section]: { ...current[section], [field]: value } } as ProjectState)); }
function updateTetrad(edit: StepProps["edit"], dimension: TetradKey, field: "foundation" | "signature", value: string) { edit((current) => ({ ...current, tetrad: { ...current.tetrad, [dimension]: { ...current.tetrad[dimension], [field]: value } } })); }
function updateTetradSupport(edit: StepProps["edit"], dimension: TetradKey, target: TetradKey, value: string) { edit((current) => ({ ...current, tetrad: { ...current.tetrad, [dimension]: { ...current.tetrad[dimension], support: { ...current.tetrad[dimension].support, [target]: value } } } })); }
function updatePlayer(edit: StepProps["edit"], section: keyof ProjectState["player"], field: string, value: string) { edit((current) => ({ ...current, player: { ...current.player, [section]: { ...current.player[section], [field]: value } } } as ProjectState)); }
function hasDimensionContent(project: ProjectState, dimension: TetradKey) { const answer = project.tetrad[dimension]; return Boolean(answer.foundation.trim() || answer.signature.trim() || Object.values(answer.support).some((value) => value.trim())); }
function hasSentenceContent(project: ProjectState, section: SentenceTab) { return Object.values(project[section]).some((value) => value.trim()); }
function hasPlayerSectionContent(project: ProjectState, section: PlayerTab) {
  if (section === "firstLook") return Object.values(project.player.firstLook).some((value) => value.trim());
  if (section === "firstTen") return [project.player.firstTen.fulfilment, project.player.firstTen.outcome, project.player.firstTen.uniqueExperience, project.player.firstTen.nextGoal].some((value) => value.trim());
  return [project.player.arc.source, project.player.arc.finale].some((value) => value.trim());
}

function foundationPlaceholder(dimension: TetradKey) {
  return { narrative: "如：日式 Galgame", mechanics: "如：开放世界探索", aesthetics: "如：3D 卡通渲染", technology: "如：多平台 Unity" }[dimension];
}

function Slot({ value, empty = "______" }: { value: string; empty?: string }) {
  const text = value.trim();
  return text ? <span className="filled-slot">{text}</span> : <>{empty}</>;
}
function gameplayPreview(project: ProjectState, empty?: string) { const fill = (value: string) => <Slot value={value} empty={empty} />; return <>玩家作为{fill(project.gameplay.identity)}，反复{fill(project.gameplay.verb)}，以{fill(project.gameplay.goal)}；但{fill(project.gameplay.constraint)}。</>; }
function experiencePreview(project: ProjectState, empty?: string) { const fill = (value: string) => <Slot value={value} empty={empty} />; return <>为{fill(project.experience.audience)}提供{fill(project.experience.feeling)}，主要通过{fill(project.experience.dynamic)}来实现，而不是依赖{fill(project.experience.alternative)}。</>; }
function hypothesisPreview(project: ProjectState, empty?: string) { const fill = (value: string) => <Slot value={value} empty={empty} />; return <>如果让玩家{fill(project.hypothesis.mechanism)}，那么他们会{fill(project.hypothesis.behavior)}，进而感到{fill(project.hypothesis.experience)}；证据是{fill(project.hypothesis.signal)}。</>; }
function playerFirstPreview(project: ProjectState, empty?: string) { const fill = (value: string) => <Slot value={value} empty={empty} />; return <>玩家看到游戏名称、介绍图，会认为这是一个关于{fill(project.player.firstLook.theme)}的{fill(project.player.firstLook.genre)}游戏，会和{fill(project.player.firstLook.references)}关联比较，并产生{fill(project.player.firstLook.expectation)}的预期。</>; }
function playerTenPreview(project: ProjectState, empty?: string) { const fill = (value: string) => <Slot value={value} empty={empty} />; return <>玩家在体验游戏10分钟内{fill(project.player.firstTen.fulfilment)}获得体验预期，{fill(project.player.firstTen.outcome)}获得{fill(project.player.firstTen.uniqueExperience)}，玩家因此而不会离开游戏，并产生{fill(project.player.firstTen.nextGoal)}。</>; }
function playerArcPreview(project: ProjectState, empty?: string) { const fill = (value: string) => <Slot value={value} empty={empty} />; return <>玩家中后期体验的变化是来自{fill(project.player.arc.source)}的出现，并最终在游戏结束时，获得{fill(project.player.arc.finale)}的终极体验。</>; }
function markdownFileName(projectName: string) {
  const invalidCharacters = "<>:\"/\\|?*";
  const safeName = [...projectName.trim()]
    .map((character) => character.charCodeAt(0) < 32 || invalidCharacters.includes(character) ? "_" : character)
    .join("")
    .replace(/[. ]+$/g, "");
  return `${safeName || "游戏设计摘要"}.md`;
}
function display(value: string) { return value.trim() || "（空）"; }
