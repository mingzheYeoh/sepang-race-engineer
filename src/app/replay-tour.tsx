"use client";

import { SEEN, TOUR_EVENT } from "./tour";
import { COPY } from "@/lib/copy";
import { useT } from "@/lib/locale-context";

/** A dismissed tour has to be recoverable, or the explanation is gone for good. */
export default function ReplayTour() {
  const t = useT();
  return (
    <button
      onClick={() => {
        try {
          localStorage.removeItem(SEEN);
        } catch {
          /* the event alone still reopens it for this visit */
        }
        window.dispatchEvent(new Event(TOUR_EVENT));
      }}
      className="flex min-h-11 items-center gap-1.5 text-xs font-semibold text-muted transition-colors hover:text-amber"
    >
      <span aria-hidden>↺</span>
      {t(COPY.tour.reopen)}
    </button>
  );
}
