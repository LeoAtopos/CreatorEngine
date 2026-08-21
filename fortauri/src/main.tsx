import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { save } from "@tauri-apps/plugin-dialog";
import { writeTextFile } from "@tauri-apps/plugin-fs";
import { CreatorEngine } from "../../app/creator-engine";
import "../../app/globals.css";

if ("__TAURI_INTERNALS__" in window) {
  window.__CREATOR_ENGINE_SAVE_MARKDOWN__ = async ({ content, defaultFileName, dialogTitle, filterName }) => {
    const path = await save({
      title: dialogTitle,
      defaultPath: defaultFileName,
      filters: [{ name: filterName, extensions: ["md"] }],
    });

    if (!path) return false;

    await writeTextFile(path, content);
    return true;
  };
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
