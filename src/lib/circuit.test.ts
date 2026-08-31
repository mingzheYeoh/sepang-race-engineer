import { test } from "node:test";
import assert from "node:assert/strict";
import { CORNERS, LAP_POINTS, lapPath } from "./circuit.ts";

test("fifteen corners, numbered in lap order", () => {
  assert.equal(CORNERS.length, 15);
  CORNERS.forEach((c, i) => assert.equal(c.n, i + 1));
});

test("every corner teaches something and explains itself", () => {
  for (const c of CORNERS) {
    assert.ok(c.guide.length > 40, `Turn ${c.n} guide is too thin`);
    assert.ok(c.lesson.title.trim().length > 0, `Turn ${c.n} lesson has no title`);
    assert.ok(c.lesson.body.length > 60, `Turn ${c.n} lesson is too thin`);
  }
  const titles = new Set(CORNERS.map((c) => c.lesson.title));
  assert.equal(titles.size, 15, "each corner must teach a different idea");
});

test("every corner sits on the drawn lap", () => {
  const onLap = new Set(LAP_POINTS.map(([x, y]) => `${x},${y}`));
  for (const c of CORNERS) {
    assert.ok(onLap.has(`${c.x},${c.y}`), `Turn ${c.n} marker is off the track line`);
  }
});

test("the lap is a closed path through every waypoint", () => {
  const d = lapPath();
  assert.ok(d.startsWith(`M ${LAP_POINTS[0][0]} ${LAP_POINTS[0][1]}`));
  assert.match(d, / Z$/);
  // One cubic segment per waypoint closes the loop back to the start.
  assert.equal(d.match(/ C /g)?.length, LAP_POINTS.length);
  for (const [x, y] of LAP_POINTS) {
    assert.ok(d.includes(`, ${x} ${y}`), `path never reaches waypoint ${x},${y}`);
  }
});

test("the spline stays inside the viewBox", () => {
  const nums = lapPath()
    .match(/-?\d+(\.\d+)?/g)!
    .map(Number);
  assert.ok(Math.min(...nums) >= 0, "path leaks off the left/top edge");
  assert.ok(Math.max(...nums) <= 560, "path leaks off the right/bottom edge");
});

test("a straight run of waypoints stays straight", () => {
  const d = lapPath([
    [0, 0],
    [0, 50],
    [0, 100],
    [50, 100],
  ]);
  // Control points on the vertical run must keep x at 0.
  assert.match(d, /C 0 /);
});
