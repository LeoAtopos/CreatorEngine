"use client";

import { createContext, useContext, useEffect, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { ArrowCounterClockwise, ArrowLeft, ArrowRight, BookOpenText, Check, Copy, DownloadSimple, FloppyDisk, PencilSimple, UploadSimple, X } from "@phosphor-icons/react";
import { buildMarkdown, emptyProject, hasStepContent, LEGACY_STORAGE_KEY, migrateLegacyProject, normalizeProject, parseMarkdownProject, STORAGE_KEY, type Language, type ProjectState, type TetradKey } from "./creator-engine-model";
import { detectSystemLanguage, getUiCopy, LANGUAGE_STORAGE_KEY, type UiCopy } from "./creator-engine-i18n";
import { localizedSteps, type StepId } from "./creator-engine-nodes";
import { tetradReferenceGames } from "./creator-engine-tetrad-references";
import { tetradReferenceGamesEn } from "./creator-engine-tetrad-references-en";

declare global {
  interface Window {
    __CREATOR_ENGINE_SAVE_MARKDOWN__?: (file: { content: string; defaultFileName: string; dialogTitle: string; filterName: string }) => Promise<boolean>;
  }
}

type SentenceTab = "gameplay" | "experience" | "hypothesis";
type PlayerTab = "firstLook" | "firstTen" | "arc";
type ReferenceTarget = { step: "idea" | "sentences" | "player" | "tetrad"; pillar?: TetradKey };

const LanguageContext = createContext<Language>("en");
const sentenceOrder: SentenceTab[] = ["gameplay", "experience", "hypothesis"];
const tetradOrder: TetradKey[] = ["narrative", "mechanics", "aesthetics", "technology"];
const playerOrder: PlayerTab[] = ["firstLook", "firstTen", "arc"];

function useI18n() {
  const language = useContext(LanguageContext);
  return { language, t: getUiCopy(language) };
}
function getTetradMeta(t: UiCopy) { return tetradOrder.map((id) => ({ id, label: t.pillars[id] })); }
function getSentenceMeta(t: UiCopy) { return sentenceOrder.map((id) => ({ id, ...t.sentenceMeta[id] })); }
function getPlayerMeta(t: UiCopy) { return playerOrder.map((id) => ({ id, label: t.playerMeta[id] })); }

export function CreatorEngine() {
  const [language, setLanguage] = useState<Language>("en");
  const [project, setProject] = useState<ProjectState>(() => emptyProject("en"));
  const [hydrated, setHydrated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [referenceOpen, setReferenceOpen] = useState<ReferenceTarget | null>(null);
  const [activeSentence, setActiveSentence] = useState<SentenceTab>("gameplay");
  const [activeTetrad, setActiveTetrad] = useState<TetradKey>("narrative");
  const [activePlayer, setActivePlayer] = useState<PlayerTab>("firstLook");
  const [loadNotice, setLoadNotice] = useState("");
  const loadInput = useRef<HTMLInputElement>(null);
  const t = getUiCopy(language);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      const selectedLanguage: Language = savedLanguage === "zh" || savedLanguage === "en" ? savedLanguage : detectSystemLanguage();
      setLanguage(selectedLanguage);
      document.documentElement.lang = selectedLanguage === "zh" ? "zh-CN" : "en";
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
        if (saved) setProject(normalizeProject(JSON.parse(saved)));
        else if (legacy) setProject(migrateLegacyProject(JSON.parse(legacy)));
        else setProject(emptyProject(selectedLanguage));
      } catch {
        setProject(emptyProject(selectedLanguage));
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

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  }, [hydrated, language]);

  const allSteps = localizedSteps(language);
  const creationSteps = allSteps.filter((step) => step.id !== "welcome");
  const current = allSteps.find((step) => step.id === project.currentStep)!;
  const progress = project.currentStep === "welcome" ? 0 : Math.round((current.index / creationSteps.length) * 100);
  const currentReference: ReferenceTarget | null = project.currentStep === "tetrad"
    ? { step: "tetrad", pillar: activeTetrad }
    : project.currentStep === "idea" || project.currentStep === "sentences" || project.currentStep === "player" ? { step: project.currentStep } : null;

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
    if (index >= order.length - 1) return false;
    setActive(order[index + 1]);
    window.scrollTo({ top: 0, behavior: "smooth" });
    return true;
  }
  function retreatWithin<T>(order: T[], active: T, setActive: (value: T) => void) {
    const index = order.indexOf(active);
    if (index <= 0) return false;
    setActive(order[index - 1]);
    window.scrollTo({ top: 0, behavior: "smooth" });
    return true;
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
    if (!window.confirm(t.restartConfirm)) return;
    window.localStorage.removeItem(STORAGE_KEY);
    setProject(emptyProject(language));
  }
  function switchLanguage() {
    setLanguage(language === "zh" ? "en" : "zh");
    setReferenceOpen(null);
    setLoadNotice("");
  }
  async function loadMarkdown(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const loaded = parseMarkdownProject(await file.text(), language);
      if (hasStepContent(project, "summary") && !window.confirm(t.loadConfirm)) return;
      setProject({ ...loaded, updatedAt: new Date().toISOString() });
      setActiveSentence("gameplay"); setActiveTetrad("narrative"); setActivePlayer("firstLook");
      setLoadNotice(`${t.loaded} ${file.name}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      const message = error instanceof Error ? error.message : t.readFailed;
      setLoadNotice(t.loadFailed);
      window.alert(`${t.loadFailed}: ${message}`);
    }
  }
  async function copySummary() {
    await navigator.clipboard.writeText(buildMarkdown(project, language));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }
  async function downloadSummary() {
    const content = buildMarkdown(project, language);
    const defaultFileName = markdownFileName(project.name, language);
    if (window.__CREATOR_ENGINE_SAVE_MARKDOWN__) {
      try {
        await window.__CREATOR_ENGINE_SAVE_MARKDOWN__({ content, defaultFileName, dialogTitle: t.dialogTitle, filterName: t.markdownDocument });
      } catch (error) {
        const message = error instanceof Error ? error.message : t.cannotSave;
        window.alert(`${t.saveFailed}: ${message}`);
      }
      return;
    }
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a"); link.href = url; link.download = defaultFileName; link.click();
    URL.revokeObjectURL(url);
  }

  return <LanguageContext.Provider value={language}><div className="ce-shell">
    <header className="ce-topbar">
      <button className="ce-brand" type="button" onClick={() => go("welcome")} aria-label={t.backHome}><span className="ce-mark">CE</span><span><strong>{t.brand}</strong><small>{project.name}</small></span></button>
      <div className="ce-progress" aria-label={`${t.progress} ${progress}%`}><span className="ce-progress-copy">{current.index === 0 ? t.start : `${String(current.index).padStart(2, "0")} · ${current.short}`}</span><span className="ce-progress-track"><i style={{ width: `${progress}%` }} /></span><span>{progress}%</span></div>
      <div className="ce-actions">
        <button className="language-switch" type="button" onClick={switchLanguage} aria-label={t.switchLanguage} title={t.switchLanguage}>{t.switchLabel}</button>
        <input ref={loadInput} className="load-input" type="file" accept=".md,text/markdown,text/plain" onChange={loadMarkdown} />
        <button className="load-button" type="button" onClick={() => loadInput.current?.click()}><UploadSimple size={18} />{t.load}</button>
        <span className="save-state" title={loadNotice || undefined}><FloppyDisk size={17} />{loadNotice || (hydrated ? t.saved : t.reading)}</span>
        <button type="button" onClick={restart}><ArrowCounterClockwise size={18} />{t.restart}</button>
      </div>
    </header>
    <aside className="ce-rail" aria-label={t.stepsAria}><div className="rail-heading"><span>FLOW</span><strong>{t.flow}</strong></div><ol>{creationSteps.map((step) => {
      const filled = hasStepContent(project, step.id); const active = step.id === project.currentStep;
      return <li key={step.id} className={`${active ? "active" : ""} ${filled ? "filled" : ""}`}><button type="button" onClick={() => go(step.id)} aria-current={active ? "step" : undefined}><span>{filled ? <Check size={15} weight="bold" /> : String(step.index).padStart(2, "0")}</span><strong>{step.short}</strong><small>{step.id === "summary" ? t.aggregate : filled ? t.filled : t.empty}</small></button></li>;
    })}</ol></aside>
    <main className={`ce-main step-${project.currentStep}`}>
      {project.currentStep === "welcome" ? <Welcome project={project} edit={edit} go={go} /> : <article className="step-page">
        {project.currentStep !== "sentences" && <header className="step-heading"><h1>{current.title}</h1></header>}
        <div className="step-content">{renderStep(project.currentStep, project, edit, copySummary, downloadSummary, copied, { sentence: activeSentence, setSentence: setActiveSentence, tetrad: activeTetrad, setTetrad: setActiveTetrad, player: activePlayer, setPlayer: setActivePlayer })}</div>
        {currentReference && <button className="reference-trigger" type="button" onClick={() => setReferenceOpen(currentReference)}><BookOpenText size={19} weight="bold" />{t.viewReference}</button>}
        <footer className="step-navigation"><button className="back-button" type="button" onClick={goPreviousPage}><ArrowLeft size={19} />{t.previous}</button>{project.currentStep !== "summary" && <button className="next-button" type="button" onClick={goNextPage}>{t.next}<ArrowRight size={19} /></button>}</footer>
      </article>}
    </main>
    <footer className="ce-footer">{t.author}<a href="https://github.com/LeoAtopos/CreatorEngine" target="_blank" rel="noreferrer">https://github.com/LeoAtopos/CreatorEngine</a></footer>
    {referenceOpen && <ReferenceModal target={referenceOpen} onClose={() => setReferenceOpen(null)} />}
  </div></LanguageContext.Provider>;
}

function Welcome({ project, edit, go }: StepProps & { go: (step: StepId) => void }) {
  const { t } = useI18n();
  return <section className="welcome-page"><h1>{t.welcomeTitle}</h1><p className="welcome-subtitle">{t.welcomeSubtitle}</p><label className="project-name-field"><span>{t.projectName}</span><input value={project.name} placeholder={t.enter} onChange={(event) => edit((current) => ({ ...current, name: event.target.value }))} /></label><div className="welcome-actions"><button className="hero-button" type="button" onClick={() => go("idea")}><span>{t.begin}</span><ArrowRight size={22} /></button></div></section>;
}

type SubpageProps = { sentence: SentenceTab; setSentence: (value: SentenceTab) => void; tetrad: TetradKey; setTetrad: (value: TetradKey) => void; player: PlayerTab; setPlayer: (value: PlayerTab) => void };
type StepProps = { project: ProjectState; edit: (updater: (current: ProjectState) => ProjectState) => void };

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
  const { t } = useI18n();
  return <label className="large-field"><span>{t.initialIdea}</span><textarea value={project.rawIdea} onChange={(event) => edit((current) => ({ ...current, rawIdea: event.target.value }))} placeholder={t.enter} /></label>;
}

function SentenceTabsStep({ project, edit, active, setActive }: StepProps & { active: SentenceTab; setActive: (value: SentenceTab) => void }) {
  const { language, t } = useI18n();
  const sentenceMeta = getSentenceMeta(t);
  const meta = sentenceMeta.find((item) => item.id === active)!;
  return <div className="compact-workspace sentence-workspace">
    <Tabs label={t.sentenceTabs}>{sentenceMeta.map((item) => <Tab key={item.id} active={active === item.id} label={item.label} status={hasSentenceContent(project, item.id) ? t.filled : t.empty} onClick={() => setActive(item.id)} />)}</Tabs>
    <section className="sentence-panel"><h1>{meta.title}</h1>
      {active === "gameplay" && <><LiveSentence>{gameplayPreview(project, language)}</LiveSentence><div className="sentence-fields"><TextField label={t.fields.identity} value={project.gameplay.identity} onChange={(value) => updateRecord(edit, "gameplay", "identity", value)} /><TextField label={t.fields.verb} value={project.gameplay.verb} onChange={(value) => updateRecord(edit, "gameplay", "verb", value)} /><TextField label={t.fields.goal} value={project.gameplay.goal} onChange={(value) => updateRecord(edit, "gameplay", "goal", value)} /><TextField label={t.fields.constraint} value={project.gameplay.constraint} onChange={(value) => updateRecord(edit, "gameplay", "constraint", value)} /></div></>}
      {active === "experience" && <><LiveSentence>{experiencePreview(project, language)}</LiveSentence><div className="sentence-fields"><TextField label={t.fields.audience} value={project.experience.audience} onChange={(value) => updateRecord(edit, "experience", "audience", value)} /><TextField label={t.fields.feeling} value={project.experience.feeling} onChange={(value) => updateRecord(edit, "experience", "feeling", value)} /><TextField label={t.fields.dynamic} value={project.experience.dynamic} onChange={(value) => updateRecord(edit, "experience", "dynamic", value)} /><TextField label={t.fields.alternative} value={project.experience.alternative} onChange={(value) => updateRecord(edit, "experience", "alternative", value)} /></div></>}
      {active === "hypothesis" && <><LiveSentence>{hypothesisPreview(project, language)}</LiveSentence><div className="sentence-fields"><TextField label={t.fields.mechanism} value={project.hypothesis.mechanism} onChange={(value) => updateRecord(edit, "hypothesis", "mechanism", value)} /><TextField label={t.fields.behavior} value={project.hypothesis.behavior} onChange={(value) => updateRecord(edit, "hypothesis", "behavior", value)} /><TextField label={t.fields.experience} value={project.hypothesis.experience} onChange={(value) => updateRecord(edit, "hypothesis", "experience", value)} /><TextField label={t.fields.signal} value={project.hypothesis.signal} onChange={(value) => updateRecord(edit, "hypothesis", "signal", value)} /></div></>}
    </section>
  </div>;
}

function TetradStep({ project, edit, active, setActive }: StepProps & { active: TetradKey; setActive: (value: TetradKey) => void }) {
  const { t } = useI18n();
  const tetradMeta = getTetradMeta(t);
  const dimension = tetradMeta.find((item) => item.id === active)!;
  return <div className="compact-workspace"><Tabs label={t.tetradTabs}>{tetradMeta.map((item) => <Tab key={item.id} active={active === item.id} label={item.label} status={hasDimensionContent(project, item.id) ? t.filled : t.empty} onClick={() => setActive(item.id)} />)}</Tabs><section className="compact-panel">
    <TextField label={`${dimension.label} · ${t.foundation}`} placeholder={t.placeholders[dimension.id]} value={project.tetrad[dimension.id].foundation} onChange={(value) => updateTetrad(edit, dimension.id, "foundation", value)} />
    <TextAreaField label={`${dimension.label} · ${t.signature}`} value={project.tetrad[dimension.id].signature} onChange={(value) => updateTetrad(edit, dimension.id, "signature", value)} />
    {tetradMeta.filter((target) => target.id !== dimension.id).map((target) => <TextAreaField key={target.id} label={relationLabel(t, dimension.label, target.label)} value={project.tetrad[dimension.id].support[target.id]} onChange={(value) => updateTetradSupport(edit, dimension.id, target.id, value)} />)}
  </section></div>;
}

function PlayerStep({ project, edit, active, setActive }: StepProps & { active: PlayerTab; setActive: (value: PlayerTab) => void }) {
  const { language, t } = useI18n();
  const playerMeta = getPlayerMeta(t);
  return <div className="compact-workspace"><Tabs label={t.playerTabs}>{playerMeta.map((item) => <Tab key={item.id} active={active === item.id} label={item.label} status={hasPlayerSectionContent(project, item.id) ? t.filled : t.empty} onClick={() => setActive(item.id)} />)}</Tabs><section className="sentence-panel player-sentence-panel">
    {active === "firstLook" && <><LiveSentence>{playerFirstPreview(project, language)}</LiveSentence><div className="sentence-fields"><TextField label={t.fields.theme} value={project.player.firstLook.theme} onChange={(value) => updatePlayer(edit, "firstLook", "theme", value)} /><TextField label={t.fields.genre} value={project.player.firstLook.genre} onChange={(value) => updatePlayer(edit, "firstLook", "genre", value)} /><TextField label={t.fields.references} value={project.player.firstLook.references} onChange={(value) => updatePlayer(edit, "firstLook", "references", value)} /><TextField label={t.fields.expectation} value={project.player.firstLook.expectation} onChange={(value) => updatePlayer(edit, "firstLook", "expectation", value)} /></div></>}
    {active === "firstTen" && <><LiveSentence>{playerTenPreview(project, language)}</LiveSentence><div className="sentence-fields"><TextField label={t.fields.fulfilment} value={project.player.firstTen.fulfilment} onChange={(value) => updatePlayer(edit, "firstTen", "fulfilment", value)} /><TextField label={t.fields.outcome} value={project.player.firstTen.outcome} onChange={(value) => updatePlayer(edit, "firstTen", "outcome", value)} /><TextField label={t.fields.uniqueExperience} value={project.player.firstTen.uniqueExperience} onChange={(value) => updatePlayer(edit, "firstTen", "uniqueExperience", value)} /><TextField label={t.fields.nextGoal} value={project.player.firstTen.nextGoal} onChange={(value) => updatePlayer(edit, "firstTen", "nextGoal", value)} /></div></>}
    {active === "arc" && <><LiveSentence>{playerArcPreview(project, language)}</LiveSentence><div className="sentence-fields"><TextField label={t.fields.source} value={project.player.arc.source} onChange={(value) => updatePlayer(edit, "arc", "source", value)} /><TextField label={t.fields.finale} value={project.player.arc.finale} onChange={(value) => updatePlayer(edit, "arc", "finale", value)} /></div></>}
  </section></div>;
}

function SummaryStep({ project, edit, copySummary, downloadSummary, copied }: StepProps & { copySummary: () => Promise<void>; downloadSummary: () => Promise<void>; copied: boolean }) {
  const [editing, setEditing] = useState(false);
  const { t } = useI18n();
  return <div className="summary-layout"><div className="summary-actions"><button className={editing ? "primary" : ""} type="button" onClick={() => setEditing((value) => !value)}>{editing ? <Check size={18} /> : <PencilSimple size={18} />}{editing ? t.finish : t.edit}</button><button type="button" onClick={copySummary}>{copied ? <Check size={18} /> : <Copy size={18} />}{copied ? t.copied : t.copy}</button><button type="button" onClick={() => void downloadSummary()}><DownloadSimple size={18} />{t.download}</button></div>{editing ? <SummaryEditor project={project} edit={edit} /> : <SummaryReadView project={project} />}</div>;
}

function SummaryReadView({ project }: { project: ProjectState }) {
  const { language, t } = useI18n();
  const tetradMeta = getTetradMeta(t);
  return <>
    <section className="summary-section"><h2>{t.initialIdea}</h2><p>{display(project.rawIdea, t)}</p></section>
    <section className="summary-section"><h2>{t.threeSentences}</h2><Statement label={t.sentenceMeta.gameplay.title}>{gameplayPreview(project, language, t.emptyDisplay)}</Statement><Statement label={t.sentenceMeta.experience.title}>{experiencePreview(project, language, t.emptyDisplay)}</Statement><Statement label={t.sentenceMeta.hypothesis.title}>{hypothesisPreview(project, language, t.emptyDisplay)}</Statement></section>
    <section className="summary-section"><h2>{t.fourPillars}</h2><div className="summary-tetrad">{tetradMeta.map((meta) => <article key={meta.id}><strong>{meta.label}</strong><p>{display(project.tetrad[meta.id].foundation, t)}</p><p>{display(project.tetrad[meta.id].signature, t)}</p><div className="summary-support">{tetradMeta.filter((target) => target.id !== meta.id).map((target) => <small key={target.id}><b>{relationLabel(t, meta.label, target.label)}: </b>{display(project.tetrad[meta.id].support[target.id], t)}</small>)}</div></article>)}</div></section>
    <section className="summary-section"><h2>{t.playerConcept}</h2><div className="summary-journey"><article><b>{t.playerMeta.firstLook}</b><p>{playerFirstPreview(project, language, t.emptyDisplay)}</p></article><article><b>{t.playerMeta.firstTen}</b><p>{playerTenPreview(project, language, t.emptyDisplay)}</p></article><article><b>{t.playerMeta.arc}</b><p>{playerArcPreview(project, language, t.emptyDisplay)}</p></article></div></section>
  </>;
}

function SummaryEditor({ project, edit }: StepProps) {
  const { language, t } = useI18n();
  const tetradMeta = getTetradMeta(t);
  return <div className="summary-editor">
    <section className="summary-edit-section"><h2>{t.initialIdea}</h2><TextAreaField label={t.initialIdea} value={project.rawIdea} onChange={(value) => edit((current) => ({ ...current, rawIdea: value }))} /></section>
    <section className="summary-edit-section"><h2>{t.threeSentences}</h2>
      <EditSentenceBlock title={t.sentenceMeta.gameplay.title} preview={gameplayPreview(project, language)}><TextField label={t.fields.identity} value={project.gameplay.identity} onChange={(value) => updateRecord(edit, "gameplay", "identity", value)} /><TextField label={t.fields.verb} value={project.gameplay.verb} onChange={(value) => updateRecord(edit, "gameplay", "verb", value)} /><TextField label={t.fields.goal} value={project.gameplay.goal} onChange={(value) => updateRecord(edit, "gameplay", "goal", value)} /><TextField label={t.fields.constraint} value={project.gameplay.constraint} onChange={(value) => updateRecord(edit, "gameplay", "constraint", value)} /></EditSentenceBlock>
      <EditSentenceBlock title={t.sentenceMeta.experience.title} preview={experiencePreview(project, language)}><TextField label={t.fields.audience} value={project.experience.audience} onChange={(value) => updateRecord(edit, "experience", "audience", value)} /><TextField label={t.fields.feeling} value={project.experience.feeling} onChange={(value) => updateRecord(edit, "experience", "feeling", value)} /><TextField label={t.fields.dynamic} value={project.experience.dynamic} onChange={(value) => updateRecord(edit, "experience", "dynamic", value)} /><TextField label={t.fields.alternative} value={project.experience.alternative} onChange={(value) => updateRecord(edit, "experience", "alternative", value)} /></EditSentenceBlock>
      <EditSentenceBlock title={t.sentenceMeta.hypothesis.title} preview={hypothesisPreview(project, language)}><TextField label={t.fields.mechanism} value={project.hypothesis.mechanism} onChange={(value) => updateRecord(edit, "hypothesis", "mechanism", value)} /><TextField label={t.fields.behavior} value={project.hypothesis.behavior} onChange={(value) => updateRecord(edit, "hypothesis", "behavior", value)} /><TextField label={t.fields.experience} value={project.hypothesis.experience} onChange={(value) => updateRecord(edit, "hypothesis", "experience", value)} /><TextField label={t.fields.signal} value={project.hypothesis.signal} onChange={(value) => updateRecord(edit, "hypothesis", "signal", value)} /></EditSentenceBlock>
    </section>
    <section className="summary-edit-section"><h2>{t.fourPillars}</h2><div className="summary-edit-pillars">{tetradMeta.map((meta) => <div className="summary-edit-card" key={meta.id}><h3>{meta.label}</h3><TextField label={t.foundation} placeholder={t.placeholders[meta.id]} value={project.tetrad[meta.id].foundation} onChange={(value) => updateTetrad(edit, meta.id, "foundation", value)} /><TextAreaField label={t.signature} value={project.tetrad[meta.id].signature} onChange={(value) => updateTetrad(edit, meta.id, "signature", value)} />{tetradMeta.filter((target) => target.id !== meta.id).map((target) => <TextAreaField key={target.id} label={relationLabel(t, meta.label, target.label)} value={project.tetrad[meta.id].support[target.id]} onChange={(value) => updateTetradSupport(edit, meta.id, target.id, value)} />)}</div>)}</div></section>
    <section className="summary-edit-section"><h2>{t.playerConcept}</h2>
      <EditSentenceBlock title={t.playerMeta.firstLook} preview={playerFirstPreview(project, language)}><TextField label={t.fields.theme} value={project.player.firstLook.theme} onChange={(value) => updatePlayer(edit, "firstLook", "theme", value)} /><TextField label={t.fields.genre} value={project.player.firstLook.genre} onChange={(value) => updatePlayer(edit, "firstLook", "genre", value)} /><TextField label={t.fields.references} value={project.player.firstLook.references} onChange={(value) => updatePlayer(edit, "firstLook", "references", value)} /><TextField label={t.fields.expectation} value={project.player.firstLook.expectation} onChange={(value) => updatePlayer(edit, "firstLook", "expectation", value)} /></EditSentenceBlock>
      <EditSentenceBlock title={t.playerMeta.firstTen} preview={playerTenPreview(project, language)}><TextField label={t.fields.fulfilment} value={project.player.firstTen.fulfilment} onChange={(value) => updatePlayer(edit, "firstTen", "fulfilment", value)} /><TextField label={t.fields.outcome} value={project.player.firstTen.outcome} onChange={(value) => updatePlayer(edit, "firstTen", "outcome", value)} /><TextField label={t.fields.uniqueExperience} value={project.player.firstTen.uniqueExperience} onChange={(value) => updatePlayer(edit, "firstTen", "uniqueExperience", value)} /><TextField label={t.fields.nextGoal} value={project.player.firstTen.nextGoal} onChange={(value) => updatePlayer(edit, "firstTen", "nextGoal", value)} /></EditSentenceBlock>
      <EditSentenceBlock title={t.playerMeta.arc} preview={playerArcPreview(project, language)}><TextField label={t.fields.source} value={project.player.arc.source} onChange={(value) => updatePlayer(edit, "arc", "source", value)} /><TextField label={t.fields.finale} value={project.player.arc.finale} onChange={(value) => updatePlayer(edit, "arc", "finale", value)} /></EditSentenceBlock>
    </section>
  </div>;
}

function TextField({ label, value, placeholder, onChange }: { label: string; value: string; placeholder?: string; onChange: (value: string) => void }) {
  const { t } = useI18n();
  return <label className="field-control"><span>{label}</span><input value={value} placeholder={placeholder ?? t.enter} onChange={(event) => onChange(event.target.value)} /></label>;
}
function TextAreaField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const { t } = useI18n();
  return <label className="field-control textarea-field"><span>{label}</span><textarea value={value} placeholder={t.enter} onChange={(event) => onChange(event.target.value)} /></label>;
}
function Tabs({ label, children }: { label: string; children: ReactNode }) { return <div className="mini-tabs" role="tablist" aria-label={label}>{children}</div>; }
function Tab({ active, label, status, onClick }: { active: boolean; label: string; status: string; onClick: () => void }) { return <button role="tab" aria-selected={active} className={active ? "active" : ""} type="button" onClick={onClick}><strong>{label}</strong><small>{status}</small></button>; }
function LiveSentence({ children }: { children: ReactNode }) { return <p className="live-sentence">{children}</p>; }
function Statement({ label, children }: { label: string; children: ReactNode }) { return <article className="summary-statement"><strong>{label}</strong><p>{children}</p></article>; }
function EditSentenceBlock({ title, preview, children }: { title: string; preview: ReactNode; children: ReactNode }) { return <article className="edit-sentence-block"><h3>{title}</h3><LiveSentence>{preview}</LiveSentence><div className="summary-edit-grid">{children}</div></article>; }
function DetailedExample({ title, children }: { title: string; children: ReactNode }) { return <article className="detailed-example"><h3>{title}</h3>{children}</article>; }
function ReferenceFill({ children }: { children: ReactNode }) { return <span className="reference-fill">{children}</span>; }

function SentenceReferenceExamples() {
  const { language, t } = useI18n();
  const games = language === "zh" ? tetradReferenceGames : tetradReferenceGamesEn;
  return <div className="detailed-examples">{games.map((game) => {
    const { gameplay, experience, hypothesis } = game.sentence;
    return <DetailedExample key={game.title} title={game.title}>{language === "zh" ? <>
      <p><b>{t.whatGame}：</b>玩家作为<ReferenceFill>{gameplay.identity}</ReferenceFill>，反复<ReferenceFill>{gameplay.verb}</ReferenceFill>，以<ReferenceFill>{gameplay.goal}</ReferenceFill>；但<ReferenceFill>{gameplay.constraint}</ReferenceFill>。</p>
      <p><b>{t.whatExperience}：</b>为<ReferenceFill>{experience.audience}</ReferenceFill>提供<ReferenceFill>{experience.feeling}</ReferenceFill>，主要通过<ReferenceFill>{experience.dynamic}</ReferenceFill>来实现，而不是依赖<ReferenceFill>{experience.alternative}</ReferenceFill>。</p>
      <p><b>{t.howValidate}：</b>如果让玩家<ReferenceFill>{hypothesis.mechanism}</ReferenceFill>，那么他们会<ReferenceFill>{hypothesis.behavior}</ReferenceFill>，进而感到<ReferenceFill>{hypothesis.experience}</ReferenceFill>；证据是<ReferenceFill>{hypothesis.signal}</ReferenceFill>。</p>
    </> : <>
      <p><b>{t.whatGame}: </b>As <ReferenceFill>{gameplay.identity}</ReferenceFill>, the player repeatedly <ReferenceFill>{gameplay.verb}</ReferenceFill> to <ReferenceFill>{gameplay.goal}</ReferenceFill>; but <ReferenceFill>{gameplay.constraint}</ReferenceFill>.</p>
      <p><b>{t.whatExperience}: </b>For <ReferenceFill>{experience.audience}</ReferenceFill>, deliver <ReferenceFill>{experience.feeling}</ReferenceFill> primarily through <ReferenceFill>{experience.dynamic}</ReferenceFill>, rather than relying on <ReferenceFill>{experience.alternative}</ReferenceFill>.</p>
      <p><b>{t.howValidate}: </b>If players <ReferenceFill>{hypothesis.mechanism}</ReferenceFill>, they will <ReferenceFill>{hypothesis.behavior}</ReferenceFill>, and thereby feel <ReferenceFill>{hypothesis.experience}</ReferenceFill>; evidence: <ReferenceFill>{hypothesis.signal}</ReferenceFill>.</p>
    </>}</DetailedExample>;
  })}</div>;
}

function PlayerReferenceExamples() {
  const { language, t } = useI18n();
  const games = language === "zh" ? tetradReferenceGames : tetradReferenceGamesEn;
  return <div className="detailed-examples">{games.map((game) => {
    const { firstLook, firstTen, arc } = game.player;
    return <DetailedExample key={game.title} title={game.title}>{language === "zh" ? <>
      <p><b>{t.sentenceOne}：</b>玩家看到游戏名称、介绍图，会认为这是一个关于<ReferenceFill>{firstLook.theme}</ReferenceFill>的<ReferenceFill>{firstLook.genre}</ReferenceFill>游戏，会和<ReferenceFill>{firstLook.references}</ReferenceFill>关联比较，并产生<ReferenceFill>{firstLook.expectation}</ReferenceFill>的预期。</p>
      <p><b>{t.sentenceTwo}：</b>玩家在体验游戏10分钟内<ReferenceFill>{firstTen.fulfilment}</ReferenceFill>获得体验预期，<ReferenceFill>{firstTen.outcome}</ReferenceFill>获得<ReferenceFill>{firstTen.uniqueExperience}</ReferenceFill>，玩家因此而不会离开游戏，并产生<ReferenceFill>{firstTen.nextGoal}</ReferenceFill>。</p>
      <p><b>{t.sentenceThree}：</b>玩家中后期体验的变化是来自<ReferenceFill>{arc.source}</ReferenceFill>的出现，并最终在游戏结束时，获得<ReferenceFill>{arc.finale}</ReferenceFill>的终极体验。</p>
    </> : <>
      <p><b>{t.sentenceOne}: </b>From the title and key art, players will expect a <ReferenceFill>{firstLook.genre}</ReferenceFill> game about <ReferenceFill>{firstLook.theme}</ReferenceFill>, compare it with <ReferenceFill>{firstLook.references}</ReferenceFill>, and anticipate <ReferenceFill>{firstLook.expectation}</ReferenceFill>.</p>
      <p><b>{t.sentenceTwo}: </b>Within the first 10 minutes, players <ReferenceFill>{firstTen.fulfilment}</ReferenceFill> meet that expectation and <ReferenceFill>{firstTen.outcome}</ReferenceFill> gain <ReferenceFill>{firstTen.uniqueExperience}</ReferenceFill>. This gives them a reason to stay and makes them want to <ReferenceFill>{firstTen.nextGoal}</ReferenceFill>.</p>
      <p><b>{t.sentenceThree}: </b>During the mid-to-late game, the experience changes through <ReferenceFill>{arc.source}</ReferenceFill>, ultimately delivering <ReferenceFill>{arc.finale}</ReferenceFill> by the end.</p>
    </>}</DetailedExample>;
  })}</div>;
}

function TetradReferenceExamples({ pillar }: { pillar: TetradKey }) {
  const { language, t } = useI18n();
  const games = language === "zh" ? tetradReferenceGames : tetradReferenceGamesEn;
  const tetradMeta = getTetradMeta(t);
  const source = tetradMeta.find((item) => item.id === pillar)!;
  return <div className="detailed-examples">{games.map((game) => {
    const example = game.examples[pillar];
    return <DetailedExample key={game.title} title={game.title}>
      <p><b>{t.foundationShort}{language === "zh" ? "：" : ": "}</b><ReferenceFill>{example.foundation}</ReferenceFill></p>
      <p><b>{t.signatureShort}{language === "zh" ? "：" : ": "}</b><ReferenceFill>{example.signature}</ReferenceFill></p>
      {tetradMeta.filter((target) => target.id !== pillar).map((target) => <p key={target.id}><b>{relationLabel(t, source.label, target.label)}{language === "zh" ? "：" : ": "}</b><ReferenceFill>{example.support[target.id]}</ReferenceFill></p>)}
    </DetailedExample>;
  })}</div>;
}

function ExampleList({ items }: { items: Array<[string, string]> }) { return <div className="example-list">{items.map(([title, copy]) => <article key={title}><strong>{title}</strong><p><ReferenceFill>{copy}</ReferenceFill></p></article>)}</div>; }

function ReferenceModal({ target, onClose }: { target: ReferenceTarget; onClose: () => void }) {
  const { t } = useI18n();
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [onClose]);
  let title = t.ideaReference;
  let body: ReactNode = <ExampleList items={t.ideaExamples} />;
  if (target.step === "sentences") { title = t.sentenceReference; body = <><p>{t.sentenceReferenceIntro}</p><SentenceReferenceExamples /></>; }
  else if (target.step === "player") { title = t.playerReference; body = <><p>{t.playerReferenceIntro}</p><PlayerReferenceExamples /></>; }
  else if (target.step === "tetrad" && target.pillar) { title = t.tetradReferenceTitles[target.pillar]; body = <><p>{t.tetradReferenceIntros[target.pillar]}</p><TetradReferenceExamples pillar={target.pillar} /></>; }
  return <div className="reference-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="reference-modal" role="dialog" aria-modal="true" aria-labelledby="reference-title"><header><span>{t.reference}</span><button type="button" onClick={onClose} aria-label={t.closeReference}><X size={20} /></button></header><h2 id="reference-title">{title}</h2><div>{body}</div></section></div>;
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
function relationLabel(t: UiCopy, source: string, target: string) { return t.brand === "创作引擎" ? `${source}对${target}的${t.relation}` : `${source}'s ${t.relation} for ${target}`; }

function Slot({ value, empty = "______" }: { value: string; empty?: string }) { const text = value.trim(); return text ? <span className="filled-slot">{text}</span> : <>{empty}</>; }
function gameplayPreview(project: ProjectState, language: Language, empty?: string) { const fill = (value: string) => <Slot value={value} empty={empty} />; return language === "zh" ? <>玩家作为{fill(project.gameplay.identity)}，反复{fill(project.gameplay.verb)}，以{fill(project.gameplay.goal)}；但{fill(project.gameplay.constraint)}。</> : <>As {fill(project.gameplay.identity)}, the player repeatedly {fill(project.gameplay.verb)} to {fill(project.gameplay.goal)}; but {fill(project.gameplay.constraint)}.</>; }
function experiencePreview(project: ProjectState, language: Language, empty?: string) { const fill = (value: string) => <Slot value={value} empty={empty} />; return language === "zh" ? <>为{fill(project.experience.audience)}提供{fill(project.experience.feeling)}，主要通过{fill(project.experience.dynamic)}来实现，而不是依赖{fill(project.experience.alternative)}。</> : <>For {fill(project.experience.audience)}, deliver {fill(project.experience.feeling)} primarily through {fill(project.experience.dynamic)}, rather than relying on {fill(project.experience.alternative)}.</>; }
function hypothesisPreview(project: ProjectState, language: Language, empty?: string) { const fill = (value: string) => <Slot value={value} empty={empty} />; return language === "zh" ? <>如果让玩家{fill(project.hypothesis.mechanism)}，那么他们会{fill(project.hypothesis.behavior)}，进而感到{fill(project.hypothesis.experience)}；证据是{fill(project.hypothesis.signal)}。</> : <>If players {fill(project.hypothesis.mechanism)}, they will {fill(project.hypothesis.behavior)}, and thereby feel {fill(project.hypothesis.experience)}; evidence: {fill(project.hypothesis.signal)}.</>; }
function playerFirstPreview(project: ProjectState, language: Language, empty?: string) { const fill = (value: string) => <Slot value={value} empty={empty} />; return language === "zh" ? <>玩家看到游戏名称、介绍图，会认为这是一个关于{fill(project.player.firstLook.theme)}的{fill(project.player.firstLook.genre)}游戏，会和{fill(project.player.firstLook.references)}关联比较，并产生{fill(project.player.firstLook.expectation)}的预期。</> : <>From the title and key art, players will expect a {fill(project.player.firstLook.genre)} game about {fill(project.player.firstLook.theme)}, compare it with {fill(project.player.firstLook.references)}, and anticipate {fill(project.player.firstLook.expectation)}.</>; }
function playerTenPreview(project: ProjectState, language: Language, empty?: string) { const fill = (value: string) => <Slot value={value} empty={empty} />; return language === "zh" ? <>玩家在体验游戏10分钟内{fill(project.player.firstTen.fulfilment)}获得体验预期，{fill(project.player.firstTen.outcome)}获得{fill(project.player.firstTen.uniqueExperience)}，玩家因此而不会离开游戏，并产生{fill(project.player.firstTen.nextGoal)}。</> : <>Within the first 10 minutes, players {fill(project.player.firstTen.fulfilment)} meet that expectation and {fill(project.player.firstTen.outcome)} gain {fill(project.player.firstTen.uniqueExperience)}. This gives them a reason to stay and makes them want to {fill(project.player.firstTen.nextGoal)}.</>; }
function playerArcPreview(project: ProjectState, language: Language, empty?: string) { const fill = (value: string) => <Slot value={value} empty={empty} />; return language === "zh" ? <>玩家中后期体验的变化是来自{fill(project.player.arc.source)}的出现，并最终在游戏结束时，获得{fill(project.player.arc.finale)}的终极体验。</> : <>During the mid-to-late game, the experience changes through {fill(project.player.arc.source)}, ultimately delivering {fill(project.player.arc.finale)} by the end.</>; }
function markdownFileName(projectName: string, language: Language) {
  const invalidCharacters = "<>:\"/\\|?*";
  const safeName = [...projectName.trim()].map((character) => character.charCodeAt(0) < 32 || invalidCharacters.includes(character) ? "_" : character).join("").replace(/[. ]+$/g, "");
  return `${safeName || (language === "zh" ? "游戏设计摘要" : "Game Design Summary")}.md`;
}
function display(value: string, t: UiCopy) { return value.trim() || t.emptyDisplay; }
