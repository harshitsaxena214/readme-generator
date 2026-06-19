import type { Metadata } from "next";
import { headingFont, bodyFont, monoFont } from "./fonts";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "README Wizard — AI-Powered README.md Generator",
  description:
    "Generate a complete, professional, and polished README.md for any GitHub repository in seconds using Google Gemini AI.",
  keywords: [
    "README generator",
    "GitHub README",
    "AI documentation writer",
    "Gemini AI README",
    "markdown documentation generator",
  ],
  authors: [{ name: "README Wizard Team" }],
  openGraph: {
    title: "README Wizard — AI-Powered README.md Generator",
    description:
      "Generate a complete, professional, and polished README.md for any GitHub repository in seconds using Google Gemini AI.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "README Wizard — AI-Powered README.md Generator",
    description:
      "Generate a complete, professional, and polished README.md for any GitHub repository in seconds using Google Gemini AI.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${headingFont.variable} ${bodyFont.variable} ${monoFont.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-cream text-text-dark selection:bg-warm-yellow/40 selection:text-text-dark">
        <QueryProvider>{children}</QueryProvider>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
