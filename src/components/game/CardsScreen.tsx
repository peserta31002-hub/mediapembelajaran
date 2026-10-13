"use client";

import { motion } from "framer-motion";
import {
  Bug,
  CheckCircle2,
  GitCompareArrows,
  Lock,
  ListOrdered,
  ScanText,
  Wrench,
  Play,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chip, LevelBadge } from "./ui";
import { ABILITY_META, DilemmaCard } from "@/lib/gameData";
import { getContent } from "@/lib/content";
import { useGame, isCardDone, isLevelUnlocked } from "@/lib/store";

const LEVEL_ICONS = [ListOrdered, ScanText, Bug, GitCompareArrows, Wrench];

export default function CardsScreen() {
  const s = useGame();
  const content = getContent(s.campaign);
  const cards = content.cards;
  const total = cards.length;
  const doneCount = cards.filter((c) => isCardDone(s, c.id)).length;

  const nextCard = cards.find(
    (c) => isLevelUnlocked(s, s.campaign, c.level) && !isCardDone(s, c.id)
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono-code text-[11px] font-semibold tracking-[0.25em] text-[#3bd6ff]">
            {content.bagianLabel} • DEK KARTU DILEMA — {content.moduleCode}
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {content.deckTitle}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">{content.deckDesc}</p>
        </div>
        <div className="glass flex items-center gap-3 rounded-xl px-4 py-3">
          <div className="text-center">
            <p className="font-mono-code text-2xl font-black text-[#ff7a1a]">
              {doneCount}
              <span className="text-sm text-slate-500">/{total}</span>
            </p>
            <p className="text-[10px] tracking-wider text-slate-400">KARTU SELESAI</p>
          </div>
          <div className="h-10 w-px bg-white/10" />
          {nextCard ? (
            <Button
              onClick={() => s.openCard(nextCard.id)}
              size="sm"
              className="bg-[#ff7a1a] font-bold text-[#1a0e05] hover:bg-[#ff8c3a]"
            >
              LANJUTKAN MISI <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          ) : (
            <Chip tone="mint">
              <CheckCircle2 className="h-3 w-3" /> Semua kartu tuntas
            </Chip>
          )}
        </div>
      </div>

      {/* Progress bar total */}
      <div className="mb-8 h-2 overflow-hidden rounded-full bg-white/5">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#ff7a1a] to-[#ffb26b]"
          initial={{ width: 0 }}
          animate={{ width: `${(doneCount / total) * 100}%` }}
          transition={{ duration: 0.6 }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {content.levels.map((level, idx) => {
          // Mode guru: semua level terbuka untuk pemeriksaan materi
          const unlocked = s.teacherMode || isLevelUnlocked(s, s.campaign, level.id);
          const levelCards = cards.filter((c) => c.level === level.id);
          const levelDone = levelCards.every((c) => isCardDone(s, c.id));
          const Icon = LEVEL_ICONS[idx];
          return (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className={`relative rounded-2xl border p-5 ${
                unlocked
                  ? "border-white/10 bg-[#0c1528]/80"
                  : "border-white/5 bg-[#0a1120]/60"
              }`}
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                      unlocked ? "bg-[#ff7a1a]/12" : "bg-white/5"
                    }`}
                  >
                    {unlocked ? (
                      <Icon className={`h-5 w-5 ${levelDone ? "text-[#3ddc97]" : "text-[#ff7a1a]"}`} />
                    ) : (
                      <Lock className="h-5 w-5 text-slate-600" />
                    )}
                  </div>
                  <div>
                    <LevelBadge level={level.id} />
                    <h3 className={`mt-1 font-bold ${unlocked ? "text-white" : "text-slate-500"}`}>
                      {level.name}
                    </h3>
                  </div>
                </div>
                {levelDone && <CheckCircle2 className="h-5 w-5 text-[#3ddc97]" />}
              </div>

              <p className={`mb-4 text-xs leading-relaxed ${unlocked ? "text-slate-400" : "text-slate-600"}`}>
                {level.subtitle} •{" "}
                <span className="font-mono-code">
                  {ABILITY_META[level.ability].bloom}
                </span>{" "}
                — {ABILITY_META[level.ability].label}
              </p>

              <div className="space-y-2">
                {levelCards.map((card) => (
                  <CardRowButton key={card.id} card={card} unlocked={unlocked} />
                ))}
              </div>

              {!unlocked && (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-[#070d1f]/70 backdrop-blur-[2px]">
                  <p className="flex items-center gap-2 font-mono-code text-xs tracking-widest text-slate-500">
                    <Lock className="h-4 w-4" /> SELESAIKAN LEVEL {level.id - 1}
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function CardRowButton({ card, unlocked }: { card: DilemmaCard; unlocked: boolean }) {
  const s = useGame();
  const done = isCardDone(s, card.id);

  return (
    <button
      onClick={() => unlocked && s.openCard(card.id)}
      disabled={!unlocked}
      className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors ${
        unlocked
          ? "border-white/10 bg-white/[0.03] hover:border-[#ff7a1a]/40 hover:bg-[#ff7a1a]/5"
          : "cursor-not-allowed border-white/5 bg-white/[0.01]"
      }`}
    >
      <span className="font-mono-code text-[10px] font-bold tracking-wider text-slate-500">
        {card.id}
      </span>
      <span className="flex-1">
        <span className={`block text-sm font-semibold ${unlocked ? "text-slate-100" : "text-slate-600"}`}>
          {card.title}
        </span>
        <span className="block text-[11px] text-slate-500">{card.hook}</span>
      </span>
      {done ? (
        <CheckCircle2 className="h-4 w-4 shrink-0 text-[#3ddc97]" />
      ) : unlocked ? (
        <Play className="h-4 w-4 shrink-0 text-[#ff7a1a]" />
      ) : (
        <Lock className="h-4 w-4 shrink-0 text-slate-700" />
      )}
      {done && (
        <RotateCcw className="h-3.5 w-3.5 shrink-0 text-slate-600" aria-label="Bisa ditinjau ulang" />
      )}
    </button>
  );
}
