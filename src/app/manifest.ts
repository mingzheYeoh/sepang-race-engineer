import type { MetadataRoute } from "next";
import { COPY } from "@/lib/copy";

/**
 * Makes "Add to Home Screen" produce a real app tile on Android and iOS.
 *
 * Static and English on purpose: the manifest is read once at install time,
 * before any cookie of ours exists, and a name that changed with the reader's
 * language would leave two differently-labelled tiles on the same phone.
 *
 * `display: standalone` drops the browser chrome, which is why the layout pins
 * the safe-area padding — in standalone there is no browser toolbar between the
 * tab bar and the home indicator.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: COPY.meta.appTitle.en,
    short_name: "Sepang",
    description: COPY.meta.appDescription.en,
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#07090d",
    theme_color: "#07090d",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
