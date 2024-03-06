import express from "express";
import { addParkController } from "../../controllers/parksController/park.controller.mjs";
import upload from "../../middlewares/multer.middleware.mjs";
import verifyToken from "../../middlewares/jwt.middleware.mjs";
const router = express.Router();

router.post("/addpark", verifyToken, upload.any("images"), addParkController);

export default router;
