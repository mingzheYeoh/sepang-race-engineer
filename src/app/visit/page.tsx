import StandPicker from "./stand-picker";
import { getSepangWeather } from "@/lib/weather";
import { COPY } from "@/lib/copy";
import { pick } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";

export async function generateMetadata() {
  const locale = await getLocale();
  return {
    title: pick(COPY.meta.visitTitle, locale),
    description: pick(COPY.meta.visitDescription, locale),
  };
}

const MAPS = "https://www.google.com/maps/search/?api=1&query=2.7603,101.7382";

export default async function VisitPage() {
  const [weather, locale] = await Promise.all([getSepangWeather(), getLocale()]);
  const t = (s: { en: string; zh: string }) => pick(s, locale);
  const C = COPY.visit;

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
      </header>

      <StandPicker live={weather?.now ?? null} />

      <section>
        <p className="eyebrow">{t(C.gettingHere)}</p>
        <div className="rule mt-2" />
        <dl className="mt-3 flex flex-col">
          <Row k={t(C.address)} v={t(C.addressValue)} />
          <Row k={t(C.fromAirport)} v={t(C.fromAirportValue)} />
          <Row k={t(C.fromCity)} v={t(C.fromCityValue)} />
        </dl>
        <a
          href={MAPS}
          target="_blank"
          rel="noopener noreferrer"
          className="display mt-3 inline-block rounded-xl border border-line px-4 py-2.5 text-xs font-bold text-muted"
        >
          {t(C.openMaps)} ↗
        </a>
      </section>

      <section>
        <p className="eyebrow">{t(C.tourTitle)}</p>
        <div className="rule mt-2" />
        <p className="mt-3 text-sm leading-relaxed">{t(C.tourBody)}</p>
      </section>

      {/* Saying "not published" is the honest answer, and a far better one than
          a plausible guess about where to leave a car. */}
      <section className="rounded-2xl border border-dashed border-line p-5">
        <p className="eyebrow">{t(C.parkingTitle)}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">{t(C.parkingBody)}</p>
      </section>

      <p className="text-[11px] leading-relaxed text-muted">{t(C.sourceNote)}</p>
    </main>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-line-soft py-2.5 last:border-0">
      <dt className="eyebrow">{k}</dt>
      <dd className="text-sm">{v}</dd>
    </div>
  );
}
