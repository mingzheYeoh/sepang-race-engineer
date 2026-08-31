import type { HourPoint } from "./weather";
import type { WeekendState } from "./weekend";

export type Advice = { icon: string; text: string };

/**
 * What the app tells a fan to do right now, given the weekend phase and the
 * conditions at the circuit.
 *
 * These are judgement calls about a tropical circuit, not derivations, so they
 * live in one place where they can be argued with and tuned.
 */
export function adviceFor(state: WeekendState, now: HourPoint | null): Advice[] {
  const out: Advice[] = [];

  if (now) {
    if (now.feelsC >= 38) {
      out.push({ icon: "🥵", text: `Feels like ${Math.round(now.feelsC)}°C. Two litres of water per person, minimum. Shade between sessions.` });
    }
    if (now.rainChance >= 60) {
      out.push({ icon: "🌧️", text: `${now.rainChance}% rain chance. Poncho, not umbrella - umbrellas block the view behind you and most grandstands ban them.` });
    }
  }

  // TODO(you): the rules below need local judgement rather than a formula.
  // Add 2-4 more entries covering the cases that actually catch people out at
  // Sepang - think about UV at a circuit two degrees off the equator, the walk
  // between grandstands with no cover, phone battery across a nine-hour day,
  // cash vs card at the food stalls, or getting out of the car park afterwards.
  // Decide which of these fire always vs. only under certain conditions.

  if (out.length === 0) {
    out.push({ icon: "🎒", text: "Sun protection, water, ear protection, and a poncho. Sepang punishes all four omissions." });
  }
  return out;
}
