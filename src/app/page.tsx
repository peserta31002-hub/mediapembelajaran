"use client";

import { useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { GameFooter, GameHeader } from "@/components/game/ui";
import LandingScreen from "@/components/game/Landing";
import BriefingScreen from "@/components/game/Briefing";
import TutorialScreen from "@/components/game/Tutorial";
import CardsScreen from "@/components/game/CardsScreen";
import CardPlay from "@/components/game/CardPlay";
import AlgorithmLab from "@/components/game/Lab";
import FinalChallenge from "@/components/game/Final";
import ResultsScreen from "@/components/game/Results";
import ReflectionScreen from "@/components/game/Reflection";
import GuruPanel from "@/components/game/GuruPanel";
import GuruMap from "@/components/game/GuruMap";
import MateriScreen from "@/components/game/Materi";
import { useGame } from "@/lib/store";

export default function Home() {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const phase = useGame((s) => s.phase);
  const activeCard = useGame((s) => s.activeCard);

  if (!mounted) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-2 text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="font-mono-code text-sm">MEMUAT MISI…</span>
        </div>
      </main>
    );
  }

  const screen =
    phase === "landing" ? (
      <LandingScreen />
    ) : phase === "briefing" ? (
      <BriefingScreen />
    ) : phase === "tutorial" ? (
      <TutorialScreen />
    ) : phase === "cards" ? (
      activeCard ? (
        <CardPlay cardId={activeCard} />
      ) : (
        <CardsScreen />
      )
    ) : phase === "lab" ? (
      <AlgorithmLab />
    ) : phase === "final" ? (
      <FinalChallenge />
    ) : phase === "results" ? (
      <ResultsScreen />
    ) : phase === "guru" ? (
      <GuruPanel />
    ) : phase === "materi" ? (
      <MateriScreen />
    ) : phase === "peta" ? (
      <GuruMap />
    ) : (
      <ReflectionScreen />
    );

  return (
    <>
      <GameHeader />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase + (activeCard ?? "")}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {screen}
          </motion.div>
        </AnimatePresence>
      </main>
      <GameFooter />
    </>
  );
}
