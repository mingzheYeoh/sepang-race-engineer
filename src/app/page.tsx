import Link from "next/link";
import ReplayTour from "./replay-tour";
import { DRS_ZONES, LAP, VIEWBOX, lapPath, zonePath } from "@/lib/circuit";
import { CIRCUIT } from "@/lib/weekend";
import { COPY } from "@/lib/copy";
import { pick, type L } from "@/lib/i18n";
import { SECTIONS } from "@/lib/sections";
import { getLocale } from "@/lib/locale-server";

/**
 * The front door.
 *
 * The Paddock used to sit here, which meant the first thing a visitor met was a
 * countdown to a session they had no context for. This page answers "what is
 * this and what can I do here" first, and hands off to the six tools; the
 * Paddock is now one of them rather than the lobby.
 *
 * The hero is the same surveyed polyline the rest of the app draws, so there is
 * no logo or borrowed imagery anywhere on the entry page.
 */
export default async function Home() {
  const locale = await getLocale();
  const t = (s: L) => pick(s, locale);
  const C = COPY.home;

  return (
    <main className="flex flex-col gap-8">
      <header className="relative">
        {/* Sized by aspect ratio rather than a fixed height, so the hero scales
            with the phone instead of eating a third of a small screen. */}
        <div className="relative -mx-5 aspect-[1000/620] overflow-hidden">
          <svg
            viewBox={VIEWBOX}
            className="absolute inset-0 size-full opacity-60"
            aria-hidden
            preserveAspectRatio="xMidYMid slice"
          >
            <path d={lapPath()} fill="none" stroke="var(--color-track-edge)" strokeWidth={22} strokeLinejoin="round" />
            <path d={lapPath()} fill="none" stroke="var(--color-track)" strokeWidth={14} strokeLinejoin="round" />
            {DRS_ZONES.map((z, i) => (
              <path key={i} d={zonePath(z)} fill="none" stroke="var(--color-drs)" strokeWidth={14} opacity={0.75} />
            ))}
            <circle cx={LAP[0][0]} cy={LAP[0][1]} r={14} fill="none" stroke="var(--color-track-mark)" strokeWidth={5} />
          </svg>
          {/* Fades the drawing into the page so the type below stays readable. */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, transparent 30%, var(--color-ink) 96%)" }}
          />
        </div>

        <div className="-mt-10 relative">
          <p className="eyebrow" style={{ color: "var(--color-amber)" }}>
            {t(COPY.paddock.dates)}
          </p>
          <h1 className="display mt-1.5 text-[3.5rem] font-bold leading-[0.85] tracking-tight">
            SEPANG
          </h1>
          <p className="display mt-1 text-xl font-bold leading-tight text-muted">
            {t(COPY.meta.appTitle)}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">{t(C.lede)}</p>
          <p className="tabular mt-3 text-xs text-muted">
            {CIRCUIT.lengthKm} km &middot; {CIRCUIT.corners} {t(C.cornersWord)} &middot;{" "}
            {CIRCUIT.laps} {t(COPY.paddock.laps)}
          </p>
        </div>

        <Link
          href="/paddock"
          className="display mt-5 flex items-center justify-center gap-2 rounded-2xl bg-amber py-3.5 text-sm font-bold text-ink"
        >
          {t(C.enter)} <span aria-hidden>→</span>
        </Link>
      </header>

      <section>
        <p className="eyebrow">{t(C.sectionsTitle)}</p>
        <div className="rule mt-2" />
        <ul className="mt-3 flex flex-col gap-2">
          {SECTIONS.map((s) => (
            <li key={s.href}>
              <Link
                href={s.href}
                className="flex items-center gap-3.5 rounded-2xl border border-line bg-surface px-4 py-3.5 transition-colors hover:border-amber/60"
              >
                <span aria-hidden className="text-lg leading-none text-amber">
                  {s.glyph}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="display block text-sm font-bold">{t(s.title)}</span>
                  <span className="mt-0.5 block text-xs leading-snug text-muted">{t(s.sub)}</span>
                </span>
                <span aria-hidden className="shrink-0 text-sm text-muted">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-2">
          <ReplayTour />
        </div>
      </section>
    </main>
  );
}
