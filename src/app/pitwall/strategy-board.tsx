"use client";

import { useMemo, useState } from "react";
import {
  BASE_LAP_S,
  PIT_LOSS_S,
  RACE_LAPS,
  REFERENCE_TRACK_C,
  TYRES,
  bestPlans,
  formatDelta,
  formatLapList,
  formatRaceTime,
  tempFactor,
  type Compound,
  type Plan,
} from "@/lib/strategy";
import { estimateTrackTemp, type HourPoint } from "@/lib/weather";
import { COPY, fill } from "@/lib/copy";
import { useLocale, useT } from "@/lib/locale-context";

export default function StrategyBoard({ live }: { live: HourPoint | null }) {
  const t = useT();
  const locale = useLocale();
  const zh = locale === "zh";
  const C = COPY.pitwall;

  const measured = live ? estimateTrackTemp(live) : 48;
  const [trackC, setTrackC] = useState(measured);
  const touched = trackC !== measured;

  // Cheap enough to recompute on every drag: the search is a small dynamic
  // program, not a simulation.
  const plans = useMemo(() => bestPlans(trackC), [trackC]);
  const [best, ...rest] = plans;

  const rainRisk = live?.rainChance ?? null;
  const tyreLabel = Object.fromEntries(
    (Object.keys(TYRES) as Compound[]).map((c) => [c, t(TYRES[c].label)]),
  ) as Record<Compound, string>;

  return (
    <div className="flex flex-col gap-6">
      {/* What the call is based on. */}
      <section className="rounded-2xl border border-line bg-surface p-5">
        <div className="flex items-baseline justify-between gap-3">
          <p className="eyebrow">{t(C.trackTemp)}</p>
          {touched && (
            <button onClick={() => setTrackC(measured)} className="eyebrow" style={{ color: "var(--color-amber)" }}>
              {t(C.resetToLive)}
            </button>
          )}
        </div>
        <p className="tabular mt-2 text-[3rem] font-bold leading-none text-amber">{trackC}°</p>
        <p className="mt-1 text-xs leading-relaxed text-muted">
          {touched ? `${t(C.moved)} ${measured}°。`.replace("。", zh ? "。" : ".") : t(C.estimated)}{" "}
          {t(C.wearRuns)} {tempFactor(trackC).toFixed(2)}
          {zh ? `×，基准为 ${REFERENCE_TRACK_C}°。` : `× the rate at ${REFERENCE_TRACK_C}°.`}
        </p>

        <input
          type="range"
          min={28}
          max={68}
          value={trackC}
          onChange={(e) => setTrackC(Number(e.target.value))}
          aria-label={t(C.sliderLabel)}
          className="mt-4 w-full accent-[var(--color-amber)]"
        />
        <div className="flex justify-between text-[10px] text-muted">
          <span>{t(C.sliderCold)}</span>
          <span>{t(C.sliderTypical)}</span>
          <span>{t(C.sliderBrutal)}</span>
        </div>
      </section>

      <section>
        <p className="eyebrow">{t(C.theCall)}</p>
        <div className="rule mt-2" />
        <PlanCard plan={best} lead tyreLabel={tyreLabel} />
      </section>

      {rest.length > 0 && (
        <section>
          <p className="eyebrow">{t(C.disagree)}</p>
          <div className="rule mt-2" />
          <div className="mt-3 flex flex-col gap-3">
            {rest.map((p, i) => (
              <PlanCard key={i} plan={p} deltaS={p.totalS - best.totalS} tyreLabel={tyreLabel} />
            ))}
          </div>
        </section>
      )}

      {rainRisk !== null && (
        <section className="rounded-2xl border border-line bg-surface p-5">
          <p className="eyebrow">{t(C.rainRisk)}</p>
          <p className="tabular mt-2 text-3xl font-bold leading-none text-wet">{rainRisk}%</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {rainRisk >= 60 ? t(C.rainHigh) : rainRisk >= 25 ? t(C.rainMedium) : t(C.rainLow)}
          </p>
        </section>
      )}

      {/* Every constant, in the open. */}
      <section>
        <p className="eyebrow">{t(C.builtOn)}</p>
        <div className="rule mt-2" />
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 text-[12px]">
          <Row k={t(C.raceDistance)} v={`${RACE_LAPS} ${t(COPY.paddock.laps)}`} />
          <Row k={t(C.referenceLap)} v={`${BASE_LAP_S.toFixed(1)}s`} />
          <Row k={t(C.pitCost)} v={`${PIT_LOSS_S.toFixed(1)}s`} />
          <Row k={t(C.wearRef)} v={`${REFERENCE_TRACK_C}°C`} />
          {(Object.keys(TYRES) as Compound[]).map((c) => (
            <Row
              key={c}
              k={tyreLabel[c]}
              v={`${TYRES[c].offsetS >= 0 ? "+" : ""}${TYRES[c].offsetS.toFixed(1)}s · ${TYRES[c].lifeLaps} ${t(COPY.paddock.laps)}`}
            />
          ))}
        </dl>
        <p className="mt-3 text-[12px] leading-relaxed text-muted">{t(C.modelNote)}</p>
      </section>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2 border-b border-line-soft pb-2">
      <dt className="text-muted">{k}</dt>
      <dd className="tabular font-semibold">{v}</dd>
    </div>
  );
}

function PlanCard({
  plan,
  lead,
  deltaS,
  tyreLabel,
}: {
  plan: Plan;
  lead?: boolean;
  deltaS?: number;
  tyreLabel: Record<Compound, string>;
}) {
  const t = useT();
  const locale = useLocale();
  const C = COPY.pitwall;

  const lapRange = (from: number, to: number) => fill(t(C.lapsRange), { A: from, B: to });

  return (
    <article className={`overflow-hidden rounded-2xl border ${lead ? "mt-3 border-amber/40 bg-surface" : "border-line"}`}>
      <header className="flex items-baseline justify-between gap-3 px-4 pt-4">
        <p className={`display text-lg font-bold ${lead ? "text-amber" : ""}`}>
          {plan.stops}
          {t(C.stop)}
        </p>
        <p className="tabular text-sm text-muted">
          {deltaS === undefined ? formatRaceTime(plan.totalS) : formatDelta(deltaS)}
        </p>
      </header>

      {/* Stint bar: width is lap count, so the shape of the race is the picture. */}
      <div className="mt-3 flex h-8 gap-0.5 px-4">
        {plan.stints.map((s, i) => (
          <div
            key={i}
            className="flex items-center justify-center overflow-hidden rounded-sm border border-black/10 text-[10px] font-bold"
            style={{
              flexGrow: s.laps,
              background: TYRES[s.compound].colour,
              color: s.compound === "soft" ? "#fff" : "#07090d",
            }}
            title={`${tyreLabel[s.compound]}, ${s.laps}`}
          >
            {s.laps}
          </div>
        ))}
      </div>

      <ol className="mt-3 flex flex-wrap gap-x-3 gap-y-1 px-4 pb-4 text-xs text-muted">
        {plan.stints.map((s, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <span className="size-2 shrink-0 rounded-full" style={{ background: TYRES[s.compound].colour }} />
            <span>
              {tyreLabel[s.compound]} &middot; {lapRange(s.startLap, s.startLap + s.laps - 1)}
            </span>
          </li>
        ))}
      </ol>

      {plan.stopLaps.length > 0 && (
        <p className="border-t border-line-soft px-4 py-2.5 text-xs text-muted">
          {t(C.boxOnLap)}{" "}
          <span className="tabular font-semibold text-text">
            {fill(t(C.boxLaps), { L: formatLapList(plan.stopLaps, locale) })}
          </span>
        </p>
      )}
    </article>
  );
}
