"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, MessageSquareHeart, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SectionTitle } from "./ui";
import { useGame } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

const QUESTIONS = [
  {
    id: "q1",
    text: "Bagian mana yang paling membuatmu berpikir?",
    placeholder:
      "Contoh: saat melihat pesan 'Login berhasil' muncul sebelum password dicek, aku baru sadar urutan OUTPUT itu penting…",
  },
  {
    id: "q2",
    text: "Apakah ada pilihan yang kamu ubah setelah melihat konsekuensinya?",
    placeholder:
      "Ceritakan kartunya dan alasannya — apa yang membuatmu berubah pikiran (atau tetap yakin)?",
  },
  {
    id: "q3",
    text: "Apa yang sekarang kamu pahami tentang algoritma?",
    placeholder:
      "Gunakan kata-katamu sendiri: tentang urutan langkah, notasi, kondisi, pengulangan, atau alasan di balik pilihan algoritma…",
  },
];

export default function ReflectionScreen() {
  const s = useGame();
  const { toast } = useToast();
  const [q1, setQ1] = useState(s.survey.q1);
  const [q2, setQ2] = useState(s.survey.q2);
  const [q3, setQ3] = useState(s.survey.q3);

  const save = () => {
    if (!q1.trim() || !q2.trim() || !q3.trim()) {
      toast({
        title: "Belum lengkap",
        description: "Jawab ketiga pertanyaan dulu ya — tulis sesingkat apa pun tidak apa-apa.",
        variant: "destructive",
      });
      return;
    }
    s.saveSurvey(q1.trim(), q2.trim(), q3.trim());
    toast({
      title: "Refleksi tersimpan",
      description: "Jawabanmu masuk ke data hasil belajar (CSV). Terima kasih!",
    });
  };

  const setters: Record<string, (v: string) => void> = {
    q1: setQ1,
    q2: setQ2,
    q3: setQ3,
  };
  const values: Record<string, string> = { q1, q2, q3 };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <SectionTitle
        eyebrow="HALAMAN 8 • REFLEKSI"
        title="Misi selesai — saatnya merenung"
        desc="Tiga pertanyaan singkat. Tidak ada jawaban benar atau salah di sini; tulis apa adanya. Refleksimu membantu guru melihat bagian mana yang paling mengubah cara berpikirmu."
      />

      <div className="space-y-5">
        {QUESTIONS.map((q, i) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-white/10 bg-[#0e1a33]/70 p-5"
          >
            <div className="mb-3 flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#3bd6ff]/12 font-mono-code text-sm font-bold text-[#3bd6ff]">
                {i + 1}
              </span>
              <p className="pt-1 text-base font-semibold text-white">{q.text}</p>
            </div>
            <Textarea
              value={values[q.id]}
              onChange={(e) => setters[q.id](e.target.value)}
              placeholder={q.placeholder}
              className="min-h-[96px] border-white/10 bg-[#0b1425] text-sm text-white placeholder:text-slate-600"
              maxLength={600}
            />
          </motion.div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-center gap-4">
        {s.survey.saved ? (
          <div className="flex items-center gap-2 rounded-xl border border-[#3ddc97]/30 bg-[#3ddc97]/8 px-5 py-3">
            <CheckCircle2 className="h-5 w-5 text-[#3ddc97]" />
            <p className="text-sm text-[#3ddc97]">
              Refleksi tersimpan — kamu bisa memperbaruinya kapan saja dengan menekan simpan lagi.
            </p>
          </div>
        ) : null}
        <Button
          onClick={save}
          size="lg"
          className="bg-[#ff7a1a] px-10 font-bold text-[#1a0e05] hover:bg-[#ff8c3a]"
        >
          <Send className="mr-1 h-4 w-4" /> {s.survey.saved ? "PERBARUI REFLEKSI" : "SIMPAN REFLEKSI"}
        </Button>
        <div className="flex items-center gap-2 text-center text-xs text-slate-500">
          <MessageSquareHeart className="h-4 w-4" />
          <span>
            Refleksi ikut terunduh saat guru mengunduh data hasil belajar (CSV) di halaman Hasil.
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
          <Sparkles className="h-3.5 w-3.5" />
          &ldquo;Setiap langkah punya konsekuensi.&rdquo; — termasuk langkahmu dalam berpikir hari ini.
        </div>
      </div>
    </div>
  );
}
