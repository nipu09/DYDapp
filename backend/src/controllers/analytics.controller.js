import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { User } from "../models/user.model.js";
import { Habit } from "../models/habit.model.js";
import { HabitLog } from "../models/habitLog.model.js";

import {
  todayIn,
  previousDate,
} from "../utils/dateUtils.js";

import {
  calculateHeatmap,
  calculateHabitAnalytics,
  calculateWeeklyAnalytics,
  calculateHabitPerformance,
} from "../services/analytics.service.js";


// GET USER AND TODAY
const getUserToday = async (userId) => {
  const user = await User.findById(userId).select("timezone");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return todayIn(user.timezone || "Asia/Kolkata");
};


// GET ACTIVE HABITS
const getActiveHabits = async (userId) => {
  return Habit.find({
    userId,
    isActive: true,
    isArchived: false,
  });
};


// GET HABIT IDS
const getHabitIds = (habits) => {
  return habits.map((habit) => habit._id);
};


// 1. CALENDAR HEATMAP
// GET /api/v1/analytics/heatmap

export const getHeatmap = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized request");
  }

  const { month } = req.query;

  if (!month || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
    throw new ApiError(400, "Invalid month format. Use YYYY-MM");
  }

  const today = await getUserToday(userId);

  const currentMonth = today.slice(0, 7);

  if (month > currentMonth) {
    throw new ApiError(400, "Future month data is not available");
  }

  const [year, monthNumber] = month.split("-").map(Number);

  const lastDay = new Date(
    Date.UTC(year, monthNumber, 0),
  ).getUTCDate();

  const monthEnd = `${month}-${String(lastDay).padStart(2, "0")}`;

  const endDate = month === currentMonth
    ? today
    : monthEnd;

  const monthStart = `${month}-01`;

  const habits = await getActiveHabits(userId);

  const habitIds = getHabitIds(habits);

  const logs = habitIds.length
    ? await HabitLog.find({
        userId,
        habitId: { $in: habitIds },
        date: {
          $gte: monthStart,
          $lte: endDate,
        },
      }).select("habitId date status")
    : [];

  const heatmap = calculateHeatmap({
    habits,
    logs,
    month,
    endDate,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      heatmap,
      "Heatmap fetched successfully",
    ),
  );
});


// 2. HABIT-WISE ANALYTICS
// GET /api/v1/analytics/habits

export const getHabitAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized request");
  }

  const today = await getUserToday(userId);

  const habits = await getActiveHabits(userId);

  const habitAnalytics = await calculateHabitAnalytics({
    habits,
    userId,
    today,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        habits: habitAnalytics,
      },
      "Habit analytics fetched successfully",
    ),
  );
});


// 3. WEEKLY ANALYTICS
// GET /api/v1/analytics/weekly

export const getWeeklyAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized request");
  }

  const today = await getUserToday(userId);

  const habits = await getActiveHabits(userId);

  const habitIds = getHabitIds(habits);

  // Current 7 days + previous 7 days = 14 days.
  let startDate = today;

  for (let i = 0; i < 13; i++) {
    startDate = previousDate(startDate);
  }

  const logs = habitIds.length
    ? await HabitLog.find({
        userId,
        habitId: { $in: habitIds },
        date: {
          $gte: startDate,
          $lte: today,
        },
      }).select("habitId date status")
    : [];

  const weeklyAnalytics = calculateWeeklyAnalytics({
    habits,
    logs,
    today,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      weeklyAnalytics,
      "Weekly analytics fetched successfully",
    ),
  );
});


// 4. HABIT PERFORMANCE
// GET /api/v1/analytics/performance

export const getHabitPerformance = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized request");
  }

  const today = await getUserToday(userId);

  const habits = await getActiveHabits(userId);

  const performance = await calculateHabitPerformance({
    habits,
    userId,
    today,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      performance,
      "Habit performance fetched successfully",
    ),
  );
});