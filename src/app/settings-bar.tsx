"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  LOCALES,
  LOCALE_COOKIE,
  THEME_COOKIE,
  htmlLang,
  type Locale,
  type Theme,
} from "@/lib/i18n";

const YEAR = 60 * 60 * 24 * 365;
const setCookie = (name: string, value: string) => {
  document.cookie = `${name}=${value}; path=/; max-age=${YEAR}; samesite=lax`;
};

const LOCALE_LABEL: Record<Locale, string> = { en: "EN", zh: "中" };

export default function SettingsBar({ locale, theme }: { locale: Locale; theme: Theme }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function chooseLocale(next: Locale) {
    if (next === locale) return;
    setCookie(LOCALE_COOKIE, next);
    // The lang attribute drives CJK typography rules, so move it now rather than
    // waiting for the server round-trip.
    document.documentElement.lang = htmlLang[next];
    startTransition(() => router.refresh());
  }

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setCookie(THEME_COOKIE, next);
    // Paint immediately; the refresh only keeps the server in step for later
    // navigations, and waiting for it would make the tap feel broken.
    document.documentElement.dataset.theme = next;
    startTransition(() => router.refresh());
  }

  return (
    <div
      className={`flex items-center gap-2 transition-opacity ${pending ? "opacity-60" : ""}`}
    >
      <div
        className="flex overflow-hidden rounded-full border border-line"
        role="group"
        aria-label="Language / 语言"
      >
        {LOCALES.map((l) => (
          <button
            key={l}
            onClick={() => chooseLocale(l)}
            aria-pressed={locale === l}
            lang={htmlLang[l]}
            className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
              locale === l ? "bg-amber text-ink" : "text-muted"
            }`}
          >
            {LOCALE_LABEL[l]}
          </button>
        ))}
      </div>

      <button
        onClick={toggleTheme}
        aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
        className="flex size-8 items-center justify-center rounded-full border border-line text-sm text-muted"
      >
        <span aria-hidden>{theme === "dark" ? "☀" : "☾"}</span>
      </button>
    </div>
  );
}
