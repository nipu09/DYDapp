import mongoose, { Schema } from "mongoose";

const aiInsightSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["daily", "weekly", "monthly", "habit_analysis"],
      required: true,
    },

    period: {
      startDate: {
        type: String,
        required: true,
      },

      endDate: {
        type: String,
        required: true,
      },
    },

    insights: {
      summary: {
        type: String,
        default: "",
      },

      strengths: {
        type: [String],
        default: [],
      },

      weaknesses: {
        type: [String],
        default: [],
      },

      suggestions: {
        type: [String],
        default: [],
      },
    },

    statistics: {
      completionRate: {
        type: Number,
        default: 0,
      },

      totalCompletions: {
        type: Number,
        default: 0,
      },

      bestHabit: {
        type: String,
        default: "",
      },
    },

    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

aiInsightSchema.index({
  userId: 1,
  generatedAt: -1,
});

export const AIInsight = mongoose.model("AIInsight", aiInsightSchema);
