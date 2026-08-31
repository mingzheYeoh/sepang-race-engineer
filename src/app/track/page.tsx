import CircuitMap from "./circuit-map";
import { CIRCUIT } from "@/lib/weekend";

export const metadata = {
  title: "Circuit Guide · Sepang Race Engineer",
  description:
    "All fifteen corners of Sepang International Circuit, each explaining one idea from Formula 1.",
};

export default function TrackPage() {
  return (
    <main className="flex flex-col gap-5">
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber">
          Circuit Guide
        </p>
        <h1 className="mt-1 text-4xl font-black leading-none tracking-tight">
          FIFTEEN
          <br />
          CORNERS
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {CIRCUIT.lengthKm} km, clockwise, two 927-metre straights. Hermann Tilke built
          Sepang around those straights &mdash; which is why it still overtakes better than
          most circuits built since.
        </p>
      </header>
      <CircuitMap />
    </main>
  );
}
