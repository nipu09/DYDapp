import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getTodayList, setLog } from "../controllers/habitLog.controller.js";


const router = Router();

// All routes require authentication
router.use(verifyJWT);

router.route("/habits/:habitId/logs/:date").put(setLog);
router.route("/habits/today").get(getTodayList);

export default router;
