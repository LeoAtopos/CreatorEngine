import type { Language, TetradKey } from "./creator-engine-model";

export const LANGUAGE_STORAGE_KEY = "creator-engine.language";

export function detectSystemLanguage(): Language {
  if (typeof navigator === "undefined") return "en";
  return (navigator.languages?.[0] ?? navigator.language ?? "en").toLowerCase().startsWith("zh") ? "zh" : "en";
}

const zh = {
  brand: "创作引擎", backHome: "返回欢迎页", progress: "当前步骤进度", start: "开始",
  load: "载入", save: "保存", saveShortcut: "保存（Ctrl+S）", saved: "已保存", unsaved: "有未保存修改", saveCompleted: "保存完成", reading: "读取中", restart: "重新开始", intro: "使用引导", closeIntro: "关闭使用引导", introTitle: "CreatorEngine 使用引导", switchLanguage: "Switch to English", switchLabel: "EN",
  flow: "构思步骤", aggregate: "汇总", filled: "已填", empty: "空", stepsAria: "创作步骤",
  viewReference: "查看参考", viewGuide: "填写指引", guide: "填写指引", closeGuide: "关闭填写指引", previous: "上一步", next: "下一步", author: "作者：李欧丁，Github：",
  restartConfirm: "重新开始会清除这台设备上当前项目的全部填写内容，确定继续吗？",
  loadConfirm: "载入会替换当前项目的填写内容，确定继续吗？", loaded: "已载入", loadFailed: "载入失败", readFailed: "无法读取这个文件",
  saveFailed: "保存失败", cannotSave: "无法保存这个文件",
  welcomeTitle: "把游戏想法说清楚。", welcomeSubtitle: "适合言语化设计习惯的制作人，以及需要强沟通同步的团队。",
  projectName: "项目名称", enter: "请输入...", begin: "开始构思", initialIdea: "最初想法",
  sentenceTabs: "三句话", sentenceMeta: {
    gameplay: { label: "什么游戏", title: "一句话说明：什么游戏？" },
    experience: { label: "什么体验", title: "一句话：什么体验" },
    hypothesis: { label: "如何验证", title: "一句话：体验如何可行？" },
  },
  fields: {
    identity: "身份", verb: "核心动作", goal: "目标", constraint: "约束或反转",
    audience: "目标玩家", feeling: "核心感受", dynamic: "关键动态", alternative: "不依赖的常规方案",
    mechanism: "执行的机制", behavior: "产生的行为或策略", experience: "目标体验", signal: "可观察信号",
    theme: "主题", genre: "游戏类型", references: "关联游戏", expectation: "体验预期",
    fulfilment: "会 / 不会", outcome: "还能 / 而是", uniqueExperience: "独特体验", nextGoal: "目标 / 期待",
    source: "机制 / 内容", finale: "游戏体验",
  },
  tetradTabs: "游戏设计四大支柱", pillars: { narrative: "叙事", mechanics: "机制", aesthetics: "美学", technology: "技术" } as Record<TetradKey, string>,
  foundation: "基础框架（简短短语）", signature: "风格特点", relation: "指导、支持或要求",
  placeholders: { narrative: "如：日式 Galgame", mechanics: "如：开放世界探索", aesthetics: "如：3D 卡通渲染", technology: "如：多平台 Unity" } as Record<TetradKey, string>,
  playerTabs: "玩家侧三句话", playerMeta: { firstLook: "第一句话", firstTen: "第二句话", arc: "第三句话" },
  finish: "完成", edit: "编辑", copied: "已复制", copy: "复制", download: "下载",
  threeSentences: "三句话", fourPillars: "游戏设计四大支柱", playerConcept: "玩家侧构思", emptyDisplay: "（空）",
  reference: "参考", closeReference: "关闭参考", ideaReference: "最初想法参考",
  ideaExamples: [
    ["动作火花", "玩家用一根会弯曲的钓线，在风暴里的高楼之间摆荡和救人。"],
    ["画面火花", "一座每天清晨都会重组街道的城市，居民靠在门上留下粉笔记号生活。"],
    ["关系火花", "两名玩家看见不同的世界规则，只能靠描述帮助对方通过同一空间。"],
    ["世界条件", "所有物品一旦被命名就会永久改变用途，玩家必须谨慎使用语言。"],
    ["情绪火花", "玩家照料一只注定会离开的生物，告别越近，它学会的能力越强。"],
    ["结构火花", "每次失败都会让关卡更容易，却也会让最终结局失去一部分可能性。"],
  ] as Array<[string, string]>,
  sentenceReference: "三句话参考", sentenceReferenceIntro: "以下 10 款游戏与四大支柱保持相同顺序，每款都分别示范“什么游戏、什么体验、如何验证”。",
  playerReference: "玩家侧构思参考", playerReferenceIntro: "以下 10 款游戏与三句话、四大支柱保持相同顺序，每款都分别示范玩家看到游戏、体验十分钟和进入中后期时的变化。",
  tetradReferenceTitles: { narrative: "叙事支柱参考", mechanics: "机制支柱参考", aesthetics: "美学支柱参考", technology: "技术支柱参考" } as Record<TetradKey, string>,
  tetradReferenceIntros: {
    narrative: "基础框架只写一个简短的叙事主题或类型短语，再说明它如何分别对另外三根支柱形成指导、支持或要求。以下 10 款游戏与其他支柱保持相同顺序，便于横向比较。",
    mechanics: "基础框架只写一个简短的玩法类型或核心机制短语，再说明它如何分别对另外三根支柱形成指导、支持或要求。以下 10 款游戏与其他支柱保持相同顺序，便于横向比较。",
    aesthetics: "基础框架只写一个简短的视觉、听觉或整体风格短语，再说明它如何分别对另外三根支柱形成指导、支持或要求。以下 10 款游戏与其他支柱保持相同顺序，便于横向比较。",
    technology: "基础框架只写一个简短的引擎、平台或关键技术方案短语，再说明它如何分别对另外三根支柱形成指导、支持或要求。以下 10 款游戏与其他支柱保持相同顺序，便于横向比较。",
  } as Record<TetradKey, string>,
  whatGame: "什么游戏", whatExperience: "什么体验", howValidate: "如何验证",
  sentenceOne: "第一句", sentenceTwo: "第二句", sentenceThree: "第三句", foundationShort: "基础框架", signatureShort: "风格特点",
  summaryFile: "游戏设计摘要", dialogTitle: "保存游戏设计摘要", loadDialogTitle: "载入游戏设计摘要", markdownDocument: "Markdown 文档",
};

const en: typeof zh = {
  brand: "CreatorEngine", backHome: "Return to welcome page", progress: "Current step progress", start: "Start",
  load: "Load", save: "Save", saveShortcut: "Save (Ctrl+S)", saved: "Saved", unsaved: "Unsaved changes", saveCompleted: "Saved", reading: "Loading", restart: "Start Over", intro: "Guide", closeIntro: "Close guide", introTitle: "CreatorEngine Guide", switchLanguage: "切换到中文", switchLabel: "中文",
  flow: "Design Flow", aggregate: "Summary", filled: "Filled", empty: "Empty", stepsAria: "Creation steps",
  viewReference: "View Examples", viewGuide: "Filling Guide", guide: "Filling Guide", closeGuide: "Close filling guide", previous: "Previous", next: "Next", author: "Author: 李欧丁, GitHub: ",
  restartConfirm: "Starting over will clear every answer in the current project on this device. Continue?",
  loadConfirm: "Loading this file will replace every answer in the current project. Continue?", loaded: "Loaded", loadFailed: "Load failed", readFailed: "This file could not be read",
  saveFailed: "Save failed", cannotSave: "This file could not be saved",
  welcomeTitle: "Make your game idea clear.", welcomeSubtitle: "For creators who design through words, and teams that depend on strong, shared communication.",
  projectName: "Project Name", enter: "Enter text...", begin: "Start Designing", initialIdea: "Initial Idea",
  sentenceTabs: "Three sentences", sentenceMeta: {
    gameplay: { label: "What Game", title: "One sentence: What game is it?" },
    experience: { label: "Experience", title: "One sentence: What experience?" },
    hypothesis: { label: "How to Test", title: "One sentence: How can the experience work?" },
  },
  fields: {
    identity: "Player identity", verb: "Core action", goal: "Goal", constraint: "Constraint or reversal",
    audience: "Target players", feeling: "Core feeling", dynamic: "Key dynamic", alternative: "Conventional approach to avoid",
    mechanism: "Mechanism performed", behavior: "Resulting behavior or strategy", experience: "Target experience", signal: "Observable signal",
    theme: "Theme", genre: "Game genre", references: "Comparable games", expectation: "Experience expectation",
    fulfilment: "Will / will not", outcome: "And will / but will instead", uniqueExperience: "Distinct experience", nextGoal: "Goal / anticipation",
    source: "Mechanic / content", finale: "Game experience",
  },
  tetradTabs: "Four pillars of game design", pillars: { narrative: "Narrative", mechanics: "Mechanics", aesthetics: "Aesthetics", technology: "Technology" },
  foundation: "Foundation (short phrase)", signature: "Signature qualities", relation: "guidance, support, or requirements",
  placeholders: { narrative: "e.g. Japanese romance visual novel", mechanics: "e.g. open-world exploration", aesthetics: "e.g. stylized 3D rendering", technology: "e.g. cross-platform Unity" },
  playerTabs: "Three player-side sentences", playerMeta: { firstLook: "Sentence One", firstTen: "Sentence Two", arc: "Sentence Three" },
  finish: "Done", edit: "Edit", copied: "Copied", copy: "Copy", download: "Download",
  threeSentences: "Three Sentences", fourPillars: "Four Pillars of Game Design", playerConcept: "Player-Side Concept", emptyDisplay: "(empty)",
  reference: "Examples", closeReference: "Close examples", ideaReference: "Initial Idea Examples",
  ideaExamples: [
    ["Action spark", "Players swing between storm-battered towers with a flexible fishing line to rescue people."],
    ["Visual spark", "A city rearranges its streets every dawn, so residents navigate by chalk marks left on doors."],
    ["Relationship spark", "Two players see different world rules and must describe them to cross the same space."],
    ["World rule", "Naming an object permanently changes its purpose, so language must be used carefully."],
    ["Emotional spark", "Players care for a creature destined to leave; the closer goodbye gets, the stronger it becomes."],
    ["Structural spark", "Every failure makes the levels easier but removes one possibility from the ending."],
  ],
  sentenceReference: "Three-Sentence Examples", sentenceReferenceIntro: "The same 10 games appear in the same order as the four-pillar examples. Each demonstrates the game, experience, and testable hypothesis sentences.",
  playerReference: "Player-Side Concept Examples", playerReferenceIntro: "The same 10 games appear in the same order as the three-sentence and four-pillar examples. Each demonstrates first impression, first ten minutes, and mid-to-late progression.",
  tetradReferenceTitles: { narrative: "Narrative Pillar Examples", mechanics: "Mechanics Pillar Examples", aesthetics: "Aesthetics Pillar Examples", technology: "Technology Pillar Examples" },
  tetradReferenceIntros: {
    narrative: "Use a very short narrative theme or genre phrase as the foundation, then state its guidance, support, or requirements for the other three pillars. The same 10 games stay in a fixed order for comparison.",
    mechanics: "Use a very short gameplay type or core-mechanic phrase as the foundation, then state its guidance, support, or requirements for the other three pillars. The same 10 games stay in a fixed order for comparison.",
    aesthetics: "Use a very short visual, audio, or overall style phrase as the foundation, then state its guidance, support, or requirements for the other three pillars. The same 10 games stay in a fixed order for comparison.",
    technology: "Use a very short engine, platform, or key technical approach as the foundation, then state its guidance, support, or requirements for the other three pillars. The same 10 games stay in a fixed order for comparison.",
  },
  whatGame: "What game", whatExperience: "What experience", howValidate: "How to test",
  sentenceOne: "Sentence one", sentenceTwo: "Sentence two", sentenceThree: "Sentence three", foundationShort: "Foundation", signatureShort: "Signature qualities",
  summaryFile: "Game Design Summary", dialogTitle: "Save Game Design Summary", loadDialogTitle: "Load Game Design Summary", markdownDocument: "Markdown document",
};

export type UiCopy = typeof zh;

export function getUiCopy(language: Language): UiCopy {
  return language === "zh" ? zh : en;
}
