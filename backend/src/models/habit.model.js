import mongoose, { Schema } from "mongoose";

const isValidDateString = (value) => {
  if (!value) return false;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
};

const habitSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
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
      trim: true,
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
          return (
            Array.isArray(days) &&
            days.every(
              (day) =>
                Number.isInteger(day) &&
                day >= 0 &&
                day <= 6,
            ) &&
            new Set(days).size === days.length
          );
        },
        message: "Days must be unique numbers between 0 and 6.",
      },
    },

    targetCount: {
      type: Number,
      default: 1,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "Target count must be an integer.",
      },
    },

    startDate: {
      type: String,
      required: true,
      validate: {
        validator: isValidDateString,
        message: "Invalid start date. Use YYYY-MM-DD.",
      },
    },

    endDate: {
      type: String,
      default: null,
      validate: {
        validator: function (value) {
          return value === null || isValidDateString(value);
        },
        message: "Invalid end date. Use YYYY-MM-DD.",
      },
    },

    isArchived: {
      type: Boolean,
      default: false,
    },

    archivedAt: {
      type: String,
      default: null,
      validate: {
        validator: function (value) {
          return value === null || isValidDateString(value);
        },
        message: "Invalid archive date. Use YYYY-MM-DD.",
      },
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


// Validate schedule configuration and date range
habitSchema.pre("validate", function () {
  if (this.endDate && this.startDate && this.endDate < this.startDate) {
    this.invalidate("endDate", "End date cannot be before start date.");
  }

  if (
    this.frequency === "weekly" &&
    (!this.daysOfWeek || this.daysOfWeek.length === 0)
  ) {
    this.invalidate("daysOfWeek", "Select at least one day for weekly habits.");
  }

  if (this.frequency === "daily" && this.daysOfWeek.length > 0) {
    this.invalidate("daysOfWeek", "Daily habits should not have selected weekdays.");
  }

  if (this.isArchived && !this.archivedAt) {
    this.invalidate("archivedAt", "Archive date is required for archived habits.");
  }
});

// Common user habit queries
habitSchema.index({
  userId: 1,
  isActive: 1,
  isArchived: 1,
});


export const Habit = mongoose.model("Habit", habitSchema);