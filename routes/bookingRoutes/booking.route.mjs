import express from "express";
import {
  availableParksInTimeAndDate,
  bookAParkController,
  cancelBooking,
  reschdeuleBooking,
} from "../../controllers/bookingControllers/booking.controller.mjs";
import verifyToken from "../../middlewares/jwt.middleware.mjs";
const router = express.Router();
router.post("/availableparks", verifyToken, availableParksInTimeAndDate);
router.post("/parkbooking", verifyToken, bookAParkController);
router.put("/cancelbooking", verifyToken, cancelBooking);
router.put("/reschdeulebooking", verifyToken, reschdeuleBooking);
export default router;
