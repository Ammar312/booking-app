import express from "express";
import {
  approveBooking,
  availableParksInTimeAndDate,
  bookAParkController,
  cancelBooking,
  getBookings,
  getUserBookings,
  rejectBooking,
  reschdeuleBooking,
} from "../../controllers/bookingControllers/booking.controller.mjs";
import verifyToken from "../../middlewares/jwt.middleware.mjs";
const router = express.Router();
router.post(
  "/availableparks",
  verifyToken(["superadmin", "admin", "user"]),
  availableParksInTimeAndDate
);
router.post(
  "/parkbooking",
  verifyToken(["superadmin", "admin", "user"]),
  bookAParkController
);
router.put(
  "/cancelbooking",
  verifyToken(["superadmin", "admin", "user"]),
  cancelBooking
);
router.put(
  "/reschdeulebooking",
  verifyToken(["superadmin", "admin", "user"]),
  reschdeuleBooking
);
router.get("/userbookings", verifyToken(["admin", "user"]), getUserBookings);
router.get("/allbookings", verifyToken(["admin"]), getBookings);
router.put("/approvebooking", verifyToken(["admin"]), approveBooking);
router.put("/rejectbooking", verifyToken(["admin"]), rejectBooking);

export default router;
