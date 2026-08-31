import { cookies } from "next/headers";
import { LOCALE_COOKIE, readLocale, type Locale } from "./i18n";

/** The locale for a server component, read from the same cookie the layout uses. */
export async function getLocale(): Promise<Locale> {
  return readLocale((await cookies()).get(LOCALE_COOKIE)?.value);
}
