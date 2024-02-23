import express from "express";
import authRouter from "./authRoutes/index.mjs";
const router = express.Router();

router.use(authRouter);

export default router;
