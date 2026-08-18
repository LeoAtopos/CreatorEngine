import type { StepId } from "./creator-engine-nodes";

export type TetradKey = "narrative" | "mechanics" | "aesthetics" | "technology";

export type TetradAnswer = {
  foundation: string;
  signature: string;
  support: string;
};

export type ProjectState = {
  version: 4;
  currentStep: StepId;
  name: string;
  rawIdea: string;
  gameplay: {
    identity: string;
    verb: string;
    goal: string;
    constraint: string;
  };
  experience: {
    audience: string;
    feeling: string;
    dynamic: string;
    alternative: string;
  };
  hypothesis: {
    mechanism: string;
    behavior: string;
    experience: string;
    signal: string;
  };
  tetrad: Record<TetradKey, TetradAnswer>;
  player: {
    firstLook: {
      theme: string;
      genre: string;
      references: string;
      expectation: string;
    };
    firstTen: {
      fulfilment: "" | "会" | "不会";
      outcome: string;
      uniqueExperience: string;
      reasonToStay: string;
      nextGoal: string;
    };
    arc: {
      source: string;
      change: string;
      finale: string;
    };
  };
  updatedAt: string;
};

export const STORAGE_KEY = "creator-engine.game-design.v4";
export const LEGACY_STORAGE_KEY = "creator-engine.game-design.v3";

const blankTetrad = (): TetradAnswer => ({ foundation: "", signature: "", support: "" });

export function emptyProject(): ProjectState {
  return {
    version: 4,
    currentStep: "welcome",
    name: "未命名游戏",
    rawIdea: "",
    gameplay: { identity: "", verb: "", goal: "", constraint: "" },
    experience: { audience: "", feeling: "", dynamic: "", alternative: "" },
    hypothesis: { mechanism: "", behavior: "", experience: "", signal: "" },
    tetrad: {
      narrative: blankTetrad(),
      mechanics: blankTetrad(),
      aesthetics: blankTetrad(),
      technology: blankTetrad(),
    },
    player: {
      firstLook: { theme: "", genre: "", references: "", expectation: "" },
      firstTen: { fulfilment: "", outcome: "", uniqueExperience: "", reasonToStay: "", nextGoal: "" },
      arc: { source: "", change: "", finale: "" },
    },
    updatedAt: new Date().toISOString(),
  };
}

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? value as Record<string, unknown> : {};
}

export function normalizeProject(value: unknown): ProjectState {
  const fallback = emptyProject();
  const source = record(value);
  if (source.version !== 4) return fallback;

  const gameplay = record(source.gameplay);
  const experience = record(source.experience);
  const hypothesis = record(source.hypothesis);
  const tetrad = record(source.tetrad);
  const player = record(source.player);
  const firstLook = record(player.firstLook);
  const firstTen = record(player.firstTen);
  const arc = record(player.arc);
  const savedOutcome = text(firstTen.outcome);
  const hasIntentionalFirstTenAnswer = [firstTen.fulfilment, firstTen.uniqueExperience, firstTen.reasonToStay, firstTen.nextGoal]
    .some((item) => text(item).trim());
  const stepIds: StepId[] = ["welcome", "idea", "sentences", "tetrad", "player", "summary"];
  const storedStep = text(source.currentStep);
  const currentStep: StepId = ["gameplay", "experience", "hypothesis"].includes(storedStep)
    ? "sentences"
    : stepIds.includes(storedStep as StepId) ? storedStep as StepId : "welcome";

  return {
    ...fallback,
    currentStep,
    name: text(source.name) || fallback.name,
    rawIdea: text(source.rawIdea),
    gameplay: {
      identity: text(gameplay.identity),
      verb: text(gameplay.verb),
      goal: text(gameplay.goal),
      constraint: text(gameplay.constraint),
    },
    experience: {
      audience: text(experience.audience),
      feeling: text(experience.feeling),
      dynamic: text(experience.dynamic),
      alternative: text(experience.alternative),
    },
    hypothesis: {
      mechanism: text(hypothesis.mechanism),
      behavior: text(hypothesis.behavior),
      experience: text(hypothesis.experience),
      signal: text(hypothesis.signal),
    },
    tetrad: {
      narrative: normalizeTetrad(tetrad.narrative),
      mechanics: normalizeTetrad(tetrad.mechanics),
      aesthetics: normalizeTetrad(tetrad.aesthetics),
      technology: normalizeTetrad(tetrad.technology),
    },
    player: {
      firstLook: {
        theme: text(firstLook.theme),
        genre: text(firstLook.genre),
        references: text(firstLook.references),
        expectation: text(firstLook.expectation),
      },
      firstTen: {
        fulfilment: firstTen.fulfilment === "会" || firstTen.fulfilment === "不会" ? firstTen.fulfilment : "",
        outcome: savedOutcome === "获得" && !hasIntentionalFirstTenAnswer ? "" : savedOutcome,
        uniqueExperience: text(firstTen.uniqueExperience),
        reasonToStay: text(firstTen.reasonToStay),
        nextGoal: text(firstTen.nextGoal),
      },
      arc: {
        source: text(arc.source),
        change: text(arc.change),
        finale: text(arc.finale),
      },
    },
    updatedAt: text(source.updatedAt) || fallback.updatedAt,
  };
}

function normalizeTetrad(value: unknown): TetradAnswer {
  const source = record(value);
  return {
    foundation: text(source.foundation),
    signature: text(source.signature),
    support: text(source.support),
  };
}

export function migrateLegacyProject(value: unknown): ProjectState {
  const fresh = emptyProject();
  const source = record(value);
  const dimensions = record(source.dimensions);
  const causal = record(source.causal);
  const oldExperience = Array.isArray(source.experiences) ? source.experiences.filter((item) => typeof item === "string") : [];

  return {
    ...fresh,
    currentStep: text(source.rawIdea) ? "idea" : "welcome",
    name: text(source.name) || fresh.name,
    rawIdea: text(source.rawIdea),
    gameplay: {
      identity: text(source.fantasyStatement),
      verb: [text(source.coreVerb), text(source.coreObject)].filter(Boolean).join(" "),
      goal: text(source.shortGoal) || text(source.outcomeState),
      constraint: text(source.constraint),
    },
    experience: {
      ...fresh.experience,
      feeling: oldExperience.join("、"),
    },
    hypothesis: {
      mechanism: text(causal.design),
      behavior: text(causal.dynamic),
      experience: text(causal.experience),
      signal: text(source.observableSignal),
    },
    tetrad: {
      narrative: { foundation: text(dimensions.narrative), signature: "", support: "" },
      mechanics: { foundation: text(dimensions.mechanics), signature: "", support: "" },
      aesthetics: { foundation: text(dimensions.aesthetics), signature: "", support: "" },
      technology: { foundation: text(dimensions.technology), signature: "", support: "" },
    },
  };
}

const filled = (values: string[]) => values.every((value) => value.trim().length > 0);

export function isStepComplete(project: ProjectState, step: StepId) {
  switch (step) {
    case "welcome": return true;
    case "idea": return Boolean(project.rawIdea.trim());
    case "sentences": return filled([
      ...Object.values(project.gameplay),
      ...Object.values(project.experience),
      ...Object.values(project.hypothesis),
    ]);
    case "tetrad": return Object.values(project.tetrad).every((answer) => filled(Object.values(answer)));
    case "player": return filled([
      ...Object.values(project.player.firstLook),
      project.player.firstTen.fulfilment,
      project.player.firstTen.outcome,
      project.player.firstTen.uniqueExperience,
      project.player.firstTen.nextGoal,
      project.player.arc.source,
      project.player.arc.finale,
    ]);
    case "summary": return (["idea", "sentences", "tetrad", "player"] as StepId[])
      .every((requiredStep) => isStepComplete(project, requiredStep));
  }
}

export function gameplaySentence(project: ProjectState) {
  const { identity, verb, goal, constraint } = project.gameplay;
  return `玩家作为${slot(identity, "身份")}，反复${slot(verb, "核心动词")}，以${slot(goal, "目标")}；但${slot(constraint, "约束或反转")}。`;
}

export function experienceSentence(project: ProjectState) {
  const { audience, feeling, dynamic, alternative } = project.experience;
  return `为${slot(audience, "目标玩家")}提供${slot(feeling, "核心感受")}，主要通过${slot(dynamic, "关键动态")}来实现，而不是依赖${slot(alternative, "常规方案")}。`;
}

export function hypothesisSentence(project: ProjectState) {
  const { mechanism, behavior, experience, signal } = project.hypothesis;
  return `如果让玩家${slot(mechanism, "执行某种机制")}，那么他们会${slot(behavior, "产生某种行为或策略")}，进而感到${slot(experience, "目标体验")}；证据是${slot(signal, "可观察信号")}。`;
}

function slot(value: string, placeholder: string) {
  return value.trim() || `（${placeholder}：空）`;
}

export function buildMarkdown(project: ProjectState) {
  const labels: Record<TetradKey, string> = {
    narrative: "叙事",
    mechanics: "机制",
    aesthetics: "美学",
    technology: "技术",
  };
  const tetrad = (Object.keys(project.tetrad) as TetradKey[]).map((key) => {
    const answer = project.tetrad[key];
    return `### ${labels[key]}\n- 基础框架：${display(answer.foundation)}\n- 风格特点：${display(answer.signature)}\n- 对其他的支持：${display(answer.support)}`;
  }).join("\n\n");

  return `# ${project.name}\n\n## 最初想法\n${display(project.rawIdea)}\n\n## 三句话\n\n**一句话说明：什么游戏？**\n${gameplaySentence(project)}\n\n**一句话：什么体验**\n${experienceSentence(project)}\n\n**一句话：体验如何可行？**\n${hypothesisSentence(project)}\n\n## 游戏设计四大支柱\n\n${tetrad}\n\n## 玩家测构思\n\n### 第一句话\n玩家看到游戏名称、介绍图，会认为这是一个关于${display(project.player.firstLook.theme)}的${display(project.player.firstLook.genre)}游戏，会和${display(project.player.firstLook.references)}关联比较，并产生${display(project.player.firstLook.expectation)}的预期。\n\n### 第二句话\n玩家在体验游戏10分钟内${display(project.player.firstTen.fulfilment)}获得体验预期，${display(project.player.firstTen.outcome)}获得${display(project.player.firstTen.uniqueExperience)}，玩家因此而不会离开游戏，并产生${display(project.player.firstTen.nextGoal)}。\n\n### 第三句话\n玩家中后期体验的变化是来自${display(project.player.arc.source)}的出现，并最终在游戏结束时，获得${display(project.player.arc.finale)}的终极体验。\n`;
}

export function hasStepContent(project: ProjectState, step: StepId) {
  switch (step) {
    case "welcome": return false;
    case "idea": return Boolean(project.rawIdea.trim());
    case "sentences": return [
      ...Object.values(project.gameplay),
      ...Object.values(project.experience),
      ...Object.values(project.hypothesis),
    ].some((value) => value.trim());
    case "tetrad": return Object.values(project.tetrad).some((answer) => Object.values(answer).some((value) => value.trim()));
    case "player": return [
      ...Object.values(project.player.firstLook),
      project.player.firstTen.fulfilment,
      project.player.firstTen.outcome,
      project.player.firstTen.uniqueExperience,
      project.player.firstTen.nextGoal,
      project.player.arc.source,
      project.player.arc.finale,
    ].some((value) => value.trim());
    case "summary": return (["idea", "sentences", "tetrad", "player"] as StepId[])
      .some((sourceStep) => hasStepContent(project, sourceStep));
  }
}

function display(value: string) {
  return value.trim() || "（空）";
}
