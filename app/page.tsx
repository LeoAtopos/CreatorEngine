import type { Metadata } from "next";
import { CreatorEngine } from "./creator-engine";

export const metadata: Metadata = {
  title: "CreatorEngine · Game Design Guide",
  description: "Turn a vague game idea into a discussable, testable design summary through three sentences, four design pillars, and a player-side concept.",
};

export default function Home() {
  return <CreatorEngine />;
}
