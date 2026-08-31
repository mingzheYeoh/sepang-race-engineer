import { test } from "node:test";
import assert from "node:assert/strict";
import { PLACED_STANDS, STANDS, STANDS_VIEWBOX, recommendStand, standPosition } from "./stands.ts";
import { CORNERS, DRS_ZONES, LAP, VIEWBOX } from "./circuit.ts";
import type { HourPoint } from "./weather.ts";

const conditions = (over: Partial<HourPoint> = {}): HourPoint => ({
  time: "2026-10-04T15:00",
  tempC: 32,
  feelsC: 33,
  rainChance: 10,
  rainMm: 0,
  humidity: 75,
  ...over,
});

test("every stand describes itself in both languages", () => {
  assert.ok(STANDS.length >= 5);
  assert.equal(new Set(STANDS.map((s) => s.id)).size, STANDS.length);
  for (const s of STANDS) {
    assert.ok(s.name.length > 1, `${s.id} has no name`);
    for (const lang of ["en", "zh"] as const) {
      assert.ok(s.view[lang].trim().length > 10, `${s.id} ${lang} view is too thin`);
    }
  }
});

test("stands only claim corners the circuit actually has", () => {
  const numbers = new Set(CORNERS.map((c) => c.n));
  for (const s of STANDS) {
    for (const n of s.corners) {
      assert.ok(numbers.has(n), `${s.id} claims a Turn ${n} that does not exist`);
    }
  }
});

test("exactly one general admission area has cover, which is what the advice turns on", () => {
  const grass = STANDS.filter((s) => s.kind === "grass");
  const covered = grass.filter((s) => s.covered);
  assert.equal(covered.length, 1, "the wet-weather recommendation assumes a single covered bank");
  assert.equal(covered[0].id, "c");
});

test("placed stands sit outside the track but inside the map", () => {
  const [vx, vy, vw, vh] = STANDS_VIEWBOX.split(" ").map(Number);
  assert.ok(PLACED_STANDS.length >= 4, `only ${PLACED_STANDS.length} stands could be placed`);

  for (const s of PLACED_STANDS) {
    const pos = standPosition(s)!;
    assert.ok(pos[0] >= vx && pos[0] <= vx + vw, `${s.id} x=${pos[0]} is off the map`);
    assert.ok(pos[1] >= vy && pos[1] <= vy + vh, `${s.id} y=${pos[1]} is off the map`);

    // A stand must not land on top of the corner it watches, or the marker
    // would sit in the middle of the track.
    for (const n of s.corners) {
      const c = CORNERS.find((x) => x.n === n)!;
      assert.ok(Math.hypot(pos[0] - c.x, pos[1] - c.y) > 40, `${s.id} overlaps Turn ${n}`);
    }
  }
});

test("the Main Grandstand sits outside the pit straight, not in the paddock", () => {
  const main = STANDS.find((s) => s.id === "main")!;
  const pos = standPosition(main)!;
  const pitMid = [(LAP[DRS_ZONES[1][0]][0] + LAP[0][0]) / 2, (LAP[DRS_ZONES[1][0]][1] + LAP[0][1]) / 2];
  const backMid = [
    (LAP[DRS_ZONES[0][0]][0] + LAP[DRS_ZONES[0][1]][0]) / 2,
    (LAP[DRS_ZONES[0][0]][1] + LAP[DRS_ZONES[0][1]][1]) / 2,
  ];
  const toBackFromStand = Math.hypot(pos[0] - backMid[0], pos[1] - backMid[1]);
  const toBackFromPit = Math.hypot(pitMid[0] - backMid[0], pitMid[1] - backMid[1]);
  assert.ok(
    toBackFromStand > toBackFromPit,
    "the grandstand landed between the straights, which is the paddock",
  );
});

test("a stand with no published location is not invented one", () => {
  for (const s of STANDS) {
    if (s.corners.length === 0 && s.id !== "main") {
      assert.equal(standPosition(s), null, `${s.id} was given a position it does not have`);
    }
  }
});

test("wet or brutal conditions send you under the roof", () => {
  assert.equal(recommendStand(conditions({ rainChance: 70 })).stand.id, "c");
  assert.equal(recommendStand(conditions({ rainMm: 3 })).stand.id, "c");
  assert.equal(recommendStand(conditions({ feelsC: 39 })).stand.id, "c");
  assert.ok(recommendStand(conditions({ rainChance: 70 })).stand.covered);
});

test("comfortable conditions send you to the overtaking instead", () => {
  const call = recommendStand(conditions());
  assert.equal(call.stand.id, "k1");
  assert.deepEqual(call.stand.corners, [1, 2]);
});

test("advice still works, and still reads, with no weather at all", () => {
  const call = recommendStand(null);
  assert.ok(call.stand);
  for (const lang of ["en", "zh"] as const) {
    assert.ok(call.reason[lang].length > 20);
    assert.ok(!call.reason[lang].includes("undefined"));
    assert.ok(!call.reason[lang].includes("NaN"));
  }
});

test("the stands frame is wider than the circuit frame, because markers sit outside the track", () => {
  const circuit = VIEWBOX.split(" ").map(Number);
  const stands = STANDS_VIEWBOX.split(" ").map(Number);
  assert.ok(stands[0] < circuit[0] && stands[1] < circuit[1], "the frame must start further out");
  assert.ok(stands[2] > circuit[2] && stands[3] > circuit[3], "the frame must be larger");
});
