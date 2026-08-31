import type { HourPoint } from "./weather.ts";
import { localHour, type WeekendState } from "./weekend.ts";

/** Lower tiers outrank higher ones. Safety is never pushed off the list by logistics. */
export const TIER = { SAFETY: 0, COMFORT: 1, LOGISTICS: 2 } as const;

export type Advice = {
  icon: string;
  text: string;
  tier: (typeof TIER)[keyof typeof TIER];
};

/** Past four entries the panel reads as a noticeboard and nobody reads noticeboards. */
export const MAX_ADVICE = 4;

/**
 * What the app tells a fan to do right now, given the weekend phase and the
 * conditions at the circuit.
 *
 * These are judgement calls about a tropical circuit, not derivations, so they
 * live in one place where they can be argued with and tuned.
 *
 * Almost every rule is conditional, including the ones that are "always" true
 * at Sepang. Sun protection matters on essentially every dry daylight hour of
 * the weekend, but a line that never disappears stops being read by day two, so
 * it is gated on daylight and dry weather - it goes away exactly when nobody
 * would act on it anyway, which keeps it visible when they would.
 */
export function adviceFor(
  state: WeekendState,
  now: HourPoint | null,
  nowMs: number,
): Advice[] {
  const out: Advice[] = [];
  const hour = localHour(nowMs);
  const daylight = hour >= 8 && hour < 19;

  if (now) {
    // Convective storms here arrive in minutes, and the grandstands are open
    // steel frames. This outranks everything else on the list.
    if (now.rainMm > 2 || now.rainChance >= 85) {
      out.push({
        icon: "⛈️",
        tier: TIER.SAFETY,
        text: "Storm cell overhead. Grandstands are open steel — move to the covered concourse at the first thunder. Sessions get red-flagged in this, so you will not miss racing.",
      });
    }

    if (now.feelsC >= 38) {
      out.push({
        icon: "🥵",
        tier: TIER.SAFETY,
        text: `Feels like ${Math.round(now.feelsC)}°C. Two litres of water per person, minimum, and find shade between sessions.`,
      });
    }

    if (daylight && now.rainChance < 50) {
      out.push({
        icon: "🧴",
        tier: TIER.SAFETY,
        text: "Sepang sits 2.8° off the equator — UV index passes 11 by mid-morning. SPF50, and reapply at every session break, not once in the morning.",
      });
    }

    if (now.rainChance >= 60 && now.rainChance < 85) {
      out.push({
        icon: "🌧️",
        tier: TIER.COMFORT,
        text: `${now.rainChance}% rain chance. Poncho, not umbrella — umbrellas block the view behind you and most grandstands ban them.`,
      });
    }
  }

  // Fires exactly while cars are on track and is invisible the rest of the time,
  // which is the whole point: it arrives when it is actionable.
  if (state.current) {
    out.push({
      icon: "🎧",
      tier: TIER.COMFORT,
      text: "Cars are running. Trackside peaks past 130 dB — get ear protection in now rather than after the first lap.",
    });
  }

  // Long gaps are when the covered walkways are empty. Later, everyone moves at once.
  if (state.status === "break" && (state.msToNext ?? 0) > 90 * 60_000) {
    const mins = Math.round((state.msToNext ?? 0) / 60_000);
    out.push({
      icon: "🚶",
      tier: TIER.LOGISTICS,
      text: `${Math.floor(mins / 60)}h ${mins % 60}m until the next session. The walk between grandstands has no cover — move now, while the concourse is quiet.`,
    });
  }

  // Race day is a nine-hour day on a phone that is running this app.
  if (state.next?.id === "RACE" || state.current?.id === "RACE") {
    out.push({
      icon: "🔋",
      tier: TIER.LOGISTICS,
      text: "Nine hours on site and a phone doing timing, photos and this app. Bring a power bank; the queues for a socket are longer than the ones for food.",
    });
  }

  if (state.status === "break" || state.status === "before") {
    out.push({
      icon: "💵",
      tier: TIER.LOGISTICS,
      text: "Circuit stalls are patchy on Touch 'n Go and cards. Carry small cash — the ATMs on site run dry by Sunday afternoon.",
    });
  }

  if (state.status === "after") {
    out.push({
      icon: "🅿️",
      tier: TIER.LOGISTICS,
      text: "The car parks take well over an hour to clear. Sit down, let the queue drain, and leave when the road out is moving.",
    });
  }

  if (out.length === 0) {
    out.push({
      icon: "🎒",
      tier: TIER.COMFORT,
      text: "Sun protection, water, ear protection, poncho. Sepang punishes all four omissions.",
    });
  }

  return out.sort((a, b) => a.tier - b.tier).slice(0, MAX_ADVICE);
}
