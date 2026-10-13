"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CONTENTS, Campaign } from "./content";

export type Phase =
  | "landing"
  | "briefing"
  | "tutorial"
  | "cards"
  | "lab"
  | "final"
  | "results"
  | "reflection"
  | "guru"
  | "materi"
  | "peta";

export interface CardRecord {
  status: "not" | "done";
  firstChoice?: string;
  firstReasonId?: string;
  firstReasonText?: string;
  revised: boolean;
  revisedChoice?: string;
  revisedReasonId?: string;
  revisedReasonText?: string;
  finalChoice?: string;
  firstCorrect: boolean;
  finalCorrect: boolean;
  miniReflection?: string;
}

export interface GameState {
  phase: Phase;
  /** Bagian yang sedang dimainkan: 1 = X.AP.1, 2 = X.AP.2 */
  campaign: Campaign;
  playerName: string;
  // ── Progres BAGIAN 1 (X.AP.1) — field lama, dipertahankan apa adanya
  tutorialDone: boolean;
  cards: Record<string, CardRecord>; // map gabungan kedua bagian (id unik: "1-1" & "p2-1-1")
  lab1Done: boolean;
  lab2Done: boolean;
  finalDone: boolean;
  finalCorrect: boolean;
  finalTries: number;
  // ── Progres BAGIAN 2 (X.AP.2) — field baru
  tutorialDone2: boolean;
  lab1Done2: boolean;
  lab2Done2: boolean;
  finalDone2: boolean;
  finalCorrect2: boolean;
  finalTries2: number;
  // ── Refleksi akhir (global, dipakai CSV kedua bagian)
  survey: { q1: string; q2: string; q3: string; saved: boolean };

  activeCard: string | null;

  /** Mode guru: semua kunci navigasi terbuka (jelajah bebas) */
  teacherMode: boolean;
  /** Target modul materi untuk deep-link dari Peta Guru (dibersihkan setelah dibaca) */
  materiTarget: "xap1" | "xap2" | null;

  setPhase: (p: Phase) => void;
  setTeacherMode: (v: boolean) => void;
  setMateriTarget: (v: "xap1" | "xap2" | null) => void;
  setCampaign: (c: Campaign) => void;
  startGame: (name: string, campaign?: Campaign) => void;
  completeTutorial: () => void;
  openCard: (id: string) => void;
  backToMap: () => void;
  saveCardAttempt: (
    cardId: string,
    data: {
      choice: string;
      reasonId?: string;
      reasonText?: string;
      isRevised: boolean;
      correct: boolean;
    }
  ) => void;
  finishCard: (cardId: string, miniReflection: string) => void;
  completeLab: (taskId: string) => void;
  completeFinal: (correct: boolean) => void;
  saveSurvey: (q1: string, q2: string, q3: string) => void;
  resetAll: () => void;
}

export const emptyCard = (): CardRecord => ({
  status: "not",
  revised: false,
  firstCorrect: false,
  finalCorrect: false,
});

const initialCards = (): Record<string, CardRecord> => {
  const obj: Record<string, CardRecord> = {};
  for (const c of CONTENTS[1].cards) obj[c.id] = emptyCard();
  for (const c of CONTENTS[2].cards) obj[c.id] = emptyCard();
  return obj;
};

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      phase: "landing",
      campaign: 1,
      playerName: "",
      tutorialDone: false,
      cards: initialCards(),
      activeCard: null,
      lab1Done: false,
      lab2Done: false,
      finalDone: false,
      finalCorrect: false,
      finalTries: 0,
      tutorialDone2: false,
      lab1Done2: false,
      lab2Done2: false,
      finalDone2: false,
      finalCorrect2: false,
      finalTries2: 0,
      survey: { q1: "", q2: "", q3: "", saved: false },

      teacherMode: false,
      materiTarget: null,

      setPhase: (phase) => set({ phase }),

      setTeacherMode: (v) => set({ teacherMode: v }),

      setMateriTarget: (v) => set({ materiTarget: v }),

      setCampaign: (campaign) => set({ campaign }),

      startGame: (name, campaign) =>
        set({ playerName: name.trim(), campaign: campaign ?? 1, phase: "briefing" }),

      completeTutorial: () =>
        set((s) =>
          s.campaign === 2
            ? { tutorialDone2: true, phase: "cards" }
            : { tutorialDone: true, phase: "cards" }
        ),

      openCard: (id) => set({ activeCard: id, phase: "cards" }),

      backToMap: () => set({ activeCard: null }),

      saveCardAttempt: (cardId, data) => {
        const cards = { ...get().cards };
        const rec = cards[cardId] ?? emptyCard();
        if (!data.isRevised) {
          rec.firstChoice = data.choice;
          rec.firstReasonId = data.reasonId;
          rec.firstReasonText = data.reasonText;
          rec.firstCorrect = data.correct;
          rec.finalChoice = data.choice;
          rec.finalCorrect = data.correct;
        } else {
          rec.revised = true;
          rec.revisedChoice = data.choice;
          rec.revisedReasonId = data.reasonId;
          rec.revisedReasonText = data.reasonText;
          rec.finalChoice = data.choice;
          rec.finalCorrect = data.correct;
        }
        cards[cardId] = rec;
        set({ cards });
      },

      finishCard: (cardId, miniReflection) => {
        const cards = { ...get().cards };
        const rec = cards[cardId] ?? emptyCard();
        rec.status = "done";
        rec.miniReflection = miniReflection;
        cards[cardId] = rec;
        set({ cards });
      },

      completeLab: (taskId) =>
        set((s) =>
          s.campaign === 2
            ? {
                lab1Done2: taskId === "p2lab1" ? true : s.lab1Done2,
                lab2Done2: taskId === "p2lab2" ? true : s.lab2Done2,
              }
            : {
                lab1Done: taskId === "lab1" ? true : s.lab1Done,
                lab2Done: taskId === "lab2" ? true : s.lab2Done,
              }
        ),

      completeFinal: (correct) =>
        set((s) =>
          s.campaign === 2
            ? {
                finalDone2: true,
                finalCorrect2: correct,
                finalTries2: s.finalTries2 + 1,
              }
            : {
                finalDone: true,
                finalCorrect: correct,
                finalTries: s.finalTries + 1,
              }
        ),

      saveSurvey: (q1, q2, q3) =>
        set({ survey: { q1, q2, q3, saved: true } }),

      resetAll: () =>
        set({
          phase: "landing",
          campaign: 1,
          playerName: "",
          tutorialDone: false,
          cards: initialCards(),
          activeCard: null,
          lab1Done: false,
          lab2Done: false,
          finalDone: false,
          finalCorrect: false,
          finalTries: 0,
          tutorialDone2: false,
          lab1Done2: false,
          lab2Done2: false,
          finalDone2: false,
          finalCorrect2: false,
          finalTries2: 0,
          survey: { q1: "", q2: "", q3: "", saved: false },
          teacherMode: false,
          materiTarget: null,
        }),
    }),
    {
      name: "kartu-dilema-digital-v1",
      // Merge kustom: kartu hasil persisten ditumpuk di atas kartu awal
      // agar id kartu BAGIAN 2 (p2-*) tetap ada untuk data lama yang belum
      // mengenal bagian 2 (backward compatible).
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<GameState>;
        const merged: GameState = { ...current, ...p };
        merged.cards = { ...current.cards, ...(p.cards ?? {}) };
        return merged;
      },
    }
  )
);

// ---------- Helpers unlock & progress (campaign-aware) ----------

export function isCardDone(s: GameState, id: string): boolean {
  return s.cards[id]?.status === "done";
}

export function tutorialDoneOf(s: GameState, campaign: Campaign): boolean {
  return campaign === 2 ? s.tutorialDone2 : s.tutorialDone;
}

export function finalDoneOf(s: GameState, campaign: Campaign): boolean {
  return campaign === 2 ? s.finalDone2 : s.finalDone;
}

export function cardsOf(s: GameState, campaign: Campaign) {
  return CONTENTS[campaign].cards;
}

export function isLevelUnlocked(s: GameState, campaign: Campaign, level: number): boolean {
  if (level === 1) return tutorialDoneOf(s, campaign);
  return LEVEL_DONE(s, campaign, level - 1);
}

export function LEVEL_DONE(s: GameState, campaign: Campaign, level: number): boolean {
  return CONTENTS[campaign].cards
    .filter((c) => c.level === level)
    .every((c) => isCardDone(s, c.id));
}

export function allCardsDone(s: GameState, campaign: Campaign): boolean {
  return CONTENTS[campaign].cards.every((c) => isCardDone(s, c.id));
}

export function isLabUnlocked(s: GameState, campaign: Campaign): boolean {
  return allCardsDone(s, campaign);
}

export function labTaskDone(s: GameState, campaign: Campaign, taskId: string): boolean {
  if (campaign === 2) return taskId === "p2lab1" ? s.lab1Done2 : s.lab2Done2;
  return taskId === "lab1" ? s.lab1Done : s.lab2Done;
}

export function isLabTaskUnlocked(s: GameState, campaign: Campaign, idx: number): boolean {
  if (idx === 0) return isLabUnlocked(s, campaign);
  return campaign === 2 ? s.lab1Done2 : s.lab1Done;
}

export function isFinalUnlocked(s: GameState, campaign: Campaign): boolean {
  return campaign === 2 ? s.lab1Done2 && s.lab2Done2 : s.lab1Done && s.lab2Done;
}

export function isResultsUnlocked(s: GameState, campaign: Campaign): boolean {
  return finalDoneOf(s, campaign);
}

export function cardsDoneCount(s: GameState, campaign: Campaign): number {
  return CONTENTS[campaign].cards.filter((c) => isCardDone(s, c.id)).length;
}
