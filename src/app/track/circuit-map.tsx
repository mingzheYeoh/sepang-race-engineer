"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CORNERS,
  DRS_ZONES,
  LAP,
  LAP_METRES,
  METRES_PER_UNIT,
  SOURCES,
  VIEWBOX,
  lapPath,
  zonePath,
  type Corner,
} from "@/lib/circuit";
import { COPY, fill } from "@/lib/copy";
import { useLocale, useT } from "@/lib/locale-context";

const D = lapPath();
const ZONES = DRS_ZONES.map(zonePath);
const SCALE_UNITS = 500 / METRES_PER_UNIT;
/** Real track width is 16–22 m; at this scale that is about 16 viewBox units. */
const TRACK_W = 16;

export default function CircuitMap() {
  const t = useT();
  const locale = useLocale();
  const zh = locale === "zh";
  const C = COPY.track;

  const [n, setN] = useState<number | null>(null);
  const selected = n === null ? null : CORNERS[n - 1];
  const cardRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  const HAND = { left: t(C.left), right: t(C.right) } as const;
  const HAND_FULL = { left: t(C.leftHander), right: t(C.rightHander) } as const;
  const SPEED = { slow: t(C.slow), medium: t(C.medium), fast: t(C.fast) } as const;
  const TONE = { slow: "text-wet", medium: "text-text", fast: "text-amber" } as const;
  const turnLabel = (i: number) => fill(t(C.turnLabel), { N: i });

  // Selecting from the map must bring the detail into view, or on a phone the
  // answer lands below the fold and the tap looks like it did nothing.
  const choose = useCallback((next: number | null, scroll: boolean) => {
    setN(next);
    if (next !== null && scroll) {
      requestAnimationFrame(() =>
        cardRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }),
      );
    }
  }, []);

  // Keep the chip rail tracking whichever corner is open.
  useEffect(() => {
    if (n === null) return;
    railRef.current
      ?.querySelector(`[data-chip="${n}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [n]);

  const step = (by: number) => choose((((n ?? 1) - 1 + by + 15) % 15) + 1, false);

  return (
    <div className="flex flex-col gap-4">
      {/* Full-bleed: the map is the point of this page, so it gets the whole width. */}
      <section className="-mx-5 border-y border-line bg-surface/60 px-1 py-2">
        <svg viewBox={VIEWBOX} className="h-auto w-full" role="img" aria-label={t(C.mapAlt)}>
          <path d={D} fill="none" stroke="var(--color-track-edge)" strokeWidth={TRACK_W + 5} strokeLinejoin="round" strokeLinecap="round" />
          <path d={D} fill="none" stroke="var(--color-track)" strokeWidth={TRACK_W} strokeLinejoin="round" strokeLinecap="round" />

          {ZONES.map((d, i) => (
            <path key={i} d={d} fill="none" stroke="var(--color-amber)" strokeWidth={5} strokeDasharray="16 11" opacity={0.9} />
          ))}

          <circle cx={LAP[0][0]} cy={LAP[0][1]} r={14} fill="none" stroke="var(--color-text)" strokeWidth={4} />
          <text x={LAP[0][0] - 4} y={LAP[0][1] + 46} textAnchor="middle" fill="var(--color-muted)" fontSize={28}>
            S/F
          </text>

          <g opacity={0.7}>
            <line x1={935} y1={122} x2={935} y2={72} stroke="var(--color-muted)" strokeWidth={3} />
            <path d="M 935 62 L 928 78 L 942 78 Z" fill="var(--color-muted)" />
            <text x={935} y={150} textAnchor="middle" fill="var(--color-muted)" fontSize={28}>
              {zh ? "北" : "N"}
            </text>
            <line x1={60} y1={802} x2={60 + SCALE_UNITS} y2={802} stroke="var(--color-muted)" strokeWidth={4} />
            <line x1={60} y1={792} x2={60} y2={812} stroke="var(--color-muted)" strokeWidth={4} />
            <line x1={60 + SCALE_UNITS} y1={792} x2={60 + SCALE_UNITS} y2={812} stroke="var(--color-muted)" strokeWidth={4} />
            <text x={60 + SCALE_UNITS / 2} y={784} textAnchor="middle" fill="var(--color-muted)" fontSize={28}>
              500 m
            </text>
          </g>

          {CORNERS.map((c) => {
            const active = n === c.n;
            return (
              <g
                key={c.n}
                role="button"
                tabIndex={0}
                aria-label={`${turnLabel(c.n)}${c.name ? `, ${t(c.name)}` : ""}, ${SPEED[c.speed]} ${HAND_FULL[c.hand]}`}
                aria-pressed={active}
                onClick={() => choose(active ? null : c.n, true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    choose(active ? null : c.n, true);
                  }
                }}
                className="cursor-pointer outline-none"
              >
                <circle cx={c.x} cy={c.y} r={46} fill="transparent" />
                {active && <circle cx={c.x} cy={c.y} r={44} fill="var(--color-amber)" opacity={0.16} />}
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
      </section>

      {/* Walk the lap without hunting for small targets on the map. */}
      <div ref={railRef} className="rail -mx-5 flex gap-2 overflow-x-auto px-5" role="tablist" aria-label={t(C.cornersLabel)}>
        {CORNERS.map((c) => (
          <button
            key={c.n}
            data-chip={c.n}
            role="tab"
            aria-selected={n === c.n}
            onClick={() => choose(n === c.n ? null : c.n, true)}
            className={`tabular size-11 shrink-0 rounded-xl border text-sm font-bold transition-colors ${
              n === c.n ? "border-amber bg-amber text-ink" : "border-line text-muted"
            }`}
            style={{ scrollSnapAlign: "center" }}
          >
            {c.n}
          </button>
        ))}
      </div>

      <div ref={cardRef} className="scroll-mt-4">
        {selected ? (
          <CornerCard
            corner={selected}
            onClose={() => setN(null)}
            onStep={step}
            hand={HAND}
            handFull={HAND_FULL}
            speed={SPEED}
            tone={TONE}
            turnLabel={turnLabel}
          />
        ) : (
          <p className="rounded-2xl border border-dashed border-line p-5 text-sm leading-relaxed text-muted">
            {t(C.prompt)}
          </p>
        )}
      </div>

      <section>
        <p className="eyebrow">{t(C.sourcesTitle)}</p>
        <div className="rule mt-2" />
        <p className="mt-3 text-[12px] leading-relaxed text-muted">
          {fill(t(C.sourcesIntro), { LAP: LAP_METRES.toLocaleString() })}
        </p>
        <ul className="mt-3 flex flex-col gap-1.5">
          {SOURCES.map((s) => (
            <li key={s.label} className="text-[12px] text-muted">
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text underline decoration-line decoration-dotted underline-offset-2"
              >
                {s.label}
              </a>{" "}
              &mdash; {t(s.what)}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[11px] text-muted">{t(C.attribution)}</p>
      </section>
    </div>
  );
}

function CornerCard({
  corner: c,
  onClose,
  onStep,
  hand,
  handFull,
  speed,
  tone,
  turnLabel,
}: {
  corner: Corner;
  onClose: () => void;
  onStep: (by: number) => void;
  hand: Record<string, string>;
  handFull: Record<string, string>;
  speed: Record<string, string>;
  tone: Record<string, string>;
  turnLabel: (n: number) => string;
}) {
  const t = useT();
  const C = COPY.track;

  return (
    <section className="rise overflow-hidden rounded-2xl border border-amber/40 bg-surface">
      <header className="flex items-center gap-3 border-b border-line-soft px-4 py-3">
        <button onClick={() => onStep(-1)} aria-label={t(C.prevCorner)} className="display size-9 shrink-0 rounded-lg border border-line text-muted">
          ‹
        </button>
        <div className="min-w-0 flex-1 text-center">
          <p className="display text-lg font-bold leading-tight text-amber">{turnLabel(c.n)}</p>
          <p className="truncate text-xs text-muted">
            {c.name ? t(c.name) : handFull[c.hand]}{" "}
            &middot; <span className={tone[c.speed]}>{speed[c.speed]}</span>
          </p>
        </div>
        <button onClick={() => onStep(1)} aria-label={t(C.nextCorner)} className="display size-9 shrink-0 rounded-lg border border-line text-muted">
          ›
        </button>
      </header>

      {/* Measured off the survey line. */}
      <dl className="grid grid-cols-3 divide-x divide-line-soft border-b border-line-soft">
        <Stat label={t(C.sweep)} value={`${c.sweepDeg}°`} sub={hand[c.hand]} />
        <Stat label={t(C.length)} value={`${c.lengthM}`} sub={t(C.metres)} />
        <Stat label={t(C.runUp)} value={`${c.approachM}`} sub={t(C.metres)} />
      </dl>

      <div className="px-4 py-4">
        <p className="text-sm leading-relaxed">{t(c.guide)}</p>

        <div className="mt-4 rounded-xl bg-surface-2 p-4">
          <p className="eyebrow">{t(C.learnHere)}</p>
          <p className="display mt-1.5 text-base font-bold text-amber">{t(c.lesson.title)}</p>
          <p className="mt-2 text-sm leading-relaxed">{t(c.lesson.body)}</p>
        </div>

        <p className="mt-3 text-[11px] text-muted">
          {c.atM} {t(C.fromLine)} &middot; {c.degPerM}
          {t(C.perMetre)}
        </p>
      </div>

      <button onClick={onClose} className="eyebrow w-full border-t border-line-soft py-3 text-center">
        {t(C.close)}
      </button>
    </section>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="px-2 py-3 text-center">
      <dt className="eyebrow">{label}</dt>
      <dd className="tabular mt-1 text-xl font-bold leading-none">{value}</dd>
      <dd className="mt-1 text-[10px] text-muted">{sub}</dd>
    </div>
  );
}
