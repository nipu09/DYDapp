import { isScheduled } from "./habitSchedule.js";

import {
  isValidDate,
  previousDate,
  nextDate,
} from "./dateUtils.js";

// Get logs in a Map for faster lookup
export const createLogMap = (logs = []) => {
  const logMap = new Map();

  for (const log of logs) {
    logMap.set(log.date, log.status);
  }

  return logMap;
};

// Calculate current streak
export const calculateCurrentStreak = (logs, habit, today) => {
  if (
    !habit ||
    !isValidDate(today) ||
    !isValidDate(habit.startDate)
  ) {
    return 0;
  }

  const logMap = createLogMap(logs);

  let currentStreak = 0;

  let date =
    logMap.get(today) === "done"
      ? today
      : previousDate(today);

  while (date >= habit.startDate) {
    if (isScheduled(habit, date)) {
      const status = logMap.get(date);

      if (status !== "done") {
        break;
      }

      currentStreak++;
    }

    date = previousDate(date);
  }

  return currentStreak;
};

// Calculate longest streak
export const calculateLongestStreak = (logs, habit, today) => {
  if (
    !habit ||
    !isValidDate(today) ||
    !isValidDate(habit.startDate)
  ) {
    return 0;
  }

  const logMap = createLogMap(logs);

  let longestStreak = 0;
  let currentStreak = 0;

  let date = habit.startDate;

  while (date <= today) {
    if (isScheduled(habit, date)) {
      if (logMap.get(date) === "done") {
        currentStreak++;

        longestStreak = Math.max(
          longestStreak,
          currentStreak
        );
      } else {
        currentStreak = 0;
      }
    }

    date = nextDate(date);
  }

  return longestStreak;
};

// Calculate total completed days
export const calculateTotalCompleted = (logs = []) => {
  return logs.filter(
    (log) => log.status === "done"
  ).length;
};