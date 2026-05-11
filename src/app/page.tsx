"use client";

import { useState } from "react";

// ─── mock data ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "popular", zh: "流行", en: "popular" },
  { id: "newest", zh: "最新", en: "newest" },
  { id: "loved", zh: "喜爱", en: "loved" },
  { id: "hot", zh: "热门", en: "hot" },
] as const;

const FILTERS = ["Multipass", "GPU 声音", "VR", "话筒", "Soundcloud", "Webcam"] as const;

type PreviewKind =
  | "tunnel"
  | "dust"
  | "saturn"
  | "emoji"
  | "starbase"
  | "micro"
  | "glow"
  | "fuji"
  | "mountains"
  | "kerr"
  | "prims"
  | "octa";

type Shader = {
  id: string;
  title: string;
  author: string;
  views: number;
  likes: number;
  warn?: boolean;
  preview: PreviewKind;
};

const SHADERS: Shader[] = [
  { id: "0042", title: "H_Tunnel", author: "fOrme", views: 1, likes: 0, preview: "tunnel" },
  { id: "1337", title: "Particules + Mouse", author: "sandefjord", views: 2, likes: 0, preview: "dust" },
  { id: "2389", title: "quick Saturn ring thing", author: "frisk256", views: 13, likes: 3, preview: "saturn" },
  { id: "0817", title: "homework fitsm2 2405107090", author: "qml222", views: 2, likes: 0, preview: "emoji" },
  { id: "5921", title: "TAA: A starbase of some sort", author: "mrange", views: 42, likes: 13, preview: "starbase" },
  { id: "6204", title: "Lover 2", author: "FabriceNeyret2", views: 542543, likes: 500, preview: "micro" },
  { id: "4451", title: "Flickering Irradiance", author: "Jaenam", views: 304, likes: 12, preview: "glow" },
  { id: "8819", title: "Cyber Fuji 2020", author: "kaiware007", views: 657128, likes: 447, preview: "fuji" },
  { id: "3370", title: "Mouse-Paint Eroded Mountains", author: "rumevision", views: 50, likes: 190, warn: true, preview: "mountains" },
  { id: "7152", title: "Kerr Newman Black Hole", author: "baopinsai", views: 22532, likes: 176, warn: true, preview: "kerr" },
  { id: "0001", title: "Raymarching — Primitives", author: "iq", views: 1150245, likes: 1658, warn: true, preview: "prims" },
  { id: "4998", title: "Octagrams", author: "whisky_shusuky", views: 517063, likes: 514, preview: "octa" },
];

const fmt = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// ─── shader previews (pure CSS, no images) ────────────────────────────────────

function Preview({ kind }: { kind: PreviewKind }) {
  const base = "absolute inset-0 transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]";
  switch (kind) {
    case "tunnel":
      return (
        <div
          className={base}
          style={{
            background:
              "repeating-radial-gradient(circle at 50% 50%, transparent 0px, transparent 1.5px, #d8d8d6 1.5px, #d8d8d6 3px), radial-gradient(circle at 50% 50%, transparent 8%, #000 75%)",
          }}
        />
      );

    case "dust":
      return (
        <div className={`${base} bg-black`}>
          <div className="absolute left-[28%] top-[42%] h-2 w-2 bg-white shadow-[0_0_14px_3px_rgba(255,255,255,0.6)]" />
          <div className="absolute left-[26%] top-[44%] h-0.5 w-0.5 bg-white/80" />
          <div className="absolute left-[31%] top-[40%] h-0.5 w-0.5 bg-white/60" />
        </div>
      );

    case "saturn":
      return (
        <div
          className={base}
          style={{
            background: "radial-gradient(ellipse 110% 130% at 50% 80%, #1a0905 0%, #050200 70%, #000 100%)",
          }}
        >
          <div
            className="absolute left-1/2 top-1/2 h-[90%] w-[160%] -translate-x-1/2 -translate-y-1/2"
            style={{
              background:
                "radial-gradient(ellipse 50% 9% at 50% 50%, rgba(212, 168, 114, 0.95) 0%, rgba(212, 168, 114, 0.5) 55%, transparent 72%)",
              transform: "translate(-50%, -50%) rotate(-14deg)",
            }}
          />
          <div
            className="absolute left-1/2 top-1/2 aspect-square h-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background: "radial-gradient(circle at 35% 25%, #efc080 0%, #a06a30 55%, #3a1c08 100%)",
            }}
          />
          <div
            className="absolute left-1/2 top-1/2 aspect-square h-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-multiply"
            style={{
              background:
                "repeating-radial-gradient(circle at 40% 35%, transparent 0 4px, rgba(0,0,0,0.18) 4px 5px)",
            }}
          />
        </div>
      );

    case "emoji":
      return (
        <div className={`${base} bg-black`}>
          <div
            className="absolute left-1/2 top-1/2 aspect-square h-[64%] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background: "radial-gradient(circle at 30% 28%, #ffe14b 0%, #fdb500 65%, #c87a00 100%)",
            }}
          >
            <div className="absolute left-[20%] top-[33%] h-[18%] w-[18%] rounded-full bg-white">
              <div className="absolute left-[18%] top-[22%] h-[58%] w-[58%] rounded-full bg-[#2a4dc1]" />
            </div>
            <div className="absolute right-[20%] top-[33%] h-[18%] w-[18%] rounded-full bg-white">
              <div className="absolute left-[18%] top-[22%] h-[58%] w-[58%] rounded-full bg-[#2a4dc1]" />
            </div>
            <div className="absolute left-1/2 top-[58%] h-[12%] w-[58%] -translate-x-1/2 rounded-b-full bg-black" />
          </div>
        </div>
      );

    case "starbase":
      return (
        <div
          className={base}
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(94, 234, 212, 0.55) 0%, transparent 22%), repeating-conic-gradient(from 0deg at 50% 50%, #c87a00 0deg 18deg, #1a0905 18deg 22.5deg, #d8a050 22.5deg 40deg, #1a0905 40deg 45deg)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(255, 220, 100, 0.4) 0%, transparent 10%), radial-gradient(circle at 50% 50%, transparent 14%, #000 70%)",
            }}
          />
        </div>
      );

    case "micro":
      return (
        <div className={`${base} bg-black`}>
          {[
            [42, 42],
            [44, 45],
            [46, 44],
            [48, 47],
            [50, 46],
            [52, 45],
            [54, 47],
            [56, 49],
            [55, 52],
            [50, 54],
            [46, 53],
            [44, 51],
            [47, 50],
            [51, 48],
            [49, 47],
          ].map(([l, t], i) => (
            <span
              key={i}
              className="absolute h-0.5 w-0.5 bg-white/80"
              style={{ left: `${l}%`, top: `${t}%` }}
            />
          ))}
        </div>
      );

    case "glow":
      return (
        <div
          className={base}
          style={{
            background:
              "radial-gradient(circle at 50% 36%, #aaf3e3 0%, #5eead4 5%, #2a8fa8 12%, #0a3a4d 30%, #050a18 65%, #000 100%)",
          }}
        >
          <div
            className="absolute inset-0 opacity-[0.18] mix-blend-overlay"
            style={{
              background:
                "repeating-linear-gradient(45deg, transparent 0 5px, rgba(255,255,255,0.5) 5px 6px), repeating-linear-gradient(-45deg, transparent 0 5px, rgba(255,255,255,0.5) 5px 6px)",
            }}
          />
        </div>
      );

    case "fuji":
      return (
        <div
          className={base}
          style={{
            background:
              "linear-gradient(180deg, #0d0030 0%, #4d0d6b 28%, #ff3b8b 49%, #060020 50%, #060020 100%)",
          }}
        >
          <div
            className="absolute right-[30%] top-[26%] aspect-square h-[42%] rounded-full"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, #ffd5a8 0%, #ff7a5e 30%, #ff3b8b 65%, transparent 85%)",
              filter: "blur(1px)",
            }}
          />
          <svg
            className="absolute inset-x-0 bottom-0 h-[50%] w-full"
            viewBox="0 0 200 80"
            preserveAspectRatio="none"
          >
            <g stroke="#ff3b8b" strokeWidth="0.4" fill="none" opacity="0.85">
              {[5, 12, 22, 34, 48, 64].map((y) => (
                <line key={`h${y}`} x1="0" y1={y} x2="200" y2={y} />
              ))}
              {Array.from({ length: 21 }, (_, i) => i - 10).map((i) => (
                <line key={`v${i}`} x1={100 + i * 4} y1="0" x2={100 + i * 40} y2="80" />
              ))}
            </g>
          </svg>
        </div>
      );

    case "mountains":
      return (
        <div
          className={base}
          style={{
            background: "linear-gradient(180deg, #3eb5a8 0%, #1a7e8d 55%, #0a3a4d 100%)",
          }}
        >
          <div
            className="absolute inset-x-[18%] bottom-[16%] h-[52%]"
            style={{
              background:
                "linear-gradient(180deg, #f4e1c1 0%, #c4a878 45%, #8b6a3d 100%)",
              clipPath:
                "polygon(0% 100%, 14% 56%, 22% 72%, 36% 32%, 48% 54%, 60% 38%, 72% 60%, 86% 48%, 100% 70%, 100% 100%)",
            }}
          />
          <div
            className="absolute inset-x-[14%] bottom-[12%] h-[10%]"
            style={{
              background: "linear-gradient(180deg, #b89765 0%, #6d4d28 100%)",
              clipPath: "polygon(2% 0, 98% 0, 92% 100%, 8% 100%)",
            }}
          />
        </div>
      );

    case "kerr":
      return (
        <div
          className={base}
          style={{
            background:
              "radial-gradient(ellipse 90% 90% at 50% 50%, #2a0d4d 0%, #050010 65%, #000 100%)",
          }}
        >
          {Array.from({ length: 35 }, (_, i) => i).map((i) => {
            const left = (i * 47) % 100;
            const top = (i * 71) % 100;
            const o = ((i * 13) % 7 + 3) / 10;
            return (
              <span
                key={i}
                className="absolute h-px w-px bg-white"
                style={{ left: `${left}%`, top: `${top}%`, opacity: o }}
              />
            );
          })}
          <div
            className="absolute left-1/2 top-1/2 h-[16%] w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(ellipse at 50% 50%, transparent 32%, rgba(255,170,51,0.85) 48%, rgba(255,80,30,0.75) 62%, transparent 80%)",
              filter: "blur(2.5px)",
              transform: "translate(-50%, -50%) rotate(-8deg)",
            }}
          />
          <div className="absolute left-1/2 top-1/2 h-[26%] w-[26%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black shadow-[0_0_40px_rgba(0,0,0,0.95)]" />
        </div>
      );

    case "prims":
      return (
        <div
          className={base}
          style={{
            background: "linear-gradient(180deg, #b6cdd3 0%, #c8dde2 50%, #4a6378 100%)",
          }}
        >
          <div
            className="absolute inset-x-0 bottom-0 h-1/2"
            style={{
              background:
                "repeating-conic-gradient(#5a6f82 0% 25%, #7891a4 0% 50%) 50% / 28px 28px",
              transform: "perspective(100px) rotateX(48deg)",
              transformOrigin: "top center",
            }}
          />
          <div className="absolute bottom-[34%] left-[16%] h-2.5 w-2.5 rounded-full bg-[#e8b878]" />
          <div className="absolute bottom-[38%] left-[28%] h-3.5 w-2.5 bg-[#5070b0]" />
          <div
            className="absolute bottom-[36%] left-[42%] h-3.5 w-3.5 bg-[#d04270]"
            style={{ clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }}
          />
          <div className="absolute bottom-[40%] left-[56%] h-3 w-3 rounded-full bg-[#5a883a]" />
          <div className="absolute bottom-[36%] left-[68%] h-3.5 w-3.5 bg-[#9040bb]" />
          <div className="absolute bottom-[38%] left-[80%] h-3 w-3 bg-[#e8a050]" style={{ clipPath: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)" }} />
        </div>
      );

    case "octa":
      return (
        <div
          className={base}
          style={{
            background:
              "repeating-conic-gradient(from 22.5deg at 50% 50%, #6aa2e6 0deg 22.5deg, #2f63a8 22.5deg 45deg)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "repeating-radial-gradient(circle at 50% 50%, transparent 0px, transparent 9px, rgba(0,0,0,0.45) 9px, rgba(0,0,0,0.45) 11px)",
            }}
          />
        </div>
      );
  }
}

// ─── nav ──────────────────────────────────────────────────────────────────────

function NavBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-3/70 bg-ink/75 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1480px] items-center px-6">
        <a href="#" className="flex items-center gap-2.5">
          <svg className="h-[18px] w-[18px] text-acid" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 1 L19 17 L1 17 Z" />
            <circle cx="10" cy="13" r="2" fill="#0a0a0c" />
          </svg>
          <span className="font-mono text-[13px] font-medium tracking-tight">
            shaderlab<span className="text-bone-dim">.idx</span>
          </span>
        </a>

        <nav className="ml-12 hidden items-center gap-7 font-mono text-[11px] uppercase tracking-widerer text-bone-muted md:flex">
          <a className="text-bone transition hover:text-acid" href="#">browse</a>
          <a className="transition hover:text-acid" href="#">new ↗</a>
          <a className="transition hover:text-acid" href="#">profiles</a>
          <a className="transition hover:text-acid" href="#">docs</a>
          <a className="transition hover:text-acid" href="#">competitions</a>
        </nav>

        <div className="ml-auto flex items-center gap-6">
          <div className="hidden items-center gap-2 font-mono text-[11px] text-bone-muted sm:flex">
            <span className="relative inline-flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-acid opacity-75" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-acid" />
            </span>
            <span>
              <span className="text-bone">118,805</span> live
            </span>
          </div>
          <a
            href="#"
            className="font-mono text-[11px] uppercase tracking-widerer text-bone transition hover:text-acid"
          >
            sign in <span aria-hidden>↗</span>
          </a>
        </div>
      </div>
    </header>
  );
}

// ─── hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="grain relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="grid-etch absolute inset-0" />
        <div className="absolute -left-32 top-1/4 h-[560px] w-[560px] rounded-full bg-acid opacity-[0.16] blur-[140px] animate-drift-a" />
        <div className="absolute right-[-100px] top-[40%] h-[520px] w-[520px] rounded-full bg-flare opacity-[0.20] blur-[130px] animate-drift-b" />
        <div className="absolute left-1/2 top-0 h-[440px] w-[680px] -translate-x-1/2 rounded-full bg-wave opacity-[0.12] blur-[150px] animate-drift-c" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-ink" />
      </div>

      <div className="relative mx-auto flex min-h-[78vh] max-w-[1480px] flex-col px-6 pb-9 pt-12">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widerer text-bone-muted">
          <span className="flex items-center gap-3">
            <span aria-hidden>▲</span>
            <span>est. mmxiii — open canvas</span>
          </span>
          <span className="hidden items-center gap-3 md:flex">
            <span>frag.main · v0.42-alpha</span>
            <span className="h-1 w-1 rounded-full bg-acid animate-pulse-dot" />
          </span>
        </div>

        <div className="my-auto py-14">
          <h1 className="font-display text-[clamp(60px,10.5vw,176px)] font-light leading-[0.92] tracking-tightest text-balance">
            <span className="block">every pixel,</span>
            <span className="block italic">
              a <span className="text-acid">poem.</span>
            </span>
          </h1>
          <p className="mt-7 max-w-xl font-mono text-[11px] uppercase tracking-widerer text-bone-muted">
            <span className="text-bone">118,805 shaders</span>
            <span className="mx-3 text-bone-dim">·</span>
            让代码生成画面
            <span className="mx-3 text-bone-dim">·</span>
            live glsl
            <span className="mx-3 text-bone-dim">·</span>
            <span className="text-acid">↗</span>
          </p>
        </div>

        <div className="relative">
          <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-widerer text-bone-dim">
            <span>// prompt — try a description, a shader id, or a feeling</span>
            <span className="hidden sm:inline">ctrl ⌘ K</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-1 items-center gap-3 rounded-full border border-ink-3/80 bg-ink-1/70 px-5 py-3 backdrop-blur-xl">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-acid via-flare to-wave">
                <span className="h-2 w-2 rounded-full bg-ink" />
              </span>
              <span className="font-mono text-[13px] text-bone-dim" aria-hidden>|</span>
              <input
                type="text"
                defaultValue="a tunnel of plasma rotating around a singularity, low-frequency hum, faint scanlines drifting in from the edge…"
                className="min-w-0 flex-1 truncate bg-transparent text-[13px] text-bone-muted placeholder:text-bone-dim focus:text-bone focus:outline-none"
              />
            </div>
            <button className="group/btn flex items-center gap-2.5 rounded-full bg-bone px-7 py-3 font-mono text-[12px] font-medium uppercase tracking-widerer text-ink transition hover:bg-acid">
              <span>创作</span>
              <span className="text-base transition-transform group-hover/btn:translate-x-0.5" aria-hidden>→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── filter bar ───────────────────────────────────────────────────────────────

function FilterBar({
  activeCat,
  setActiveCat,
  activeFilters,
  toggleFilter,
}: {
  activeCat: string;
  setActiveCat: (id: string) => void;
  activeFilters: string[];
  toggleFilter: (f: string) => void;
}) {
  return (
    <section className="border-y border-ink-3/70 bg-ink-1/40">
      <div className="mx-auto flex max-w-[1480px] flex-wrap items-center gap-x-10 gap-y-4 px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-widerer text-bone-dim">分类 ·</span>
          <div className="flex items-center gap-1">
            {CATEGORIES.map((c) => {
              const active = activeCat === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCat(c.id)}
                  className={`rounded-full px-3.5 py-1 text-[12px] transition ${
                    active
                      ? "bg-acid text-ink"
                      : "text-bone-muted hover:bg-ink-2 hover:text-bone"
                  }`}
                >
                  {c.zh}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-widerer text-bone-dim">筛选 ·</span>
          <div className="flex flex-wrap items-center gap-1.5">
            {FILTERS.map((f) => {
              const on = activeFilters.includes(f);
              return (
                <button
                  key={f}
                  onClick={() => toggleFilter(f)}
                  className={`rounded-full border px-3 py-1 font-mono text-[11px] transition ${
                    on
                      ? "border-acid bg-acid/10 text-acid"
                      : "border-ink-3 text-bone-muted hover:border-bone-muted hover:text-bone"
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-widerer text-bone-dim">view ·</span>
          <div className="flex rounded-full border border-ink-3 p-0.5">
            <button className="rounded-full bg-acid px-2.5 py-1.5 text-ink">
              <svg className="h-3 w-3" viewBox="0 0 12 12" fill="currentColor">
                <rect x="0" y="0" width="5" height="5" />
                <rect x="7" y="0" width="5" height="5" />
                <rect x="0" y="7" width="5" height="5" />
                <rect x="7" y="7" width="5" height="5" />
              </svg>
            </button>
            <button className="rounded-full px-2.5 py-1.5 text-bone-muted hover:text-bone">
              <svg className="h-3 w-3" viewBox="0 0 12 12" fill="currentColor">
                <rect x="0" y="1" width="12" height="1.5" />
                <rect x="0" y="5" width="12" height="1.5" />
                <rect x="0" y="9" width="12" height="1.5" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widerer text-bone-dim">
            结果 <span className="text-bone">(118,805)</span> ·
          </span>
          <div className="flex items-center gap-1 font-mono text-[11px]">
            <button className="rounded bg-acid px-2.5 py-1 text-ink">1</button>
            <button className="rounded border border-ink-3 px-2.5 py-1 text-bone-muted hover:border-bone-muted hover:text-bone">2</button>
            <button className="rounded border border-ink-3 px-2.5 py-1 text-bone-muted hover:border-bone-muted hover:text-bone">3</button>
            <span className="px-1 text-bone-dim">···</span>
            <button className="rounded border border-ink-3 px-2.5 py-1 text-bone-muted hover:border-bone-muted hover:text-bone">9901</button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── shader card ──────────────────────────────────────────────────────────────

function ShaderCard({ s, i }: { s: Shader; i: number }) {
  return (
    <article
      className="group relative animate-fade-up"
      style={{ animationDelay: `${i * 38}ms` }}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-1 ring-1 ring-ink-3/60 transition-all duration-500 group-hover:ring-acid/50 group-hover:ring-offset-2 group-hover:ring-offset-ink">
        <Preview kind={s.preview} />

        <span className="absolute left-2.5 top-2.5 z-10 font-mono text-[9px] uppercase tracking-widerer text-bone mix-blend-difference">
          # {s.id}
        </span>

        {s.warn && (
          <span className="absolute right-2.5 top-2.5 z-10 bg-flare px-1.5 py-[3px] font-mono text-[9px] font-medium uppercase tracking-widerer text-ink">
            warn
          </span>
        )}

        <span className="absolute bottom-2.5 right-2.5 z-10 flex translate-y-1 items-center gap-1.5 bg-ink/70 px-2 py-1 font-mono text-[9px] uppercase tracking-widerer text-bone opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="inline-block h-1.5 w-1.5 bg-acid" />
          run live
        </span>

        <div className="absolute inset-0 z-[5] bg-gradient-to-t from-ink/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      <div className="mt-3.5 flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-display text-[19px] leading-tight tracking-tight text-bone">
            <span className="under-reveal">{s.title}</span>
          </h3>
          <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-widerer text-bone-muted">
            来自 <span className="text-bone">{s.author}</span>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3.5 font-mono text-[10.5px] text-bone-muted">
          <span className="flex items-center gap-1.5" title="views">
            <svg className="h-3 w-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
              <ellipse cx="8" cy="8" rx="7" ry="4" />
              <circle cx="8" cy="8" r="1.6" fill="currentColor" />
            </svg>
            {fmt(s.views)}
          </span>
          <span className="flex items-center gap-1.5" title="likes">
            <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 14.2 L1.6 7.6 a3.7 3.7 0 0 1 6.4 -3.6 a3.7 3.7 0 0 1 6.4 3.6 Z" />
            </svg>
            {fmt(s.likes)}
          </span>
        </div>
      </div>
    </article>
  );
}

// ─── grid ─────────────────────────────────────────────────────────────────────

function Grid() {
  return (
    <section className="mx-auto max-w-[1480px] px-6 py-12">
      <div className="mb-8 flex items-baseline justify-between">
        <h2 className="font-mono text-[11px] uppercase tracking-widerer text-bone-dim">
          ▣ catalogue · indexed by relevance · {fmt(SHADERS.length)} on this page
        </h2>
        <a href="#" className="hidden font-mono text-[11px] uppercase tracking-widerer text-bone-muted hover:text-acid md:inline">
          shuffle ⇆
        </a>
      </div>
      <div className="grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {SHADERS.map((s, i) => (
          <ShaderCard key={s.id} s={s} i={i} />
        ))}
      </div>
    </section>
  );
}

// ─── footer ───────────────────────────────────────────────────────────────────

function FooterSection() {
  return (
    <footer className="mt-12 border-t border-ink-3/70">
      <div className="mx-auto max-w-[1480px] px-6">
        <div className="border-b border-ink-3/40 py-16">
          <p className="font-display text-[clamp(40px,7.5vw,116px)] font-light leading-[0.95] tracking-tightest">
            shaders,
            <br />
            <span className="italic text-acid">running.</span>
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 py-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-mono text-[10px] uppercase tracking-widerer text-bone-dim">▲ manifesto · ix.iv</p>
            <p className="mt-5 max-w-md font-display text-[20px] italic leading-snug text-bone-muted">
              an open canvas for programmers who paint with mathematics. every fragment a frontier, every shader a small fluent gesture toward the impossible.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 md:col-span-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widerer text-bone-dim">explore</p>
              <ul className="mt-4 space-y-2 font-mono text-[12px]">
                <li><a className="text-bone-muted transition hover:text-acid" href="#">browse all <span aria-hidden>→</span></a></li>
                <li><a className="text-bone-muted transition hover:text-acid" href="#">categories <span aria-hidden>→</span></a></li>
                <li><a className="text-bone-muted transition hover:text-acid" href="#">featured artists <span aria-hidden>→</span></a></li>
                <li><a className="text-bone-muted transition hover:text-acid" href="#">competitions <span aria-hidden>→</span></a></li>
              </ul>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widerer text-bone-dim">build</p>
              <ul className="mt-4 space-y-2 font-mono text-[12px]">
                <li><a className="text-bone-muted transition hover:text-acid" href="#">new shader <span aria-hidden>→</span></a></li>
                <li><a className="text-bone-muted transition hover:text-acid" href="#">glsl reference <span aria-hidden>→</span></a></li>
                <li><a className="text-bone-muted transition hover:text-acid" href="#">api docs <span aria-hidden>→</span></a></li>
                <li><a className="text-bone-muted transition hover:text-acid" href="#">community <span aria-hidden>→</span></a></li>
              </ul>
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="font-mono text-[10px] uppercase tracking-widerer text-bone-dim">system · live</p>
            <dl className="mt-4 space-y-1.5 font-mono text-[12px]">
              {[
                ["uptime", "2,184 hr"],
                ["shaders", "118,805"],
                ["artists", "24,381"],
                ["gpu vendor", "nvidia"],
                ["webgl", "v2.0"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-3 border-b border-dashed border-ink-3/60 pb-1">
                  <dt className="text-bone-muted">{k}</dt>
                  <dd className="tabular-nums text-bone">{v}</dd>
                </div>
              ))}
              <div className="flex items-baseline justify-between gap-3 pt-1">
                <dt className="text-bone-muted">build</dt>
                <dd className="tabular-nums text-acid">v0.42-alpha</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-ink-3/40 py-5 font-mono text-[10px] uppercase tracking-widerer text-bone-dim">
          <span>© mmxxvi · shaderlab.idx — all rights &amp; wrongs reserved</span>
          <span className="hidden items-center gap-2 sm:flex">
            <span className="h-1 w-1 animate-pulse-dot rounded-full bg-acid" />
            render core online
          </span>
          <span className="font-mono">
            <span className="text-bone-muted">let</span> <span className="text-acid">glsl</span>{" "}
            <span className="text-bone-muted">=</span>{" "}
            <span className="italic text-flare">poetry</span>
            <span className="text-bone-muted">;</span> <span aria-hidden>↗</span>
          </span>
        </div>
      </div>
    </footer>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function Page() {
  const [activeCat, setActiveCat] = useState<string>("hot");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const toggleFilter = (f: string) => {
    setActiveFilters((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
  };

  return (
    <main className="min-h-screen bg-ink text-bone">
      <NavBar />
      <Hero />
      <FilterBar
        activeCat={activeCat}
        setActiveCat={setActiveCat}
        activeFilters={activeFilters}
        toggleFilter={toggleFilter}
      />
      <Grid />
      <FooterSection />
    </main>
  );
}
