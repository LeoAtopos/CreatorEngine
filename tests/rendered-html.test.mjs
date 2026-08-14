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

test("server-renders the local game creation starting point", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="zh-CN">/i);
  assert.match(html, /<title>创作引擎 · 本地游戏设计工作台<\/title>/i);
  assert.match(html, /先把脑海里的东西写下来/);
  assert.match(html, /不联网 · 不使用 AI/);
  assert.match(html, /展开设计路径/);
  assert.match(html, /展开当前设计状态/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("the local workflow contains every required design stage and no AI request", async () => {
  const source = await readFile(new URL("../app/creator-engine.tsx", import.meta.url), "utf8");

  for (const requiredText of [
    "最初想法",
    "澄清与改写",
    "玩家 Fantasy",
    "设计框架",
    "四类设计点",
    "游戏设计方案",
    "目标用户",
    "体验差异化 X",
    "叙事设计点",
    "机制设计点",
    "美学设计点",
    "技术设计点",
    "参考提示与案例",
    "下载设计方案",
  ]) {
    assert.match(source, new RegExp(requiredText));
  }

  assert.match(source, /window\.localStorage/);
  assert.doesNotMatch(source, /\bfetch\s*\(|openai|anthropic|chatgpt/i);
});
