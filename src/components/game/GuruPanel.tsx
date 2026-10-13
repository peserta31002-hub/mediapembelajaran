"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Download,
  Eye,
  FolderOpen,
  KeyRound,
  Search,
  Trash2,
  TrendingUp,
  Upload,
  Users,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Chip } from "./ui";
import ResultView from "./ResultView";
import { useGame } from "@/lib/store";
import {
  buildRecapCsv,
  downloadBlob,
  loadRecaps,
  mergeRecap,
  parseReport,
  RecapEntry,
  resultsFromRecap,
  saveRecaps,
} from "@/lib/recap";

type SortKey = "nama" | "skor" | "tanggal";

export default function GuruPanel() {
  const s = useGame();
  const { toast } = useToast();
  // Lazy init aman: komponen ini hanya dirender setelah hydration gate di page.tsx
  const [entries, setEntries] = useState<RecapEntry[]>(() => loadRecaps());
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("skor");
  const [sortAsc, setSortAsc] = useState(false);
  const [detail, setDetail] = useState<RecapEntry | null>(null);
  const [showPtk, setShowPtk] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const openDetail = (e: RecapEntry) => {
    setDetail(e);
    setShowPtk(false);
  };

  const persist = (list: RecapEntry[]) => {
    setEntries(list);
    saveRecaps(list);
  };

  const handleFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files).filter((f) =>
      /\.csv$/i.test(f.name) || f.type.includes("csv") || f.type.includes("text")
    );
    if (!arr.length) {
      toast({
        title: "File tidak didukung",
        description: "Pilih file CSV hasil unduhan dari halaman Hasil siswa.",
        variant: "destructive",
      });
      return;
    }
    setBusy(true);
    let ok = 0;
    let fail = 0;
    let upd = 0;
    let list = entries;
    for (const f of arr) {
      try {
        const text = await f.text();
        const res = parseReport(text, f.name);
        if (res.ok && res.entry) {
          const merged = mergeRecap(list, res.entry);
          list = merged.list;
          if (merged.updated) upd++;
          else ok++;
        } else {
          fail++;
          toast({
            title: `Gagal membaca ${f.name}`,
            description: res.error ?? "Format tidak dikenali.",
            variant: "destructive",
          });
        }
      } catch {
        fail++;
        toast({
          title: `Gagal membaca ${f.name}`,
          description: "File tidak dapat dibaca.",
          variant: "destructive",
        });
      }
    }
    persist(list);
    setBusy(false);
    if (ok || upd) {
      toast({
        title: "Rekap diperbarui",
        description: `${ok ? `${ok} siswa ditambahkan` : ""}${ok && upd ? ", " : ""}${
          upd ? `${upd} data diperbarui (nama sama)` : ""
        }${fail ? ` • ${fail} file gagal` : ""}`,
      });
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const stats = useMemo(() => {
    const n = entries.length;
    const avg = n ? Math.round(entries.reduce((a, e) => a + e.skor, 0) / n) : 0;
    const tuntas = entries.filter((e) => e.kktp).length;
    return { n, avg, tuntas, belum: n - tuntas, pct: n ? Math.round((tuntas / n) * 100) : 0 };
  }, [entries]);

  const bands = useMemo(() => {
    const b = [
      { label: "0–49", count: 0 },
      { label: "50–69", count: 0 },
      { label: "70–84", count: 0 },
      { label: "85–100", count: 0 },
    ];
    for (const e of entries) {
      if (e.skor < 50) b[0].count++;
      else if (e.skor < 70) b[1].count++;
      else if (e.skor < 85) b[2].count++;
      else b[3].count++;
    }
    return b;
  }, [entries]);

  // Rata-rata progres 5 kemampuan kelas (C2–C3 s.d. P3) — data inti untuk
  // penelitian Kemampuan Berpikir Algoritmik.
  const abilityAvg = useMemo(() => {
    if (!entries.length) return [];
    const first = resultsFromRecap(entries[0]).abilities;
    return first.map((a, idx) => {
      const vals = entries.map((e) => resultsFromRecap(e).abilities[idx]?.pct ?? 0);
      return {
        key: a.key,
        label: a.label,
        bloom: a.bloom,
        avg: Math.round(vals.reduce((s, v) => s + v, 0) / entries.length),
      };
    });
  }, [entries]);

  const visible = useMemo(() => {
    let list = [...entries];
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((e) => e.nama.toLowerCase().includes(q));
    }
    list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "nama") cmp = a.nama.localeCompare(b.nama, "id");
      else if (sortKey === "skor") cmp = a.skor - b.skor;
      else cmp = a.importedAt - b.importedAt;
      return sortAsc ? cmp : -cmp;
    });
    return list;
  }, [entries, query, sortKey, sortAsc]);

  const exportRecap = () => {
    if (!entries.length) return;
    const d = new Date();
    const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(
      d.getDate()
    ).padStart(2, "0")}`;
    downloadBlob(buildRecapCsv(entries), `rekap-kelas-kdd-${stamp}.csv`);
    toast({ title: "Rekap kelas terunduh", description: "Siap dilampirkan ke dokumen PTK." });
  };

  const setSort = (k: SortKey) => {
    if (sortKey === k) setSortAsc(!sortAsc);
    else {
      setSortKey(k);
      setSortAsc(k === "nama");
    }
  };

  const back = () => s.setPhase(s.finalDone ? "results" : "landing");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono-code text-[11px] font-semibold tracking-[0.25em] text-[#3bd6ff]">
            PANEL GURU • REKAP PTK
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Rekap Skor Kelas
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
            Unggah file CSV yang diunduh tiap peserta didik dari halaman{" "}
            <span className="text-slate-200">Hasil Belajar</span> untuk melihat rekap skor satu
            kelas. Data tersimpan di perangkat ini dan tidak ikut ter-reset saat progres siswa
            dihapus.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => s.setPhase("peta")}
            className="border-[#3ddc97]/40 text-[#3ddc97] hover:bg-[#3ddc97]/10 hover:text-[#3ddc97]"
          >
            <KeyRound className="mr-1 h-4 w-4" /> PETA GURU
          </Button>
          <Button
            variant="outline"
            onClick={back}
            className="border-white/15 text-slate-300 hover:text-white"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> KEMBALI
          </Button>
        </div>
      </div>

      {/* Zona unggah */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && fileRef.current?.click()}
        aria-label="Unggah CSV hasil belajar siswa"
        className={`mt-6 cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-colors sm:p-10 ${
          dragOver
            ? "border-[#3bd6ff] bg-[#3bd6ff]/10"
            : "border-white/15 bg-white/[0.02] hover:border-[#ff7a1a]/50 hover:bg-[#ff7a1a]/5"
        }`}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv,text/plain"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff7a1a]/15">
          {busy ? (
            <TrendingUp className="h-6 w-6 animate-pulse text-[#ff7a1a]" />
          ) : (
            <Upload className="h-6 w-6 text-[#ff7a1a]" />
          )}
        </div>
        <p className="font-semibold text-white">
          {busy ? "Memproses file…" : "Tarik file CSV ke sini, atau klik untuk memilih"}
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Bisa unggah banyak file sekaligus • satu file = satu siswa • nama sama akan menimpa data
          lama
        </p>
      </motion.div>

      {/* Statistik */}
      {entries.length > 0 && (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={<Users className="h-4 w-4 text-[#3bd6ff]" />}
              label="Siswa terdata"
              value={String(stats.n)}
            />
            <StatCard
              icon={<BarChart3 className="h-4 w-4 text-[#ffd166]" />}
              label="Rata-rata skor"
              value={`${stats.avg}/100`}
            />
            <StatCard
              icon={<CheckCircle2 className="h-4 w-4 text-[#3ddc97]" />}
              label={`Tuntas KKTP ≥ 70 (${stats.pct}%)`}
              value={String(stats.tuntas)}
            />
            <StatCard
              icon={<XCircle className="h-4 w-4 text-[#ff5470]" />}
              label="Belum tuntas"
              value={String(stats.belum)}
            />
          </div>

          {/* Distribusi skor */}
          <div className="glass mt-4 rounded-2xl p-5">
            <p className="font-mono-code text-[11px] font-bold tracking-widest text-slate-400">
              DISTRIBUSI SKOR
            </p>
            <div className="mt-3 space-y-2.5">
              {bands.map((b) => {
                const pct = stats.n ? (b.count / stats.n) * 100 : 0;
                const color =
                  b.label === "85–100"
                    ? "from-[#3ddc97] to-[#8cf5c7]"
                    : b.label === "70–84"
                      ? "from-[#3bd6ff] to-[#8ae7ff]"
                      : b.label === "50–69"
                        ? "from-[#ff7a1a] to-[#ffb26b]"
                        : "from-[#ff5470] to-[#ff8aa0]";
                return (
                  <div key={b.label} className="flex items-center gap-3">
                    <span className="w-14 shrink-0 font-mono-code text-[11px] text-slate-400">
                      {b.label}
                    </span>
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/5">
                      <motion.div
                        className={`h-full rounded-full bg-gradient-to-r ${color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                    <span className="w-10 shrink-0 text-right font-mono-code text-[11px] text-slate-300">
                      {b.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress kemampuan kelas — rata-rata 5 kemampuan (indikator penelitian) */}
          {abilityAvg.length > 0 && (
            <div className="glass mt-4 rounded-2xl p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-mono-code text-[11px] font-bold tracking-widest text-slate-400">
                  PROGRESS KEMAMPUAN KELAS
                </p>
                <p className="font-mono-code text-[10px] text-slate-500">
                  rata-rata {stats.n} siswa • indikator Berpikir Algoritmik
                </p>
              </div>
              <div className="mt-4 space-y-4">
                {abilityAvg.map((a, i) => (
                  <div key={a.key}>
                    <div className="mb-1 flex items-baseline justify-between gap-2">
                      <p className="text-sm font-semibold text-white">
                        {a.label}{" "}
                        <span className="font-mono-code text-[10px] text-slate-500">{a.bloom}</span>
                      </p>
                      <p className="font-mono-code text-xs text-slate-400">{a.avg}%</p>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/5">
                      <motion.div
                        className={`h-full rounded-full ${
                          a.avg >= 70
                            ? "bg-gradient-to-r from-[#3ddc97] to-[#8cf5c7]"
                            : a.avg >= 40
                              ? "bg-gradient-to-r from-[#ff7a1a] to-[#ffb26b]"
                              : "bg-gradient-to-r from-[#ff5470] to-[#ff8aa0]"
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${a.avg}%` }}
                        transition={{ duration: 0.7, delay: i * 0.08 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Tabel siswa */}
      {entries.length > 0 && (
        <div className="glass mt-4 overflow-hidden rounded-2xl">
          <div className="flex flex-wrap items-center gap-2 border-b border-white/10 p-4">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari nama siswa…"
                className="h-9 border-white/10 bg-[#0b1425] pl-9 text-sm text-white placeholder:text-slate-600"
                aria-label="Cari nama siswa"
              />
            </div>
            <div className="ml-auto flex gap-2">
              <Button
                size="sm"
                onClick={exportRecap}
                className="bg-[#3bd6ff] font-bold text-[#062029] hover:bg-[#5fe0ff]"
              >
                <Download className="mr-1 h-4 w-4" /> UNDUH REKAP (CSV)
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#ff5470]/30 text-[#ff5470] hover:bg-[#ff5470]/10 hover:text-[#ff5470]"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Hapus semua rekap</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="border-white/10 bg-[#0c1528]">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-white">
                      Hapus semua data rekap?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-400">
                      {entries.length} data siswa akan dihapus dari perangkat ini. File CSV asli
                      tetap ada — kamu bisa mengunggahnya ulang.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-white/10 text-slate-300">
                      Batal
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-[#ff5470] text-white hover:bg-[#ff5470]/85"
                      onClick={() => {
                        persist([]);
                        toast({ title: "Rekap dihapus" });
                      }}
                    >
                      Ya, hapus
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 font-mono-code text-[10px] uppercase tracking-widest text-slate-400">
                  <th className="px-4 py-3 font-medium">#</th>
                  <th className="cursor-pointer px-4 py-3 font-medium hover:text-white" onClick={() => setSort("nama")}>
                    Nama {sortKey === "nama" && (sortAsc ? "▲" : "▼")}
                  </th>
                  <th className="px-4 py-3 font-medium">Kartu</th>
                  <th className="px-4 py-3 font-medium">Awal benar</th>
                  <th className="px-4 py-3 font-medium">Revisi</th>
                  <th className="px-4 py-3 font-medium">Final</th>
                  <th className="cursor-pointer px-4 py-3 font-medium hover:text-white" onClick={() => setSort("skor")}>
                    Skor {sortKey === "skor" && (sortAsc ? "▲" : "▼")}
                  </th>
                  <th className="px-4 py-3 font-medium">KKTP</th>
                  <th className="px-4 py-3 font-medium">Detail</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((e, i) => (
                  <tr
                    key={e.id}
                    className="border-b border-white/5 transition-colors last:border-0 hover:bg-white/[0.04]"
                  >
                    <td className="px-4 py-3 font-mono-code text-xs text-slate-500">{i + 1}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-white">{e.nama}</p>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <p className="text-[11px] text-slate-500">{e.tanggal}</p>
                        <Chip tone={(e.materi || "X.AP.1").includes("X.AP.2") ? "volt" : "ember"}>
                          {e.materi || "X.AP.1"}
                        </Chip>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono-code text-xs text-slate-300">
                      {e.kartuSelesai}/{e.kartuTotal}
                    </td>
                    <td className="px-4 py-3 font-mono-code text-xs text-slate-300">{e.awalBenar}</td>
                    <td className="px-4 py-3 font-mono-code text-xs text-slate-300">{e.direvisi}</td>
                    <td className="px-4 py-3">
                      <Chip
                        tone={e.finalStatus === "LULUS" ? "mint" : e.finalStatus === "BELUM" ? "coral" : "muted"}
                      >
                        {e.finalStatus === "LULUS" ? "lulus" : e.finalStatus === "BELUM" ? "belum" : "—"}
                      </Chip>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono-code text-base font-bold text-white">{e.skor}</span>
                      <span className="text-[10px] text-slate-500">/100</span>
                    </td>
                    <td className="px-4 py-3">
                      {e.kktp ? (
                        <Chip tone="mint">
                          <CheckCircle2 className="h-3 w-3" /> tuntas
                        </Chip>
                      ) : (
                        <Chip tone="coral">
                          <XCircle className="h-3 w-3" /> belum
                        </Chip>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-slate-400 hover:text-[#3bd6ff]"
                        onClick={() => openDetail(e)}
                        aria-label={`Lihat detail ${e.nama}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {!visible.length && (
                  <tr>
                    <td colSpan={9} className="px-4 py-10 text-center text-sm text-slate-500">
                      Tidak ada siswa yang cocok dengan pencarian “{query}”.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Keadaan kosong */}
      {entries.length === 0 && (
        <div className="glass mt-6 rounded-2xl p-8 text-center">
          <FolderOpen className="mx-auto h-10 w-10 text-slate-600" />
          <p className="mt-3 font-semibold text-white">Belum ada data siswa</p>
          <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-slate-400">
            Minta peserta didik menyelesaikan misi, lalu di halaman{" "}
            <span className="text-slate-200">Hasil Belajar</span> mereka menekan{" "}
            <span className="font-mono-code text-[11px] text-[#3bd6ff]">UNDUH DATA HASIL (CSV)</span>
            . Kumpulkan file-file itu, lalu unggah di sini untuk melihat rekap kelas.
          </p>
        </div>
      )}

      <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-500">
        <ClipboardList className="h-3.5 w-3.5" />
        Rekap tersimpan lokal di perangkat guru — cocok untuk dicetak atau dilampirkan sebagai data
        observasi PTK.
      </p>

      {/* Dialog detail siswa — tampilan PERSIS sama dengan halaman Hasil Belajar siswa */}
      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent
          aria-describedby={undefined}
          className="max-h-[92vh] max-w-6xl overflow-y-auto border-white/10 bg-[#0c1528] sm:max-w-6xl"
        >
          {detail && (
            <>
              <DialogTitle className="sr-only">Hasil belajar {detail.nama}</DialogTitle>

              <ResultView name={detail.nama} r={resultsFromRecap(detail)} />

              <p className="text-center font-mono-code text-[10px] tracking-[0.25em] text-slate-500">
                TAMPILAN DI ATAS IDENTIK DENGAN HALAMAN HASIL BELAJAR SISWA
              </p>

              {/* Data observasi PTK — opsional, bisa dibuka bila diperlukan */}
              <div className="rounded-xl border border-white/10 bg-white/[0.02]">
                <button
                  type="button"
                  onClick={() => setShowPtk(!showPtk)}
                  className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
                  aria-expanded={showPtk}
                >
                  <span className="flex items-center gap-2 font-mono-code text-[11px] font-bold tracking-widest text-slate-300">
                    <ClipboardList className="h-4 w-4 text-[#3bd6ff]" />
                    DATA OBSERVASI PTK — RINCIAN PER KARTU &amp; REFLEKSI
                  </span>
                  {showPtk ? (
                    <ChevronUp className="h-4 w-4 shrink-0 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
                  )}
                </button>

                {showPtk && (
                  <div className="space-y-4 border-t border-white/10 p-4">
                    <div>
                      <p className="mb-2 font-mono-code text-[10px] font-bold tracking-widest text-slate-400">
                        RINCIAN PER KARTU
                      </p>
                      <div className="space-y-2">
                        {detail.cards.map((c, i) => (
                          <div
                            key={i}
                            className="rounded-lg border border-white/10 bg-[#0e1a33]/70 p-3 text-xs"
                          >
                            <div className="flex flex-wrap items-center gap-2">
                              <Chip tone="ember">{c.level}</Chip>
                              <p className="font-semibold text-white">{c.title}</p>
                              <Chip tone={c.status === "Selesai" ? "mint" : "muted"}>
                                {c.status.toLowerCase()}
                              </Chip>
                              <span className="font-mono-code text-[10px] text-slate-400">
                                awal {c.pilihanAwal} ({c.benarAwal.toLowerCase()})
                                {c.direvisi === "Ya"
                                  ? ` → akhir ${c.pilihanAkhir} (${c.benarAkhir.toLowerCase()})`
                                  : ""}
                              </span>
                            </div>
                            {c.refleksiMini && c.refleksiMini !== "-" && (
                              <p className="mt-1.5 italic text-slate-400">“{c.refleksiMini}”</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 font-mono-code text-[10px] font-bold tracking-widest text-slate-400">
                        REFLEKSI AKHIR
                      </p>
                      <div className="space-y-2 text-xs">
                        {[
                          ["1", detail.refleksi.q1],
                          ["2", detail.refleksi.q2],
                          ["3", detail.refleksi.q3],
                        ].map(([n, q]) => (
                          <div key={n} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                            <p className="font-mono-code text-[10px] text-[#3bd6ff]">PERTANYAAN {n}</p>
                            <p className="mt-1 leading-relaxed text-slate-300">
                              {q || <span className="italic text-slate-500">(tidak diisi)</span>}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-500">
                      Sumber: {detail.fileName} • {detail.tanggal}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="glass flex items-center gap-3 rounded-2xl p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04]">
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wide text-slate-400">{label}</p>
        <p className="font-mono-code text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}
