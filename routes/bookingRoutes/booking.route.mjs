import express from "express";
import {
  availableParksInTimeAndDate,
  bookAParkController,
  cancelBooking,
  reschdeuleBooking,
} from "../../controllers/bookingControllers/booking.controller.mjs";
import verifyToken from "../../middlewares/jwt.middleware.mjs";
const router = express.Router();
router.post(
  "/availableparks",
  verifyToken("user"),
  availableParksInTimeAndDate
);
router.post("/parkbooking", verifyToken("user"), bookAParkController);
router.put("/cancelbooking", verifyToken("user"), cancelBooking);
router.put("/reschdeulebooking", verifyToken("user"), reschdeuleBooking);
export default router;
