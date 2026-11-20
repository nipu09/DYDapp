import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { User } from "../models/user.model.js";

import { todayIn } from "../utils/dateUtils.js";

import {
  getDashboardData,
} from "../services/dashboard.service.js";


// GET DASHBOARD
const getDashboard = asyncHandler(async (req, res) => {
  // 1. Get authenticated user
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized user");
  }

  // 2. Get user timezone
  const user = await User.findById(userId).select("timezone");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // 3. Get today's date in user's timezone
  const today = todayIn(user.timezone || "Asia/Kolkata");

  // 4. Get dashboard data from service
  const dashboard = await getDashboardData({
    userId,
    today,
  });

  // 5. Send response
  return res.status(200).json(
    new ApiResponse(
      200,
      dashboard,
      "Dashboard fetched successfully",
    ),
  );
});

export { getDashboard };