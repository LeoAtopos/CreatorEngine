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
  assert.match(html, /<html lang="en">/i);
  assert.match(html, /Make your game idea clear/);
  assert.match(html, /For creators who design through words/);
  assert.match(html, /Author: 李欧丁/);
  assert.match(html, /github\.com\/LeoAtopos\/CreatorEngine/);
  assert.match(html, /Initial Idea/);
  assert.match(html, /Three Sentences/);
  assert.match(html, /Four Pillars/);
  assert.match(html, /Player Side/);
  assert.match(html, /Design Summary/);
  assert.match(html, /aria-label="切换到中文"/);
});
