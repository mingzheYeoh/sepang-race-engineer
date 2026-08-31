import { CIRCUIT } from "./weekend.ts";

export type HourPoint = {
  time: string;
  tempC: number;
  feelsC: number;
  rainChance: number;
  rainMm: number;
  humidity: number;
};

export type SepangWeather = {
  now: HourPoint;
  /** Hourly points from the current hour onward, across the race weekend. */
  hours: HourPoint[];
  fetchedAt: string;
};

/** Nothing to hide here: Open-Meteo needs no API key, so this runs server-side purely for caching. */
const ENDPOINT =
  `https://api.open-meteo.com/v1/forecast` +
  `?latitude=${CIRCUIT.lat}&longitude=${CIRCUIT.lon}` +
  `&timezone=${encodeURIComponent(CIRCUIT.timezone)}` +
  `&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation` +
  `&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation_probability,precipitation` +
  `&forecast_days=7`;

type OpenMeteo = {
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    precipitation: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    apparent_temperature: number[];
    relative_humidity_2m: number[];
    precipitation_probability: number[];
    precipitation: number[];
  };
};

export async function getSepangWeather(): Promise<SepangWeather | null> {
  try {
    const res = await fetch(ENDPOINT, { next: { revalidate: 600 } });
    if (!res.ok) return null;
    const d = (await res.json()) as OpenMeteo;

    const hours: HourPoint[] = d.hourly.time.map((time, i) => ({
      time,
      tempC: d.hourly.temperature_2m[i],
      feelsC: d.hourly.apparent_temperature[i],
      rainChance: d.hourly.precipitation_probability[i],
      rainMm: d.hourly.precipitation[i],
      humidity: d.hourly.relative_humidity_2m[i],
    }));

    return {
      now: {
        time: d.current.time,
        tempC: d.current.temperature_2m,
        feelsC: d.current.apparent_temperature,
        rainChance: hours[0]?.rainChance ?? 0,
        rainMm: d.current.precipitation,
        humidity: d.current.relative_humidity_2m,
      },
      hours,
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    // The page degrades to a no-weather state rather than failing to render.
    return null;
  }
}

/**
 * Track temperature is not measured by any public feed, so we estimate it.
 * Asphalt in tropical sun runs far above air temperature; the gap collapses
 * once it rains. Rough but honest, and labelled as an estimate in the UI.
 */
export function estimateTrackTemp(h: HourPoint): number {
  const wet = h.rainMm > 0.1 || h.rainChance > 70;
  return Math.round(h.tempC + (wet ? 3 : 16));
}
