"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { COPY, fill } from "@/lib/copy";
import { SECTIONS } from "@/lib/sections";
import { useT } from "@/lib/locale-context";

/**
 * The first-run tour.
 *
 * No account is involved. A visitor at the circuit should not have to sign in to
 * be told what a page does, and storing an email to remember one boolean would
 * mean a database, a mail provider and someone's personal data — for a fact the
 * browser can hold itself.
 *
 * The cost of `localStorage` is honest and small: a new device, a private
 * window, or cleared site data shows the tour again. That is the right failure —
 * it errs towards explaining itself, never towards locking anyone out.
 */
export const SEEN = "sre_tour";
/** Bump to show the tour again after the app changes shape. */
const VERSION = "1";

/** Other components ask for the tour by name rather than by importing state. */
export const TOUR_EVENT = "sre:tour";

/**
 * localStorage is an external store, so it is read through the API meant for
 * one. Reading it in an effect and calling setState would work, but it renders
 * twice on every load and the compiler is right to flag it.
 */
function subscribe(onChange: () => void) {
  window.addEventListener(TOUR_EVENT, onChange);
  // Another tab finishing the tour should not leave this one still asking.
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(TOUR_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

const readSeen = () => {
  try {
    return localStorage.getItem(SEEN);
  } catch {
    // Blocked site data means no dismissal can be remembered, and a tour that
    // returns on every load is worse than no tour. Treat it as already seen.
    return VERSION;
  }
};

/** On the server, and before hydration, assume seen so the sheet never flashes. */
const seenOnServer = () => VERSION;

export default function Tour() {
  const t = useT();
  const C = COPY.tour;
  const seen = useSyncExternalStore(subscribe, readSeen, seenOnServer);
  // A URL carrying anything — a shared Grid Call (?p=), a demo time (?t=) — was
  // sent to someone for a reason. Greeting them with a tutorial first answers a
  // question they did not ask; the tour is still one tap away from Home.
  const targeted = useSearchParams().toString() !== "";
  // Replaying is an explicit request, so it overrides both of the above.
  const [forced, setForced] = useState(false);
  // Closing has to work even where the write throws, so the dismissal is held
  // here as well as in the store.
  const [dismissed, setDismissed] = useState(false);
  const [step, setStep] = useState(0);
  const open = forced || (!targeted && !dismissed && seen !== VERSION);

  useEffect(() => {
    const replay = () => {
      setStep(0);
      setDismissed(false);
      setForced(true);
    };
    window.addEventListener(TOUR_EVENT, replay);
    return () => window.removeEventListener(TOUR_EVENT, replay);
  }, []);

  const close = () => {
    setDismissed(true);
    setForced(false);
    try {
      localStorage.setItem(SEEN, VERSION);
    } catch {
      /* not remembering is not a reason to stay open */
    }
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  const steps = [
    { title: C.s1Title, body: C.s1Body },
    { title: C.s2Title, body: null },
    { title: C.s3Title, body: C.s3Body },
    { title: C.s4Title, body: C.s4Body },
  ];
  const last = step === steps.length - 1;
  const current = steps[step];

  return (
    <div className="fixed inset-0 z-[60] flex flex-col justify-end">
      <button aria-label={t(C.skip)} onClick={close} className="absolute inset-0 bg-ink/80 backdrop-blur-sm" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={t(C.s1Title)}
        // The six-item step is taller than a small phone, so the sheet is capped
        // and its body scrolls. Without this the buttons sit below the fold and
        // the tour becomes a thing you cannot finish.
        className="rise relative mx-auto flex max-h-[88dvh] w-full max-w-lg flex-col rounded-t-3xl border-x border-t border-line bg-surface px-5 pt-4"
        style={{ paddingBottom: "calc(max(env(safe-area-inset-bottom), 10px) + 16px)" }}
      >
        <div className="flex items-baseline justify-between gap-3">
          <p className="eyebrow tabular">{fill(t(C.step), { N: step + 1, T: steps.length })}</p>
          <button
            onClick={close}
            className="flex min-h-10 items-center rounded-full px-3 text-xs text-muted transition-colors hover:text-text"
          >
            {t(C.skip)}
          </button>
        </div>

        {/* One segment per step: progress you can count, not a spinner. */}
        <div className="mt-2 flex gap-1.5">
          {steps.map((_, i) => (
            <span
              key={i}
              className={`h-0.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-amber" : "bg-line"}`}
            />
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <h2 className="display mt-4 text-2xl font-bold leading-tight">{t(current.title)}</h2>

          {current.body ? (
            <p className="mt-2.5 text-sm leading-relaxed text-muted">{t(current.body)}</p>
          ) : (
            <ul className="mt-3 flex flex-col gap-2.5">
              {SECTIONS.map((s) => (
                <li key={s.href} className="flex items-baseline gap-3">
                  <span aria-hidden className="w-4 shrink-0 text-sm text-amber">
                    {s.glyph}
                  </span>
                  <span className="min-w-0">
                    <span className="display text-sm font-bold">{t(s.title)}</span>
                    <span className="block text-xs leading-snug text-muted">{t(s.sub)}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-5 flex gap-2">
          {step > 0 && (
            <button
              onClick={() => setStep((n) => n - 1)}
              className="display min-h-12 rounded-xl border border-line px-5 text-sm font-bold text-muted"
            >
              {t(C.back)}
            </button>
          )}
          <button
            onClick={() => (last ? close() : setStep((n) => n + 1))}
            className="display min-h-12 flex-1 rounded-xl bg-amber text-sm font-bold text-ink"
          >
            {last ? t(C.start) : t(C.next)}
          </button>
        </div>
      </div>
    </div>
  );
}
