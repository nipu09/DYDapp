import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

import { User } from "../models/user.model.js";
import { Habit } from "../models/habit.model.js";
import { HabitLog } from "../models/habitLog.model.js";

import { todayIn } from "../utils/dateUtils.js";
import { isScheduled } from "../utils/habitSchedule.js";

import {
  calculateCurrentStreak,
  calculateLongestStreak,
  calculateTotalCompleted,
} from "../utils/streakUtils.js";

// ========================================
// HELPER FUNCTIONS
// ========================================

// Move date forward by one day
const nextDate = (dateString) => {
  const date = new Date(`${dateString}T00:00:00.000Z`);

  date.setUTCDate(date.getUTCDate() + 1);

  return date.toISOString().slice(0, 10);
};

// Move date backward by one day
const previousDate = (dateString) => {
  const date = new Date(`${dateString}T00:00:00.000Z`);

  date.setUTCDate(date.getUTCDate() - 1);

  return date.toISOString().slice(0, 10);
};

// Calculate percentage safely
const calculatePercentage = (completed, total) => {
  if (total === 0) return 0;

  return Number(((completed / total) * 100).toFixed(2));
};

// ========================================
// GET DASHBOARD
// ========================================

const getDashboard = asyncHandler(async (req, res) => {

  // 1. Find authenticated user
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(401, "Unauthorized user");
  }

  // 2. Get today's date
  const today = todayIn(user.timezone || "Asia/Kolkata");

  // 3. Get current month boundaries
  const currentMonth = today.slice(0, 7);

  const monthStart = `${currentMonth}-01`;

  // 4. Find user's active habits
  const habits = await Habit.find({
    userId: user._id,
    isActive: true,
    isArchived: false,
  });

  // 5. Get habit IDs
  const habitIds = habits.map((habit) => habit._id);

  // 6. Fetch historical logs up to today
  const logs = await HabitLog.find({
    userId: user._id,
    habitId: { $in: habitIds },
    date: { $lte: today },
  }).sort({ date: 1 });

  // Create a Map for quick log lookup
  const logMap = new Map();

  for (const log of logs) {
    const key = `${log.habitId.toString()}_${log.date}`;

    logMap.set(key, log.status);
  }

  // ========================================
  // TODAY'S STATISTICS
  // ========================================

  // 7. Find habits scheduled today
  const todayHabits = habits.filter((habit) =>
    isScheduled(habit, today),
  );

  // 8. Count completed habits today
  const completedToday = todayHabits.filter((habit) => {
    const key = `${habit._id.toString()}_${today}`;

    return logMap.get(key) === "done";
  }).length;

  // 9. Calculate pending habits
  const pendingToday = todayHabits.length - completedToday;

  // 10. Calculate today's completion percentage
  const todayCompletionRate = calculatePercentage(
    completedToday,
    todayHabits.length,
  );

  // ========================================
  // WEEKLY STATISTICS
  // ========================================

  // 11. Generate last 7 dates
  const weeklyStats = [];

  let date = today;

  for (let i = 0; i < 7; i++) {
    // Find habits scheduled on this date
    const scheduledHabits = habits.filter((habit) =>
      isScheduled(habit, date),
    );

    // Count completed habits
    const completed = scheduledHabits.filter((habit) => {
      const key = `${habit._id.toString()}_${date}`;

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

  // 12. Calculate monthly scheduled and completed days
  let monthlyCompleted = 0;
  let monthlyTotal = 0;

  date = monthStart;

  while (date <= today) {

    for (const habit of habits) {

      if (isScheduled(habit, date)) {

        monthlyTotal++;

        const key = `${habit._id.toString()}_${date}`;

        if (logMap.get(key) === "done") {
          monthlyCompleted++;
        }
      }
    }

    date = nextDate(date);
  }

  // 13. Monthly completion percentage
  const monthlyCompletionRate = calculatePercentage(
    monthlyCompleted,
    monthlyTotal,
  );

  // ========================================
  // STREAK STATISTICS
  // ========================================

  // 14. Calculate best streak across active habits
  let bestStreak = 0;

  const habitStreaks = habits.map((habit) => {

    const habitLogs = logs.filter(
      (log) =>
        log.habitId.toString() === habit._id.toString(),
    );

    const currentStreak = calculateCurrentStreak(
      habitLogs,
      habit,
      today,
    );

    const longestStreak = calculateLongestStreak(
      habitLogs,
      habit,
      today,
    );

    const totalCompleted = calculateTotalCompleted(
      habitLogs,
    );

    bestStreak = Math.max(bestStreak, longestStreak);

    return {
      habitId: habit._id,
      habitName: habit.name,
      currentStreak,
      longestStreak,
      totalCompleted,
    };
  });

  // ========================================
  // FINAL RESPONSE
  // ========================================

  return res.status(200).json({

    success: true,

    message: "Dashboard fetched successfully",

    dashboard: {

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
        habits: habitStreaks,
      },

    },

  });

});

export { getDashboard };