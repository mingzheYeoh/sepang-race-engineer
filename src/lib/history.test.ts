import { test } from "node:test";
import assert from "node:assert/strict";
import { HISTORY, QUIZ_LENGTH, SEPANG_RACES, buildQuiz } from "./history.ts";

test("the record covers every Malaysian Grand Prix held at Sepang", () => {
  assert.equal(SEPANG_RACES.length, 19);
  assert.equal(HISTORY.firstSeason, 1999);
  assert.equal(HISTORY.lastSeason, 2017);
  // Seasons run forward with no gaps: Sepang hosted every year it was on the calendar.
  SEPANG_RACES.forEach((r, i) => assert.equal(r.season, 1999 + i, `season ${r.season} is out of place`));
});

test("every race carries a usable result", () => {
  for (const r of SEPANG_RACES) {
    assert.ok(r.winner.includes(" "), `${r.season} winner is not a full name`);
    assert.ok(r.constructor.length > 1);
    assert.ok(r.grid >= 1 && r.grid <= 22, `${r.season} grid ${r.grid} is implausible`);
    assert.ok(r.laps > 0 && r.laps <= 56, `${r.season} ran ${r.laps} laps`);
    assert.match(r.date, /^\d{4}-\d{2}-\d{2}$/);
  }
});

test("derived headline figures agree with the underlying results", () => {
  const wins = SEPANG_RACES.filter((r) => r.winner === HISTORY.topDriver[0]).length;
  assert.equal(HISTORY.topDriver[1], wins);
  const teamWins = SEPANG_RACES.filter((r) => r.constructor === HISTORY.topTeam[0]).length;
  assert.equal(HISTORY.topTeam[1], teamWins);
  assert.equal(HISTORY.fromPole, SEPANG_RACES.filter((r) => r.grid === 1).length);
  assert.equal(HISTORY.shortest.laps, Math.min(...SEPANG_RACES.map((r) => r.laps)));
  assert.equal(HISTORY.deepestGrid.grid, Math.max(...SEPANG_RACES.map((r) => r.grid)));
});

test("Sepang's overtaking reputation is in the record, not just the marketing", () => {
  // Fewer than two thirds of wins from pole is what a circuit that actually
  // overtakes looks like; if this ever flips, the copy claiming it is wrong.
  assert.ok(HISTORY.fromPole / HISTORY.races < 0.66, `${HISTORY.fromPole}/${HISTORY.races} from pole`);
});

test("a quiz is well formed and its answers are real", () => {
  for (const seed of [1, 7, 42, 1234, 99999]) {
    const quiz = buildQuiz(seed);
    assert.equal(quiz.length, QUIZ_LENGTH, `seed ${seed} produced ${quiz.length} questions`);
    assert.equal(new Set(quiz.map((q) => q.id)).size, quiz.length, "a question was repeated");

    for (const q of quiz) {
      assert.equal(q.options.length, 4, `${q.id} has ${q.options.length} options`);
      assert.equal(new Set(q.options).size, 4, `${q.id} has a duplicate option`);
      assert.ok(q.answer >= 0 && q.answer < 4, `${q.id} answer index ${q.answer} is out of range`);
      for (const lang of ["en", "zh"] as const) {
        assert.ok(q.prompt[lang].trim().length > 0, `${q.id} ${lang} prompt is empty`);
        assert.ok(q.note[lang].trim().length > 0, `${q.id} ${lang} note is empty`);
        assert.ok(!q.note[lang].includes("undefined"), `${q.id} ${lang} note leaked undefined`);
      }
    }
  }
});

test("quiz answers are the ones the results actually support", () => {
  const quiz = buildQuiz(2026, 6);
  for (const q of quiz) {
    const chosen = q.options[q.answer];
    const [kind, season] = q.id.split("-");
    const race = SEPANG_RACES.find((r) => String(r.season) === season);
    if (kind === "winner") assert.equal(chosen, race!.winner);
    if (kind === "team") assert.equal(chosen, race!.constructor);
    if (kind === "grid") assert.equal(chosen, `P${race!.grid}`);
    if (q.id === "shortest") assert.equal(chosen, String(HISTORY.shortest.laps));
    if (q.id === "most") assert.equal(chosen, HISTORY.topDriver[0]);
  }
});

test("the same seed always builds the same quiz, and different seeds differ", () => {
  assert.deepEqual(buildQuiz(5), buildQuiz(5));
  const a = buildQuiz(5).map((q) => q.id).join();
  const b = buildQuiz(6).map((q) => q.id).join();
  assert.notEqual(a, b, "two seeds produced an identical quiz");
});
