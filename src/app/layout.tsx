import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "不動產大事紀 | Real Estate Timeline",
  description: "市場情報與歷史事件彙整",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className="antialiased bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
