import type { Metadata } from "next";
import { CreatorEngine } from "./creator-engine";

export const metadata: Metadata = {
  title: "创作引擎 · 本地游戏设计工作台",
  description: "从最初想法到完整设计框架的本地、规则驱动游戏创作引擎。",
};

export default function Home() {
  return <CreatorEngine />;
}
