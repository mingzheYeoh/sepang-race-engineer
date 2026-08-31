"use client";

import { useState } from "react";
import { CORNERS, DRS_ZONES, LAP_POINTS, VIEWBOX, lapPath, type Corner } from "@/lib/circuit";

const D = lapPath();

const HAND_LABEL = { left: "Left", right: "Right" } as const;
const SPEED_TONE = {
  slow: "text-wet",
  medium: "text-text",
  fast: "text-amber",
} as const;

export default function CircuitMap() {
  const [selected, setSelected] = useState<Corner | null>(null);

  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-2xl border border-line bg-surface p-3">
        <svg
          viewBox={VIEWBOX}
          className="h-auto w-full"
          role="img"
          aria-label="Schematic map of Sepang International Circuit with fifteen numbered corners"
        >
          {/* Track surface: a wide dark stroke with a thin centre line. */}
          <path d={D} fill="none" stroke="var(--color-surface-2)" strokeWidth={16} strokeLinejoin="round" />
          <path d={D} fill="none" stroke="var(--color-line)" strokeWidth={13} strokeLinejoin="round" />

          {/* DRS zones sit on top of the straights they belong to. */}
          {DRS_ZONES.map(([a, b], i) => (
            <line
              key={i}
              x1={LAP_POINTS[a][0]}
              y1={LAP_POINTS[a][1]}
              x2={LAP_POINTS[b][0]}
              y2={LAP_POINTS[b][1]}
              stroke="var(--color-amber)"
              strokeWidth={4}
              strokeDasharray="7 5"
              opacity={0.85}
            />
          ))}

          {/* Start/finish line. */}
          <line x1={45} y1={432} x2={65} y2={432} stroke="var(--color-text)" strokeWidth={3} />
          <text x={42} y={428} textAnchor="end" fill="var(--color-muted)" fontSize={11}>
            S/F
          </text>
          <text x={152} y={400} fill="var(--color-amber)" fontSize={11} opacity={0.9}>
            DRS
          </text>
          <text x={42} y={398} textAnchor="end" fill="var(--color-amber)" fontSize={11} opacity={0.9}>
            DRS
          </text>

          {CORNERS.map((c) => {
            const active = selected?.n === c.n;
            return (
              <g
                key={c.n}
                role="button"
                tabIndex={0}
                aria-label={`Turn ${c.n}${c.name ? `, ${c.name}` : ""}, ${c.speed} ${c.hand}`}
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
                {/* Generous invisible hit area — thumbs, not cursors. */}
                <circle cx={c.x} cy={c.y} r={19} fill="transparent" />
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={active ? 13 : 11}
                  fill={active ? "var(--color-amber)" : "var(--color-ink)"}
                  stroke={active ? "var(--color-amber)" : "var(--color-muted)"}
                  strokeWidth={2}
                />
                <text
                  x={c.x}
                  y={c.y + 4}
                  textAnchor="middle"
                  fontSize={11}
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
          Schematic, not to scale. Corner sequence, hands and speeds are accurate; the
          geometry is drawn for this project, not traced from an official map.
        </p>
      </section>

      {selected ? (
        <CornerCard corner={selected} onClose={() => setSelected(null)} />
      ) : (
        <p className="rounded-2xl border border-dashed border-line p-5 text-sm leading-relaxed text-muted">
          Tap any corner to see what happens there &mdash; and the one piece of Formula 1 it
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
                  <span className="block truncate text-sm font-semibold">
                    {c.name ?? c.lesson.title}
                  </span>
                  <span className="block text-xs text-muted">
                    {HAND_LABEL[c.hand]} &middot;{" "}
                    <span className={SPEED_TONE[c.speed]}>{c.speed}</span>
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

function CornerCard({ corner, onClose }: { corner: Corner; onClose: () => void }) {
  return (
    <section className="rounded-2xl border border-amber/50 bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber">
            Turn {corner.n}
            {corner.name && ` · ${corner.name}`}
          </p>
          <p className="mt-1 text-sm text-muted">
            {HAND_LABEL[corner.hand]} hander &middot;{" "}
            <span className={SPEED_TONE[corner.speed]}>{corner.speed}</span>
          </p>
        </div>
        <button onClick={onClose} className="px-1 text-sm text-muted" aria-label="Close corner detail">
          ✕
        </button>
      </div>

      <p className="mt-3 text-sm leading-relaxed">{corner.guide}</p>

      <div className="mt-4 rounded-xl bg-surface-2 p-4">
        <p className="text-[10px] uppercase tracking-wider text-muted">Learn this here</p>
        <p className="mt-1 text-base font-bold text-amber">{corner.lesson.title}</p>
        <p className="mt-2 text-sm leading-relaxed">{corner.lesson.body}</p>
      </div>
    </section>
  );
}
