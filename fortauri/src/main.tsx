import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { open, save } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { CreatorEngine } from "../../app/creator-engine";
import "../../app/globals.css";

if ("__TAURI_INTERNALS__" in window) {
  const fileNameFromPath = (path: string) => path.split(/[\\/]/).pop() || path;

  const openMarkdownFile: NonNullable<Window["__CREATOR_ENGINE_OPEN_MARKDOWN__"]> = async ({ dialogTitle, filterName }) => {
    const path = await open({
      title: dialogTitle,
      multiple: false,
      directory: false,
      filters: [{ name: filterName, extensions: ["md"] }],
    });

    if (!path || Array.isArray(path)) return null;

    return { content: await readTextFile(path), fileName: fileNameFromPath(path), path };
  };

  const saveMarkdownFile: NonNullable<Window["__CREATOR_ENGINE_SAVE_MARKDOWN__"]> = async ({ content, defaultFileName, dialogTitle, filterName, targetPath }) => {
    const path = targetPath || await save({
      title: dialogTitle,
      defaultPath: defaultFileName,
      filters: [{ name: filterName, extensions: ["md"] }],
    });

    if (!path) return { saved: false };

    await writeTextFile(path, content);
    return { saved: true, fileName: fileNameFromPath(path), path };
  };

  window.__CREATOR_ENGINE_OPEN_MARKDOWN__ = openMarkdownFile;
  window.__CREATOR_ENGINE_SAVE_MARKDOWN__ = saveMarkdownFile;
}

const root = document.getElementById("root");

if (!root) {
  throw new Error("CreatorEngine root element was not found.");
}

createRoot(root).render(
  <StrictMode>
    <CreatorEngine />
  </StrictMode>,
);
