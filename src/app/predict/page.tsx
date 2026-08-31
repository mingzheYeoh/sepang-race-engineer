import { Suspense } from "react";
import GridCall from "./grid-call";
import { getSepangWeather } from "@/lib/weather";
import { COPY } from "@/lib/copy";
import { pick } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";

export async function generateMetadata() {
  const locale = await getLocale();
  return {
    title: pick(COPY.meta.predictTitle, locale),
    description: pick(COPY.meta.predictDescription, locale),
  };
}

export default async function PredictPage() {
  const [weather, locale] = await Promise.all([getSepangWeather(), getLocale()]);
  const t = (s: { en: string; zh: string }) => pick(s, locale);
  const C = COPY.predict;

  return (
    <main className="flex flex-col gap-5">
      <header>
        <p className="eyebrow">{t(C.eyebrow)}</p>
        <h1 className="display mt-1.5 text-[2.75rem] font-bold leading-[0.92] tracking-tight">
          {t(C.titleTop)}
          <br />
          <span className="text-amber">{t(C.titleBottom)}</span>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">{t(C.intro)}</p>
      </header>
      <Suspense fallback={null}>
        <GridCall live={weather?.now ?? null} />
      </Suspense>
    </main>
  );
}
