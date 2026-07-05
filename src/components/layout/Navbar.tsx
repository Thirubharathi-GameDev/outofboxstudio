"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { SoundToggle } from "@/components/ui/SoundToggle";
import { navLinks } from "@/lib/data";
import { cn, EASE_OUT_EXPO } from "@/lib/utils";

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>(navLinks[0].href);

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  // scroll-spy: highlight the section currently in view
  useEffect(() => {
    const sections = navLinks
      .map((l) => document.querySelector(l.href))
      .filter(Boolean) as Element[];
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8, ease: EASE_OUT_EXPO }}
        className="fixed inset-x-0 top-0 z-[80] px-4 pt-3 sm:px-6"
      >
        <motion.nav
          animate={{
            paddingTop: scrolled ? 8 : 14,
            paddingBottom: scrolled ? 8 : 14,
          }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-4 transition-[background,box-shadow,backdrop-filter,border-color] duration-500 sm:px-6",
            scrolled
              ? "border border-line bg-[rgba(10,10,14,0.6)] shadow-[0_10px_40px_-20px_rgba(0,0,0,0.9)] backdrop-blur-2xl backdrop-saturate-150"
              : "border border-transparent bg-transparent backdrop-blur-0",
          )}
        >
          <a href="#top" aria-label="Out Of Box Studio — home" data-cursor="hover">
            <motion.span
              className="inline-block"
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Logo />
            </motion.span>
          </a>

          {/* desktop menu with sliding active indicator */}
          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const isActive = active === link.href;
              return (
                <li key={link.href} className="relative">
                  <a
                    href={link.href}
                    data-cursor="hover"
                    className={cn(
                      "relative inline-block px-4 py-2 text-sm font-medium transition-colors",
                      isActive ? "text-ink" : "text-muted hover:text-ink",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-full border border-line bg-white/[0.05]"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="hidden items-center gap-2 md:flex">
            <SoundToggle />
            <a
              href="#contact"
              data-cursor="hover"
              className="inline-flex items-center rounded-full border border-line bg-white/[0.03] px-5 py-2 text-sm font-medium text-ink transition-colors hover:border-primary/50 hover:bg-primary/10"
            >
              Get in touch
            </a>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <SoundToggle />
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              data-cursor="hover"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </motion.nav>
      </motion.header>

      {/* mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[79] flex flex-col bg-void/95 px-6 pt-28 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ul className="flex flex-col gap-2">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-line py-5 font-display text-3xl font-semibold tracking-tight text-ink"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
