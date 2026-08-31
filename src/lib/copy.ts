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
    paddockTitle: { en: "Paddock | Sepang Race Engineer", zh: "围场 | 雪邦赛车工程师" },
    paddockDescription: {
      en: "The live session or the countdown to the next one, the hour-by-hour Sepang forecast, and what both of them mean for the weekend.",
      zh: "正在进行的场次或下一场的倒计时、雪邦逐小时天气，以及这两者对这个周末意味着什么。",
    },
    trackTitle: { en: "Circuit Guide | Sepang Race Engineer", zh: "赛道指南 | 雪邦赛车工程师" },
    trackDescription: {
      en: "All fifteen corners of Sepang International Circuit, drawn to scale from surveyed coordinates, each explaining one idea from Formula 1.",
      zh: "雪邦国际赛道的十五个弯，按实测坐标等比绘制，每个弯讲透一个 F1 概念。",
    },
    pitwallTitle: { en: "Pit Wall | Sepang Race Engineer", zh: "维修站墙 | 雪邦赛车工程师" },
    archiveTitle: { en: "Archive | Sepang Race Engineer", zh: "历史档案 | 雪邦赛车工程师" },
    archiveDescription: {
      en: "Every Malaysian Grand Prix held at Sepang from 1999 to 2017, with a quiz generated from the results themselves.",
      zh: "1999 至 2017 年雪邦举办的每一场马来西亚大奖赛，以及一份由真实成绩自动生成的测验。",
    },
    predictTitle: { en: "Grid Call | Sepang Race Engineer", zh: "赛前预测 | 雪邦赛车工程师" },
    visitTitle: { en: "Plan Your Visit | Sepang Race Engineer", zh: "到场攻略 | 雪邦赛车工程师" },
    visitDescription: {
      en: "Which grandstand to sit in at Sepang, what you see from each, and how to get there — with the choice weighed against the live weather.",
      zh: "雪邦该坐哪个看台、每个看台能看到什么、怎么到达——并结合实时天气给出建议。",
    },
    predictDescription: {
      en: "Five calls on how the Sepang race goes, each priced against what nineteen races here actually did.",
      zh: "关于雪邦这场比赛的五个判断，每一条都对照这里十九场比赛的真实概率。",
    },
    pitwallDescription: {
      en: "Track temperature, tyre degradation and the pit-stop call for a Sepang Grand Prix — a transparent model you can argue with.",
      zh: "雪邦大奖赛的赛道温度、轮胎衰减与进站决策——一个所有常数都摊开、可以被质询的模型。",
    },
  },

  disclaimer: {
    en: "Unofficial fan project. Not affiliated with Formula 1, the FIA, Bahrain International Circuit or Sepang International Circuit. Formula 1 and the FIA have confirmed that Malaysia hosts the 2026 Bahrain Grand Prix at Sepang on 2–4 October; always check the official sites for schedules, tickets and access.",
    zh: "非官方车迷项目，与 Formula 1、FIA、巴林国际赛道及雪邦国际赛道均无关联。Formula 1 与 FIA 已确认 2026 年巴林大奖赛于 10 月 2–4 日在雪邦举办；赛程、门票与入场信息请以官方网站为准。",
  },

  nav: {
    home: { en: "Home", zh: "主页" },
    paddock: { en: "Paddock", zh: "围场" },
    circuit: { en: "Circuit", zh: "赛道" },
    pitwall: { en: "Pit Wall", zh: "维修站墙" },
    radio: { en: "Radio", zh: "无线电" },
    back: { en: "Home", zh: "主页" },
    loading: { en: "Loading", zh: "加载中" },
  },

  /** The landing page: what this is, and the way in to each part of it. */
  home: {
    eyebrow: { en: "Unofficial fan project", zh: "非官方车迷项目" },
    lede: {
      en: "Formula 1 returns to Sepang. Six tools for the weekend — the live schedule, the tropical weather that decides everything, the circuit corner by corner, and a strategy model you can argue with.",
      zh: "F1 重返雪邦。为这个周末准备的六件工具：实时赛程、决定一切的热带天气、逐弯拆解的赛道，以及一个可以被你质询的策略模型。",
    },
    enter: { en: "Start at the Paddock", zh: "从围场开始" },
    cornersWord: { en: "corners", zh: "个弯" },
    sectionsTitle: { en: "Everything here", zh: "全部功能" },
    paddockSub: { en: "Live session, countdown and the hour-by-hour forecast", zh: "进行中的场次、倒计时与逐小时天气" },
    circuitSub: { en: "All 15 corners, drawn 1:1 from surveyed coordinates", zh: "15 个弯，按实测坐标 1:1 绘制" },
    pitwallSub: { en: "A tyre model that finds its own strategy", zh: "自己找出策略的轮胎模型" },
    visitSub: { en: "Which grandstand to sit in, and how to get there", zh: "该坐哪个看台，以及怎么到达" },
    predictSub: { en: "Five calls, priced against 19 real races", zh: "五个判断，对照 19 场真实比赛定价" },
    archiveSub: { en: "Every Malaysian Grand Prix at Sepang, 1999–2017", zh: "1999–2017 雪邦每一场马来西亚大奖赛" },
  },

  /**
   * The first-run tour. Step two deliberately holds no descriptions of its own —
   * it renders the same six lines the landing page does, so the tour cannot
   * teach a version of the app that no longer exists.
   */
  tour: {
    skip: { en: "Skip", zh: "跳过" },
    next: { en: "Next", zh: "下一步" },
    back: { en: "Back", zh: "上一步" },
    start: { en: "Start", zh: "开始" },
    reopen: { en: "Replay the tour", zh: "重看引导" },
    step: { en: "Step %N% of %T%", zh: "第 %N% 步 / 共 %T% 步" },

    s1Title: { en: "Welcome aboard", zh: "欢迎上车" },
    s1Body: {
      en: "Formula 1 comes to Sepang on 2–4 October 2026. This is an unofficial fan project — six tools for that weekend, built on public data. Nothing here is live timing, and nothing here is affiliated with F1 or the circuit.",
      zh: "F1 将于 2026 年 10 月 2–4 日来到雪邦。这是一个非官方车迷项目——为那个周末准备的六件工具，全部基于公开数据。这里没有实时计时，也与 F1 及赛道方没有任何关联。",
    },

    s2Title: { en: "What each page does", zh: "每个页面是干嘛的" },

    s3Title: { en: "Finding your way", zh: "怎么找路" },
    s3Body: {
      en: "The bar at the bottom of the screen holds Home, Circuit, Pit Wall and the Team Radio. Everything else is one tap from Home, and the arrow at the top left always brings you back there. Language and dark/light sit at the top right.",
      zh: "屏幕底部那一栏是主页、赛道、维修站墙和车队无线电。其余功能都在主页上一点即到，左上角的箭头永远把你带回主页。语言和深/浅色在右上角。",
    },

    s4Title: { en: "One thing worth knowing", zh: "有一件事值得先知道" },
    s4Body: {
      en: "The tyre strategy is a model, not a feed. It is given lap times and degradation rates and works out the stops itself — every constant behind it is printed on the Pit Wall page, so you can disagree with it. The weather is a real forecast; the track temperature on top of it is an estimate, and says so.",
      zh: "轮胎策略是一个模型，不是实时数据。它拿到圈速和衰减率之后自己算出进站方案——背后每一个常数都印在维修站墙那一页上，所以你可以不同意它。天气是真实预报；叠在上面的赛道温度是推算值，页面上也这么写。",
    },
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
    moreTitle: { en: "Also here", zh: "还有这些" },
    goPredict: { en: "Make your call", zh: "做出你的判断" },
    goPredictSub: { en: "Five predictions, priced against 19 races", zh: "五个预测，对照 19 场真实比赛" },
    goArchive: { en: "The archive", zh: "历史档案" },
    goArchiveSub: { en: "1999–2017, and a quiz from the results", zh: "1999–2017，以及由成绩生成的测验" },
    goVisit: { en: "Plan your visit", zh: "到场攻略" },
    goVisitSub: { en: "Where to sit, and how to get there", zh: "坐哪里，怎么到" },
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

  archive: {
    eyebrow: { en: "Archive", zh: "历史档案" },
    titleTop: { en: "NINETEEN", zh: "十九场" },
    titleBottom: { en: "RACES", zh: "比赛" },
    intro: {
      en: "Every Malaysian Grand Prix held at Sepang, 1999 to 2017. Final results, frozen — none of it will change again, so none of it is fetched at runtime.",
      zh: "雪邦举办过的每一场马来西亚大奖赛，1999 到 2017 年。最终成绩已固化——这些数字不会再变，所以也不需要实时拉取。",
    },
    statRaces: { en: "Races", zh: "场次" },
    statFromPole: { en: "Won from pole", zh: "杆位夺冠" },
    statTopDriver: { en: "Most wins", zh: "夺冠最多" },
    quizTitle: { en: "Test yourself", zh: "来考一考" },
    quizIntro: {
      en: "Six questions, generated from the results above — so every answer is checkable, and none of them were written by hand.",
      zh: "六道题，全部由上面的真实成绩生成——每个答案都可以核对，没有一道是手写的。",
    },
    start: { en: "Start", zh: "开始" },
    again: { en: "Play again", zh: "再来一局" },
    question: { en: "Question %N% of %T%", zh: "第 %N% / %T% 题" },
    correct: { en: "Correct", zh: "答对了" },
    wrong: { en: "Not quite", zh: "答错了" },
    next: { en: "Next", zh: "下一题" },
    seeScore: { en: "See score", zh: "看成绩" },
    scored: { en: "You scored %S% out of %T%", zh: "你答对了 %S% / %T% 题" },
    verdictHigh: { en: "Pit wall material.", zh: "可以上维修站墙了。" },
    verdictMid: { en: "Solid weekend form.", zh: "周末状态不错。" },
    verdictLow: { en: "Worth another lap of the archive.", zh: "建议再看一遍档案。" },
    timelineTitle: { en: "Every race", zh: "全部比赛" },
    winner: { en: "Winner", zh: "冠军" },
    fromGrid: { en: "from P%G%", zh: "第 %G% 位发车" },
    fromPoleShort: { en: "from pole", zh: "杆位发车" },
    lapsShort: { en: "%L% laps", zh: "%L% 圈" },
    shortened: { en: "stopped early", zh: "提前终止" },
  },

  predict: {
    eyebrow: { en: "Grid Call", zh: "赛前预测" },
    titleTop: { en: "YOUR", zh: "你的" },
    titleBottom: { en: "CALL", zh: "判断" },
    intro: {
      en: "Five calls on how the Sepang race goes. No driver line-up to guess at — these are about the circuit, and each one is priced against what nineteen races here actually did.",
      zh: "关于雪邦这场比赛的五个判断。不用猜车手名单——这些问的是赛道本身，而且每一条都对照了这里十九场比赛的真实概率。",
    },
    history: { en: "History says", zh: "历史数据" },
    ofRaces: { en: "of %O% races", zh: "／共 %O% 场" },
    modelSays: { en: "The model says", zh: "模型判断" },
    climateSays: { en: "October normals say", zh: "十月常年值" },
    yes: { en: "Yes", zh: "会" },
    no: { en: "No", zh: "不会" },
    withHistory: { en: "with the record", zh: "与历史一致" },
    againstHistory: { en: "against the record", zh: "与历史相反" },
    cardTitle: { en: "Your Sepang card", zh: "你的雪邦预测卡" },
    unanswered: { en: "%N% still to call", zh: "还有 %N% 项没选" },
    share: { en: "Share", zh: "分享" },
    copied: { en: "Link copied", zh: "链接已复制" },
    reset: { en: "Start over", zh: "重新来过" },
    saved: { en: "Saved on this device.", zh: "已保存在本机。" },
    shareText: {
      en: "My Sepang Grand Prix call",
      zh: "我的雪邦大奖赛预测",
    },
    q: {
      rain: { en: "Rain during the race?", zh: "正赛期间会下雨吗？" },
      stops: { en: "How many pit stops for the winner?", zh: "冠军会进几次站？" },
      pole: { en: "Does the winner come from pole?", zh: "冠军会来自杆位吗？" },
      distance: { en: "Does the race go the full 56 laps?", zh: "比赛会跑满 56 圈吗？" },
      topThree: { en: "Does the winner start in the top three?", zh: "冠军会从前三位发车吗？" },
    },
  },

  visit: {
    eyebrow: { en: "Plan Your Visit", zh: "到场攻略" },
    titleTop: { en: "WHERE", zh: "该坐" },
    titleBottom: { en: "TO SIT", zh: "哪里" },
    intro: {
      en: "Seven ticketed areas, and only one of the open ones has a roof. At a circuit where the heat and the afternoon storms decide the day, that is the whole decision.",
      zh: "七个售票区域，而露天区里只有一个有顶棚。在一条被高温和午后雷暴主宰的赛道上，这基本就是全部的决定。",
    },
    callTitle: { en: "Today's call", zh: "今天的建议" },
    mapTitle: { en: "Where they are", zh: "位置示意" },
    mapNote: {
      en: "Stand positions are placed from the turns the organisers say each one overlooks; the exact footprints are not published.",
      zh: "看台位置依据主办方公布的「面向哪几个弯」推算标注；官方并未公布准确范围。",
    },
    standsTitle: { en: "Every stand", zh: "全部看台" },
    seated: { en: "Seated · roofed", zh: "有座位 · 有顶" },
    grassCovered: { en: "Grass · partly covered", zh: "草地 · 部分有顶" },
    grassOpen: { en: "Grass · open air", zh: "草地 · 露天" },
    localsOnly: { en: "MyKad holders only", zh: "仅限 MyKad 持有者" },
    watches: { en: "Turns %T%", zh: "第 %T% 弯" },
    ticketsNote: {
      en: "Prices and availability change, so they are not copied here. Buy from the official ticketing pages.",
      zh: "票价与余票会变动，这里不做转载。请从官方购票页购买。",
    },
    officialTickets: { en: "Official ticketing", zh: "官方购票" },
    gettingHere: { en: "Getting here", zh: "如何到达" },
    address: { en: "Address", zh: "地址" },
    addressValue: {
      en: "Jalan Pekeliling, 64000 KLIA, Selangor Darul Ehsan, Malaysia",
      // The street line stays in Malay so it can be shown to a Grab driver as is;
      // only the state and country are localised.
      zh: "Jalan Pekeliling, 64000 KLIA，雪兰莪州，马来西亚",
    },
    fromAirport: { en: "From KL International Airport", zh: "距吉隆坡国际机场" },
    fromAirportValue: { en: "Adjacent to the airport", zh: "紧邻机场" },
    fromCity: { en: "From Kuala Lumpur city centre", zh: "距吉隆坡市中心" },
    fromCityValue: { en: "85 km, about 30 minutes", zh: "85 公里，约 30 分钟" },
    openMaps: { en: "Open in Maps", zh: "在地图中打开" },
    tourTitle: { en: "Circuit tour", zh: "赛道导览" },
    tourBody: {
      en: "The circuit runs guided tours of about 1 to 1.5 hours, through the paddock, race control, the timekeeping room, the media centre and the podium. Under-6s go free; Malaysian residents have a MyKad rate.",
      zh: "赛道提供约 1 至 1.5 小时的导览，路线包含围场、赛事控制室、计时室、媒体中心与领奖台。6 岁以下免费；马来西亚居民有 MyKad 优惠价。",
    },
    parkingTitle: { en: "Parking and transport", zh: "停车与交通" },
    parkingBody: {
      en: "Not published yet. Neither the circuit nor the event organisers have released parking, shuttle or gate information for this race, and it is usually announced in the weeks before the weekend. Nothing is guessed at here — check the official sites closer to the date.",
      zh: "官方尚未公布。赛道方与赛事主办方都还没有发布本场比赛的停车、接驳与入场闸口信息，这类信息通常在赛前数周才公开。这里不做任何猜测——临近日期请查看官方网站。",
    },
    sourceNote: {
      en: "Stand names, what each overlooks, and the visitor details above come from the event and circuit organisers' own published pages.",
      zh: "看台名称、各自面向的弯道，以及上述到场信息，均来自赛事方与赛道方公开发布的页面。",
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
    engineer: { en: "Engineer", zh: "工程师" },
    you: { en: "You", zh: "你" },
    thinking: { en: "Engineer is on the radio", zh: "工程师正在回话" },
    presetsLabel: { en: "Quick questions", zh: "快捷提问" },
    clear: { en: "Clear", zh: "清空" },
    live: { en: "Answered by the model", zh: "由模型作答" },
  },
} as const;

/** Fill %TOKEN% placeholders without pulling in a formatting library. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/%(\w+)%/g, (_, k) => String(values[k] ?? ""));
}

export type Copy = typeof COPY;
export type { L };
