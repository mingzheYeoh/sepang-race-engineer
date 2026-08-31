import StrategyBoard from "./strategy-board";
import { getSepangWeather } from "@/lib/weather";
import { CIRCUIT } from "@/lib/weekend";
import { COPY } from "@/lib/copy";
import { pick } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";

export const metadata = {
  title: "Pit Wall | Sepang Race Engineer",
  description:
    "Track temperature, tyre degradation and the pit-stop call for a Sepang Grand Prix — a transparent model you can argue with.",
};

export default async function PitWallPage() {
  const [weather, locale] = await Promise.all([getSepangWeather(), getLocale()]);
  const t = (s: { en: string; zh: string }) => pick(s, locale);
  const C = COPY.pitwall;

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
          {CIRCUIT.laps} {t(C.intro)}
        </p>
      </header>
      <StrategyBoard live={weather?.now ?? null} />
    </main>
  );
}
