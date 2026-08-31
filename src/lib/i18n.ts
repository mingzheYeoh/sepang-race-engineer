/**
 * Two languages and two themes, both decided on the server.
 *
 * The choice lives in a cookie rather than in state, so the very first HTML the
 * browser receives is already in the right language and the right theme. Reading
 * it from localStorage in an effect would render dark English first and then
 * correct itself, which is a visible flash on every page load.
 */

export const LOCALES = ["en", "zh"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const THEMES = ["dark", "light"] as const;
export type Theme = (typeof THEMES)[number];

export const LOCALE_COOKIE = "sre_lang";
export const THEME_COOKIE = "sre_theme";

/** A string that exists in both languages. */
export type L = { en: string; zh: string };

export const isLocale = (v: unknown): v is Locale =>
  typeof v === "string" && (LOCALES as readonly string[]).includes(v);

export const isTheme = (v: unknown): v is Theme =>
  typeof v === "string" && (THEMES as readonly string[]).includes(v);

/** Resolve a cookie value to a locale, falling back rather than throwing. */
export function readLocale(v: string | undefined): Locale {
  return isLocale(v) ? v : DEFAULT_LOCALE;
}

/** No theme cookie means "follow the device", which the CSS handles on its own. */
export function readTheme(v: string | undefined): Theme | null {
  return isTheme(v) ? v : null;
}

export const pick = (s: L, locale: Locale): string => s[locale];

/** `<html lang>` needs the full tag, not the short code. */
export const htmlLang: Record<Locale, string> = { en: "en", zh: "zh-Hans" };

/**
 * The page ground per theme, duplicated out of globals.css because the
 * `theme-color` meta tag has to be a literal — a CSS variable means nothing to
 * the Android address bar or an iOS status bar. `i18n.test.ts` reads the
 * stylesheet and fails if these two copies ever disagree.
 */
export const THEME_INK: Record<Theme, string> = { dark: "#07090d", light: "#f5f2ea" };
