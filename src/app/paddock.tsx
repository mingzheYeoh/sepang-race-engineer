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
import { COPY } from "@/lib/copy";
import { useLocale, useT } from "@/lib/locale-context";
import Link from "next/link";

/** Open-Meteo returns local naive timestamps; Malaysia is a fixed +08:00. */
const msOf = (h: HourPoint) => Date.parse(`${h.time}:00+08:00`);

export default function Paddock({
  nowMs,
  tOverride,
  weather,
}: {
  nowMs: number;
  tOverride?: string;
  weather: SepangWeather | null;
}) {
  const t = useT();
  const locale = useLocale();
  const zh = locale === "zh";
  const C = COPY.paddock;

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
    const at = Date.parse(s.start);
    return weather.hours.find((h) => msOf(h) >= at && msOf(h) < at + 3_600_000) ?? null;
  };

  const headline = w.current ?? w.next;
  const clock = w.current
    ? Date.parse(w.current.start) + w.current.minutes * 60_000 - now
    : (w.msToNext ?? 0);

  return (
    <main className="flex flex-col gap-6">
      <header>
        <p className="eyebrow">{t(C.eyebrow)}</p>
        <h1 className="display mt-1.5 text-[3.25rem] font-bold leading-[0.85] tracking-tight">
          SEPANG
        </h1>
        <p className="mt-2 text-sm text-muted">
          {t(C.dates)} &middot; {CIRCUIT.laps} {t(C.laps)} &middot; {CIRCUIT.lengthKm} km
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
          <span className="eyebrow">{t(C.status[w.status])}</span>
        </div>

        {w.status === "after" || !headline ? (
          <p className="mt-4 text-lg leading-snug">{t(C.finished)}</p>
        ) : (
          <>
            <p className="display mt-3 text-2xl font-bold leading-tight">{t(headline.name)}</p>
            <p className="tabular mt-2 text-[3.25rem] font-bold leading-none text-amber">
              {formatCountdown(clock)}
            </p>
            <p className="eyebrow mt-1.5">
              {w.current
                ? t(C.remaining)
                : `${t(C.startsAt)} ${t(headline.day)} ${localTime(headline.start)}`}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted">{t(headline.note)}</p>
          </>
        )}
      </section>

      {/* Live conditions. The number that decides a Sepang race is the one nobody
          publishes, so we estimate it and say so. */}
      <section>
        <p className="eyebrow">{t(C.conditionsTitle)}</p>
        <div className="rule mt-2" />
        {live ? (
          <>
            <div className="mt-3 grid grid-cols-4 gap-2">
              <Stat label={t(C.air)} value={`${Math.round(live.tempC)}°`} />
              <Stat label={t(C.feels)} value={`${Math.round(live.feelsC)}°`} />
              <Stat label={t(C.track)} value={`${estimateTrackTemp(live)}°`} tone="amber" />
              <Stat
                label={t(C.rain)}
                value={`${live.rainChance}%`}
                tone={live.rainChance >= 50 ? "wet" : undefined}
              />
            </div>
            <p className="mt-2.5 text-[11px] leading-relaxed text-muted">
              {t(C.humidity)} {live.humidity}%. {t(C.humidityNote)}
            </p>
          </>
        ) : (
          <p className="mt-3 text-sm text-muted">{t(C.weatherDown)}</p>
        )}
      </section>

      <section>
        <p className="eyebrow">{t(C.outlookTitle)}</p>
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
                  <span className="font-medium">{t(s.name)}</span>
                  <span className="tabular text-muted">
                    {h
                      ? `${Math.round(h.tempC)}° · ${h.rainChance}% ${zh ? "降雨" : "rain"}`
                      : "—"}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <>
            <p className="mt-3 text-sm leading-relaxed">{t(OCTOBER_NORMALS.summary)}</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <Stat label={t(C.typicalHigh)} value={`${OCTOBER_NORMALS.highC}°`} />
              <Stat label={t(C.humidity)} value={`${OCTOBER_NORMALS.humidityPct}%`} />
              <Stat
                label={t(C.stormOdds)}
                value={`${Math.round(OCTOBER_NORMALS.afternoonStormChance * 100)}%`}
                tone="wet"
              />
            </div>
            <p className="mt-2.5 text-[11px] leading-relaxed text-muted">{t(C.normalsNote)}</p>
          </>
        )}
      </section>

      <section>
        <p className="eyebrow">{t(C.scheduleTitle)}</p>
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
                  <span className="block text-sm font-medium">{t(s.name)}</span>
                  <span className="block text-xs text-muted">{t(s.day)}</span>
                </span>
                <span className="tabular text-sm text-muted">{localTime(s.start)}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <p className="eyebrow">{t(C.notesTitle)}</p>
        <div className="rule mt-2" />
        <ul className="mt-3 flex flex-col gap-3">
          {adviceFor(w, live, now).map((a) => (
            <li key={a.text.en} className="flex gap-3 text-sm leading-relaxed">
              <span aria-hidden className="shrink-0">
                {a.icon}
              </span>
              <span>{t(a.text)}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Two destinations that are not weekend tools, so they stay off the thumb
          bar and live here on the hub instead. */}
      <section>
        <p className="eyebrow">{t(C.moreTitle)}</p>
        <div className="rule mt-2" />
        <div className="mt-3 grid gap-2">
          <HubCard href="/predict" glyph="◈" title={t(C.goPredict)} sub={t(C.goPredictSub)} />
          <HubCard href="/archive" glyph="▤" title={t(C.goArchive)} sub={t(C.goArchiveSub)} />
        </div>
      </section>

      <TimeTravel frozen={frozen} />
    </main>
  );
}

function HubCard({ href, glyph, title, sub }: { href: string; glyph: string; title: string; sub: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3.5 transition-colors active:border-amber"
    >
      <span aria-hidden className="text-lg text-amber">
        {glyph}
      </span>
      <span className="min-w-0 flex-1">
        <span className="display block text-sm font-bold">{title}</span>
        <span className="block truncate text-xs text-muted">{sub}</span>
      </span>
      <span aria-hidden className="text-muted">
        ›
      </span>
    </Link>
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
  const t = useT();
  const C = COPY.paddock;
  const jumps: [string, string | null][] = [
    [t(C.now), null],
    ["FP1", "2026-10-02T11:45:00+08:00"],
    [t(SESSIONS[3].name), "2026-10-03T15:20:00+08:00"],
    [t(SESSIONS[4].name), "2026-10-04T15:30:00+08:00"],
  ];

  return (
    <section className="rounded-2xl border border-dashed border-line p-4">
      <p className="eyebrow">
        {t(C.timeTravel)}{" "}
        {frozen && <span style={{ color: "var(--color-amber)" }}>&middot; {t(C.timeTravelActive)}</span>}
      </p>
      <div className="rail mt-2.5 flex gap-2 overflow-x-auto">
        {jumps.map(([label, to]) => (
          <a
            key={label}
            href={to ? `/?t=${encodeURIComponent(to)}` : "/"}
            className="shrink-0 rounded-full border border-line px-4 py-2 text-xs font-semibold text-muted transition-colors active:border-amber active:text-amber"
          >
            {label}
          </a>
        ))}
      </div>
      <p className="mt-2.5 text-[11px] leading-relaxed text-muted">{t(C.timeTravelNote)}</p>
    </section>
  );
}
