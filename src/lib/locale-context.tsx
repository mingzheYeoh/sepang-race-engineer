"use client";

import { createContext, useContext } from "react";
import { DEFAULT_LOCALE, pick, type L, type Locale } from "./i18n";

const Ctx = createContext<Locale>(DEFAULT_LOCALE);

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return <Ctx.Provider value={locale}>{children}</Ctx.Provider>;
}

export const useLocale = () => useContext(Ctx);

/** `const t = useT()` then `t(COPY.someKey)`. */
export function useT() {
  const locale = useLocale();
  return (s: L) => pick(s, locale);
}
