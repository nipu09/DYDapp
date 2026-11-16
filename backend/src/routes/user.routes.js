
import { Router } from "express";

import {
    loginUser,
    registerUser,
    logoutUser,
    userDetails,
    updateUserAvatar,
    changeCurrentPassword,
    refreshAccessToken
} from "../controllers/user.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);
router.route("/refresh_token").post(refreshAccessToken);

// Protected routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/me").get(verifyJWT, userDetails);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

export default router;
