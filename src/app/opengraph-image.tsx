import { ImageResponse } from "next/og";
import { DRS_ZONES, VIEWBOX, lapPath, zonePath } from "@/lib/circuit";
import { CIRCUIT } from "@/lib/weekend";

/**
 * The link preview for a shared card.
 *
 * The Grid Call has a share button, so this page's URL travels on its own. It
 * draws the same surveyed geometry the app draws, so the preview is the circuit
 * rather than a logo — and there is no logo to misuse.
 *
 * English only: a locale cookie is not readable here, and satori would need a
 * whole CJK font file shipped to render Chinese. The title is a proper noun in
 * either language.
 */
export const alt = "Sepang Race Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const LAP_D = lapPath();

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: "#07090d",
          color: "#eef2f8",
          padding: 64,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ fontSize: 22, letterSpacing: 4, color: "#ffc61e" }}>
            2 – 4 OCTOBER 2026
          </div>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, marginTop: 16 }}>
            Sepang
          </div>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, color: "#ffc61e" }}>
            Race Engineer
          </div>
          <div style={{ fontSize: 26, color: "#8996ac", marginTop: 24, maxWidth: 520 }}>
            Schedule, tropical weather, a to-scale circuit guide and a pit-wall
            strategy model.
          </div>
          <div style={{ fontSize: 18, color: "#8996ac", marginTop: 28, display: "flex" }}>
            {`${CIRCUIT.lengthKm} km · ${CIRCUIT.corners} corners · ${CIRCUIT.laps} laps · unofficial fan project`}
          </div>
        </div>

        <svg width={430} height={362} viewBox={VIEWBOX}>
          <path d={LAP_D} fill="none" stroke="#2b3442" strokeWidth={34} strokeLinejoin="round" />
          <path d={LAP_D} fill="none" stroke="#eef2f8" strokeWidth={20} strokeLinejoin="round" />
          {DRS_ZONES.map((z, i) => (
            <path key={i} d={zonePath(z)} fill="none" stroke="#ffc61e" strokeWidth={20} />
          ))}
        </svg>
      </div>
    ),
    size,
  );
}
