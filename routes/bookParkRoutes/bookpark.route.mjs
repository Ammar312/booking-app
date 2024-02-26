import express from "express";
import { availableParksInTime } from "../../controllers/parksController/parkbooking.controller.mjs";
const router = express.Router();
router.post("/availableparks/time", availableParksInTime);
export default router;
