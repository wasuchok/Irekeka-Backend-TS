import { Router } from "express";
import {
  getBorrowingTrend,
  getDashboardStats,
  getRecentActivities,
  getReturnCompliance,
  getUpcomingReturns,
} from "../controllers/dashboard.controller";

const router = Router();

router.get("/stats", getDashboardStats);
router.get("/borrowing-trend", getBorrowingTrend);
router.get("/compliance", getReturnCompliance);
router.get("/upcoming-returns", getUpcomingReturns);
router.get("/recent-activities", getRecentActivities);

export default router;
