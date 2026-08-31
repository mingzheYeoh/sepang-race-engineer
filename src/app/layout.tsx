import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { Chakra_Petch, IBM_Plex_Sans } from "next/font/google";
import BottomBar from "./bottom-bar";
import "./globals.css";

// Self-hosted by next/font, so there is no third-party request and no layout
// shift — both worth having on congested race-day mobile data.
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

export const metadata: Metadata = {
  title: "Sepang Race Engineer",
  description:
    "An unofficial companion for a Sepang Grand Prix weekend: schedule, tropical weather, circuit guide and pit-wall strategy.",
};

export const viewport: Viewport = {
  themeColor: "#07090d",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${chakra.variable} ${plex.variable}`}>
      <body className="min-h-dvh antialiased">
        {/* Bottom padding clears the tab bar plus the home indicator. */}
        <div
          className="relative z-10 mx-auto flex min-h-dvh max-w-lg flex-col px-5 pt-7"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 92px)" }}
        >
          {children}
          <footer className="mt-auto pt-10 text-[11px] leading-relaxed text-muted">
            Unofficial fan project. Not affiliated with Formula 1, the FIA, or Sepang
            International Circuit. A 2026 Sepang round is this project&rsquo;s premise, not an
            announcement.
          </footer>
        </div>

        {/* useSearchParams needs a boundary; the bar must not block first paint. */}
        <Suspense fallback={null}>
          <BottomBar />
        </Suspense>
      </body>
    </html>
  );
}
