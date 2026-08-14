import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the adaptive CreatorEngine workbench", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="zh-CN">/i);
  assert.match(html, /<title>创作引擎 · 本地游戏设计工作台<\/title>/i);
  assert.match(html, /让当前最重要的问题浮上来/);
  assert.match(html, /澄清想法/);
  assert.match(html, /构建设计/);
  assert.match(html, /辅助判断/);
  assert.match(html, /形成路径/);
  assert.match(html, /展开设计路径/);
  assert.match(html, /展开当前设计状态/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("the local workflow covers concept, structure, judgment, action, and evidence", async () => {
  const [source, nodeSource, modelSource] = await Promise.all([
    readFile(new URL("../app/creator-engine.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/creator-engine-nodes.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/creator-engine-model.ts", import.meta.url), "utf8"),
  ]);

  for (const requiredText of [
    "澄清核心",
    "设计骨架",
    "判断与取舍",
    "行动路径",
    "证据迭代",
    "不可失去的火花",
    "玩家 Fantasy",
    "核心玩法句",
    "项目设计支柱",
    "原子玩家循环",
    "设计、动态与体验",
    "规则预期与参考",
    "可行性分面",
    "最大风险",
    "可验证假设",
    "最小原型",
    "实际观察",
    "迭代决定",
  ]) {
    assert.match(nodeSource, new RegExp(requiredText));
  }

  for (const requiredText of [
    "暂作假设",
    "延期回答",
    "不适用",
    "复制完整方案",
    "下载设计方案",
  ]) {
    assert.match(source, new RegExp(requiredText));
  }

  assert.match(source, /window\.localStorage/);
  assert.match(modelSource, /migrateLegacyProject/);
  assert.match(modelSource, /creator-engine\.game-design\.v2/);
  assert.match(modelSource, /creator-engine\.game-design\.v3/);
  assert.match(modelSource, /hypothesis|supported|contradicted/);
  assert.doesNotMatch(`${source}\n${nodeSource}\n${modelSource}`, /\bfetch\s*\(|openai|anthropic|chatgpt/i);
});
