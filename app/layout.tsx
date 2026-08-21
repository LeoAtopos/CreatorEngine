import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

const title = "创作引擎 · 游戏构思向导";
const description = "用三句话、游戏设计四大支柱与游戏侧构思，把最初想法整理成可编辑的设计摘要。";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  const origin = host ? `${protocol}://${host}` : "https://creator-engine.local";
  const socialImage = `${origin}/og.png`;

  return {
    title,
    description,
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      type: "website",
      title,
      description,
      images: [{ url: socialImage, width: 1728, height: 909, alt: "创作引擎：把游戏想法一步一步说清楚" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [socialImage] },
  };
}

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
