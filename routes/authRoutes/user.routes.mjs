import express from "express";
import {
  getProfile,
  loginController,
  signupController,
} from "../../controllers/authControllers/user.controller.mjs";
import verifyToken from "../../middlewares/jwt.middleware.mjs";
const router = express.Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.get("/getprofile", verifyToken("user"), getProfile);

export default router;
