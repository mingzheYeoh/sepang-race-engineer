import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { SECTIONS } from "./sections.ts";
import { COPY } from "./copy.ts";

test("every section the tour teaches is a route that exists", () => {
  // The tour and the landing page both read this list, so a renamed or deleted
  // route would otherwise become a dead link that also teaches a lie.
  for (const s of SECTIONS) {
    const dir = new URL(`../app${s.href}/page.tsx`, import.meta.url);
    assert.ok(existsSync(dir), `${s.href} has no page.tsx`);
  }
});

test("the tour describes the whole app, in both languages", () => {
  assert.ok(SECTIONS.length >= 6, `only ${SECTIONS.length} sections`);
  assert.equal(new Set(SECTIONS.map((s) => s.href)).size, SECTIONS.length);
  for (const s of SECTIONS) {
    for (const lang of ["en", "zh"] as const) {
      assert.ok(s.title[lang].trim().length > 0, `${s.href} has no ${lang} title`);
      assert.ok(s.sub[lang].trim().length > 10, `${s.href} ${lang} description is too thin`);
    }
  }
});

test("the tour's step count matches the copy it has to fill", () => {
  // Four steps are rendered; step two draws SECTIONS instead of a body.
  const bodies = [COPY.tour.s1Body, COPY.tour.s3Body, COPY.tour.s4Body];
  for (const b of bodies) {
    for (const lang of ["en", "zh"] as const) assert.ok(b[lang].length > 40);
  }
  for (const lang of ["en", "zh"] as const) {
    assert.match(COPY.tour.step[lang], /%N%/, "the step counter must interpolate");
    assert.match(COPY.tour.step[lang], /%T%/);
  }
});
