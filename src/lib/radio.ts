import type { RaceFacts } from "./facts.ts";
import { formatLapList } from "./strategy.ts";

/** The presets the template can answer without a model. */
export const TOPICS = ["weather", "strategy", "next", "kit", "track"] as const;
export type Topic = (typeof TOPICS)[number];

export const TOPIC_LABELS: Record<Topic, string> = {
  weather: "What's the weather doing?",
  strategy: "What's the tyre call?",
  next: "What's next?",
  kit: "What should I bring?",
  track: "Tell me about the circuit",
};

export const isTopic = (v: unknown): v is Topic =>
  typeof v === "string" && (TOPICS as readonly string[]).includes(v);

/** Free-text questions are capped before they reach a prompt or a log. */
export const MAX_QUESTION = 300;

/**
 * Deterministic answers, built from the same facts the model would get.
 *
 * This is not a degraded stand-in that happens to run when the key is missing —
 * it is the floor the feature is built on. Every preset is answerable from
 * `RaceFacts` alone, so the radio is never dead: no key, no quota, no network
 * to Anthropic, and the presets still work.
 */
export function radioTemplate(facts: RaceFacts, topic: Topic): string {
  const w = facts.weather;

  switch (topic) {
    case "weather": {
      if (!w) return "No weather feed right now. Eyes up — judge the sky yourself.";
      const call = w.wet
        ? "That's a wet track call. Expect standing water off-line."
        : w.rainChance >= 40
          ? "Keep an eye on it — that can turn inside twenty minutes here."
          : "Track's staying dry for now.";
      return `Air ${w.airC}°C, track estimated ${w.trackC}°C, humidity ${w.humidity}%. Rain chance ${w.rainChance}%. ${call}`;
    }

    case "next": {
      if (facts.status === "after") return "That's the weekend done. Chequered flag is out.";
      if (facts.sessionName) {
        return `${facts.sessionName} is running now. ${facts.sessionNote ?? ""}`.trim();
      }
      if (!facts.nextSessionName || facts.minutesToNext === null) {
        return "Nothing on the timing screens right now.";
      }
      const h = Math.floor(facts.minutesToNext / 60);
      const m = facts.minutesToNext % 60;
      const when = h > 0 ? `${h}h ${m}m` : `${m} minutes`;
      return `${facts.nextSessionName} in ${when}. Box yourself, get some shade.`;
    }

    case "kit": {
      const wet = w?.wet || (w?.rainChance ?? 0) >= 60;
      const hot = (w?.feelsC ?? 0) >= 36;
      const bits = ["water", "sun cream", "ear protection"];
      if (wet) bits.push("a poncho");
      if (hot) bits.push("a hat and a shade plan");
      return `Bring ${bits.join(", ")}. ${
        wet ? "It's going to get wet." : "It's going to get hot."
      } Sepang punishes anyone who packs light.`;
    }

    case "strategy": {
      const st = facts.strategy;
      if (!st) return "No weather feed, so no track temperature — and without that there is no honest tyre call.";
      return `Track's estimated at ${st.trackC}°C. That's a ${st.stops}-stop: ${st.compounds}, box on lap ${formatLapList(st.stopLaps)}. Model, not timing — the pit wall page shows every number behind it.`;
    }

    case "track":
      return `${facts.circuit.name}. ${facts.circuit.lengthKm} km, ${facts.circuit.corners} corners, ${facts.circuit.laps} laps on Sunday. Two long straights either side of a hairpin — that's where the overtakes come from.`;
  }
}

/** Shown when free text arrives and no model is configured to answer it. */
export function noModelReply(): string {
  return "Radio's on preset checks only right now — tap one of the buttons and I'll give you a straight answer.";
}

/** Compact, unambiguous facts block for the model. Never free prose. */
export function factsForPrompt(facts: RaceFacts): string {
  const lines = [
    `weekend_status: ${facts.status}`,
    `session_running: ${facts.sessionName ?? "none"}`,
    `next_session: ${facts.nextSessionName ?? "none"}`,
    `minutes_to_next: ${facts.minutesToNext ?? "unknown"}`,
    `circuit: ${facts.circuit.name}, ${facts.circuit.lengthKm} km, ${facts.circuit.corners} corners, ${facts.circuit.laps} race laps`,
  ];
  if (facts.weather) {
    const w = facts.weather;
    lines.push(
      `air_temp_c: ${w.airC}`,
      `feels_like_c: ${w.feelsC}`,
      `track_temp_c_estimated: ${w.trackC}`,
      `humidity_pct: ${w.humidity}`,
      `rain_chance_pct: ${w.rainChance}`,
      `wet_track: ${w.wet}`,
    );
  } else {
    lines.push("weather: unavailable");
  }
  lines.push(
    facts.strategy
      ? `strategy_model: ${facts.strategy.stops}-stop, ${facts.strategy.compounds}, box on lap ${formatLapList(facts.strategy.stopLaps)}, computed at ${facts.strategy.trackC}C track temp`
      : "strategy_model: no weather, so no track temperature and no call",
  );
  return lines.join("\n");
}
