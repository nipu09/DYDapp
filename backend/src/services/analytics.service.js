import { isScheduled } from "../utils/habitSchedule.js";
import { previousDate } from "../utils/dateUtils.js";
import { getManyHabitsStats } from "./habitStats.service.js";

// Helper: calculate percentage
const getAverage = (completed, total) => {
  return total === 0
    ? 0
    : Math.round((completed / total) * 100);
};

// Helper: get number of days in a month
const getDaysInMonth = (year, month) => {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
};

// Helper: create a log map
const createLogMap = (logs) => {
  const logMap = new Map();

  for (const log of logs) {
    const key = `${log.habitId}_${log.date}`;
    logMap.set(key, log.status);
  }

  return logMap;
};

// 1. Calendar Heatmap
export const calculateHeatmap = ({
  habits,
  logs,
  month,
  endDate,
}) => {
  const [year, monthNumber] = month.split("-").map(Number);

  const lastDay = getDaysInMonth(year, monthNumber);
  const logMap = createLogMap(logs);

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

      if (logMap.get(key) === "done") {
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

  return {
    month,
    days,
  };
};

// 2. Habit-wise Analytics
export const calculateHabitAnalytics = async ({
  habits,
  userId,
  today,
}) => {
  if (habits.length === 0) {
    return [];
  }

  const stats = await getManyHabitsStats({
    habits,
    userId,
    today,
  });

  return stats.map((habit) => ({
    habitId: habit.habitId,
    name: habit.habitName,
    frequency: habit.frequency,
    totalCompleted: habit.totalCompleted,
    totalScheduled: habit.totalScheduledDays,
    completionRate: habit.completionRate,
    currentStreak: habit.currentStreak,
    longestStreak: habit.longestStreak,
  }));
};

// 3. Weekly Trends Analytics
export const calculateWeeklyAnalytics = ({
  habits,
  logs,
  today,
}) => {
  const currentWeekDates = [];
  let date = today;

  // Current 7 days, including today
  for (let i = 0; i < 7; i++) {
    currentWeekDates.unshift(date);
    date = previousDate(date);
  }

  const previousWeekDates = [];

  // Previous 7 days
  for (let i = 0; i < 7; i++) {
    previousWeekDates.unshift(date);
    date = previousDate(date);
  }

  const logMap = createLogMap(logs);

  const calculateWeek = (dates) => {
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

        if (logMap.get(key) === "done") {
          completed++;
        }
      }

      totalCompleted += completed;
      totalScheduled += total;

      return {
        date,
        completed,
        missed: total - completed,
        total,
        completionRate: getAverage(completed, total),
      };
    });

    return {
      stats,
      average: getAverage(totalCompleted, totalScheduled),
      completed: totalCompleted,
      total: totalScheduled,
    };
  };

  const currentWeek = calculateWeek(currentWeekDates);
  const previousWeek = calculateWeek(previousWeekDates);

  const change = currentWeek.average - previousWeek.average;

  let trend = "same";

  if (change > 0) {
    trend = "up";
  } else if (change < 0) {
    trend = "down";
  }

  return {
    weeklyStats: currentWeek.stats,
    weeklyAverage: currentWeek.average,
    previousWeekAverage: previousWeek.average,
    trend,
    change,
  };
};

// 4. Habit Performance
export const calculateHabitPerformance = async ({
  habits,
  userId,
  today,
}) => {
  if (habits.length === 0) {
    return {
      bestPerforming: null,
      worstPerforming: null,
      mostConsistent: null,
      leastConsistent: null,
    };
  }

  const stats = await getManyHabitsStats({
    habits,
    userId,
    today,
  });

  const performance = stats
    .filter((habit) => habit.totalScheduledDays > 0)
    .map((habit) => ({
      habitId: habit.habitId,
      name: habit.habitName,
      completionRate: habit.completionRate,
      totalCompleted: habit.totalCompleted,
      totalScheduled: habit.totalScheduledDays,
      currentStreak: habit.currentStreak,
      longestStreak: habit.longestStreak,
    }));

  if (performance.length === 0) {
    return {
      bestPerforming: null,
      worstPerforming: null,
      mostConsistent: null,
      leastConsistent: null,
    };
  }

  const bestPerforming = [...performance].sort(
    (a, b) => b.completionRate - a.completionRate,
  )[0];

  const worstPerforming = [...performance].sort(
    (a, b) => a.completionRate - b.completionRate,
  )[0];

  const mostConsistent = [...performance].sort(
    (a, b) => b.longestStreak - a.longestStreak,
  )[0];

  const leastConsistent = [...performance].sort(
    (a, b) => a.longestStreak - b.longestStreak,
  )[0];

  return {
    bestPerforming,
    worstPerforming,
    mostConsistent,
    leastConsistent,
  };
};