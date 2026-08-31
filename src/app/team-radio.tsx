"use client";

import { useEffect, useRef, useState } from "react";
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

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  async function send(payload: { topic?: Topic; question?: string }, shown: string) {
    setBusy(true);
    setLines((l) => [...l, { from: "you", text: shown }]);
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
      requestAnimationFrame(() =>
        logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" }),
      );
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
        className="rise relative mx-auto w-full max-w-lg rounded-t-3xl border-x border-t border-line bg-surface"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}
      >
        {/* Drag handle: tells a thumb this panel is dismissible. */}
        <div className="flex justify-center pt-3">
          <span className="h-1 w-10 rounded-full bg-line" />
        </div>

        <div className="flex items-center justify-between px-5 pt-3">
          <p className="eyebrow" style={{ color: "var(--color-amber)" }}>
            {t(COPY.radio.title)}
          </p>
          <button onClick={onClose} className="-m-2 p-2 text-sm text-muted" aria-label={t(COPY.radio.close)}>
            ✕
          </button>
        </div>

        <div ref={logRef} className="mt-3 max-h-[38dvh] overflow-y-auto px-5">
          {lines.length === 0 ? (
            <p className="text-sm leading-relaxed text-muted">
              {t(COPY.radio.check)}
            </p>
          ) : (
            <ul className="flex flex-col gap-3 pb-1">
              {lines.map((l, i) => (
                <li
                  key={i}
                  className={
                    l.from === "you"
                      ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-surface-2 px-3.5 py-2 text-sm"
                      : "max-w-[92%] border-l-2 border-amber pl-3 text-sm leading-relaxed"
                  }
                >
                  {l.text}
                  {l.source === "template" && (
                    <span className="eyebrow ml-2 align-middle">{t(COPY.radio.presetTag)}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rail mt-4 flex gap-2 overflow-x-auto px-5 pb-1">
          {TOPICS.map((topic) => (
            <button
              key={topic}
              disabled={busy}
              onClick={() => void send({ topic: topic }, t(TOPIC_LABELS[topic]))}
              className="shrink-0 rounded-full border border-line px-3.5 py-2 text-xs text-muted transition-colors active:border-amber active:text-amber disabled:opacity-40"
            >
              {t(TOPIC_LABELS[topic])}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="mt-3 flex gap-2 px-5">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={MAX_QUESTION}
            placeholder={t(COPY.radio.placeholder)}
            aria-label={t(COPY.radio.inputLabel)}
            className="min-w-0 flex-1 rounded-xl bg-surface-2 px-3.5 py-3 text-base outline-none ring-amber/60 placeholder:text-muted focus:ring-2"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="display rounded-xl bg-amber px-5 py-3 text-sm font-bold text-ink transition-opacity disabled:opacity-40"
          >
            {busy ? "…" : t(COPY.radio.send)}
          </button>
        </form>
      </div>
    </div>
  );
}
