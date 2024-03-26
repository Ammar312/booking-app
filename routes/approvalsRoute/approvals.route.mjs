import express from "express";
import { allApprovals } from "../../controllers/approvals/approvals.controller.mjs";
import verifyToken from "../../middlewares/jwt.middleware.mjs";

const router = express.Router();

router.get("/approvals", verifyToken(["admin"]), allApprovals);
export default router;
