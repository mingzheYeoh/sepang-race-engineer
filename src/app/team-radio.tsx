"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { RadioReply } from "./api/radio/route";
import { MAX_QUESTION, TOPICS, TOPIC_LABELS, type Topic } from "@/lib/radio";
import { COPY } from "@/lib/copy";
import { useLocale, useT } from "@/lib/locale-context";

type Line = { from: "you" | "engineer"; text: string; source?: RadioReply["source"] };

export default function TeamRadio({ open, onClose }: { open: boolean; onClose: () => void }) {
  // Read from the URL rather than a prop so the radio stays in sync with the
  // page's time override on every route.
  const tOverride = useSearchParams().get("t") ?? undefined;
  const locale = useLocale();
  const t = useT();
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Opening the panel puts the cursor where it is wanted — but only on a
  // pointer-capable screen. Focusing an input on a phone throws the keyboard up
  // over the preset chips, which are the faster way in on a phone.
  useEffect(() => {
    if (!open) return;
    if (window.matchMedia("(hover: hover)").matches) inputRef.current?.focus();
  }, [open]);

  const scrollDown = useCallback(() => {
    requestAnimationFrame(() =>
      logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" }),
    );
  }, []);

  async function send(payload: { topic?: Topic; question?: string }, shown: string) {
    setBusy(true);
    setLines((l) => [...l, { from: "you", text: shown }]);
    // Scroll on the way out as well as on the way back, so your own message is
    // never posted below the fold while you wait for the answer.
    scrollDown();
    try {
      const res = await fetch("/api/radio", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...payload, t: tOverride, locale }),
      });
      const data = (await res.json()) as RadioReply | { error: string };
      setLines((l) => [
        ...l,
        "line" in data
          ? { from: "engineer", text: data.line, source: data.source }
          : { from: "engineer", text: data.error },
      ]);
    } catch {
      setLines((l) => [...l, { from: "engineer", text: t(COPY.radio.dropped) }]);
    } finally {
      setBusy(false);
      scrollDown();
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = input.trim();
    if (!q || busy) return;
    setInput("");
    void send({ question: q }, q);
  }

  if (!open) return null;

  const left = MAX_QUESTION - input.length;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button
        aria-label={t(COPY.radio.closeRadio)}
        onClick={onClose}
        className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-label="Team radio"
        className="rise relative mx-auto flex w-full max-w-lg flex-col rounded-t-3xl border-x border-t border-line bg-surface"
        style={{ paddingBottom: "calc(max(env(safe-area-inset-bottom), 10px) + 12px)" }}
      >
        {/* Drag handle: tells a thumb this panel is dismissible. */}
        <div className="flex justify-center pt-3">
          <span className="h-1 w-10 rounded-full bg-line" />
        </div>

        <div className="flex items-center gap-3 px-5 pt-3">
          <span className="flex items-center gap-2">
            <span
              aria-hidden
              className={`size-2 rounded-full ${busy ? "animate-pulse bg-amber" : "bg-line"}`}
            />
            <span className="eyebrow" style={{ color: "var(--color-amber)" }}>
              {t(COPY.radio.title)}
            </span>
          </span>
          <span className="flex-1" />
          {lines.length > 0 && (
            <button
              onClick={() => setLines([])}
              disabled={busy}
              className="flex min-h-10 items-center rounded-full px-3 text-[11px] text-muted transition-colors hover:text-text disabled:opacity-40"
            >
              {t(COPY.radio.clear)}
            </button>
          )}
          <button
            onClick={onClose}
            className="-mr-2 flex size-11 items-center justify-center rounded-full text-sm text-muted transition-colors hover:text-text"
            aria-label={t(COPY.radio.close)}
          >
            <span aria-hidden>✕</span>
          </button>
        </div>

        {/* A floor on the height stops the panel jumping as the first lines land. */}
        <div
          ref={logRef}
          className="mt-3 max-h-[38dvh] min-h-[7rem] overflow-y-auto overscroll-contain px-5"
          aria-live="polite"
        >
          {lines.length === 0 ? (
            <p className="text-sm leading-relaxed text-muted">{t(COPY.radio.check)}</p>
          ) : (
            <ul className="flex flex-col gap-3.5 pb-2">
              {lines.map((l, i) =>
                l.from === "you" ? (
                  <li key={i} className="ml-auto max-w-[85%]">
                    <span className="block rounded-2xl rounded-br-sm bg-surface-2 px-3.5 py-2 text-sm">
                      {l.text}
                    </span>
                  </li>
                ) : (
                  <li key={i} className="max-w-[92%] border-l-2 border-amber pl-3">
                    {/* Naming the speaker keeps a model's answer from reading as
                        the app's own voice, and says which floor answered. */}
                    <span className="eyebrow flex items-baseline gap-2">
                      <span style={{ color: "var(--color-amber)" }}>{t(COPY.radio.engineer)}</span>
                      <span className="font-normal normal-case tracking-normal text-muted">
                        {l.source === "template"
                          ? t(COPY.radio.presetTag)
                          : l.source === "model"
                            ? t(COPY.radio.live)
                            : ""}
                      </span>
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed">{l.text}</span>
                  </li>
                ),
              )}
              {busy && (
                <li className="max-w-[92%] border-l-2 border-line pl-3">
                  <span className="eyebrow text-muted">{t(COPY.radio.thinking)}</span>
                  <span className="mt-1.5 flex gap-1" aria-hidden>
                    {[0, 1, 2].map((n) => (
                      <span
                        key={n}
                        className="size-1.5 animate-pulse rounded-full bg-muted"
                        style={{ animationDelay: `${n * 180}ms` }}
                      />
                    ))}
                  </span>
                </li>
              )}
            </ul>
          )}
        </div>

        {/* A rule keeps the controls from reading as another radio line. */}
        <div className="mt-3 border-t border-line-soft px-5 pt-3">
          <p className="eyebrow">{t(COPY.radio.presetsLabel)}</p>
          <div className="rail mt-2 flex gap-2 overflow-x-auto pb-1">
            {TOPICS.map((topic) => (
              <button
                key={topic}
                disabled={busy}
                onClick={() => void send({ topic }, t(TOPIC_LABELS[topic]))}
                className="flex min-h-10 shrink-0 items-center rounded-full border border-line px-4 text-xs text-muted transition-colors hover:border-amber hover:text-amber active:border-amber active:text-amber disabled:opacity-40"
              >
                {t(TOPIC_LABELS[topic])}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={submit} className="mt-3 flex items-start gap-2 px-5">
          <div className="relative min-w-0 flex-1">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={MAX_QUESTION}
              placeholder={t(COPY.radio.placeholder)}
              aria-label={t(COPY.radio.inputLabel)}
              className="w-full rounded-xl bg-surface-2 px-3.5 py-3 text-base outline-none ring-amber/60 placeholder:text-muted focus:ring-2"
            />
            {/* Only appears once the cap is actually in reach. */}
            {left <= 40 && (
              <span className="tabular absolute -top-4 right-1 text-[10px] text-muted">{left}</span>
            )}
          </div>
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="display shrink-0 rounded-xl bg-amber px-5 py-3 text-sm font-bold text-ink transition-opacity disabled:opacity-40"
          >
            {t(COPY.radio.send)}
          </button>
        </form>
      </div>
    </div>
  );
}
