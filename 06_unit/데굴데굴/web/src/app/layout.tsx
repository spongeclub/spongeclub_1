import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "스폰지클럽 1기 — 주차별 미션",
  description: '"딸깍 한 번으로는 갈 수 없는 곳까지, 함께"',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
