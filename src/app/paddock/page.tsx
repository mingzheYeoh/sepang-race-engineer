import Paddock from "./paddock";
import { getSepangWeather } from "@/lib/weather";
import { overrideNow } from "@/lib/weekend";
import { COPY } from "@/lib/copy";
import { pick } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";

export async function generateMetadata() {
  const locale = await getLocale();
  return {
    title: pick(COPY.meta.paddockTitle, locale),
    description: pick(COPY.meta.paddockDescription, locale),
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>;
}) {
  const { t } = await searchParams;
  const weather = await getSepangWeather();
  return <Paddock nowMs={overrideNow(t)} tOverride={t} weather={weather} />;
}
