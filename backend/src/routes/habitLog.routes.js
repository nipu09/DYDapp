import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  getHabitHistory,
  getTodayList,
  setLog,
} from "../controllers/habitLog.controller.js";

const router = Router();

router.use(verifyJWT);


// GET TODAY'S HABITS
// GET /api/v1/habit-logs/today
router.get("/today", getTodayList);


// CREATE OR UPDATE DAILY LOG
// PUT /api/v1/habit-logs/:habitId/:date
router.put("/:habitId/:date", setLog);


// GET HABIT HISTORY
// GET /api/v1/habit-logs/:habitId/history
router.get("/:habitId/history", getHabitHistory);


export default router;