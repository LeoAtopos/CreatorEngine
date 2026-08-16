"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowCounterClockwise,
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  DownloadSimple,
  FloppyDisk,
  PencilSimple,
  X,
} from "@phosphor-icons/react";
import {
  buildMarkdown,
  emptyProject,
  experienceSentence,
  gameplaySentence,
  hasStepContent,
  hypothesisSentence,
  LEGACY_STORAGE_KEY,
  migrateLegacyProject,
  normalizeProject,
  STORAGE_KEY,
  type ProjectState,
  type TetradKey,
} from "./creator-engine-model";
import { creationSteps, nextStep, previousStep, stepMap, type StepId } from "./creator-engine-nodes";

type SentenceTab = "gameplay" | "experience" | "hypothesis";
type PlayerTab = "firstLook" | "firstTen" | "arc";

const tetradMeta: Array<{ id: TetradKey; label: string }> = [
  { id: "narrative", label: "叙事" },
  { id: "mechanics", label: "机制" },
  { id: "aesthetics", label: "美学" },
  { id: "technology", label: "技术" },
];

const sentenceMeta: Array<{ id: SentenceTab; label: string; title: string }> = [
  { id: "gameplay", label: "什么游戏", title: "一句话说明：什么游戏？" },
  { id: "experience", label: "什么体验", title: "一句话：什么体验" },
  { id: "hypothesis", label: "如何验证", title: "一句话：如何验证" },
];

const playerMeta: Array<{ id: PlayerTab; label: string }> = [
  { id: "firstLook", label: "第一句话" },
  { id: "firstTen", label: "第二句话" },
  { id: "arc", label: "第三句话" },
];

const references: Partial<Record<StepId, { title: string; body: ReactNode }>> = {
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
    body: <div className="detailed-examples">
      <DetailedExample title="《超级马里奥兄弟》">
        <p><b>什么游戏：</b>玩家作为营救公主的马里奥，反复奔跑、跳跃和踩踏敌人，以穿越关卡抵达终点；但有限时间、地形与敌人持续制造失误风险。</p>
        <p><b>什么体验：</b>为喜欢即时挑战的玩家提供从试探到熟练掌控的成就感，主要通过清晰的跳跃反馈与关卡节奏，而不是依赖数值养成。</p>
        <p><b>如何验证：</b>如果让障碍提前可见并保持跳跃反馈稳定，那么玩家会在失败后调整起跳位置，进而感到自己正在变熟练；证据是玩家能解释失败并在三次内改变策略。</p>
      </DetailedExample>
      <DetailedExample title="《俄罗斯方块》">
        <p><b>什么游戏：</b>玩家反复旋转和放置下落方块，以填满并消除横行；但空间持续缩小且速度不断加快。</p>
        <p><b>什么体验：</b>为短时游玩的玩家提供秩序建立与压力升级的专注感，主要通过形状预测和空间取舍，而不是依赖故事奖励。</p>
        <p><b>如何验证：</b>如果让玩家提前看见下一个方块，那么他们会为未来形状预留空间，进而感到计划正在生效；证据是高分玩家明显减少随机填缝。</p>
      </DetailedExample>
      <DetailedExample title="《我的世界》">
        <p><b>什么游戏：</b>玩家作为方块世界的探索者，反复采集、合成和建造，以实现自定目标；但资源、昼夜和危险生物限制行动。</p>
        <p><b>什么体验：</b>为喜欢创造和探索的玩家提供“这是我的世界”的自主感，主要通过可组合材料和开放目标，而不是依赖固定任务链。</p>
        <p><b>如何验证：</b>如果材料规则足够一致，那么玩家会自发组合系统并设定个人工程，进而感到拥有创造权；证据是玩家离开教程后仍主动制定并完成目标。</p>
      </DetailedExample>
      <DetailedExample title="《星露谷物语》">
        <p><b>什么游戏：</b>玩家作为继承农场的新居民，反复种植、经营和交往，以重建生活与社区；但每日时间、体力和季节迫使玩家取舍。</p>
        <p><b>什么体验：</b>为偏好舒缓成长的玩家提供可掌控生活的安定感，主要通过日程安排与关系积累，而不是依赖高压竞争。</p>
        <p><b>如何验证：</b>如果每天都给出多个有意义的小目标，那么玩家会形成自己的生活节奏，进而感到日常值得期待；证据是玩家能说明明天最想先做的事。</p>
      </DetailedExample>
      <DetailedExample title="《Among Us》">
        <p><b>什么游戏：</b>玩家作为船员或内鬼，反复完成任务、观察和讨论，以找出内鬼或隐藏身份；但信息不完整且发言可能欺骗。</p>
        <p><b>什么体验：</b>为朋友群体提供怀疑、表演和反转的社交戏剧，主要通过不对称信息与公开讨论，而不是依赖复杂操作。</p>
        <p><b>如何验证：</b>如果目击信息始终不完整，那么玩家会主动结盟、撒谎和质询，进而感到每局都产生独特故事；证据是结算后玩家仍会复盘关键发言。</p>
      </DetailedExample>
      <DetailedExample title="《健身环大冒险》">
        <p><b>什么游戏：</b>玩家作为冒险者，反复用身体动作移动和战斗，以推进旅程；但体力和动作标准限制连续输出。</p>
        <p><b>什么体验：</b>为想轻松运动的玩家提供“我完成了一次冒险”的积极感，主要通过动作映射和即时鼓励，而不是依赖枯燥计数。</p>
        <p><b>如何验证：</b>如果运动动作被包装成可见的战斗效果，那么玩家会为完成关卡主动坚持动作，进而感到运动有目标；证据是玩家在疲劳时仍选择完成当前战斗。</p>
      </DetailedExample>
    </div>,
  },
  tetrad: {
    title: "游戏设计四大支柱参考",
    body: <div className="detailed-examples">
      <DetailedExample title="《超级马里奥兄弟》"><p><b>叙事：</b>穿越蘑菇王国营救公主，给前进明确方向。</p><p><b>机制：</b>奔跑、跳跃、踩踏和强化状态构成核心循环。</p><p><b>美学：</b>高对比角色、积木式地形与清脆音效让危险可读。</p><p><b>技术：</b>稳定横向卷轴、碰撞和输入响应保证跳跃可信。</p></DetailedExample>
      <DetailedExample title="《塞尔达传说：旷野之息》"><p><b>叙事：</b>失忆英雄在开放世界中恢复记忆并对抗灾厄。</p><p><b>机制：</b>攀爬、滑翔、物理与元素反应支持多解法。</p><p><b>美学：</b>远景地标、天气和留白引导自主探索。</p><p><b>技术：</b>统一物理与化学系统让不同物件产生可预测组合。</p></DetailedExample>
      <DetailedExample title="《星露谷物语》"><p><b>叙事：</b>离开公司生活，在小镇重新建立归属。</p><p><b>机制：</b>农耕、采集、关系与时间管理彼此争夺每日资源。</p><p><b>美学：</b>像素季节变化和柔和音乐营造亲密日常。</p><p><b>技术：</b>持久世界状态、日历和大量事件支撑长期生活模拟。</p></DetailedExample>
      <DetailedExample title="《Portal 2》"><p><b>叙事：</b>被困实验设施的玩家在人工智能监视下逃脱。</p><p><b>机制：</b>用入口和出口重构空间、速度与因果。</p><p><b>美学：</b>洁净实验室与破败后台对照，并用视觉语言标示可交互表面。</p><p><b>技术：</b>无缝传送、物理保持和镜头处理保证空间谜题成立。</p></DetailedExample>
      <DetailedExample title="《Journey》"><p><b>叙事：</b>无名旅人朝远方山峰前进，与陌生人短暂同行。</p><p><b>机制：</b>移动、滑行、歌声与有限飞行形成无语言协作。</p><p><b>美学：</b>沙海、色彩和音乐随旅程推进表达情绪。</p><p><b>技术：</b>无缝匿名匹配与极简通信保护陌生相遇的纯粹性。</p></DetailedExample>
    </div>,
  },
  player: {
    title: "玩家测构思参考",
    body: <div className="detailed-examples">
      <DetailedExample title="《超级马里奥兄弟》"><p><b>第一句：</b>玩家看到水管、蘑菇和马里奥，会认为这是平台跳跃游戏，并期待轻快闯关。</p><p><b>第二句：</b>十分钟内，玩家会兑现跳跃闯关预期，还能获得发现隐藏砖块与成长状态的惊喜，并产生抵达下一座城堡的目标。</p><p><b>第三句：</b>中后期变化来自移动平台、水下关和更强敌人，结尾获得熟练穿越高压关卡的终极体验。</p></DetailedExample>
      <DetailedExample title="《俄罗斯方块》"><p><b>第一句：</b>玩家看到几何方块和井口，会认为这是空间整理益智游戏，并期待消除带来的整洁感。</p><p><b>第二句：</b>十分钟内，玩家会兑现拼合消除预期，还会获得为长条预留空间的策略感，并产生刷新最高分的目标。</p><p><b>第三句：</b>中后期变化来自速度提升与堆叠压力，结尾获得在失控边缘维持秩序的终极体验。</p></DetailedExample>
      <DetailedExample title="《我的世界》"><p><b>第一句：</b>玩家看到方块世界，会认为这是建造与生存游戏，并联想到乐高式自由创造。</p><p><b>第二句：</b>十分钟内，玩家会获得采集与搭建预期，还会经历夜晚降临带来的生存压力，并产生建造安全住所的目标。</p><p><b>第三句：</b>中后期变化来自稀有材料、自动化与异世界，结尾获得“这个世界由我塑造”的终极体验。</p></DetailedExample>
      <DetailedExample title="《星露谷物语》"><p><b>第一句：</b>玩家看到农场与小镇居民，会认为这是轻松经营生活游戏，并期待治愈与成长。</p><p><b>第二句：</b>十分钟内，玩家会获得播种经营预期，还会发现时间和体力带来的日程取舍，并产生迎接第一次收获的目标。</p><p><b>第三句：</b>中后期变化来自季节、关系和社区工程，结尾获得在小镇建立归属的终极体验。</p></DetailedExample>
      <DetailedExample title="《Among Us》"><p><b>第一句：</b>玩家看到太空船员和任务场景，会认为这是多人合作游戏，并期待共同修复飞船。</p><p><b>第二句：</b>十分钟内，玩家不会只获得合作预期，而会获得互相怀疑与身份表演的独特体验，并产生证明自己或操纵投票的目标。</p><p><b>第三句：</b>中后期变化来自人员减少和证词累积，结尾获得真相揭晓与集体复盘的终极体验。</p></DetailedExample>
    </div>,
  },
};

export function CreatorEngine() {
  const [project, setProject] = useState<ProjectState>(() => emptyProject());
  const [hydrated, setHydrated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [referenceOpen, setReferenceOpen] = useState<StepId | null>(null);

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

  function edit(updater: (current: ProjectState) => ProjectState) {
    setProject((currentProject) => ({ ...updater(currentProject), updatedAt: new Date().toISOString() }));
  }

  function go(step: StepId) {
    setProject((currentProject) => ({ ...currentProject, currentStep: step, updatedAt: new Date().toISOString() }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function restart() {
    if (!window.confirm("重新开始会清除这台设备上当前项目的全部填写内容，确定继续吗？")) return;
    window.localStorage.removeItem(STORAGE_KEY);
    setProject(emptyProject());
  }

  async function copySummary() {
    await navigator.clipboard.writeText(buildMarkdown(project));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function downloadSummary() {
    const blob = new Blob([buildMarkdown(project)], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${project.name || "游戏设计摘要"}.md`;
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
        <span className="save-state"><FloppyDisk size={17} />{hydrated ? "已保存" : "读取中"}</span>
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
          <div className="step-content">{renderStep(project.currentStep, project, edit, copySummary, downloadSummary, copied)}</div>
          {references[project.currentStep] && <button className="reference-trigger" type="button" onClick={() => setReferenceOpen(project.currentStep)}>参考</button>}
          <footer className="step-navigation">
            <button className="back-button" type="button" onClick={() => go(previousStep(project.currentStep))}><ArrowLeft size={19} />上一步</button>
            {project.currentStep !== "summary" && <button className="next-button" type="button" onClick={() => go(nextStep(project.currentStep))}>下一步<ArrowRight size={19} /></button>}
          </footer>
        </article>}
    </main>

    {referenceOpen && references[referenceOpen] && <ReferenceModal reference={references[referenceOpen]!} onClose={() => setReferenceOpen(null)} />}
  </div>;
}

function Welcome({ project, edit, go }: StepProps & { go: (step: StepId) => void }) {
  return <section className="welcome-page">
    <h1>把游戏想法说清楚。</h1>
    <label className="project-name-field"><span>项目名称</span><input value={project.name} placeholder="请输入..." onChange={(event) => edit((current) => ({ ...current, name: event.target.value }))} /></label>
    <div className="welcome-actions"><button className="hero-button" type="button" onClick={() => go("idea")}><span>开始构思</span><ArrowRight size={22} /></button></div>
  </section>;
}

function renderStep(step: StepId, project: ProjectState, edit: StepProps["edit"], copySummary: () => Promise<void>, downloadSummary: () => void, copied: boolean) {
  switch (step) {
    case "idea": return <IdeaStep project={project} edit={edit} />;
    case "sentences": return <SentenceTabsStep project={project} edit={edit} />;
    case "tetrad": return <TetradStep project={project} edit={edit} />;
    case "player": return <PlayerStep project={project} edit={edit} />;
    case "summary": return <SummaryStep project={project} edit={edit} copySummary={copySummary} downloadSummary={downloadSummary} copied={copied} />;
    default: return null;
  }
}

function IdeaStep({ project, edit }: StepProps) {
  return <label className="large-field"><span>最初想法</span><textarea value={project.rawIdea} onChange={(event) => edit((current) => ({ ...current, rawIdea: event.target.value }))} placeholder="请输入..." /></label>;
}

function SentenceTabsStep({ project, edit }: StepProps) {
  const [active, setActive] = useState<SentenceTab>("gameplay");
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

function TetradStep({ project, edit }: StepProps) {
  const [active, setActive] = useState<TetradKey>("narrative");
  const dimension = tetradMeta.find((item) => item.id === active)!;
  return <div className="compact-workspace">
    <Tabs label="游戏设计四大支柱">{tetradMeta.map((item) => <Tab key={item.id} active={active === item.id} label={item.label} status={hasDimensionContent(project, item.id) ? "已填" : "空"} onClick={() => setActive(item.id)} />)}</Tabs>
    <section className="compact-panel">
      <TextAreaField label={`${dimension.label}的基础框架`} value={project.tetrad[dimension.id].foundation} onChange={(value) => updateTetrad(edit, dimension.id, "foundation", value)} />
      <TextAreaField label={`${dimension.label}的独特特点`} value={project.tetrad[dimension.id].signature} onChange={(value) => updateTetrad(edit, dimension.id, "signature", value)} />
      <TextAreaField label={`${dimension.label}如何支持其他支柱`} value={project.tetrad[dimension.id].support} onChange={(value) => updateTetrad(edit, dimension.id, "support", value)} />
    </section>
  </div>;
}

function PlayerStep({ project, edit }: StepProps) {
  const [active, setActive] = useState<PlayerTab>("firstLook");
  return <div className="compact-workspace">
    <Tabs label="玩家测三句话">{playerMeta.map((item) => <Tab key={item.id} active={active === item.id} label={item.label} status={hasPlayerSectionContent(project, item.id) ? "已填" : "空"} onClick={() => setActive(item.id)} />)}</Tabs>
    <section className="sentence-panel player-sentence-panel">
      {active === "firstLook" && <><LiveSentence>{playerFirstPreview(project)}</LiveSentence><div className="sentence-fields"><TextField label="主题" value={project.player.firstLook.theme} onChange={(value) => updatePlayer(edit, "firstLook", "theme", value)} /><TextField label="游戏类型" value={project.player.firstLook.genre} onChange={(value) => updatePlayer(edit, "firstLook", "genre", value)} /><TextField label="关联游戏" value={project.player.firstLook.references} onChange={(value) => updatePlayer(edit, "firstLook", "references", value)} /><TextField label="体验预期" value={project.player.firstLook.expectation} onChange={(value) => updatePlayer(edit, "firstLook", "expectation", value)} /></div></>}
      {active === "firstTen" && <><LiveSentence>{playerTenPreview(project)}</LiveSentence><div className="sentence-fields"><TextField label="会 / 不会" value={project.player.firstTen.fulfilment} onChange={(value) => updatePlayer(edit, "firstTen", "fulfilment", value)} /><TextField label="还能 / 而是" value={project.player.firstTen.outcome} onChange={(value) => updatePlayer(edit, "firstTen", "outcome", value)} /><TextField label="独特体验" value={project.player.firstTen.uniqueExperience} onChange={(value) => updatePlayer(edit, "firstTen", "uniqueExperience", value)} /><TextField label="目标 / 期待" value={project.player.firstTen.nextGoal} onChange={(value) => updatePlayer(edit, "firstTen", "nextGoal", value)} /></div></>}
      {active === "arc" && <><LiveSentence>{playerArcPreview(project)}</LiveSentence><div className="sentence-fields"><TextField label="机制 / 内容" value={project.player.arc.source} onChange={(value) => updatePlayer(edit, "arc", "source", value)} /><TextField label="游戏体验" value={project.player.arc.finale} onChange={(value) => updatePlayer(edit, "arc", "finale", value)} /></div></>}
    </section>
  </div>;
}

function SummaryStep({ project, edit, copySummary, downloadSummary, copied }: StepProps & { copySummary: () => Promise<void>; downloadSummary: () => void; copied: boolean }) {
  const [editing, setEditing] = useState(false);
  return <div className="summary-layout">
    <div className="summary-actions">
      <button className={editing ? "primary" : ""} type="button" onClick={() => setEditing((value) => !value)}>{editing ? <Check size={18} /> : <PencilSimple size={18} />}{editing ? "完成" : "编辑"}</button>
      <button type="button" onClick={copySummary}>{copied ? <Check size={18} /> : <Copy size={18} />}{copied ? "已复制" : "复制"}</button>
      <button type="button" onClick={downloadSummary}><DownloadSimple size={18} />下载</button>
    </div>
    {editing ? <SummaryEditor project={project} edit={edit} /> : <SummaryReadView project={project} />}
  </div>;
}

function SummaryReadView({ project }: { project: ProjectState }) {
  return <>
    <section className="summary-section"><h2>最初想法</h2><p>{display(project.rawIdea)}</p></section>
    <section className="summary-section"><h2>三句话</h2><Statement label="一句话说明：什么游戏？">{gameplaySentence(project)}</Statement><Statement label="一句话：什么体验">{experienceSentence(project)}</Statement><Statement label="一句话：如何验证">{hypothesisSentence(project)}</Statement></section>
    <section className="summary-section"><h2>游戏设计四大支柱</h2><div className="summary-tetrad">{tetradMeta.map((meta) => <article key={meta.id}><strong>{meta.label}</strong><p>{display(project.tetrad[meta.id].foundation)}</p><p>{display(project.tetrad[meta.id].signature)}</p><small>{display(project.tetrad[meta.id].support)}</small></article>)}</div></section>
    <section className="summary-section"><h2>玩家测构思</h2><div className="summary-journey"><article><b>第一句话</b><p>{playerFirstPreview(project, "（空）")}</p></article><article><b>第二句话</b><p>{playerTenPreview(project, "（空）")}</p></article><article><b>第三句话</b><p>{playerArcPreview(project, "（空）")}</p></article></div></section>
  </>;
}

function SummaryEditor({ project, edit }: StepProps) {
  return <div className="summary-editor">
    <section className="summary-edit-section"><h2>最初想法</h2><TextAreaField label="最初想法" value={project.rawIdea} onChange={(value) => edit((current) => ({ ...current, rawIdea: value }))} /></section>
    <section className="summary-edit-section"><h2>三句话</h2>
      <EditSentenceBlock title="一句话说明：什么游戏？" preview={gameplayPreview(project)}><TextField label="身份" value={project.gameplay.identity} onChange={(value) => updateRecord(edit, "gameplay", "identity", value)} /><TextField label="核心动作" value={project.gameplay.verb} onChange={(value) => updateRecord(edit, "gameplay", "verb", value)} /><TextField label="目标" value={project.gameplay.goal} onChange={(value) => updateRecord(edit, "gameplay", "goal", value)} /><TextField label="约束或反转" value={project.gameplay.constraint} onChange={(value) => updateRecord(edit, "gameplay", "constraint", value)} /></EditSentenceBlock>
      <EditSentenceBlock title="一句话：什么体验" preview={experiencePreview(project)}><TextField label="目标玩家" value={project.experience.audience} onChange={(value) => updateRecord(edit, "experience", "audience", value)} /><TextField label="核心感受" value={project.experience.feeling} onChange={(value) => updateRecord(edit, "experience", "feeling", value)} /><TextField label="关键动态" value={project.experience.dynamic} onChange={(value) => updateRecord(edit, "experience", "dynamic", value)} /><TextField label="不依赖的常规方案" value={project.experience.alternative} onChange={(value) => updateRecord(edit, "experience", "alternative", value)} /></EditSentenceBlock>
      <EditSentenceBlock title="一句话：如何验证" preview={hypothesisPreview(project)}><TextField label="执行的机制" value={project.hypothesis.mechanism} onChange={(value) => updateRecord(edit, "hypothesis", "mechanism", value)} /><TextField label="产生的行为或策略" value={project.hypothesis.behavior} onChange={(value) => updateRecord(edit, "hypothesis", "behavior", value)} /><TextField label="目标体验" value={project.hypothesis.experience} onChange={(value) => updateRecord(edit, "hypothesis", "experience", value)} /><TextField label="可观察信号" value={project.hypothesis.signal} onChange={(value) => updateRecord(edit, "hypothesis", "signal", value)} /></EditSentenceBlock>
    </section>
    <section className="summary-edit-section"><h2>游戏设计四大支柱</h2><div className="summary-edit-pillars">{tetradMeta.map((meta) => <div className="summary-edit-card" key={meta.id}><h3>{meta.label}</h3><TextAreaField label="基础框架" value={project.tetrad[meta.id].foundation} onChange={(value) => updateTetrad(edit, meta.id, "foundation", value)} /><TextAreaField label="独特特点" value={project.tetrad[meta.id].signature} onChange={(value) => updateTetrad(edit, meta.id, "signature", value)} /><TextAreaField label="支持其他支柱" value={project.tetrad[meta.id].support} onChange={(value) => updateTetrad(edit, meta.id, "support", value)} /></div>)}</div></section>
    <section className="summary-edit-section"><h2>玩家测构思</h2>
      <EditSentenceBlock title="第一句话" preview={playerFirstPreview(project)}><TextField label="主题" value={project.player.firstLook.theme} onChange={(value) => updatePlayer(edit, "firstLook", "theme", value)} /><TextField label="游戏类型" value={project.player.firstLook.genre} onChange={(value) => updatePlayer(edit, "firstLook", "genre", value)} /><TextField label="关联游戏" value={project.player.firstLook.references} onChange={(value) => updatePlayer(edit, "firstLook", "references", value)} /><TextField label="体验预期" value={project.player.firstLook.expectation} onChange={(value) => updatePlayer(edit, "firstLook", "expectation", value)} /></EditSentenceBlock>
      <EditSentenceBlock title="第二句话" preview={playerTenPreview(project)}><TextField label="会 / 不会" value={project.player.firstTen.fulfilment} onChange={(value) => updatePlayer(edit, "firstTen", "fulfilment", value)} /><TextField label="还能 / 而是" value={project.player.firstTen.outcome} onChange={(value) => updatePlayer(edit, "firstTen", "outcome", value)} /><TextField label="独特体验" value={project.player.firstTen.uniqueExperience} onChange={(value) => updatePlayer(edit, "firstTen", "uniqueExperience", value)} /><TextField label="目标 / 期待" value={project.player.firstTen.nextGoal} onChange={(value) => updatePlayer(edit, "firstTen", "nextGoal", value)} /></EditSentenceBlock>
      <EditSentenceBlock title="第三句话" preview={playerArcPreview(project)}><TextField label="机制 / 内容" value={project.player.arc.source} onChange={(value) => updatePlayer(edit, "arc", "source", value)} /><TextField label="游戏体验" value={project.player.arc.finale} onChange={(value) => updatePlayer(edit, "arc", "finale", value)} /></EditSentenceBlock>
    </section>
  </div>;
}

type StepProps = { project: ProjectState; edit: (updater: (current: ProjectState) => ProjectState) => void };

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="field-control"><span>{label}</span><input value={value} placeholder="请输入..." onChange={(event) => onChange(event.target.value)} /></label>;
}

function TextAreaField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="field-control textarea-field"><span>{label}</span><textarea value={value} placeholder="请输入..." onChange={(event) => onChange(event.target.value)} /></label>;
}

function Tabs({ label, children }: { label: string; children: ReactNode }) { return <div className="mini-tabs" role="tablist" aria-label={label}>{children}</div>; }
function Tab({ active, label, status, onClick }: { active: boolean; label: string; status: string; onClick: () => void }) { return <button role="tab" aria-selected={active} className={active ? "active" : ""} type="button" onClick={onClick}><strong>{label}</strong><small>{status}</small></button>; }
function LiveSentence({ children }: { children: ReactNode }) { return <p className="live-sentence">{children}</p>; }
function Statement({ label, children }: { label: string; children: ReactNode }) { return <article className="summary-statement"><strong>{label}</strong><p>{children}</p></article>; }
function EditSentenceBlock({ title, preview, children }: { title: string; preview: string; children: ReactNode }) { return <article className="edit-sentence-block"><h3>{title}</h3><LiveSentence>{preview}</LiveSentence><div className="summary-edit-grid">{children}</div></article>; }
function DetailedExample({ title, children }: { title: string; children: ReactNode }) { return <article className="detailed-example"><h3>{title}</h3>{children}</article>; }
function ExampleList({ items }: { items: Array<[string, string]> }) { return <div className="example-list">{items.map(([title, copy]) => <article key={title}><strong>{title}</strong><p>{copy}</p></article>)}</div>; }

function ReferenceModal({ reference, onClose }: { reference: { title: string; body: ReactNode }; onClose: () => void }) {
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [onClose]);
  return <div className="reference-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="reference-modal" role="dialog" aria-modal="true" aria-labelledby="reference-title"><header><span>参考</span><button type="button" onClick={onClose} aria-label="关闭参考"><X size={20} /></button></header><h2 id="reference-title">{reference.title}</h2><div>{reference.body}</div></section></div>;
}

function updateRecord(edit: StepProps["edit"], section: "gameplay" | "experience" | "hypothesis", field: string, value: string) { edit((current) => ({ ...current, [section]: { ...current[section], [field]: value } } as ProjectState)); }
function updateTetrad(edit: StepProps["edit"], dimension: TetradKey, field: keyof ProjectState["tetrad"][TetradKey], value: string) { edit((current) => ({ ...current, tetrad: { ...current.tetrad, [dimension]: { ...current.tetrad[dimension], [field]: value } } })); }
function updatePlayer(edit: StepProps["edit"], section: keyof ProjectState["player"], field: string, value: string) { edit((current) => ({ ...current, player: { ...current.player, [section]: { ...current.player[section], [field]: value } } } as ProjectState)); }
function hasDimensionContent(project: ProjectState, dimension: TetradKey) { return Object.values(project.tetrad[dimension]).some((value) => value.trim()); }
function hasSentenceContent(project: ProjectState, section: SentenceTab) { return Object.values(project[section]).some((value) => value.trim()); }
function hasPlayerSectionContent(project: ProjectState, section: PlayerTab) {
  if (section === "firstLook") return Object.values(project.player.firstLook).some((value) => value.trim());
  if (section === "firstTen") return [project.player.firstTen.fulfilment, project.player.firstTen.outcome, project.player.firstTen.uniqueExperience, project.player.firstTen.nextGoal].some((value) => value.trim());
  return [project.player.arc.source, project.player.arc.finale].some((value) => value.trim());
}

function preview(value: string, empty = "______") { return value.trim() || empty; }
function gameplayPreview(project: ProjectState, empty?: string) { const value = (text: string) => preview(text, empty); return `玩家作为${value(project.gameplay.identity)}，反复${value(project.gameplay.verb)}，以达成${value(project.gameplay.goal)}；但${value(project.gameplay.constraint)}。`; }
function experiencePreview(project: ProjectState, empty?: string) { const value = (text: string) => preview(text, empty); return `为${value(project.experience.audience)}提供${value(project.experience.feeling)}，主要通过${value(project.experience.dynamic)}，而不是依赖${value(project.experience.alternative)}。`; }
function hypothesisPreview(project: ProjectState, empty?: string) { const value = (text: string) => preview(text, empty); return `如果让玩家${value(project.hypothesis.mechanism)}，那么他们会${value(project.hypothesis.behavior)}，进而感到${value(project.hypothesis.experience)}；证据是${value(project.hypothesis.signal)}。`; }
function playerFirstPreview(project: ProjectState, empty?: string) { const value = (text: string) => preview(text, empty); return `玩家看到游戏名称、介绍图，会认为这是一个关于${value(project.player.firstLook.theme)}的${value(project.player.firstLook.genre)}游戏，会和${value(project.player.firstLook.references)}关联比较，并产生${value(project.player.firstLook.expectation)}。`; }
function playerTenPreview(project: ProjectState, empty?: string) { const value = (text: string) => preview(text, empty); return `玩家在体验游戏10分钟内${value(project.player.firstTen.fulfilment)}获得体验预期，${value(project.player.firstTen.outcome)}获得${value(project.player.firstTen.uniqueExperience)}，玩家因此而不会离开游戏，并产生${value(project.player.firstTen.nextGoal)}。`; }
function playerArcPreview(project: ProjectState, empty?: string) { const value = (text: string) => preview(text, empty); return `玩家中后期体验的变化是来自${value(project.player.arc.source)}的出现，并最终在游戏结束时，获得${value(project.player.arc.finale)}的终极体验。`; }
function display(value: string) { return value.trim() || "（空）"; }
