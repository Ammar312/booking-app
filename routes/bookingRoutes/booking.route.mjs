import express from "express";
import {
  availableParksInTimeAndDate,
  bookAParkController,
  cancelBooking,
  reschdeuleBooking,
} from "../../controllers/bookingControllers/booking.controller.mjs";
import jwtMiddleware from "../../middlewares/jwt.middleware.mjs";
const router = express.Router();
router.post("/availableparks", jwtMiddleware, availableParksInTimeAndDate);
router.post("/parkbooking", bookAParkController);
router.put("/cancelbooking", cancelBooking);
router.put("/reschdeulebooking", reschdeuleBooking);
export default router;
