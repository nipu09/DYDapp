import mongoose, { Schema } from "mongoose";

const habitLogSchema = new Schema(
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

    date: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },

    status: {
      type: String,
      enum: ["done", "not_done"],
      required: true,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    note: {
      type: String,
      trim: true,
      default: "",
    },

    source: {
      type: String,
      enum: ["app", "whatsapp", "web"],
      default: "app",
    },
  },
  {
    timestamps: true,
  },
);

// One log per habit per day
habitLogSchema.index({ habitId: 1, date: 1 }, { unique: true });

// Heatmap queries
habitLogSchema.index({ userId: 1, date: 1 });

export const HabitLog = mongoose.model("HabitLog", habitLogSchema);
