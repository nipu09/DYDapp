import { Router } from "express";

import {
  loginUser,
  registerUser,
  logoutUser,
  userDetails,
  updateUserAvatar,
  changeCurrentPassword,
  refreshAccessToken,
} from "../controllers/user.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


// PUBLIC ROUTES
router.post("/register", upload.single("avatar"), registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);


// PROTECTED ROUTES
router.use(verifyJWT);

router.post("/logout", logoutUser);
router.get("/me", userDetails);
router.patch("/change-password", changeCurrentPassword);
router.patch("/avatar", upload.single("avatar"), updateUserAvatar);


export default router;