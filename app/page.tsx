import type { Metadata } from "next";
import { CreatorEngine } from "./creator-engine";

export const metadata: Metadata = {
  title: "创作引擎 · 本地游戏设计工作台",
  description: "从模糊灵感到设计判断、最小原型和证据迭代的本地游戏创作工作台。",
};

export default function Home() {
  return <CreatorEngine />;
}
