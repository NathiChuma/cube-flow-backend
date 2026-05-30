import { Solve, StreakStats } from '../../types';

const calculateStreaks = (solves: Solve[]): StreakStats => {
  const days = [
    ...new Set(
      solves
        .filter((s) => !s.dnf)
        .map((s) => new Date(s.timestamp).toISOString().slice(0, 10))
    ),
  ].sort();

  let longestStreak = 0;
  let streak = 0;

  for (let i = 0; i < days.length; i++) {
    if (i === 0) {
      streak = 1;
    } else {
      const diff =
        (new Date(days[i]).getTime() - new Date(days[i - 1]).getTime()) /
        (1000 * 60 * 60 * 24);
      streak = diff === 1 ? streak + 1 : 1;
    }
    if (streak > longestStreak) longestStreak = streak;
  }

  let currentStreak = 0;
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  const lastDay = days[days.length - 1];

  if (lastDay === today || lastDay === yesterday) {
    let i = days.length - 1;
    currentStreak = 1;
    while (i > 0) {
      const diff =
        (new Date(days[i]).getTime() - new Date(days[i - 1]).getTime()) /
        (1000 * 60 * 60 * 24);
      if (diff === 1) {
        currentStreak++;
        i--;
      } else {
        break;
      }
    }
  }

  return { currentStreak, longestStreak };
};

export default calculateStreaks;
