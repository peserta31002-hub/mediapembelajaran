// ============================================================
// ACCESSOR KONTEN PER BAGIAN (campaign)
// Bagian 1 = X.AP.1 Notasi dan Penulisan Algoritma (konten lama)
// Bagian 2 = X.AP.2 Instalasi Lingkungan Pemrograman (baru)
// ============================================================

import {
  CARDS,
  LAB_TASKS,
  LEVELS,
  FINAL_MISSION,
  TUTORIAL,
  BlockDef,
  DilemmaCard,
  LabTask,
} from "./gameData";
import {
  CARDS_P2,
  FINAL_MISSION_P2,
  LAB_TASKS_P2,
  LEVELS_P2,
  TUTORIAL_P2,
} from "./gameDataP2";

export type Campaign = 1 | 2;

export interface LevelMeta {
  id: number;
  name: string;
  subtitle: string;
  ability: "mengidentifikasi" | "membaca" | "menganalisis" | "mengevaluasi" | "menyusun";
}

export interface TutorialContent {
  title: string;
  scenario: string;
  blocks: Record<string, BlockDef>;
  shuffled: string[];
  hint: string;
  consoleTitle: string;
  successTitle: string;
}

export interface FinalContent {
  title: string;
  scenario: string;
  mission: string;
  defs: Record<string, BlockDef>;
  correctOrder: string[];
  shuffled: string[];
  tests?: { label: string; input: string; expected: string[] }[];
  pembahasan: string;
  consoleTitle: string;
  successText: string;
}

export interface GameContent {
  campaign: Campaign;
  /** Kode modul, mis. "X.AP.1" */
  moduleCode: string;
  /** Judul modul, mis. "Notasi dan Penulisan Algoritma" */
  moduleTitle: string;
  /** Label bagian, mis. "BAGIAN 1" */
  bagianLabel: string;
  /** Warna aksen kartu di landing (tanpa titik dua) */
  accent: "ember" | "volt";
  cards: DilemmaCard[];
  levels: LevelMeta[];
  tutorial: TutorialContent;
  labTasks: LabTask[];
  final: FinalContent;
  /** Judul dek kartu di CardsScreen */
  deckTitle: string;
  deckDesc: string;
  /** Chip materi di landing */
  landingTag: string;
  /** Tagline kartu bagian di landing */
  landingTagline: string;
}

const LEVELS_T1: LevelMeta[] = LEVELS;

export const CONTENTS: Record<Campaign, GameContent> = {
  1: {
    campaign: 1,
    moduleCode: "X.AP.1",
    moduleTitle: "Notasi dan Penulisan Algoritma",
    bagianLabel: "BAGIAN 1",
    accent: "ember",
    cards: CARDS,
    levels: LEVELS_T1,
    tutorial: {
      title: TUTORIAL.title,
      scenario: TUTORIAL.scenario,
      blocks: TUTORIAL.blocks,
      shuffled: TUTORIAL.shuffled,
      hint: TUTORIAL.hint,
      consoleTitle: TUTORIAL.consoleTitle,
      successTitle: TUTORIAL.successTitle,
    },
    labTasks: LAB_TASKS,
    final: {
      title: FINAL_MISSION.title,
      scenario: FINAL_MISSION.scenario,
      mission: FINAL_MISSION.mission,
      defs: FINAL_MISSION.defs,
      correctOrder: FINAL_MISSION.correctOrder,
      shuffled: FINAL_MISSION.shuffled,
      tests: FINAL_MISSION.tests,
      pembahasan: FINAL_MISSION.pembahasan,
      consoleTitle: FINAL_MISSION.consoleTitle,
      successText: FINAL_MISSION.successText,
    },
    deckTitle: "Lima level, sepuluh dilema",
    deckDesc:
      "Tingkat kesulitan naik bertahap: dari mengenali urutan, membaca notasi, memburu kesalahan, membandingkan algoritma, sampai merakit solusimu sendiri. Selesaikan satu level untuk membuka level berikutnya.",
    landingTag: "X.AP.1 — NOTASI DAN PENULISAN ALGORITMA",
    landingTagline:
      "Petualangan awal: urutan langkah, notasi pseudocode, IF/ELSE, REPEAT — membuat teh manis sampai mesin air mineral.",
  },
  2: {
    campaign: 2,
    moduleCode: "X.AP.2",
    moduleTitle: "Instalasi Lingkungan Pemrograman",
    bagianLabel: "BAGIAN 2",
    accent: "volt",
    cards: CARDS_P2,
    levels: LEVELS_P2 as LevelMeta[],
    tutorial: {
      title: TUTORIAL_P2.title,
      scenario: TUTORIAL_P2.scenario,
      blocks: TUTORIAL_P2.blocks,
      shuffled: TUTORIAL_P2.shuffled,
      hint: TUTORIAL_P2.hint,
      consoleTitle: TUTORIAL_P2.consoleTitle,
      successTitle: TUTORIAL_P2.successTitle,
    },
    labTasks: LAB_TASKS_P2,
    final: {
      title: FINAL_MISSION_P2.title,
      scenario: FINAL_MISSION_P2.scenario,
      mission: FINAL_MISSION_P2.mission,
      defs: FINAL_MISSION_P2.defs,
      correctOrder: FINAL_MISSION_P2.correctOrder,
      shuffled: FINAL_MISSION_P2.shuffled,
      tests: FINAL_MISSION_P2.tests,
      pembahasan: FINAL_MISSION_P2.pembahasan,
      consoleTitle: FINAL_MISSION_P2.consoleTitle,
      successText: FINAL_MISSION_P2.successText,
    },
    deckTitle: "Lima level baru, sepuluh dilema baru",
    deckDesc:
      "Misi lanjutan: dari urutan instalasi, membaca pesan error dan layar installer, memburu penyebab kendala, menimbang sumber dan alat, sampai memperbaiki panduan dan program yang keliru. Selesaikan satu level untuk membuka level berikutnya.",
    landingTag: "X.AP.2 — INSTALASI LINGKUNGAN PEMROGRAMAN",
    landingTagline:
      "Petualangan lanjutan: sumber unduhan resmi, konfigurasi PATH, verifikasi versi, dan program pertama — Halo, Dunia!",
  },
};

export function getContent(campaign: Campaign): GameContent {
  return CONTENTS[campaign] ?? CONTENTS[1];
}

/** Cari kartu di kedua bagian sekaligus (id antar-bagian unik). */
export function findCardEverywhere(id: string): { card: DilemmaCard; campaign: Campaign } | null {
  for (const c of [1, 2] as Campaign[]) {
    const card = CONTENTS[c].cards.find((x) => x.id === id);
    if (card) return { card, campaign: c };
  }
  return null;
}
