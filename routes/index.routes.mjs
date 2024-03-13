import express from "express";
import authRouter from "./authRoutes/index.mjs";
import parkRouter from "./parkRoutes/park.route.mjs";
import bookingRouter from "./bookingRoutes/booking.route.mjs";
import userAdminCrudRouter from "./userAdminCrudRoutes/userAdminCrud.route.mjs";
import userProfileUpdateRouter from "./userProfileUpdateRoutes/userProfileUpdate.routes.mjs";
const router = express.Router();

router.use(authRouter);
router.use(parkRouter);
router.use(bookingRouter);
router.use(userAdminCrudRouter);
router.use(userProfileUpdateRouter);

export default router;
