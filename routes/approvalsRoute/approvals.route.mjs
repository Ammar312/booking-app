import express from "express";
import { allApprovals } from "../../controllers/approvals/approvals.controller.mjs";

const router = express.Router();

router.get("/approvals", allApprovals);
export default router;
