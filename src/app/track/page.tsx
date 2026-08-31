import CircuitMap from "./circuit-map";
import { CORNERS, LAP_METRES } from "@/lib/circuit";
import { COPY } from "@/lib/copy";
import { pick } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";

export const metadata = {
  title: "Circuit Guide | Sepang Race Engineer",
  description:
    "All fifteen corners of Sepang International Circuit, drawn to scale, each explaining one idea from Formula 1.",
};

export default async function TrackPage() {
  const locale = await getLocale();
  const t = (s: { en: string; zh: string }) => pick(s, locale);
  const C = COPY.track;
  const slow = CORNERS.filter((c) => c.speed === "slow").length;

  return (
    <main className="flex flex-col gap-5">
      <header>
        <p className="eyebrow">{t(C.eyebrow)}</p>
        <h1 className="display mt-1.5 text-[2.75rem] font-bold leading-[0.92] tracking-tight">
          {t(C.titleTop)}
          <br />
          <span className="text-amber">{t(C.titleBottom)}</span>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {LAP_METRES.toLocaleString()} m {t(C.intro)}
        </p>
        <dl className="mt-4 flex gap-6">
          <div>
            <dt className="eyebrow">{t(C.turns)}</dt>
            <dd className="tabular text-2xl font-bold leading-none">15</dd>
          </div>
          <div>
            <dt className="eyebrow">{t(C.slowOnes)}</dt>
            <dd className="tabular text-2xl font-bold leading-none text-wet">{slow}</dd>
          </div>
          <div>
            <dt className="eyebrow">{t(C.drsZones)}</dt>
            <dd className="tabular text-2xl font-bold leading-none text-amber">2</dd>
          </div>
        </dl>
      </header>
      <CircuitMap />
    </main>
  );
}
