import express from "express";
import verifyToken from "../../middlewares/jwt.middleware.mjs";
import { searchUser } from "../../controllers/searchController/search.controller.mjs";
const router = express.Router();

router.get("/search/user", verifyToken(["admin"]), searchUser);

export default router;
