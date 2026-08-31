import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveWeekend, formatCountdown, overrideNow, SESSIONS } from "./weekend.ts";

const at = (iso: string) => Date.parse(iso);

test("before the weekend starts", () => {
  const w = resolveWeekend(at("2026-09-30T09:00:00+08:00"));
  assert.equal(w.status, "before");
  assert.equal(w.current, null);
  assert.equal(w.next?.id, "FP1");
  assert.ok(w.msToNext! > 0);
});

test("inside a session", () => {
  const w = resolveWeekend(at("2026-10-02T12:00:00+08:00"));
  assert.equal(w.status, "live");
  assert.equal(w.current?.id, "FP1");
  assert.equal(w.next?.id, "FP1", "the running session is still the next one to finish");
  assert.ok(w.msToNext! < 0, "countdown is negative once a session is under way");
});

test("gap between sessions counts down to the next one, not back to the last", () => {
  const w = resolveWeekend(at("2026-10-02T13:00:00+08:00"));
  assert.equal(w.status, "break");
  assert.equal(w.current, null);
  assert.equal(w.next?.id, "FP2");
});

test("session boundaries are half-open", () => {
  const race = SESSIONS.find((s) => s.id === "RACE")!;
  assert.equal(resolveWeekend(at(race.start)).current?.id, "RACE", "start is inclusive");
  const end = at(race.start) + race.minutes * 60_000;
  assert.equal(resolveWeekend(end).current, null, "end is exclusive");
  assert.equal(resolveWeekend(end).status, "after");
});

test("after the race", () => {
  const w = resolveWeekend(at("2026-10-05T09:00:00+08:00"));
  assert.equal(w.status, "after");
  assert.equal(w.next, null);
  assert.equal(w.msToNext, null);
});

test("countdown formatting", () => {
  assert.equal(formatCountdown(-5000), "00:00:00");
  assert.equal(formatCountdown(0), "00:00:00");
  assert.equal(formatCountdown(3_661_000), "01:01:01");
  assert.equal(formatCountdown(90_061_000), "1d 01:01:01");
});

test("time override falls back to now when unusable", () => {
  assert.equal(overrideNow("2026-10-04T15:30:00+08:00"), at("2026-10-04T15:30:00+08:00"));
  const now = Date.now();
  assert.ok(Math.abs(overrideNow("banana") - now) < 5000);
  assert.ok(Math.abs(overrideNow(null) - now) < 5000);
});
