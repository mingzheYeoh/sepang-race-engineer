# Sepang Race Engineer — Design Spec

**Date:** 2026-08-31
**Status:** Approved
**Reference weekend:** 2 – 4 October (organiser-designated reference race weekend)

## 1. What this is

An unofficial fan web app for a Sepang F1 Grand Prix weekend. Not a menu of
features — a companion that knows where you are in the weekend, where you are
on the circuit, and talks to you in the voice of a race engineer.

Three axes hold eight required feature areas together:

| Axis | Mechanism | Serves |
| --- | --- | --- |
| Time (primary) | App resolves the current weekend phase; the home screen changes shape | Clear user flow |
| Space | Interactive circuit map: 15 corners, DRS zones, grandstands, facilities | Sepang focus |
| Persona | Team-radio style AI engineer, globally available | Creative execution |

## 2. Requirement coverage

| Requirement | Where it lands |
| --- | --- |
| Sepang GP weekend planning | `/` Paddock, PRE phase |
| Sepang circuit guide | `/track` Circuit |
| Race-day weather, rain, tyres, pit strategy | `/pitwall` Pit Wall |
| Beginner F1 education set at Sepang | `/track`, corner detail panels |
| Fan prediction tool | `/predict` Grid Call |
| Sepang F1 history, quiz, timeline | `/history` Archive |
| Race-day assistance dashboard | `/` Paddock, RACE phase |
| AI pit wall / race engineer simulator | Global Team Radio |

## 3. Routes

| Route | Name | Purpose |
| --- | --- | --- |
| `/` | Paddock | Phase-adaptive home. Countdown, weather, plan or dashboard. |
| `/track` | Circuit | Interactive SVG map. Tap a corner for the guide and the F1 lesson. |
| `/pitwall` | Pit Wall | Weather to tyre degradation to pit-window recommendation. |
| `/history` | Archive | 1999–2017 Sepang timeline, results, quiz. |
| `/predict` | Grid Call | Predictions, locked at qualifying, shareable card. |
| — | Team Radio | Global floating panel on every route. |

The home screen is not a nav menu. It is a single surface that re-renders per
phase, so the user never has to decide where to go.

## 4. Data layer

Four sources, shared by every module.

| Module | Kind | Source |
| --- | --- | --- |
| `lib/data/circuit.ts` | Static | 15 corners, DRS zones, grandstands, facilities. SVG geometry plus copy. |
| `lib/data/weekend.ts` | Static | Session schedule for 2–4 Oct in `Asia/Kuala_Lumpur`. |
| `lib/weather.ts` | Live | Open-Meteo, keyless. Verified against 2.7603, 101.7382. Must pass `timezone=Asia/Kuala_Lumpur`; the API defaults to GMT. Served through a route handler, cached 10 minutes. |
| `lib/data/history.ts` | Static | 1999–2017 Sepang results, pulled once from Jolpica-F1 and frozen to JSON. |

History is frozen at build time rather than fetched at runtime. Sepang's last
F1 race was 2017, so the data cannot change; a runtime dependency would add
failure modes and buy nothing. Ergast shut down at the end of 2024 — Jolpica-F1
is the URL-compatible community successor, verified returning HTTP 200.

## 5. Engines

Two pieces of non-trivial logic. Both get a runnable check.

### 5.1 Phase resolver

`resolvePhase(now) -> PRE | FP1 | FP2 | FP3 | QUALI | RACE | POST`

Accepts a `?t=` ISO override so any phase can be demonstrated and tested from
any real-world date. Without it the race-day interface is unreachable outside
2–4 October, which would make both the demo and the tests impossible.

### 5.2 Tyre and pit model

`pitPlan(trackTemp, rainProb, compound) -> degradation curve + suggested stop laps`

A transparent formula, not simulated precision. Sepang constants live in the
open where they can be challenged: 56 laps, 5.543 km, track temperature
routinely above 50 C, historically a two-stop circuit.

## 6. AI engineer, with graceful degradation

```
user question / "ask the engineer"
  -> rule engine produces a structured fact object
     (air temp, track temp, rain probability, suggested stop lap, phase)
  -> ANTHROPIC_API_KEY present?
     yes -> Claude Haiku 4.5 + team-radio persona prompt -> spoken line
     no  -> template render of the same fact object
```

Both paths consume the identical fact object, so a missing key costs voice, not
function. The rule engine owns every number; the model only phrases them. The
reverse — letting the model compute degradation — produces confident, wrong
figures that anyone who follows F1 will spot immediately.

## 7. Non-official use

No F1, FIA, or Sepang International Circuit marks, logos, or official colour
schemes. Driver and team names appear only as factual reference. A persistent
footer reads:

> Unofficial fan project. Not affiliated with Formula 1, FIA, or Sepang
> International Circuit.

The 2026 Sepang return is this project's premise, not a real announcement, and
the home screen states so plainly.

## 8. Non-goals

No database, no accounts, no login. Predictions persist in `localStorage`.
No real-time timing or telemetry — no lawful public source exists, and
scraping one would breach the non-official-use requirement.

## 9. Delivery phases

| Phase | Scope | Exit condition |
| --- | --- | --- |
| P1 | Scaffold, data layer, phase resolver, Paddock home, deploy | Public URL live |
| P2 | Circuit map, Pit Wall, engine tests | Core experience complete |
| P3 | Team Radio with fallback, Archive, Grid Call | All eight areas covered |

P1 ends with a reachable public address. Every later phase adds to a site that
is already live, so deployment is never the last thing attempted.

## 10. Stack

Next.js App Router, TypeScript, Tailwind, deployed on Vercel. Serverless route
handlers hold the weather cache and the Anthropic key. Mobile-first: the design
target is one-handed use, in direct sun, on congested 4G.
