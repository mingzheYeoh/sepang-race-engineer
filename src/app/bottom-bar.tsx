"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import TeamRadio from "./team-radio";

const LINKS = [
  { href: "/", label: "Paddock", glyph: "▣" },
  { href: "/track", label: "Circuit", glyph: "◎" },
  { href: "/pitwall", label: "Pit Wall", glyph: "◈" },
];

/**
 * One bar at the bottom of the screen holding navigation and the radio.
 *
 * A phone is held one-handed at a circuit, so the controls live where the thumb
 * already is. It also settles a collision: a floating radio button and a nav bar
 * were fighting for the same corner, so the radio became a third tab instead.
 */
export default function BottomBar() {
  const [radioOpen, setRadioOpen] = useState(false);
  const path = usePathname();

  return (
    <>
      <TeamRadio open={radioOpen} onClose={() => setRadioOpen(false)} />

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/95 backdrop-blur-md"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-label="Main"
      >
        <div className="mx-auto flex max-w-lg">
          {LINKS.map((l) => {
            const active = path === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex flex-1 flex-col items-center gap-1 py-3 transition-colors ${
                  active ? "text-amber" : "text-muted"
                }`}
              >
                {active && (
                  <span className="absolute inset-x-6 top-0 h-0.5 rounded-full bg-amber" />
                )}
                <span aria-hidden className="text-base leading-none">
                  {l.glyph}
                </span>
                <span className="eyebrow" style={{ color: "inherit" }}>
                  {l.label}
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
            {radioOpen && <span className="absolute inset-x-6 top-0 h-0.5 rounded-full bg-amber" />}
            <span aria-hidden className="text-base leading-none">
              ⣿
            </span>
            <span className="eyebrow" style={{ color: "inherit" }}>
              Radio
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
