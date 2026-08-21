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
  parseMarkdownProject,
} from "../app/creator-engine-model.ts";
import { creationSteps, nextStep, previousStep, steps } from "../app/creator-engine-nodes.ts";
import { tetradReferenceGames } from "../app/creator-engine-tetrad-references.ts";

test("all reference sections use the same ten games in one fixed order", () => {
  assert.deepEqual(tetradReferenceGames.map((game) => game.title), [
    "《命运石之门》",
    "《塞尔达传说：旷野之息》",
    "《哈迪斯》",
    "《杀戮尖塔》",
    "《双人成行》",
    "《守望先锋》",
    "《星露谷物语》",
    "《地狱边境》",
    "《原神》",
    "《火箭联盟》",
  ]);

  for (const game of tetradReferenceGames) {
    for (const [section, fields] of Object.entries(game.sentence)) {
      for (const [field, copy] of Object.entries(fields)) {
        assert.ok(copy.length > 0, `${game.title} sentence ${section}.${field} needs content`);
      }
    }
    for (const [section, fields] of Object.entries(game.player)) {
      for (const [field, copy] of Object.entries(fields)) {
        assert.ok(copy.length > 0, `${game.title} player ${section}.${field} needs content`);
      }
    }
    assert.deepEqual(Object.keys(game.examples), ["narrative", "mechanics", "aesthetics", "technology"]);
    for (const [pillar, example] of Object.entries(game.examples)) {
      assert.ok(example.foundation.length > 0, `${game.title} ${pillar} needs a foundation`);
      assert.ok(example.signature.length > 0, `${game.title} ${pillar} needs a signature`);
      assert.equal(Object.keys(example.support).length, 3, `${game.title} ${pillar} needs three support notes`);
      assert.equal(Object.hasOwn(example.support, pillar), false, `${game.title} ${pillar} must only support the other pillars`);
    }
  }
});

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
  assert.match(gameplaySentence(project), /废墟，以重建移动城市/);
  assert.match(experienceSentence(project), /喜欢系统实验的玩家/);
  assert.match(experienceSentence(project), /不断权衡城市模块来实现，而不是依赖线性剧情奖励/);
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
  assert.match(markdown, /## 游戏侧构思/);
  assert.match(markdown, /叙事对机制的指导、支持或要求/);
  assert.match(markdown, /一句话：体验如何可行？/);
  assert.match(markdown, /并产生（空）的预期/);
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

test("downloaded markdown round-trips all editable data", () => {
  const project = emptyProject();
  project.name = "回环城";
  project.rawIdea = "每次修好一条街，另一条街就会改变。";
  project.gameplay = { identity: "城市修复师", verb: "拆解并重组街区", goal: "让居民回家", constraint: "地图会在夜里重排" };
  project.tetrad.narrative.foundation = "循环城市叙事";
  project.tetrad.narrative.signature = "每次重排揭示一段居民记忆";
  project.tetrad.narrative.support.mechanics = "让地图重排成为有意义的行动结果";
  project.tetrad.narrative.support.aesthetics = "让旧照片决定城市色彩";
  project.tetrad.narrative.support.technology = "需要按条件触发记忆片段";

  const loaded = parseMarkdownProject(buildMarkdown(project));
  assert.equal(loaded.name, project.name);
  assert.equal(loaded.rawIdea, project.rawIdea);
  assert.deepEqual(loaded.gameplay, project.gameplay);
  assert.deepEqual(loaded.tetrad.narrative, project.tetrad.narrative);
});

test("markdown loader supports exports created before embedded project data", () => {
  const project = emptyProject();
  project.name = "旧档案";
  project.rawIdea = "保留旧版 Markdown。";
  project.tetrad.narrative.foundation = "日式 Galgame";
  project.tetrad.narrative.signature = "选择推动角色分支";
  project.tetrad.narrative.support.mechanics = "选择即核心动作";
  project.tetrad.narrative.support.aesthetics = "立绘强调角色关系";
  project.tetrad.narrative.support.technology = "对话树记录分支";
  const withoutMetadata = buildMarkdown(project).replace(/\n<!-- creator-engine-data:[\s\S]*?-->\n?$/, "\n");

  const loaded = parseMarkdownProject(withoutMetadata);
  assert.equal(loaded.currentStep, "summary");
  assert.equal(loaded.name, "旧档案");
  assert.equal(loaded.rawIdea, "保留旧版 Markdown。");
  assert.equal(loaded.tetrad.narrative.foundation, "日式 Galgame");
  assert.equal(loaded.tetrad.narrative.support.technology, "对话树记录分支");
});

test("markdown loader keeps accepting the old support relation labels", () => {
  const project = emptyProject();
  project.tetrad.narrative.support.mechanics = "选择即核心动作";
  const legacyMarkdown = buildMarkdown(project)
    .replace(/的指导、支持或要求/g, "的支持")
    .replace(/\n<!-- creator-engine-data:[\s\S]*?-->\n?$/, "\n");

  const loaded = parseMarkdownProject(legacyMarkdown);
  assert.equal(loaded.tetrad.narrative.support.mechanics, "选择即核心动作");
});

test("old single support notes migrate into the separated support fields", () => {
  const stored = emptyProject();
  stored.tetrad.narrative.support = "旧版综合支持说明";
  const normalized = normalizeProject(stored);
  assert.equal(normalized.tetrad.narrative.support.mechanics, "旧版综合支持说明");
  assert.equal(normalized.tetrad.narrative.support.aesthetics, "旧版综合支持说明");
  assert.equal(normalized.tetrad.narrative.support.technology, "旧版综合支持说明");
});
