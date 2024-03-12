import express from "express";
import {
  createAdmin,
  deleteAdmin,
  deleteUser,
  getAllAdmins,
  getAllUsers,
  updateAdmin,
  updateUser,
  updateUserAvatar,
} from "../../controllers/allUsersAndAdmins/usersAndAdmins.controller.mjs";
import verifyToken from "../../middlewares/jwt.middleware.mjs";
import upload from "../../middlewares/multer.middleware.mjs";

const router = express.Router();
router.get(
  "/alladmins",
  verifyToken("admin", ["superadmin", "admin"]),
  getAllAdmins
);
router.post("/createadmin", verifyToken("admin", ["superadmin"]), createAdmin);
router.put("/deleteadmin", verifyToken("admin", ["superadmin"]), deleteAdmin);
router.put("/updateadmin", verifyToken("admin", ["superadmin"]), updateAdmin);
router.get(
  "/allusers",
  verifyToken("admin", ["superadmin", "admin"]),
  getAllUsers
);
router.put("/deleteuser", verifyToken("admin", ["superadmin"]), deleteUser);
router.put("/updateuser", verifyToken("admin", ["superadmin"]), updateUser);
router.put(
  "/updateuseravatar",
  verifyToken("user", ["user"]),
  upload.single("avatar"),
  updateUserAvatar
);
export default router;
