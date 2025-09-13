import { formatISO, startOfDay, startOfISOWeek } from "date-fns";

/**
 * Calculate streaks for a habit.
 * @param {Object} habit - habit object with frequency (daily/weekly).
 * @param {Array} checkIns - list of checkIns with timestamp (Date).
 * @returns {Object} { currentStreak, longestStreak }
 */
export const calculateStreaks = (habit, checkIns) => {
  if (!checkIns.length) return { currentStreak: 0, longestStreak: 0 };

  // Normalize timestamps to day or week keys
  const keys = new Set(
    checkIns.map((c) => {
      if (habit.frequency === "daily") {
        return formatISO(startOfDay(new Date(c.timestamp)), { representation: "date" });
      } else if (habit.frequency === "weekly") {
        return formatISO(startOfISOWeek(new Date(c.timestamp)), { representation: "date" });
      }
    })
  );

  // Sort keys descending (latest first)
  const sortedKeys = Array.from(keys).sort((a, b) => new Date(b) - new Date(a));

  let currentStreak = 0;
  let longestStreak = 0;

  let cursor = habit.frequency === "daily"
    ? startOfDay(new Date()) // today
    : startOfISOWeek(new Date()); // this week start

  for (let i = 0; i < sortedKeys.length; i++) {
    const key = sortedKeys[i];
    if (formatISO(cursor, { representation: "date" }) === key) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);

      // move cursor back by 1 day or 1 week
      cursor = habit.frequency === "daily"
        ? startOfDay(new Date(cursor.getTime() - 24 * 60 * 60 * 1000))
        : startOfISOWeek(new Date(cursor.getTime() - 7 * 24 * 60 * 60 * 1000));
    } else {
      // break current streak, but keep counting for longest
      currentStreak = 0;
      // reset cursor based on missing period
      cursor = new Date(key);
    }
  }

  return { currentStreak, longestStreak };
};
