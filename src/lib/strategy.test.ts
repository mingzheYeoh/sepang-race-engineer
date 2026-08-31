import { test } from "node:test";
import assert from "node:assert/strict";
import {
  MIN_COMPOUNDS,
  RACE_LAPS,
  bestPlans,
  degradationS,
  formatRaceTime,
  lapTimeS,
  tempFactor,
} from "./strategy.ts";

test("hotter track wears tyres faster, and the factor never goes negative", () => {
  assert.equal(tempFactor(45), 1);
  assert.ok(tempFactor(55) > tempFactor(45));
  assert.ok(tempFactor(35) < tempFactor(45));
  assert.ok(tempFactor(-50) > 0, "an absurd input must not invert the model");
});

test("degradation grows with age and falls off a cliff past tyre life", () => {
  const early = degradationS("soft", 5, 45) - degradationS("soft", 4, 45);
  const late = degradationS("soft", 40, 45) - degradationS("soft", 39, 45);
  assert.ok(late > early * 2, "past its life a tyre should fall away far faster");
  assert.equal(degradationS("soft", 0, 45), 0, "a fresh tyre has lost nothing");
});

test("compounds trade one-lap pace against how long they last", () => {
  // Fresh, the soft is quickest.
  assert.ok(lapTimeS(1, "soft", 0, 45) < lapTimeS(1, "medium", 0, 45));
  assert.ok(lapTimeS(1, "medium", 0, 45) < lapTimeS(1, "hard", 0, 45));
  // Twenty-five laps in, that has reversed.
  assert.ok(lapTimeS(30, "hard", 25, 45) < lapTimeS(30, "soft", 25, 45));
});

test("fuel burn-off makes the same tyre quicker later in the race", () => {
  assert.ok(lapTimeS(50, "medium", 0, 45) < lapTimeS(5, "medium", 0, 45));
});

test("every plan is a legal race", () => {
  for (const plan of bestPlans(50)) {
    const laps = plan.stints.reduce((s, x) => s + x.laps, 0);
    assert.equal(laps, RACE_LAPS, "the stints must add up to the race distance");
    assert.equal(plan.stints.length, plan.stops + 1);
    assert.equal(plan.stopLaps.length, plan.stops);
    assert.ok(
      new Set(plan.stints.map((s) => s.compound)).size >= MIN_COMPOUNDS,
      "a dry race must use at least two compounds",
    );
    assert.ok(plan.stints.every((s) => s.laps > 0));
    // Stints must run back to back with no gap and no overlap.
    let lap = 1;
    for (const s of plan.stints) {
      assert.equal(s.startLap, lap);
      lap += s.laps;
    }
  }
});

test("plans come back quickest first, and are genuinely different from each other", () => {
  const plans = bestPlans(50);
  assert.ok(plans.length >= 2);
  for (let i = 1; i < plans.length; i++) {
    assert.ok(plans[i].totalS >= plans[i - 1].totalS, "plans must be sorted by race time");
  }
  const shapes = plans.map((p) => p.stints.map((s) => `${s.compound}${s.laps}`).join("-"));
  assert.equal(new Set(shapes).size, shapes.length, "no duplicate plan shapes");
});

test("a hotter track pushes the race towards more stops", () => {
  const cool = bestPlans(32)[0];
  const hot = bestPlans(58)[0];
  assert.ok(
    hot.stops >= cool.stops,
    `hot race used ${hot.stops} stops, cool used ${cool.stops} — heat must never reduce stops`,
  );
});

test("Sepang in the heat comes out as a two-stop, which is what it was known for", () => {
  const plan = bestPlans(52)[0];
  assert.ok(plan.stops >= 2, `expected at least two stops at 52 °C, got ${plan.stops}`);
});

test("the winning plan really is the cheapest option offered", () => {
  const plans = bestPlans(50, 3, 8);
  const cheapest = Math.min(...plans.map((p) => p.totalS));
  assert.equal(plans[0].totalS, cheapest);
});

test("race times format as a readable clock", () => {
  assert.equal(formatRaceTime(3600), "1:00:00.0");
  assert.equal(formatRaceTime(5445.6), "1:30:45.6");
});

test("stop laps read as a list, not a chain of ands", async () => {
  const { formatLapList } = await import("./strategy.ts");
  assert.equal(formatLapList([]), "");
  assert.equal(formatLapList([19]), "19");
  assert.equal(formatLapList([19, 38]), "19 and 38");
  assert.equal(formatLapList([13, 30, 43]), "13, 30 and 43");
});
