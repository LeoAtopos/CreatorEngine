import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

const title = "CreatorEngine · Game Design Guide";
const description = "Turn an initial game idea into an editable design summary through three sentences, four design pillars, and a player-side concept.";

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
      images: [{ url: socialImage, width: 1728, height: 909, alt: "CreatorEngine: make a game idea clear, step by step" }],
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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
