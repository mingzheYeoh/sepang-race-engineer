import { SEPANG_RACES, type SepangRace } from "./history-data.ts";
import type { L } from "./i18n.ts";

export { SEPANG_RACES };
export type { SepangRace };

/**
 * What nineteen Malaysian Grands Prix actually did, and a quiz built out of it.
 *
 * Every headline figure and every quiz answer is derived from `history-data.ts`
 * at module load, never written by hand. A question whose answer was typed in
 * can be wrong; a question whose answer is computed from the results cannot be,
 * and it stays right if the data is ever regenerated.
 */

const tally = <K extends keyof SepangRace>(key: K) => {
  const m = new Map<SepangRace[K], number>();
  for (const r of SEPANG_RACES) m.set(r[key], (m.get(r[key]) ?? 0) + 1);
  return [...m].sort((a, b) => b[1] - a[1]);
};

const winnersByCount = tally("winner");
const teamsByCount = tally("constructor");
const shortest = SEPANG_RACES.reduce((a, b) => (a.laps <= b.laps ? a : b));
const deepestGrid = SEPANG_RACES.reduce((a, b) => (a.grid >= b.grid ? a : b));
const fromPole = SEPANG_RACES.filter((r) => r.grid === 1).length;

export const HISTORY = {
  races: SEPANG_RACES.length,
  firstSeason: SEPANG_RACES[0].season,
  lastSeason: SEPANG_RACES[SEPANG_RACES.length - 1].season,
  topDriver: winnersByCount[0],
  topTeam: teamsByCount[0],
  fromPole,
  shortest,
  deepestGrid,
  /** Drivers who have ever won here, for building plausible wrong answers. */
  allWinners: [...new Set(SEPANG_RACES.map((r) => r.winner))],
  allTeams: [...new Set(SEPANG_RACES.map((r) => r.constructor))],
} as const;

/**
 * Base rates for the prediction game, every one counted from the nineteen races
 * above. A prediction tool that quotes odds it made up is a worse thing than one
 * that quotes none, so nothing here is estimated.
 */
export const BASE_RATES = {
  wonFromPole: { hits: fromPole, of: SEPANG_RACES.length },
  wonFromTopThree: {
    hits: SEPANG_RACES.filter((r) => r.grid <= 3).length,
    of: SEPANG_RACES.length,
  },
  fullDistance: {
    hits: SEPANG_RACES.filter((r) => r.laps === 56).length,
    of: SEPANG_RACES.length,
  },
} as const;

export const pct = (r: { hits: number; of: number }) => Math.round((r.hits / r.of) * 100);

/* ------------------------------------------------------------------ quiz -- */

export type QuizQuestion = {
  id: string;
  prompt: L;
  options: string[];
  /** Index into `options`. */
  answer: number;
  /** Shown after answering, so a wrong guess still teaches something. */
  note: L;
};

/** Small deterministic PRNG so a given seed always builds the same quiz. */
function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 100000) / 100000;
  };
}

function shuffle<T>(items: T[], rand: () => number): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Pick `n` wrong answers that are plausible but definitely not the right one. */
function distractors(pool: readonly string[], correct: string, n: number, rand: () => number) {
  return shuffle(pool.filter((x) => x !== correct), rand).slice(0, n);
}

function withOptions(correct: string, wrong: string[], rand: () => number) {
  const options = shuffle([correct, ...wrong], rand);
  return { options, answer: options.indexOf(correct) };
}

type Builder = (race: SepangRace, rand: () => number) => QuizQuestion;

const BUILDERS: Builder[] = [
  (r, rand) => {
    const { options, answer } = withOptions(r.winner, distractors(HISTORY.allWinners, r.winner, 3, rand), rand);
    return {
      id: `winner-${r.season}`,
      prompt: {
        en: `Who won the ${r.season} Malaysian Grand Prix?`,
        zh: `${r.season} 年马来西亚大奖赛的冠军是谁？`,
      },
      options,
      answer,
      note: {
        en: `${r.winner} won for ${r.constructor}, starting ${r.grid === 1 ? "from pole" : `from P${r.grid}`}.`,
        zh: `${r.winner}为${r.constructor}拿下胜利，从${r.grid === 1 ? "杆位" : `第 ${r.grid} 位`}发车。`,
      },
    };
  },
  (r, rand) => {
    const { options, answer } = withOptions(
      r.constructor,
      distractors(HISTORY.allTeams, r.constructor, 3, rand),
      rand,
    );
    return {
      id: `team-${r.season}`,
      prompt: {
        en: `Which team won at Sepang in ${r.season}?`,
        zh: `${r.season} 年是哪支车队在雪邦夺冠？`,
      },
      options,
      answer,
      note: {
        en: `${r.constructor}, with ${r.winner} driving.`,
        zh: `${r.constructor}，驾驶者是${r.winner}。`,
      },
    };
  },
  (r, rand) => {
    const correct = `P${r.grid}`;
    const pool = ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8"];
    const { options, answer } = withOptions(correct, distractors(pool, correct, 3, rand), rand);
    return {
      id: `grid-${r.season}`,
      prompt: {
        en: `Where did the ${r.season} winner start from?`,
        zh: `${r.season} 年的冠军从第几位发车？`,
      },
      options,
      answer,
      note: {
        en: `${r.winner} started P${r.grid}. Only ${HISTORY.fromPole} of the ${HISTORY.races} races here were won from pole.`,
        zh: `${r.winner}从第 ${r.grid} 位发车。雪邦 ${HISTORY.races} 场比赛里只有 ${HISTORY.fromPole} 场由杆位夺冠。`,
      },
    };
  },
];

/** Questions that are about the whole record rather than one race. */
const OVERALL: ((rand: () => number) => QuizQuestion)[] = [
  (rand) => {
    const correct = String(HISTORY.shortest.laps);
    const { options, answer } = withOptions(correct, distractors(["56", "44", "38", "50", "31", "55"], correct, 3, rand), rand);
    return {
      id: "shortest",
      prompt: {
        en: "The shortest Malaysian Grand Prix ever run at Sepang went how many laps?",
        zh: "雪邦历史上最短的一场马来西亚大奖赛跑了多少圈？",
      },
      options,
      answer,
      note: {
        en: `${HISTORY.shortest.laps} laps, in ${HISTORY.shortest.season}. A monsoon stopped it early and half points were awarded — Sepang weather deciding a race is not a hypothetical.`,
        zh: `${HISTORY.shortest.season} 年，只跑了 ${HISTORY.shortest.laps} 圈。季风暴雨提前终止了比赛，只发一半积分——雪邦的天气左右比赛结果不是假设。`,
      },
    };
  },
  (rand) => {
    const correct = HISTORY.topDriver[0];
    const { options, answer } = withOptions(correct, distractors(HISTORY.allWinners, correct, 3, rand), rand);
    return {
      id: "most-wins",
      prompt: {
        en: "Which driver won the most races at Sepang?",
        zh: "哪位车手在雪邦赢得最多？",
      },
      options,
      answer,
      note: {
        en: `${HISTORY.topDriver[0]}, with ${HISTORY.topDriver[1]} wins from the ${HISTORY.races} races held here.`,
        zh: `${HISTORY.topDriver[0]}，在这里举办的 ${HISTORY.races} 场比赛中赢下 ${HISTORY.topDriver[1]} 场。`,
      },
    };
  },
  (rand) => {
    const correct = HISTORY.topTeam[0];
    const { options, answer } = withOptions(correct, distractors(HISTORY.allTeams, correct, 3, rand), rand);
    return {
      id: "most-team-wins",
      prompt: {
        en: "Which team won the most races at Sepang?",
        zh: "哪支车队在雪邦赢得最多？",
      },
      options,
      answer,
      note: {
        en: `${HISTORY.topTeam[0]}, with ${HISTORY.topTeam[1]} wins.`,
        zh: `${HISTORY.topTeam[0]}，共 ${HISTORY.topTeam[1] } 场胜利。`,
      },
    };
  },
];

export const QUIZ_LENGTH = 6;

/** A fresh quiz for a seed. Same seed, same questions — which makes it testable. */
export function buildQuiz(seed: number, count = QUIZ_LENGTH): QuizQuestion[] {
  const rand = rng(seed);
  const races = shuffle([...SEPANG_RACES], rand);
  const out: QuizQuestion[] = [];

  for (const build of shuffle([...OVERALL], rand)) {
    if (out.length >= Math.floor(count / 2)) break;
    out.push(build(rand));
  }
  let i = 0;
  while (out.length < count && i < races.length) {
    const build = BUILDERS[Math.floor(rand() * BUILDERS.length)];
    const q = build(races[i++], rand);
    if (!out.some((x) => x.id === q.id)) out.push(q);
  }
  return shuffle(out, rand);
}
