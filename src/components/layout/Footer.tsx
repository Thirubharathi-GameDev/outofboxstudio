"use client";

import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { navLinks } from "@/lib/data";
import { Reveal } from "@/components/ui/Reveal";
import {
  GithubIcon,
  SteamIcon,
  DiscordIcon,
  LinkedinIcon,
} from "@/components/ui/BrandIcons";

const socialLinks = [
  { label: "GitHub", href: "https://github.com", Icon: GithubIcon },
  { label: "Steam", href: "https://store.steampowered.com", Icon: SteamIcon },
  { label: "Discord", href: "https://discord.com", Icon: DiscordIcon },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: LinkedinIcon },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-line px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
            <div className="max-w-sm">
              <Logo />
              <p className="mt-5 text-sm leading-relaxed text-muted">
                An independent game studio crafting cinematic, atmospheric worlds
                beyond reality.
              </p>
            </div>

            <div className="flex flex-wrap gap-12">
              <nav className="flex flex-col gap-3">
                <span className="mb-1 font-mono text-xs tracking-[0.3em] text-muted/60 uppercase">
                  Explore
                </span>
                {navLinks.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    data-cursor="hover"
                    className="text-sm text-muted transition-colors hover:text-ink"
                  >
                    {l.label}
                  </a>
                ))}
              </nav>

              <nav className="flex flex-col gap-3">
                <span className="mb-1 font-mono text-xs tracking-[0.3em] text-muted/60 uppercase">
                  Connect
                </span>
                {socialLinks.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="hover"
                    className="group inline-flex items-center gap-2 text-sm text-muted transition-all duration-300 hover:translate-x-0.5 hover:text-ink"
                  >
                    <Icon
                      size={15}
                      className="transition-transform duration-300 group-hover:scale-125 group-hover:text-secondary"
                    />
                    {label}
                    <ArrowUpRight
                      size={12}
                      className="-translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                    />
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </Reveal>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 text-xs text-muted/70 sm:flex-row">
          <p>© {year} Out Of Box Studio. All rights reserved.</p>
          <p className="font-mono tracking-widest">CREATING WORLDS BEYOND REALITY</p>
        </div>
      </div>
    </footer>
  );
}
