import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kartu Dilema Digital: Algorithm Quest | Informatika X.AP.1",
  description:
    "Media pembelajaran interaktif untuk meningkatkan kemampuan berpikir algoritmik pada materi Notasi dan Penulisan Algoritma (X.AP.1), Kelas X / Fase E. Setiap langkah punya konsekuensi.",
  keywords: [
    "Kartu Dilema Digital",
    "Algorithm Quest",
    "Informatika",
    "Notasi dan Penulisan Algoritma",
    "X.AP.1",
    "Fase E",
    "berpikir algoritmik",
    "PTK",
  ],
  authors: [{ name: "Media Pembelajaran Informatika" }],
};

export const viewport: Viewport = {
  themeColor: "#070d1f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
