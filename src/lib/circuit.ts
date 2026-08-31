/**
 * Sepang's fifteen corners.
 *
 * The facts — hand, speed, and the officially named corners — are accurate.
 * The coordinates are a schematic drawn from scratch for this project: the two
 * long straights and the corner sequence are faithful, the geometry is a
 * diagram rather than a survey, and the page says so. Nothing here is traced
 * from an official circuit map.
 *
 * Each corner also carries one beginner F1 concept. Fifteen corners, fifteen
 * ideas, in the order you meet them on a lap — that is the whole syllabus.
 */

export type Hand = "left" | "right";
export type Speed = "slow" | "medium" | "fast";

export type Corner = {
  n: number;
  /** Official name, where the corner has one. */
  name?: string;
  hand: Hand;
  speed: Speed;
  /** Position on the schematic, in viewBox units. */
  x: number;
  y: number;
  /** What actually happens here. */
  guide: string;
  /** The F1 idea this corner is the best place to explain. */
  lesson: { title: string; body: string };
};

export const CORNERS: Corner[] = [
  {
    n: 1,
    hand: "right",
    speed: "slow",
    x: 66,
    y: 310,
    guide:
      "A long, slow, sweeping right at the end of the 927-metre pit straight. Cars arrive at close to top speed and shed most of it in a straight line.",
    lesson: {
      title: "Braking zones are where overtakes happen",
      body: "An F1 car sheds speed far harder than it gains it. So a pass is set up on the straight and completed under braking: get close enough by the braking board, then brake later than the car ahead. Turn 1 is Sepang's best chance because the straight before it is one of the longest on the calendar.",
    },
  },
  {
    n: 2,
    hand: "left",
    speed: "slow",
    x: 96,
    y: 282,
    guide:
      "A tight left hairpin, downhill, immediately after Turn 1. The pairing means a driver who wins Turn 1 can still lose the place here.",
    lesson: {
      title: "Dirty air",
      body: "A car punches a hole in the air. Following closely inside that wake costs the car behind downforce, so it grips less exactly when it needs to turn. This is why an overtake that looks done at Turn 1 often unravels at Turn 2 — the passer is now the one being followed.",
    },
  },
  {
    n: 3,
    hand: "right",
    speed: "fast",
    x: 140,
    y: 238,
    guide:
      "A long right taken flat out. No braking, just commitment and a car that stays planted.",
    lesson: {
      title: "Downforce",
      body: "Wings work like upside-down aeroplane wings: they push the car into the road. The faster it goes, the harder they push, so a fast corner can generate more grip than a slow one. That is why Turn 3 is flat and the hairpins are not.",
    },
  },
  {
    n: 4,
    name: "Langkawi Curve",
    hand: "right",
    speed: "slow",
    x: 196,
    y: 205,
    guide:
      "A slow, near right-angle corner. Brake hard, rotate the car, get it straight, then go.",
    lesson: {
      title: "Trail braking",
      body: "Drivers do not finish braking before they turn. They bleed pressure off the pedal while turning in, keeping weight over the front tyres so the nose bites. Release too fast and the car runs wide; hold too long and the rear steps out.",
    },
  },
  {
    n: 5,
    hand: "left",
    speed: "fast",
    x: 240,
    y: 208,
    guide: "First half of a high-speed chicane. Left, then immediately right.",
    lesson: {
      title: "Weight transfer",
      body: "Change direction and the car's mass leans across to the new outside tyres. Do it twice in quick succession and the second load arrives while the car is still settling from the first. A driver who is greedy at Turn 5 has no car left for Turn 6.",
    },
  },
  {
    n: 6,
    name: "Genting Curve",
    hand: "right",
    speed: "fast",
    x: 262,
    y: 238,
    guide: "Second half of the chicane, and the exit that decides the next sequence.",
    lesson: {
      title: "Exit speed compounds",
      body: "Speed carried out of a corner is multiplied by every metre of the straight that follows. Coaches say slow in, fast out for a reason: losing a tenth at entry to gain two at exit is a trade every engineer takes.",
    },
  },
  {
    n: 7,
    hand: "right",
    speed: "medium",
    x: 282,
    y: 275,
    guide: "A medium-speed right with two apexes — the corner tightens, then opens.",
    lesson: {
      title: "The apex",
      body: "The apex is the point where the car runs closest to the inside of the corner. Hit it early and the exit runs out of road; hit it late and the corner is slower but the exit is clean. A double-apex corner asks the driver to get it right twice.",
    },
  },
  {
    n: 8,
    name: "KLIA Curve",
    hand: "right",
    speed: "medium",
    x: 288,
    y: 315,
    guide:
      "The continuation of Turn 7 — a long, sustained right that loads the left-hand tyres for several seconds.",
    lesson: {
      title: "Tyre degradation",
      body: "Rubber loses grip as it overheats, and long corners cook one side of the car. At 50 °C-plus track temperatures Sepang is one of the harshest circuits in the sport for this — historically a two-stop race, when most tracks are one.",
    },
  },
  {
    n: 9,
    name: "Berjaya Tioman Corner",
    hand: "left",
    speed: "slow",
    x: 285,
    y: 352,
    guide: "A slow left hairpin, uphill. The slowest sequence of the lap begins here.",
    lesson: {
      title: "Traction",
      body: "Out of a slow corner the limit is not downforce — there is not enough speed for it. It is mechanical grip: rubber, suspension and how gently the driver can feed in over 1,000 horsepower without spinning the rears. Uphill helps; a wet track does not.",
    },
  },
  {
    n: 10,
    hand: "left",
    speed: "medium",
    x: 245,
    y: 344,
    guide: "A medium-speed left that sets up the run through the middle sector.",
    lesson: {
      title: "The racing line",
      body: "The fastest way through a corner is the straightest one: start wide, clip the inside, finish wide. It uses the full width of the track to make the curve as gentle as possible. Step off it — onto marbles or a damp patch — and the grip is simply not there.",
    },
  },
  {
    n: 11,
    hand: "right",
    speed: "medium",
    x: 212,
    y: 318,
    guide:
      "A medium right that demands braking and steering at the same time — one of the harder corners here to get right.",
    lesson: {
      title: "The grip budget",
      body: "A tyre has one total amount of grip to spend, and braking and cornering both draw on it. Spend it all on braking and there is none left to turn. Every driver is constantly trading one against the other, and Turn 11 punishes a bad trade.",
    },
  },
  {
    n: 12,
    hand: "left",
    speed: "fast",
    x: 182,
    y: 296,
    guide:
      "Taken flat out, and bumpy with it. The car is quick here but never quite settled, and the driver is holding it rather than placing it.",
    lesson: {
      title: "Ride height is a compromise",
      body: "Run the car low and the aerodynamics work better — but bumps then hammer the floor and unsettle it. Every setup is a bargain between the lap time a low car finds and the lap time a skittish car loses. Bumpy flat-out corners are where that bargain gets tested.",
    },
  },
  {
    n: 13,
    hand: "right",
    speed: "fast",
    x: 154,
    y: 312,
    guide: "Also flat out, leading into the final braking zone of the lap.",
    lesson: {
      title: "Sectors",
      body: "A lap is timed in three sectors, so teams can see where time is won and lost rather than just the total. Purple means fastest of anyone, green means a driver's own best. Watching sectors tells you an overtake is coming before it happens.",
    },
  },
  {
    n: 14,
    name: "Sunway Lagoon Curve",
    hand: "right",
    speed: "slow",
    x: 140,
    y: 344,
    guide:
      "Hard braking and hard steering together, onto the 927-metre back straight. Get this wrong and you are a passenger all the way down it.",
    lesson: {
      title: "DRS",
      body: "The Drag Reduction System opens a flap in the rear wing, cutting drag for more straight-line speed. It is only allowed on designated straights, and only when a driver is within one second of the car ahead at the detection point. Sepang has two DRS zones — both long straights.",
    },
  },
  {
    n: 15,
    hand: "left",
    speed: "slow",
    x: 100,
    y: 470,
    guide:
      "A slow left hairpin in second gear, onto the pit straight. The last corner before the pit lane entry, and the last chance to defend.",
    lesson: {
      title: "The undercut",
      body: "Pit before your rival and you rejoin on fresh tyres while they are still on old ones. A few fast laps and you emerge ahead when they finally stop. It only works if you can clear traffic — which is why the corner leading onto the pit straight matters so much on strategy.",
    },
  },
];

/** Waypoints of the schematic lap, in order, including the straights. */
export const LAP_POINTS: [number, number][] = [
  [55, 470], // start/finish line
  [55, 352], // end of the pit straight
  ...CORNERS.slice(0, 14).map((c) => [c.x, c.y] as [number, number]),
  [140, 440], // end of the back straight
  [100, 470], // Turn 15
];

export const VIEWBOX = "12 178 300 322";

/** The two DRS zones, as [start, end] indexes into LAP_POINTS. */
export const DRS_ZONES: [number, number][] = [
  [0, 1], // pit straight, start/finish up to the Turn 1 braking zone
  [15, 16], // back straight, Turn 14 exit down to the Turn 15 braking zone
];

const at = (pts: [number, number][], i: number) => pts[(i + pts.length) % pts.length];

/**
 * Closed Catmull-Rom spline as cubic beziers.
 *
 * The control points are derived from the waypoints rather than hand-placed, so
 * the drawn lap is smooth by construction — no eyeballing curve handles, and
 * moving a corner marker moves the track with it.
 */
export function lapPath(pts: [number, number][] = LAP_POINTS): string {
  if (pts.length < 3) return "";
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length; i++) {
    const [p0x, p0y] = at(pts, i - 1);
    const [p1x, p1y] = at(pts, i);
    const [p2x, p2y] = at(pts, i + 1);
    const [p3x, p3y] = at(pts, i + 2);
    const c1x = p1x + (p2x - p0x) / 6;
    const c1y = p1y + (p2y - p0y) / 6;
    const c2x = p2x - (p3x - p1x) / 6;
    const c2y = p2y - (p3y - p1y) / 6;
    d += ` C ${r(c1x)} ${r(c1y)}, ${r(c2x)} ${r(c2y)}, ${r(p2x)} ${r(p2y)}`;
  }
  return `${d} Z`;
}

const r = (n: number) => Math.round(n * 100) / 100;
