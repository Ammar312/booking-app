import express from "express";
import { availableParksInTimeAndDate } from "../../controllers/parksController/parkbooking.controller.mjs";
const router = express.Router();
router.post("/availableparks", availableParksInTimeAndDate);
export default router;
