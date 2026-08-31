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
 * Sepang's fifteen corners: surveyed geometry plus one F1 idea each.
 *
 * Everything measurable — hand, sweep, length, how tight, where on the lap, how
 * long the straight before it is — comes from the OpenStreetMap survey line in
 * `circuit-geometry.ts`, computed rather than transcribed. This file adds only
 * what a measurement cannot: what the corner feels like, and the one piece of
 * Formula 1 it is the best place on the circuit to explain.
 *
 * Official corner names are deliberately absent. The written turn-by-turn
 * descriptions available for Sepang disagreed with the surveyed geometry about
 * which corners are left-handers, so rather than pin unverified names onto
 * verified geometry, the names are left out until they can be checked.
 */

export type Hand = "left" | "right";
export type Speed = "slow" | "medium" | "fast";

export type Corner = {
  n: number;
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

const CONTENT: { guide: string; lesson: { title: string; body: string } }[] = [
  {
    guide:
      "The biggest single sweep on the lap, and the slowest thing at the end of the longest straight. Cars arrive near top speed and turn through more than half a circle.",
    lesson: {
      title: "Braking zones are where overtakes happen",
      body: "An F1 car sheds speed far harder than it gains it, so a pass is set up on the straight and completed under braking: get close by the braking board, then brake later than the car ahead. Turn 1 is Sepang's best chance because nowhere else on the lap arrives this fast at something this slow.",
    },
  },
  {
    guide:
      "No breathing space at all — the exit of Turn 1 is the entry to Turn 2, and it snaps back the other way. A driver who wins Turn 1 can still lose the place here.",
    lesson: {
      title: "Dirty air",
      body: "A car punches a hole in the air. Following closely inside that wake costs the car behind downforce, so it grips less exactly when it needs to turn. This is why an overtake that looks finished at Turn 1 often unravels at Turn 2 — the passer is now the one being followed.",
    },
  },
  {
    guide:
      "A short, shallow kink rather than a corner. Barely a steering input, but it decides which side of the road you start the next sequence from.",
    lesson: {
      title: "The racing line",
      body: "The fastest way through a corner is the straightest one: start wide, clip the inside, finish wide. Even a kink this gentle is worth taking properly, because the line through it sets up everything that follows.",
    },
  },
  {
    guide:
      "The gentlest sweep on the whole circuit — a long, opening right that a modern car takes without lifting.",
    lesson: {
      title: "Downforce",
      body: "Wings work like upside-down aeroplane wings: they push the car into the road, and the faster it goes the harder they push. That is why a long open curve like this one can be taken flat while a tight hairpin cannot — the grip arrives with the speed.",
    },
  },
  {
    guide:
      "The tightest corner at Sepang: it turns further in forty-four metres than anything else on the lap, and it arrives at the end of a long run.",
    lesson: {
      title: "Trail braking",
      body: "Drivers do not finish braking before they turn. They bleed pressure off the pedal while turning in, keeping weight over the front tyres so the nose bites. Release too fast and the car runs wide; hold too long and the rear steps out. A corner this abrupt leaves no margin either way.",
    },
  },
  {
    guide:
      "A long left that reverses everything the previous sequence set up, and keeps the car loaded the whole way through.",
    lesson: {
      title: "Weight transfer",
      body: "Change direction and the car's mass leans across onto the new outside tyres. The car is never quite settled during that shift, so a long corner that begins with a direction change asks the driver to commit before the platform has stopped moving.",
    },
  },
  {
    guide:
      "Runs straight out of the previous corner with no gap. The steering never comes fully back to centre between the two.",
    lesson: {
      title: "The apex",
      body: "The apex is where the car runs closest to the inside of the corner. Hit it early and the exit runs out of road; hit it late and the corner is slower but the exit is clean. Linked corners force a compromise: the right apex here is the one that serves the corner after it.",
    },
  },
  {
    guide:
      "A long right at the far end of the circuit, arriving after a decent run and leading into the quiet middle of the lap.",
    lesson: {
      title: "Exit speed compounds",
      body: "Speed carried out of a corner is multiplied by every metre of the straight that follows. Coaches say slow in, fast out for a reason: giving up a tenth at entry to gain two at exit is a trade every engineer takes, and it pays most in front of a long run.",
    },
  },
  {
    guide:
      "A slow left that turns most of a half-circle in barely a hundred metres, at the end of the longest approach in the middle sector.",
    lesson: {
      title: "Traction",
      body: "Out of a corner this slow the limit is not downforce — there is not enough speed for it. It is mechanical grip: rubber, suspension, and how gently a driver can feed in over 1,000 horsepower without spinning the rears. On a wet Sepang afternoon this is where races are lost.",
    },
  },
  {
    guide: "A short right that follows immediately, still on the brakes from the corner before.",
    lesson: {
      title: "The grip budget",
      body: "A tyre has one total amount of grip to spend, and braking and cornering both draw on it. Spend it all on braking and there is none left to turn. Every driver is constantly trading one against the other, and a corner that arrives while you are still slowing punishes a bad trade.",
    },
  },
  {
    guide:
      "The longest corner on the circuit — over four hundred metres of sustained right-hand load, taken quickly. The outside tyres never get a break.",
    lesson: {
      title: "Tyre degradation",
      body: "Rubber loses grip as it overheats, and a long fast corner cooks one side of the car for seconds at a time. With track temperatures past 50 °C, Sepang is one of the harshest circuits in the sport for this — historically a two-stop race when most tracks are one, and this corner is a large part of why.",
    },
  },
  {
    guide: "A medium left that breaks up the long right-hand sequence before it.",
    lesson: {
      title: "Sectors",
      body: "A lap is timed in three sectors so teams can see where time is won and lost rather than just the total. Purple means fastest of anyone, green means a driver's own best. Watching the sectors tells you an overtake is coming before it happens.",
    },
  },
  {
    guide:
      "Straight out of the previous left with no gap, and quick enough that the car is riding the surface rather than being placed on it.",
    lesson: {
      title: "Ride height is a compromise",
      body: "Run the car low and the aerodynamics work better — but bumps then hammer the floor and unsettle it. Every setup is a bargain between the lap time a low car finds and the lap time a skittish car loses, and fast corners taken on a moving platform are where that bargain gets tested.",
    },
  },
  {
    guide:
      "The last corner of the middle sector, and the one that launches you down the back straight. Get it wrong and you are a passenger for the next seven hundred metres.",
    lesson: {
      title: "DRS",
      body: "The Drag Reduction System opens a flap in the rear wing, cutting drag for more straight-line speed. It is allowed only on designated straights, and only within one second of the car ahead at the detection point. Sepang has two DRS zones, and both of its straights are long enough to make them count.",
    },
  },
  {
    guide:
      "A slow left hairpin at the end of the back straight, folding the lap back onto the pit straight. The last braking zone, the last chance to defend, and the entry to the pit lane.",
    lesson: {
      title: "The undercut",
      body: "Pit before your rival and you rejoin on fresh tyres while they are still on old ones. A few fast laps and you emerge ahead when they finally stop. It only works if you can clear traffic on the way out — which is why the corner leading onto the pit straight matters so much to strategy.",
    },
  },
];

export const CORNERS: Corner[] = CORNER_GEOMETRY.map((g, i) => ({
  n: i + 1,
  hand: g.hand,
  speed: g.speed,
  sweepDeg: g.sweepDeg,
  lengthM: g.lengthM,
  degPerM: g.degPerM,
  atM: g.atM,
  approachM: g.approachM,
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
