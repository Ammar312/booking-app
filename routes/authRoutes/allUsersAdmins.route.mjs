import express from "express";
import {
  getAllAdmins,
  getAllUsers,
} from "../../controllers/allUsersAndAdmins/usersAndAdmins.controller.mjs";
import verifyToken from "../../middlewares/jwt.middleware.mjs";
const router = express.Router();
router.get("/users", verifyToken("admin"), getAllUsers);
router.get("/admins", verifyToken("admin"), getAllAdmins);
export default router;
