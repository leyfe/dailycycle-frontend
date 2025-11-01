// src/utils/habitUtils.js
//import { toISO } from "../components";

// 🔹 ISO-Liste der aktuellen Kalenderwoche (Mo–So)
export function weekIsoList(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const mondayOffset = (d.getDay() + 6) % 7; // Mo=0
  const monday = new Date(d);
  monday.setDate(d.getDate() - mondayOffset);

  return Array.from({ length: 7 }, (_, i) => {
    const x = addDays(monday, i);
    x.setHours(0, 0, 0, 0);
    return toISO(x);
  });
}

export function toISO(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const tzOffset = d.getTimezoneOffset() * 60000;
  const local = new Date(d.getTime() - tzOffset);
  return local.toISOString().slice(0, 10); // z.B. "2025-10-29"
}

export function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

// 🔥 Berechnet den aktuellen Streak (in Tagen, Wochen oder Monaten)
export function calculateStreak(habit, completions) {
  const by = completions?.[habit.id] || {};
  const today = new Date();

  // je nach Frequenz unterschiedlich:
  if (habit.frequency === "täglich" || habit.frequency === "pro_tag") {
    let streak = 0;
    for (let i = 0; i < 999; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const iso = d.toISOString().split("T")[0];
      if (by[iso] && by[iso] >= (habit.times_per_day || 1)) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }

  if (habit.frequency === "pro_woche") {
    // Montag bestimmen
    const getMonday = (date) => {
      const d = new Date(date);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      return new Date(d.setDate(diff));
    };

    let streak = 0;
    for (let i = 0; i < 999; i++) {
      const monday = getMonday(
        new Date(today.getFullYear(), today.getMonth(), today.getDate() - i * 7)
      );
      const isoPrefix = monday.toISOString().split("T")[0].slice(0, 10);
      const weekSum = Object.entries(by)
        .filter(([k]) => {
          const date = new Date(k);
          return date >= monday && date < new Date(monday.getTime() + 7 * 86400000);
        })
        .reduce((sum, [, v]) => sum + v, 0);
      if (weekSum >= (habit.times_per_week || 1)) streak++;
      else break;
    }
    return streak;
  }

  if (habit.frequency === "pro_monat") {
    let streak = 0;
    for (let i = 0; i < 999; i++) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const prefix = d.toISOString().slice(0, 7); // YYYY-MM
      const monthSum = Object.entries(by)
        .filter(([k]) => k.startsWith(prefix))
        .reduce((sum, [, v]) => sum + v, 0);
      if (monthSum >= (habit.times_per_month || 1)) streak++;
      else break;
    }
    return streak;
  }

  return 0;
}

// 🔹 Zähler abhängig vom Zeitraum bilden
export function periodCount(habit, activeDate, completions) {
  const by = completions?.[habit.id] || {};
  const iso = toISO(activeDate);

  switch (habit.frequency) {
    case "täglich":
    case "pro_tag":
      return Number(by[iso] || 0);
    case "pro_woche":
      return weekIsoList(activeDate).reduce(
        (sum, key) => sum + Number(by[key] || 0),
        0
      );
    case "pro_monat": {
      const prefix = iso.slice(0, 7);
      return Object.entries(by)
        .filter(([k]) => k.startsWith(prefix))
        .reduce((sum, [, v]) => sum + Number(v || 0), 0);
    }
    case "pro_jahr": {
      const year = String(activeDate.getFullYear());
      return Object.entries(by)
        .filter(([k]) => k.startsWith(year))
        .reduce((sum, [, v]) => sum + Number(v || 0), 0);
    }
    default:
      return Number(by[iso] || 0);
  }
}

// 🔹 Limit abhängig von der Frequenz bestimmen
export function limitFor(habit) {
  switch (habit.frequency) {
    case "täglich":
    case "pro_tag":
      return Math.max(1, Number(habit.times_per_day || 1));
    case "pro_woche":
      return Math.max(1, Number(habit.times_per_week || 1));
    case "pro_monat":
      return Math.max(1, Number(habit.times_per_month || 1));
    case "pro_jahr":
      return Math.max(1, Number(habit.times_per_year || 1));
    default:
      return 1;
  }
}
