import express from "express";
import adminRoutes from "./admin.routes.mjs";
import userRoutes from "./user.routes.mjs";
import jwtMiddleware from "../../middlewares/jwt.middleware.mjs";
import { getProfile } from "../../controllers/authControllers/getProfile.controller.mjs";
const router = express.Router();

router.use("/admin", adminRoutes);
router.use("/user", userRoutes);
router.get("/getprofile", jwtMiddleware, getProfile);

export default router;
