# Sepang Race Engineer

An unofficial companion for a Formula 1 weekend at Sepang International Circuit —
the 2026 Bahrain Grand Prix, held in Malaysia on **2–4 October 2026**.

**Live: https://sepang-race-engineer.vercel.app**

English · [中文](README.zh-CN.md)

<table>
  <tr>
    <td width="33%"><img src="docs/screenshots/home.png" alt="Landing page: the surveyed circuit outline over the Sepang wordmark, with the six tools listed below"></td>
    <td width="33%"><img src="docs/screenshots/circuit.png" alt="Circuit guide: all fifteen corners numbered on the surveyed centre line, with both DRS zones marked"></td>
    <td width="33%"><img src="docs/screenshots/pitwall.png" alt="Pit wall: estimated track temperature and the two-stop strategy the model derived from it"></td>
  </tr>
  <tr>
    <td align="center"><sub>Home</sub></td>
    <td align="center"><sub>Circuit — 15 corners, 1:1</sub></td>
    <td align="center"><sub>Pit Wall — the model's call</sub></td>
  </tr>
</table>

Bilingual (English / 中文) and dual-theme (dark / light), both chosen on the
server from a cookie so there is no flash of the wrong language or the wrong
ground.

## What it does

| Route | What it is |
| --- | --- |
| `/` | **Home** — what this is, and the way into each of the six tools. A first visit gets a four-step tour; it stands down for a link that carries a shared card or a demo timestamp. |
| `/paddock` | **Paddock** — where the weekend is right now: the live session or the countdown to the next one, the hour-by-hour tropical forecast, and one piece of advice derived from it. |
| `/track` | **Circuit** — all 15 corners drawn 1:1 from surveyed coordinates. Each corner explains one idea from Formula 1. |
| `/pitwall` | **Pit Wall** — a transparent tyre model. Every constant is on the page; the strategy is searched, not hardcoded. |
| `/archive` | **Archive** — all 19 Malaysian Grands Prix at Sepang, 1999–2017, plus a quiz generated from the results themselves. |
| `/predict` | **Grid Call** — five calls on the race, each priced against what those 19 races actually did. Shareable as a link. |
| `/visit` | **Plan Your Visit** — which grandstand to sit in, weighed against the live weather, and how to get there. |
| `/api/radio` | **Team Radio** — answers a free-text question. The rules compute the numbers; the model only phrases them. |

## Two ideas the code is built around

**The model is not told the answer.** The tyre model in `src/lib/strategy.ts`
is given lap times, degradation rates and a pit loss, and searches
`(lap, stops, compound)` for the cheapest race. It is never told that Sepang is
a two-stop circuit — it derives one stop at 30 °C, two at 38–52 °C, three above
58 °C. The tests pin *properties* ("more heat must never mean fewer stops")
rather than answers, so the model stays free to be right in a way the test did
not anticipate.

**The rules own the numbers; the LLM only phrases them.** `/api/radio` computes
every fact server-side and passes them to the model as context. There is a
template floor underneath, so the feature answers correctly with no API key, no
quota and no network.

## Data and attribution

Nothing here is scraped from, or dressed up as, an official product.

- **Circuit geometry** — [OpenStreetMap](https://www.openstreetmap.org/copyright)
  ways 23410503 and 144359489, © OpenStreetMap contributors, ODbL. The closed
  loop measures 5554 m against an official 5543 m (0.2 %).
- **Corner character** — [Driver61's Sepang guide](https://driver61.com/circuit-guide/sepang/).
- **Dimensions and corner names** — [Wikipedia](https://en.wikipedia.org/wiki/Sepang_International_Circuit).
- **Race results** — [Jolpica-F1](https://github.com/jolpica/jolpica-f1), the
  Ergast successor.
- **Weather** — [Open-Meteo](https://open-meteo.com/), keyless, cached 10 minutes.

No F1, FIA or circuit marks, logos or imagery are used. No ticket prices are
reproduced — they change, and a stale price is worse than no price. Where the
organisers have not published something (parking, shuttles, gates), the app says
so instead of inventing it.

## Running it

```bash
npm install
npm run dev     # http://localhost:3000
npm test        # 65 tests, node:test, no framework
npm run build
```

Add `?t=2026-10-04T15:30` to any page to see the app as it will be mid-race —
that is how the time-dependent copy was checked.

### Team Radio

Free-text answers need an Anthropic key:

```bash
npx vercel env add ANTHROPIC_API_KEY production
```

Without it the endpoint returns the rule-engine template, which is correct but
not conversational. That degradation is deliberate and tested.

## Stack

Next.js 16 (App Router), React 19, Tailwind CSS v4, TypeScript, deployed on
Vercel. No state library, no component library, no chart library — the SVG is
drawn from the coordinates directly.
