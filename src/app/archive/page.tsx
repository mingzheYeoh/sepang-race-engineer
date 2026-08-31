import Quiz from "./quiz";
import { HISTORY, SEPANG_RACES } from "@/lib/history";
import { COPY, fill } from "@/lib/copy";
import { pick } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";

export async function generateMetadata() {
  const locale = await getLocale();
  return {
    title: pick(COPY.meta.archiveTitle, locale),
    description: pick(COPY.meta.archiveDescription, locale),
  };
}

export default async function ArchivePage() {
  const locale = await getLocale();
  const t = (s: { en: string; zh: string }) => pick(s, locale);
  const C = COPY.archive;

  return (
    <main className="flex flex-col gap-6">
      <header>
        <p className="eyebrow">{t(C.eyebrow)}</p>
        <h1 className="display mt-1.5 text-[2.75rem] font-bold leading-[0.92] tracking-tight">
          {t(C.titleTop)}
          <br />
          <span className="text-amber">{t(C.titleBottom)}</span>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">{t(C.intro)}</p>
        <dl className="mt-4 flex gap-6">
          <div>
            <dt className="eyebrow">{t(C.statRaces)}</dt>
            <dd className="tabular text-2xl font-bold leading-none">{HISTORY.races}</dd>
          </div>
          <div>
            <dt className="eyebrow">{t(C.statFromPole)}</dt>
            <dd className="tabular text-2xl font-bold leading-none text-wet">
              {HISTORY.fromPole}/{HISTORY.races}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="eyebrow">{t(C.statTopDriver)}</dt>
            <dd className="truncate text-base font-semibold leading-tight text-amber">
              {HISTORY.topDriver[0]}
            </dd>
          </div>
        </dl>
      </header>

      <section>
        <p className="eyebrow">{t(C.quizTitle)}</p>
        <div className="rule mt-2 mb-3" />
        <Quiz />
      </section>

      <section>
        <p className="eyebrow">{t(C.timelineTitle)}</p>
        <div className="rule mt-2" />
        <ol className="mt-1 flex flex-col">
          {SEPANG_RACES.map((r) => {
            const shortened = r.laps < 56;
            return (
              <li
                key={r.season}
                className="flex items-baseline gap-3 border-b border-line-soft py-3 last:border-0"
              >
                <span className="tabular w-11 shrink-0 text-sm font-bold text-amber">
                  {r.season}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{r.winner}</span>
                  <span className="block truncate text-xs text-muted">
                    {r.constructor} &middot;{" "}
                    {r.grid === 1
                      ? t(C.fromPoleShort)
                      : fill(t(C.fromGrid), { G: r.grid })}
                  </span>
                </span>
                <span
                  className={`tabular shrink-0 text-xs ${shortened ? "text-wet" : "text-muted"}`}
                >
                  {fill(t(C.lapsShort), { L: r.laps })}
                  {shortened && (
                    <span className="ml-1.5 block text-[10px] leading-tight">{t(C.shortened)}</span>
                  )}
                </span>
              </li>
            );
          })}
        </ol>
      </section>
    </main>
  );
}
