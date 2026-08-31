"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { COPY } from "@/lib/copy";
import { useT } from "@/lib/locale-context";

/**
 * The way back out of any page.
 *
 * It always points at the landing page rather than calling `router.back()`:
 * history can lead anywhere — a shared Grid Call link, a bookmarked `/visit` —
 * and a control whose destination changes with how you arrived is the one people
 * stop trusting. The hierarchy here is one level deep, so "back" and "home" are
 * genuinely the same place.
 *
 * The `?t=` demo override is carried across, or the back button would silently
 * drop you out of the moment in the weekend you were inspecting.
 */
export default function BackLink() {
  const path = usePathname();
  const t = useT();
  const tOverride = useSearchParams().get("t");

  if (path === "/") return <span />;

  return (
    <Link
      href={tOverride ? `/?t=${encodeURIComponent(tOverride)}` : "/"}
      className="-ml-1 flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold text-muted transition-colors hover:text-amber"
    >
      <span aria-hidden className="text-sm leading-none">
        ←
      </span>
      {t(COPY.nav.back)}
    </Link>
  );
}
