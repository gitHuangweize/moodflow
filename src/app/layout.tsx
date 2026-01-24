import type { Metadata } from "next";
import { Noto_Serif_SC } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";

const notoSerifSC = Noto_Serif_SC({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-serif",
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  title: "MoodFlow - 随笔流",
  description: "一款基于“偶遇感”的文字分享社交平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${notoSerifSC.variable} font-serif`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
