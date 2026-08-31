import { CIRCUIT, type WeekendState } from "./weekend.ts";
import { estimateTrackTemp, type HourPoint } from "./weather.ts";

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
   * Filled in once the pit model lands. Absent means "no strategy call yet",
   * and both the template and the prompt say so rather than inventing one.
   */
  strategy?: { compound: string; stopLaps: number[]; note: string };
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
    circuit: {
      name: CIRCUIT.name,
      laps: CIRCUIT.laps,
      lengthKm: CIRCUIT.lengthKm,
      corners: CIRCUIT.corners,
    },
  };
}
