"use client";

import { useRef, useState } from "react";
import type { RadioReply } from "./api/radio/route";
import { MAX_QUESTION, TOPICS, TOPIC_LABELS, type Topic } from "@/lib/radio";

type Line = { from: "you" | "engineer"; text: string; source?: RadioReply["source"] };

export default function TeamRadio({ tOverride }: { tOverride?: string }) {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  async function send(payload: { topic?: Topic; question?: string }, shown: string) {
    setBusy(true);
    setLines((l) => [...l, { from: "you", text: shown }]);
    try {
      const res = await fetch("/api/radio", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...payload, t: tOverride }),
      });
      const data = (await res.json()) as RadioReply | { error: string };
      setLines((l) => [
        ...l,
        "line" in data
          ? { from: "engineer", text: data.line, source: data.source }
          : { from: "engineer", text: data.error },
      ]);
    } catch {
      setLines((l) => [
        ...l,
        { from: "engineer", text: "Radio's cut out. Check your connection." },
      ]);
    } finally {
      setBusy(false);
      requestAnimationFrame(() =>
        logRef.current?.scrollTo({ top: logRef.current.scrollHeight }),
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

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full border border-amber/40 bg-surface px-4 py-3 text-sm font-semibold text-amber shadow-lg"
      >
        <span aria-hidden>📻</span> Team Radio
      </button>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-lg rounded-t-2xl border border-line bg-surface p-4 shadow-2xl">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber">
          Team Radio
        </p>
        <button
          onClick={() => setOpen(false)}
          className="px-2 text-sm text-muted"
          aria-label="Close team radio"
        >
          ✕
        </button>
      </div>

      <div ref={logRef} className="mt-3 max-h-56 overflow-y-auto">
        {lines.length === 0 ? (
          <p className="text-sm leading-relaxed text-muted">
            Radio check. Ask me anything about the weekend, or tap a preset.
          </p>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {lines.map((l, i) => (
              <li
                key={i}
                className={
                  l.from === "you"
                    ? "text-right text-sm text-muted"
                    : "border-l-2 border-amber pl-3 text-sm leading-relaxed"
                }
              >
                {l.text}
                {l.source === "template" && (
                  <span className="ml-2 text-[10px] uppercase tracking-wider text-muted">
                    preset
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {TOPICS.map((t) => (
          <button
            key={t}
            disabled={busy}
            onClick={() => void send({ topic: t }, TOPIC_LABELS[t])}
            className="rounded-full border border-line px-3 py-1.5 text-xs text-muted disabled:opacity-40"
          >
            {TOPIC_LABELS[t]}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={MAX_QUESTION}
          placeholder="Ask the engineer…"
          className="min-w-0 flex-1 rounded-xl bg-surface-2 px-3 py-2.5 text-sm outline-none placeholder:text-muted"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="rounded-xl bg-amber px-4 py-2.5 text-sm font-bold text-ink disabled:opacity-40"
        >
          {busy ? "…" : "Send"}
        </button>
      </form>
    </div>
  );
}
