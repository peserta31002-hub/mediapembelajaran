"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpenText,
  BrainCircuit,
  CheckCircle2,
  FileCode2,
  GitBranch,
  KeyRound,
  MousePointerClick,
  ShieldAlert,
  Terminal,
  TrendingUp,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CONTENTS, Campaign } from "@/lib/content";
import { useGame, cardsDoneCount, tutorialDoneOf, finalDoneOf } from "@/lib/store";

export default function LandingScreen() {
  const startGame = useGame((s) => s.startGame);
  const snap = useGame();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const begin = (campaign: Campaign) => {
    if (name.trim().length < 2) {
      setError("Tulis namamu dulu (minimal 2 huruf) agar hasil belajarmu tercatat.");
      return;
    }
    startGame(name, campaign);
  };

  return (
    <div className="grid-dots relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      {/* glow dekoratif */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-[#ff7a1a]/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#3bd6ff]/10 blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-4xl"
      >
        <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-md border border-[#3bd6ff]/30 bg-[#3bd6ff]/10 px-2.5 py-1 font-mono-code text-[11px] tracking-widest text-[#3bd6ff]">
            INFORMATIKA
          </span>
          <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-mono-code text-[11px] tracking-widest text-slate-300">
            KELAS X / FASE E
          </span>
          <span className="rounded-md border border-[#ff7a1a]/30 bg-[#ff7a1a]/10 px-2.5 py-1 font-mono-code text-[11px] tracking-widest text-[#ff7a1a]">
            X.AP.1 + X.AP.2 — DUA BAGIAN MISI
          </span>
        </div>

        <div className="glass rounded-3xl p-8 text-center sm:p-12">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff7a1a] to-[#ffb26b] shadow-[0_0_40px_rgba(255,122,26,0.45)]">
            <GitBranch className="h-8 w-8 text-[#1a0e05]" />
          </div>

          <h1 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl">
            KARTU DILEMA
            <span className="block bg-gradient-to-r from-[#ff7a1a] via-[#ffb26b] to-[#ff7a1a] bg-clip-text text-transparent text-glow-ember">
              DIGITAL
            </span>
          </h1>
          <p className="mt-3 font-mono-code text-sm font-semibold tracking-[0.35em] text-[#3bd6ff] text-glow-volt sm:text-base">
            ALGORITHM QUEST
          </p>
          <p className="mt-4 text-base italic text-slate-300 sm:text-lg">
            &ldquo;Setiap langkah punya konsekuensi.&rdquo;
          </p>

          <div className="mx-auto mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
            {[
              { icon: MousePointerClick, t: "Pilih algoritma", d: "Baca, bandingkan, dan kunci pilihanmu beserta alasannya." },
              { icon: ShieldAlert, t: "Lihat konsekuensinya", d: "Simulasi menunjukkan apa yang benar-benar terjadi." },
              { icon: TrendingUp, t: "Perbaiki & tumbuh", d: "Revisi setelah feedback, ukur kemampuanmu." },
            ].map((f) => (
              <div key={f.t} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left">
                <f.icon className="mb-2 h-5 w-5 text-[#ff7a1a]" />
                <p className="text-sm font-semibold text-white">{f.t}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{f.d}</p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-8 max-w-md">
            <label
              htmlFor="player-name"
              className="mb-2 block text-left text-xs font-medium tracking-wide text-slate-400"
            >
              NAMAMU (UNTUK PENCATATAN HASIL)
            </label>
            <Input
              id="player-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && begin(1)}
              placeholder="cth. Nadia Putri"
              className="h-11 border-white/15 bg-[#0b1425] text-white placeholder:text-slate-600"
              maxLength={40}
            />
            {error && <p className="mt-2 text-left text-xs text-[#ff5470]">{error}</p>}
          </div>

          {/* Pilih bagian misi */}
          <div className="mx-auto mt-6 grid max-w-2xl gap-3 text-left sm:grid-cols-2">
            {([1, 2] as Campaign[]).map((c) => {
              const content = CONTENTS[c];
              const done = cardsDoneCount(snap, c);
              const total = content.cards.length;
              const started = tutorialDoneOf(snap, c) || done > 0;
              const finished = finalDoneOf(snap, c);
              const ember = c === 1;
              return (
                <button
                  key={c}
                  onClick={() => begin(c)}
                  className={`group rounded-2xl border p-5 transition-all hover:-translate-y-0.5 ${
                    ember
                      ? "border-[#ff7a1a]/25 bg-[#ff7a1a]/[0.04] hover:border-[#ff7a1a]/50 hover:bg-[#ff7a1a]/[0.08]"
                      : "border-[#3bd6ff]/25 bg-[#3bd6ff]/[0.04] hover:border-[#3bd6ff]/50 hover:bg-[#3bd6ff]/[0.08]"
                  }`}
                >
                  <div className="mb-2 flex items-center gap-2.5">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        ember ? "bg-[#ff7a1a]/12" : "bg-[#3bd6ff]/12"
                      }`}
                    >
                      {ember ? (
                        <FileCode2 className="h-5 w-5 text-[#ff7a1a]" />
                      ) : (
                        <Terminal className="h-5 w-5 text-[#3bd6ff]" />
                      )}
                    </div>
                    <div>
                      <p
                        className={`font-mono-code text-[10px] font-bold tracking-[0.2em] ${
                          ember ? "text-[#ff7a1a]" : "text-[#3bd6ff]"
                        }`}
                      >
                        {content.bagianLabel} • {content.moduleCode}
                      </p>
                      <p className="text-sm font-bold leading-tight text-white">
                        {content.moduleTitle}
                      </p>
                    </div>
                    {finished && <CheckCircle2 className="ml-auto h-5 w-5 shrink-0 text-[#3ddc97]" />}
                  </div>

                  <p className="text-[12px] leading-relaxed text-slate-400">
                    {content.landingTagline}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-mono-code text-[10px] tracking-wider text-slate-500">
                      {started ? `PROGRES ${done}/${total} KARTU` : "10 KARTU • 5 LEVEL"}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-bold ${
                        ember ? "text-[#ff7a1a]" : "text-[#3bd6ff]"
                      }`}
                    >
                      {started ? "LANJUTKAN" : "MULAI"}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col items-center gap-2">
            <button
              onClick={() => useGame.getState().setPhase("materi")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#3bd6ff]/30 bg-[#3bd6ff]/[0.06] px-4 py-2 text-xs font-semibold text-[#3bd6ff] transition-colors hover:bg-[#3bd6ff]/12"
            >
              <BookOpenText className="h-4 w-4" />
              RUANG MATERI — bahas X.AP.1 & X.AP.2
            </button>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => useGame.getState().setPhase("peta")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#3ddc97]/30 bg-[#3ddc97]/[0.06] px-3 py-1.5 text-[11px] font-semibold text-[#3ddc97] transition-colors hover:bg-[#3ddc97]/12"
              >
                <KeyRound className="h-3 w-3" />
                PETA GURU — buka &amp; periksa semua menu
              </button>
              <button
                onClick={() => useGame.getState().setPhase("guru")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-slate-400 transition-colors hover:border-[#3bd6ff]/30 hover:text-[#3bd6ff]"
              >
                <Upload className="h-3 w-3" />
                PANEL GURU — unggah CSV &amp; rekap skor kelas
              </button>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-slate-500">
            <BrainCircuit className="h-3.5 w-3.5" />
            <span>
              Media tindakan PTK: meningkatkan kemampuan berpikir algoritmik — Notasi dan Penulisan
              Algoritma & Instalasi Lingkungan Pemrograman
            </span>
          </div>
        </div>

        <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-500">
          <BookOpenText className="h-3.5 w-3.5" />
          Berbasis Modul Ajar X.AP.1 & X.AP.2 • Problem-Based Learning dengan Kartu Dilema Digital
        </p>
      </motion.div>
    </div>
  );
}
