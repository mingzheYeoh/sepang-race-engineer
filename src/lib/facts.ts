import { CIRCUIT, SESSIONS, localTime, type WeekendState } from "./weekend.ts";
import { estimateTrackTemp, type HourPoint } from "./weather.ts";
import { bestPlans, type Compound } from "./strategy.ts";
import type { L } from "./i18n.ts";

/**
 * The single structured view of "what is true right now".
 *
 * Every answer the engineer gives — templated or model-written — is built from
 * this object and nothing else. The rule engine owns every number here; the
 * model is only ever allowed to phrase them. Letting a model compute tyre
 * degradation instead produces confident, wrong figures that anyone who follows
 * the sport spots immediately.
 */
export type RaceFacts = {
  status: WeekendState["status"];
  sessionName: L | null;
  sessionNote: L | null;
  nextSessionName: L | null;
  minutesToNext: number | null;
  /**
   * The published timetable, in circuit-local time.
   *
   * Without it the engineer could say how long until a session but not when it
   * starts — and the rules forbid deriving one from the other, correctly: the
   * moment a model is allowed to do arithmetic on the facts, it is allowed to
   * do it wrong. The fix is to state the fact, not to relax the rule.
   */
  schedule: { name: L; day: L; localStart: string; minutes: number }[];
  weather: {
    airC: number;
    feelsC: number;
    trackC: number;
    humidity: number;
    rainChance: number;
    wet: boolean;
  } | null;
  circuit: { name: L; laps: number; lengthKm: number; corners: number };
  /**
   * The pit-wall call for the current track temperature. Absent only when there
   * is no weather to estimate a track temperature from, and both the template
   * and the prompt say so rather than inventing one.
   */
  strategy?: { stops: number; compounds: Compound[]; stopLaps: number[]; trackC: number };
};

export function buildFacts(state: WeekendState, now: HourPoint | null): RaceFacts {
  return {
    status: state.status,
    sessionName: state.current?.name ?? null,
    sessionNote: state.current?.note ?? null,
    nextSessionName: state.next?.name ?? null,
    minutesToNext:
      state.msToNext === null ? null : Math.round(state.msToNext / 60_000),
    schedule: SESSIONS.map((s) => ({
      name: s.name,
      day: s.day,
      localStart: localTime(s.start),
      minutes: s.minutes,
    })),
    weather: now
      ? {
          airC: Math.round(now.tempC),
          feelsC: Math.round(now.feelsC),
          trackC: estimateTrackTemp(now),
          humidity: now.humidity,
          rainChance: now.rainChance,
          wet: now.rainMm > 0.1 || now.rainChance >= 70,
        }
      : null,
    strategy: now ? planFor(estimateTrackTemp(now)) : undefined,
    circuit: {
      name: CIRCUIT.nameL,
      laps: CIRCUIT.laps,
      lengthKm: CIRCUIT.lengthKm,
      corners: CIRCUIT.corners,
    },
  };
}

/** The pit model's own answer, so the engineer never has to guess at one. */
function planFor(trackC: number) {
  const p = bestPlans(trackC, 3, 1)[0];
  return {
    stops: p.stops,
    compounds: p.stints.map((s) => s.compound),
    stopLaps: p.stopLaps,
    trackC,
  };
}
