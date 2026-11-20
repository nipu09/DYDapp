import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { User } from "../models/user.model.js";

import {
  todayIn,
} from "../utils/dateUtils.js";

import {
  generateWeeklyCoachReport,
} from "../services/aiCoach.service.js";


// GET WEEKLY HABIT REPORT
// GET /api/v1/ai/weekly-report

export const getWeeklyHabitReport = asyncHandler(
  async (req, res) => {
    // 1. Get authenticated user
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(401, "Unauthorized request");
    }

    // 2. Get user's timezone
    const user = await User.findById(userId).select("timezone");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // 3. Calculate today's date
    const today = todayIn(
      user.timezone || "Asia/Kolkata",
    );

    // 4. Generate AI report
    const report = await generateWeeklyCoachReport({
      userId,
      today,
    });

    // 5. Send response
    return res.status(200).json(
      new ApiResponse(
        200,
        report,
        "Weekly habit report generated successfully",
      ),
    );
  },
);