"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLinkStatus } from "next/link";
import TeamRadio from "./team-radio";
import { COPY } from "@/lib/copy";
import { useT } from "@/lib/locale-context";
import type { L } from "@/lib/i18n";

const LINKS: { href: string; label: L; glyph: string }[] = [
  { href: "/", label: COPY.nav.home, glyph: "⌂" },
  { href: "/track", label: COPY.nav.circuit, glyph: "◎" },
  { href: "/pitwall", label: COPY.nav.pitwall, glyph: "◈" },
];

/**
 * Confirms the tap while the server is still answering.
 *
 * Every route is dynamic, so a cold tab press waits on a round trip. Prefetch
 * plus the loading boundary usually beat this to the punch — Next skips the
 * pending state entirely for a route it has already fetched — which leaves this
 * showing only on the first tap, or on a connection that deserves an
 * explanation. It fades an always-present element rather than inserting one, so
 * nothing in the bar moves.
 */
function TabPending() {
  const { pending } = useLinkStatus();
  return (
    <span
      aria-hidden
      className={`absolute inset-x-5 top-0 h-0.5 rounded-full bg-amber transition-opacity duration-150 ${
        pending ? "animate-pulse opacity-100" : "opacity-0"
      }`}
    />
  );
}

/**
 * One bar at the bottom of the screen holding navigation and the radio.
 *
 * A phone is held one-handed at a circuit, so the controls live where the thumb
 * already is. It also settles a collision: a floating radio button and a nav bar
 * were fighting for the same corner, so the radio became a fourth tab instead.
 */
export default function BottomBar() {
  const [radioOpen, setRadioOpen] = useState(false);
  const path = usePathname();
  const t = useT();

  return (
    <>
      <TeamRadio open={radioOpen} onClose={() => setRadioOpen(false)} />

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/95 backdrop-blur-md"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 10px)" }}
        aria-label="Main"
      >
        <div className="mx-auto flex max-w-lg">
          {LINKS.map((l) => {
            const active = path === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                // The four tabs are the app's spine and are mounted on every
                // page, so their payloads are worth holding. `auto` would fetch
                // only as far as the loading boundary; these go all the way.
                prefetch
                aria-current={active ? "page" : undefined}
                className={`relative flex flex-1 flex-col items-center gap-1 py-3 transition-colors ${
                  active ? "text-amber" : "text-muted"
                }`}
              >
                {active ? (
                  <span className="absolute inset-x-5 top-0 h-0.5 rounded-full bg-amber" />
                ) : (
                  <TabPending />
                )}
                <span aria-hidden className="text-base leading-none">
                  {l.glyph}
                </span>
                <span className="eyebrow" style={{ color: "inherit" }}>
                  {t(l.label)}
                </span>
              </Link>
            );
          })}

          <button
            onClick={() => setRadioOpen(true)}
            aria-expanded={radioOpen}
            className={`relative flex flex-1 flex-col items-center gap-1 py-3 transition-colors ${
              radioOpen ? "text-amber" : "text-muted"
            }`}
          >
            {radioOpen && <span className="absolute inset-x-5 top-0 h-0.5 rounded-full bg-amber" />}
            <span aria-hidden className="text-base leading-none">
              ⣿
            </span>
            <span className="eyebrow" style={{ color: "inherit" }}>
              {t(COPY.nav.radio)}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
