import { HabitLog } from "../models/habitLog.model.js";
import { HabitStreak } from "../models/habitStreak.model.js";

import {
  calculateCurrentStreak,
  calculateLongestStreak,
  calculateTotalCompleted,
} from "../utils/streakUtils.js";

import { isScheduled } from "../utils/habitSchedule.js";

import { isValidDate, nextDate } from "../utils/dateUtils.js";


// COUNT SCHEDULED DAYS
const calculateScheduledDays = (habit, today) => {
  if (
    !habit ||
    !isValidDate(habit.startDate) ||
    !isValidDate(today)
  ) {
    return 0;
  }

  // Habit has not started yet
  if (habit.startDate > today) {
    return 0;
  }

  let totalScheduled = 0;
  let date = habit.startDate;

  while (date <= today) {
    if (isScheduled(habit, date)) {
      totalScheduled++;
    }

    date = nextDate(date);
  }

  return totalScheduled;
};


// CALCULATE STATISTICS FOR ONE HABIT
export const calculateHabitStats = ({
  habit,
  logs = [],
  streak = null,
  today,
}) => {
  if (!habit || !isValidDate(today)) {
    throw new Error("Valid habit and today are required");
  }

  // 1. Current streak is always calculated dynamically
  const currentStreak = calculateCurrentStreak(
    logs,
    habit,
    today,
  );

  // 2. Longest streak: cache first, calculation as fallback
  const longestStreak =
    streak?.longestStreak ??
    calculateLongestStreak(logs, habit, today);

  // 3. Total completions: cache first, calculation as fallback
  const totalCompleted =
    streak?.totalCompletions ??
    calculateTotalCompleted(logs);

  // 4. Calculate scheduled days
  const totalScheduledDays = calculateScheduledDays(
    habit,
    today,
  );

  // 5. Calculate logged days
  const totalLoggedDays = logs.filter(
    (log) => isScheduled(habit, log.date),
  ).length;

  // 6. Calculate missed days
  const missedDays = logs.filter(
    (log) =>
      log.status === "not_done" &&
      isScheduled(habit, log.date),
  ).length;

  // 7. Calculate pending days
  const pendingDays = Math.max(
    0,
    totalScheduledDays - totalLoggedDays,
  );

  // 8. Calculate completion rate
  const completionRate = totalScheduledDays
    ? Math.round(
        (totalCompleted / totalScheduledDays) * 100,
      )
    : 0;

  return {
    habitId: habit._id,
    habitName: habit.title,
    frequency: habit.frequency,

    currentStreak,
    longestStreak,
    totalCompleted,

    totalScheduledDays,
    totalLoggedDays,
    missedDays,
    pendingDays,

    completionRate,
  };
};


// GET STATISTICS FOR MULTIPLE HABITS
export const getManyHabitsStats = async ({
  habits = [],
  userId,
  today,
  logs: providedLogs,
}) => {
  if (!userId || !isValidDate(today)) {
    throw new Error("User ID and valid today are required");
  }

  if (!habits.length) {
    return [];
  }

  const habitIds = habits.map((habit) => habit._id);

  // Reuse logs if already fetched; otherwise query database
  const logs = providedLogs ?? await HabitLog.find({
    userId,
    habitId: { $in: habitIds },
    date: { $lte: today },
  }).sort({ date: 1 });

  const streaks = await HabitStreak.find({
    userId,
    habitId: { $in: habitIds },
  });

  const logsMap = new Map();

  for (const log of logs) {
    const id = log.habitId.toString();

    if (!logsMap.has(id)) {
      logsMap.set(id, []);
    }

    logsMap.get(id).push(log);
  }

  const streakMap = new Map(
    streaks.map((streak) => [
      streak.habitId.toString(),
      streak,
    ]),
  );

  return habits.map((habit) => {
    const habitId = habit._id.toString();

    return calculateHabitStats({
      habit,
      logs: logsMap.get(habitId) || [],
      streak: streakMap.get(habitId) || null,
      today,
    });
  });
};


// GET STATISTICS FOR ONE HABIT
export const getOneHabitStats = async ({
  habit,
  userId,
  today,
}) => {
  if (!habit || !userId || !isValidDate(today)) {
    throw new Error(
      "Habit, user ID and today are required",
    );
  }

  const [logs, streak] = await Promise.all([
    HabitLog.find({
      userId,
      habitId: habit._id,
      date: { $lte: today },
    }).sort({ date: 1 }),

    HabitStreak.findOne({
      userId,
      habitId: habit._id,
    }),
  ]);

  return calculateHabitStats({
    habit,
    logs,
    streak,
    today,
  });
};