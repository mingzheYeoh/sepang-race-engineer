import type { RaceFacts } from "./facts.ts";
import { TYRES, formatLapList } from "./strategy.ts";
import { DEFAULT_LOCALE, pick, type L, type Locale } from "./i18n.ts";

/** The presets the template can answer without a model. */
export const TOPICS = ["weather", "strategy", "next", "kit", "track"] as const;
export type Topic = (typeof TOPICS)[number];

export const TOPIC_LABELS: Record<Topic, L> = {
  weather: { en: "What's the weather doing?", zh: "天气怎么样？" },
  strategy: { en: "What's the tyre call?", zh: "轮胎策略怎么定？" },
  next: { en: "What's next?", zh: "下一场是什么？" },
  kit: { en: "What should I bring?", zh: "该带什么？" },
  track: { en: "Tell me about the circuit", zh: "讲讲这条赛道" },
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
 * `RaceFacts` alone, so the radio is never dead: no key, no quota, no network to
 * Anthropic, and the presets still work, in either language.
 */
export function radioTemplate(
  facts: RaceFacts,
  topic: Topic,
  locale: Locale = DEFAULT_LOCALE,
): string {
  const w = facts.weather;
  const t = (s: L) => pick(s, locale);
  const zh = locale === "zh";

  switch (topic) {
    case "weather": {
      if (!w) {
        return t({
          en: "No weather feed right now. Eyes up — judge the sky yourself.",
          zh: "现在没有天气数据。抬头自己看天吧。",
        });
      }
      const call = w.wet
        ? t({
            en: "That's a wet track call. Expect standing water off-line.",
            zh: "这是湿地判定。走线之外会有积水。",
          })
        : w.rainChance >= 40
          ? t({
              en: "Keep an eye on it — that can turn inside twenty minutes here.",
              zh: "盯着点——雪邦这边二十分钟就能变天。",
            })
          : t({ en: "Track's staying dry for now.", zh: "赛道目前保持干燥。" });
      return zh
        ? `气温 ${w.airC}°C，赛道推算 ${w.trackC}°C，湿度 ${w.humidity}%。降雨概率 ${w.rainChance}%。${call}`
        : `Air ${w.airC}°C, track estimated ${w.trackC}°C, humidity ${w.humidity}%. Rain chance ${w.rainChance}%. ${call}`;
    }

    case "strategy": {
      const st = facts.strategy;
      if (!st) {
        return t({
          en: "No weather feed, so no track temperature — and without that there is no honest tyre call.",
          zh: "没有天气数据就没有赛道温度，没有赛道温度就给不出诚实的轮胎决策。",
        });
      }
      const laps = formatLapList(st.stopLaps, locale);
      const tyres = st.compounds.map((c) => pick(TYRES[c].label, locale)).join(" → ");
      return zh
        ? `赛道温度推算 ${st.trackC}°C。这是一套 ${st.stops} 停策略：${tyres}，第 ${laps} 圈进站。这是模型算的，不是实时计时——维修站墙那页列出了背后每一个数字。`
        : `Track's estimated at ${st.trackC}°C. That's a ${st.stops}-stop: ${tyres}, box on lap ${laps}. Model, not timing — the pit wall page shows every number behind it.`;
    }

    case "next": {
      if (facts.status === "after") {
        return t({
          en: "That's the weekend done. Chequered flag is out.",
          zh: "周末到此结束，格子旗已经挥下。",
        });
      }
      if (facts.sessionName) {
        const name = pick(facts.sessionName, locale);
        const note = facts.sessionNote ? pick(facts.sessionNote, locale) : "";
        return zh ? `${name}正在进行。${note}`.trim() : `${name} is running now. ${note}`.trim();
      }
      if (!facts.nextSessionName || facts.minutesToNext === null) {
        return t({
          en: "Nothing on the timing screens right now.",
          zh: "计时屏上现在什么都没有。",
        });
      }
      const gap = formatGap(facts.minutesToNext, locale);
      const name = pick(facts.nextSessionName, locale);
      // The clock time matters more than the countdown once a session is days
      // out, so both are given.
      const slot = facts.schedule.find((s) => s.name.en === facts.nextSessionName?.en);
      const when = slot ? `${pick(slot.day, locale)} ${slot.localStart}` : null;
      if (zh) {
        return `${name}还有 ${gap} 开始${when ? `，当地时间${when}` : ""}。自己也进站休息一下，找个阴凉地方。`;
      }
      return `${name} in ${gap}${when ? `, ${when} local` : ""}. Box yourself, get some shade.`;
    }

    case "kit": {
      const wet = w?.wet || (w?.rainChance ?? 0) >= 60;
      const hot = (w?.feelsC ?? 0) >= 36;
      if (zh) {
        const bits = ["饮用水", "防晒霜", "耳塞"];
        if (wet) bits.push("雨衣");
        if (hot) bits.push("帽子和遮阳计划");
        return `带上${bits.join("、")}。${wet ? "今天会淋雨。" : "今天会很热。"}轻装上阵的人，雪邦一个都不放过。`;
      }
      const bits = ["water", "sun cream", "ear protection"];
      if (wet) bits.push("a poncho");
      if (hot) bits.push("a hat and a shade plan");
      return `Bring ${bits.join(", ")}. ${
        wet ? "It's going to get wet." : "It's going to get hot."
      } Sepang punishes anyone who packs light.`;
    }

    case "track":
      return zh
        ? `${pick(facts.circuit.name, locale)}。${facts.circuit.lengthKm} 公里，${facts.circuit.corners} 个弯，周日跑 ${facts.circuit.laps} 圈。两条长直道夹着一个发夹弯——超车就发生在那里。`
        : `${pick(facts.circuit.name, locale)}. ${facts.circuit.lengthKm} km, ${facts.circuit.corners} corners, ${facts.circuit.laps} laps on Sunday. Two long straights either side of a hairpin — that's where the overtakes come from.`;
  }
}

/**
 * A gap in words, at whatever scale it actually is.
 *
 * `minutesToNext` is raw minutes, which reads fine for a session an hour away
 * and falls apart a month out: the model relayed "44967 minutes away" and the
 * template rendered "749h 27m". The Paddock's own countdown had days all along —
 * only this path had flattened them away.
 */
export function formatGap(minutes: number, locale: Locale = DEFAULT_LOCALE): string {
  const d = Math.floor(minutes / 1440);
  const h = Math.floor((minutes % 1440) / 60);
  const m = minutes % 60;
  if (locale === "zh") {
    if (d > 0) return `${d} 天${h > 0 ? ` ${h} 小时` : ""}`;
    return h > 0 ? `${h} 小时 ${m} 分钟` : `${m} 分钟`;
  }
  if (d > 0) return `${d}d${h > 0 ? ` ${h}h` : ""}`;
  return h > 0 ? `${h}h ${m}m` : `${m} minutes`;
}

/** Shown when free text arrives and no model is configured to answer it. */
export function noModelReply(locale: Locale = DEFAULT_LOCALE): string {
  return pick(
    {
      en: "Radio's on preset checks only right now — tap one of the buttons and I'll give you a straight answer.",
      zh: "无线电现在只能跑预设问题——点上面任意一个按钮，我给你一个明确答复。",
    },
    locale,
  );
}

/** Compact facts block for the model. Always English: this is data, not prose. */
export function factsForPrompt(facts: RaceFacts): string {
  const lines = [
    `weekend_status: ${facts.status}`,
    `session_running: ${facts.sessionName ? facts.sessionName.en : "none"}`,
    `next_session: ${facts.nextSessionName ? facts.nextSessionName.en : "none"}`,
    `time_to_next: ${facts.minutesToNext === null ? "unknown" : formatGap(facts.minutesToNext, "en")}`,
    "schedule (all times Malaysian local, UTC+8):",
    ...facts.schedule.map(
      (s) => `  ${s.name.en}: ${s.day.en} ${s.localStart}, ${s.minutes} minutes`,
    ),
    `circuit: ${facts.circuit.name.en}, ${facts.circuit.lengthKm} km, ${facts.circuit.corners} corners, ${facts.circuit.laps} race laps`,
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
      ? `strategy_model: ${facts.strategy.stops}-stop, ${facts.strategy.compounds.map((c) => TYRES[c].label.en).join(" > ")}, box on lap ${formatLapList(facts.strategy.stopLaps)}, computed at ${facts.strategy.trackC}C track temp`
      : "strategy_model: no weather, so no track temperature and no call",
  );
  return lines.join("\n");
}
