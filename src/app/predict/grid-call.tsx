"use client";

import { useEffect, useMemo, useState } from "react";
import { BASE_RATES, pct } from "@/lib/history";
import { OCTOBER_NORMALS } from "@/lib/climate";
import { bestPlans } from "@/lib/strategy";
import { estimateTrackTemp, type HourPoint } from "@/lib/weather";
import { COPY, fill } from "@/lib/copy";
import { useT } from "@/lib/locale-context";
import type { L } from "@/lib/i18n";

const STORE = "sre_picks";

type Id = "rain" | "stops" | "pole" | "distance" | "topThree";
const IDS: Id[] = ["rain", "stops", "pole", "distance", "topThree"];

/** One character per call, so a whole card fits in a shareable query string. */
type Picks = Partial<Record<Id, string>>;

const encode = (p: Picks) => IDS.map((id) => p[id] ?? "-").join("");
const decode = (s: string): Picks => {
  const out: Picks = {};
  IDS.forEach((id, i) => {
    const c = s[i];
    if (c && c !== "-") out[id] = c;
  });
  return out;
};

export default function GridCall({ live }: { live: HourPoint | null }) {
  const t = useT();
  const C = COPY.predict;

  const trackC = live ? estimateTrackTemp(live) : 48;
  const modelStops = useMemo(() => bestPlans(trackC, 3, 1)[0].stops, [trackC]);
  const rainChance = live?.rainChance ?? Math.round(OCTOBER_NORMALS.afternoonStormChance * 100);

  const [picks, setPicks] = useState<Picks>({});
  const [copied, setCopied] = useState(false);

  // A shared link wins over whatever this device remembered, so opening
  // someone else's card shows their card and not your own.
  useEffect(() => {
    const shared = new URLSearchParams(window.location.search).get("p");
    if (shared) {
      setPicks(decode(shared));
      return;
    }
    try {
      const saved = localStorage.getItem(STORE);
      if (saved) setPicks(decode(saved));
    } catch {
      // Private windows and blocked site data both throw here; the page works
      // perfectly well without remembering anything.
    }
  }, []);

  function choose(id: Id, value: string) {
    setPicks((prev) => {
      const next = prev[id] === value ? { ...prev, [id]: undefined } : { ...prev, [id]: value };
      try {
        localStorage.setItem(STORE, encode(next));
      } catch {
        /* not being able to save is not a reason to not answer */
      }
      return next;
    });
    setCopied(false);
  }

  const yesNo: { value: string; label: L }[] = [
    { value: "y", label: C.yes },
    { value: "n", label: C.no },
  ];

  const QUESTIONS: {
    id: Id;
    prompt: L;
    options: { value: string; label: L }[];
    /** The honest prior: counted from the record, or from the model, or from climate. */
    prior: { source: L; text: string; agrees: (v: string) => boolean };
  }[] = [
    {
      id: "rain",
      prompt: C.q.rain,
      options: yesNo,
      prior: {
        source: live ? C.modelSays : C.climateSays,
        text: `${rainChance}%`,
        agrees: (v) => (rainChance >= 50 ? v === "y" : v === "n"),
      },
    },
    {
      id: "stops",
      prompt: C.q.stops,
      options: [
        { value: "1", label: { en: "One", zh: "一停" } },
        { value: "2", label: { en: "Two", zh: "两停" } },
        { value: "3", label: { en: "Three", zh: "三停" } },
      ],
      prior: {
        source: C.modelSays,
        text: `${modelStops} @ ${trackC}°C`,
        agrees: (v) => v === String(modelStops),
      },
    },
    {
      id: "pole",
      prompt: C.q.pole,
      options: yesNo,
      prior: {
        source: C.history,
        text: `${BASE_RATES.wonFromPole.hits}/${BASE_RATES.wonFromPole.of} · ${pct(BASE_RATES.wonFromPole)}%`,
        agrees: (v) => (pct(BASE_RATES.wonFromPole) >= 50 ? v === "y" : v === "n"),
      },
    },
    {
      id: "distance",
      prompt: C.q.distance,
      options: yesNo,
      prior: {
        source: C.history,
        text: `${BASE_RATES.fullDistance.hits}/${BASE_RATES.fullDistance.of} · ${pct(BASE_RATES.fullDistance)}%`,
        agrees: (v) => (pct(BASE_RATES.fullDistance) >= 50 ? v === "y" : v === "n"),
      },
    },
    {
      id: "topThree",
      prompt: C.q.topThree,
      options: yesNo,
      prior: {
        source: C.history,
        text: `${BASE_RATES.wonFromTopThree.hits}/${BASE_RATES.wonFromTopThree.of} · ${pct(BASE_RATES.wonFromTopThree)}%`,
        agrees: (v) => (pct(BASE_RATES.wonFromTopThree) >= 50 ? v === "y" : v === "n"),
      },
    },
  ];

  const answered = IDS.filter((id) => picks[id]).length;
  const contrarian = QUESTIONS.filter((q) => picks[q.id] && !q.prior.agrees(picks[q.id]!)).length;

  async function share() {
    const url = `${window.location.origin}${window.location.pathname}?p=${encode(picks)}`;
    const text = t(C.shareText);
    try {
      if (navigator.share) {
        await navigator.share({ title: text, text, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // A cancelled share sheet and a blocked clipboard both land here; neither
      // is worth an error message.
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <ol className="flex flex-col gap-3">
        {QUESTIONS.map((q) => {
          const picked = picks[q.id];
          const agrees = picked ? q.prior.agrees(picked) : null;
          return (
            <li key={q.id} className="rounded-2xl border border-line bg-surface p-4">
              <p className="text-sm font-medium leading-snug">{t(q.prompt)}</p>

              <div className="mt-3 flex gap-2">
                {q.options.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => choose(q.id, o.value)}
                    aria-pressed={picked === o.value}
                    className={`display flex-1 rounded-xl border py-2.5 text-sm font-bold transition-colors ${
                      picked === o.value ? "border-amber bg-amber text-ink" : "border-line text-muted"
                    }`}
                  >
                    {t(o.label)}
                  </button>
                ))}
              </div>

              {/* The prior is shown whether or not it flatters the pick. */}
              <p className="mt-2.5 flex flex-wrap items-baseline gap-x-2 text-[11px] text-muted">
                <span className="eyebrow">{t(q.prior.source)}</span>
                <span className="tabular font-semibold text-text">{q.prior.text}</span>
                {agrees !== null && (
                  <span className={agrees ? "text-muted" : "text-wet"}>
                    &middot; {agrees ? t(C.withHistory) : t(C.againstHistory)}
                  </span>
                )}
              </p>
            </li>
          );
        })}
      </ol>

      <section className="rounded-2xl border border-amber/40 bg-surface p-5">
        <p className="eyebrow" style={{ color: "var(--color-amber)" }}>
          {t(C.cardTitle)}
        </p>

        <div className="mt-3 flex items-baseline gap-4">
          <div>
            <p className="tabular text-[2.5rem] font-bold leading-none">
              {answered}
              <span className="text-muted">/{IDS.length}</span>
            </p>
          </div>
          {answered > 0 && (
            <p className="text-sm leading-snug text-muted">
              <span className="tabular font-bold text-wet">{contrarian}</span>{" "}
              {t(C.againstHistory)}
            </p>
          )}
        </div>

        {answered < IDS.length && (
          <p className="mt-2 text-xs text-muted">
            {fill(t(C.unanswered), { N: IDS.length - answered })}
          </p>
        )}

        <div className="mt-4 flex gap-2">
          <button
            onClick={share}
            disabled={answered === 0}
            className="display flex-1 rounded-xl bg-amber py-3 text-sm font-bold text-ink disabled:opacity-40"
          >
            {copied ? t(C.copied) : t(C.share)}
          </button>
          <button
            onClick={() => {
              setPicks({});
              setCopied(false);
              try {
                localStorage.removeItem(STORE);
              } catch {
                /* nothing to clear */
              }
            }}
            className="display rounded-xl border border-line px-4 py-3 text-sm font-bold text-muted"
          >
            {t(C.reset)}
          </button>
        </div>

        <p className="mt-3 text-[11px] text-muted">{t(C.saved)}</p>
      </section>
    </div>
  );
}
