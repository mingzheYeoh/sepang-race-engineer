"use client";

import { useMemo, useState } from "react";
import { QUIZ_LENGTH, buildQuiz } from "@/lib/history";
import { COPY, fill } from "@/lib/copy";
import { useT } from "@/lib/locale-context";

type Phase = { i: number; picked: number | null; score: number } | null;

export default function Quiz() {
  const t = useT();
  const C = COPY.archive;

  // A new seed per round; the same seed always rebuilds the same six questions,
  // which is what makes the quiz testable at all.
  const [seed, setSeed] = useState(1);
  const [state, setState] = useState<Phase>(null);
  const quiz = useMemo(() => buildQuiz(seed), [seed]);

  if (!state) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-5">
        <p className="text-sm leading-relaxed text-muted">{t(C.quizIntro)}</p>
        <button
          onClick={() => setState({ i: 0, picked: null, score: 0 })}
          className="display mt-4 w-full rounded-xl bg-amber py-3 text-sm font-bold text-ink"
        >
          {t(C.start)}
        </button>
      </div>
    );
  }

  if (state.i >= quiz.length) {
    const verdict =
      state.score >= quiz.length - 1 ? C.verdictHigh : state.score >= quiz.length / 2 ? C.verdictMid : C.verdictLow;
    return (
      <div className="rise rounded-2xl border border-amber/40 bg-surface p-5 text-center">
        <p className="tabular text-[3.5rem] font-bold leading-none text-amber">
          {state.score}/{quiz.length}
        </p>
        <p className="mt-2 text-sm">
          {fill(t(C.scored), { S: state.score, T: quiz.length })}
        </p>
        <p className="mt-1 text-sm text-muted">{t(verdict)}</p>
        <button
          onClick={() => {
            setSeed((s) => s + 1);
            setState({ i: 0, picked: null, score: 0 });
          }}
          className="display mt-5 w-full rounded-xl border border-line py-3 text-sm font-bold"
        >
          {t(C.again)}
        </button>
      </div>
    );
  }

  const q = quiz[state.i];
  const answered = state.picked !== null;
  const right = state.picked === q.answer;

  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="eyebrow">{fill(t(C.question), { N: state.i + 1, T: quiz.length })}</p>
        <p className="tabular text-xs text-muted">
          {state.score}/{QUIZ_LENGTH}
        </p>
      </div>
      {/* Progress: a quiz with no visible end is a quiz people abandon. */}
      <div className="mt-2 flex gap-1">
        {quiz.map((_, i) => (
          <span
            key={i}
            className={`h-0.5 flex-1 rounded-full ${i < state.i ? "bg-amber" : "bg-line"}`}
          />
        ))}
      </div>

      <p className="mt-4 text-base leading-snug">{t(q.prompt)}</p>

      <ul className="mt-4 flex flex-col gap-2">
        {q.options.map((opt, i) => {
          const isAnswer = i === q.answer;
          const isPick = state.picked === i;
          const tone = !answered
            ? "border-line"
            : isAnswer
              ? "border-amber bg-amber/10"
              : isPick
                ? "border-wet/60 opacity-70"
                : "border-line opacity-40";
          return (
            <li key={opt}>
              <button
                disabled={answered}
                onClick={() =>
                  setState((s) =>
                    s ? { ...s, picked: i, score: s.score + (i === q.answer ? 1 : 0) } : s,
                  )
                }
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors ${tone}`}
              >
                {opt}
                {answered && isAnswer && <span className="float-right text-amber">✓</span>}
              </button>
            </li>
          );
        })}
      </ul>

      {answered && (
        <div className="rise mt-4">
          <p className={`display text-sm font-bold ${right ? "text-amber" : "text-wet"}`}>
            {right ? t(C.correct) : t(C.wrong)}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted">{t(q.note)}</p>
          <button
            onClick={() => setState((s) => (s ? { ...s, i: s.i + 1, picked: null } : s))}
            className="display mt-4 w-full rounded-xl bg-amber py-3 text-sm font-bold text-ink"
          >
            {state.i === quiz.length - 1 ? t(C.seeScore) : t(C.next)}
          </button>
        </div>
      )}
    </div>
  );
}
