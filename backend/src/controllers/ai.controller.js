import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

import { User } from "../models/user.model.js";
import { Habit } from "../models/habit.model.js";
import { HabitLog } from "../models/habitLog.model.js";

import { todayIn } from "../utils/dateUtils.js";
import { isScheduled } from "../utils/habitSchedule.js";

import {
  calculateCurrentStreak,
} from "../utils/streakUtils.js";

import { generateHabitReport } from "../services/ai.service.js";

// Get previous date
const previousDate = (dateString) => {
  const date = new Date(`${dateString}T00:00:00.000Z`);

  date.setUTCDate(date.getUTCDate() - 1);

  return date.toISOString().slice(0, 10);
};

// GET /api/v1/ai/weekly-report
export const getWeeklyHabitReport = asyncHandler(
  async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(401, "Unauthorized request");
    }

    // Get user timezone
    const user = await User.findById(userId).select("timezone");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const today = todayIn(user.timezone || "Asia/Kolkata");

    // Generate last 7 dates
    const dates = [];

    let date = today;

    for (let i = 0; i < 7; i++) {
      dates.unshift(date);
      date = previousDate(date);
    }

    const startDate = dates[0];

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
          report: "You haven't created any active habits yet. Start with one small habit this week!",
          strengths: [],
          improvements: [],
          suggestions: [
            "Choose one simple habit to get started.",
          ],
        },
      });
    }

    const habitIds = habits.map((habit) => habit._id);

    // Fetch historical logs for streak calculation
    const logs = await HabitLog.find({
      userId,
      habitId: { $in: habitIds },
      date: { $gte: habits.reduce(
        (earliest, habit) =>
          habit.startDate < earliest
            ? habit.startDate
            : earliest,
        habits[0].startDate,
      ), $lte: today },
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

    // Generate weekly statistics for each habit
    const habitStats = habits.map((habit) => {
      const habitLogs =
        logsMap.get(habit._id.toString()) || [];

      const logMap = new Map();

      for (const log of habitLogs) {
        logMap.set(log.date, log.status);
      }

      let totalScheduled = 0;
      let totalCompleted = 0;

      for (const day of dates) {
        if (!isScheduled(habit, day)) {
          continue;
        }

        totalScheduled++;

        if (logMap.get(day) === "done") {
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

      return {
        name: habit.name,
        frequency: habit.frequency,
        completedLast7Days: totalCompleted,
        scheduledLast7Days: totalScheduled,
        completionRate,
        currentStreak,
      };
    });

    // Prepare data for AI
    const aiInput = {
      period: {
        startDate,
        endDate: today,
      },
      habits: habitStats,
    };


    console.log("Calling Gemini with habit statistics...");
    // Generate AI report
    const report = await generateHabitReport(aiInput);

    return res.status(200).json({
      success: true,
      data: report,
    });
  },
);