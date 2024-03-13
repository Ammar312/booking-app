import express from "express";
import {
  addParkController,
  deletePark,
  editPark,
  getAllParks,
} from "../../controllers/parksController/park.controller.mjs";
import upload from "../../middlewares/multer.middleware.mjs";
import verifyToken from "../../middlewares/jwt.middleware.mjs";
const router = express.Router();

router.post(
  "/addpark",
  verifyToken(["admin", "superadmin"]),
  upload.any("images"),
  addParkController
);
router.get("/allparks", verifyToken(["superadmin", "admin"]), getAllParks);
router.put("/editpark", verifyToken(["superadmin", "admin"]), editPark);
router.put("/deletepark", verifyToken(["superadmin"]), deletePark);

export default router;
