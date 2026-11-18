import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

import { User } from "../models/user.model.js";
import { Habit } from "../models/habit.model.js";
import { HabitLog } from "../models/habitLog.model.js";

import { todayIn, isValidDate } from "../utils/dateUtils.js";
import { isScheduled } from "../utils/habitSchedule.js";

import {
  calculateCurrentStreak,
  calculateLongestStreak,
  calculateTotalCompleted,
} from "../utils/streakUtils.js";

// ========================================
// SET HABIT LOG
// ========================================

const setLog = asyncHandler(async (req, res) => {
  const { habitId, date } = req.params;
  const { status, note } = req.body;

  // 1. Find authenticated user
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(401, "Unauthorized user");
  }

  // 2. Get today's date
  const today = todayIn(user.timezone || "Asia/Kolkata");

  // 3. Validate date
  if (!isValidDate(date)) {
    throw new ApiError(400, "Invalid date format");
  }

  // 4. Prevent future logging
  if (date > today) {
    throw new ApiError(400, "Cannot log future dates");
  }

  // 5. Allow only today and previous 2 days (3 calendar days total)
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
  });

  if (!habit) {
    throw new ApiError(404, "Habit not found");
  }

  // 8. Check schedule
  if (!isScheduled(habit, date)) {
    throw new ApiError(400, "Habit is not scheduled for this date");
  }

  // 9. Create or update log
  const log = await HabitLog.findOneAndUpdate(
    {
      habitId: habit._id,
      date,
    },
    {
      $set: {
        userId: user._id,
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
    },
  );

  return res.status(200).json({
    success: true,
    message: "Habit log updated successfully",
    data: log,
  });
});

// ========================================
// GET TODAY'S HABIT LIST WITH STREAKS
// ========================================

const getTodayList = asyncHandler(async (req, res) => {
  // 1. Find authenticated user
  const authenticatedUser = await User.findById(req.user._id);

  if (!authenticatedUser) {
    throw new ApiError(401, "Unauthorized user");
  }

  // 2. Calculate today
  const today = todayIn(
    authenticatedUser.timezone || "Asia/Kolkata",
  );

  // 3. Find user's active habits
  const userHabits = await Habit.find({
    userId: authenticatedUser._id,
    isActive: true,
    isArchived: false,
  });

  // 4. Filter habits scheduled for today
  const todayHabits = userHabits.filter((habit) =>
    isScheduled(habit, today),
  );

  // 5. Get IDs of today's habits
  const habitIds = todayHabits.map((habit) => habit._id);

  // 6. Fetch historical logs for these habits
  const logs = await HabitLog.find({
    userId: authenticatedUser._id,
    habitId: { $in: habitIds },
    date: { $lte: today },
  }).sort({ date: 1 });

  // 7. Combine habits, today's status and streak information
  const habitsWithStatus = todayHabits.map((habit) => {
    // Find logs belonging to this particular habit
    const habitLogs = logs.filter(
      (log) =>
        log.habitId.toString() === habit._id.toString(),
    );

    // Find today's log
    const todayLog = habitLogs.find(
      (log) => log.date === today,
    );

    const status = todayLog ? todayLog.status : null;

    // Calculate streak information
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

    return {
      habit,
      status,
      done: status === "done",

      streaks: {
        current: currentStreak,
        longest: longestStreak,
        totalCompleted,
      },
    };
  });

  // 8. Calculate today's completed habits
  const done = habitsWithStatus.filter(
    (habit) => habit.done,
  ).length;

  // 9. Calculate total habits
  const total = habitsWithStatus.length;

  // 10. Send response
  return res.status(200).json({
    success: true,
    message: "Today's habits fetched successfully",
    date: today,
    done,
    total,
    habits: habitsWithStatus,
  });
});



// GET HABIT HISTORY (for heat map)
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
  const selectedYear = Number(year) || new Date().getFullYear();

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

  // 7. Send response
  return res.status(200).json({
    success: true,
    message: "Habit history fetched successfully",
    data: {
      habit,
      year: selectedYear,
      stats: {
        totalCompleted,
        totalLogged,
        completionRate,
      },
      logs,
    },
  });
});

export { setLog, getTodayList, getHabitHistory };