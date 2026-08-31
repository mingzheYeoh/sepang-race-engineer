"use client";

import { useState } from "react";
import { DRS_ZONES, LAP, lapPath, zonePath } from "@/lib/circuit";
import { STANDS, STANDS_VIEWBOX, recommendStand, standPosition, type Stand } from "@/lib/stands";
import type { HourPoint } from "@/lib/weather";
import { COPY, fill } from "@/lib/copy";
import { useT } from "@/lib/locale-context";

const D = lapPath();
const ZONES = DRS_ZONES.map(zonePath);
const TRACK_W = 16;

/** Short label for a marker: "MGS", "K1", "F", "C", "B". */
const short = (s: Stand) =>
  s.name.startsWith("Main") ? "MGS" : s.name.split(" ")[0].replace("Hillstand", "");

export default function StandPicker({ live }: { live: HourPoint | null }) {
  const t = useT();
  const C = COPY.visit;
  const call = recommendStand(live);
  const [openId, setOpenId] = useState<string | null>(call.stand.id);

  const kindLabel = (s: Stand) =>
    s.kind === "seated" ? t(C.seated) : s.covered ? t(C.grassCovered) : t(C.grassOpen);

  return (
    <div className="flex flex-col gap-6">
      {/* The whole app's thesis landing on one decision. */}
      <section className="rounded-2xl border border-amber/40 bg-surface p-5">
        <p className="eyebrow" style={{ color: "var(--color-amber)" }}>
          {t(C.callTitle)}
        </p>
        <p className="display mt-2 text-2xl font-bold leading-tight">{call.stand.name}</p>
        <p className="mt-1 text-xs text-muted">{kindLabel(call.stand)}</p>
        <p className="mt-3 text-sm leading-relaxed">{t(call.reason)}</p>
      </section>

      <section>
        <p className="eyebrow">{t(C.mapTitle)}</p>
        <div className="rule mt-2" />
        <div className="-mx-5 mt-2 border-y border-line bg-surface/60 px-1 py-2">
          <svg viewBox={STANDS_VIEWBOX} className="h-auto w-full" role="img" aria-label={t(C.mapTitle)}>
            <path d={D} fill="none" stroke="var(--color-track-edge)" strokeWidth={TRACK_W + 5} strokeLinejoin="round" strokeLinecap="round" />
            <path d={D} fill="none" stroke="var(--color-track)" strokeWidth={TRACK_W} strokeLinejoin="round" strokeLinecap="round" />
            {ZONES.map((d, i) => (
              <path key={i} d={d} fill="none" stroke="var(--color-drs)" strokeWidth={4} strokeDasharray="16 11" opacity={0.5} />
            ))}
            <circle cx={LAP[0][0]} cy={LAP[0][1]} r={12} fill="none" stroke="var(--color-track-mark)" strokeWidth={4} />

            {STANDS.map((s) => {
              const pos = standPosition(s);
              if (!pos) return null;
              const active = openId === s.id;
              return (
                <g
                  key={s.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`${s.name}, ${kindLabel(s)}`}
                  aria-pressed={active}
                  onClick={() => setOpenId(active ? null : s.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setOpenId(active ? null : s.id);
                    }
                  }}
                  className="cursor-pointer outline-none"
                >
                  <circle cx={pos[0]} cy={pos[1]} r={46} fill="transparent" />
                  {/* A roof is the thing that matters here, so it is the thing the
                      shape encodes: square for covered, open ring for not. */}
                  {s.covered ? (
                    <rect
                      x={pos[0] - 30}
                      y={pos[1] - 22}
                      width={60}
                      height={44}
                      rx={10}
                      fill={active ? "var(--color-amber)" : "var(--color-ink)"}
                      stroke={active ? "var(--color-amber)" : "var(--color-muted)"}
                      strokeWidth={3}
                    />
                  ) : (
                    <rect
                      x={pos[0] - 30}
                      y={pos[1] - 22}
                      width={60}
                      height={44}
                      rx={10}
                      fill="none"
                      stroke={active ? "var(--color-amber)" : "var(--color-muted)"}
                      strokeWidth={3}
                      strokeDasharray="7 5"
                    />
                  )}
                  <text
                    x={pos[0]}
                    y={pos[1] + 9}
                    textAnchor="middle"
                    fontSize={26}
                    fontWeight={700}
                    fill={active && s.covered ? "var(--color-ink)" : "var(--color-text)"}
                  >
                    {short(s)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-muted">{t(C.mapNote)}</p>
      </section>

      <section>
        <p className="eyebrow">{t(C.standsTitle)}</p>
        <div className="rule mt-2" />
        <ul className="mt-3 flex flex-col gap-2">
          {STANDS.map((s) => {
            const open = openId === s.id;
            return (
              <li key={s.id}>
                <button
                  onClick={() => setOpenId(open ? null : s.id)}
                  aria-expanded={open}
                  className={`w-full rounded-2xl border px-4 py-3 text-left transition-colors ${
                    open ? "border-amber bg-surface" : "border-line"
                  }`}
                >
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="display text-sm font-bold">{s.name}</span>
                    <span className={`shrink-0 text-[11px] ${s.covered ? "text-amber" : "text-muted"}`}>
                      {s.covered ? "▣" : "▢"}
                    </span>
                  </span>
                  <span className="mt-0.5 flex flex-wrap items-baseline gap-x-2 text-xs text-muted">
                    <span>{kindLabel(s)}</span>
                    {s.corners.length > 0 && (
                      <span className="tabular">
                        &middot; {fill(t(C.watches), { T: s.corners.join("–") })}
                      </span>
                    )}
                    {s.localsOnly && <span className="text-wet">&middot; {t(C.localsOnly)}</span>}
                  </span>
                  {open && (
                    <span className="rise mt-2.5 block text-sm leading-relaxed text-text">
                      {t(s.view)}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-[11px] leading-relaxed text-muted">{t(C.ticketsNote)}</p>
        <a
          href="https://www.bahraingp.com/blog/events/ticket-information/"
          target="_blank"
          rel="noopener noreferrer"
          className="display mt-2 inline-block rounded-xl border border-line px-4 py-2.5 text-xs font-bold text-muted"
        >
          {t(C.officialTickets)} ↗
        </a>
      </section>
    </div>
  );
}
