import express from "express";
import adminRoutes from "./admin.routes.mjs";
import userRoutes from "./user.routes.mjs";
import allUsersandAdminsRoutes from "./allUsersAdmins.route.mjs";

const router = express.Router();

router.use("/admin", adminRoutes);
router.use("/user", userRoutes);
router.use("/all", allUsersandAdminsRoutes);

export default router;
