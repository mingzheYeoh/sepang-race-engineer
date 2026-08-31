"use client";

import { useEffect, useState } from "react";
import {
  CIRCUIT,
  SESSIONS,
  formatCountdown,
  localTime,
  resolveWeekend,
  type Session,
} from "@/lib/weekend";
import { estimateTrackTemp, type HourPoint, type SepangWeather } from "@/lib/weather";
import { OCTOBER_NORMALS } from "@/lib/climate";
import { adviceFor } from "@/lib/advice";

/** Open-Meteo returns local naive timestamps; Malaysia is a fixed +08:00. */
const msOf = (h: HourPoint) => Date.parse(`${h.time}:00+08:00`);

const STATUS_LABEL = {
  before: "Countdown",
  live: "Session live",
  break: "Between sessions",
  after: "Weekend complete",
} as const;

export default function Paddock({
  nowMs,
  tOverride,
  weather,
}: {
  nowMs: number;
  tOverride?: string;
  weather: SepangWeather | null;
}) {
  const frozen = Boolean(tOverride);
  const [now, setNow] = useState(nowMs);
  useEffect(() => {
    const started = Date.now();
    const id = setInterval(() => setNow(nowMs + (Date.now() - started)), 1000);
    return () => clearInterval(id);
  }, [nowMs]);

  const w = resolveWeekend(now);
  const live = weather?.now ?? null;

  // The forecast horizon is ~16 days, so for most of the year the race weekend
  // is out of reach and we fall back to October normals instead of a blank panel.
  const raceStart = Date.parse(SESSIONS[SESSIONS.length - 1].start);
  const forecastReaches = !!weather && weather.hours.some((h) => msOf(h) >= raceStart);

  const hourFor = (s: Session): HourPoint | null => {
    if (!weather) return null;
    const target = Date.parse(s.start);
    return weather.hours.find((h) => msOf(h) >= target && msOf(h) < target + 3_600_000) ?? null;
  };

  return (
    <main className="flex flex-col gap-5">
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber">
          Race Engineer
        </p>
        <h1 className="mt-1 text-4xl font-black leading-none tracking-tight">SEPANG</h1>
        <p className="mt-1.5 text-sm text-muted">
          2&ndash;4 October 2026 &middot; {CIRCUIT.laps} laps &middot; {CIRCUIT.lengthKm} km
        </p>
      </header>

      {/* Primary state: one glance answers "what is happening and when". */}
      <section className="rounded-2xl border border-line bg-surface p-5">
        <div className="flex items-center gap-2">
          <span
            className={`size-2 rounded-full ${
              w.status === "live" ? "animate-pulse bg-amber" : "bg-muted"
            }`}
          />
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
            {STATUS_LABEL[w.status]}
          </span>
        </div>

        {w.status === "after" ? (
          <p className="mt-3 text-lg">
            Chequered flag. Sepang closes out the weekend.
          </p>
        ) : w.current ? (
          <>
            <p className="mt-3 text-2xl font-bold">{w.current.name}</p>
            <p className="tabular mt-1 text-4xl font-black text-amber">
              {formatCountdown(Date.parse(w.current.start) + w.current.minutes * 60_000 - now)}
            </p>
            <p className="mt-1 text-xs uppercase tracking-wider text-muted">remaining</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{w.current.note}</p>
          </>
        ) : (
          w.next && (
            <>
              <p className="mt-3 text-sm text-muted">
                Next up &middot; {w.next.day} {localTime(w.next.start)}
              </p>
              <p className="text-2xl font-bold">{w.next.name}</p>
              <p className="tabular mt-2 text-4xl font-black text-amber">
                {formatCountdown(w.msToNext ?? 0)}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{w.next.note}</p>
            </>
          )
        )}
      </section>

      {/* Live conditions. The number that decides a Sepang race is the one
          nobody publishes, so we estimate it and say so. */}
      <section className="rounded-2xl border border-line bg-surface p-5">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
          At the circuit now
        </h2>
        {live ? (
          <>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Stat label="Air" value={`${Math.round(live.tempC)}°`} />
              <Stat label="Feels like" value={`${Math.round(live.feelsC)}°`} />
              <Stat label="Track (est.)" value={`${estimateTrackTemp(live)}°`} tone="amber" />
              <Stat
                label="Rain next hour"
                value={`${live.rainChance}%`}
                tone={live.rainChance >= 50 ? "wet" : undefined}
              />
            </div>
            <p className="mt-3 text-xs text-muted">
              Humidity {live.humidity}%. Track temperature is estimated from air temperature
              and rainfall &mdash; no public feed measures it.
            </p>
          </>
        ) : (
          <p className="mt-3 text-sm text-muted">
            Weather service unreachable. Everything else on this page still works.
          </p>
        )}
      </section>

      {/* Real forecast when it exists, climate normals when it does not. */}
      <section className="rounded-2xl border border-line bg-surface p-5">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
          Weekend outlook
        </h2>
        {forecastReaches ? (
          <ul className="mt-3 flex flex-col gap-2">
            {SESSIONS.map((s) => {
              const h = hourFor(s);
              return (
                <li key={s.id} className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="font-semibold">{s.name}</span>
                  <span className="tabular text-muted">
                    {h ? `${Math.round(h.tempC)}° · ${h.rainChance}% rain` : "—"}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <>
            <p className="mt-3 text-sm leading-relaxed">{OCTOBER_NORMALS.summary}</p>
            <div className="mt-3 grid grid-cols-3 gap-3">
              <Stat label="Typical high" value={`${OCTOBER_NORMALS.highC}°`} />
              <Stat label="Humidity" value={`${OCTOBER_NORMALS.humidityPct}%`} />
              <Stat
                label="Storm odds"
                value={`${Math.round(OCTOBER_NORMALS.afternoonStormChance * 100)}%`}
                tone="wet"
              />
            </div>
            <p className="mt-3 text-xs text-muted">
              October normals, not a forecast. The hourly forecast for race weekend opens
              about 16 days out.
            </p>
          </>
        )}
      </section>

      <section className="rounded-2xl border border-line bg-surface p-5">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
          Schedule
        </h2>
        <ul className="mt-3 flex flex-col gap-2.5">
          {SESSIONS.map((s) => {
            const isNow = w.current?.id === s.id;
            const done = now >= Date.parse(s.start) + s.minutes * 60_000;
            return (
              <li
                key={s.id}
                className={`flex items-baseline justify-between gap-3 border-l-2 pl-3 ${
                  isNow ? "border-amber" : done ? "border-line opacity-45" : "border-line"
                }`}
              >
                <div>
                  <p className="text-sm font-semibold">{s.name}</p>
                  <p className="text-xs text-muted">{s.day}</p>
                </div>
                <span className="tabular text-sm text-muted">{localTime(s.start)}</span>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-xs text-muted">All times Malaysia (UTC+8).</p>
      </section>

      <section className="rounded-2xl border border-line bg-surface p-5">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
          Engineer&rsquo;s notes
        </h2>
        <ul className="mt-3 flex flex-col gap-3">
          {adviceFor(w, live, now).map((a) => (
            <li key={a.text} className="flex gap-3 text-sm leading-relaxed">
              <span aria-hidden>{a.icon}</span>
              <span>{a.text}</span>
            </li>
          ))}
        </ul>
      </section>

      <TimeTravel frozen={frozen} />
    </main>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "amber" | "wet";
}) {
  const color = tone === "amber" ? "text-amber" : tone === "wet" ? "text-wet" : "text-text";
  return (
    <div className="rounded-xl bg-surface-2 px-3 py-2.5">
      <p className="text-[10px] uppercase tracking-wider text-muted">{label}</p>
      <p className={`tabular text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

/** Race day is unreachable on any other date, so the demo needs to travel there. */
function TimeTravel({ frozen }: { frozen: boolean }) {
  const jumps: [string, string | null][] = [
    ["Now", null],
    ["FP1", "2026-10-02T11:45:00+08:00"],
    ["Quali", "2026-10-03T15:20:00+08:00"],
    ["Race", "2026-10-04T15:30:00+08:00"],
  ];

  return (
    <section className="rounded-2xl border border-dashed border-line p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
        Time travel {frozen && <span className="text-amber">&middot; active</span>}
      </p>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {jumps.map(([label, t]) => (
          <a
            key={label}
            href={t ? `/?t=${encodeURIComponent(t)}` : "/"}
            className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-amber hover:text-amber"
          >
            {label}
          </a>
        ))}
      </div>
    </section>
  );
}
