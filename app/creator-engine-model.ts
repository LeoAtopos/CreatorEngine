import type { StepId } from "./creator-engine-nodes";

export type TetradKey = "narrative" | "mechanics" | "aesthetics" | "technology";
export type Language = "zh" | "en";
export const TETRAD_RELATION_LABEL = "指导、支持或要求";
export const TETRAD_RELATION_LABEL_EN = "guidance, support, or requirements";

export type TetradAnswer = {
  foundation: string;
  signature: string;
  support: Record<TetradKey, string>;
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
      fulfilment: string;
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

const tetradKeys: TetradKey[] = ["narrative", "mechanics", "aesthetics", "technology"];

const blankSupport = (): Record<TetradKey, string> => ({
  narrative: "",
  mechanics: "",
  aesthetics: "",
  technology: "",
});

const blankTetrad = (): TetradAnswer => ({ foundation: "", signature: "", support: blankSupport() });

export function emptyProject(language: Language = "zh"): ProjectState {
  return {
    version: 4,
    currentStep: "welcome",
    name: language === "zh" ? "未命名游戏" : "Untitled Game",
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
      narrative: normalizeTetrad(tetrad.narrative, "narrative"),
      mechanics: normalizeTetrad(tetrad.mechanics, "mechanics"),
      aesthetics: normalizeTetrad(tetrad.aesthetics, "aesthetics"),
      technology: normalizeTetrad(tetrad.technology, "technology"),
    },
    player: {
      firstLook: {
        theme: text(firstLook.theme),
        genre: text(firstLook.genre),
        references: text(firstLook.references),
        expectation: text(firstLook.expectation),
      },
      firstTen: {
        fulfilment: text(firstTen.fulfilment),
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

function normalizeTetrad(value: unknown, dimension: TetradKey): TetradAnswer {
  const source = record(value);
  const support = record(source.support);
  const legacySupport = text(source.support);
  return {
    foundation: text(source.foundation),
    signature: text(source.signature),
    support: Object.fromEntries(tetradKeys.map((target) => [
      target,
      target === dimension ? "" : text(support[target]) || legacySupport,
    ])) as Record<TetradKey, string>,
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
      narrative: { foundation: text(dimensions.narrative), signature: "", support: blankSupport() },
      mechanics: { foundation: text(dimensions.mechanics), signature: "", support: blankSupport() },
      aesthetics: { foundation: text(dimensions.aesthetics), signature: "", support: blankSupport() },
      technology: { foundation: text(dimensions.technology), signature: "", support: blankSupport() },
    },
  };
}

const filled = (values: string[]) => values.every((value) => value.trim().length > 0);

export function isStepComplete(project: ProjectState, step: StepId): boolean {
  switch (step) {
    case "welcome": return true;
    case "idea": return Boolean(project.rawIdea.trim());
    case "sentences": return filled([
      ...Object.values(project.gameplay),
      ...Object.values(project.experience),
      ...Object.values(project.hypothesis),
    ]);
    case "tetrad": return tetradKeys.every((dimension) => {
      const answer = project.tetrad[dimension];
      return filled([
        answer.foundation,
        answer.signature,
        ...tetradKeys.filter((target) => target !== dimension).map((target) => answer.support[target]),
      ]);
    });
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

export function gameplaySentence(project: ProjectState, language: Language = "zh") {
  const { identity, verb, goal, constraint } = project.gameplay;
  return language === "zh"
    ? `玩家作为${slot(identity, "身份", language)}，反复${slot(verb, "核心动词", language)}，以${slot(goal, "目标", language)}；但${slot(constraint, "约束或反转", language)}。`
    : `As ${slot(identity, "identity", language)}, the player repeatedly ${slot(verb, "core action", language)} to ${slot(goal, "goal", language)}; but ${slot(constraint, "constraint or reversal", language)}.`;
}

export function experienceSentence(project: ProjectState, language: Language = "zh") {
  const { audience, feeling, dynamic, alternative } = project.experience;
  return language === "zh"
    ? `为${slot(audience, "目标玩家", language)}提供${slot(feeling, "核心感受", language)}，主要通过${slot(dynamic, "关键动态", language)}来实现，而不是依赖${slot(alternative, "常规方案", language)}。`
    : `For ${slot(audience, "target players", language)}, deliver ${slot(feeling, "core feeling", language)} primarily through ${slot(dynamic, "key dynamic", language)}, rather than relying on ${slot(alternative, "conventional approach", language)}.`;
}

export function hypothesisSentence(project: ProjectState, language: Language = "zh") {
  const { mechanism, behavior, experience, signal } = project.hypothesis;
  return language === "zh"
    ? `如果让玩家${slot(mechanism, "执行某种机制", language)}，那么他们会${slot(behavior, "产生某种行为或策略", language)}，进而感到${slot(experience, "目标体验", language)}；证据是${slot(signal, "可观察信号", language)}。`
    : `If players ${slot(mechanism, "perform a mechanism", language)}, they will ${slot(behavior, "adopt a behavior or strategy", language)}, and thereby feel ${slot(experience, "target experience", language)}; evidence: ${slot(signal, "observable signal", language)}.`;
}

function slot(value: string, placeholder: string, language: Language) {
  return value.trim() || (language === "zh" ? `（${placeholder}：空）` : `(${placeholder}: empty)`);
}

export function buildMarkdown(project: ProjectState, language: Language = "zh") {
  const labelsZh: Record<TetradKey, string> = {
    narrative: "叙事",
    mechanics: "机制",
    aesthetics: "美学",
    technology: "技术",
  };
  const labelsEn: Record<TetradKey, string> = {
    narrative: "Narrative",
    mechanics: "Mechanics",
    aesthetics: "Aesthetics",
    technology: "Technology",
  };
  const labels = language === "zh" ? labelsZh : labelsEn;
  const tetrad = (Object.keys(project.tetrad) as TetradKey[]).map((key) => {
    const answer = project.tetrad[key];
    const support = tetradKeys
      .filter((target) => target !== key)
      .map((target) => language === "zh"
        ? `- ${labels[key]}对${labels[target]}的${TETRAD_RELATION_LABEL}：${display(answer.support[target], language)}`
        : `- ${labels[key]}'s ${TETRAD_RELATION_LABEL_EN} for ${labels[target]}: ${display(answer.support[target], language)}`)
      .join("\n");
    return language === "zh"
      ? `### ${labels[key]}\n- 基础框架：${display(answer.foundation, language)}\n- 风格特点：${display(answer.signature, language)}\n${support}`
      : `### ${labels[key]}\n- Foundation: ${display(answer.foundation, language)}\n- Signature: ${display(answer.signature, language)}\n${support}`;
  }).join("\n\n");

  const encodedProject = encodeURIComponent(JSON.stringify(project));
  if (language === "zh") {
    return `# ${project.name}\n\n## 最初想法\n${display(project.rawIdea, language)}\n\n## 三句话\n\n**一句话说明：什么游戏？**\n${gameplaySentence(project, language)}\n\n**一句话：什么体验**\n${experienceSentence(project, language)}\n\n**一句话：体验如何可行？**\n${hypothesisSentence(project, language)}\n\n## 游戏设计四大支柱\n\n${tetrad}\n\n## 游戏侧构思\n\n### 第一句话\n玩家看到游戏名称、介绍图，会认为这是一个关于${display(project.player.firstLook.theme, language)}的${display(project.player.firstLook.genre, language)}游戏，会和${display(project.player.firstLook.references, language)}关联比较，并产生${display(project.player.firstLook.expectation, language)}的预期。\n\n### 第二句话\n玩家在体验游戏10分钟内${display(project.player.firstTen.fulfilment, language)}获得体验预期，${display(project.player.firstTen.outcome, language)}获得${display(project.player.firstTen.uniqueExperience, language)}，玩家因此而不会离开游戏，并产生${display(project.player.firstTen.nextGoal, language)}。\n\n### 第三句话\n玩家中后期体验的变化是来自${display(project.player.arc.source, language)}的出现，并最终在游戏结束时，获得${display(project.player.arc.finale, language)}的终极体验。\n\n<!-- creator-engine-data:${encodedProject} -->\n`;
  }

  return `# ${project.name}\n\n## Initial Idea\n${display(project.rawIdea, language)}\n\n## Three Sentences\n\n**One sentence: What game is it?**\n${gameplaySentence(project, language)}\n\n**One sentence: What experience?**\n${experienceSentence(project, language)}\n\n**One sentence: How can the experience work?**\n${hypothesisSentence(project, language)}\n\n## Four Pillars of Game Design\n\n${tetrad}\n\n## Player-Side Concept\n\n### Sentence One\nFrom the title and key art, players will expect a ${display(project.player.firstLook.genre, language)} game about ${display(project.player.firstLook.theme, language)}, compare it with ${display(project.player.firstLook.references, language)}, and anticipate ${display(project.player.firstLook.expectation, language)}.\n\n### Sentence Two\nWithin the first 10 minutes, players ${display(project.player.firstTen.fulfilment, language)} meet that expectation and ${display(project.player.firstTen.outcome, language)} gain ${display(project.player.firstTen.uniqueExperience, language)}. This gives them a reason to stay and makes them want to ${display(project.player.firstTen.nextGoal, language)}.\n\n### Sentence Three\nDuring the mid-to-late game, the experience changes through ${display(project.player.arc.source, language)}, ultimately delivering ${display(project.player.arc.finale, language)} by the end.\n\n<!-- creator-engine-data:${encodedProject} -->\n`;
}

export function parseMarkdownProject(markdown: string, language: Language = "zh"): ProjectState {
  const metadata = markdown.match(/<!--\s*creator-engine-data:([\s\S]*?)-->/i);
  if (metadata) {
    const decoded = JSON.parse(decodeURIComponent(metadata[1].trim())) as unknown;
    const source = record(decoded);
    if (source.version !== 4) throw new Error(language === "zh" ? "不支持的 CreatorEngine 数据版本" : "Unsupported CreatorEngine data version");
    return normalizeProject(decoded);
  }

  if (!/^## (?:游戏设计四大支柱|三句话|游戏侧构思|玩家\u6d4b构思|Four Pillars of Game Design|Three Sentences|Player-Side Concept)\s*$/m.test(markdown)) {
    throw new Error(language === "zh" ? "文件中没有可识别的 CreatorEngine Markdown 数据" : "No recognizable CreatorEngine Markdown data was found");
  }

  const project = emptyProject();
  const english = /^## (?:Four Pillars of Game Design|Three Sentences|Player-Side Concept)\s*$/m.test(markdown);
  project.currentStep = "summary";
  project.name = capture(markdown, /^#\s+(.+)$/m) || project.name;
  project.rawIdea = exportedValue(capture(markdown, english
    ? /^## Initial Idea\s*\r?\n([\s\S]*?)(?=\r?\n##\s)/m
    : /^## 最初想法\s*\r?\n([\s\S]*?)(?=\r?\n##\s)/m));

  assignSentence(markdown, english
    ? /As ([\s\S]*?), the player repeatedly ([\s\S]*?) to ([\s\S]*?); but ([\s\S]*?)\.\s*(?=\r?\n|$)/
    : /玩家作为([\s\S]*?)，反复([\s\S]*?)，以([\s\S]*?)；但([\s\S]*?)。\s*(?=\r?\n|$)/, (values) => {
    [project.gameplay.identity, project.gameplay.verb, project.gameplay.goal, project.gameplay.constraint] = values;
  });
  assignSentence(markdown, english
    ? /For ([\s\S]*?), deliver ([\s\S]*?) primarily through ([\s\S]*?), rather than relying on ([\s\S]*?)\.\s*(?=\r?\n|$)/
    : /为([\s\S]*?)提供([\s\S]*?)，主要通过([\s\S]*?)来实现，而不是依赖([\s\S]*?)。\s*(?=\r?\n|$)/, (values) => {
    [project.experience.audience, project.experience.feeling, project.experience.dynamic, project.experience.alternative] = values;
  });
  assignSentence(markdown, english
    ? /If players ([\s\S]*?), they will ([\s\S]*?), and thereby feel ([\s\S]*?); evidence: ([\s\S]*?)\.\s*(?=\r?\n|$)/
    : /如果让玩家([\s\S]*?)，那么他们会([\s\S]*?)，进而感到([\s\S]*?)；证据是([\s\S]*?)。\s*(?=\r?\n|$)/, (values) => {
    [project.hypothesis.mechanism, project.hypothesis.behavior, project.hypothesis.experience, project.hypothesis.signal] = values;
  });

  const labels: Record<TetradKey, string> = english
    ? { narrative: "Narrative", mechanics: "Mechanics", aesthetics: "Aesthetics", technology: "Technology" }
    : { narrative: "叙事", mechanics: "机制", aesthetics: "美学", technology: "技术" };
  tetradKeys.forEach((dimension) => {
    const block = capture(markdown, new RegExp(`^### ${labels[dimension]}\\s*\\r?\\n([\\s\\S]*?)(?=\\r?\\n###\\s|\\r?\\n##\\s|(?![\\s\\S]))`, "m"));
    if (!block) return;
    project.tetrad[dimension].foundation = exportedValue(bullet(block, english ? "Foundation" : "基础框架"));
    project.tetrad[dimension].signature = exportedValue(bullet(block, english ? "Signature" : "风格特点"));
    if (english) {
      tetradKeys.filter((target) => target !== dimension).forEach((target) => {
        project.tetrad[dimension].support[target] = exportedValue(bullet(block, `${labels[dimension]}'s ${TETRAD_RELATION_LABEL_EN} for ${labels[target]}`));
      });
      return;
    }
    const legacySupport = exportedValue(bullet(block, `对其他的${TETRAD_RELATION_LABEL}`)) || exportedValue(bullet(block, "对其他的支持"));
    tetradKeys.filter((target) => target !== dimension).forEach((target) => {
      const relation = `${labels[dimension]}对${labels[target]}的${TETRAD_RELATION_LABEL}`;
      const legacyRelation = `${labels[dimension]}对${labels[target]}的支持`;
      project.tetrad[dimension].support[target] = exportedValue(bullet(block, relation)) || exportedValue(bullet(block, legacyRelation)) || legacySupport;
    });
  });

  assignSentence(markdown, english
    ? /From the title and key art, players will expect a ([\s\S]*?) game about ([\s\S]*?), compare it with ([\s\S]*?), and anticipate ([\s\S]*?)\./
    : /玩家看到游戏名称、介绍图，会认为这是一个关于([\s\S]*?)的([\s\S]*?)游戏，会和([\s\S]*?)关联比较，并产生([\s\S]*?)的预期。/, (values) => {
    if (english) {
      const [genre, theme, references, expectation] = values;
      [project.player.firstLook.theme, project.player.firstLook.genre, project.player.firstLook.references, project.player.firstLook.expectation] = [theme, genre, references, expectation];
    } else {
      [project.player.firstLook.theme, project.player.firstLook.genre, project.player.firstLook.references, project.player.firstLook.expectation] = values;
    }
  });
  assignSentence(markdown, english
    ? /Within the first 10 minutes, players ([\s\S]*?) meet that expectation and ([\s\S]*?) gain ([\s\S]*?)\. This gives them a reason to stay and makes them want to ([\s\S]*?)\./
    : /玩家在体验游戏10分钟内([\s\S]*?)获得体验预期，([\s\S]*?)获得([\s\S]*?)，玩家因此而不会离开游戏，并产生([\s\S]*?)。/, (values) => {
    const [fulfilment, outcome, uniqueExperience, nextGoal] = values;
    project.player.firstTen.fulfilment = fulfilment;
    project.player.firstTen.outcome = outcome;
    project.player.firstTen.uniqueExperience = uniqueExperience;
    project.player.firstTen.nextGoal = nextGoal;
  });
  assignSentence(markdown, english
    ? /During the mid-to-late game, the experience changes through ([\s\S]*?), ultimately delivering ([\s\S]*?) by the end\./
    : /玩家中后期体验的变化是来自([\s\S]*?)的出现，并最终在游戏结束时，获得([\s\S]*?)的终极体验。/, (values) => {
    [project.player.arc.source, project.player.arc.finale] = values;
  });

  project.updatedAt = new Date().toISOString();
  return normalizeProject(project);
}

function capture(source: string, pattern: RegExp) {
  return source.match(pattern)?.[1]?.trim() ?? "";
}

function bullet(source: string, label: string) {
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return capture(source, new RegExp(`^- ${escapedLabel}[:：]\\s*([\\s\\S]*?)(?=\\r?\\n- |(?![\\s\\S]))`, "m"));
}

function exportedValue(value: string) {
  const trimmed = value.trim();
  return /^（(?:[^：）]+：)?空）$/.test(trimmed) ? "" : trimmed;
}

function assignSentence(source: string, pattern: RegExp, assign: (values: string[]) => void) {
  const match = source.match(pattern);
  if (match) assign(match.slice(1).map(exportedValue));
}

export function hasStepContent(project: ProjectState, step: StepId): boolean {
  switch (step) {
    case "welcome": return false;
    case "idea": return Boolean(project.rawIdea.trim());
    case "sentences": return [
      ...Object.values(project.gameplay),
      ...Object.values(project.experience),
      ...Object.values(project.hypothesis),
    ].some((value) => value.trim());
    case "tetrad": return Object.values(project.tetrad).some((answer) =>
      answer.foundation.trim() || answer.signature.trim() || Object.values(answer.support).some((value) => value.trim()));
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

function display(value: string, language: Language) {
  return value.trim() || (language === "zh" ? "（空）" : "(empty)");
}
