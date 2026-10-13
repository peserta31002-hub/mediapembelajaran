"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  RotateCcw,
  Dices,
  GraduationCap,
  Layers,
  FlaskConical,
  Swords,
  BarChart3,
  MessagesSquare,
  Flag,
  BookOpen,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { SimLine } from "@/lib/gameData";
import { getContent } from "@/lib/content";
import {
  Phase,
  useGame,
  allCardsDone,
  finalDoneOf,
  isFinalUnlocked,
  tutorialDoneOf,
} from "@/lib/store";

/* ────────────────────────── Pseudocode renderer ────────────────────────── */

const KEYWORDS = new Set([
  "MULAI",
  "SELESAI",
  "INPUT",
  "OUTPUT",
  "DISPLAY",
  "IF",
  "THEN",
  "ELSE",
  "REPEAT",
  "UNTIL",
  "END",
]);

function renderPseudoLine(line: string) {
  const parts = line.split(/("[^"]*")/g);
  return parts.map((part, i) => {
    if (part.startsWith('"')) {
      return (
        <span key={i} className="text-[#3ddc97]">
          {part}
        </span>
      );
    }
    const tokens = part.split(/(\s+)/);
    return tokens.map((tk, j) => {
      if (/^\s+$/.test(tk) || tk === "") return <span key={`${i}-${j}`}>{tk}</span>;
      const clean = tk.replace(/[(),]/g, "");
      if (KEYWORDS.has(clean)) {
        return (
          <span key={`${i}-${j}`} className="font-semibold text-[#ff7a1a]">
            {tk}
          </span>
        );
      }
      if (/^[←≥≤≠]$/.test(tk)) {
        return (
          <span key={`${i}-${j}`} className="font-bold text-[#3bd6ff]">
            {tk}
          </span>
        );
      }
      return <span key={`${i}-${j}`}>{tk}</span>;
    });
  });
}

export function Pseudo({ lines, compact }: { lines: string[]; compact?: boolean }) {
  return (
    <div
      className={`font-mono-code rounded-lg border border-white/10 bg-[#050a18] text-[13px] leading-relaxed ${
        compact ? "px-3 py-2" : "px-4 py-3"
      } overflow-x-auto`}
    >
      {lines.map((line, idx) => (
        <div key={idx} className="whitespace-pre">
          {renderPseudoLine(line) as React.ReactNode}
        </div>
      ))}
    </div>
  );
}

/* ────────────────────────── Simulation console ────────────────────────── */

const LINE_STYLE: Record<SimLine["kind"], string> = {
  step: "text-slate-200",
  ok: "text-[#3ddc97]",
  err: "text-[#ff5470]",
  info: "text-[#3bd6ff]",
  warn: "text-[#ffd166]",
};

const LINE_ICON: Record<SimLine["kind"], string> = {
  step: "›",
  ok: "✓",
  err: "✗",
  info: "ℹ",
  warn: "⚠",
};

export function SimConsole({
  lines,
  speed = 420,
  title = "KONSOL SIMULASI",
  onComplete,
}: {
  lines: SimLine[];
  speed?: number;
  title?: string;
  onComplete?: () => void;
}) {
  const [visible, setVisible] = useState(0);
  const [prevLines, setPrevLines] = useState<SimLine[]>(lines);
  const boxRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  // Reset tampilan saat keluaran simulasi berganti (pola penyesuaian state saat render)
  if (prevLines !== lines) {
    setPrevLines(lines);
    setVisible(0);
  }

  useEffect(() => {
    if (!lines.length) return;
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setVisible(i);
      if (i >= lines.length) {
        clearInterval(t);
        onCompleteRef.current?.();
      }
    }, speed);
    return () => clearInterval(t);
  }, [lines, speed]);

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: "smooth" });
  }, [visible]);

  const running = visible < lines.length;

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#050a18]">
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5470]/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#ffd166]/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#3ddc97]/80" />
        <span className="ml-2 font-mono-code text-[11px] tracking-widest text-slate-400">
          {title}
        </span>
        {running && (
          <span className="ml-auto flex items-center gap-1 font-mono-code text-[10px] text-[#3bd6ff]">
            <span className="h-1.5 w-1.5 animate-ping rounded-full bg-[#3bd6ff]" />
            MENJALANKAN…
          </span>
        )}
      </div>
      <div
        ref={boxRef}
        className="console-scroll max-h-64 space-y-1.5 overflow-y-auto px-4 py-3 font-mono-code text-[12.5px] leading-relaxed sm:text-[13px]"
      >
        <AnimatePresence>
          {lines.slice(0, visible).map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex gap-2 ${LINE_STYLE[line.kind]}`}
            >
              <span className="shrink-0 opacity-70">{LINE_ICON[line.kind]}</span>
              <span className="break-words">{line.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        {running && (
          <div className="flex gap-2 text-slate-300">
            <span className="shrink-0">›</span>
            <span className="blink-caret">▌</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ────────────────────────── Small building blocks ────────────────────────── */

export function LevelBadge({ level }: { level: number }) {
  return (
    <span className="inline-flex items-center rounded-md border border-[#ff7a1a]/40 bg-[#ff7a1a]/10 px-2 py-0.5 font-mono-code text-[11px] font-semibold tracking-wider text-[#ff7a1a]">
      LEVEL {level}
    </span>
  );
}

export function Chip({
  children,
  tone = "volt",
}: {
  children: React.ReactNode;
  tone?: "volt" | "ember" | "mint" | "coral" | "muted";
}) {
  const map = {
    volt: "border-[#3bd6ff]/30 bg-[#3bd6ff]/10 text-[#3bd6ff]",
    ember: "border-[#ff7a1a]/30 bg-[#ff7a1a]/10 text-[#ff7a1a]",
    mint: "border-[#3ddc97]/30 bg-[#3ddc97]/10 text-[#3ddc97]",
    coral: "border-[#ff5470]/30 bg-[#ff5470]/10 text-[#ff5470]",
    muted: "border-white/10 bg-white/5 text-slate-300",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono-code text-[11px] ${map[tone]}`}
    >
      {children}
    </span>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
}) {
  return (
    <div className="mb-6">
      <p className="font-mono-code text-[11px] font-semibold tracking-[0.25em] text-[#3bd6ff]">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h2>
      {desc && <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">{desc}</p>}
    </div>
  );
}

export function FlowStep({ n, label, desc }: { n: number; label: string; desc: string }) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff7a1a]/15 font-mono-code text-sm font-bold text-[#ff7a1a]">
        {n}
      </div>
      <p className="text-sm font-semibold text-white">{label}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-400">{desc}</p>
    </div>
  );
}

/* ────────────────────────── Header ────────────────────────── */

const STEPS: { key: Phase; label: string; icon: React.ReactNode }[] = [
  { key: "briefing", label: "Briefing", icon: <Flag className="h-3.5 w-3.5" /> },
  { key: "tutorial", label: "Tutorial", icon: <GraduationCap className="h-3.5 w-3.5" /> },
  { key: "cards", label: "Dilema", icon: <Layers className="h-3.5 w-3.5" /> },
  { key: "lab", label: "Lab", icon: <FlaskConical className="h-3.5 w-3.5" /> },
  { key: "final", label: "Final", icon: <Swords className="h-3.5 w-3.5" /> },
  { key: "results", label: "Hasil", icon: <BarChart3 className="h-3.5 w-3.5" /> },
  { key: "reflection", label: "Refleksi", icon: <MessagesSquare className="h-3.5 w-3.5" /> },
];

export function GameHeader() {
  const s = useGame();
  if (s.phase === "landing") return null;

  const content = getContent(s.campaign);

  const unlocked: Record<Phase, boolean> = {
    landing: true,
    briefing: true,
    tutorial: true,
    // Mode guru: semua kunci navigasi terbuka untuk pemeriksaan materi
    cards: s.teacherMode || tutorialDoneOf(s, s.campaign),
    lab: s.teacherMode || allCardsDone(s, s.campaign),
    final: s.teacherMode || isFinalUnlocked(s, s.campaign),
    results: s.teacherMode || finalDoneOf(s, s.campaign),
    reflection: s.teacherMode || finalDoneOf(s, s.campaign),
    guru: true,
    materi: true,
    peta: true,
  };

  const go = (p: Phase) => {
    if (unlocked[p]) {
      if (p === "cards") s.backToMap();
      s.setPhase(p);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070d1f]/85 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <button
          onClick={() => go("briefing")}
          className="flex items-center gap-2 text-left"
          aria-label="Kembali ke briefing"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#ff7a1a] to-[#ffb26b] shadow-[0_0_18px_rgba(255,122,26,0.4)]">
            <Dices className="h-5 w-5 text-[#1a0e05]" />
          </div>
          <div className="hidden sm:block">
            <p className="font-mono-code text-[10px] font-bold tracking-[0.2em] text-[#ff7a1a]">
              KARTU DILEMA DIGITAL
            </p>
            <p className="text-[11px] text-slate-400">
              {content.bagianLabel} • {content.moduleCode}
            </p>
          </div>
        </button>

        <button
          onClick={() => s.setPhase("materi")}
          aria-current={s.phase === "materi" ? "page" : undefined}
          className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
            s.phase === "materi"
              ? "border-[#3bd6ff]/40 bg-[#3bd6ff]/15 text-[#3bd6ff]"
              : "border-white/10 text-slate-300 hover:bg-white/5 hover:text-white"
          }`}
          title="Ruang Materi & Pembahasan"
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Materi</span>
        </button>

        <button
          onClick={() => s.setPhase("peta")}
          aria-current={s.phase === "peta" ? "page" : undefined}
          className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
            s.phase === "peta" || s.teacherMode
              ? "border-[#3ddc97]/40 bg-[#3ddc97]/15 text-[#3ddc97]"
              : "border-white/10 text-slate-300 hover:bg-white/5 hover:text-white"
          }`}
          title="Peta Guru — buka & periksa semua menu"
        >
          <KeyRound className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Peta Guru</span>
        </button>

        <nav
          className="scroll-thin ml-auto flex items-center gap-1 overflow-x-auto"
          aria-label="Navigasi misi"
        >
          {STEPS.map((step) => {
            const active = s.phase === step.key;
            const open = unlocked[step.key];
            return (
              <button
                key={step.key}
                onClick={() => go(step.key)}
                disabled={!open}
                aria-current={active ? "page" : undefined}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? "bg-[#ff7a1a]/15 text-[#ff7a1a]"
                    : open
                      ? "text-slate-300 hover:bg-white/5 hover:text-white"
                      : "cursor-not-allowed text-slate-600"
                }`}
                title={open ? step.label : `${step.label} (terkunci)`}
              >
                {open ? step.icon : <Lock className="h-3.5 w-3.5" />}
                <span className="hidden md:inline">{step.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 border-l border-white/10 pl-2">
          {s.playerName && (
            <span className="hidden max-w-24 truncate text-xs text-slate-400 sm:block">
              {s.playerName}
            </span>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-[#ff5470]"
                aria-label="Reset progres"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-white/10 bg-[#0c1528]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Reset seluruh progres?</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-400">
                  Semua jawaban, revisi, skor, dan refleksi akan dihapus. Media kembali ke halaman
                  awal — cocok dipakai oleh peserta didik berikutnya.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-white/10 text-slate-300">Batal</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-[#ff5470] text-white hover:bg-[#ff5470]/85"
                  onClick={() => {
                    s.resetAll();
                  }}
                >
                  Ya, reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </header>
  );
}

/* ────────────────────────── Footer ────────────────────────── */

export function GameFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#060b1a]/80">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-1 px-4 py-4 text-center text-[11px] text-slate-500 sm:flex-row sm:text-left">
        <p>
          KARTU DILEMA DIGITAL: ALGORITHM QUEST — media pembelajaran interaktif PTK
        </p>
        <p className="font-mono-code">
          Informatika • Kelas X / Fase E • X.AP.1 Notasi & Penulisan Algoritma + X.AP.2 Instalasi Lingkungan Pemrograman
        </p>
      </div>
    </footer>
  );
}
