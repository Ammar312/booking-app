import express from "express";
import { addParkController } from "../../controllers/parksController/park.controller.mjs";
import upload from "../../middlewares/multer.middleware.mjs";
import { bookPark } from "../../controllers/parksController/parkbooking.controller.mjs";
const router = express.Router();

router.post("/addpark", upload.any("images"), addParkController);
router.post("/parkbook", bookPark);
export default router;
