import StrategyBoard from "./strategy-board";
import { getSepangWeather } from "@/lib/weather";
import { CIRCUIT } from "@/lib/weekend";

export const metadata = {
  title: "Pit Wall | Sepang Race Engineer",
  description:
    "Track temperature, tyre degradation and the pit-stop call for a Sepang Grand Prix — a transparent model you can argue with.",
};

export default async function PitWallPage() {
  const weather = await getSepangWeather();

  return (
    <main className="flex flex-col gap-5">
      <header>
        <p className="eyebrow">Pit Wall</p>
        <h1 className="display mt-1.5 text-[2.75rem] font-bold leading-[0.92] tracking-tight">
          THE
          <br />
          <span className="text-amber">CALL</span>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {CIRCUIT.laps} laps in tropical heat. Sepang was known as a two-stop race when most
          circuits were one, and the reason is on this page: track temperature drives tyre wear,
          tyre wear drives the number of stops, and everything else follows.
        </p>
      </header>
      <StrategyBoard live={weather?.now ?? null} />
    </main>
  );
}
