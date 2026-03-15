import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI CLI Agent — Intelligent Automation",
  description:
    "A powerful AI-driven CLI agent that automates tasks, writes code, and manages workflows with intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-[#0a0a0a] text-[#e0e0e0]">
        {children}
      </body>
    </html>
  );
}
