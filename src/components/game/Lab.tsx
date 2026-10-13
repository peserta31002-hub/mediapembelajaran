"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, FlaskConical, Lock, RotateCcw, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import BlockSorter, { SortItem } from "./BlockSorter";
import { Chip, SectionTitle, SimConsole } from "./ui";
import { LabTask, SimLine, simulateBlocks } from "@/lib/gameData";
import { getContent } from "@/lib/content";
import { useGame, isLabUnlocked, labTaskDone } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

export default function AlgorithmLab() {
  const s = useGame();
  const content = getContent(s.campaign);
  // Mode guru: Lab terbuka untuk pemeriksaan materi
  const unlocked = s.teacherMode || isLabUnlocked(s, s.campaign);
  const [activeTask, setActiveTask] = useState(0);

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <SectionTitle eyebrow={`${content.bagianLabel} • ALGORITHM LAB`} title="Laboratorium Algoritma" />
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-12 text-center">
          <Lock className="mb-3 h-10 w-10 text-slate-600" />
          <p className="text-sm text-slate-400">
            Lab terbuka setelah <span className="font-semibold text-white">10 Kartu Dilema {content.moduleCode}</span>{" "}
            selesai. Kembali ke dek kartu dan tuntaskan misimu!
          </p>
          <Button
            onClick={() => s.setPhase("cards")}
            className="mt-4 bg-[#ff7a1a] font-bold text-[#1a0e05] hover:bg-[#ff8c3a]"
          >
            KE DEK KARTU DILEMA
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <SectionTitle
        eyebrow={`${content.bagianLabel} • ALGORITHM LAB`}
        title="Laboratorium Algoritma"
        desc="Area eksperimen: susun langkah, geser urutan, rakit notasi — lalu tekan UJI ALGORITMA dan saksikan simulasi langkah demi langkah. Jika hasilnya tidak sesuai, perbaiki dan uji lagi."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {content.labTasks.map((t, i) => {
          const done = labTaskDone(s, s.campaign, t.id);
          const active = activeTask === i;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTask(i)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "border-[#ff7a1a] bg-[#ff7a1a]/10 text-white"
                  : "border-white/10 bg-[#0c1528]/70 text-slate-300 hover:border-white/25"
              }`}
            >
              <FlaskConical className={`h-4 w-4 ${active ? "text-[#ff7a1a]" : "text-slate-500"}`} />
              {t.title.replace("Task 1 — ", "Task 1: ").replace("Task 2 — ", "Task 2: ")}
              {done && <CheckCircle2 className="h-4 w-4 text-[#3ddc97]" />}
            </button>
          );
        })}
      </div>

      <LabWorkbench key={content.labTasks[activeTask].id} task={content.labTasks[activeTask]} />
    </div>
  );
}

function LabWorkbench({ task }: { task: LabTask }) {
  const s = useGame();
  const { toast } = useToast();
  const done = labTaskDone(s, s.campaign, task.id);

  const [order, setOrder] = useState<string[]>(task.shuffled);
  const [lines, setLines] = useState<SimLine[] | null>(null);
  const [passed, setPassed] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const items: SortItem[] = useMemo(
    () => order.map((id) => ({ id, text: task.defs[id].text })),
    [order, task]
  );

  const run = () => {
    const result = simulateBlocks(order, task.defs);
    const all: SimLine[] = [...result.lines];
    if (result.ok && task.tests) {
      for (const t of task.tests) {
        all.push({ kind: "info", text: `${t.label}: ${t.input}` });
        for (const out of t.expected) all.push({ kind: "ok", text: `OUTPUT → ${out}` });
      }
      all.push({ kind: "ok", text: "Kedua kasus uji lolos — IF/ELSE menangani semua jalur." });
    }
    setLines(all);
    setAttempts((a) => a + 1);
    setPassed(result.ok);
    if (result.ok && !done) {
      s.completeLab(task.id);
      toast({
        title: "Task Lab selesai!",
        description: "Algoritma berjalan tanpa error dan lolos uji kasus.",
      });
    }
  };

  const reset = () => {
    setOrder(task.shuffled);
    setLines(null);
    setPassed(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid gap-6 lg:grid-cols-2"
    >
      <div>
        <div className="mb-3 rounded-xl border border-white/10 bg-[#0e1a33]/70 p-4">
          <p className="text-sm font-semibold text-white">{task.title}</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">{task.scenario}</p>
          {task.tests && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {task.tests.map((t) => (
                <Chip key={t.label} tone="volt">
                  {t.input}
                </Chip>
              ))}
            </div>
          )}
        </div>

        <div className="mb-2 flex items-center justify-between">
          <p className="font-mono-code text-[11px] font-bold tracking-widest text-slate-400">
            AREA RAKIT — {task.mode === "pseudocode" ? "NOTASI PSEUDOCODE" : "LANGKAH NATURAL"}
          </p>
          <Chip tone="muted">geser / panah</Chip>
        </div>

        <BlockSorter items={items} onOrderChange={setOrder} mono={task.mode === "pseudocode"} />

        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            onClick={run}
            disabled={passed}
            className="bg-[#3bd6ff] font-bold text-[#062029] hover:bg-[#5fe0ff] disabled:opacity-50"
          >
            <Wand2 className="mr-1 h-4 w-4" /> UJI ALGORITMA
          </Button>
          {!passed && (
            <Button
              variant="outline"
              onClick={reset}
              className="border-white/15 text-slate-300 hover:text-white"
            >
              <RotateCcw className="mr-1 h-4 w-4" /> Ulangi
            </Button>
          )}
          {passed && (
            <Chip tone="mint">
              <CheckCircle2 className="h-3 w-3" /> Tuntas dalam {attempts} percobaan
            </Chip>
          )}
        </div>
      </div>

      <div>
        {lines ? (
          <SimConsole
            lines={lines}
            title={`UJI ALGORITMA — ${task.id.toUpperCase()}`}
          />
        ) : (
          <div className="flex h-full min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-6 text-center">
            <FlaskConical className="mb-2 h-8 w-8 text-slate-600" />
            <p className="text-sm text-slate-400">
              Susun blok di sebelah kiri, lalu tekan{" "}
              <span className="font-semibold text-[#3bd6ff]">UJI ALGORITMA</span>.
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Simulasi akan menjalankan algoritma langkah demi langkah — error apa pun akan
              ditunjukkan letaknya.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
