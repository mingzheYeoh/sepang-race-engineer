import {
  CORNER_GEOMETRY,
  CORNER_INDEX,
  DRS_ZONES,
  LAP,
  LAP_METRES,
  METRES_PER_UNIT,
  VIEWBOX,
} from "./circuit-geometry.ts";

export { DRS_ZONES, LAP, LAP_METRES, METRES_PER_UNIT, VIEWBOX };

/**
 * Sepang's fifteen corners: surveyed geometry, published corner names, and one
 * F1 idea each.
 *
 * Three separate things, kept separate on purpose:
 *
 *  - Geometry (hand, sweep, length, tightness, lap position, run-up) is computed
 *    from the OpenStreetMap survey line in `circuit-geometry.ts`.
 *  - Names and driving character come from published turn-by-turn guides, which
 *    agree with the survey on every corner hand from Turn 1 to Turn 13. On Turns
 *    14 and 15 the guides disagree with each other; the survey settles it.
 *  - The lessons are general Formula 1 concepts, each placed on the corner that
 *    demonstrates it best.
 *
 * Sources are listed in SOURCES below and shown on the page.
 */

export const SOURCES = [
  {
    label: "OpenStreetMap",
    what: "surveyed centre line, ways 23410503 and 144359489",
    href: "https://www.openstreetmap.org/copyright",
  },
  {
    label: "Driver61 circuit guide",
    what: "turn-by-turn driving character",
    href: "https://driver61.com/circuit-guide/sepang/",
  },
  {
    label: "Wikipedia",
    what: "circuit dimensions and named corners",
    href: "https://en.wikipedia.org/wiki/Sepang_International_Circuit",
  },
] as const;

export type Hand = "left" | "right";
export type Speed = "slow" | "medium" | "fast";

export type Corner = {
  n: number;
  /** Published name, where the corner has one. */
  name?: string;
  hand: Hand;
  speed: Speed;
  /** Total heading change through the corner, in degrees. */
  sweepDeg: number;
  lengthM: number;
  /** Degrees turned per metre — how tight it is, independent of how long. */
  degPerM: number;
  /** Distance from the start/finish line, in metres. */
  atM: number;
  /** Length of the straight leading into it, in metres. */
  approachM: number;
  x: number;
  y: number;
  guide: string;
  lesson: { title: string; body: string };
};

const CONTENT: Omit<Corner, keyof typeof CORNER_GEOMETRY[number] | "n" | "x" | "y">[] = [
  {
    guide:
      "The biggest single sweep on the lap, at the end of the longest straight. Braking late is the whole corner, but the line has to be compromised to set up Turn 2 — take all of Turn 1 and you throw away Turn 2.",
    lesson: {
      title: "Braking zones are where overtakes happen",
      body: "An F1 car sheds speed far harder than it gains it, so a pass is set up on the straight and completed under braking. Turn 1 is Sepang's best chance because nowhere else on the lap arrives this fast at something this slow.",
    },
  },
  {
    guide:
      "No breathing space at all — the exit of Turn 1 is the entry to Turn 2, and it snaps back the other way. The circuit drops away just before the apex, so the car goes light exactly where the driver wants to lean on it.",
    lesson: {
      title: "Dirty air",
      body: "A car punches a hole in the air. Following closely inside that wake costs the car behind downforce, so it grips less exactly when it needs to turn. An overtake that looks finished at Turn 1 often unravels here — the passer is now the one being followed.",
    },
  },
  {
    guide:
      "Four hundred metres of gently opening right, taken on the throttle. It is less a corner than a long curved acceleration zone, and it rewards looking a long way ahead.",
    lesson: {
      title: "Downforce",
      body: "Wings work like upside-down aeroplane wings: they push the car into the road, and the faster it goes the harder they push. That is why a long open curve like this can be taken flat while a tight hairpin cannot — the grip arrives with the speed.",
    },
  },
  {
    name: "Langkawi Curve",
    guide:
      "The tightest corner at Sepang: more turn in forty-four metres than anywhere else on the lap, which is what makes it a second-gear right-angle. Braking references are easy to find, and there is a big step in the apex kerb.",
    lesson: {
      title: "Kerbs and track limits",
      body: "Kerbs are part of the circuit, and drivers use them to straighten a corner — but a raised kerb also unsettles the car, and going beyond it is a track-limits breach worth a lap-time deletion or a penalty. A big apex kerb like this one is an invitation and a trap at the same time.",
    },
  },
  {
    name: "Genting Curve",
    guide:
      "The first half of the Genting sequence: a long, off-camber left with a late apex. The road falls away from the direction of the turn, so the car has less grip than the speed suggests, and it is one of the easiest places here to spin.",
    lesson: {
      title: "Camber",
      body: "A banked corner leans into the turn and presses the car down; an off-camber one leans away and takes grip out from under it. Same speed, same tyres, less grip — which is why a driver who is smooth on the steering and the pedals gets through here and a driver who is not, does not.",
    },
  },
  {
    name: "Genting Curve",
    guide:
      "The second half, and it runs straight out of the first. The steering never comes back to centre in between, so entry here is already compromised by whatever happened at Turn 5.",
    lesson: {
      title: "The apex",
      body: "The apex is where the car runs closest to the inside of the corner. Hit it early and the exit runs out of road; hit it late and the corner is slower but the exit is clean. Linked corners force a compromise: the right apex here is the one that serves the corner after it.",
    },
  },
  {
    name: "KLIA Curve",
    guide:
      "First apex of a long double-apex right at the far end of the circuit. Brake reasonably late, then hold the car through a corner that is going to ask for a second commitment before it lets go.",
    lesson: {
      title: "Understeer and oversteer",
      body: "Understeer is the front tyres giving up first — the car runs wide of where it is pointed. Oversteer is the rears going first, and the back stepping out. A long corner shifts a car between the two as fuel burns off and tyres heat up, which is why the same corner feels different on lap 40.",
    },
  },
  {
    name: "KLIA Curve",
    guide:
      "The second apex, taken without ever fully unwinding from the first. Precision on the kerb here decides the whole run that follows.",
    lesson: {
      title: "Tyre degradation",
      body: "Rubber loses grip as it overheats, and a long sustained corner cooks one side of the car for seconds at a time. With track temperatures past 50 °C, Sepang is one of the harshest circuits in the sport for this — historically a two-stop race when most tracks are one.",
    },
  },
  {
    name: "Berjaya Tioman Corner",
    guide:
      "A slow left hairpin, uphill, turning most of a half-circle in barely a hundred metres. There is a crest at the apex that pitches the car into oversteer just as the driver wants to open the throttle, so patience on the way out is everything.",
    lesson: {
      title: "Traction",
      body: "Out of a corner this slow the limit is not downforce — there is not enough speed for it. It is mechanical grip: rubber, suspension, and how gently a driver can feed in over 1,000 horsepower without spinning the rears. On a wet Sepang afternoon this is where races are lost.",
    },
  },
  {
    guide:
      "A short right that arrives almost immediately after the hairpin, still uphill, still accelerating. Position matters more than speed here because of what it feeds into.",
    lesson: {
      title: "Exit speed compounds",
      body: "Speed carried out of a corner is multiplied by every metre that follows. Coaches say slow in, fast out for a reason: giving up a tenth at entry to gain two at exit is a trade every engineer takes, and it pays most in front of a long run.",
    },
  },
  {
    guide:
      "The longest corner on the circuit — over four hundred metres of sustained right-hand load, taken quickly, with the brakes still bleeding off at the start of it. The outside tyres never get a break.",
    lesson: {
      title: "The grip budget",
      body: "A tyre has one total amount of grip to spend, and braking and cornering both draw on it. Spend it all on braking and there is none left to turn. Brake pressure has to be increased gently while the car is already turning, or the load transfer snaps the rear loose.",
    },
  },
  {
    guide:
      "The left half of a fast left-right pair. It demands confidence more than technique: the inputs are small, but they have to be committed and they have to be smooth.",
    lesson: {
      title: "Weight transfer",
      body: "Change direction and the car's mass leans across onto the new outside tyres. The car is never quite settled during that shift, so a quick change of direction asks the driver to commit before the platform has stopped moving.",
    },
  },
  {
    guide:
      "The right half, straight out of the left with no gap. Inputs are bled off gradually rather than released — snap anything here and the car is unsettled for the corner that matters.",
    lesson: {
      title: "The racing line",
      body: "The fastest way through a corner is the straightest one: start wide, clip the inside, finish wide. Through a linked pair the line is planned backwards from the exit of the second corner, because that exit is the one that gets paid.",
    },
  },
  {
    name: "Sunway Lagoon Curve",
    guide:
      "Braking and turning at the same time, and the last corner before the back straight. Driver61 calls it critical to lap time for exactly that reason: get it wrong and you are a passenger for the next seven hundred metres.",
    lesson: {
      title: "DRS",
      body: "The Drag Reduction System opens a flap in the rear wing, cutting drag for more straight-line speed. It is allowed only on designated straights, and only within one second of the car ahead at the detection point. Sepang has two DRS zones, and both of its straights are long enough to make them count.",
    },
  },
  {
    guide:
      "A slow left hairpin folding the lap back onto the pit straight. Brake late, then square the corner off — take it in a V rather than an arc — because everything is traded for the exit onto the longest straight of the lap. It is also the entry to the pit lane.",
    lesson: {
      title: "The undercut",
      body: "Pit before your rival and you rejoin on fresh tyres while they are still on old ones. A few fast laps and you emerge ahead when they finally stop. It only works if you can clear traffic on the way out — which is why the corner leading onto the pit straight matters so much to strategy.",
    },
  },
];

export const CORNERS: Corner[] = CORNER_GEOMETRY.map((g, i) => ({
  n: i + 1,
  ...g,
  x: LAP[CORNER_INDEX[i]][0],
  y: LAP[CORNER_INDEX[i]][1],
  ...CONTENT[i],
}));

/** The surveyed centre line as an SVG path — real points, drawn as measured. */
export function lapPath(pts: readonly (readonly [number, number])[] = LAP): string {
  if (pts.length < 2) return "";
  return `M ${pts.map((p) => `${p[0]} ${p[1]}`).join(" L ")} Z`;
}

/** One DRS zone as its own open path, so it can be drawn over the straight it covers. */
export function zonePath([a, b]: [number, number]): string {
  const pts: string[] = [];
  for (let i = a; ; i = (i + 1) % LAP.length) {
    pts.push(`${LAP[i][0]} ${LAP[i][1]}`);
    if (i === b) break;
  }
  return `M ${pts.join(" L ")}`;
}
