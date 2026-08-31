/**
 * Early-October climate normals for Sepang / KLIA.
 *
 * The weather API only forecasts ~16 days ahead, so for most of the year the
 * race weekend is beyond its horizon. Rather than show an empty panel or invent
 * a forecast, the app falls back to what October at Sepang reliably looks like.
 * Every figure here is a long-run normal, and the UI labels it as such.
 */
export const OCTOBER_NORMALS = {
  highC: 33,
  lowC: 24,
  humidityPct: 80,
  monthlyRainMm: 250,
  /** Share of October afternoons with a thunderstorm in the 14:00-18:00 window. */
  afternoonStormChance: 0.6,
  summary:
    "October sits in the monsoon transition. Mornings run hot and bright; convective storms build through the afternoon and most often break between 15:00 and 18:00 - the exact window the Grand Prix runs in.",
} as const;

/** Forecast horizon of the Open-Meteo free tier, in days. */
export const FORECAST_HORIZON_DAYS = 16;
