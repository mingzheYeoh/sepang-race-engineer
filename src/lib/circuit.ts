import {
  CORNER_GEOMETRY,
  CORNER_INDEX,
  DRS_ZONES,
  LAP,
  LAP_METRES,
  METRES_PER_UNIT,
  VIEWBOX,
} from "./circuit-geometry.ts";
import type { L } from "./i18n.ts";

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
 * Both languages sit on the same object, so a fact and its wording cannot drift.
 * Sources are listed in SOURCES below and shown on the page.
 */

export const SOURCES: { label: string; what: L; href: string }[] = [
  {
    label: "OpenStreetMap",
    what: {
      en: "surveyed centre line, ways 23410503 and 144359489",
      zh: "实测赛道中心线，way 23410503 与 144359489",
    },
    href: "https://www.openstreetmap.org/copyright",
  },
  {
    label: "Driver61",
    what: { en: "turn-by-turn driving character", zh: "逐弯驾驶特性" },
    href: "https://driver61.com/circuit-guide/sepang/",
  },
  {
    label: "Wikipedia",
    what: { en: "circuit dimensions and named corners", zh: "赛道尺寸与命名弯角" },
    href: "https://en.wikipedia.org/wiki/Sepang_International_Circuit",
  },
];

export type Hand = "left" | "right";
export type Speed = "slow" | "medium" | "fast";

export type Corner = {
  n: number;
  /** Published name, where the corner has one. */
  name?: L;
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
  guide: L;
  lesson: { title: L; body: L };
};

type Content = { name?: L; guide: L; lesson: { title: L; body: L } };

const CONTENT: Content[] = [
  {
    guide: {
      en: "The biggest single sweep on the lap, at the end of the longest straight. Braking late is the whole corner, but the line has to be compromised to set up Turn 2 — take all of Turn 1 and you throw away Turn 2.",
      zh: "全圈扫掠角最大的弯，位于最长直道的尽头。晚刹车就是这个弯的全部，但走线必须为二号弯让步——把一号弯吃干净，二号弯就废了。",
    },
    lesson: {
      title: { en: "Braking zones are where overtakes happen", zh: "超车发生在刹车区" },
      body: {
        en: "An F1 car sheds speed far harder than it gains it, so a pass is set up on the straight and completed under braking. Turn 1 is Sepang's best chance because nowhere else on the lap arrives this fast at something this slow.",
        zh: "F1 赛车减速的能力远强于加速，所以超车在直道上铺垫、在刹车区完成。一号弯是雪邦最好的超车点，因为全圈没有第二个地方是以这么快的速度冲向这么慢的弯。",
      },
    },
  },
  {
    guide: {
      en: "No breathing space at all — the exit of Turn 1 is the entry to Turn 2, and it snaps back the other way. The circuit drops away just before the apex, so the car goes light exactly where the driver wants to lean on it.",
      zh: "完全没有喘息空间——一号弯的出弯就是二号弯的入弯，而且方向立刻反打。路面在顶点前略微下沉，车正好在车手最想压住它的地方变轻。",
    },
    lesson: {
      title: { en: "Dirty air", zh: "乱流" },
      body: {
        en: "A car punches a hole in the air. Following closely inside that wake costs the car behind downforce, so it grips less exactly when it needs to turn. An overtake that looks finished at Turn 1 often unravels here — the passer is now the one being followed.",
        zh: "赛车会在空气中撞出一个洞。紧跟在这道尾流里的车会损失下压力，恰好在需要转向时抓地力变差。一号弯看似完成的超车常常在这里被反超——因为现在轮到超车方在前面挨跟了。",
      },
    },
  },
  {
    guide: {
      en: "Four hundred metres of gently opening right, taken on the throttle. It is less a corner than a long curved acceleration zone, and it rewards looking a long way ahead.",
      zh: "四百米缓慢外扩的右弯，全程带油门。与其说是弯，不如说是一段带弧度的加速区，考验的是往远处看的能力。",
    },
    lesson: {
      title: { en: "Downforce", zh: "下压力" },
      body: {
        en: "Wings work like upside-down aeroplane wings: they push the car into the road, and the faster it goes the harder they push. That is why a long open curve like this can be taken flat while a tight hairpin cannot — the grip arrives with the speed.",
        zh: "尾翼的原理是倒装的机翼：把车压向地面，而且速度越快压得越狠。所以这种长而开阔的弯可以全油门通过，紧发夹却不行——抓地力是随速度一起来的。",
      },
    },
  },
  {
    name: { en: "Langkawi Curve", zh: "兰卡威弯" },
    guide: {
      en: "The tightest corner at Sepang: more turn in forty-four metres than anywhere else on the lap, which is what makes it a second-gear right-angle. Braking references are easy to find, and there is a big step in the apex kerb.",
      zh: "雪邦最紧的弯：四十四米内的转向量全场第一，这就是它成为二挡直角弯的原因。刹车参考点很好找，顶点的路肩有一个明显的落差。",
    },
    lesson: {
      title: { en: "Kerbs and track limits", zh: "路肩与赛道边界" },
      body: {
        en: "Kerbs are part of the circuit, and drivers use them to straighten a corner — but a raised kerb also unsettles the car, and going beyond it is a track-limits breach worth a lap-time deletion or a penalty. A big apex kerb like this one is an invitation and a trap at the same time.",
        zh: "路肩是赛道的一部分，车手用它把弯道拉直——但凸起的路肩也会让车失去平衡，压过头则算越界，可能被删圈速或吃罚时。像这样落差明显的顶点路肩，既是邀请也是陷阱。",
      },
    },
  },
  {
    name: { en: "Genting Curve", zh: "云顶弯" },
    guide: {
      en: "The first half of the Genting sequence: a long, off-camber left with a late apex. The road falls away from the direction of the turn, so the car has less grip than the speed suggests, and it is one of the easiest places here to spin.",
      zh: "云顶连弯的前半段：一个长的、反倾角的左弯，顶点偏后。路面朝转向的反方向倾斜，所以车的抓地力比速度看起来的要少，是全场最容易打滑的地方之一。",
    },
    lesson: {
      title: { en: "Camber", zh: "路面倾角" },
      body: {
        en: "A banked corner leans into the turn and presses the car down; an off-camber one leans away and takes grip out from under it. Same speed, same tyres, less grip — which is why a driver who is smooth on the steering and the pedals gets through here and a driver who is not, does not.",
        zh: "正倾角的弯道朝转向方向倾斜，把车压向路面；反倾角则朝外倾斜，把抓地力从车底抽走。同样的速度、同样的轮胎，抓地力却更少——所以方向盘和踏板够顺的车手能过去，不够顺的过不去。",
      },
    },
  },
  {
    name: { en: "Genting Curve", zh: "云顶弯" },
    guide: {
      en: "The second half, and it runs straight out of the first. The steering never comes back to centre in between, so entry here is already compromised by whatever happened at Turn 5.",
      zh: "云顶连弯的后半段，紧接着前半段。中间方向盘从不回正，所以这里的入弯已经被五号弯发生的一切所决定。",
    },
    lesson: {
      title: { en: "The apex", zh: "顶点" },
      body: {
        en: "The apex is where the car runs closest to the inside of the corner. Hit it early and the exit runs out of road; hit it late and the corner is slower but the exit is clean. Linked corners force a compromise: the right apex here is the one that serves the corner after it.",
        zh: "顶点是车贴近弯道内侧最近的那一点。压得太早，出弯就没路了；压得晚一点，过弯慢些但出弯干净。连续弯必须妥协：这里正确的顶点，是能服务下一个弯的那个。",
      },
    },
  },
  {
    name: { en: "KLIA Curve", zh: "吉隆坡机场弯" },
    guide: {
      en: "First apex of a long double-apex right at the far end of the circuit. Brake reasonably late, then hold the car through a corner that is going to ask for a second commitment before it lets go.",
      zh: "赛道远端一个长双顶点右弯的第一个顶点。刹车可以稍晚，然后把车稳住——这个弯在放你走之前还会再要一次承诺。",
    },
    lesson: {
      title: { en: "Understeer and oversteer", zh: "转向不足与转向过度" },
      body: {
        en: "Understeer is the front tyres giving up first — the car runs wide of where it is pointed. Oversteer is the rears going first, and the back stepping out. A long corner shifts a car between the two as fuel burns off and tyres heat up, which is why the same corner feels different on lap 40.",
        zh: "转向不足是前胎先失去抓地力，车跑得比指向更外。转向过度是后胎先失，车尾甩出去。长弯会随着燃油消耗和轮胎升温让车在两者之间来回切换——这就是同一个弯到第 40 圈感觉完全不同的原因。",
      },
    },
  },
  {
    name: { en: "KLIA Curve", zh: "吉隆坡机场弯" },
    guide: {
      en: "The second apex, taken without ever fully unwinding from the first. Precision on the kerb here decides the whole run that follows.",
      zh: "第二个顶点，从第一个顶点出来时方向盘根本没完全回正。这里压路肩的精度决定了接下来一整段。",
    },
    lesson: {
      title: { en: "Tyre degradation", zh: "轮胎衰减" },
      body: {
        en: "Rubber loses grip as it overheats, and a long sustained corner cooks one side of the car for seconds at a time. With track temperatures past 50 °C, Sepang is one of the harshest circuits in the sport for this — historically a two-stop race when most tracks are one.",
        zh: "橡胶过热就会掉抓地力，而一个持续时间长的弯会一次性把车的一侧连续烤上好几秒。赛道温度超过 50°C 的雪邦，是这项运动里对轮胎最狠的赛道之一——在别的赛道普遍一停的年代，它历来都要两停。",
      },
    },
  },
  {
    name: { en: "Berjaya Tioman Corner", zh: "刁曼岛弯" },
    guide: {
      en: "A slow left hairpin, uphill, turning most of a half-circle in barely a hundred metres. There is a crest at the apex that pitches the car into oversteer just as the driver wants to open the throttle, so patience on the way out is everything.",
      zh: "一个慢速左发夹，上坡，在一百米出头里转过接近半圈。顶点处有个隆起，正好在车手想开油门的时候把车推向转向过度，所以出弯的耐心就是一切。",
    },
    lesson: {
      title: { en: "Traction", zh: "牵引力" },
      body: {
        en: "Out of a corner this slow the limit is not downforce — there is not enough speed for it. It is mechanical grip: rubber, suspension, and how gently a driver can feed in over 1,000 horsepower without spinning the rears. On a wet Sepang afternoon this is where races are lost.",
        zh: "从这么慢的弯出来时，限制因素不是下压力——速度根本不够产生它。靠的是机械抓地力：橡胶、悬挂，以及车手能多轻柔地把一千多匹马力喂下去而不让后胎空转。在雪邦一个下雨的下午，比赛就是在这里输掉的。",
      },
    },
  },
  {
    guide: {
      en: "A short right that arrives almost immediately after the hairpin, still uphill, still accelerating. Position matters more than speed here because of what it feeds into.",
      zh: "紧接着发夹弯出现的一个短右弯，仍在上坡，仍在加速。这里车的位置比速度更重要，因为它决定了后面那一段。",
    },
    lesson: {
      title: { en: "Exit speed compounds", zh: "出弯速度会复利" },
      body: {
        en: "Speed carried out of a corner is multiplied by every metre that follows. Coaches say slow in, fast out for a reason: giving up a tenth at entry to gain two at exit is a trade every engineer takes, and it pays most in front of a long run.",
        zh: "带出弯的速度会被后面的每一米放大。教练说「慢进快出」是有道理的：入弯让掉一成、出弯赚回两成，这笔账每个工程师都会算，而且在长直道前收益最大。",
      },
    },
  },
  {
    guide: {
      en: "The longest corner on the circuit — over four hundred metres of sustained right-hand load, taken quickly, with the brakes still bleeding off at the start of it. The outside tyres never get a break.",
      zh: "全场最长的弯——四百多米持续的右向负载，速度还不低，进弯时刹车压力还在慢慢释放。外侧轮胎全程得不到喘息。",
    },
    lesson: {
      title: { en: "The grip budget", zh: "抓地力预算" },
      body: {
        en: "A tyre has one total amount of grip to spend, and braking and cornering both draw on it. Spend it all on braking and there is none left to turn. Brake pressure has to be increased gently while the car is already turning, or the load transfer snaps the rear loose.",
        zh: "一条轮胎只有一份抓地力可花，刹车和过弯都从这份里支取。全花在刹车上，转向就没得用了。车已经在转的时候，刹车压力必须缓慢加上去，否则重量转移会让车尾直接甩出去。",
      },
    },
  },
  {
    guide: {
      en: "The left half of a fast left-right pair. It demands confidence more than technique: the inputs are small, but they have to be committed and they have to be smooth.",
      zh: "一组高速左右连弯的左半边。它要的是信心多过技术：动作幅度不大，但必须果断，而且必须顺。",
    },
    lesson: {
      title: { en: "Weight transfer", zh: "重量转移" },
      body: {
        en: "Change direction and the car's mass leans across onto the new outside tyres. The car is never quite settled during that shift, so a quick change of direction asks the driver to commit before the platform has stopped moving.",
        zh: "一变向，车的质量就压到新的外侧轮胎上。转移过程中车从来不是完全稳定的，所以快速变向要求车手在车身还没稳住时就下决心。",
      },
    },
  },
  {
    guide: {
      en: "The right half, straight out of the left with no gap. Inputs are bled off gradually rather than released — snap anything here and the car is unsettled for the corner that matters.",
      zh: "右半边，从左弯出来毫无间隙。所有动作要慢慢卸掉而不是猛松——这里任何一个急动作，都会让车在真正重要的那个弯之前失去平衡。",
    },
    lesson: {
      title: { en: "The racing line", zh: "走线" },
      body: {
        en: "The fastest way through a corner is the straightest one: start wide, clip the inside, finish wide. Through a linked pair the line is planned backwards from the exit of the second corner, because that exit is the one that gets paid.",
        zh: "过弯最快的方式是把它走得最直：外侧进、切内侧、外侧出。面对连续弯，走线要从第二个弯的出口倒推着规划，因为拿到回报的是那个出口。",
      },
    },
  },
  {
    name: { en: "Sunway Lagoon Curve", zh: "双威水上乐园弯" },
    guide: {
      en: "Braking and turning at the same time, and the last corner before the back straight. Driver61 calls it critical to lap time for exactly that reason: get it wrong and you are a passenger for the next seven hundred metres.",
      zh: "边刹车边转向，而且是后直道前的最后一个弯。Driver61 正是因此把它列为对圈速最关键的弯之一：这里出错，接下来七百米你就只是个乘客。",
    },
    lesson: {
      title: { en: "DRS", zh: "DRS 可变尾翼" },
      body: {
        en: "The Drag Reduction System opens a flap in the rear wing, cutting drag for more straight-line speed. It is allowed only on designated straights, and only within one second of the car ahead at the detection point. Sepang has two DRS zones, and both of its straights are long enough to make them count.",
        zh: "DRS 会打开尾翼上的一片活动翼板，减少风阻以提高直线速度。它只能在指定直道使用，而且必须在检测点距前车一秒以内。雪邦有两个 DRS 区，两条直道都够长，足以让它真正起作用。",
      },
    },
  },
  {
    guide: {
      en: "A slow left hairpin folding the lap back onto the pit straight. Brake late, then square the corner off — take it in a V rather than an arc — because everything is traded for the exit onto the longest straight of the lap. It is also the entry to the pit lane.",
      zh: "一个慢速左发夹，把这一圈折回主直道。晚刹车，然后把弯走「方」——走 V 字而不是圆弧——因为一切都是为了换取通往全圈最长直道的出弯速度。这里同时也是维修道入口。",
    },
    lesson: {
      title: { en: "The undercut", zh: "Undercut 抢先进站" },
      body: {
        en: "Pit before your rival and you rejoin on fresh tyres while they are still on old ones. A few fast laps and you emerge ahead when they finally stop. It only works if you can clear traffic on the way out — which is why the corner leading onto the pit straight matters so much to strategy.",
        zh: "比对手先进站，你换上新胎时他还在旧胎上。跑几圈快圈，等他进站出来时你已经在前面了。前提是出站后能避开车流——这就是通往主直道的这个弯对策略如此重要的原因。",
      },
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
