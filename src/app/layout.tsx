import { Suspense } from "react";
import { cookies } from "next/headers";
import type { Metadata, Viewport } from "next";
import { Chakra_Petch, IBM_Plex_Sans } from "next/font/google";
import BottomBar from "./bottom-bar";
import SettingsBar from "./settings-bar";
import { COPY } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";
import {
  LOCALE_COOKIE,
  THEME_COOKIE,
  htmlLang,
  pick,
  readLocale,
  readTheme,
} from "@/lib/i18n";
import { LocaleProvider } from "@/lib/locale-context";
import { getLocale } from "@/lib/locale-server";
import "./globals.css";

// Self-hosted by next/font, so there is no third-party request and no layout
// shift — both worth having on congested race-day mobile data. Chinese falls
// back to the system CJK stack rather than downloading a second family.
const chakra = Chakra_Petch({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-chakra",
  display: "swap",
});
const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex",
  display: "swap",
});

/**
 * Absolute base for the link preview.
 *
 * Vercel gives the production alias at build time; the fallback keeps `next dev`
 * and `next build` on a laptop from warning about a missing metadataBase.
 */
const SITE = new URL(
  process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000",
);

/** The tab title is part of the translation, so it reads the same cookie. */
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const title = pick(COPY.meta.appTitle, locale);
  const description = pick(COPY.meta.appDescription, locale);
  return {
    metadataBase: SITE,
    title,
    description,
    // The Grid Call can put this URL in a share sheet, so the card it unfurls
    // into is part of the feature. opengraph-image.tsx draws it.
    openGraph: { title, description, type: "website", locale: ogLocale[locale] },
    twitter: { card: "summary_large_image", title, description },
  };
}

const ogLocale: Record<Locale, string> = { en: "en_US", zh: "zh_CN" };

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  const locale = readLocale(jar.get(LOCALE_COOKIE)?.value);
  // No cookie means "follow the device", which the CSS already handles; only an
  // explicit choice gets stamped onto the element.
  const theme = readTheme(jar.get(THEME_COOKIE)?.value);

  return (
    <html lang={htmlLang[locale]} data-theme={theme ?? undefined} className={`${chakra.variable} ${plex.variable}`}>
      <body className="min-h-dvh antialiased">
        <LocaleProvider locale={locale}>
          {/* Bottom padding clears the tab bar plus the home indicator. */}
          <div
            className="relative z-10 mx-auto flex min-h-dvh max-w-lg flex-col px-5 pt-5"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 92px)" }}
          >
            <SettingsBar locale={locale} theme={theme ?? "dark"} />
            {children}
            <footer className="mt-auto pt-10 text-[11px] leading-relaxed text-muted">
              {pick(COPY.disclaimer, locale)}
            </footer>
          </div>

          {/* useSearchParams needs a boundary; the bar must not block first paint. */}
          <Suspense fallback={null}>
            <BottomBar />
          </Suspense>
        </LocaleProvider>
      </body>
    </html>
  );
}
