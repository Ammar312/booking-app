import express from "express";
import {
  forgotPasswordController,
  getProfile,
  loginController,
  resetPasswordController,
  resetPasswordView,
  signupController,
} from "../../controllers/authControllers/user.controller.mjs";
import verifyToken from "../../middlewares/jwt.middleware.mjs";

const router = express.Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.get("/getprofile", verifyToken("user", ["user"]), getProfile);
router.post("/forgotpassword", forgotPasswordController);
router.get("/resetpasswordview", resetPasswordView);
router.post("/reset-password", resetPasswordController);

export default router;
