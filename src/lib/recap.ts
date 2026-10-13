// ─────────────────────────────────────────────────────────────────────────────
// PANEL GURU — parse laporan CSV per siswa (hasil unduhan halaman Hasil),
// simpan rekap kelas di localStorage, dan bangun CSV rekap gabungan.
// Format laporan: delimiter ";", field teks dibungkus kutip dengan escape "".
// ─────────────────────────────────────────────────────────────────────────────

import { ABILITY_META, AbilityKey } from "./gameData";
import { CONTENTS, Campaign } from "./content";
import { FINAL_POINTS, POINTS_FIRST, POINTS_REVISED, Results } from "./scoring";

export interface RecapCard {
  title: string;
  level: string;
  status: string;
  pilihanAwal: string;
  benarAwal: string;
  alasanAwal: string;
  direvisi: string;
  pilihanAkhir: string;
  benarAkhir: string;
  refleksiMini: string;
}

export type FinalStatus = "LULUS" | "BELUM" | "BELUM_DIKERJAKAN";

/** Skor satu kemampuan (progres 5 kemampuan Bloom) dari section PROGRESS KEMAMPUAN. */
export interface RecapAbility {
  key: AbilityKey | ""; // "" bila label tidak dikenali — tetap disimpan apa adanya
  label: string;
  bloom: string;
  earned: number;
  max: number;
  pct: number;
}

export interface RecapEntry {
  id: string;
  nama: string;
  tanggal: string;
  skor: number;
  kktp: boolean;
  kartuSelesai: number;
  kartuTotal: number;
  awalBenar: number;
  direvisi: number;
  finalStatus: FinalStatus;
  finalTries: number;
  argumenSound: number;
  argumenTotal: number;
  cards: RecapCard[];
  refleksi: { q1: string; q2: string; q3: string };
  /** Section PROGRESS KEMAMPUAN di CSV (kosong pada CSV versi lama). */
  abilities: RecapAbility[];
  /** Materi asal laporan: "X.AP.1" atau "X.AP.2" (CSV lama: "X.AP.1"). */
  materi: string;
  fileName: string;
  importedAt: number;
}

export interface ParseResult {
  ok: boolean;
  error?: string;
  entry?: RecapEntry;
}

const RECAP_KEY = "kdd_guru_recaps_v1";

/** Split satu baris delimiter ';' yang sadar-kutip: "..." boleh berisi ';' dan " di-escape jadi "". */
function splitLine(line: string, delim = ";"): string[] {
  const out: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQ) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQ = false;
        }
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQ = true;
    } else if (ch === delim) {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

function unquote(v: string): string {
  const t = v.trim();
  if (t.length >= 2 && t.startsWith('"') && t.endsWith('"')) {
    return t.slice(1, -1).replace(/""/g, '"');
  }
  return t;
}

function parseIntSafe(v: string | undefined, fallback = 0): number {
  const n = parseInt((v ?? "").trim(), 10);
  return Number.isFinite(n) ? n : fallback;
}

function numBeforeSlash(v: string | undefined): number {
  return parseIntSafe(v?.split("/")[0], 0);
}

function slugId(nama: string): string {
  return (
    nama
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .slice(0, 40) || "siswa"
  );
}

export function parseReport(text: string, fileName: string): ParseResult {
  const clean = text.replace(/^\ufeff/, "");
  const lines = clean.split(/\r?\n/);

  if (!lines[0]?.toUpperCase().includes("KARTU DILEMA DIGITAL")) {
    return {
      ok: false,
      error: "Bukan laporan Kartu Dilema Digital (baris judul tidak dikenali).",
    };
  }

  let nama = "";
  let tanggal = "";
  let materi = "";
  let skor = -1;
  let kktp = false;
  let kartuSelesai = 0;
  let kartuTotal = 0;
  let awalBenar = 0;
  let direvisi = 0;
  let finalStatus: FinalStatus = "BELUM_DIKERJAKAN";
  let finalTries = 0;
  let argumenSound = 0;
  let argumenTotal = 0;
  const cards: RecapCard[] = [];
  const abilities: RecapAbility[] = [];
  const refleksi = { q1: "", q2: "", q3: "" };

  let section: "head" | "abilities" | "cards" | "refleksi" = "head";
  let cardHeaderSeen = false;

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) continue;

    if (section === "head") {
      if (line === "PROGRESS KEMAMPUAN") {
        section = "abilities";
        continue;
      }
      if (line.startsWith("Kartu;Level;")) {
        cardHeaderSeen = true;
        section = "cards";
        continue;
      }
      if (line === "REFLEKSI AKHIR") {
        section = "refleksi";
        continue;
      }
      const parts = splitLine(line);
      const key = (parts[0] ?? "").trim();
      const val = parts.slice(1).join(";");
      if (key === "Nama") nama = unquote(val);
      else if (key === "Tanggal") tanggal = unquote(val);
      else if (key === "Materi") materi = unquote(val);
      else if (key === "Skor Akhir") skor = numBeforeSlash(val);
      else if (key.startsWith("KKTP")) kktp = val.trim() === "Tercapai";
      else if (key === "Kartu Selesai") {
        kartuSelesai = numBeforeSlash(val);
        kartuTotal = parseIntSafe(val.split("/")[1], 0);
      } else if (key === "Jawaban Awal Benar") awalBenar = numBeforeSlash(val);
      else if (key === "Jawaban yang Direvisi") direvisi = parseIntSafe(val, 0);
      else if (key === "Final Challenge") {
        const lv = val.toLowerCase();
        const m = val.match(/\(percobaan:\s*(\d+)\)/);
        finalTries = m ? parseIntSafe(m[1], 0) : 0;
        if (lv.includes("belum dikerjakan")) finalStatus = "BELUM_DIKERJAKAN";
        else if (lv.includes("belum")) finalStatus = "BELUM";
        else if (lv.includes("lulus")) finalStatus = "LULUS";
      } else if (key.startsWith("Kualitas Argumen")) {
        argumenSound = numBeforeSlash(val);
        argumenTotal = parseIntSafe(val.split("/")[1], 0);
      }
      continue;
    }

    if (section === "abilities") {
      if (line === "PROGRESS KEMAMPUAN") continue;
      if (line.startsWith("Kartu;Level;")) {
        cardHeaderSeen = true;
        section = "cards";
        continue;
      }
      if (line === "REFLEKSI AKHIR") {
        section = "refleksi";
        continue;
      }
      const f = splitLine(line);
      if ((f[0] ?? "").trim() !== "Kemampuan") continue;
      const label = unquote(f[1] ?? "");
      const bloom = unquote(f[2] ?? "");
      const earned = numBeforeSlash(f[3]);
      const max = parseIntSafe(f[3]?.split("/")[1], 0);
      const pct = parseIntSafe(f[4]?.replace("%", ""), 0);
      if (!label) continue;
      const key = abilityKeyFromLabel(label);
      abilities.push({ key, label, bloom, earned, max, pct });
      continue;
    }

    if (section === "cards") {
      if (line === "REFLEKSI AKHIR") {
        section = "refleksi";
        continue;
      }
      if (!cardHeaderSeen) continue;
      const f = splitLine(line);
      if (f.length < 10) continue;
      cards.push({
        title: unquote(f[0]),
        level: (f[1] ?? "").trim(),
        status: (f[2] ?? "").trim(),
        pilihanAwal: unquote(f[3]),
        benarAwal: (f[4] ?? "").trim(),
        alasanAwal: unquote(f[5]),
        direvisi: (f[6] ?? "").trim(),
        pilihanAkhir: unquote(f[7]),
        benarAkhir: (f[8] ?? "").trim(),
        refleksiMini: unquote(f[9]),
      });
      continue;
    }

    // section === "refleksi"
    if (/^1\s/.test(line)) refleksi.q1 = unquote(splitLine(line).slice(1).join(";"));
    else if (/^2\s/.test(line)) refleksi.q2 = unquote(splitLine(line).slice(1).join(";"));
    else if (/^3\s/.test(line)) refleksi.q3 = unquote(splitLine(line).slice(1).join(";"));
  }

  if (skor < 0) {
    return {
      ok: false,
      error: "Baris 'Skor Akhir' tidak ditemukan — file mungkin rusak atau bukan laporan siswa.",
    };
  }

  const entry: RecapEntry = {
    id: slugId(nama || "(tanpa nama)") + "-" + Date.now().toString(36),
    nama: nama || "(tanpa nama)",
    tanggal,
    skor,
    kktp,
    kartuSelesai,
    kartuTotal,
    awalBenar,
    direvisi,
    finalStatus,
    finalTries,
    argumenSound,
    argumenTotal,
    cards,
    abilities,
    refleksi,
    materi: materiCode(materi),
    fileName,
    importedAt: Date.now(),
  };
  return { ok: true, entry };
}

/** Ambil kode pendek materi ("X.AP.1" / "X.AP.2") dari baris Materi di CSV. */
function materiCode(materi: string): string {
  if (!materi) return "X.AP.1";
  const m = materi.match(/X\.AP\.\d+/);
  return m ? m[0] : "X.AP.1";
}

// ───────────────── Rekonstruksi Results (tampilan halaman Hasil) ─────────────────

/** Peta string materi pada CSV → nomor bagian konten. */
export function campaignFromMateri(materi?: string): Campaign {
  return (materi ?? "X.AP.1").includes("X.AP.2") ? 2 : 1;
}

/**
 * Bangun ulang objek `Results` — struktur yang sama persis dengan hasil
 * `computeResults()` di halaman Hasil Belajar siswa — dari data rekap CSV.
 *
 * Progress 5 kemampuan:
 *  - CSV versi baru menyertakan section PROGRESS KEMAMPUAN → dipakai langsung
 *    (data eksplisit dari perangkat siswa).
 *  - CSV versi lama (tanpa section) → dihitung ulang dari baris kartu dengan
 *    rumus yang identik: benar awal = 10 poin, benar setelah revisi = 6 poin,
 *    final lulus = 10 poin, dan setiap kartu selalu menyumbang bobot
 *    maksimum 10 ke kemampuannya.
 */
export function resultsFromRecap(entry: RecapEntry): Results {
  const empty: Record<AbilityKey, number> = {
    mengidentifikasi: 0,
    membaca: 0,
    menganalisis: 0,
    mengevaluasi: 0,
    menyusun: 0,
  };
  const maxPerAbility = { ...empty };
  const earnedPerAbility = { ...empty };
  let firstOkCount = 0;
  let revisedOkCount = 0;

  // Kartu dicocokkan ke set milik materi asal laporan (X.AP.1 atau X.AP.2)
  const campaign = campaignFromMateri(entry.materi);
  const reportCards = CONTENTS[campaign].cards;

  reportCards.forEach((card, i) => {
    maxPerAbility[card.ability] += POINTS_FIRST;
    // Baris kartu di CSV tersimpan dalam urutan kartu; cocokkan berdasar judul
    // (fallback: posisi baris yang sama).
    const rc =
      entry.cards[i] && entry.cards[i].title === card.title
        ? entry.cards[i]
        : entry.cards.find((x) => x.title === card.title);
    if (!rc || rc.status.toLowerCase() !== "selesai") return;
    if (rc.direvisi.trim().toLowerCase() === "ya") revisedOkCount += 1;
    const firstOk = rc.benarAwal.trim().toLowerCase() === "ya";
    const finalOk = rc.benarAkhir.trim().toLowerCase() === "ya";
    if (firstOk) firstOkCount += 1;
    earnedPerAbility[card.ability] += firstOk ? POINTS_FIRST : finalOk ? POINTS_REVISED : 0;
  });

  maxPerAbility.menyusun += FINAL_POINTS;
  if (entry.finalStatus === "LULUS") earnedPerAbility.menyusun += FINAL_POINTS;

  // Data eksplisit section PROGRESS KEMAMPUAN (CSV versi baru) bila lengkap 5
  // kemampuan dan semua maksimumnya valid — dipakai apa adanya, urut sesuai
  // ABILITY_META agar tampilan identik dengan halaman siswa.
  const explicit = explicitAbilities(entry);
  const abilities = explicit
    ? (Object.keys(ABILITY_META) as AbilityKey[]).map((key) => {
        const a = explicit.byKey[key]!;
        return {
          key,
          label: ABILITY_META[key].label,
          bloom: ABILITY_META[key].bloom,
          desc: ABILITY_META[key].desc,
          earned: a.earned,
          max: a.max,
          pct: a.pct,
        };
      })
    : (Object.keys(ABILITY_META) as AbilityKey[]).map((key) => ({
        key,
        label: ABILITY_META[key].label,
        bloom: ABILITY_META[key].bloom,
        desc: ABILITY_META[key].desc,
        earned: earnedPerAbility[key],
        max: maxPerAbility[key],
        pct: maxPerAbility[key]
          ? Math.round((earnedPerAbility[key] / maxPerAbility[key]) * 100)
          : 0,
      }));

  const maxPoints = reportCards.length * POINTS_FIRST + FINAL_POINTS;
  const points = Object.values(earnedPerAbility).reduce((a, b) => a + b, 0);
  const hasCards = entry.cards.length > 0;
  // Skor dihitung ulang dengan rumus yang sama persis dengan halaman siswa.
  // (Untuk file asli hasil unduhan, hasilnya selalu sama dengan skor di header CSV.)
  const score = hasCards ? Math.round((points / maxPoints) * 100) : entry.skor;

  return {
    score,
    kktp: score >= 70,
    points: hasCards ? points : Math.round((entry.skor / 100) * maxPoints),
    maxPoints,
    cardsDone: entry.kartuSelesai,
    firstCorrect: hasCards ? firstOkCount : entry.awalBenar,
    revisedCount: hasCards ? revisedOkCount : entry.direvisi,
    finalDone: entry.finalStatus !== "BELUM_DIKERJAKAN",
    finalCorrect: entry.finalStatus === "LULUS",
    finalTries: entry.finalTries,
    reasonQuality: { sound: entry.argumenSound, total: entry.argumenTotal },
    abilities,
  };
}

function abilityKeyFromLabel(label: string): AbilityKey | "" {
  const norm = label.trim().toLowerCase();
  const hit = (Object.keys(ABILITY_META) as AbilityKey[]).find(
    (k) => ABILITY_META[k].label.toLowerCase() === norm
  );
  return hit ?? "";
}

/**
 * Ambil data eksplisit PROGRESS KEMAMPUAN dari entri (CSV versi baru).
 * Mengembalikan null bila tidak lengkap (CSV lama, file rusak, label tak dikenali)
 * sehingga pemanggil jatuh ke rekonstruksi dari baris kartu.
 */
function explicitAbilities(
  entry: RecapEntry
): null | { byKey: Record<AbilityKey, { earned: number; max: number; pct: number }> } {
  const list = entry.abilities ?? [];
  if (list.length !== (Object.keys(ABILITY_META) as AbilityKey[]).length) return null;
  const byKey = {} as Record<AbilityKey, { earned: number; max: number; pct: number }>;
  for (const a of list) {
    if (!a.key) return null;
    if (!(a.max > 0)) return null;
    if (byKey[a.key as AbilityKey]) return null; // duplikat → tidak dapat diandalkan
    byKey[a.key as AbilityKey] = { earned: a.earned, max: a.max, pct: a.pct };
  }
  for (const k of Object.keys(ABILITY_META) as AbilityKey[]) {
    if (!byKey[k]) return null;
  }
  return { byKey };
}

// ─────────────────────────── Penyimpanan lokal guru ───────────────────────────

export function loadRecaps(): RecapEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECAP_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as RecapEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveRecaps(entries: RecapEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(RECAP_KEY, JSON.stringify(entries));
  } catch {
    // kuota penuh / private mode — abaikan diam-diam
  }
}

/** Gabungkan entri baru: nama sama (tanpa memedulikan huruf besar/kecil) menimpa data lama. */
export function mergeRecap(
  existing: RecapEntry[],
  incoming: RecapEntry
): { list: RecapEntry[]; updated: boolean } {
  const idx = existing.findIndex(
    (e) => e.nama.trim().toLowerCase() === incoming.nama.trim().toLowerCase()
  );
  if (idx >= 0) {
    const list = [...existing];
    list[idx] = incoming;
    return { list, updated: true };
  }
  return { list: [...existing, incoming], updated: false };
}

// ─────────────────────────── CSV rekap gabungan ───────────────────────────

const esc = (v: string) => `"${(v ?? "").replace(/"/g, '""')}"`;

export function buildRecapCsv(entries: RecapEntry[]): string {
  const sorted = [...entries].sort((a, b) => b.skor - a.skor);
  const n = sorted.length;
  const avg = n ? Math.round(sorted.reduce((s, e) => s + e.skor, 0) / n) : 0;
  const tuntas = sorted.filter((e) => e.kktp).length;

  // Skor per kemampuan tiap siswa — sumber: section PROGRESS KEMAMPUAN di CSV
  // (CSV lama: dihitung ulang dari baris kartu, rumus identik halaman siswa).
  const perStudent = sorted.map((e) => ({
    entry: e,
    abilities: resultsFromRecap(e).abilities,
  }));

  const keys = perStudent[0]?.abilities.map((a) => a.key) ?? [];

  const rows: string[] = [];
  rows.push("REKAP KELAS - KARTU DILEMA DIGITAL: ALGORITHM QUEST");
  // Label materi menyesuaikan isi rekap: bisa satu modul atau campuran.
  const materiSet = Array.from(new Set(sorted.map((e) => e.materi || "X.AP.1")));
  rows.push(
    `Materi;${materiSet
      .map((m) =>
        campaignFromMateri(m) === 2
          ? "X.AP.2 Instalasi Lingkungan Pemrograman (Informatika, Fase E / Kelas X)"
          : "X.AP.1 Notasi dan Penulisan Algoritma (Informatika, Fase E / Kelas X)"
      )
      .join(" + ")}`
  );
  rows.push(`Diunduh;${esc(new Date().toLocaleString("id-ID"))}`);
  rows.push(`Jumlah Siswa;${n}`);
  rows.push(`Rata-rata Skor;${avg}/100`);
  rows.push(`Tuntas KKTP (>= 70);${tuntas}`);
  rows.push(`Belum Tuntas;${n - tuntas}`);
  rows.push("");
  rows.push(
    [
      "No",
      "Nama",
      "Tanggal Ujian",
      "Skor Akhir",
      "KKTP",
      "Kartu Selesai",
      "Jawaban Awal Benar",
      "Direvisi",
      "Final Challenge",
      "Percobaan Final",
      "Kualitas Argumen",
      // Skor progres 5 kemampuan (0-100%) — data kuantitatif siap analisis
      // (Excel/SPSS) untuk penelitian, mis. Kemampuan Berpikir Algoritmik.
      ...perStudent[0]?.abilities.map((a) => `${a.label} (%)`) ?? [],
    ].join(";")
  );

  perStudent.forEach(({ entry: e, abilities }, i) => {
    rows.push(
      [
        String(i + 1),
        esc(e.nama),
        esc(e.tanggal),
        `${e.skor}`,
        e.kktp ? "Tercapai" : "Belum Tercapai",
        `${e.kartuSelesai}/${e.kartuTotal}`,
        `${e.awalBenar}`,
        `${e.direvisi}`,
        e.finalStatus === "LULUS" ? "LULUS" : e.finalStatus === "BELUM" ? "Belum lulus" : "Belum dikerjakan",
        `${e.finalTries}`,
        `${e.argumenSound}/${e.argumenTotal}`,
        ...keys.map((k) => String(abilities.find((a) => a.key === k)?.pct ?? 0)),
      ].join(";")
    );
  });

  // Rata-rata kelas per kemampuan — gambaran cepat kemampuan yang perlu
  // diperkuat di siklus PTK berikutnya.
  if (n > 0 && keys.length) {
    rows.push("");
    rows.push("RATA-RATA PROGRESS KEMAMPUAN KELAS");
    for (const k of keys) {
      const vals = perStudent
        .map(({ abilities }) => abilities.find((a) => a.key === k)?.pct ?? 0);
      const avgPct = Math.round(vals.reduce((s, v) => s + v, 0) / n);
      const meta = perStudent[0]!.abilities.find((a) => a.key === k)!;
      rows.push(`Kemampuan;${esc(meta.label)};${esc(meta.bloom)};${avgPct}%`);
    }
  }

  return rows.join("\n");
}

export function downloadBlob(content: string, filename: string): void {
  const blob = new Blob(["\ufeff" + content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
