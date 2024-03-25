import express from "express";
import authRouter from "./authRoutes/index.mjs";
import parkRouter from "./parkRoutes/park.route.mjs";
import bookingRouter from "./bookingRoutes/booking.route.mjs";
import userAdminCrudRouter from "./userAdminCrudRoutes/userAdminCrud.route.mjs";
import userProfileUpdateRouter from "./userProfileUpdateRoutes/userProfileUpdate.routes.mjs";
import searchRouter from "./searchRoutes/search.routes.mjs";
import cronRouter from "./cronRoute/cron.route.mjs";
import { bookingExcelFile } from "../controllers/exportExcelFile/exportExcel.controller.mjs";
const router = express.Router();

router.use(authRouter);
router.use(parkRouter);
router.use(bookingRouter);
router.use(userAdminCrudRouter);
router.use(userProfileUpdateRouter);
router.use(searchRouter);
router.use(cronRouter);
router.get("/bookingsexcel", bookingExcelFile);

export default router;
