import CircuitMap from "./circuit-map";
import { LAP_METRES } from "@/lib/circuit";

export const metadata = {
  title: "Circuit Guide | Sepang Race Engineer",
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
          {LAP_METRES} m of surveyed centre line, clockwise, north up. Two long straights
          run the length of the circuit and meet a slow corner at each end &mdash; which is
          why Sepang still overtakes better than most tracks built since.</p>
      </header>
      <CircuitMap />
    </main>
  );
}
