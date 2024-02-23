import express from "express";
import adminRoutes from "./admin.routes.mjs";
import userRoutes from "./user.routes.mjs";
const router = express.Router();

router.use("/admin", adminRoutes);
router.use("/user", userRoutes);

export default router;
