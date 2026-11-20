import { Habit } from "../models/habit.model.js";
import { HabitLog } from "../models/habitLog.model.js";

import {
  isScheduled,
} from "../utils/habitSchedule.js";

import {
  nextDate,
  previousDate,
} from "../utils/dateUtils.js";

import {
  getManyHabitsStats,
} from "./habitStats.service.js";


// CALCULATE PERCENTAGE
const calculatePercentage = (completed, total) => {
  if (!total) return 0;

  return Number(((completed / total) * 100).toFixed(2));
};


// CREATE LOG LOOKUP MAP
const createLogMap = (logs) => {
  const map = new Map();

  for (const log of logs) {
    const key = `${log.habitId}_${log.date}`;

    map.set(key, log.status);
  }

  return map;
};


// GET DASHBOARD DATA
export const getDashboardData = async ({
  userId,
  today,
}) => {
  // 1. Get active habits
  const habits = await Habit.find({
    userId,
    isActive: true,
    isArchived: false,
  });

  const habitIds = habits.map((habit) => habit._id);

  // 2. Fetch logs once
  const logs = habitIds.length
    ? await HabitLog.find({
        userId,
        habitId: { $in: habitIds },
        date: { $lte: today },
      }).sort({ date: 1 })
    : [];

  const logMap = createLogMap(logs);

  // ========================================
  // TODAY'S STATISTICS
  // ========================================

  const todayHabits = habits.filter((habit) =>
    isScheduled(habit, today),
  );

  const completedToday = todayHabits.filter((habit) => {
    const key = `${habit._id}_${today}`;

    return logMap.get(key) === "done";
  }).length;

  const pendingToday = todayHabits.length - completedToday;

  const todayCompletionRate = calculatePercentage(
    completedToday,
    todayHabits.length,
  );

  // ========================================
  // WEEKLY STATISTICS
  // ========================================

  const weeklyStats = [];

  let date = today;

  for (let i = 0; i < 7; i++) {
    const scheduledHabits = habits.filter((habit) =>
      isScheduled(habit, date),
    );

    const completed = scheduledHabits.filter((habit) => {
      const key = `${habit._id}_${date}`;

      return logMap.get(key) === "done";
    }).length;

    const total = scheduledHabits.length;

    weeklyStats.unshift({
      date,
      completed,
      total,
      percentage: calculatePercentage(completed, total),
    });

    date = previousDate(date);
  }

  // ========================================
  // MONTHLY STATISTICS
  // ========================================

  const currentMonth = today.slice(0, 7);
  const monthStart = `${currentMonth}-01`;

  let monthlyCompleted = 0;
  let monthlyTotal = 0;

  date = monthStart;

  while (date <= today) {
    for (const habit of habits) {
      if (!isScheduled(habit, date)) {
        continue;
      }

      monthlyTotal++;

      const key = `${habit._id}_${date}`;

      if (logMap.get(key) === "done") {
        monthlyCompleted++;
      }
    }

    date = nextDate(date);
  }

  const monthlyCompletionRate = calculatePercentage(
    monthlyCompleted,
    monthlyTotal,
  );

  // ========================================
  // STREAK STATISTICS
  // ========================================

  const habitStats = await getManyHabitsStats({
    habits,
    userId,
    today,
    logs,
  });

  const bestStreak = habitStats.reduce(
    (best, habit) =>
      Math.max(best, habit.longestStreak || 0),
    0,
  );

  // ========================================
  // RETURN DASHBOARD DATA
  // ========================================

  return {
    date: today,

    todayStats: {
      totalHabits: todayHabits.length,
      completedToday,
      pendingToday,
      completionRate: todayCompletionRate,
    },

    weeklyStats,

    monthlyStats: {
      month: currentMonth,
      completed: monthlyCompleted,
      total: monthlyTotal,
      completionRate: monthlyCompletionRate,
    },

    streakStats: {
      bestStreak,

      habits: habitStats.map((habit) => ({
        habitId: habit.habitId,
        habitName: habit.habitName,
        currentStreak: habit.currentStreak,
        longestStreak: habit.longestStreak,
        totalCompleted: habit.totalCompleted,
      })),
    },
  };
};