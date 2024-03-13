import express from "express";
import {
  createAdmin,
  deleteAdmin,
  deleteUser,
  getAllAdmins,
  getAllUsers,
  updateAdmin,
  updateUser,
} from "../../controllers/allUsersAndAdmins/usersAndAdmins.controller.mjs";
import verifyToken from "../../middlewares/jwt.middleware.mjs";

const router = express.Router();
// Admin
router.get("/alladmins", verifyToken(["superadmin", "admin"]), getAllAdmins);
router.post("/createadmin", verifyToken(["superadmin"]), createAdmin);
router.put("/deleteadmin", verifyToken(["superadmin"]), deleteAdmin);
router.put("/updateadmin", verifyToken(["superadmin"]), updateAdmin);
router.get("/allusers", verifyToken(["superadmin", "admin"]), getAllUsers);

// User
router.put("/deleteuser", verifyToken(["superadmin"]), deleteUser);
router.put("/updateuser", verifyToken(["superadmin", "admin"]), updateUser);

export default router;
