"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  CheckCircle2,
  FileCode2,
  ListChecks,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chip, Pseudo, SectionTitle } from "./ui";
import { MATERI_MODULES, MateriModule, MateriSection } from "@/lib/materiData";
import { useGame } from "@/lib/store";

export default function MateriScreen() {
  // Deep-link dari Peta Guru: langsung buka modul yang ditarget…
  const [selected, setSelected] = useState<MateriModule | null>(() => {
    const t = useGame.getState().materiTarget;
    return t ? (MATERI_MODULES.find((m) => m.id === t) ?? null) : null;
  });

  // …lalu bersihkan target agar kunjungan berikutnya mulai dari menu
  useEffect(() => {
    if (useGame.getState().materiTarget) {
      useGame.getState().setMateriTarget(null);
    }
  }, []);

  return selected ? (
    <MateriReader module={selected} onBack={() => setSelected(null)} />
  ) : (
    <MateriMenu onPick={setSelected} />
  );
}

/* ───────────────────────────── Menu ───────────────────────────── */

function MateriMenu({ onPick }: { onPick: (m: MateriModule) => void }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <SectionTitle
        eyebrow="RUANG MATERI & PEMBAHASAN"
        title="Pahami materinya, bukan hafal jawabannya"
        desc="Dua modul, dua pintu belajar. Baca sebelum bermain untuk bekal, atau sesudah bermain untuk memahami kenapa konsekuensi di layar terjadi seperti itu."
      />

      <div className="grid gap-5 md:grid-cols-2">
        {MATERI_MODULES.map((m, idx) => (
          <motion.button
            key={m.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            onClick={() => onPick(m)}
            className={`group relative overflow-hidden rounded-2xl border p-6 text-left transition-all hover:-translate-y-0.5 ${
              m.id === "xap1"
                ? "border-[#ff7a1a]/25 bg-[#0c1528]/80 hover:border-[#ff7a1a]/50 hover:shadow-[0_10px_40px_-12px_rgba(255,122,26,0.35)]"
                : "border-[#3bd6ff]/25 bg-[#0c1528]/80 hover:border-[#3bd6ff]/50 hover:shadow-[0_10px_40px_-12px_rgba(59,214,255,0.35)]"
            }`}
            aria-label={`Buka materi ${m.code} ${m.title}`}
          >
            <div className="mb-4 flex items-center gap-3">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  m.id === "xap1" ? "bg-[#ff7a1a]/12" : "bg-[#3bd6ff]/12"
                }`}
              >
                {m.id === "xap1" ? (
                  <FileCode2 className="h-6 w-6 text-[#ff7a1a]" />
                ) : (
                  <Terminal className="h-6 w-6 text-[#3bd6ff]" />
                )}
              </div>
              <div>
                <Chip tone={m.id === "xap1" ? "ember" : "volt"}>{m.code}</Chip>
                <h3 className="mt-1 text-lg font-bold leading-tight text-white">{m.title}</h3>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-slate-300">{m.tagline}</p>

            <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="mb-2 flex items-center gap-1.5 font-mono-code text-[10px] font-bold tracking-widest text-slate-400">
                <ListChecks className="h-3.5 w-3.5" /> ISI MATERI
              </p>
              <ul className="space-y-1.5">
                {m.outline.map((o) => (
                  <li key={o} className="flex items-baseline gap-2 text-[12.5px] text-slate-300">
                    <CheckCircle2
                      className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${
                        m.id === "xap1" ? "text-[#ff7a1a]" : "text-[#3bd6ff]"
                      }`}
                    />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>

            <span
              className={`mt-4 inline-flex items-center gap-1.5 text-sm font-bold ${
                m.id === "xap1" ? "text-[#ff7a1a]" : "text-[#3bd6ff]"
              }`}
            >
              BACA MATERI
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </motion.button>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Button
          onClick={() => useGame.getState().setPhase("landing")}
          variant="outline"
          className="border-white/15 text-slate-300 hover:text-white"
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> KEMBALI KE BERANDA
        </Button>
      </div>
    </div>
  );
}

/* ───────────────────────────── Reader ───────────────────────────── */

function MateriReader({
  module: m,
  onBack,
}: {
  module: MateriModule;
  onBack: () => void;
}) {
  const accent = m.id === "xap1" ? "#ff7a1a" : "#3bd6ff";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Menu materi
      </button>

      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <Chip tone={m.id === "xap1" ? "ember" : "volt"}>{m.code}</Chip>
          <span className="font-mono-code text-[11px] tracking-widest text-slate-500">
            RUANG MATERI
          </span>
        </div>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
          {m.title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">{m.intro}</p>
      </div>

      <div className="space-y-5">
        {m.sections.map((s, idx) => (
          <MateriSectionCard key={s.heading} section={s} index={idx} accent={accent} />
        ))}
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button
          onClick={onBack}
          variant="outline"
          className="border-white/15 text-slate-300 hover:text-white"
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> MENU MATERI
        </Button>
        <Button
          onClick={() => useGame.getState().setPhase("landing")}
          className="bg-[#ff7a1a] font-bold text-[#1a0e05] hover:bg-[#ff8c3a]"
        >
          <BookOpenText className="mr-1 h-4 w-4" /> SELESAI MEMBACA — KE BERANDA
        </Button>
      </div>
    </div>
  );
}

function MateriSectionCard({
  section,
  index,
  accent,
}: {
  section: MateriSection;
  index: number;
  accent: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-white/10 bg-[#0e1a33]/70 p-6"
      aria-label={section.heading}
    >
      <h2 className="flex items-baseline gap-3 text-lg font-bold text-white">
        <span
          className="font-mono-code text-sm font-black"
          style={{ color: accent }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        {section.heading}
      </h2>

      <div className="mt-3 space-y-3">
        {section.paragraphs.map((p, i) => (
          <p key={i} className="text-sm leading-relaxed text-slate-300">
            {p}
          </p>
        ))}
      </div>

      {section.bullets && (
        <ul className="mt-4 space-y-2">
          {section.bullets.map((b) => (
            <li
              key={b}
              className="flex items-baseline gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-[13px] leading-relaxed text-slate-300"
            >
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: accent }}
              />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}

      {section.table && (
        <div className="mt-4 overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[480px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                {section.table.head.map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2.5 font-mono-code text-[10px] font-bold tracking-widest text-slate-400"
                  >
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.table.rows.map((row, ri) => (
                <tr
                  key={ri}
                  className={ri % 2 === 0 ? "bg-[#0b1425]/60" : "bg-transparent"}
                >
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className={`px-3 py-2.5 align-top leading-relaxed ${
                        ci === 0 ? "font-mono-code text-slate-200" : "text-slate-300"
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {section.pseudo && <div className="mt-4"><Pseudo lines={section.pseudo} /></div>}

      {section.note && (
        <div className="mt-4 rounded-xl border border-[#3bd6ff]/25 bg-[#3bd6ff]/5 p-4">
          <p className="text-[12.5px] leading-relaxed text-slate-300">
            <span className="font-semibold text-[#3bd6ff]">Catatan:</span> {section.note}
          </p>
        </div>
      )}

      {section.missionLink && (
        <div className="mt-4 rounded-xl border border-[#ff7a1a]/25 bg-gradient-to-r from-[#ff7a1a]/10 to-transparent p-4">
          <p className="text-[12.5px] leading-relaxed text-slate-200">
            <span className="font-semibold text-[#ff7a1a]">Kaitan dengan misi:</span>{" "}
            {section.missionLink}
          </p>
        </div>
      )}
    </motion.section>
  );
}
