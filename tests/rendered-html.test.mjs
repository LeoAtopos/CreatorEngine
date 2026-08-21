import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the simplified CreatorEngine creation guide", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<html lang="zh-CN">/i);
  assert.match(html, /把游戏想法说清楚/);
  assert.match(html, /适合言语化设计习惯的制作人/);
  assert.match(html, /作者：李欧丁/);
  assert.match(html, /github\.com\/LeoAtopos\/CreatorEngine/);
  assert.match(html, /最初想法/);
  assert.match(html, /三句话/);
  assert.match(html, /四大支柱/);
  assert.match(html, /游戏侧构思/);
  assert.match(html, /设计摘要/);
  assert.doesNotMatch(html, /可留空/);
});
