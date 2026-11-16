import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  createHabit,
  getUserHabits,
  getHabitById,
  updateHabit,
  archiveHabit,
  toggleHabitStatus,
} from "../controllers/habit.controller.js";

const router = Router();

// All routes require authentication
router.use(verifyJWT);

router.route("/").post(createHabit);
router.route("/").get(getUserHabits);
router.route("/:habitId").get(getHabitById);
router.route("/:habitId").patch(updateHabit);
router.route("/:habitId/archive").patch(archiveHabit);
router.route("/:habitId/status").patch(toggleHabitStatus);

export default router;
