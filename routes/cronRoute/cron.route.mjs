import express from "express";
import checkCompleted from "../../cron.mjs";
const router = express.Router();

router.post("/bookingcompleted", checkCompleted);

export default router;
