import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "创作引擎 · 本地游戏设计工作台",
  description: "不联网、不使用 AI 的本地游戏创作引擎。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
