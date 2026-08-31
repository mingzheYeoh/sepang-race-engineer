import { test } from "node:test";
import assert from "node:assert/strict";
import { CORNERS, DRS_ZONES, LAP, LAP_METRES, VIEWBOX, lapPath, zonePath } from "./circuit.ts";

/** Published Grand Prix layout figures, to check the survey against. */
const OFFICIAL_METRES = 5543;
const OFFICIAL_TURNS = 15;

test("the surveyed lap matches the published circuit length", () => {
  const errorPct = (Math.abs(LAP_METRES - OFFICIAL_METRES) / OFFICIAL_METRES) * 100;
  assert.ok(
    errorPct < 1,
    `lap is ${LAP_METRES} m vs official ${OFFICIAL_METRES} m (${errorPct.toFixed(2)}% out)`,
  );
});

test("fifteen corners, numbered in lap order and spaced around the lap", () => {
  assert.equal(CORNERS.length, OFFICIAL_TURNS);
  CORNERS.forEach((c, i) => assert.equal(c.n, i + 1));
  for (let i = 1; i < CORNERS.length; i++) {
    assert.ok(
      CORNERS[i].atM > CORNERS[i - 1].atM,
      `Turn ${i + 1} is not further round the lap than Turn ${i}`,
    );
  }
  assert.ok(CORNERS[14].atM < LAP_METRES, "the last corner must fall inside the lap");
});

test("corner properties stay consistent with the geometry they came from", () => {
  for (const c of CORNERS) {
    assert.ok(c.sweepDeg > 0 && c.sweepDeg < 360, `Turn ${c.n} sweep ${c.sweepDeg} is implausible`);
    assert.ok(c.lengthM > 0, `Turn ${c.n} has no length`);
    // Speed is derived from tightness, so the two must never disagree.
    const expected = c.degPerM > 0.9 ? "slow" : c.degPerM > 0.4 ? "medium" : "fast";
    assert.equal(c.speed, expected, `Turn ${c.n} speed disagrees with ${c.degPerM} deg/m`);
    assert.ok(
      Math.abs(c.sweepDeg / c.lengthM - c.degPerM) < 0.05,
      `Turn ${c.n} degPerM does not match its own sweep and length`,
    );
  }
});

test("the two DRS straights are the longest run-ups on the lap", () => {
  assert.equal(DRS_ZONES.length, 2);
  const longest = [...CORNERS].sort((a, b) => b.approachM - a.approachM).slice(0, 2);
  // Turn 1 follows the pit straight; Turn 15 follows the back straight.
  assert.deepEqual(
    longest.map((c) => c.n).sort((a, b) => a - b),
    [1, 15],
  );
  assert.ok(longest.every((c) => c.approachM > 600), "both DRS straights should exceed 600 m");
});

test("every corner teaches a different idea and explains itself", () => {
  for (const c of CORNERS) {
    assert.ok(c.guide.length > 40, `Turn ${c.n} guide is too thin`);
    assert.ok(c.lesson.title.trim().length > 0, `Turn ${c.n} lesson has no title`);
    assert.ok(c.lesson.body.length > 60, `Turn ${c.n} lesson is too thin`);
  }
  assert.equal(new Set(CORNERS.map((c) => c.lesson.title)).size, OFFICIAL_TURNS);
});

test("every corner marker sits on the surveyed line", () => {
  const onLap = new Set(LAP.map(([x, y]) => `${x},${y}`));
  for (const c of CORNERS) {
    assert.ok(onLap.has(`${c.x},${c.y}`), `Turn ${c.n} marker is off the track line`);
  }
});

test("the drawn lap is closed and stays inside the viewBox", () => {
  const d = lapPath();
  assert.ok(d.startsWith(`M ${LAP[0][0]} ${LAP[0][1]}`));
  assert.match(d, / Z$/);
  assert.equal(d.match(/ L /g)?.length, LAP.length - 1);

  const [, , vw, vh] = VIEWBOX.split(" ").map(Number);
  for (const [x, y] of LAP) {
    assert.ok(x >= 0 && x <= vw, `point x=${x} is outside the viewBox`);
    assert.ok(y >= 0 && y <= vh, `point y=${y} is outside the viewBox`);
  }
});

test("DRS zone paths are open runs along the lap", () => {
  for (const z of DRS_ZONES) {
    const d = zonePath(z);
    assert.ok(d.startsWith("M "));
    assert.ok(!d.endsWith("Z"), "a DRS zone is a segment, not a loop");
    assert.ok((d.match(/ L /g)?.length ?? 0) >= 1, "a DRS zone needs at least one segment");
  }
});
