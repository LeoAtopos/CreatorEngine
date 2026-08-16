import assert from "node:assert/strict";
import test from "node:test";
import {
  buildMarkdown,
  emptyProject,
  experienceSentence,
  gameplaySentence,
  hasStepContent,
  hypothesisSentence,
  isStepComplete,
  normalizeProject,
} from "../app/creator-engine-model.ts";
import { creationSteps, nextStep, previousStep, steps } from "../app/creator-engine-nodes.ts";

test("v4 follows the five-page creation path", () => {
  const project = emptyProject();
  assert.equal(project.version, 4);
  assert.equal(project.currentStep, "welcome");
  assert.equal(steps.length, 6);
  assert.equal(creationSteps.length, 5);
  assert.deepEqual(creationSteps.map((step) => step.id), ["idea", "sentences", "tetrad", "player", "summary"]);
  assert.equal(nextStep("sentences"), "tetrad");
  assert.equal(previousStep("idea"), "welcome");
});

test("the three sentence templates preserve their distinct design jobs", () => {
  const project = emptyProject();
  project.gameplay = { identity: "修复机器人", verb: "拆解并重组废墟", goal: "重建移动城市", constraint: "每次修复都会耗尽另一处能源" };
  project.experience = { audience: "喜欢系统实验的玩家", feeling: "谨慎掌控与意外发现", dynamic: "不断权衡城市模块", alternative: "线性剧情奖励" };
  project.hypothesis = { mechanism: "让能源在模块间不可逆转移", behavior: "形成不同的修复优先级", experience: "承担后果的掌控感", signal: "玩家能解释取舍并采用两种以上策略" };

  assert.match(gameplaySentence(project), /玩家作为修复机器人/);
  assert.match(experienceSentence(project), /喜欢系统实验的玩家/);
  assert.match(hypothesisSentence(project), /证据是玩家能解释取舍/);
  assert.equal(isStepComplete(project, "sentences"), true);
  assert.equal(isStepComplete(project, "tetrad"), false);
});

test("normalization rejects incompatible data and markdown exports the designed sections", () => {
  const fallback = normalizeProject({ version: 3, rawIdea: "旧数据" });
  assert.equal(fallback.version, 4);
  assert.equal(fallback.rawIdea, "");

  const project = emptyProject();
  project.name = "移动城市";
  project.rawIdea = "拆解废墟，重建一座不断前进的城市。";
  const markdown = buildMarkdown(project);
  assert.match(markdown, /^# 移动城市/m);
  assert.match(markdown, /## 三句话/);
  assert.match(markdown, /## 游戏设计四大支柱/);
  assert.match(markdown, /## 玩家测构思/);
  assert.match(markdown, /（空）/);
  assert.equal(hasStepContent(project, "idea"), true);
  assert.equal(hasStepContent(project, "sentences"), false);
});

test("saved sentence sub-pages migrate into the merged sentence step", () => {
  const stored = emptyProject();
  stored.currentStep = "gameplay";
  const normalized = normalizeProject(stored);
  assert.equal(normalized.currentStep, "sentences");
});

test("old default player outcome does not make an otherwise blank page look filled", () => {
  const stored = emptyProject();
  stored.player.firstTen.outcome = "获得";
  const normalized = normalizeProject(stored);
  assert.equal(normalized.player.firstTen.outcome, "");
  assert.equal(hasStepContent(normalized, "player"), false);
});
