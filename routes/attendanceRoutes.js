import express from "express";
import { getAttendanceData } from "../controllers/attendanceController.js";
import { verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/attending", getAttendanceData);

export default router;
