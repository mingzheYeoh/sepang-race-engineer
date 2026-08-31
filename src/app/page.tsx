import Paddock from "./paddock";
import { getSepangWeather } from "@/lib/weather";
import { overrideNow } from "@/lib/weekend";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>;
}) {
  const { t } = await searchParams;
  const weather = await getSepangWeather();
  return <Paddock nowMs={overrideNow(t)} tOverride={t} weather={weather} />;
}
