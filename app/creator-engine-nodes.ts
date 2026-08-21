export type StepId = "welcome" | "idea" | "sentences" | "tetrad" | "player" | "summary";

export type StepMeta = {
  id: StepId;
  index: number;
  short: string;
  title: string;
};

export const steps: StepMeta[] = [
  { id: "welcome", index: 0, short: "欢迎", title: "让一个模糊想法，逐渐成为可以制作的游戏。" },
  { id: "idea", index: 1, short: "最初想法", title: "先保留最初的火花。" },
  { id: "sentences", index: 2, short: "三句话", title: "用三句话说明游戏核心。" },
  { id: "tetrad", index: 3, short: "四大支柱", title: "游戏设计四大支柱" },
  { id: "player", index: 4, short: "游戏侧构思", title: "游戏侧构思" },
  { id: "summary", index: 5, short: "设计摘要", title: "设计摘要" },
];

export const creationSteps = steps.filter((step) => step.id !== "welcome");

export const stepMap = Object.fromEntries(steps.map((step) => [step.id, step])) as Record<StepId, StepMeta>;

export function nextStep(id: StepId): StepId {
  const index = steps.findIndex((step) => step.id === id);
  return steps[Math.min(steps.length - 1, Math.max(0, index + 1))].id;
}

export function previousStep(id: StepId): StepId {
  const index = steps.findIndex((step) => step.id === id);
  return steps[Math.max(0, index - 1)].id;
}
