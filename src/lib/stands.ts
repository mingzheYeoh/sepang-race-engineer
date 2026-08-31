import { CORNERS, DRS_ZONES, LAP, VIEWBOX } from "./circuit.ts";
import type { HourPoint } from "./weather.ts";
import type { L } from "./i18n.ts";

/**
 * Where you can sit, and what you see from there.
 *
 * The names and the corners each stand overlooks are published by the event
 * organisers. The map positions are not published, so they are computed: a stand
 * sits at the centroid of the corners it is described as overlooking, pushed
 * outward from the middle of the lap. That keeps every marker on the real
 * surveyed geometry instead of being eyeballed, and it moves correctly if the
 * geometry is ever regenerated.
 *
 * Ticket prices and availability are deliberately absent. Both change, a stale
 * price is worse than no price, and reproducing a price table is closer to
 * copying someone's page than to stating a fact.
 */

export type StandKind = "seated" | "grass";

export type Stand = {
  id: string;
  /** Published name of the stand. */
  name: string;
  kind: StandKind;
  /** Shade from sun and rain. Seated stands here are described as having a rooftop. */
  covered: boolean;
  /** Turn numbers the organisers describe it as overlooking. Empty when unstated. */
  corners: number[];
  view: L;
  /** G Hillstand is sold to Malaysian MyKad holders only. */
  localsOnly?: boolean;
};

export const STANDS: Stand[] = [
  {
    id: "main",
    name: "Main Grandstand",
    kind: "seated",
    covered: true,
    corners: [],
    view: {
      en: "The north side looks over the start/finish straight, the pit entry and exit, and the team pit boxes. The south section looks along the back straight into the final corner.",
      zh: "北段俯瞰起跑／终点直道、维修道进出口以及各车队的维修间。南段则望向后直道进入最后一弯的路段。",
    },
  },
  {
    id: "k1",
    name: "K1 Grandstand",
    kind: "seated",
    covered: true,
    corners: [1, 2],
    view: {
      en: "Turns 1 and 2 — the start, and the first-corner braking duel at the end of the longest straight on the lap.",
      zh: "一号弯与二号弯——发车，以及全圈最长直道尽头的首弯刹车大战。",
    },
  },
  {
    id: "f",
    name: "F Grandstand",
    kind: "seated",
    covered: true,
    corners: [7, 8],
    view: {
      en: "The double-apex of Turns 7 and 8, where a driver has to commit twice through one long corner.",
      zh: "七号弯与八号弯的双顶点——车手要在同一个长弯里两次下决心的地方。",
    },
  },
  {
    id: "c",
    name: "C Hillstand",
    kind: "grass",
    covered: true,
    corners: [9, 10, 11],
    view: {
      en: "A partly covered grass bank with a panoramic view of the technical middle sector, Turns 9 to 11, and the back straight.",
      zh: "带部分顶棚的草坡看台，可全景观赏九到十一号弯这段技术中段，以及后直道。",
    },
  },
  {
    id: "b",
    name: "B Hillstand",
    kind: "grass",
    covered: false,
    corners: [12, 13, 14],
    view: {
      en: "An open grass bank over the sweeping run of Turns 12 to 14 that closes out the lap. No shade at all.",
      zh: "露天草坡看台，俯瞰收尾的十二到十四号弯连续弯段。完全没有遮阳。",
    },
  },
  {
    id: "k2",
    name: "K2 Hillstand",
    kind: "grass",
    covered: false,
    corners: [],
    view: {
      en: "An open-air grass general admission area. The organisers have not published which part of the circuit it overlooks.",
      zh: "露天草地通票区域。主办方尚未公布它面向赛道的哪一段。",
    },
  },
  {
    id: "g",
    name: "G Hillstand",
    kind: "grass",
    covered: false,
    corners: [],
    localsOnly: true,
    view: {
      en: "The cheapest three-day ticket: an open-air general admission area with panoramic views and access to the off-track entertainment.",
      zh: "最便宜的三日票：露天通票区域，视野开阔，并可进入场外娱乐区。",
    },
  },
];

/* ------------------------------------------------------- map positions -- */

const centroid = (pts: readonly (readonly [number, number])[]): [number, number] => [
  pts.reduce((s, p) => s + p[0], 0) / pts.length,
  pts.reduce((s, p) => s + p[1], 0) / pts.length,
];

const LAP_CENTRE = centroid(LAP);
/** How far outside the track a stand marker starts, in viewBox units. */
const OFFSET = 62;
/** A marker any closer than this to a corner it watches reads as being on the track. */
const CLEARANCE = 46;
/** Keep markers off the very edge of the drawing, where they would be clipped. */
const MARGIN = 34;
const [VB_W, VB_H] = VIEWBOX.split(" ").slice(2).map(Number);

/**
 * The stands map needs a wider frame than the circuit map.
 *
 * Every marker is drawn outside the track, and Turn 1 sits hard against the left
 * edge of the surveyed extent — inside the circuit page's viewBox there is
 * simply no room beside it, so K1 kept being clamped back onto the track. The
 * frame grows instead of the markers moving somewhere untrue.
 */
const PAD = 120;
export const STANDS_VIEWBOX = `${-PAD} ${-PAD} ${VB_W + PAD * 2} ${VB_H + PAD * 2}`;
const BOUND = { minX: -PAD + MARGIN, maxX: VB_W + PAD - MARGIN, minY: -PAD + MARGIN, maxY: VB_H + PAD - MARGIN };

/** Midpoints of the two long straights. */
const PIT_STRAIGHT_MID = centroid([LAP[DRS_ZONES[1][0]], LAP[0]]);
const BACK_STRAIGHT_MID = centroid([LAP[DRS_ZONES[0][0]], LAP[DRS_ZONES[0][1]]]);

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * Move a point away from the middle of the lap until it is clear of the corners
 * it belongs to, then keep it inside the drawing.
 *
 * A fixed offset is not enough on its own: Turns 1 and 2 sit close together near
 * the edge of the lap, so their centroid barely moves and the marker lands on
 * the track. Pushing until the clearance is met is the invariant the map needs,
 * so it is what the code enforces rather than a number that happened to work.
 */
function pushOut([x, y]: [number, number], avoid: [number, number][]): [number, number] {
  const dx = x - LAP_CENTRE[0];
  const dy = y - LAP_CENTRE[1];
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;

  let d = OFFSET;
  for (; d < OFFSET + 160; d += 6) {
    const px = x + ux * d;
    const py = y + uy * d;
    if (avoid.every(([ax, ay]) => Math.hypot(px - ax, py - ay) >= CLEARANCE + 6)) break;
  }

  const round = (v: number) => Math.round(v * 10) / 10;
  return [
    round(clamp(x + ux * d, BOUND.minX, BOUND.maxX)),
    round(clamp(y + uy * d, BOUND.minY, BOUND.maxY)),
  ];
}

/**
 * The Main Grandstand cannot use the outward-from-centre rule.
 *
 * Sepang's two long straights converge, so the pit straight sits close to the
 * middle of the lap and "outward" is barely defined there — the first attempt
 * put the grandstand in the wedge between the straights, which is the paddock.
 * The stand is on the far side of the pit straight from the back straight, so
 * that is the direction used: straight away from the other straight.
 */
function mainGrandstandPosition(): [number, number] {
  const dx = PIT_STRAIGHT_MID[0] - BACK_STRAIGHT_MID[0];
  const dy = PIT_STRAIGHT_MID[1] - BACK_STRAIGHT_MID[1];
  const len = Math.hypot(dx, dy) || 1;
  const round = (v: number) => Math.round(v * 10) / 10;
  return [
    round(clamp(PIT_STRAIGHT_MID[0] + (dx / len) * OFFSET, BOUND.minX, BOUND.maxX)),
    round(clamp(PIT_STRAIGHT_MID[1] + (dy / len) * OFFSET, BOUND.minY, BOUND.maxY)),
  ];
}

/** Marker position for a stand, or null when the organisers have not said where it is. */
export function standPosition(stand: Stand): [number, number] | null {
  if (stand.id === "main") return mainGrandstandPosition();
  if (stand.corners.length === 0) return null;
  const pts = stand.corners
    .map((n) => CORNERS.find((c) => c.n === n))
    .filter((c): c is NonNullable<typeof c> => !!c)
    .map((c) => [c.x, c.y] as [number, number]);
  return pts.length ? pushOut(centroid(pts), pts) : null;
}

export const PLACED_STANDS = STANDS.filter((s) => standPosition(s) !== null);

/* ---------------------------------------------------------- the advice -- */

export type StandCall = { stand: Stand; reason: L };

/**
 * Which stand the conditions argue for.
 *
 * This is the whole app's thesis landing on one decision: at Sepang the weather
 * is the deciding variable, and exactly one general admission area has a roof.
 * Availability is not considered — it changes by the hour and is the official
 * ticketing page's job, not ours.
 */
export function recommendStand(now: HourPoint | null): StandCall {
  const byId = (id: string) => STANDS.find((s) => s.id === id)!;

  if (now && (now.rainMm > 0.1 || now.rainChance >= 50)) {
    return {
      stand: byId("c"),
      reason: {
        en: `${now.rainChance}% rain chance. C Hillstand is the only general admission area with cover, and it still sees the middle sector and the back straight.`,
        zh: `降雨概率 ${now.rainChance}%。C Hillstand 是唯一有顶棚的通票区域，而且照样能看到中段和后直道。`,
      },
    };
  }

  if (now && now.feelsC >= 36) {
    return {
      stand: byId("c"),
      reason: {
        en: `Feels like ${Math.round(now.feelsC)}°C. Shade matters more than the view over nine hours — C Hillstand is partly covered, B Hillstand is not.`,
        zh: `体感温度 ${Math.round(now.feelsC)}°C。在现场待九个小时，遮阳比视野更重要——C Hillstand 有部分顶棚，B Hillstand 完全没有。`,
      },
    };
  }

  return {
    stand: byId("k1"),
    reason: {
      en: "Conditions are manageable, so take the action instead: K1 sits at Turns 1 and 2, where the longest straight on the lap ends in the hardest braking zone.",
      zh: "条件还算舒服，那就冲着看点去：K1 位于一号弯和二号弯，全圈最长的直道在这里撞上最重的刹车区。",
    },
  };
}
