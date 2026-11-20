import { HabitLog } from "../models/habitLog.model.js";
import { HabitStreak } from "../models/habitStreak.model.js";

import {
  calculateLongestStreak,
  calculateTotalCompleted,
} from "../utils/streakUtils.js";

import { isScheduled } from "../utils/habitSchedule.js";
import { isValidDate } from "../utils/dateUtils.js";


// RECALCULATE AND SYNCHRONIZE CACHED STREAK STATISTICS
export const syncHabitStreak = async (habit, today) => {
  if (!habit || !habit.userId || !habit._id || !isValidDate(today)) {
    throw new Error("Valid habit and today are required");
  }

  // 1. Fetch all logs belonging to this habit
  const logs = await HabitLog.find({
    userId: habit.userId,
    habitId: habit._id,
    date: { $lte: today },
  }).sort({ date: 1 });

  // 2. Calculate longest streak
  const longestStreak = calculateLongestStreak(
    logs,
    habit,
    today,
  );

  // 3. Keep only logs that fall on scheduled days
  const scheduledLogs = logs.filter((log) =>
    isScheduled(habit, log.date),
  );

  // 4. Calculate total completions
  const totalCompletions = calculateTotalCompleted(
    scheduledLogs,
  );

  // 5. Find most recent completed date
  const lastCompletedLog = [...scheduledLogs]
    .reverse()
    .find((log) => log.status === "done");

  const lastCompletedDate = lastCompletedLog
    ? lastCompletedLog.date
    : null;

  // 6. Create or update HabitStreak
  const streak = await HabitStreak.findOneAndUpdate(
    {
      userId: habit.userId,
      habitId: habit._id,
    },
    {
      $set: {
        longestStreak,
        totalCompletions,
        lastCompletedDate,
      },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  );

  return streak;
};