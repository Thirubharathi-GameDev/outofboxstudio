import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Sora, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteFrame } from "@/components/experience/SiteFrame";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://outofbox.studio";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Out Of Box Studio — Creating Worlds Beyond Reality",
    template: "%s · Out Of Box Studio",
  },
  description:
    "Out Of Box Studio is an independent game studio crafting cinematic, atmospheric worlds. Explore our games, our journey, and the craft behind unforgettable experiences.",
  keywords: [
    "game studio",
    "indie games",
    "Out Of Box Studio",
    "King is Sticks",
    "Agent Rat",
    "Closer",
    "Unity",
    "game development",
  ],
  authors: [{ name: "Out Of Box Studio" }],
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Out Of Box Studio — Creating Worlds Beyond Reality",
    description:
      "An independent game studio crafting cinematic, atmospheric worlds.",
    siteName: "Out Of Box Studio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Out Of Box Studio — Creating Worlds Beyond Reality",
    description:
      "An independent game studio crafting cinematic, atmospheric worlds.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${sora.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="grain min-h-screen bg-void text-ink antialiased">
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
