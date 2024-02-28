import express from "express";
import {
  availableParksInTimeAndDate,
  bookAParkController,
} from "../../controllers/parksController/parkbooking.controller.mjs";
const router = express.Router();
router.post("/availableparks", availableParksInTimeAndDate);
router.post("/parkbook", bookAParkController);
export default router;
