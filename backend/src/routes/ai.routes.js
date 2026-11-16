import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";

import { getWeeklyHabitReport } from "../controllers/ai.controller.js";

const router = Router();

router.use(verifyJWT);

// AI Weekly Habit Report
router.get("/weekly-report", getWeeklyHabitReport);

export default router;
