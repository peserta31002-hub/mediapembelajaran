"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpenText,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Eye,
  FileCode2,
  FlaskConical,
  Flag,
  GraduationCap,
  KeyRound,
  Layers,
  MessagesSquare,
  RotateCcw,
  ShieldAlert,
  Swords,
  Terminal,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
import { Chip, SectionTitle } from "./ui";
import { CONTENTS, Campaign } from "@/lib/content";
import {
  useGame,
  cardsDoneCount,
  finalDoneOf,
  isCardDone,
  isLevelUnlocked,
  labTaskDone,
  tutorialDoneOf,
} from "@/lib/store";

type ChipTone = "volt" | "ember" | "mint" | "coral" | "muted";

interface MapRowSpec {
  icon: React.ReactNode;
  name: string;
  desc: string;
  status?: { label: string; tone: ChipTone };
  onClick: () => void;
}

/* ────────────────────────── Baris menu peta ────────────────────────── */

function MapRow({ row, small }: { row: MapRowSpec; small?: boolean }) {
  return (
    <button
      onClick={row.onClick}
      className={`group flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] text-left transition-colors hover:border-[#3bd6ff]/35 hover:bg-[#3bd6ff]/[0.06] ${
        small ? "px-3 py-2" : "px-3.5 py-3"
      }`}
    >
      <span
        className={`flex shrink-0 items-center justify-center rounded-lg bg-white/5 text-slate-300 group-hover:text-[#3bd6ff] ${
          small ? "h-7 w-7" : "h-9 w-9"
        }`}
      >
        {row.icon}
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={`block truncate font-semibold ${
            small ? "text-[12.5px] text-slate-200" : "text-sm text-slate-100"
          }`}
        >
          {row.name}
        </span>
        <span className="block truncate text-[11px] text-slate-400">{row.desc}</span>
      </span>
      {row.status && <Chip tone={row.status.tone}>{row.status.label}</Chip>}
      <ArrowRight className="h-4 w-4 shrink-0 text-slate-600 transition-transform group-hover:translate-x-0.5 group-hover:text-[#3bd6ff]" />
    </button>
  );
}

/* ────────────────────────── Peta Guru ────────────────────────── */

export default function GuruMap() {
  const s = useGame();
  const [openDeck, setOpenDeck] = useState<Record<Campaign, boolean>>({ 1: false, 2: false });

  const toggleDeck = (c: Campaign) =>
    setOpenDeck((prev) => ({ ...prev, [c]: !prev[c] }));

  const goPhase = (c: Campaign, p: Parameters<typeof s.setPhase>[0]) => {
    s.setCampaign(c);
    s.setPhase(p);
  };

  const goCard = (c: Campaign, id: string) => {
    s.setCampaign(c);
    s.openCard(id);
  };

  const goMateri = (id: "xap1" | "xap2") => {
    s.setMateriTarget(id);
    s.setPhase("materi");
  };

  /* Status ringkas per bagian */
  const bagianInfo = (c: Campaign) => {
    const content = CONTENTS[c];
    const done = cardsDoneCount(s, c);
    const tDone = tutorialDoneOf(s, c);
    const fDone = finalDoneOf(s, c);
    const labDone = content.labTasks.filter((t) => labTaskDone(s, c, t.id)).length;
    return { content, done, total: content.cards.length, tDone, fDone, labDone };
  };

  const cardStatus = (c: Campaign, cardId: string, level: number): { label: string; tone: ChipTone } => {
    if (isCardDone(s, cardId)) return { label: "SELESAI", tone: "mint" };
    if (s.teacherMode || isLevelUnlocked(s, c, level)) return { label: "TERBUKA", tone: "volt" };
    return { label: "TERKUNCI", tone: "coral" };
  };

  const umumRows: MapRowSpec[] = [
    {
      icon: <FileCode2 className="h-4 w-4" />,
      name: "Ruang Materi — X.AP.1 Notasi dan Penulisan Algoritma",
      desc: "Bahan ajar lengkap: pengertian algoritma, notasi MULAI/INPUT/IF/ELSE/REPEAT, contoh pseudocode.",
      onClick: () => goMateri("xap1"),
    },
    {
      icon: <Terminal className="h-4 w-4" />,
      name: "Ruang Materi — X.AP.2 Instalasi Lingkungan Pemrograman",
      desc: "Bahan ajar lengkap: komponen lingkungan, alur instalasi, verifikasi, etika penggunaan perangkat.",
      onClick: () => goMateri("xap2"),
    },
    {
      icon: <Upload className="h-4 w-4" />,
      name: "Panel Guru — Unggah CSV & Rekap Kelas",
      desc: "Unggah file CSV hasil siswa untuk melihat skor, PROGRESS KEMAMPUAN, dan data observasi PTK.",
      onClick: () => s.setPhase("guru"),
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div className="mb-5">
          <Button
            variant="outline"
            onClick={() => s.setPhase("landing")}
            className="border-white/15 text-slate-300 hover:text-white"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> BERANDA
          </Button>
        </div>

        <SectionTitle
          eyebrow="PUSAT GURU — PETA MEDIA"
          title="Periksa semua menu dari satu tempat"
          desc="Media ini mengikuti alur berantai untuk siswa: briefing → tutorial → kartu → lab → final → hasil → refleksi, dan setiap level kartu terbuka bertahap. Di sini kamu bebas membuka menu mana pun tanpa harus menyelesaikan misi — lengkap dengan status terkininya."
        />
      </motion.div>

      {/* Mode jelajah bebas */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="glass rounded-2xl p-5"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#3ddc97]/12">
              <KeyRound className="h-5 w-5 text-[#3ddc97]" />
            </div>
            <div>
              <p className="font-mono-code text-[10px] font-bold tracking-[0.2em] text-[#3ddc97]">
                MODE JELAJAH BEBAS
              </p>
              <p className="mt-0.5 text-sm font-semibold text-white">Buka semua kunci navigasi</p>
              <p className="mt-1 max-w-xl text-xs leading-relaxed text-slate-400">
                Saat aktif, seluruh tahap di navigasi atas, semua level dek kartu, Algorithm Lab,
                dan Final Challenge terbuka seolah semua progres telah dicapai — praktis untuk
                memeriksa materi atau demonstrasi di depan kelas. Matikan kembali agar siswa
                mengikuti alur terkunci seperti semula.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Chip tone={s.teacherMode ? "mint" : "muted"}>
              {s.teacherMode ? (
                <>
                  <CheckCircle2 className="h-3 w-3" /> AKTIF
                </>
              ) : (
                "NONAKTIF"
              )}
            </Chip>
            <Switch
              checked={s.teacherMode}
              onCheckedChange={s.setTeacherMode}
              aria-label="Aktifkan mode jelajah bebas guru"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#ffd166]/25 bg-[#ffd166]/[0.06] px-4 py-3">
          <p className="flex max-w-xl items-start gap-2 text-[11.5px] leading-relaxed text-[#ffd166]">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
            Jawaban yang dikunci saat menjelajah ikut tercatat di perangkat ini. Tekan RESET sebelum
            menyerahkan perangkat ke peserta didik berikutnya agar progres mereka mulai bersih.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 border-[#ffd166]/40 text-[#ffd166] hover:bg-[#ffd166]/10 hover:text-[#ffd166]"
              >
                <RotateCcw className="mr-1 h-3.5 w-3.5" /> RESET PROGRES
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-white/10 bg-[#0c1528]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Reset seluruh progres?</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-400">
                  Semua jawaban, revisi, skor, dan refleksi di perangkat ini akan dihapus dan media
                  kembali ke halaman awal — mode jelajah bebas juga dimatikan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-white/10 text-slate-300">Batal</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-[#ff5470] text-white hover:bg-[#ff5470]/85"
                  onClick={() => s.resetAll()}
                >
                  Ya, reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </motion.div>

      {/* UMUM */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="mt-6"
        aria-label="Menu umum"
      >
        <p className="mb-3 font-mono-code text-[11px] font-bold tracking-[0.25em] text-slate-400">
          UMUM — BERLAKU UNTUK KEDUA BAGIAN
        </p>
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
          {umumRows.map((row) => (
            <MapRow key={row.name} row={row} />
          ))}
        </div>
      </motion.section>

      {/* Per bagian */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {([1, 2] as Campaign[]).map((c, ci) => {
          const { content, done, total, tDone, fDone, labDone } = bagianInfo(c);
          const ember = c === 1;
          const accent = ember ? "text-[#ff7a1a]" : "text-[#3bd6ff]";
          const Icon = ember ? FileCode2 : Terminal;
          return (
            <motion.section
              key={c}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.14 + ci * 0.05 }}
              className={`rounded-2xl border p-5 ${
                ember ? "border-[#ff7a1a]/20 bg-[#0c1528]/80" : "border-[#3bd6ff]/20 bg-[#0c1528]/80"
              }`}
              aria-label={`Menu bagian ${c}`}
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      ember ? "bg-[#ff7a1a]/12" : "bg-[#3bd6ff]/12"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${accent}`} />
                  </div>
                  <div>
                    <p className={`font-mono-code text-[10px] font-bold tracking-[0.2em] ${accent}`}>
                      {content.bagianLabel} • {content.moduleCode}
                    </p>
                    <h3 className="text-base font-bold leading-tight text-white">
                      {content.moduleTitle}
                    </h3>
                  </div>
                </div>
                <Chip tone={done === total ? "mint" : "muted"}>
                  {done}/{total} KARTU
                </Chip>
              </div>

              <div className="space-y-2.5">
                <MapRow
                  small={false}
                  row={{
                    icon: <Flag className="h-4 w-4" />,
                    name: "Briefing Misi",
                    desc: "Konteks masalah, tujuan pembelajaran, dan alur misi.",
                    onClick: () => goPhase(c, "briefing"),
                  }}
                />
                <MapRow
                  row={{
                    icon: <GraduationCap className="h-4 w-4" />,
                    name: "Tutorial Interaktif",
                    desc: content.tutorial.title,
                    status: tDone ? { label: "SELESAI", tone: "mint" } : { label: "TERBUKA", tone: "volt" },
                    onClick: () => goPhase(c, "tutorial"),
                  }}
                />
                <MapRow
                  row={{
                    icon: <Layers className="h-4 w-4" />,
                    name: "Dek Kartu Dilema — 5 Level",
                    desc: "Peta 10 kartu dengan kunci level bertahap.",
                    status:
                      done === total
                        ? { label: "TUNTAS", tone: "mint" }
                        : tDone
                          ? { label: `${done}/${total}`, tone: "volt" }
                          : { label: "TERKUNCI", tone: "coral" },
                    onClick: () => goPhase(c, "cards"),
                  }}
                />
                <MapRow
                  row={{
                    icon: <FlaskConical className="h-4 w-4" />,
                    name: "Algorithm Lab",
                    desc: "2 task susun-ulang + UJI ALGORITMA step simulation.",
                    status:
                      labDone === content.labTasks.length
                        ? { label: "SELESAI", tone: "mint" }
                        : done === total
                          ? { label: `${labDone}/2`, tone: "volt" }
                          : { label: "TERKUNCI", tone: "coral" },
                    onClick: () => goPhase(c, "lab"),
                  }}
                />
                <MapRow
                  row={{
                    icon: <Swords className="h-4 w-4" />,
                    name: "Final Challenge",
                    desc: content.final.title,
                    status: fDone
                      ? { label: "SELESAI", tone: "mint" }
                      : labDone === content.labTasks.length
                        ? { label: "TERBUKA", tone: "volt" }
                        : { label: "TERKUNCI", tone: "coral" },
                    onClick: () => goPhase(c, "final"),
                  }}
                />
                <MapRow
                  row={{
                    icon: <BarChart3 className="h-4 w-4" />,
                    name: "Hasil Belajar",
                    desc: "Skor 0–100, KKTP 70, PROGRESS KEMAMPUAN 5 bar, unduh CSV.",
                    status: fDone ? { label: "ADA HASIL", tone: "volt" } : { label: "TERKUNCI", tone: "coral" },
                    onClick: () => goPhase(c, "results"),
                  }}
                />
                <MapRow
                  row={{
                    icon: <MessagesSquare className="h-4 w-4" />,
                    name: "Refleksi Akhir",
                    desc: "3 pertanyaan refleksi tersimpan (global, dipakai CSV kedua bagian).",
                    status: s.survey.saved ? { label: "TERSIMPAN", tone: "mint" } : undefined,
                    onClick: () => goPhase(c, "reflection"),
                  }}
                />

                {/* Expander isi dek */}
                <button
                  onClick={() => toggleDeck(c)}
                  aria-expanded={openDeck[c]}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl border border-dashed px-3 py-2 font-mono-code text-[10.5px] font-bold tracking-[0.2em] transition-colors ${
                    ember
                      ? "border-[#ff7a1a]/30 text-[#ff7a1a] hover:bg-[#ff7a1a]/[0.06]"
                      : "border-[#3bd6ff]/30 text-[#3bd6ff] hover:bg-[#3bd6ff]/[0.06]"
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" />
                  {openDeck[c] ? "TUTUP DAFTAR KARTU" : "LIHAT 10 KARTU PER LEVEL"}
                  {openDeck[c] ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>

                {openDeck[c] && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-2 rounded-xl border border-white/10 bg-white/[0.02] p-2.5"
                  >
                    {content.levels.map((level) => (
                      <div key={level.id}>
                        <p className="mb-1.5 mt-1 flex items-center gap-2 px-1 font-mono-code text-[10px] font-bold tracking-[0.2em] text-slate-500">
                          <Layers className="h-3 w-3" /> LEVEL {level.id} — {level.name.toUpperCase()}
                        </p>
                        <div className="space-y-1.5">
                          {content.cards
                            .filter((card) => card.level === level.id)
                            .map((card) => (
                              <MapRow
                                key={card.id}
                                small
                                row={{
                                  icon: <BookOpenText className="h-3.5 w-3.5" />,
                                  name: `${card.id} — ${card.title}`,
                                  desc: card.hook,
                                  status: cardStatus(c, card.id, card.level),
                                  onClick: () => goCard(c, card.id),
                                }}
                              />
                            ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.section>
          );
        })}
      </div>

      <p className="mt-6 flex items-center justify-center gap-2 text-center text-[11px] text-slate-500">
        <KeyRound className="h-3.5 w-3.5" />
        Pusat Guru hanya membuka akses di perangkat ini — data siswa tetap tersimpan terpisah di
        localStorage masing-masing.
      </p>
    </div>
  );
}
