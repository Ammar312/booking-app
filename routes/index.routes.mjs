import express from "express";
import authRouter from "./authRoutes/index.mjs";
import parkRouter from "./parkRoutes/park.route.mjs";
const router = express.Router();

router.use(authRouter);
router.use(parkRouter);

export default router;
