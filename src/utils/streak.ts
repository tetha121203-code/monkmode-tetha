import { HabitLog } from '../types';

export const toDateKey = (d: Date): string => {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12);
  return x.toISOString().split('T')[0];
};

export const calculateHabitStreak = (hid: string, habitLog: HabitLog, today: Date = new Date()): number => {
  const safeLog = habitLog || {};
  const todayKey = toDateKey(today);

  // Check if completed today
  let curr = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12);
  if (!safeLog[todayKey]?.[hid]) {
    // If not completed today, test yesterday
    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 12);
    const yesterdayKey = toDateKey(yesterday);
    if (!safeLog[yesterdayKey]?.[hid]) {
      return 0; // neither today nor yesterday completed
    }
    curr = yesterday;
  }

  let streak = 0;
  while (true) {
    const key = toDateKey(curr);
    if (safeLog[key]?.[hid]) {
      streak++;
      curr.setDate(curr.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
};

export const calculateHabit30DayRate = (hid: string, habitLog: HabitLog, today: Date = new Date(), days: number = 30): number => {
  const safeLog = habitLog || {};
  let count = 0;
  for (let i = 0; i < days; i++) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i, 12);
    const key = toDateKey(d);
    if (safeLog[key]?.[hid]) {
      count++;
    }
  }
  return Math.round((count / days) * 100);
};
