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


// Helper Functions
const getDaysInMonth = (year, month) => {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
};

const previousDate = (dateString) => {
  const date = new Date(`${dateString}T00:00:00.000Z`);

  date.setUTCDate(date.getUTCDate() - 1);

  return date.toISOString().slice(0, 10);
};

const getAverage = (completed, total) => {
  return total === 0
    ? 0
    : Math.round((completed / total) * 100);
};


// 1. Calendar Heatmap
// GET /api/v1/analytics/heatmap
export const getHeatmap = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized request");
  }

  const { month } = req.query;

  if (!month || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
    throw new ApiError(
      400,
      "Invalid month format. Use YYYY-MM",
    );
  }

  const user = await User.findById(userId).select("timezone");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const today = todayIn(user.timezone || "Asia/Kolkata");
  const currentMonth = today.slice(0, 7);

  if (month > currentMonth) {
    throw new ApiError(
      400,
      "Future month data is not available",
    );
  }

  const [year, monthNumber] = month.split("-").map(Number);

  const monthStart = `${month}-01`;

  const lastDay = getDaysInMonth(year, monthNumber);

  const monthEnd = `${month}-${String(lastDay).padStart(2, "0")}`;

  const endDate = month === currentMonth
    ? today
    : monthEnd;

  // Get active habits
  const habits = await Habit.find({
    userId,
    isActive: true,
    isArchived: false,
  });

  const habitIds = habits.map((habit) => habit._id);

  // Get logs
  const logs = await HabitLog.find({
    userId,
    habitId: { $in: habitIds },
    date: {
      $gte: monthStart,
      $lte: endDate,
    },
  }).select("habitId date status");

  // Create log map
  const logMap = new Map();

  for (const log of logs) {
    const key = `${log.habitId}_${log.date}`;

    logMap.set(key, log.status);
  }

  const days = [];

  for (let day = 1; day <= lastDay; day++) {
    const date = `${month}-${String(day).padStart(2, "0")}`;

    if (date > endDate) {
      break;
    }

    let total = 0;
    let completed = 0;

    for (const habit of habits) {
      if (!isScheduled(habit, date)) {
        continue;
      }

      total++;

      const key = `${habit._id}_${date}`;

      const status = logMap.get(key);

      if (status === "done") {
        completed++;
      }
    }

    days.push({
      date,
      completed,
      total,
      percentage: getAverage(completed, total),
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      month,
      days,
    },
  });
});


// 2. Habit-wise Analytics
// GET /api/v1/analytics/habits
export const getHabitAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized request");
  }

  const user = await User.findById(userId).select("timezone");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const today = todayIn(user.timezone || "Asia/Kolkata");

  // Get active habits
  const habits = await Habit.find({
    userId,
    isActive: true,
    isArchived: false,
  });

  if (habits.length === 0) {
    return res.status(200).json({
      success: true,
      data: {
        habits: [],
      },
    });
  }

  const habitIds = habits.map((habit) => habit._id);

  // Fetch logs
  const logs = await HabitLog.find({
    userId,
    habitId: { $in: habitIds },
    date: { $lte: today },
  }).sort({ date: 1 });

  // Group logs by habit
  const logsMap = new Map();

  for (const log of logs) {
    const key = log.habitId.toString();

    if (!logsMap.has(key)) {
      logsMap.set(key, []);
    }

    logsMap.get(key).push(log);
  }

  const habitAnalytics = habits.map((habit) => {
    const habitLogs =
      logsMap.get(habit._id.toString()) || [];

    let totalScheduled = 0;

    // Count scheduled days
    const startDate =
      habit.startDate > today
        ? today
        : habit.startDate;

    const start = new Date(
      `${startDate}T00:00:00.000Z`,
    );

    const end = new Date(
      `${today}T00:00:00.000Z`,
    );

    for (
      let current = new Date(start);
      current <= end;
      current.setUTCDate(current.getUTCDate() + 1)
    ) {
      const date = current.toISOString().slice(0, 10);

      if (isScheduled(habit, date)) {
        totalScheduled++;
      }
    }

    // Total completed logs
    const totalCompleted =
      calculateTotalCompleted(habitLogs);

    // Completion percentage
    const completionRate = getAverage(
      totalCompleted,
      totalScheduled,
    );

    // Current streak
    const currentStreak = calculateCurrentStreak(
      habitLogs,
      habit,
      today,
    );

    // Longest streak
    const longestStreak = calculateLongestStreak(
      habitLogs,
      habit,
      today,
    );

    return {
      habitId: habit._id,
      name: habit.name,
      frequency: habit.frequency,
      totalCompleted,
      totalScheduled,
      completionRate,
      currentStreak,
      longestStreak,
    };
  });

  return res.status(200).json({
    success: true,
    data: {
      habits: habitAnalytics,
    },
  });
});

// 3. Weekly Trends Analytics
// GET /api/v1/analytics/weekly
export const getWeeklyAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized request");
  }

  const user = await User.findById(userId).select("timezone");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const today = todayIn(user.timezone || "Asia/Kolkata");

  // Generate current 7 days
  const currentWeekDates = [];

  let date = today;

  for (let i = 0; i < 7; i++) {
    currentWeekDates.unshift(date);

    date = previousDate(date);
  }

  // Generate previous 7 days
  const previousWeekDates = [];

  for (let i = 0; i < 7; i++) {
    previousWeekDates.unshift(date);

    date = previousDate(date);
  }

  const allDates = [
    ...previousWeekDates,
    ...currentWeekDates,
  ];

  const startDate = allDates[0];

  // Get active habits
  const habits = await Habit.find({
    userId,
    isActive: true,
    isArchived: false,
  });

  const habitIds = habits.map((habit) => habit._id);

  // Fetch logs for both weeks
  const logs = await HabitLog.find({
    userId,
    habitId: { $in: habitIds },
    date: {
      $gte: startDate,
      $lte: today,
    },
  }).select("habitId date status");

  // Create log map
  const logMap = new Map();

  for (const log of logs) {
    const key = `${log.habitId}_${log.date}`;

    logMap.set(key, log.status);
  }

  // Calculate weekly statistics
  const calculateWeeklyStats = (dates) => {
    let totalCompleted = 0;
    let totalScheduled = 0;

    const stats = dates.map((date) => {
      let completed = 0;
      let total = 0;

      for (const habit of habits) {
        if (!isScheduled(habit, date)) {
          continue;
        }

        total++;

        const key = `${habit._id}_${date}`;

        const status = logMap.get(key);

        if (status === "done") {
          completed++;
        }
      }

      const missed = total - completed;

      totalCompleted += completed;
      totalScheduled += total;

      return {
        date,
        completed,
        missed,
        total,
        completionRate: getAverage(completed, total),
      };
    });

    return {
      stats,
      average: getAverage(
        totalCompleted,
        totalScheduled,
      ),
      completed: totalCompleted,
      total: totalScheduled,
    };
  };

  const currentWeek = calculateWeeklyStats(
    currentWeekDates,
  );

  const previousWeek = calculateWeeklyStats(
    previousWeekDates,
  );

  // Compare current and previous week
  const change =
    currentWeek.average - previousWeek.average;

  let trend = "same";

  if (change > 0) {
    trend = "up";
  } else if (change < 0) {
    trend = "down";
  }

  return res.status(200).json({
    success: true,
    data: {
      weeklyStats: currentWeek.stats,
      weeklyAverage: currentWeek.average,
      previousWeekAverage: previousWeek.average,
      trend,
      change,
    },
  });
});

// GET /api/v1/analytics/performance
export const getHabitPerformance = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized request");
  }

  const user = await User.findById(userId).select("timezone");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const today = todayIn(user.timezone || "Asia/Kolkata");

  // Get active habits
  const habits = await Habit.find({
    userId,
    isActive: true,
    isArchived: false,
  });

  if (habits.length === 0) {
    return res.status(200).json({
      success: true,
      data: {
        bestPerforming: null,
        worstPerforming: null,
        mostConsistent: null,
        leastConsistent: null,
      },
    });
  }

  const habitIds = habits.map((habit) => habit._id);

  // Fetch logs
  const logs = await HabitLog.find({
    userId,
    habitId: { $in: habitIds },
    date: { $lte: today },
  }).sort({ date: 1 });

  // Group logs by habit
  const logsMap = new Map();

  for (const log of logs) {
    const key = log.habitId.toString();

    if (!logsMap.has(key)) {
      logsMap.set(key, []);
    }

    logsMap.get(key).push(log);
  }

  // Calculate performance for every habit
  const performance = habits.map((habit) => {
    const habitLogs =
      logsMap.get(habit._id.toString()) || [];

    let totalScheduled = 0;
    let totalCompleted = 0;

    const startDate =
      habit.startDate > today ? today : habit.startDate;

    const start = new Date(`${startDate}T00:00:00.000Z`);
    const end = new Date(`${today}T00:00:00.000Z`);

    const logMap = new Map();

    for (const log of habitLogs) {
      logMap.set(log.date, log.status);
    }

    // Count scheduled and completed days
    for (
      let current = new Date(start);
      current <= end;
      current.setUTCDate(current.getUTCDate() + 1)
    ) {
      const date = current.toISOString().slice(0, 10);

      if (!isScheduled(habit, date)) {
        continue;
      }

      totalScheduled++;

      if (logMap.get(date) === "done") {
        totalCompleted++;
      }
    }

    const completionRate =
      totalScheduled === 0
        ? 0
        : Math.round(
            (totalCompleted / totalScheduled) * 100,
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

    return {
      habitId: habit._id,
      name: habit.name,
      completionRate,
      totalCompleted,
      totalScheduled,
      currentStreak,
      longestStreak,
    };
  });

  // Ignore habits with no scheduled days
  const eligibleHabits = performance.filter(
    (habit) => habit.totalScheduled > 0,
  );

  if (eligibleHabits.length === 0) {
    return res.status(200).json({
      success: true,
      data: {
        bestPerforming: null,
        worstPerforming: null,
        mostConsistent: null,
        leastConsistent: null,
      },
    });
  }

  // Highest completion rate
  const bestPerforming = [...eligibleHabits].sort(
    (a, b) => b.completionRate - a.completionRate,
  )[0];

  // Lowest completion rate
  const worstPerforming = [...eligibleHabits].sort(
    (a, b) => a.completionRate - b.completionRate,
  )[0];

  // Longest streak
  const mostConsistent = [...eligibleHabits].sort(
    (a, b) => b.longestStreak - a.longestStreak,
  )[0];

  // Shortest longest streak
  const leastConsistent = [...eligibleHabits].sort(
    (a, b) => a.longestStreak - b.longestStreak,
  )[0];

  return res.status(200).json({
    success: true,
    data: {
      bestPerforming,
      worstPerforming,
      mostConsistent,
      leastConsistent,
    },
  });
});