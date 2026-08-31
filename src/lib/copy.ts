import type { L } from "./i18n";

/**
 * Every string the interface says for itself.
 *
 * Content that belongs to the data — corner guides, session notes, advice, radio
 * lines — is translated next to that data instead, so a fact and its wording can
 * never drift apart. This file is only the chrome.
 */
export const COPY = {
  meta: {
    appTitle: { en: "Sepang Race Engineer", zh: "雪邦赛车工程师" },
    appDescription: {
      en: "An unofficial companion for a Sepang Grand Prix weekend: schedule, tropical weather, circuit guide and pit-wall strategy.",
      zh: "雪邦大奖赛周末的非官方随身助手：赛程、热带天气、赛道指南与维修站墙策略。",
    },
    trackTitle: { en: "Circuit Guide | Sepang Race Engineer", zh: "赛道指南 | 雪邦赛车工程师" },
    trackDescription: {
      en: "All fifteen corners of Sepang International Circuit, drawn to scale from surveyed coordinates, each explaining one idea from Formula 1.",
      zh: "雪邦国际赛道的十五个弯，按实测坐标等比绘制，每个弯讲透一个 F1 概念。",
    },
    pitwallTitle: { en: "Pit Wall | Sepang Race Engineer", zh: "维修站墙 | 雪邦赛车工程师" },
    pitwallDescription: {
      en: "Track temperature, tyre degradation and the pit-stop call for a Sepang Grand Prix — a transparent model you can argue with.",
      zh: "雪邦大奖赛的赛道温度、轮胎衰减与进站决策——一个所有常数都摊开、可以被质询的模型。",
    },
  },

  disclaimer: {
    en: "Unofficial fan project. Not affiliated with Formula 1, the FIA, or Sepang International Circuit. A 2026 Sepang round is this project's premise, not an announcement.",
    zh: "非官方车迷项目，与 Formula 1、FIA 及雪邦国际赛道均无关联。2026 年雪邦分站是本项目的假设情景，并非官方消息。",
  },

  nav: {
    paddock: { en: "Paddock", zh: "围场" },
    circuit: { en: "Circuit", zh: "赛道" },
    pitwall: { en: "Pit Wall", zh: "维修站墙" },
    radio: { en: "Radio", zh: "无线电" },
  },

  paddock: {
    eyebrow: { en: "Race Engineer", zh: "赛车工程师" },
    dates: { en: "2–4 October 2026", zh: "2026 年 10 月 2–4 日" },
    laps: { en: "laps", zh: "圈" },
    status: {
      before: { en: "Countdown", zh: "倒计时" },
      live: { en: "Session live", zh: "赛段进行中" },
      break: { en: "Between sessions", zh: "赛段间隙" },
      after: { en: "Weekend complete", zh: "周末结束" },
    },
    remaining: { en: "remaining", zh: "剩余时间" },
    startsAt: { en: "starts", zh: "开始于" },
    finished: {
      en: "Chequered flag. Sepang closes out the weekend.",
      zh: "格子旗落下，雪邦的周末到此为止。",
    },
    conditionsTitle: { en: "At the circuit now", zh: "赛道实时状况" },
    air: { en: "Air", zh: "气温" },
    feels: { en: "Feels", zh: "体感" },
    track: { en: "Track", zh: "赛道" },
    rain: { en: "Rain", zh: "降雨" },
    humidityNote: {
      en: "Track temperature is estimated from air temperature and rainfall — no public feed measures it.",
      zh: "赛道温度由气温与降雨量推算——没有任何公开数据源实测这个值。",
    },
    humidity: { en: "Humidity", zh: "湿度" },
    weatherDown: {
      en: "Weather service unreachable. Everything else on this page still works.",
      zh: "天气服务连不上。本页其余部分照常可用。",
    },
    outlookTitle: { en: "Weekend outlook", zh: "周末天气展望" },
    typicalHigh: { en: "Typical high", zh: "常年高温" },
    stormOdds: { en: "Storm odds", zh: "雷暴概率" },
    normalsNote: {
      en: "October normals, not a forecast. The hourly forecast for race weekend opens about 16 days out.",
      zh: "这是十月气候常年值，不是预报。比赛周末的逐小时预报约在赛前 16 天开放。",
    },
    scheduleTitle: { en: "Schedule · Malaysia (UTC+8)", zh: "赛程 · 马来西亚时间（UTC+8）" },
    notesTitle: { en: "Engineer's notes", zh: "工程师提醒" },
    timeTravel: { en: "Time travel", zh: "时间旅行" },
    timeTravelActive: { en: "active", zh: "已启用" },
    timeTravelNote: {
      en: "Jump the app to any point in the race weekend — the countdown, the advice and the radio all follow.",
      zh: "把整个应用跳到比赛周末的任意时刻——倒计时、现场提醒和无线电都会跟着变。",
    },
    now: { en: "Now", zh: "现在" },
  },

  track: {
    eyebrow: { en: "Circuit Guide", zh: "赛道指南" },
    titleTop: { en: "FIFTEEN", zh: "十五个" },
    titleBottom: { en: "CORNERS", zh: "弯角" },
    intro: {
      en: "of surveyed centre line, clockwise, north up. Two long straights run the length of the circuit and meet a slow corner at each end — which is why Sepang still overtakes better than most tracks built since.",
      zh: "的实测赛道中心线，顺时针，正北朝上。两条长直道贯穿全场，两端各接一个慢弯——这正是雪邦至今仍比后来建的大多数赛道更容易超车的原因。",
    },
    turns: { en: "Turns", zh: "弯道" },
    slowOnes: { en: "Slow ones", zh: "慢弯" },
    drsZones: { en: "DRS zones", zh: "DRS 区" },
    mapAlt: {
      en: "Map of Sepang International Circuit drawn from surveyed coordinates, with fifteen numbered corners",
      zh: "由实测坐标绘制的雪邦国际赛道图，标注十五个弯角",
    },
    prompt: {
      en: "Tap a corner, on the map or the numbers above, for what happens there — and the one piece of Formula 1 it explains best. Fifteen corners, fifteen ideas, in the order you meet them on a lap.",
      zh: "点地图上的弯角或上方的数字，看那里会发生什么——以及它最适合解释的那一个 F1 概念。十五个弯，十五个知识点，按你跑一圈遇到它们的顺序排列。",
    },
    sweep: { en: "Sweep", zh: "扫掠角" },
    length: { en: "Length", zh: "弯长" },
    runUp: { en: "Run-up", zh: "进弯直道" },
    metres: { en: "metres", zh: "米" },
    left: { en: "Left", zh: "左" },
    right: { en: "Right", zh: "右" },
    leftHander: { en: "Left hander", zh: "左弯" },
    rightHander: { en: "Right hander", zh: "右弯" },
    slow: { en: "slow", zh: "慢速" },
    medium: { en: "medium", zh: "中速" },
    fast: { en: "fast", zh: "高速" },
    learnHere: { en: "Learn this here", zh: "在这里学一个概念" },
    turnLabel: { en: "Turn %N%", zh: "第 %N% 弯" },
    fromLine: { en: "m from the line", zh: "米处（距起跑线）" },
    perMetre: { en: "° of turn per metre", zh: "°/米 的转向密度" },
    close: { en: "Close", zh: "关闭" },
    prevCorner: { en: "Previous corner", zh: "上一个弯" },
    nextCorner: { en: "Next corner", zh: "下一个弯" },
    cornersLabel: { en: "Corners", zh: "弯道" },
    sourcesTitle: { en: "Where this comes from", zh: "资料来源" },
    sourcesIntro: {
      en: "The line is drawn to scale from surveyed coordinates, north up — %LAP% m against an official 5,543 m. Corner hands and speeds are computed from that line rather than transcribed; names and driving character come from published guides.",
      zh: "赛道线按实测坐标等比绘制，正北朝上——%LAP% 米，官方长度 5,543 米。弯道的左右与快慢是从这条线算出来的，不是抄来的；弯名和驾驶特性来自公开的赛道指南。",
    },
    attribution: {
      en: "Map data © OpenStreetMap contributors, ODbL.",
      zh: "地图数据 © OpenStreetMap 贡献者，ODbL 许可。",
    },
  },

  pitwall: {
    eyebrow: { en: "Pit Wall", zh: "维修站墙" },
    titleTop: { en: "THE", zh: "这一" },
    titleBottom: { en: "CALL", zh: "决策" },
    intro: {
      en: "laps in tropical heat. Sepang was known as a two-stop race when most circuits were one, and the reason is on this page: track temperature drives tyre wear, tyre wear drives the number of stops, and everything else follows.",
      zh: "圈，在热带高温下完成。当年别的赛道普遍一停时，雪邦以两停著称——原因就在这一页：赛道温度决定轮胎磨损，磨损决定进站次数，其余一切随之而来。",
    },
    trackTemp: { en: "Track temperature", zh: "赛道温度" },
    resetToLive: { en: "reset to live", zh: "恢复实时值" },
    estimated: {
      en: "Estimated from live air temperature and rainfall.",
      zh: "由实时气温与降雨量推算。",
    },
    moved: { en: "You moved this. Live estimate is", zh: "你手动调整了。实时推算值为" },
    wearRuns: { en: "Wear runs", zh: "磨损速率是" },
    sliderLabel: { en: "Track temperature in Celsius", zh: "赛道温度（摄氏度）" },
    sliderCold: { en: "28° wet-ish", zh: "28° 偏湿冷" },
    sliderTypical: { en: "48° typical", zh: "48° 典型" },
    sliderBrutal: { en: "68° brutal", zh: "68° 极端" },
    theCall: { en: "The call", zh: "策略决策" },
    disagree: { en: "If you disagree", zh: "备选方案" },
    stop: { en: "-stop", zh: " 停" },
    boxOnLap: { en: "Box on lap", zh: "进站圈数：" },
    lapsRange: { en: "laps %A%–%B%", zh: "第 %A%–%B% 圈" },
    boxLaps: { en: "%L%", zh: "%L% 圈" },
    rainRisk: { en: "Rain risk", zh: "降雨风险" },
    rainHigh: {
      en: "High enough that the dry plan above is a starting point, not a decision. A wet track drops the surface temperature by twenty degrees or more, so degradation stops mattering and track position starts to.",
      zh: "高到上面这套干地方案只能当起点，不能当决定。湿赛道会让路面温度直降二十度以上，磨损不再是关键，赛道位置才是。",
    },
    rainMedium: {
      en: "Enough to keep intermediates ready. A Sepang shower can arrive between one stop and the next, and the team that pits on the first lap of it usually wins the day.",
      zh: "足以让人把半雨胎备好。雪邦的阵雨可能就下在两次进站之间，而下雨第一圈就进站的车队通常赢下当天。",
    },
    rainLow: {
      en: "Low. The plan above should hold, though October afternoons here change their mind quickly.",
      zh: "偏低。上面的方案大概率成立——不过雪邦十月的下午向来说变就变。",
    },
    builtOn: { en: "What this is built on", zh: "模型的全部常数" },
    raceDistance: { en: "Race distance", zh: "比赛距离" },
    referenceLap: { en: "Reference lap", zh: "基准单圈" },
    pitCost: { en: "Pit lane cost", zh: "进站损失" },
    wearRef: { en: "Wear reference", zh: "磨损基准温度" },
    modelNote: {
      en: "A model, not a feed. There is no lawful public source of live Formula 1 timing, so nothing here is claimed to be one. The numbers above are the whole model — change the track temperature and watch the call move.",
      zh: "这是一个模型，不是数据源。F1 实时计时没有合法的公开来源，所以这里不假装有。上面就是模型的全部——拖动赛道温度，看决策自己变。",
    },
  },

  radio: {
    title: { en: "Team Radio", zh: "车队无线电" },
    check: {
      en: "Radio check. Tap a question below, or ask your own.",
      zh: "无线电测试。点下面的问题，或者自己问一个。",
    },
    placeholder: { en: "Ask the engineer…", zh: "问问工程师…" },
    inputLabel: { en: "Ask the engineer a question", zh: "向工程师提问" },
    send: { en: "Send", zh: "发送" },
    presetTag: { en: "preset", zh: "预设" },
    dropped: {
      en: "Radio's cut out. Check your connection.",
      zh: "无线电断了。检查一下你的网络。",
    },
    close: { en: "Close", zh: "关闭" },
    closeRadio: { en: "Close team radio", zh: "关闭车队无线电" },
  },
} as const;

/** Fill %TOKEN% placeholders without pulling in a formatting library. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/%(\w+)%/g, (_, k) => String(values[k] ?? ""));
}

export type Copy = typeof COPY;
export type { L };
