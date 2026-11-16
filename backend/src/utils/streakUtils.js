import { isScheduled } from "./habitSchedule.js";
import { weekdayOf, isValidDate } from "./dateUtils.js";

// Move one calendar day backward
const previousDate = (dateString) => {
  const date = new Date(`${dateString}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
};

// Get logs in a Map for faster lookup
const createLogMap = (logs) => {
  const logMap = new Map();

  for (const log of logs) {
    logMap.set(log.date, log.status);
  }

  return logMap;
};

// Calculate current streak
 const calculateCurrentStreak = (logs, habit, today) => {
  if (!isValidDate(today)) return 0;

  const logMap = createLogMap(logs);

  let currentStreak = 0;
  let date = today;

  // If today is not completed, start checking from yesterday.
  if (logMap.get(today) !== "done") {
    date = previousDate(today);
  }

  while (date >= habit.startDate) {
    // Ignore unscheduled days
    if (isScheduled(habit, date)) {
      const status = logMap.get(date);

      if (status === "done") {
        currentStreak++;
      } else {
        break;
      }
    }

    date = previousDate(date);
  }

  return currentStreak;
};

// Calculate longest streak
 const calculateLongestStreak = (logs, habit, today) => {
  if (!isValidDate(today)) return 0;

  const logMap = createLogMap(logs);

  let longestStreak = 0;
  let currentStreak = 0;

  let date = habit.startDate;

  while (date <= today) {
    if (isScheduled(habit, date)) {
      const status = logMap.get(date);

      if (status === "done") {
        currentStreak++;

        longestStreak = Math.max(
          longestStreak,
          currentStreak
        );
      } else {
        currentStreak = 0;
      }
    }

    date = (() => {
      const next = new Date(`${date}T00:00:00.000Z`);
      next.setUTCDate(next.getUTCDate() + 1);
      return next.toISOString().slice(0, 10);
    })();
  }

  return longestStreak;
};

// Calculate total completed days
 const calculateTotalCompleted = (logs) => {
  return logs.filter((log) => log.status === "done").length;
};



export { calculateCurrentStreak, calculateLongestStreak, calculateTotalCompleted }