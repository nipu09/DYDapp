import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  getHeatmap,
  getHabitAnalytics,
  getWeeklyAnalytics,
  getHabitPerformance,
} from "../controllers/analytics.controller.js";

const router = Router();

router.use(verifyJWT);

router.get("/heatmap", getHeatmap);
router.get("/habits", getHabitAnalytics);
router.get("/weekly", getWeeklyAnalytics);
router.get("/performance", getHabitPerformance);

export default router;