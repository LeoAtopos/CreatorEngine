import { access, cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const source = fileURLToPath(new URL("../fortauri/dist", import.meta.url));
const destination = fileURLToPath(new URL("../forpages", import.meta.url));

await access(new URL("../fortauri/dist/index.html", import.meta.url), constants.R_OK);
await access(
  new URL("../fortauri/dist/creator-engine-intro.html", import.meta.url),
  constants.R_OK,
);

await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
await cp(source, destination, { recursive: true });

for (const fileName of ["index.html", "creator-engine-intro.html"]) {
  const fileUrl = new URL(`../forpages/${fileName}`, import.meta.url);
  const content = await readFile(fileUrl, "utf8");
  await writeFile(fileUrl, content.replace(/\r\n?/g, "\n"), "utf8");
}

await writeFile(new URL("../forpages/.nojekyll", import.meta.url), "\n", "utf8");

console.log(`GitHub Pages files synchronized in .${destination.slice(root.length)}`);
