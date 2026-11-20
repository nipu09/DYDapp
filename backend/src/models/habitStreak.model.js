import mongoose, { Schema } from "mongoose";

const habitStreakSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    habitId: {
      type: Schema.Types.ObjectId,
      ref: "Habit",
      required: true,
    },

    longestStreak: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalCompletions: {
      type: Number,
      default: 0,
      min: 0,
    },

    lastCompletedDate: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

habitStreakSchema.index(
  { userId: 1, habitId: 1 },
  { unique: true }
);

export const HabitStreak = mongoose.model(
  "HabitStreak",
  habitStreakSchema
);