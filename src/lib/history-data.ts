// GENERATED from the Jolpica-F1 API (the Ergast successor). Do not hand-edit.
//
// Every Malaysian Grand Prix held at Sepang: 1999 to 2017, nineteen races.
// The results are final and will never change, so they are frozen here rather
// than fetched at runtime — a live call would add a failure mode and buy
// nothing. Pole position is missing for the three earliest seasons, which the
// source does not carry; the UI says so rather than guessing.
//
// Source: https://api.jolpi.ca/ergast/f1/circuits/sepang/results/1.json

export type SepangRace = {
  season: number;
  round: number;
  date: string;
  winner: string;
  winnerCode: string;
  constructor: string;
  /** Grid slot the winner started from. 1 means pole. */
  grid: number;
  laps: number;
  time: string | null;
  pole: string | null;
};

export const SEPANG_RACES: SepangRace[] = [
  { season: 1999, round: 15, date: "1999-10-17", winner: "Eddie Irvine", winnerCode: "IRV", constructor: "Ferrari", grid: 2, laps: 56, time: "1:36:38.494", pole: null },
  { season: 2000, round: 17, date: "2000-10-22", winner: "Michael Schumacher", winnerCode: "MSC", constructor: "Ferrari", grid: 1, laps: 56, time: "1:35:54.235", pole: null },
  { season: 2001, round: 2, date: "2001-03-18", winner: "Michael Schumacher", winnerCode: "MSC", constructor: "Ferrari", grid: 1, laps: 55, time: "1:47:34.801", pole: null },
  { season: 2002, round: 2, date: "2002-03-17", winner: "Ralf Schumacher", winnerCode: "SCH", constructor: "Williams", grid: 4, laps: 56, time: "1:34:12.912", pole: "Michael Schumacher" },
  { season: 2003, round: 2, date: "2003-03-23", winner: "Kimi Räikkönen", winnerCode: "RAI", constructor: "McLaren", grid: 7, laps: 56, time: "1:32:22.195", pole: "Fernando Alonso" },
  { season: 2004, round: 2, date: "2004-03-21", winner: "Michael Schumacher", winnerCode: "MSC", constructor: "Ferrari", grid: 1, laps: 56, time: "1:31:07.490", pole: "Michael Schumacher" },
  { season: 2005, round: 2, date: "2005-03-20", winner: "Fernando Alonso", winnerCode: "ALO", constructor: "Renault", grid: 1, laps: 56, time: "1:31:33.736", pole: "Fernando Alonso" },
  { season: 2006, round: 2, date: "2006-03-19", winner: "Giancarlo Fisichella", winnerCode: "FIS", constructor: "Renault", grid: 1, laps: 56, time: "1:30:40.529", pole: "Giancarlo Fisichella" },
  { season: 2007, round: 2, date: "2007-04-08", winner: "Fernando Alonso", winnerCode: "ALO", constructor: "McLaren", grid: 2, laps: 56, time: "1:32:14.930", pole: "Felipe Massa" },
  { season: 2008, round: 2, date: "2008-03-23", winner: "Kimi Räikkönen", winnerCode: "RAI", constructor: "Ferrari", grid: 2, laps: 56, time: "1:31:18.555", pole: "Felipe Massa" },
  { season: 2009, round: 2, date: "2009-04-05", winner: "Jenson Button", winnerCode: "BUT", constructor: "Brawn", grid: 1, laps: 31, time: "1:10:52.092", pole: "Jenson Button" },
  { season: 2010, round: 3, date: "2010-04-04", winner: "Sebastian Vettel", winnerCode: "VET", constructor: "Red Bull", grid: 3, laps: 56, time: "1:33:48.412", pole: "Mark Webber" },
  { season: 2011, round: 2, date: "2011-04-10", winner: "Sebastian Vettel", winnerCode: "VET", constructor: "Red Bull", grid: 1, laps: 56, time: "1:37:39.832", pole: "Sebastian Vettel" },
  { season: 2012, round: 2, date: "2012-03-25", winner: "Fernando Alonso", winnerCode: "ALO", constructor: "Ferrari", grid: 8, laps: 56, time: "2:44:51.812", pole: "Lewis Hamilton" },
  { season: 2013, round: 2, date: "2013-03-24", winner: "Sebastian Vettel", winnerCode: "VET", constructor: "Red Bull", grid: 1, laps: 56, time: "1:38:56.681", pole: "Sebastian Vettel" },
  { season: 2014, round: 2, date: "2014-03-30", winner: "Lewis Hamilton", winnerCode: "HAM", constructor: "Mercedes", grid: 1, laps: 56, time: "1:40:25.974", pole: "Lewis Hamilton" },
  { season: 2015, round: 2, date: "2015-03-29", winner: "Sebastian Vettel", winnerCode: "VET", constructor: "Ferrari", grid: 2, laps: 56, time: "1:41:05.793", pole: "Lewis Hamilton" },
  { season: 2016, round: 16, date: "2016-10-02", winner: "Daniel Ricciardo", winnerCode: "RIC", constructor: "Red Bull", grid: 4, laps: 56, time: "1:37:12.776", pole: "Lewis Hamilton" },
  { season: 2017, round: 15, date: "2017-10-01", winner: "Max Verstappen", winnerCode: "VER", constructor: "Red Bull", grid: 3, laps: 56, time: "1:30:01.290", pole: "Lewis Hamilton" },
];
