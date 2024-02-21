import express from "express";
import authRouter from "./auth.routes.mjs";
const router = express.Router();

router.use(authRouter);

export default router;
