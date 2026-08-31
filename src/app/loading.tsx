import { COPY } from "@/lib/copy";
import { pick } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";

/**
 * The instant answer to a tap.
 *
 * Every route here is server-rendered on demand, because the layout reads the
 * language and theme cookies. Without a loading boundary the default prefetch
 * has nothing to fetch for a dynamic route, so a tab press did nothing visible
 * until the server came back — around a third of a second on a good connection,
 * and considerably worse on race-day mobile data.
 *
 * One file at the root covers every segment. The bars mirror the shape every
 * page shares — eyebrow, heading, standfirst, panels — so the swap to real
 * content is a fill rather than a jump.
 */
export default async function Loading() {
  const locale = await getLocale();

  return (
    <main className="flex flex-col gap-6" aria-busy="true">
      <span className="sr-only" role="status">
        {pick(COPY.nav.loading, locale)}
      </span>

      <div aria-hidden className="animate-pulse">
        <div className="h-2 w-24 rounded bg-line-soft" />
        <div className="mt-4 h-11 w-3/5 rounded-lg bg-line-soft" />
        <div className="mt-2 h-11 w-2/5 rounded-lg bg-line-soft" />
        <div className="mt-5 flex flex-col gap-2">
          <div className="h-3 w-full rounded bg-line-soft" />
          <div className="h-3 w-11/12 rounded bg-line-soft" />
          <div className="h-3 w-3/5 rounded bg-line-soft" />
        </div>
        <div className="mt-7 flex flex-col gap-3">
          <div className="h-24 rounded-2xl border border-line bg-surface" />
          <div className="h-24 rounded-2xl border border-line bg-surface" />
        </div>
      </div>
    </main>
  );
}
