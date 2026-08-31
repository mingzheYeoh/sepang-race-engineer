import { test } from "node:test";
import assert from "node:assert/strict";
import { adviceFor, MAX_ADVICE, TIER } from "./advice.ts";
import { resolveWeekend } from "./weekend.ts";
import type { HourPoint } from "./weather.ts";

const at = (iso: string) => Date.parse(iso);

const conditions = (over: Partial<HourPoint> = {}): HourPoint => ({
  time: "2026-10-04T15:00",
  tempC: 32,
  feelsC: 40,
  rainChance: 20,
  rainMm: 0,
  humidity: 80,
  ...over,
});

test("safety advice is never crowded out by logistics", () => {
  const t = at("2026-10-04T13:00:00+08:00"); // Sunday break before the race
  const list = adviceFor(resolveWeekend(t), conditions(), t);
  assert.ok(list.length > 0);
  assert.equal(list[0].tier, TIER.SAFETY);
  assert.ok(
    list.every((a, i) => i === 0 || a.tier >= list[i - 1].tier),
    "list stays sorted by tier",
  );
});

test("the list is capped so it does not become a noticeboard", () => {
  const t = at("2026-10-04T13:00:00+08:00");
  const list = adviceFor(resolveWeekend(t), conditions({ feelsC: 42, rainChance: 90, rainMm: 5 }), t);
  assert.ok(list.length <= MAX_ADVICE, `got ${list.length} entries`);
});

test("sun advice disappears in rain and after dark", () => {
  const day = at("2026-10-02T10:00:00+08:00");
  const night = at("2026-10-02T22:00:00+08:00");
  const sunny = (l: ReturnType<typeof adviceFor>) => l.some((a) => a.icon === "🧴");

  assert.ok(sunny(adviceFor(resolveWeekend(day), conditions({ rainChance: 10 }), day)));
  assert.ok(!sunny(adviceFor(resolveWeekend(day), conditions({ rainChance: 80 }), day)));
  assert.ok(!sunny(adviceFor(resolveWeekend(night), conditions({ rainChance: 10 }), night)));
});

test("ear protection appears only while a session is running", () => {
  const during = at("2026-10-02T12:00:00+08:00");
  const between = at("2026-10-02T13:00:00+08:00");
  const ears = (ms: number) =>
    adviceFor(resolveWeekend(ms), conditions(), ms).some((a) => a.icon === "🎧");

  assert.ok(ears(during));
  assert.ok(!ears(between));
});

test("something useful is always returned, even with no weather", () => {
  const t = at("2026-10-04T18:00:00+08:00");
  const list = adviceFor(resolveWeekend(t), null, t);
  assert.ok(list.length > 0);
  assert.ok(list.every((a) => a.text.en.length > 0 && a.text.zh.length > 0 && a.icon.length > 0));
});
