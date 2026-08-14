import assert from "node:assert/strict";
import test from "node:test";
import {
  buildMarkdown,
  deriveConceptSentence,
  deriveIssues,
  emptyProject,
  migrateLegacyProject,
  targetForSessionGoal,
} from "../app/creator-engine-model.ts";
import { nodes } from "../app/creator-engine-nodes.ts";

test("the v3 project starts with an adaptive entry and evidence-aware state", () => {
  const project = emptyProject();
  assert.equal(project.version, 3);
  assert.equal(project.currentNodeId, "S0");
  assert.equal(project.evidenceStatus, "idea");
  assert.equal(project.pillars.length, 2);
  assert.equal(project.tasks.length, 2);
  assert.equal(nodes.length, 38);
  assert.equal(nodes.some((node) => node.id === "S1" && node.title === "确定本次目标"), true);
});

test("legacy v2 content migrates without turning design dimensions into project pillars", () => {
  const project = migrateLegacyProject({
    version: 2,
    currentStage: "summary",
    rawIdea: "堆叠奇怪物件",
    refine: {
      spark: "摇摇欲坠但能救回",
      playerAction: "挑选并堆叠物件",
      experience: "紧张后释然",
      refinedIdea: "一个物理堆叠挑战",
    },
    fantasyId: "mastery",
    fantasyStatement: "掌握复杂受力",
    genreIds: ["puzzle"],
    audienceIds: ["challenge"],
    xId: "rule",
    xStatement: "每次放置改变全局受力",
    pillars: { narrative: "遗物留下历史", mechanics: "堆叠与调整", aesthetics: "材质与吱响", technology: "稳定物理" },
  });

  assert.equal(project.currentNodeId, "D8");
  assert.equal(project.rawIdea, "堆叠奇怪物件");
  assert.equal(project.dimensions.mechanics, "堆叠与调整");
  assert.equal(project.pillars.filter((pillar) => pillar.name).length, 0);
  assert.ok(project.reviewNodes.includes("A3"));
});

test("the session goal router respects prerequisites and then enters the requested phase", () => {
  const project = emptyProject();
  project.sessionGoal = "structure";
  assert.equal(targetForSessionGoal(project), "A0");

  project.rawIdea = "在不断变化的空间里建立一条安全路线";
  project.spark = "路线会被过去的选择永久改变";
  project.coreVerb = "规划";
  project.coreObject = "路线";
  project.shortGoal = "抵达下一个安全点";
  project.outcomeState = "路线和风险分布发生变化";
  project.constraint = "每次选择都会封闭另一条路线";
  project.experiences = ["策略"];
  assert.equal(targetForSessionGoal(project), "B1");

  project.sessionGoal = "act";
  assert.equal(targetForSessionGoal(project), "D0");
});

test("the rules engine surfaces blocking gaps and turns a concept into an export", () => {
  const project = emptyProject();
  let issues = deriveIssues(project);
  assert.ok(issues.some((issue) => issue.id === "raw" && issue.severity === "blocking"));

  project.rawIdea = "堆叠遗物";
  project.coreVerb = "堆叠";
  project.coreObject = "遗物";
  project.shortGoal = "重建高塔";
  project.constraint = "每次放置都会改变全局受力";
  project.conceptSentence = deriveConceptSentence(project);
  issues = deriveIssues(project);

  assert.doesNotMatch(project.conceptSentence, /执行核心动作/);
  assert.equal(issues.some((issue) => issue.id === "raw"), false);
  const markdown = buildMarkdown(project);
  assert.match(markdown, /## 一、概念简报/);
  assert.match(markdown, /## 二、设计骨架/);
  assert.match(markdown, /## 三、判断单/);
  assert.match(markdown, /## 四、行动图/);
  assert.match(markdown, /## 五、证据与迭代/);
});
