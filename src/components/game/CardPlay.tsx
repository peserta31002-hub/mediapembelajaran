"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileWarning,
  Lightbulb,
  Lock,
  Map,
  MessageCircleQuestion,
  PencilLine,
  ShieldCheck,
  TerminalSquare,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Chip, LevelBadge, Pseudo, SimConsole } from "./ui";
import {
  MINI_REFLECTIONS,
  ABILITY_META,
  CardOption,
  DilemmaCard,
  SimLine,
} from "@/lib/gameData";
import { getContent } from "@/lib/content";
import { useGame, isCardDone, isLevelUnlocked } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

type Stage = "choose" | "consequence" | "feedback" | "revise" | "reflect";

export default function CardPlay({ cardId }: { cardId: string }) {
  const s = useGame();
  const content = getContent(s.campaign);
  const card = content.cards.find((c) => c.id === cardId) ?? content.cards[0];
  const record = s.cards[cardId];
  const isReview = record?.status === "done";

  const [stage, setStage] = useState<Stage>("choose");
  const [choice, setChoice] = useState<string | null>(null);
  const [reasonId, setReasonId] = useState<string | null>(null);
  const [reasonText, setReasonText] = useState("");
  const [isRevised, setIsRevised] = useState(false);
  const [shownOption, setShownOption] = useState<CardOption | null>(null);
  const [simLines, setSimLines] = useState<SimLine[] | null>(null);
  const [simDone, setSimDone] = useState(false);
  const [mini, setMini] = useState("");
  const [customMini, setCustomMini] = useState("");
  const { toast } = useToast();

  const cardIndex = content.cards.findIndex((c) => c.id === cardId) + 1;
  const nextCard = content.cards.find(
    (c) => isLevelUnlocked(s, s.campaign, c.level) && !isCardDone(s, c.id) && c.id !== cardId
  );

  const selectedOption = card.options.find((o) => o.id === choice) ?? null;
  const selectedReason = card.reasons.find((r) => r.id === reasonId) ?? null;
  const canLock = Boolean(choice && (reasonId || reasonText.trim().length > 2));

  /* ---------------- actions ---------------- */

  const lockAnswer = () => {
    if (!selectedOption) return;
    const correct = selectedOption.verdict === "optimal";
    s.saveCardAttempt(cardId, {
      choice: selectedOption.id,
      reasonId: reasonId ?? undefined,
      reasonText: reasonText.trim() || undefined,
      isRevised,
      correct,
    });
    setShownOption(selectedOption);
    setSimLines(selectedOption.log);
    setSimDone(false);
    setStage("consequence");
  };

  const startRevise = () => {
    setIsRevised(true);
    setChoice(null);
    setReasonId(null);
    setReasonText("");
    setSimLines(null);
    setShownOption(null);
    setStage("revise");
  };

  const goReflect = () => {
    setStage("reflect");
  };

  const finish = (goNext: boolean) => {
    const refl = mini || customMini.trim();
    s.finishCard(cardId, refl || "(tidak mengisi)");
    if (goNext && nextCard) {
      s.openCard(nextCard.id);
      setStage("choose");
      setChoice(null);
      setReasonId(null);
      setReasonText("");
      setIsRevised(false);
      setSimLines(null);
      setShownOption(null);
      setMini("");
      setCustomMini("");
    } else {
      s.backToMap();
    }
    toast({
      title: `Kartu ${card.id} selesai`,
      description: goNext && nextCard ? "Lanjut ke kartu berikutnya!" : "Kembali ke peta level.",
    });
  };

  /* ---------------- review mode ---------------- */
  if (isReview && stage === "choose") {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
        <ReviewView card={card} onBack={s.backToMap} />
      </div>
    );
  }

  /* ---------------- play mode ---------------- */
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
      {/* Header kartu */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={s.backToMap}
          className="text-slate-400 hover:text-white"
          aria-label="Kembali ke peta level"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex flex-wrap items-center gap-2">
          <LevelBadge level={card.level} />
          <Chip tone="volt">{ABILITY_META[card.ability].label}</Chip>
          <Chip tone="muted">
            KARTU {cardIndex}/{content.cards.length}
          </Chip>
          {isRevised && (
            <Chip tone="ember">
              <PencilLine className="h-3 w-3" /> REVISI
            </Chip>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ============ STAGE: CHOOSE / REVISE ============ */}
        {(stage === "choose" || stage === "revise") && (
          <motion.div
            key="choose"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            {stage === "revise" && (
              <div className="mb-5 rounded-xl border border-[#ff7a1a]/30 bg-[#ff7a1a]/8 p-4">
                <p className="text-sm leading-relaxed text-slate-200">
                  <span className="font-bold text-[#ff7a1a]">Kesempatan revisi.</span> Kamu sudah
                  melihat konsekuensinya dan memahami bagian yang bermasalah. Perbaiki pilihanmu —
                  atau pertahankan jika kamu masih yakin.
                </p>
              </div>
            )}

            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              {card.title}
            </h1>

            {/* Skenario */}
            <div className="mt-4 rounded-2xl border border-white/10 bg-[#0e1a33]/70 p-5">
              <p className="mb-2 flex items-center gap-2 font-mono-code text-[11px] font-bold tracking-widest text-[#3bd6ff]">
                <TerminalSquare className="h-4 w-4" /> SKENARIO
              </p>
              <p className="text-sm leading-relaxed text-slate-200">{card.scenario}</p>
              {card.scenarioPseudo && (
                <div className="mt-3">
                  <Pseudo lines={card.scenarioPseudo} />
                </div>
              )}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {card.notation.map((n) => (
                  <Chip key={n} tone="muted">
                    {n}
                  </Chip>
                ))}
              </div>
            </div>

            {/* Misi */}
            <div className="mt-4 rounded-xl border border-[#ff7a1a]/25 bg-gradient-to-r from-[#ff7a1a]/10 to-transparent px-4 py-3">
              <p className="text-sm font-semibold text-white">🎯 {card.mission}</p>
            </div>

            {/* Pilihan algoritma */}
            <p className="mb-3 mt-6 font-mono-code text-[11px] font-bold tracking-widest text-slate-400">
              1. PILIH ALGORITMA YANG PALING TEPAT
            </p>
            <div className="space-y-3">
              {card.options.map((opt) => {
                const active = choice === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setChoice(opt.id)}
                    className={`block w-full rounded-2xl border p-4 text-left transition-all ${
                      active
                        ? "border-[#ff7a1a] bg-[#ff7a1a]/8 shadow-[0_0_24px_rgba(255,122,26,0.15)]"
                        : "border-white/10 bg-[#0c1528]/70 hover:border-white/25"
                    }`}
                    aria-pressed={active}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-lg font-mono-code text-sm font-black ${
                          active ? "bg-[#ff7a1a] text-[#1a0e05]" : "bg-white/8 text-slate-300"
                        }`}
                      >
                        {opt.id}
                      </span>
                      <span className="text-xs text-slate-500">
                        Algoritma {opt.id} {active && "• dipilih"}
                      </span>
                    </div>
                    <Pseudo lines={opt.pseudo} compact />
                  </button>
                );
              })}
            </div>

            {/* Komitmen alasan */}
            <p className="mb-3 mt-8 font-mono-code text-[11px] font-bold tracking-widest text-slate-400">
              2. KOMITMEN JAWABAN — {card.reasonPrompt.toUpperCase()}
            </p>
            <div
              className={`space-y-2 ${!choice && "pointer-events-none opacity-40"}`}
              aria-disabled={!choice}
            >
              {card.reasons.map((r) => {
                const active = reasonId === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      setReasonId(active ? null : r.id);
                      setReasonText("");
                    }}
                    className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
                      active
                        ? "border-[#3bd6ff] bg-[#3bd6ff]/8"
                        : "border-white/10 bg-[#0c1528]/70 hover:border-white/25"
                    }`}
                    aria-pressed={active}
                  >
                    <span
                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                        active ? "border-[#3bd6ff] bg-[#3bd6ff]" : "border-slate-500"
                      }`}
                    />
                    <span className="text-sm text-slate-200">{r.text}</span>
                  </button>
                );
              })}
              <div className="rounded-xl border border-white/10 bg-[#0c1528]/70 p-3">
                <label
                  htmlFor={`custom-reason-${card.id}`}
                  className="mb-1.5 block text-[11px] text-slate-400"
                >
                  atau tulis alasanmu sendiri (opsional):
                </label>
                <Textarea
                  id={`custom-reason-${card.id}`}
                  value={reasonText}
                  onChange={(e) => {
                    setReasonText(e.target.value);
                    if (e.target.value.trim()) setReasonId(null);
                  }}
                  placeholder="Contoh: karena langkah X membutuhkan hasil langkah Y…"
                  className="min-h-[64px] border-white/10 bg-[#0b1425] text-sm text-white placeholder:text-slate-600"
                  maxLength={300}
                />
              </div>
            </div>

            {/* Kunci jawaban */}
            <div className="mt-6 flex justify-end">
              <Button
                onClick={lockAnswer}
                disabled={!canLock}
                className="bg-[#ff7a1a] px-8 font-bold text-[#1a0e05] hover:bg-[#ff8c3a] disabled:opacity-40"
              >
                <Lock className="mr-1 h-4 w-4" /> KUNCI JAWABAN
              </Button>
            </div>
            {!canLock && (
              <p className="mt-2 text-right text-[11px] text-slate-500">
                Pilih satu algoritma dan satu alasan (atau tulis alasanmu) untuk melanjutkan.
              </p>
            )}
          </motion.div>
        )}

        {/* ============ STAGE: CONSEQUENCE ============ */}
        {stage === "consequence" && simLines && shownOption && (
          <motion.div
            key="consequence"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              {card.title}
            </h1>
            <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-400">
              <Chip tone="ember">
                <Lock className="mr-1 h-3 w-3" /> JAWABAN {shownOption.id} DIKUNCI
              </Chip>
              <span>Konsekuensi dijalankan langkah demi langkah…</span>
            </p>

            <div className="mt-5">
              <SimConsole
                lines={simLines}
                title={`SIMULASI — ALGORITMA ${shownOption.id}`}
                onComplete={() => setSimDone(true)}
              />
            </div>

            <AnimatePresence>
              {simDone && (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-5 rounded-2xl border p-5 ${
                    shownOption.verdict === "optimal"
                      ? "border-[#3ddc97]/35 bg-[#3ddc97]/8"
                      : "border-[#ffd166]/35 bg-[#ffd166]/8"
                  }`}
                >
                  <p className="font-mono-code text-[10px] tracking-widest text-slate-400">
                    APA YANG TERJADI?
                  </p>
                  <p
                    className={`mt-1 text-lg font-bold ${
                      shownOption.verdict === "optimal" ? "text-[#3ddc97]" : "text-[#ffd166]"
                    }`}
                  >
                    {shownOption.outcome.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-200">
                    {shownOption.outcome.desc}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {simDone && (
              <div className="mt-5 flex justify-end">
                <Button
                  onClick={() => setStage("feedback")}
                  className="bg-[#3bd6ff] font-bold text-[#062029] hover:bg-[#5fe0ff]"
                >
                  <ClipboardCheck className="mr-1 h-4 w-4" /> LIHAT PEMBAHASAN
                </Button>
              </div>
            )}
          </motion.div>
        )}

        {/* ============ STAGE: FEEDBACK ============ */}
        {stage === "feedback" && shownOption && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            <FeedbackPanel
              card={card}
              option={shownOption}
              reasonText={
                selectedReason ? selectedReason.text : reasonText.trim() || "(tidak mengisi alasan)"
              }
              reasonNote={selectedReason?.note}
              reasonSound={selectedReason?.sound}
              isRevised={isRevised}
            />

            <div className="mt-6 flex flex-wrap justify-between gap-3">
              {shownOption.verdict !== "optimal" ? (
                <Button
                  onClick={startRevise}
                  size="lg"
                  className="bg-[#ff7a1a] font-bold text-[#1a0e05] hover:bg-[#ff8c3a]"
                >
                  <PencilLine className="mr-1 h-4 w-4" /> PERBAIKI PILIHANMU
                </Button>
              ) : (
                <Button
                  onClick={goReflect}
                  size="lg"
                  className="bg-[#3ddc97] font-bold text-[#05261a] hover:bg-[#5ce9ae]"
                >
                  LANJUT: REFLEKSI SINGKAT <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              )}
            </div>
          </motion.div>
        )}

        {/* ============ STAGE: REFLECT ============ */}
        {stage === "reflect" && (
          <motion.div
            key="reflect"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            <div className="rounded-2xl border border-[#3bd6ff]/25 bg-[#3bd6ff]/6 p-6">
              <p className="flex items-center gap-2 font-mono-code text-[11px] font-bold tracking-widest text-[#3bd6ff]">
                <MessageCircleQuestion className="h-4 w-4" /> REFLEKSI KARTU {card.id}
              </p>
              <h3 className="mt-2 text-xl font-bold text-white">
                Apa yang membuat kamu mengubah atau mempertahankan pilihanmu?
              </h3>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {MINI_REFLECTIONS.map((r) => {
                  const active = mini === r;
                  return (
                    <button
                      key={r}
                      onClick={() => {
                        setMini(active ? "" : r);
                        setCustomMini("");
                      }}
                      className={`rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                        active
                          ? "border-[#3bd6ff] bg-[#3bd6ff]/10 text-white"
                          : "border-white/10 bg-[#0c1528]/70 text-slate-300 hover:border-white/25"
                      }`}
                    >
                      {r}
                    </button>
                  );
                })}
              </div>
              <Textarea
                value={customMini}
                onChange={(e) => {
                  setCustomMini(e.target.value);
                  if (e.target.value.trim()) setMini("");
                }}
                placeholder="…atau tulis dengan kata-katamu sendiri"
                className="mt-3 min-h-[72px] border-white/10 bg-[#0b1425] text-sm text-white placeholder:text-slate-600"
                maxLength={300}
              />
            </div>

            <div className="mt-6 flex flex-wrap justify-between gap-3">
              <Button
                variant="outline"
                onClick={() => finish(false)}
                className="border-white/15 text-slate-300 hover:text-white"
              >
                <Map className="mr-1 h-4 w-4" /> KEMBALI KE PETA
              </Button>
              {nextCard && (
                <Button
                  onClick={() => finish(true)}
                  className="bg-[#ff7a1a] font-bold text-[#1a0e05] hover:bg-[#ff8c3a]"
                >
                  KARTU BERIKUTNYA <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ────────────────────────── Feedback panel ────────────────────────── */

function FeedbackPanel({
  card,
  option,
  reasonText,
  reasonNote,
  reasonSound,
  isRevised,
}: {
  card: DilemmaCard;
  option: CardOption;
  reasonText: string;
  reasonNote?: string;
  reasonSound?: boolean;
  isRevised: boolean;
}) {
  const optimal = option.verdict === "optimal";
  const suboptimal = option.verdict === "suboptimal";
  const correctOption = card.options.find((o) => o.verdict === "optimal")!;

  const banner = optimal
    ? {
        icon: <CheckCircle2 className="h-6 w-6 text-[#3ddc97]" />,
        title: "Algoritma pilihanmu berjalan benar",
        tone: "border-[#3ddc97]/35 bg-[#3ddc97]/8",
        text: "text-[#3ddc97]",
      }
    : suboptimal
      ? {
          icon: <FileWarning className="h-6 w-6 text-[#ffd166]" />,
          title: "Berjalan — tapi belum paling tepat",
          tone: "border-[#ffd166]/35 bg-[#ffd166]/8",
          text: "text-[#ffd166]",
        }
      : {
          icon: <XCircle className="h-6 w-6 text-[#ff5470]" />,
          title: "Algoritma pilihanmu menabrak masalah",
          tone: "border-[#ff5470]/35 bg-[#ff5470]/8",
          text: "text-[#ff5470]",
        };

  return (
    <div>
      <div className={`rounded-2xl border p-5 ${banner.tone}`}>
        <div className="flex items-center gap-3">
          {banner.icon}
          <div>
            <p className={`text-lg font-bold ${banner.text}`}>
              {isRevised && !optimal ? "Revisimu masih menabrak masalah" : banner.title}
            </p>
            <p className="text-xs text-slate-400">
              Pilihan {option.id} • {isRevised ? "hasil revisi" : "jawaban awal"}
            </p>
          </div>
        </div>
      </div>

      {/* Evaluasi alasan */}
      <div className="mt-4 rounded-xl border border-white/10 bg-[#0e1a33]/70 p-4">
        <p className="font-mono-code text-[10px] tracking-widest text-slate-400">
          EVALUASI ALASANMU
        </p>
        <p className="mt-1.5 text-sm text-slate-200">&ldquo;{reasonText}&rdquo;</p>
        {reasonNote && (
          <p
            className={`mt-2 flex items-start gap-1.5 text-xs leading-relaxed ${
              reasonSound ? "text-[#3ddc97]" : "text-[#ffd166]"
            }`}
          >
            {reasonSound ? (
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            ) : (
              <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            )}
            {reasonNote}
          </p>
        )}
      </div>

      {/* Tiga bagian feedback */}
      <div className="mt-4 space-y-3">
        <FeedbackBlock
          tone="mint"
          icon={<CheckCircle2 className="h-4 w-4" />}
          label="YANG SUDAH TEPAT"
          text={option.feedback.right}
        />
        <FeedbackBlock
          tone="coral"
          icon={<XCircle className="h-4 w-4" />}
          label="YANG BERMASALAH"
          text={option.feedback.wrong}
        />
        <FeedbackBlock
          tone="volt"
          icon={<Lightbulb className="h-4 w-4" />}
          label="MENGAPA TERJADI"
          text={option.feedback.why}
        />
      </div>

      {/* Konsep terkait */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {card.conceptTags.map((t) => (
          <Chip key={t} tone="muted">
            {t}
          </Chip>
        ))}
      </div>

      {/* Reveal pilihan yang tepat */}
      {!optimal && (
        <div className="mt-5 rounded-2xl border border-[#3ddc97]/25 bg-[#3ddc97]/6 p-5">
          <p className="font-mono-code text-[10px] tracking-widest text-[#3ddc97]">
            YANG PALING TEPAT ADALAH {correctOption.id}
          </p>
          <div className="mt-3">
            <Pseudo lines={correctOption.pseudo} compact />
          </div>
          <p className="mt-3 text-xs leading-relaxed text-slate-300">
            {option.feedback.correctIs !== "—" && `${option.feedback.correctIs} — `}amati
            perbedaannya dengan pilihanmu, lalu perbaiki pilihanmu.
          </p>
        </div>
      )}
    </div>
  );
}

function FeedbackBlock({
  tone,
  icon,
  label,
  text,
}: {
  tone: "mint" | "coral" | "volt";
  icon: React.ReactNode;
  label: string;
  text: string;
}) {
  const map = {
    mint: "border-[#3ddc97]/25 text-[#3ddc97]",
    coral: "border-[#ff5470]/25 text-[#ff5470]",
    volt: "border-[#3bd6ff]/25 text-[#3bd6ff]",
  };
  return (
    <div className={`rounded-xl border bg-[#0c1528]/70 p-4 ${map[tone]}`}>
      <p className="flex items-center gap-2 font-mono-code text-[10px] font-bold tracking-widest">
        {icon} {label}
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-200">{text}</p>
    </div>
  );
}

/* ────────────────────────── Review mode ────────────────────────── */

function ReviewView({ card, onBack }: { card: DilemmaCard; onBack: () => void }) {
  const s = useGame();
  const rec = s.cards[card.id];
  const correctOption = card.options.find((o) => o.verdict === "optimal")!;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-slate-400 hover:text-white"
          aria-label="Kembali ke peta level"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <LevelBadge level={card.level} />
        <Chip tone="mint">
          <CheckCircle2 className="mr-1 h-3 w-3" /> SELESAI — MODE TINJAUAN
        </Chip>
      </div>

      <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">{card.title}</h1>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-[#0e1a33]/70 p-4">
          <p className="font-mono-code text-[10px] tracking-widest text-slate-400">JAWABAN AWAL</p>
          <p className="mt-1 text-sm text-white">
            Pilihan {rec?.firstChoice ?? "-"} •{" "}
            {rec?.firstCorrect ? (
              <span className="text-[#3ddc97]">benar</span>
            ) : (
              <span className="text-[#ff5470]">belum tepat</span>
            )}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#0e1a33]/70 p-4">
          <p className="font-mono-code text-[10px] tracking-widest text-slate-400">HASIL AKHIR</p>
          <p className="mt-1 text-sm text-white">
            {rec?.revised ? (
              <>
                Direvisi ke {rec.finalChoice} •{" "}
                {rec.finalCorrect ? (
                  <span className="text-[#3ddc97]">benar</span>
                ) : (
                  <span className="text-[#ff5470]">belum tepat</span>
                )}
              </>
            ) : (
              <>
                Tanpa revisi •{" "}
                {rec?.finalCorrect ? (
                  <span className="text-[#3ddc97]">benar</span>
                ) : (
                  <span className="text-[#ff5470]">belum tepat</span>
                )}
              </>
            )}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-[#3ddc97]/25 bg-[#3ddc97]/6 p-5">
        <p className="font-mono-code text-[10px] tracking-widest text-[#3ddc97]">
          KUNCI: {correctOption.id}
        </p>
        <div className="mt-3">
          <Pseudo lines={correctOption.pseudo} compact />
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-[#0e1a33]/70 p-4">
        <p className="font-mono-code text-[10px] tracking-widest text-slate-400">PEMBAHASAN</p>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-200">{card.pembahasan}</p>
      </div>
    </div>
  );
}
