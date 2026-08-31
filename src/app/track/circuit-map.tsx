"use client";

import { useState } from "react";
import {
  CORNERS,
  DRS_ZONES,
  LAP,
  METRES_PER_UNIT,
  VIEWBOX,
  lapPath,
  zonePath,
  type Corner,
} from "@/lib/circuit";

const D = lapPath();
const ZONES = DRS_ZONES.map(zonePath);
const SCALE_UNITS = 500 / METRES_PER_UNIT; // a 500 m bar

/** Real track width is 16–22 m; at this scale that is about 14 viewBox units. */
const TRACK_W = 16;

const HAND_LABEL = { left: "Left", right: "Right" } as const;
const SPEED_TONE = { slow: "text-wet", medium: "text-text", fast: "text-amber" } as const;

export default function CircuitMap() {
  const [selected, setSelected] = useState<Corner | null>(null);

  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-2xl border border-line bg-surface p-3">
        <svg
          viewBox={VIEWBOX}
          className="h-auto w-full"
          role="img"
          aria-label="Map of Sepang International Circuit drawn from surveyed coordinates, with fifteen numbered corners"
        >
          <path d={D} fill="none" stroke="var(--color-surface-2)" strokeWidth={TRACK_W + 4} strokeLinejoin="round" strokeLinecap="round" />
          <path d={D} fill="none" stroke="var(--color-line)" strokeWidth={TRACK_W} strokeLinejoin="round" strokeLinecap="round" />

          {ZONES.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke="var(--color-amber)"
              strokeWidth={5}
              strokeDasharray="14 10"
              opacity={0.9}
            />
          ))}

          {/* Start/finish, across the track at the surveyed line position. */}
          <circle cx={LAP[0][0]} cy={LAP[0][1]} r={13} fill="none" stroke="var(--color-text)" strokeWidth={4} />
          <text x={LAP[0][0] - 20} y={LAP[0][1] + 34} textAnchor="middle" fill="var(--color-muted)" fontSize={28}>
            S/F
          </text>

          {/* North arrow and scale bar — this is a real map, so it gets real furniture. */}
          <g opacity={0.75}>
            <line x1={930} y1={120} x2={930} y2={70} stroke="var(--color-muted)" strokeWidth={3} />
            <path d="M 930 62 L 924 76 L 936 76 Z" fill="var(--color-muted)" />
            <text x={930} y={146} textAnchor="middle" fill="var(--color-muted)" fontSize={28}>
              N
            </text>
            <line x1={60} y1={800} x2={60 + SCALE_UNITS} y2={800} stroke="var(--color-muted)" strokeWidth={4} />
            <line x1={60} y1={790} x2={60} y2={810} stroke="var(--color-muted)" strokeWidth={4} />
            <line x1={60 + SCALE_UNITS} y1={790} x2={60 + SCALE_UNITS} y2={810} stroke="var(--color-muted)" strokeWidth={4} />
            <text x={60 + SCALE_UNITS / 2} y={782} textAnchor="middle" fill="var(--color-muted)" fontSize={28}>
              500 m
            </text>
          </g>

          {CORNERS.map((c) => {
            const active = selected?.n === c.n;
            return (
              <g
                key={c.n}
                role="button"
                tabIndex={0}
                aria-label={`Turn ${c.n}, ${c.speed} ${c.hand}, ${c.sweepDeg} degrees over ${c.lengthM} metres`}
                aria-pressed={active}
                onClick={() => setSelected(active ? null : c)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelected(active ? null : c);
                  }
                }}
                className="cursor-pointer outline-none"
              >
                <circle cx={c.x} cy={c.y} r={46} fill="transparent" />
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={active ? 34 : 28}
                  fill={active ? "var(--color-amber)" : "var(--color-ink)"}
                  stroke={active ? "var(--color-amber)" : "var(--color-muted)"}
                  strokeWidth={3}
                />
                <text
                  x={c.x}
                  y={c.y + 11}
                  textAnchor="middle"
                  fontSize={30}
                  fontWeight={700}
                  fill={active ? "var(--color-ink)" : "var(--color-text)"}
                >
                  {c.n}
                </text>
              </g>
            );
          })}
        </svg>
        <p className="px-2 pb-1 text-[11px] leading-relaxed text-muted">
          Drawn to scale from surveyed coordinates, north up. Map data &copy;{" "}
          <a
            href="https://www.openstreetmap.org/copyright"
            className="underline decoration-dotted"
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenStreetMap contributors
          </a>
          , ODbL. Corner hands and speeds are computed from that line, not transcribed.
        </p>
      </section>

      {selected ? (
        <CornerCard corner={selected} onClose={() => setSelected(null)} />
      ) : (
        <p className="rounded-2xl border border-dashed border-line p-5 text-sm leading-relaxed text-muted">
          Tap any corner for what happens there &mdash; and the one piece of Formula 1 it
          explains best. Fifteen corners, fifteen ideas, in the order you meet them on a lap.
        </p>
      )}

      <section>
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
          All fifteen
        </h2>
        <ul className="mt-3 flex flex-col gap-1.5">
          {CORNERS.map((c) => (
            <li key={c.n}>
              <button
                onClick={() => setSelected(c)}
                className={`flex w-full items-baseline gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                  selected?.n === c.n ? "border-amber bg-surface" : "border-line"
                }`}
              >
                <span className="tabular w-6 shrink-0 text-sm font-bold text-amber">{c.n}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{c.lesson.title}</span>
                  <span className="tabular block text-xs text-muted">
                    {HAND_LABEL[c.hand]} &middot;{" "}
                    <span className={SPEED_TONE[c.speed]}>{c.speed}</span> &middot; {c.sweepDeg}
                    &deg; over {c.lengthM} m
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function CornerCard({ corner: c, onClose }: { corner: Corner; onClose: () => void }) {
  return (
    <section className="rounded-2xl border border-amber/50 bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber">
            Turn {c.n}
          </p>
          <p className="mt-1 text-sm text-muted">
            {HAND_LABEL[c.hand]} hander &middot;{" "}
            <span className={SPEED_TONE[c.speed]}>{c.speed}</span>
          </p>
        </div>
        <button onClick={onClose} className="px-1 text-sm text-muted" aria-label="Close corner detail">
          ✕
        </button>
      </div>

      {/* Everything here is measured off the survey line. */}
      <dl className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-surface-2 p-3 text-center">
        <div>
          <dt className="text-[10px] uppercase tracking-wider text-muted">Sweep</dt>
          <dd className="tabular text-lg font-bold">{c.sweepDeg}&deg;</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-wider text-muted">Length</dt>
          <dd className="tabular text-lg font-bold">{c.lengthM} m</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-wider text-muted">Run-up</dt>
          <dd className="tabular text-lg font-bold">{c.approachM} m</dd>
        </div>
      </dl>
      <p className="mt-2 text-[11px] text-muted">
        {c.atM} m from the line &middot; {c.degPerM}&deg; of turn per metre
      </p>

      <p className="mt-3 text-sm leading-relaxed">{c.guide}</p>

      <div className="mt-4 rounded-xl bg-surface-2 p-4">
        <p className="text-[10px] uppercase tracking-wider text-muted">Learn this here</p>
        <p className="mt-1 text-base font-bold text-amber">{c.lesson.title}</p>
        <p className="mt-2 text-sm leading-relaxed">{c.lesson.body}</p>
      </div>
    </section>
  );
}
