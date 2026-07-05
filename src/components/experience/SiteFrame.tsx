"use client";

import { useEffect, useState } from "react";
import { LoadingContext } from "./LoadingContext";
import { LoadingScreen } from "./LoadingScreen";
import { SmoothScroll } from "./SmoothScroll";
import { Background } from "./Background";
import { CustomCursor } from "./CustomCursor";
import { ScrollProgress } from "./ScrollProgress";
import { LightSweep } from "./LightSweep";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

/**
 * Top-level client shell. Owns the intro-loader lifecycle, exposes the loading
 * state via context (so the hero can time its reveal), and composes the global
 * experience layers: smooth scroll, background, cursor, chrome.
 */
export function SiteFrame({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  // Lock scroll while the loader is on screen.
  useEffect(() => {
    document.body.style.overflow = isLoading ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoading]);

  return (
    <LoadingContext.Provider value={{ isLoading }}>
      <LoadingScreen onComplete={() => setIsLoading(false)} />

      <Background />
      <CustomCursor />
      <ScrollProgress />
      <LightSweep active={!isLoading} />

      <SmoothScroll>
        <div className="relative z-10 flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </SmoothScroll>
    </LoadingContext.Provider>
  );
}
