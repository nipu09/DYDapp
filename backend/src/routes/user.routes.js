import { Router } from "express";
import { loginUser, registerUser, logoutUser, userDetails, updateUserAvatar, changeCurrentPassword, refreshAccessToken} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);

//secured rotes
router.route("/logout").post( verifyJWT, logoutUser);
router.route("/refresh_token").post( refreshAccessToken);
router.route("/change_password").post( verifyJWT, changeCurrentPassword);
router.route("/update_avatar").post( verifyJWT, upload.single("avatar"), updateUserAvatar);
router.route("/user_details").post( verifyJWT, userDetails);

export default router;
