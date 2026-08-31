import { DRS_ZONES, VIEWBOX, lapPath, zonePath } from "./circuit.ts";

/**
 * The home-screen and tab icon: the circuit, and nothing else.
 *
 * Shared by `app/icon.tsx` (browsers, Android install) and `app/apple-icon.tsx`
 * (iOS home screen) so the two can never drift. It is the same surveyed
 * polyline the app draws everywhere else, which also keeps the icon free of any
 * mark that is not ours to use.
 *
 * iOS masks the apple-touch-icon into a rounded square and does not honour
 * transparency, so the tile paints its own opaque ground and the drawing is
 * inset well clear of the corners that get clipped.
 */
export function IconArt({ px }: { px: number }) {
  const inset = Math.round(px * 0.16);
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#07090d",
      }}
    >
      <svg width={px - inset * 2} height={(px - inset * 2) * 0.842} viewBox={VIEWBOX}>
        <path d={lapPath()} fill="none" stroke="#eef2f8" strokeWidth={54} strokeLinejoin="round" />
        {DRS_ZONES.map((z, i) => (
          <path key={i} d={zonePath(z)} fill="none" stroke="#ffc61e" strokeWidth={54} />
        ))}
      </svg>
    </div>
  );
}
