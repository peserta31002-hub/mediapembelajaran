"use client";

import { useMemo, useState } from "react";
import {
  BookOpenCheck,
  Download,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Chip, Pseudo } from "./ui";
import ResultView from "./ResultView";
import { getContent } from "@/lib/content";
import { computeResults, buildCsv } from "@/lib/scoring";
import { useGame } from "@/lib/store";

export default function ResultsScreen() {
  const s = useGame();
  const content = getContent(s.campaign);
  const r = useMemo(() => computeResults(s, s.campaign), [s]);
  const [openDiscuss, setOpenDiscuss] = useState(false);

  const downloadCsv = () => {
    const csv = buildCsv(s, s.campaign);
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hasil-kdd-${s.campaign === 2 ? "bagian2-" : ""}${(
      s.playerName || "siswa"
    ).replace(/\s+/g, "-").toLowerCase()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      {/* Banner + skor + stat + progress kemampuan (komponen bersama, identik dengan tampilan detail di Panel Guru) */}
      <ResultView name={s.playerName || undefined} r={r} />

      {/* Aksi */}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Dialog open={openDiscuss} onOpenChange={setOpenDiscuss}>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-[#3bd6ff] font-bold text-[#062029] hover:bg-[#5fe0ff]">
              <BookOpenCheck className="mr-1 h-4 w-4" /> LIHAT PEMBAHASAN
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto border-white/10 bg-[#0c1528]">
            <DialogHeader>
              <DialogTitle className="text-white">Pembahasan Seluruh Kartu</DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Kunci jawaban dan pembahasan setiap Kartu Dilema — bandingkan dengan pilihanmu untuk
                memperdalam pemahaman.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {content.cards.map((card) => {
                const rec = s.cards[card.id];
                const correct = card.options.find((o) => o.verdict === "optimal")!;
                return (
                  <div key={card.id} className="rounded-xl border border-white/10 bg-[#0e1a33]/70 p-4">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Chip tone="ember">LEVEL {card.level}</Chip>
                      <p className="text-sm font-bold text-white">
                        {card.id} — {card.title}
                      </p>
                      {rec?.status === "done" ? (
                        rec.finalCorrect ? (
                          <Chip tone="mint">benar</Chip>
                        ) : (
                          <Chip tone="coral">belum tepat</Chip>
                        )
                      ) : (
                        <Chip tone="muted">belum dikerjakan</Chip>
                      )}
                    </div>
                    <div className="mb-3">
                      <Pseudo lines={correct.pseudo} compact />
                    </div>
                    <p className="text-xs leading-relaxed text-slate-300">{card.pembahasan}</p>
                  </div>
                );
              })}
              {r.finalDone && (
                <div className="rounded-xl border border-[#3ddc97]/25 bg-[#3ddc97]/6 p-4">
                  <p className="mb-2 text-sm font-bold text-white">
                    FINAL CHALLENGE — {content.final.title}
                  </p>
                  <p className="text-xs leading-relaxed text-slate-300">
                    {content.final.pembahasan}
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <Button
          size="lg"
          variant="outline"
          onClick={downloadCsv}
          className="border-white/15 font-semibold text-slate-200 hover:text-white"
        >
          <Download className="mr-1 h-4 w-4" /> UNDUH DATA HASIL (CSV)
        </Button>

        <Button
          size="lg"
          variant="outline"
          onClick={() => s.setPhase("guru")}
          className="border-[#3bd6ff]/30 font-semibold text-[#3bd6ff] hover:bg-[#3bd6ff]/10 hover:text-[#3bd6ff]"
        >
          <Upload className="mr-1 h-4 w-4" /> PANEL GURU: UNGGAH CSV
        </Button>

        <Button
          size="lg"
          onClick={() => s.setPhase("reflection")}
          className="bg-[#ff7a1a] font-bold text-[#1a0e05] hover:bg-[#ff8c3a]"
        >
          LANJUT: REFLEKSI AKHIR
        </Button>
      </div>

      <p className="mt-6 text-center text-[11px] text-slate-500">
        Data CSV ini dapat dilampirkan guru sebagai dokumen observasi Penelitian Tindakan Kelas
        (PTK): mencakup jawaban awal, revisi, kualitas argumen, dan refleksi.
      </p>
    </div>
  );
}
