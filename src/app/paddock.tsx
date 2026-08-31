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

const STATUS = {
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

  // The forecast horizon is ~16 days, so for most of the year the race weekend is
  // out of reach and we fall back to October normals instead of a blank panel.
  const raceStart = Date.parse(SESSIONS[SESSIONS.length - 1].start);
  const forecastReaches = !!weather && weather.hours.some((h) => msOf(h) >= raceStart);

  const hourFor = (s: Session): HourPoint | null => {
    if (!weather) return null;
    const t = Date.parse(s.start);
    return weather.hours.find((h) => msOf(h) >= t && msOf(h) < t + 3_600_000) ?? null;
  };

  const headline = w.current ?? w.next;
  const clock = w.current
    ? Date.parse(w.current.start) + w.current.minutes * 60_000 - now
    : (w.msToNext ?? 0);

  return (
    <main className="flex flex-col gap-6">
      <header>
        <p className="eyebrow">Race Engineer</p>
        <h1 className="display mt-1.5 text-[3.25rem] font-bold leading-[0.85] tracking-tight">
          SEPANG
        </h1>
        <p className="mt-2 text-sm text-muted">
          2&ndash;4 October 2026 &middot; {CIRCUIT.laps} laps &middot; {CIRCUIT.lengthKm} km
        </p>
      </header>

      {/* The one block that answers "what is happening, and when". */}
      <section className="rounded-2xl border border-line bg-surface p-5">
        <div className="flex items-center gap-2">
          <span
            className={`size-2 rounded-full ${
              w.status === "live" ? "animate-pulse bg-amber" : "bg-muted"
            }`}
          />
          <span className="eyebrow">{STATUS[w.status]}</span>
        </div>

        {w.status === "after" || !headline ? (
          <p className="mt-4 text-lg leading-snug">Chequered flag. Sepang closes out the weekend.</p>
        ) : (
          <>
            <p className="display mt-3 text-2xl font-bold leading-tight">{headline.name}</p>
            <p className="tabular mt-2 text-[3.25rem] font-bold leading-none text-amber">
              {formatCountdown(clock)}
            </p>
            <p className="eyebrow mt-1.5">
              {w.current ? "remaining" : `starts ${headline.day} ${localTime(headline.start)}`}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted">{headline.note}</p>
          </>
        )}
      </section>

      {/* Live conditions. The number that decides a Sepang race is the one nobody
          publishes, so we estimate it and say so. */}
      <section>
        <p className="eyebrow">At the circuit now</p>
        <div className="rule mt-2" />
        {live ? (
          <>
            <div className="mt-3 grid grid-cols-4 gap-2">
              <Stat label="Air" value={`${Math.round(live.tempC)}°`} />
              <Stat label="Feels" value={`${Math.round(live.feelsC)}°`} />
              <Stat label="Track" value={`${estimateTrackTemp(live)}°`} tone="amber" />
              <Stat
                label="Rain"
                value={`${live.rainChance}%`}
                tone={live.rainChance >= 50 ? "wet" : undefined}
              />
            </div>
            <p className="mt-2.5 text-[11px] leading-relaxed text-muted">
              Humidity {live.humidity}%. Track temperature is estimated from air temperature and
              rainfall &mdash; no public feed measures it.
            </p>
          </>
        ) : (
          <p className="mt-3 text-sm text-muted">
            Weather service unreachable. Everything else on this page still works.
          </p>
        )}
      </section>

      <section>
        <p className="eyebrow">Weekend outlook</p>
        <div className="rule mt-2" />
        {forecastReaches ? (
          <ul className="mt-2 flex flex-col">
            {SESSIONS.map((s) => {
              const h = hourFor(s);
              return (
                <li
                  key={s.id}
                  className="flex items-baseline justify-between gap-3 border-b border-line-soft py-2.5 text-sm last:border-0"
                >
                  <span className="font-medium">{s.name}</span>
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
            <div className="mt-3 grid grid-cols-3 gap-2">
              <Stat label="Typical high" value={`${OCTOBER_NORMALS.highC}°`} />
              <Stat label="Humidity" value={`${OCTOBER_NORMALS.humidityPct}%`} />
              <Stat
                label="Storm odds"
                value={`${Math.round(OCTOBER_NORMALS.afternoonStormChance * 100)}%`}
                tone="wet"
              />
            </div>
            <p className="mt-2.5 text-[11px] leading-relaxed text-muted">
              October normals, not a forecast. The hourly forecast for race weekend opens about 16
              days out.
            </p>
          </>
        )}
      </section>

      <section>
        <p className="eyebrow">Schedule &middot; Malaysia (UTC+8)</p>
        <div className="rule mt-2" />
        <ul className="mt-1 flex flex-col">
          {SESSIONS.map((s) => {
            const isNow = w.current?.id === s.id;
            const done = now >= Date.parse(s.start) + s.minutes * 60_000;
            return (
              <li
                key={s.id}
                className={`flex items-center gap-3 border-b border-line-soft py-3 last:border-0 ${
                  done ? "opacity-40" : ""
                }`}
              >
                <span
                  className={`h-8 w-0.5 shrink-0 rounded-full ${isNow ? "bg-amber" : "bg-line"}`}
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">{s.name}</span>
                  <span className="block text-xs text-muted">{s.day}</span>
                </span>
                <span className="tabular text-sm text-muted">{localTime(s.start)}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <p className="eyebrow">Engineer&rsquo;s notes</p>
        <div className="rule mt-2" />
        <ul className="mt-3 flex flex-col gap-3">
          {adviceFor(w, live, now).map((a) => (
            <li key={a.text} className="flex gap-3 text-sm leading-relaxed">
              <span aria-hidden className="shrink-0">
                {a.icon}
              </span>
              <span>{a.text}</span>
            </li>
          ))}
        </ul>
      </section>

      <TimeTravel frozen={frozen} />
    </main>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "amber" | "wet" }) {
  const color = tone === "amber" ? "text-amber" : tone === "wet" ? "text-wet" : "text-text";
  return (
    <div className="rounded-xl border border-line-soft bg-surface px-2.5 py-2.5">
      <p className="eyebrow">{label}</p>
      <p className={`tabular mt-1 text-xl font-bold leading-none ${color}`}>{value}</p>
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
      <p className="eyebrow">
        Time travel {frozen && <span style={{ color: "var(--color-amber)" }}>&middot; active</span>}
      </p>
      <div className="rail mt-2.5 flex gap-2 overflow-x-auto">
        {jumps.map(([label, t]) => (
          <a
            key={label}
            href={t ? `/?t=${encodeURIComponent(t)}` : "/"}
            className="shrink-0 rounded-full border border-line px-4 py-2 text-xs font-semibold text-muted transition-colors active:border-amber active:text-amber"
          >
            {label}
          </a>
        ))}
      </div>
      <p className="mt-2.5 text-[11px] leading-relaxed text-muted">
        Jump the app to any point in the race weekend &mdash; the countdown, the advice and the
        radio all follow.
      </p>
    </section>
  );
}
