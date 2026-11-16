import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Habit } from "../models/habit.model.js";

// 1. Create Habit
const createHabit = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    icon,
    color,
    category,
    frequency,
    daysOfWeek,
    targetCount,
    startDate,
    endDate,
  } = req.body;

  // Validate required fields
  if (title.trim().length === 0) {
    throw new ApiError(400, "Habit title cannot be empty");
  }

  // Create habit
  const habit = await Habit.create({
    userId: req.user._id,
    title,
    description,
    icon,
    color,
    category,
    frequency,
    daysOfWeek,
    targetCount,
    startDate,
    endDate,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, habit, "Habit created successfully"));
});

// 2. Get All User Habits
const getUserHabits = asyncHandler(async (req, res) => {
  const habits = await Habit.find({
    userId: req.user._id,
    isArchived: false,
  }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, habits, "Habits fetched successfully"));
});

// 3. Get Single Habit
const getHabitById = asyncHandler(async (req, res) => {
  const habit = await Habit.findOne({
    _id: req.params.habitId,
    userId: req.user._id,
    isArchived: false,
  });

  if (!habit) {
    throw new ApiError(404, "Habit not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, habit, "Habit fetched successfully"));
});

// 4. Update Habit
const updateHabit = asyncHandler(async (req, res) => {
  // Whitelisted fields
  const allowedFields = [
    "title",
    "description",
    "icon",
    "color",
    "category",
    "frequency",
    "daysOfWeek",
    "targetCount",
    "startDate",
    "endDate",
  ];

  const updates = {};

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, "No valid fields provided for update");
  }

  if (
    updates.title !== undefined &&
    (typeof updates.title !== "string" || !updates.title.trim())
  ) {
    throw new ApiError(400, "Habit title cannot be empty");
  }

  const habit = await Habit.findOneAndUpdate(
    {
      _id: req.params.habitId,
      userId: req.user._id,
      isArchived: false,
    },
    {
      $set: updates,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!habit) {
    throw new ApiError(404, "Habit not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, habit, "Habit updated successfully"));
});

// 5. Archive Habit (Soft Delete)
const archiveHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findOneAndUpdate(
    {
      _id: req.params.habitId,
      userId: req.user._id,
      isArchived: false,
    },
    {
      $set: {
        isArchived: true,
      },
    },
    {
      new: true,
    },
  );

  if (!habit) {
    throw new ApiError(404, "Habit not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, habit, "Habit archived successfully"));
});

// 6. Pause / Activate Habit
const toggleHabitStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;

  if (typeof isActive !== "boolean") {
    throw new ApiError(400, "isActive must be true or false");
  }

  const habit = await Habit.findOneAndUpdate(
    {
      _id: req.params.habitId,
      userId: req.user._id,
      isArchived: false,
    },
    {
      $set: { isActive },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!habit) {
    throw new ApiError(404, "Habit not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        habit,
        isActive ? "Habit activated successfully" : "Habit paused successfully",
      ),
    );
});

export {
  createHabit,
  getUserHabits,
  getHabitById,
  updateHabit,
  archiveHabit,
  toggleHabitStatus,
};
