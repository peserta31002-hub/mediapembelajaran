// ============================================================
// BAGIAN 2 — BARREL: seluruh konten X.AP.2 dalam satu pintu
// ============================================================

export { TUTORIAL_P2, LEVELS_P2 } from "./p2/tutorial";
export type { LevelMeta } from "./p2/tutorial";
export { CARDS_P2_L1 } from "./p2/cardsL1";
export { CARDS_P2_L2 } from "./p2/cardsL2";
export { CARDS_P2_L3 } from "./p2/cardsL3";
export { CARDS_P2_L4 } from "./p2/cardsL4";
export { CARDS_P2_L5 } from "./p2/cardsL5";
export { LAB_TASKS_P2, FINAL_MISSION_P2 } from "./p2/lab";

import { DilemmaCard } from "./gameData";
import { CARDS_P2_L1 } from "./p2/cardsL1";
import { CARDS_P2_L2 } from "./p2/cardsL2";
import { CARDS_P2_L3 } from "./p2/cardsL3";
import { CARDS_P2_L4 } from "./p2/cardsL4";
import { CARDS_P2_L5 } from "./p2/cardsL5";

export const CARDS_P2: DilemmaCard[] = [
  ...CARDS_P2_L1,
  ...CARDS_P2_L2,
  ...CARDS_P2_L3,
  ...CARDS_P2_L4,
  ...CARDS_P2_L5,
];
