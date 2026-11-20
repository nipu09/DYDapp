import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { User } from "../models/user.model.js";
import { Habit } from "../models/habit.model.js";
import { HabitLog } from "../models/habitLog.model.js";
import { HabitStreak } from "../models/habitStreak.model.js";

import { todayIn, isValidDate } from "../utils/dateUtils.js";
import { isScheduled } from "../utils/habitSchedule.js";

import {
  calculateCurrentStreak,
  calculateTotalCompleted,
} from "../utils/streakUtils.js";

import { syncHabitStreak } from "../services/streak.service.js";

// SET HABIT LOG
const setLog = asyncHandler(async (req, res) => {
  const { habitId, date } = req.params;
  const { status, note } = req.body;

  // 1. Find authenticated user
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(401, "Unauthorized user");
  }

  // 2. Get today's date according to user's timezone
  const today = todayIn(user.timezone || "Asia/Kolkata");

  // 3. Validate date
  if (!isValidDate(date)) {
    throw new ApiError(400, "Invalid date format");
  }

  // 4. Prevent future logging
  if (date > today) {
    throw new ApiError(400, "Cannot log future dates");
  }

  // 5. Allow today and previous two days
  const oldestDate = new Date(`${today}T00:00:00.000Z`);

  oldestDate.setUTCDate(oldestDate.getUTCDate() - 2);

  const oldestAllowedDate = oldestDate.toISOString().slice(0, 10);

  if (date < oldestAllowedDate) {
    throw new ApiError(400, "Cannot log dates older than 3 days");
  }

  // 6. Validate status
  if (!["done", "not_done"].includes(status)) {
    throw new ApiError(400, "Status must be done or not_done");
  }

  // 7. Validate habit ownership
  const habit = await Habit.findOne({
    _id: habitId,
    userId: user._id,
    isArchived: false,
  });

  if (!habit) {
    throw new ApiError(404, "Habit not found");
  }

  // 8. Check whether habit is scheduled
  if (!isScheduled(habit, date)) {
    throw new ApiError(400, "Habit is not scheduled for this date");
  }

  // 9. Create or update habit log
  const log = await HabitLog.findOneAndUpdate(
    {
      userId: user._id,
      habitId: habit._id,
      date,
    },
    {
      $set: {
        userId: user._id,
        habitId: habit._id,
        date,
        status,
        completedAt: status === "done" ? new Date() : null,
        note: note || "",
        source: "app",
      },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );

  // 10. Synchronize cached streak statistics
  const streak = await syncHabitStreak(habit, today);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        log,
        streak,
      },
      "Habit log updated successfully"
    )
  );
});


// GET TODAY'S HABIT LIST WITH STREAKS
const getTodayList = asyncHandler(async (req, res) => {
  // 1. Find authenticated user
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(401, "Unauthorized user");
  }

  // 2. Get today's date
  const today = todayIn(user.timezone || "Asia/Kolkata");

  // 3. Find active, non-archived habits
  const userHabits = await Habit.find({
    userId: user._id,
    isActive: true,
    isArchived: false,
  });

  // 4. Filter habits scheduled for today
  const todayHabits = userHabits.filter((habit) =>
    isScheduled(habit, today)
  );

  // 5. Fetch logs for today's habits
  const habitIds = todayHabits.map((habit) => habit._id);

  const logs = await HabitLog.find({
    userId: user._id,
    habitId: { $in: habitIds },
    date: { $lte: today },
  }).sort({ date: 1 });

  // 6. Fetch cached streak statistics
  const streaks = await HabitStreak.find({
    userId: user._id,
    habitId: { $in: habitIds },
  });

  const streakMap = new Map(
    streaks.map((streak) => [
      streak.habitId.toString(),
      streak,
    ])
  );

  // 7. Prepare habits with status and streaks
  const habitsWithStatus = todayHabits.map((habit) => {
    const habitLogs = logs.filter(
      (log) =>
        log.habitId.toString() === habit._id.toString()
    );

    const todayLog = habitLogs.find(
      (log) => log.date === today
    );

    const status = todayLog?.status || null;

    // Current streak is calculated dynamically
    const currentStreak = calculateCurrentStreak(
      habitLogs,
      habit,
      today
    );

    const cachedStreak = streakMap.get(
      habit._id.toString()
    );

    return {
      habit,
      status,
      done: status === "done",

      streaks: {
        current: currentStreak,
        longest: cachedStreak?.longestStreak ?? 0,
        totalCompleted: cachedStreak?.totalCompletions ??
          calculateTotalCompleted(habitLogs),
      },
    };
  });

  // 8. Calculate today's progress
  const done = habitsWithStatus.filter(
    (habit) => habit.done
  ).length;

  const total = habitsWithStatus.length;

  const completionRate = total
    ? Math.round((done / total) * 100)
    : 0;

  // 9. Return response
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        date: today,
        done,
        total,
        completionRate,
        habits: habitsWithStatus,
      },
      "Today's habits fetched successfully"
    )
  );
});


// GET HABIT HISTORY
const getHabitHistory = asyncHandler(async (req, res) => {
  const { habitId } = req.params;
  const { year } = req.query;

  // 1. Find authenticated user
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(401, "Unauthorized user");
  }

  // 2. Check habit ownership
  const habit = await Habit.findOne({
    _id: habitId,
    userId: user._id,
  });

  if (!habit) {
    throw new ApiError(404, "Habit not found");
  }

  // 3. Determine year
  const selectedYear = year === undefined
    ? Number(todayIn(user.timezone || "Asia/Kolkata").slice(0, 4))
    : Number(year);

  if (
    !Number.isInteger(selectedYear) ||
    selectedYear < 2000 ||
    selectedYear > 2100
  ) {
    throw new ApiError(400, "Invalid year");
  }

  // 4. Define date range
  const startDate = `${selectedYear}-01-01`;
  const endDate = `${selectedYear}-12-31`;

  // 5. Fetch habit logs
  const logs = await HabitLog.find({
    userId: user._id,
    habitId: habit._id,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  }).sort({ date: 1 });

  // 6. Calculate statistics
  const totalCompleted = calculateTotalCompleted(logs);

  const totalLogged = logs.length;

  const completionRate = totalLogged
    ? Math.round((totalCompleted / totalLogged) * 100)
    : 0;

  // 7. Return response
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        habit,
        year: selectedYear,
        stats: {
          totalCompleted,
          totalLogged,
          completionRate,
        },
        logs,
      },
      "Habit history fetched successfully"
    )
  );
});

export {
  setLog,
  getTodayList,
  getHabitHistory,
};