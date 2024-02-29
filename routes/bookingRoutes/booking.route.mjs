import express from "express";
import {
  availableParksInTimeAndDate,
  bookAParkController,
  cancelBooking,
} from "../../controllers/parksController/booking.controller.mjs";
import jwtMiddleware from "../../middlewares/jwt.middleware.mjs";
const router = express.Router();
router.post("/availableparks", availableParksInTimeAndDate);
router.post("/parkbooking", bookAParkController);
router.put("/cancelbooking", cancelBooking);
export default router;
