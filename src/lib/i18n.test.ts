import { test } from "node:test";
import assert from "node:assert/strict";
import { COPY, fill } from "./copy.ts";
import { CORNERS, SOURCES } from "./circuit.ts";
import { SESSIONS } from "./weekend.ts";
import { OCTOBER_NORMALS } from "./climate.ts";
import { TOPIC_LABELS } from "./radio.ts";
import { LOCALES, isLocale, isTheme, readLocale, readTheme } from "./i18n.ts";

/** Anything shaped like { en, zh } is a translated string and must be complete. */
function walk(node: unknown, path: string, found: string[]) {
  if (node === null || typeof node !== "object") return;
  const obj = node as Record<string, unknown>;
  const keys = Object.keys(obj);
  if (keys.length === 2 && keys.includes("en") && keys.includes("zh")) {
    for (const lang of LOCALES) {
      const v = obj[lang];
      assert.equal(typeof v, "string", `${path}.${lang} is not a string`);
      assert.ok((v as string).trim().length > 0, `${path}.${lang} is empty`);
    }
    // A "translation" identical to the English is almost always a missed one.
    // Proper nouns are the honest exception, so only flag longer strings.
    if ((obj.en as string).length > 25) {
      assert.notEqual(obj.zh, obj.en, `${path} was never actually translated`);
    }
    found.push(path);
    return;
  }
  for (const k of keys) walk(obj[k], `${path}.${k}`, found);
}

test("every translated string exists in both languages", () => {
  const found: string[] = [];
  walk(COPY, "COPY", found);
  walk(SESSIONS, "SESSIONS", found);
  walk(OCTOBER_NORMALS, "OCTOBER_NORMALS", found);
  walk(TOPIC_LABELS, "TOPIC_LABELS", found);
  walk(SOURCES, "SOURCES", found);
  walk(
    CORNERS.map((c) => ({ name: c.name, guide: c.guide, lesson: c.lesson })),
    "CORNERS",
    found,
  );
  // A silent failure here would be the walker matching nothing at all.
  assert.ok(found.length > 120, `only ${found.length} translated strings found`);
});

test("cookie values are validated rather than trusted", () => {
  assert.ok(isLocale("zh"));
  assert.ok(!isLocale("de"));
  assert.ok(!isLocale(undefined));
  assert.equal(readLocale("zh"), "zh");
  assert.equal(readLocale("nonsense"), "en", "an unknown cookie falls back, never throws");
  assert.equal(readLocale(undefined), "en");

  assert.ok(isTheme("light"));
  assert.ok(!isTheme("sepia"));
  assert.equal(readTheme("light"), "light");
  assert.equal(readTheme(undefined), null, "no cookie means follow the device");
  assert.equal(readTheme("nonsense"), null);
});

test("placeholders fill, and unknown ones do not leak", () => {
  assert.equal(fill("a %X% b", { X: 1 }), "a 1 b");
  assert.equal(fill("a %Y% b", { X: 1 }), "a  b");
  assert.equal(fill("no tokens", {}), "no tokens");
});
