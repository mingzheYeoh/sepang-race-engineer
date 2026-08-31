import { CIRCUIT, type WeekendState } from "./weekend.ts";
import { estimateTrackTemp, type HourPoint } from "./weather.ts";
import { TYRES, bestPlans } from "./strategy.ts";

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
  sessionName: string | null;
  sessionNote: string | null;
  nextSessionName: string | null;
  minutesToNext: number | null;
  weather: {
    airC: number;
    feelsC: number;
    trackC: number;
    humidity: number;
    rainChance: number;
    wet: boolean;
  } | null;
  circuit: { name: string; laps: number; lengthKm: number; corners: number };
  /**
   * The pit-wall call for the current track temperature. Absent only when there
   * is no weather to estimate a track temperature from, and both the template
   * and the prompt say so rather than inventing one.
   */
  strategy?: { stops: number; compounds: string; stopLaps: number[]; trackC: number };
};

export function buildFacts(state: WeekendState, now: HourPoint | null): RaceFacts {
  return {
    status: state.status,
    sessionName: state.current?.name ?? null,
    sessionNote: state.current?.note ?? null,
    nextSessionName: state.next?.name ?? null,
    minutesToNext:
      state.msToNext === null ? null : Math.round(state.msToNext / 60_000),
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
      name: CIRCUIT.name,
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
    compounds: p.stints.map((s) => TYRES[s.compound].label).join(" → "),
    stopLaps: p.stopLaps,
    trackC,
  };
}
