import CircuitMap from "./circuit-map";
import { CORNERS, LAP_METRES } from "@/lib/circuit";

export const metadata = {
  title: "Circuit Guide | Sepang Race Engineer",
  description:
    "All fifteen corners of Sepang International Circuit, drawn to scale, each explaining one idea from Formula 1.",
};

export default function TrackPage() {
  const slow = CORNERS.filter((c) => c.speed === "slow").length;

  return (
    <main className="flex flex-col gap-5">
      <header>
        <p className="eyebrow">Circuit Guide</p>
        <h1 className="display mt-1.5 text-[2.75rem] font-bold leading-[0.92] tracking-tight">
          FIFTEEN
          <br />
          <span className="text-amber">CORNERS</span>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {LAP_METRES.toLocaleString()} m of surveyed centre line, clockwise, north up. Two long
          straights run the length of the circuit and meet a slow corner at each end &mdash; which
          is why Sepang still overtakes better than most tracks built since.
        </p>
        <dl className="mt-4 flex gap-6">
          <div>
            <dt className="eyebrow">Turns</dt>
            <dd className="tabular text-2xl font-bold leading-none">15</dd>
          </div>
          <div>
            <dt className="eyebrow">Slow ones</dt>
            <dd className="tabular text-2xl font-bold leading-none text-wet">{slow}</dd>
          </div>
          <div>
            <dt className="eyebrow">DRS zones</dt>
            <dd className="tabular text-2xl font-bold leading-none text-amber">2</dd>
          </div>
        </dl>
      </header>
      <CircuitMap />
    </main>
  );
}
