"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * The living, layered backdrop for the entire site. Eight independent layers,
 * each drifting at its own pace, so the world never feels static:
 *
 *  1. Stars      — parallax starfield (canvas)
 *  2. Nebula     — slow colored gradient clouds
 *  3. Dust       — large soft floating motes (canvas)
 *  4. Fog        — blurred drifting orbs, pointer parallax
 *  5. Noise      — static procedural grain
 *  6. Moving light — a slow sweeping volumetric beam
 *  7. Grid       — perspective grid that parallaxes on scroll
 *  8. Spotlight  — soft light that follows the cursor
 *
 * All motion is deliberately near-imperceptible. Scrolling shifts layers at
 * different rates (camera-like depth) and everything degrades to a calm static
 * gradient under prefers-reduced-motion.
 */
export function Background() {
  const reduced = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { scrollYProgress } = useScroll();
  const scrollSpring = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 30,
    restDelta: 0.001,
  });

  // scroll-driven parallax offsets (camera depth)
  const starsY = useTransform(scrollSpring, [0, 1], ["0%", "-14%"]);
  const nebulaY = useTransform(scrollSpring, [0, 1], ["0%", "22%"]);
  const gridY = useTransform(scrollSpring, [0, 1], ["0%", "34%"]);
  const fogY = useTransform(scrollSpring, [0, 1], ["0%", "-10%"]);
  // hue/light drift as you travel down the page
  const lightRotate = useTransform(scrollSpring, [0, 1], [0, 40]);
  const nebulaHue = useTransform(scrollSpring, [0, 1], [0, 26]);
  const nebulaFilter = useTransform(nebulaHue, (h) => `hue-rotate(${h}deg)`);

  // pointer parallax
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const parX = useSpring(px, { stiffness: 40, damping: 20 });
  const parY = useSpring(py, { stiffness: 40, damping: 20 });
  const parX2 = useTransform(parX, (v) => v * 1.8);
  const parY2 = useTransform(parY, (v) => v * 1.8);

  // cursor spotlight
  const sx = useMotionValue(-500);
  const sy = useMotionValue(-500);
  const spotX = useSpring(sx, { stiffness: 120, damping: 30 });
  const spotY = useSpring(sy, { stiffness: 120, damping: 30 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const cx = e.clientX / window.innerWidth - 0.5;
      const cy = e.clientY / window.innerHeight - 0.5;
      px.set(cx * 30);
      py.set(cy * 30);
      sx.set(e.clientX);
      sy.set(e.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [px, py, sx, sy]);

  // Canvas: stars (layer 1) + dust motes (layer 3)
  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;

    type Star = { x: number; y: number; z: number; r: number; tw: number };
    type Dust = { x: number; y: number; r: number; vx: number; vy: number; a: number };
    let stars: Star[] = [];
    let dust: Dust[] = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const starCount = Math.min(200, Math.floor((width * height) / 11000));
      stars = Array.from({ length: starCount }, () => {
        const z = Math.random();
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          z,
          r: z * 1.5 + 0.2,
          tw: Math.random() * Math.PI * 2,
        };
      });

      const dustCount = Math.min(16, Math.floor((width * height) / 110000));
      dust = Array.from({ length: dustCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 10 + 4,
        vx: (Math.random() - 0.5) * 0.1,
        vy: -(Math.random() * 0.08 + 0.02),
        a: Math.random() * 0.025 + 0.008,
      }));
    };
    resize();
    window.addEventListener("resize", resize);

    const render = (t: number) => {
      ctx.clearRect(0, 0, width, height);

      // dust (drawn behind-ish, soft)
      for (const d of dust) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.y < -d.r) {
          d.y = height + d.r;
          d.x = Math.random() * width;
        }
        if (d.x < -d.r) d.x = width + d.r;
        if (d.x > width + d.r) d.x = -d.r;
        const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r);
        g.addColorStop(0, `rgba(150,170,255,${d.a})`);
        g.addColorStop(1, "rgba(150,170,255,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // stars
      for (const s of stars) {
        s.y -= s.z * 0.1 + 0.015;
        if (s.y < -2) {
          s.y = height + 2;
          s.x = Math.random() * width;
        }
        const twinkle = 0.55 + Math.sin(t * 0.001 + s.tw) * 0.45;
        const alpha = s.z * 0.85 * twinkle;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${185 + s.z * 40}, ${205 + s.z * 25}, 255, ${alpha})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* base void + static vignette */}
      <div className="absolute inset-0 bg-void" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% -10%, rgba(108,99,255,0.10), transparent 55%), radial-gradient(90% 70% at 90% 110%, rgba(0,229,255,0.08), transparent 50%)",
        }}
      />

      {/* LAYER 2 — Nebula (subtle, crisp) */}
      <motion.div
        className="absolute -inset-[15%]"
        style={{ y: nebulaY, filter: nebulaFilter }}
      >
        <motion.div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(34% 36% at 20% 26%, rgba(108,99,255,0.12), transparent 62%), radial-gradient(30% 32% at 80% 60%, rgba(0,229,255,0.09), transparent 62%)",
          }}
          animate={reduced ? undefined : { opacity: [0.32, 0.46, 0.32] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* LAYER 4 — Faint edge accent glows (crisp, no haze) */}
      <motion.div className="absolute inset-0" style={{ x: parX, y: fogY }}>
        <motion.div
          className="absolute -top-32 -left-24 h-[26rem] w-[26rem] rounded-full blur-2xl"
          style={{ background: "radial-gradient(circle, rgba(108,99,255,0.09), transparent 68%)", x: parX2, y: parY2 }}
          animate={reduced ? undefined : { opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-24 -right-24 h-[24rem] w-[24rem] rounded-full blur-2xl"
          style={{ background: "radial-gradient(circle, rgba(0,229,255,0.07), transparent 68%)" }}
          animate={reduced ? undefined : { opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* LAYER 1 + 3 — Stars & dust (canvas) */}
      <motion.div className="absolute inset-0" style={{ y: starsY }}>
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      </motion.div>

      {/* LAYER 6 — Moving volumetric light */}
      {!reduced && (
        <motion.div
          className="absolute left-1/2 top-1/2 h-[160vmax] w-[70vmax] origin-center opacity-[0.06] mix-blend-screen"
          style={{
            rotate: lightRotate,
            x: "-50%",
            y: "-50%",
            background:
              "linear-gradient(90deg, transparent, rgba(108,99,255,0.8) 45%, rgba(0,229,255,0.6) 55%, transparent)",
            filter: "blur(40px)",
          }}
          animate={{ rotate: [0, 8, 0] }}
          transition={{ duration: 60, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* LAYER 7 — Perspective grid (scroll parallax) */}
      <motion.div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          y: gridY,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(100% 100% at 50% 0%, black, transparent 78%)",
          WebkitMaskImage: "radial-gradient(100% 100% at 50% 0%, black, transparent 78%)",
        }}
      />

      {/* LAYER 8 — Cursor spotlight */}
      {!reduced && (
        <motion.div
          className="absolute h-[40rem] w-[40rem] rounded-full"
          style={{
            x: spotX,
            y: spotY,
            translateX: "-50%",
            translateY: "-50%",
            background:
              "radial-gradient(circle, rgba(108,99,255,0.09), transparent 60%)",
          }}
        />
      )}

      {/* LAYER 5 — Procedural noise */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* cinematic vignette (top-most of the bg stack) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(130% 130% at 50% 50%, transparent 62%, rgba(0,0,0,0.4) 100%)",
        }}
      />
    </div>
  );
}
