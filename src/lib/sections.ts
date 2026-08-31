import { COPY } from "./copy.ts";
import type { L } from "./i18n.ts";

/**
 * The six tools, in the order a first-time visitor should meet them.
 *
 * One list, three readers: the landing page links it, the first-run tour
 * explains it, and a test walks it to check every route still exists. A seventh
 * feature added here shows up in all three without anyone remembering to.
 */
export type Section = { href: string; glyph: string; title: L; sub: L };

export const SECTIONS: Section[] = [
  { href: "/paddock", glyph: "▣", title: COPY.nav.paddock, sub: COPY.home.paddockSub },
  { href: "/track", glyph: "◎", title: COPY.nav.circuit, sub: COPY.home.circuitSub },
  { href: "/pitwall", glyph: "◈", title: COPY.nav.pitwall, sub: COPY.home.pitwallSub },
  { href: "/visit", glyph: "⌖", title: COPY.paddock.goVisit, sub: COPY.home.visitSub },
  { href: "/predict", glyph: "◇", title: COPY.paddock.goPredict, sub: COPY.home.predictSub },
  { href: "/archive", glyph: "▤", title: COPY.paddock.goArchive, sub: COPY.home.archiveSub },
];
