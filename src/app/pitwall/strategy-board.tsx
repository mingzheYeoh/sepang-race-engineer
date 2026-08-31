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
  type Plan,
} from "@/lib/strategy";
import { estimateTrackTemp, type HourPoint } from "@/lib/weather";

export default function StrategyBoard({ live }: { live: HourPoint | null }) {
  const measured = live ? estimateTrackTemp(live) : 48;
  const [trackC, setTrackC] = useState(measured);
  const touched = trackC !== measured;

  // Cheap enough to recompute on every drag: the search is a small dynamic
  // program, not a simulation.
  const plans = useMemo(() => bestPlans(trackC), [trackC]);
  const [best, ...rest] = plans;

  const rainRisk = live?.rainChance ?? null;

  return (
    <div className="flex flex-col gap-6">
      {/* What the call is based on. */}
      <section className="rounded-2xl border border-line bg-surface p-5">
        <div className="flex items-baseline justify-between gap-3">
          <p className="eyebrow">Track temperature</p>
          {touched && (
            <button
              onClick={() => setTrackC(measured)}
              className="eyebrow"
              style={{ color: "var(--color-amber)" }}
            >
              reset to live
            </button>
          )}
        </div>
        <p className="tabular mt-2 text-[3rem] font-bold leading-none text-amber">{trackC}°</p>
        <p className="mt-1 text-xs text-muted">
          {touched ? `You moved this. Live estimate is ${measured}°.` : "Estimated from live air temperature and rainfall."}{" "}
          Wear runs {tempFactor(trackC).toFixed(2)}× the rate at {REFERENCE_TRACK_C}°.
        </p>

        <input
          type="range"
          min={28}
          max={68}
          value={trackC}
          onChange={(e) => setTrackC(Number(e.target.value))}
          aria-label="Track temperature in Celsius"
          className="mt-4 w-full accent-[var(--color-amber)]"
        />
        <div className="flex justify-between text-[10px] text-muted">
          <span>28° wet-ish</span>
          <span>48° typical</span>
          <span>68° brutal</span>
        </div>
      </section>

      <section>
        <p className="eyebrow">The call</p>
        <div className="rule mt-2" />
        <PlanCard plan={best} lead />
      </section>

      {rest.length > 0 && (
        <section>
          <p className="eyebrow">If you disagree</p>
          <div className="rule mt-2" />
          <div className="mt-3 flex flex-col gap-3">
            {rest.map((p, i) => (
              <PlanCard key={i} plan={p} deltaS={p.totalS - best.totalS} />
            ))}
          </div>
        </section>
      )}

      {rainRisk !== null && (
        <section className="rounded-2xl border border-line bg-surface p-5">
          <p className="eyebrow">Rain risk</p>
          <p className="tabular mt-2 text-3xl font-bold leading-none text-wet">{rainRisk}%</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {rainRisk >= 60
              ? "High enough that the dry plan above is a starting point, not a decision. A wet track drops the surface temperature by twenty degrees or more, so degradation stops mattering and track position starts to."
              : rainRisk >= 25
                ? "Enough to keep intermediates ready. A Sepang shower can arrive between one stop and the next, and the team that pits on the first lap of it usually wins the day."
                : "Low. The plan above should hold, though October afternoons here change their mind quickly."}
          </p>
        </section>
      )}

      {/* Every constant, in the open. */}
      <section>
        <p className="eyebrow">What this is built on</p>
        <div className="rule mt-2" />
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 text-[12px]">
          <Row k="Race distance" v={`${RACE_LAPS} laps`} />
          <Row k="Reference lap" v={`${BASE_LAP_S.toFixed(1)}s`} />
          <Row k="Pit lane cost" v={`${PIT_LOSS_S.toFixed(1)}s`} />
          <Row k="Wear reference" v={`${REFERENCE_TRACK_C}°C`} />
          {(Object.keys(TYRES) as (keyof typeof TYRES)[]).map((c) => (
            <Row
              key={c}
              k={TYRES[c].label}
              v={`${TYRES[c].offsetS >= 0 ? "+" : ""}${TYRES[c].offsetS.toFixed(1)}s · ${TYRES[c].lifeLaps} laps`}
            />
          ))}
        </dl>
        <p className="mt-3 text-[12px] leading-relaxed text-muted">
          A model, not a feed. There is no lawful public source of live Formula&nbsp;1 timing, so
          nothing here is claimed to be one. The numbers above are the whole model &mdash; change
          the track temperature and watch the call move.
        </p>
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

function PlanCard({ plan, lead, deltaS }: { plan: Plan; lead?: boolean; deltaS?: number }) {
  return (
    <article
      className={`overflow-hidden rounded-2xl border ${
        lead ? "mt-3 border-amber/40 bg-surface" : "border-line"
      }`}
    >
      <header className="flex items-baseline justify-between gap-3 px-4 pt-4">
        <p className={`display text-lg font-bold ${lead ? "text-amber" : ""}`}>
          {plan.stops}-stop
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
            className="flex items-center justify-center overflow-hidden rounded-sm text-[10px] font-bold"
            style={{
              flexGrow: s.laps,
              background: TYRES[s.compound].colour,
              color: s.compound === "hard" ? "#07090d" : s.compound === "medium" ? "#07090d" : "#fff",
            }}
            title={`${TYRES[s.compound].label}, ${s.laps} laps`}
          >
            {s.laps}
          </div>
        ))}
      </div>

      <ol className="mt-3 flex flex-wrap gap-x-3 gap-y-1 px-4 pb-4 text-xs text-muted">
        {plan.stints.map((s, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ background: TYRES[s.compound].colour }}
            />
            <span>
              {TYRES[s.compound].label} &middot; laps {s.startLap}&ndash;{s.startLap + s.laps - 1}
            </span>
          </li>
        ))}
      </ol>

      {plan.stopLaps.length > 0 && (
        <p className="border-t border-line-soft px-4 py-2.5 text-xs text-muted">
          Box on lap{" "}
          <span className="tabular font-semibold text-text">{formatLapList(plan.stopLaps)}</span>
        </p>
      )}
    </article>
  );
}
