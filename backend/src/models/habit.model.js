import mongoose, { Schema } from "mongoose";

const habitSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    icon: {
      type: String,
      default: "🎯",
    },

    color: {
      type: String,
      default: "#22c55e",
    },

    category: {
      type: String,
      default: "General",
    },

    frequency: {
      type: String,
      enum: ["daily", "weekly", "custom"],
      default: "daily",
    },

    daysOfWeek: {
      type: [Number],
      default: [],
      validate: {
        validator: function (days) {
          return days.every(
            (day) => Number.isInteger(day) && day >= 0 && day <= 6,
          );
        },
        message: "Days must be between 0 and 6",
      },
    },

    targetCount: {
      type: Number,
      default: 1,
      min: 1,
    },

    startDate: {
      type: String,
      required: true,
    },

    endDate: {
      type: String,
      default: null,
    },

    isArchived: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

habitSchema.index({ userId: 1, isActive: 1 });

export const Habit = mongoose.model("Habit", habitSchema);
