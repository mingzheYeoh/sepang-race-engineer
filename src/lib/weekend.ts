// The 2026 Bahrain Grand Prix, held at Sepang on 2-4 October 2026 — confirmed by
// Formula 1 and the FIA, not a premise of this project.
// Malaysia is UTC+8 year-round with no daylight saving, so fixed +08:00 offsets are
// exact and we need no date library.

import type { L } from "./i18n.ts";

export type SessionId = "FP1" | "FP2" | "FP3" | "QUALI" | "RACE";

export type Session = {
  id: SessionId;
  name: L;
  /** Local Malaysian day label. */
  day: L;
  start: string; // ISO with +08:00
  minutes: number;
  /** Why this session matters to a fan watching it. */
  note: L;
};

export const SESSIONS: Session[] = [
  {
    id: "FP1",
    name: { en: "Practice 1", zh: "第一次自由练习" },
    day: { en: "Friday", zh: "周五" },
    start: "2026-10-02T11:30:00+08:00",
    minutes: 60,
    note: {
      en: "Morning running. Cooler track than race conditions, so the lap times lie.",
      zh: "上午出场。赛道比正赛时凉，所以圈速会骗人。",
    },
  },
  {
    id: "FP2",
    name: { en: "Practice 2", zh: "第二次自由练习" },
    day: { en: "Friday", zh: "周五" },
    start: "2026-10-02T15:00:00+08:00",
    minutes: 60,
    note: {
      en: "Runs at race o'clock. This is the only representative long-run data all weekend.",
      zh: "在与正赛同一时段进行。整个周末只有这一次能拿到有参考价值的长距离数据。",
    },
  },
  {
    id: "FP3",
    name: { en: "Practice 3", zh: "第三次自由练习" },
    day: { en: "Saturday", zh: "周六" },
    start: "2026-10-03T11:30:00+08:00",
    minutes: 60,
    note: {
      en: "Final setup window before parc ferme. Teams chase one-lap pace here.",
      zh: "进入 parc ferme 前最后的调校窗口。车队在这里追单圈速度。",
    },
  },
  {
    id: "QUALI",
    name: { en: "Qualifying", zh: "排位赛" },
    day: { en: "Saturday", zh: "周六" },
    start: "2026-10-03T15:00:00+08:00",
    minutes: 60,
    note: {
      en: "Q1, Q2, Q3. Track position matters at Sepang, but two long straights keep overtaking alive.",
      zh: "Q1、Q2、Q3。雪邦看重发车位置，但两条长直道让超车始终有戏。",
    },
  },
  {
    id: "RACE",
    name: { en: "Grand Prix", zh: "正赛" },
    day: { en: "Sunday", zh: "周日" },
    start: "2026-10-04T15:00:00+08:00",
    minutes: 120,
    note: {
      en: "56 laps. A 15:00 start puts the race squarely in the afternoon thunderstorm window.",
      zh: "56 圈。15:00 发车，正好落在午后雷暴的高发时段。",
    },
  },
];

export const CIRCUIT = {
  name: "Sepang International Circuit",
  nameL: { en: "Sepang International Circuit", zh: "雪邦国际赛道" } as L,
  laps: 56,
  lengthKm: 5.543,
  corners: 15,
  lat: 2.7603,
  lon: 101.7382,
  timezone: "Asia/Kuala_Lumpur",
} as const;

export type WeekendStatus = "before" | "live" | "break" | "after";

export type WeekendState = {
  status: WeekendStatus;
  /** The session running right now, if any. */
  current: Session | null;
  /** The next session that has not finished, if any. */
  next: Session | null;
  /** Milliseconds until `next` starts. Negative while `next` is running. */
  msToNext: number | null;
};

const endOf = (s: Session) => Date.parse(s.start) + s.minutes * 60_000;

/**
 * Resolve where `now` sits in the race weekend.
 *
 * Gaps between sessions are their own status ("break") rather than being folded
 * into the previous session, because the useful thing to show a fan at 13:00 on
 * Friday is a countdown to FP2, not a finished FP1.
 */
export function resolveWeekend(now: Date | number = Date.now()): WeekendState {
  const t = typeof now === "number" ? now : now.getTime();

  const current = SESSIONS.find((s) => t >= Date.parse(s.start) && t < endOf(s)) ?? null;
  const next = SESSIONS.find((s) => t < endOf(s)) ?? null;

  let status: WeekendStatus;
  if (current) status = "live";
  else if (!next) status = "after";
  else if (next.id === SESSIONS[0].id) status = "before";
  else status = "break";

  return {
    status,
    current,
    next,
    msToNext: next ? Date.parse(next.start) - t : null,
  };
}

/**
 * Read the `?t=` demo override. The race-day interface is unreachable outside
 * 2-4 October without it, which would make the app impossible to demo or test
 * on any other date.
 */
export function overrideNow(t: string | undefined | null): number {
  if (!t) return Date.now();
  const parsed = Date.parse(t);
  return Number.isNaN(parsed) ? Date.now() : parsed;
}

export function formatCountdown(ms: number): string {
  if (ms <= 0) return "00:00:00";
  const total = Math.floor(ms / 1000);
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return d > 0 ? `${d}d ${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function localTime(iso: string): string {
  return new Intl.DateTimeFormat("en-MY", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: CIRCUIT.timezone,
  }).format(Date.parse(iso));
}

/** Hour of day (0-23) at the circuit, for rules that depend on daylight. */
export function localHour(ms: number): number {
  return Number(
    new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      hourCycle: "h23",
      timeZone: CIRCUIT.timezone,
    }).format(ms),
  );
}
