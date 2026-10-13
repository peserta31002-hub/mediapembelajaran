import { ABILITY_META, AbilityKey } from "./gameData";
import { CONTENTS, Campaign } from "./content";
import { GameState, isCardDone } from "./store";

export interface AbilityProgress {
  key: AbilityKey;
  label: string;
  bloom: string;
  desc: string;
  earned: number;
  max: number;
  pct: number;
}

export interface Results {
  score: number; // 0-100
  kktp: boolean; // >= 70
  points: number;
  maxPoints: number;
  cardsDone: number;
  firstCorrect: number;
  revisedCount: number;
  finalDone: boolean;
  finalCorrect: boolean;
  finalTries: number;
  reasonQuality: { sound: number; total: number };
  abilities: AbilityProgress[];
}

export const POINTS_FIRST = 10;
export const POINTS_REVISED = 6;
export const FINAL_POINTS = 10;

export function cardPoints(s: GameState, cardId: string): number {
  const rec = s.cards[cardId];
  if (!rec || rec.status !== "done") return 0;
  if (rec.firstCorrect) return POINTS_FIRST;
  if (rec.finalCorrect) return POINTS_REVISED;
  return 0;
}

export function computeResults(s: GameState, campaign: Campaign = 1): Results {
  const cards = CONTENTS[campaign].cards;
  const maxPerAbility: Record<AbilityKey, number> = {
    mengidentifikasi: 0,
    membaca: 0,
    menganalisis: 0,
    mengevaluasi: 0,
    menyusun: 0,
  };
  const earnedPerAbility: Record<AbilityKey, number> = {
    mengidentifikasi: 0,
    membaca: 0,
    menganalisis: 0,
    mengevaluasi: 0,
    menyusun: 0,
  };

  let points = 0;
  let firstCorrect = 0;
  let revisedCount = 0;
  let reasonSound = 0;
  let reasonTotal = 0;

  for (const card of cards) {
    const rec = s.cards[card.id];
    const done = isCardDone(s, card.id);
    maxPerAbility[card.ability] += POINTS_FIRST;
    if (done) {
      const p = cardPoints(s, card.id);
      points += p;
      earnedPerAbility[card.ability] += p;
      if (rec.firstCorrect) firstCorrect += 1;
      if (rec.revised) revisedCount += 1;

      // Kualitas argumen: alasan terpilih yang berdasar (sound)
      const finalReasonId =
        rec.revised && rec.revisedReasonId ? rec.revisedReasonId : rec.firstReasonId;
      const opt = card.reasons.find((r) => r.id === finalReasonId);
      reasonTotal += 1;
      if (opt?.sound) reasonSound += 1;
    }
  }

  const finalDone = campaign === 2 ? s.finalDone2 : s.finalDone;
  const finalCorrect = campaign === 2 ? s.finalCorrect2 : s.finalCorrect;
  const finalTries = campaign === 2 ? s.finalTries2 : s.finalTries;

  if (finalDone && finalCorrect) {
    points += FINAL_POINTS;
    earnedPerAbility.menyusun += FINAL_POINTS;
  }
  maxPerAbility.menyusun += FINAL_POINTS;

  const abilities: AbilityProgress[] = (
    Object.keys(ABILITY_META) as AbilityKey[]
  ).map((key) => ({
    key,
    label: ABILITY_META[key].label,
    bloom: ABILITY_META[key].bloom,
    desc: ABILITY_META[key].desc,
    earned: earnedPerAbility[key],
    max: maxPerAbility[key],
    pct: maxPerAbility[key] ? Math.round((earnedPerAbility[key] / maxPerAbility[key]) * 100) : 0,
  }));

  const maxPoints =
    cards.length * POINTS_FIRST + FINAL_POINTS;

  return {
    score: Math.round((points / maxPoints) * 100),
    kktp: Math.round((points / maxPoints) * 100) >= 70,
    points,
    maxPoints,
    cardsDone: cards.filter((c) => isCardDone(s, c.id)).length,
    firstCorrect,
    revisedCount,
    finalDone,
    finalCorrect,
    finalTries,
    reasonQuality: { sound: reasonSound, total: reasonTotal },
    abilities,
  };
}

export function buildCsv(s: GameState, campaign: Campaign = 1): string {
  const content = CONTENTS[campaign];
  const cards = content.cards;
  const r = computeResults(s, campaign);
  const esc = (v: string) => `"${(v ?? "").replace(/"/g, '""')}"`;
  const rows: string[] = [];

  rows.push("KARTU DILEMA DIGITAL: ALGORITHM QUEST - DATA HASIL BELAJAR");
  rows.push(
    `Materi;${content.moduleCode} ${content.moduleTitle} (Informatika, Fase E / Kelas X)`
  );
  rows.push(`Nama;${esc(s.playerName || "(tanpa nama)")}`);
  rows.push(`Tanggal;${esc(new Date().toLocaleString("id-ID"))}`);
  rows.push(`Skor Akhir;${r.score}/100`);
  rows.push(`KKTP (minimal 70);${r.kktp ? "Tercapai" : "Belum Tercapai"}`);
  rows.push(`Kartu Selesai;${r.cardsDone}/${cards.length}`);
  rows.push(`Jawaban Awal Benar;${r.firstCorrect}/${cards.length}`);
  rows.push(`Jawaban yang Direvisi;${r.revisedCount}`);
  rows.push(`Final Challenge;${r.finalDone ? (r.finalCorrect ? "LULUS" : "Belum lulus") : "Belum dikerjakan"} (percobaan: ${r.finalTries})`);
  rows.push(`Kualitas Argumen (alasan berdasar);${r.reasonQuality.sound}/${r.reasonQuality.total}`);
  rows.push("");
  // Skor per kemampuan (progres 5 kemampuan Bloom) — data kuantitatif untuk
  // penelitian tindakan kelas, mis. fokus "Meningkatkan Kemampuan Berpikir Algoritmik".
  rows.push("PROGRESS KEMAMPUAN");
  for (const a of r.abilities) {
    rows.push(`Kemampuan;${esc(a.label)};${esc(a.bloom)};${a.earned}/${a.max};${a.pct}%`);
  }
  rows.push("");
  rows.push(
    [
      "Kartu",
      "Level",
      "Status",
      "Pilihan Awal",
      "Benar Awal",
      "Alasan Awal",
      "Direvisi",
      "Pilihan Akhir",
      "Benar Akhir",
      "Refleksi Mini",
    ].join(";")
  );

  for (const card of cards) {
    const rec = s.cards[card.id];
    const firstReason = card.reasons.find((x) => x.id === rec?.firstReasonId);
    rows.push(
      [
        esc(card.title),
        `Level ${card.level}`,
        rec?.status === "done" ? "Selesai" : "Belum",
        esc(rec?.firstChoice ?? "-"),
        rec?.firstCorrect ? "Ya" : "Tidak",
        esc(firstReason?.text ?? rec?.firstReasonText ?? "-"),
        rec?.revised ? "Ya" : "Tidak",
        esc(rec?.finalChoice ?? "-"),
        rec?.finalCorrect ? "Ya" : "Tidak",
        esc(rec?.miniReflection ?? "-"),
      ].join(";")
    );
  }

  rows.push("");
  rows.push("REFLEKSI AKHIR");
  rows.push(`1 Bagian yang paling membuat berpikir;${esc(s.survey.q1 || "-")}`);
  rows.push(`2 Pilihan yang diubah setelah konsekuensi;${esc(s.survey.q2 || "-")}`);
  rows.push(`3 Pemahaman tentang algoritma sekarang;${esc(s.survey.q3 || "-")}`);

  return rows.join("\n");
}
