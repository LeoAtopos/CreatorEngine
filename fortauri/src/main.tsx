import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CreatorEngine } from "../../app/creator-engine";
import "../../app/globals.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("CreatorEngine root element was not found.");
}

createRoot(root).render(
  <StrictMode>
    <CreatorEngine />
  </StrictMode>,
);
