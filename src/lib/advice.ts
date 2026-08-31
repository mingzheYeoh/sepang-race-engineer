import type { HourPoint } from "./weather.ts";
import { localHour, type WeekendState } from "./weekend.ts";
import type { L } from "./i18n.ts";

/** Lower tiers outrank higher ones. Safety is never pushed off the list by logistics. */
export const TIER = { SAFETY: 0, COMFORT: 1, LOGISTICS: 2 } as const;

export type Advice = {
  icon: string;
  text: L;
  tier: (typeof TIER)[keyof typeof TIER];
};

/** Past four entries the panel reads as a noticeboard and nobody reads noticeboards. */
export const MAX_ADVICE = 4;

/**
 * What the app tells a fan to do right now, given the weekend phase and the
 * conditions at the circuit.
 *
 * These are judgement calls about a tropical circuit, not derivations, so they
 * live in one place where they can be argued with and tuned.
 *
 * Almost every rule is conditional, including the ones that are "always" true at
 * Sepang. Sun protection matters on essentially every dry daylight hour of the
 * weekend, but a line that never disappears stops being read by day two, so it is
 * gated on daylight and dry weather — it goes away exactly when nobody would act
 * on it anyway, which keeps it visible when they would.
 */
export function adviceFor(state: WeekendState, now: HourPoint | null, nowMs: number): Advice[] {
  const out: Advice[] = [];
  const hour = localHour(nowMs);
  const daylight = hour >= 8 && hour < 19;

  if (now) {
    // Convective storms here arrive in minutes, and the grandstands are open
    // steel frames. This outranks everything else on the list.
    if (now.rainMm > 2 || now.rainChance >= 85) {
      out.push({
        icon: "⛈️",
        tier: TIER.SAFETY,
        text: {
          en: "Storm cell overhead. Grandstands are open steel — move to the covered concourse at the first thunder. Sessions get red-flagged in this, so you will not miss racing.",
          zh: "雷暴云团正在头顶。看台是开放钢结构，听到第一声雷就往有顶的中庭走。这种天气赛段会被红旗中止，你不会错过比赛。",
        },
      });
    }

    if (now.feelsC >= 38) {
      out.push({
        icon: "🥵",
        tier: TIER.SAFETY,
        text: {
          en: `Feels like ${Math.round(now.feelsC)}°C. Two litres of water per person, minimum, and find shade between sessions.`,
          zh: `体感温度 ${Math.round(now.feelsC)}°C。每人至少两升水，赛段之间一定要找阴凉处。`,
        },
      });
    }

    if (daylight && now.rainChance < 50) {
      out.push({
        icon: "🧴",
        tier: TIER.SAFETY,
        text: {
          en: "Sepang sits 2.8° off the equator — UV index passes 11 by mid-morning. SPF50, and reapply at every session break, not once in the morning.",
          zh: "雪邦距赤道仅 2.8 度，上午过半紫外线指数就超过 11。用 SPF50，而且要在每个赛段间隙补涂，不是早上抹一次就完事。",
        },
      });
    }

    if (now.rainChance >= 60 && now.rainChance < 85) {
      out.push({
        icon: "🌧️",
        tier: TIER.COMFORT,
        text: {
          en: `${now.rainChance}% rain chance. Poncho, not umbrella — umbrellas block the view behind you and most grandstands ban them.`,
          zh: `降雨概率 ${now.rainChance}%。带雨衣，别带伞——伞会挡住后排视线，多数看台也禁止使用。`,
        },
      });
    }
  }

  // Fires exactly while cars are on track and is invisible the rest of the time,
  // which is the whole point: it arrives when it is actionable.
  if (state.current) {
    out.push({
      icon: "🎧",
      tier: TIER.COMFORT,
      text: {
        en: "Cars are running. Trackside peaks past 130 dB — get ear protection in now rather than after the first lap.",
        zh: "赛车已经出场。赛道边峰值超过 130 分贝——现在就把耳塞戴上，别等跑完第一圈。",
      },
    });
  }

  // Long gaps are when the covered walkways are empty. Later, everyone moves at once.
  if (state.status === "break" && (state.msToNext ?? 0) > 90 * 60_000) {
    const mins = Math.round((state.msToNext ?? 0) / 60_000);
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    out.push({
      icon: "🚶",
      tier: TIER.LOGISTICS,
      text: {
        en: `${h}h ${m}m until the next session. The walk between grandstands has no cover — move now, while the concourse is quiet.`,
        zh: `距下一赛段还有 ${h} 小时 ${m} 分。看台之间的通道完全没有遮阳——趁人少现在走。`,
      },
    });
  }

  // Race day is a nine-hour day on a phone that is running this app.
  if (state.next?.id === "RACE" || state.current?.id === "RACE") {
    out.push({
      icon: "🔋",
      tier: TIER.LOGISTICS,
      text: {
        en: "Nine hours on site and a phone doing timing, photos and this app. Bring a power bank; the queues for a socket are longer than the ones for food.",
        zh: "现场九小时，手机要看计时、拍照、还要跑这个应用。带充电宝——插座的队比买吃的还长。",
      },
    });
  }

  if (state.status === "break" || state.status === "before") {
    out.push({
      icon: "💵",
      tier: TIER.LOGISTICS,
      text: {
        en: "Circuit stalls are patchy on Touch 'n Go and cards. Carry small cash — the ATMs on site run dry by Sunday afternoon.",
        zh: "场内摊位对 Touch 'n Go 和刷卡的支持时有时无。带点小额现金——场内的 ATM 到周日下午基本都空了。",
      },
    });
  }

  if (state.status === "after") {
    out.push({
      icon: "🅿️",
      tier: TIER.LOGISTICS,
      text: {
        en: "The car parks take well over an hour to clear. Sit down, let the queue drain, and leave when the road out is moving.",
        zh: "停车场散场要一个多小时。先坐着，等车流散掉，出场的路通了再走。",
      },
    });
  }

  if (out.length === 0) {
    out.push({
      icon: "🎒",
      tier: TIER.COMFORT,
      text: {
        en: "Sun protection, water, ear protection, poncho. Sepang punishes all four omissions.",
        zh: "防晒、饮水、耳塞、雨衣。这四样雪邦一样都不会放过你。",
      },
    });
  }

  return out.sort((a, b) => a.tier - b.tier).slice(0, MAX_ADVICE);
}
