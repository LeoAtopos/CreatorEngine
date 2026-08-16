import type { Metadata } from "next";
import { CreatorEngine } from "./creator-engine";

export const metadata: Metadata = {
  title: "创作引擎 · 游戏构思向导",
  description: "用三句话、游戏设计四大支柱和玩家测构思，把模糊游戏想法变成可讨论、可验证的设计摘要。",
};

export default function Home() {
  return <CreatorEngine />;
}
