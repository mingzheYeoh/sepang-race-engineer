import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sepang Race Engineer",
  description:
    "An unofficial companion for a Sepang Grand Prix weekend: schedule, tropical weather, circuit guide and pit-wall strategy.",
};

export const viewport: Viewport = {
  themeColor: "#05070b",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh antialiased">
        <div className="relative z-10 mx-auto flex min-h-dvh max-w-lg flex-col px-5 pb-10 pt-6">
          {children}
          <footer className="mt-auto pt-10 text-[11px] leading-relaxed text-muted">
            Unofficial fan project. Not affiliated with Formula 1, the FIA, or Sepang
            International Circuit. A 2026 Sepang round is this project&rsquo;s premise, not an
            announcement. Weather by Open-Meteo.
          </footer>
        </div>
      </body>
    </html>
  );
}
