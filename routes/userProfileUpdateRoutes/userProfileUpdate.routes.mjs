import express from "express";
import {
  updateUserAvatar,
  updateUserProfile,
} from "../../controllers/userProfileUpdateControllers/userProfileUpdate.controller.mjs";
import verifyToken from "../../middlewares/jwt.middleware.mjs";
import upload from "../../middlewares/multer.middleware.mjs";
const router = express.Router();

router.put("/update/userprofile", verifyToken(["user"]), updateUserProfile);
router.put(
  "/update/useravatar",
  verifyToken(["user"]),
  upload.single("avatar"),
  updateUserAvatar
);
export default router;
