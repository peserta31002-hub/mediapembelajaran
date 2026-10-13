"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence, Reorder, useDragControls } from "framer-motion";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleDot,
  GripVertical,
  Lock,
  Plus,
  RotateCcw,
  Swords,
  Trophy,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chip, Pseudo, SectionTitle, SimConsole } from "./ui";
import {
  BlockDef,
  SimLine,
  simulateBlocks,
} from "@/lib/gameData";
import { getContent } from "@/lib/content";
import { useGame, isFinalUnlocked } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

export default function FinalChallenge() {
  const s = useGame();
  const content = getContent(s.campaign);
  // Mode guru: Final terbuka untuk pemeriksaan materi
  const unlocked = s.teacherMode || isFinalUnlocked(s, s.campaign);
  const final = content.final;
  const { toast } = useToast();

  const [pool, setPool] = useState<string[]>(final.shuffled);
  const [area, setArea] = useState<string[]>([]);
  const [lines, setLines] = useState<SimLine[] | null>(null);
  const [passed, setPassed] = useState(false);

  const defs = final.defs;

  const poolItems = useMemo(
    () => pool.map((id) => ({ id, text: defs[id].text, distractor: defs[id].kind === "distractor" })),
    [pool, defs]
  );
  const areaItems = useMemo(
    () => area.map((id) => ({ id, text: defs[id].text })),
    [area, defs]
  );

  const moveToArea = (id: string) => {
    setPool((p) => p.filter((x) => x !== id));
    setArea((a) => [...a, id]);
    setLines(null);
    setPassed(false);
  };

  const moveToPool = (id: string) => {
    setArea((a) => a.filter((x) => x !== id));
    setPool((p) => [...p, id]);
    setLines(null);
    setPassed(false);
  };

  const moveInArea = (from: number, to: number) => {
    if (to < 0 || to >= area.length) return;
    const next = [...area];
    const [m] = next.splice(from, 1);
    next.splice(to, 0, m);
    setArea(next);
    setLines(null);
    setPassed(false);
  };

  const reset = () => {
    setPool(final.shuffled);
    setArea([]);
    setLines(null);
    setPassed(false);
  };

  const runMission = () => {
    const all: SimLine[] = [];
    let ok = false;
    if (area.length === 0) {
      all.push({ kind: "err", text: "Area algoritma masih kosong — rakit blok terlebih dahulu." });
    } else {
      const result = simulateBlocks(area, defs);
      all.push(...result.lines);
      if (result.ok) {
        ok = true;
        for (const t of final.tests ?? []) {
          all.push({ kind: "info", text: `${t.label}: ${t.input}` });
          for (const out of t.expected) all.push({ kind: "ok", text: `OUTPUT → ${out}` });
        }
        all.push({ kind: "ok", text: "MESIN LULUS UJI: semua pemeriksaan terlayani dengan benar." });
      }
    }
    setLines(all);
    s.completeFinal(ok);
    if (ok) {
      setPassed(true);
      toast({
        title: "MISI TERAKHIR LULUS!",
        description: final.successText,
      });
    }
  };

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <SectionTitle eyebrow={`${content.bagianLabel} • FINAL CHALLENGE`} title="Misi Terakhir" />
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-12 text-center">
          <Lock className="mb-3 h-10 w-10 text-slate-600" />
          <p className="text-sm text-slate-400">
            Selesaikan <span className="font-semibold text-white">kedua Task di Algorithm Lab</span>{" "}
            untuk membuka misi terakhir.
          </p>
          <Button
            onClick={() => s.setPhase("lab")}
            className="mt-4 bg-[#ff7a1a] font-bold text-[#1a0e05] hover:bg-[#ff8c3a]"
          >
            KE ALGORITHM LAB
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <SectionTitle
        eyebrow={`${content.bagianLabel} • FINAL CHALLENGE`}
        title={final.title}
        desc={final.scenario}
      />

      <div className="mb-6 rounded-xl border border-[#ff7a1a]/25 bg-gradient-to-r from-[#ff7a1a]/10 to-transparent px-4 py-3">
        <p className="flex items-start gap-2 text-sm font-semibold text-white">
          <Swords className="mt-0.5 h-4 w-4 shrink-0 text-[#ff7a1a]" />
          {final.mission}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Pool */}
        <div className="lg:col-span-2">
          <p className="mb-2 font-mono-code text-[11px] font-bold tracking-widest text-slate-400">
            BLOK TERSEDIA ({poolItems.length})
          </p>
          <div className="scroll-thin max-h-[420px] space-y-2 overflow-y-auto pr-1">
            {poolItems.map((item) => (
              <button
                key={item.id}
                onClick={() => moveToArea(item.id)}
                className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-[#0e1a33] px-3 py-2.5 text-left transition-colors hover:border-[#3bd6ff]/40 hover:bg-[#3bd6ff]/5"
                aria-label={`Tambahkan blok: ${item.text}`}
              >
                <Plus className="h-4 w-4 shrink-0 text-[#3bd6ff]" />
                <span className="font-mono-code text-[12.5px] text-slate-100">{item.text}</span>
              </button>
            ))}
            {poolItems.length === 0 && (
              <p className="rounded-xl border border-dashed border-white/10 px-3 py-6 text-center text-xs text-slate-500">
                Semua blok terpakai. Cek kembali apakah semuanya benar-benar dibutuhkan.
              </p>
            )}
          </div>
          <div className="mt-3 rounded-xl border border-[#ffd166]/20 bg-[#ffd166]/5 p-3">
            <p className="text-[11px] leading-relaxed text-[#ffd166]">
              Awas pengecoh: tidak semua blok dibutuhkan. Blok yang salah akan membuat algoritma
              gagal saat diuji.
            </p>
          </div>
        </div>

        {/* Assembly area */}
        <div className="lg:col-span-3">
          <p className="mb-2 font-mono-code text-[11px] font-bold tracking-widest text-slate-400">
            AREA ALGORITMA ({areaItems.length} blok) — geser untuk mengurutkan
          </p>
          <div className="scroll-thin max-h-[420px] min-h-[200px] space-y-2 overflow-y-auto rounded-2xl border border-dashed border-white/15 bg-[#0a1120]/60 p-3">
            {areaItems.length === 0 && (
              <div className="flex h-40 items-center justify-center text-center">
                <p className="text-xs text-slate-500">
                  Ketuk blok di sebelah kiri untuk menambahkannya ke area algoritma
                </p>
              </div>
            )}
            <AreaList
              items={areaItems}
              onReorder={(ids) => {
                setArea(ids);
                setLines(null);
                setPassed(false);
              }}
              onRemove={moveToPool}
              onMove={moveInArea}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button
              onClick={runMission}
              disabled={passed}
              className="bg-[#ff7a1a] font-bold text-[#1a0e05] hover:bg-[#ff8c3a] disabled:opacity-50"
            >
              <Swords className="mr-1 h-4 w-4" /> UJI MISI
            </Button>
            {!passed && (
              <Button
                variant="outline"
                onClick={reset}
                className="border-white/15 text-slate-300 hover:text-white"
              >
                <RotateCcw className="mr-1 h-4 w-4" /> Reset
              </Button>
            )}
            {passed && (
              <Chip tone="mint">
                <CheckCircle2 className="h-3 w-3" /> Mesin lulus uji
              </Chip>
            )}
          </div>

          <AnimatePresence>
            {lines && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
                <SimConsole lines={lines} title={final.consoleTitle} />
              </motion.div>
            )}
          </AnimatePresence>

          {passed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 rounded-2xl border border-[#3ddc97]/35 bg-[#3ddc97]/8 p-5"
            >
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-[#3ddc97]" />
                <p className="font-bold text-[#3ddc97]">MISSION COMPLETE — mesin siap dipasang!</p>
              </div>
              <div className="mt-3">
                <Pseudo lines={area.map((id) => defs[id].text)} compact />
              </div>
              <div className="mt-4 rounded-xl border border-white/10 bg-[#0b1425]/70 p-4">
                <p className="font-mono-code text-[10px] tracking-widest text-slate-400">
                  PEMBAHASAN MISI
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-300">
                  {final.pembahasan}
                </p>
              </div>
              <Button
                onClick={() => s.setPhase("results")}
                className="mt-4 bg-[#3ddc97] font-bold text-[#05261a] hover:bg-[#5ce9ae]"
              >
                LIHAT HASIL BELAJAR
              </Button>
            </motion.div>
          )}

          {!passed && lines && (
            <div className="mt-4 rounded-xl border border-white/10 bg-[#0e1a33]/70 p-4">
              <p className="text-xs leading-relaxed text-slate-300">
                Misi belum lulus — perbaiki susunan blok berdasarkan pesan error, lalu UJI MISI
                lagi. Percobaan ke-{s.finalTries + 1}. Jika ingin berhenti, tombol{" "}
                <span className="text-slate-100">&ldquo;Akhir misi&rdquo;</span> di bawah merekam
                hasil seadanya.
              </p>
              <Button
                variant="ghost"
                onClick={() => {
                  s.completeFinal(false);
                  s.setPhase("results");
                }}
                className="mt-2 text-xs text-slate-500 hover:text-slate-300"
              >
                Akhiri misi & rekam hasil seadanya
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AreaList({
  items,
  onReorder,
  onRemove,
  onMove,
}: {
  items: { id: string; text: string }[];
  onReorder: (ids: string[]) => void;
  onRemove: (id: string) => void;
  onMove: (from: number, to: number) => void;
}) {
  return (
    <Reorder.Group
      axis="y"
      values={items.map((i) => i.id)}
      onReorder={onReorder}
      className="space-y-2"
    >
      {items.map((item, idx) => (
        <AreaRow
          key={item.id}
          id={item.id}
          text={item.text}
          index={idx}
          total={items.length}
          onRemove={onRemove}
          onMove={onMove}
        />
      ))}
    </Reorder.Group>
  );
}

function AreaRow({
  id,
  text,
  index,
  total,
  onRemove,
  onMove,
}: {
  id: string;
  text: string;
  index: number;
  total: number;
  onRemove: (id: string) => void;
  onMove: (from: number, to: number) => void;
}) {
  const controls = useDragControls();
  return (
    <Reorder.Item
      value={id}
      dragListener={false}
      dragControls={controls}
      whileDrag={{ scale: 1.02, boxShadow: "0 12px 30px -8px rgba(59,214,255,0.3)" }}
      className="flex touch-none list-none items-center gap-2 rounded-xl border border-white/10 bg-[#0e1a33] px-3 py-2.5"
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/5 font-mono-code text-[11px] font-bold text-slate-400">
        {index + 1}
      </span>
      <button
        type="button"
        className="flex flex-1 cursor-grab touch-none items-center gap-2 text-left active:cursor-grabbing"
        onPointerDown={(e) => controls.start(e)}
        aria-label={`Tahan untuk geser: ${text}`}
      >
        <GripVertical className="h-4 w-4 shrink-0 text-slate-500" />
        <span className="font-mono-code text-[12.5px] text-slate-100">{text}</span>
      </button>
      <div className="flex shrink-0 items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-slate-400 hover:text-white"
          disabled={index === 0}
          onClick={() => onMove(index, index - 1)}
          aria-label="Naikkan"
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-slate-400 hover:text-white"
          disabled={index === total - 1}
          onClick={() => onMove(index, index + 1)}
          aria-label="Turunkan"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-[#ff5470]/70 hover:text-[#ff5470]"
          onClick={() => onRemove(id)}
          aria-label={`Hapus blok: ${text}`}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Reorder.Item>
  );
}
