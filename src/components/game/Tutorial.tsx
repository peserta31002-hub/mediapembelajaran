"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, FlaskConical, RotateCcw, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import BlockSorter, { SortItem } from "./BlockSorter";
import { Chip, SectionTitle, SimConsole } from "./ui";
import { SimLine, simulateBlocks } from "@/lib/gameData";
import { getContent } from "@/lib/content";
import { useGame } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

export default function TutorialScreen() {
  const completeTutorial = useGame((s) => s.completeTutorial);
  const campaign = useGame((s) => s.campaign);
  const tutorial = getContent(campaign).tutorial;
  const { toast } = useToast();

  const [order, setOrder] = useState<string[]>(tutorial.shuffled);
  const [lines, setLines] = useState<SimLine[] | null>(null);
  const [passed, setPassed] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const items: SortItem[] = useMemo(
    () => order.map((id) => ({ id, text: tutorial.blocks[id].text })),
    [order, tutorial]
  );

  const runTest = () => {
    const result = simulateBlocks(order, tutorial.blocks);
    setLines(result.lines);
    setAttempts((a) => a + 1);
    setPassed(result.ok);
    if (result.ok) {
      toast({
        title: "Urutan valid!",
        description: "Mekanisme Kartu Dilema sudah kamu kuasai. Misi dimulai!",
      });
    }
  };

  const reset = () => {
    setOrder(tutorial.shuffled);
    setLines(null);
    setPassed(false);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <SectionTitle
        eyebrow="TUTORIAL • LATIHAN PRA-MISI"
        title={tutorial.title}
        desc={tutorial.scenario}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-white">
              Susun urutan langkah <span className="text-slate-400">(5 langkah)</span>
            </p>
            <Chip tone="muted">
              <Wrench className="h-3 w-3" /> geser / pakai panah
            </Chip>
          </div>

          <BlockSorter items={items} onOrderChange={setOrder} />

          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              onClick={runTest}
              disabled={passed}
              className="bg-[#3bd6ff] font-bold text-[#062029] hover:bg-[#5fe0ff]"
            >
              <FlaskConical className="mr-1 h-4 w-4" /> UJI URUTAN
            </Button>
            <Button
              onClick={reset}
              variant="outline"
              className="border-white/15 text-slate-300 hover:text-white"
            >
              <RotateCcw className="mr-1 h-4 w-4" /> Acak ulang
            </Button>
          </div>

          <div className="mt-4 rounded-xl border border-[#3bd6ff]/20 bg-[#3bd6ff]/5 p-4">
            <p className="text-xs leading-relaxed text-slate-300">
              <span className="font-semibold text-[#3bd6ff]">Petunjuk:</span> {tutorial.hint}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {lines ? (
            <>
              <SimConsole lines={lines} title={tutorial.consoleTitle} />
              {passed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-xl border border-[#3ddc97]/30 bg-[#3ddc97]/8 p-5"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-[#3ddc97]" />
                    <p className="font-bold text-[#3ddc97]">{tutorial.successTitle}</p>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    Kamu baru saja mempraktikkan inti media ini: <span className="text-white">menyusun
                    langkah</span>, <span className="text-white">menguji</span>, dan{" "}
                    <span className="text-white">membaca konsekuensi</span>. Pada Kartu Dilema nanti,
                    kamu juga akan mengunci <span className="text-white">alasan</span> sebelum
                    menguji, lalu <span className="text-white">merevisi</span> setelah melihat
                    hasilnya.
                  </p>
                  <Button
                    onClick={completeTutorial}
                    className="mt-4 bg-[#ff7a1a] font-bold text-[#1a0e05] hover:bg-[#ff8c3a]"
                  >
                    MULAI MISI KARTU DILEMA <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </motion.div>
              )}
              {!passed && (
                <p className="rounded-xl border border-[#ff5470]/25 bg-[#ff5470]/8 p-4 text-sm text-[#ff9db0]">
                  Konsekuensinya terlihat, kan? Perbaiki urutan langkah yang bermasalah, lalu UJI
                  lagi. Percobaan ke-{attempts}.
                </p>
              )}
            </>
          ) : (
            <div className="flex h-full min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-6 text-center">
              <FlaskConical className="mb-2 h-8 w-8 text-slate-600" />
              <p className="text-sm text-slate-400">
                Tekan <span className="font-semibold text-[#3bd6ff]">UJI URUTAN</span> untuk
                menjalankan simulasi langkah demi langkah.
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Urutan salah? Tidak apa-apa — justru itu cara belajarnya.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
