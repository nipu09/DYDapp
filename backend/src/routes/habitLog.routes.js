import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getHabitHistory, getTodayList, setLog } from "../controllers/habitLog.controller.js";


const router = Router();

// All routes require authentication
router.use(verifyJWT);

router.route("/habit/:habitId/logs/:date").put(setLog);
router.route("/habit/today").get(getTodayList);
router.route("/:habitId/history").get(getHabitHistory);

export default router;
