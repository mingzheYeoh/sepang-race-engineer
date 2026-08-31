import { test } from "node:test";
import assert from "node:assert/strict";
import { buildFacts } from "./facts.ts";
import { TOPICS, factsForPrompt, formatGap, isTopic, radioTemplate } from "./radio.ts";
import { resolveWeekend } from "./weekend.ts";
import type { HourPoint } from "./weather.ts";

const at = (iso: string) => Date.parse(iso);

const conditions = (over: Partial<HourPoint> = {}): HourPoint => ({
  time: "2026-10-04T15:00",
  tempC: 32,
  feelsC: 39,
  rainChance: 20,
  rainMm: 0,
  humidity: 80,
  ...over,
});

const factsAt = (iso: string, w: HourPoint | null = conditions()) =>
  buildFacts(resolveWeekend(at(iso)), w);

test("topic validation rejects anything not a preset", () => {
  assert.ok(isTopic("weather"));
  assert.ok(!isTopic("__proto__"));
  assert.ok(!isTopic(""));
  assert.ok(!isTopic(null));
  assert.ok(!isTopic({ topic: "weather" }));
});

test("every preset answers without a model, in every phase", () => {
  const phases = [
    "2026-09-30T09:00:00+08:00", // before
    "2026-10-02T12:00:00+08:00", // live
    "2026-10-02T13:00:00+08:00", // break
    "2026-10-05T09:00:00+08:00", // after
  ];
  for (const iso of phases) {
    for (const w of [conditions(), null]) {
      const facts = factsAt(iso, w);
      for (const topic of TOPICS) {
        for (const lang of ["en", "zh"] as const) {
          const line = radioTemplate(facts, topic, lang);
          assert.ok(line.length > 6, `${topic} (${lang}) at ${iso} produced "${line}"`);
          assert.ok(!line.includes("undefined"), `${topic} (${lang}) leaked undefined: ${line}`);
          assert.ok(!line.includes("NaN"), `${topic} (${lang}) leaked NaN: ${line}`);
          assert.ok(!line.includes("[object"), `${topic} (${lang}) leaked an object: ${line}`);
        }
      }
    }
  }
});

test("weather preset distinguishes wet from dry", () => {
  const wet = radioTemplate(factsAt("2026-10-04T15:30:00+08:00", conditions({ rainMm: 4, rainChance: 90 })), "weather");
  const dry = radioTemplate(factsAt("2026-10-04T15:30:00+08:00", conditions({ rainChance: 5 })), "weather");
  assert.match(wet, /wet track/i);
  assert.match(dry, /dry/i);
});

test("kit preset adds a poncho only when rain is likely", () => {
  const wet = radioTemplate(factsAt("2026-10-02T10:00:00+08:00", conditions({ rainChance: 80 })), "kit");
  const dry = radioTemplate(factsAt("2026-10-02T10:00:00+08:00", conditions({ rainChance: 5 })), "kit");
  assert.match(wet, /poncho/i);
  assert.ok(!/poncho/i.test(dry));
});

test("next preset reports the running session, then the gap, then the flag", () => {
  assert.match(radioTemplate(factsAt("2026-10-02T12:00:00+08:00"), "next"), /Practice 1/);
  assert.match(radioTemplate(factsAt("2026-10-02T13:00:00+08:00"), "next"), /Practice 2/);
  assert.match(radioTemplate(factsAt("2026-10-05T09:00:00+08:00"), "next"), /Chequered flag/i);
});

test("the prompt facts block states what it does not know", () => {
  const withWeather = factsForPrompt(factsAt("2026-10-04T15:30:00+08:00"));
  assert.match(withWeather, /track_temp_c_estimated: \d+/);
  assert.match(withWeather, /strategy_model: \d-stop/, "a track temperature means there is a call");

  const without = factsForPrompt(factsAt("2026-10-04T15:30:00+08:00", null));
  assert.match(without, /weather: unavailable/);
  assert.match(without, /strategy_model: no weather/, "no temperature must mean no invented call");
  assert.ok(!without.includes("undefined"));
});

test("a gap is stated at the scale it actually is, not always in minutes", () => {
  // The bug this pins: a month out, minutes are technically true and useless.
  assert.equal(formatGap(44967), "31d 5h");
  assert.equal(formatGap(44967, "zh"), "31 天 5 小时");
  assert.equal(formatGap(207), "3h 27m");
  assert.equal(formatGap(45), "45 minutes");
  assert.equal(formatGap(45, "zh"), "45 分钟");
  assert.equal(formatGap(1440), "1d", "a whole number of days does not trail a bare 0h");
});

test("the model is never handed a gap it would have to do arithmetic on", () => {
  const far = factsForPrompt(factsAt("2026-09-01T06:00:00+08:00"));
  assert.match(far, /time_to_next: \d+d/, "a month out must read in days");
  assert.ok(!/\d{4,} minutes/.test(far), "four-digit minute counts are the bug");
});
