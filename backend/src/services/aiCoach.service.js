import { Habit } from "../models/habit.model.js";
import { HabitLog } from "../models/habitLog.model.js";

import { isScheduled } from "../utils/habitSchedule.js";

import {
  previousDate,
} from "../utils/dateUtils.js";

import {
  calculateCurrentStreak,
} from "../utils/streakUtils.js";

import {
  generateHabitReport,
} from "./ai.service.js";


// GENERATE LAST 7 DATES
const getLastSevenDates = (today) => {
  const dates = [];

  let date = today;

  for (let i = 0; i < 7; i++) {
    dates.unshift(date);
    date = previousDate(date);
  }

  return dates;
};


// GENERATE WEEKLY HABIT STATISTICS
const calculateWeeklyHabitStats = ({
  habits,
  logs,
  dates,
  today,
}) => {
  const logsMap = new Map();

  for (const log of logs) {
    const habitId = log.habitId.toString();

    if (!logsMap.has(habitId)) {
      logsMap.set(habitId, []);
    }

    logsMap.get(habitId).push(log);
  }

  return habits.map((habit) => {
    const habitLogs =
      logsMap.get(habit._id.toString()) || [];

    const logMap = new Map();

    for (const log of habitLogs) {
      logMap.set(log.date, log.status);
    }

    let totalScheduled = 0;
    let totalCompleted = 0;

    for (const date of dates) {
      if (!isScheduled(habit, date)) {
        continue;
      }

      totalScheduled++;

      if (logMap.get(date) === "done") {
        totalCompleted++;
      }
    }

    const completionRate = totalScheduled
      ? Math.round(
          (totalCompleted / totalScheduled) * 100,
        )
      : 0;

    const currentStreak = calculateCurrentStreak(
      habitLogs,
      habit,
      today,
    );

    return {
      habitName: habit.title,
      frequency: habit.frequency,

      completedLast7Days: totalCompleted,
      scheduledLast7Days: totalScheduled,

      completionRate,
      currentStreak,
    };
  });
};


// GENERATE WEEKLY AI COACH REPORT
export const generateWeeklyCoachReport = async ({
  userId,
  today,
}) => {
  // 1. Get active habits
  const habits = await Habit.find({
    userId,
    isActive: true,
    isArchived: false,
  });

  // 2. Handle users without active habits
  if (!habits.length) {
    return {
      report:
        "You haven't created any active habits yet. Start with one small habit this week!",

      strengths: [],

      improvements: [],

      suggestions: [
        "Choose one simple habit to get started.",
      ],
    };
  }

  // 3. Generate last 7 dates
  const dates = getLastSevenDates(today);

  // 4. Fetch all historical logs needed for streak calculation
  const logs = await HabitLog.find({
    userId,
    habitId: {
      $in: habits.map((habit) => habit._id),
    },
    date: {
      $lte: today,
    },
  }).sort({ date: 1 });

  // 5. Calculate weekly statistics
  const habitStats = calculateWeeklyHabitStats({
    habits,
    logs,
    dates,
    today,
  });

  // 6. Prepare AI input
  const aiInput = {
    period: {
      startDate: dates[0],
      endDate: today,
    },

    habits: habitStats,
  };

  // 7. Generate AI report
  return generateHabitReport(aiInput);
};