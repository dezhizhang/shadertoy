import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shaderlab — every pixel, a poem.",
  description: "An open canvas for live GLSL — 118,805 shaders running.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="bg-ink text-bone">
      <body
        className={`${fraunces.variable} ${jetbrainsMono.variable} ${bricolage.variable} font-sans antialiased selection:bg-acid selection:text-ink`}
      >
        {children}
      </body>
    </html>
  );
}
