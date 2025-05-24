import express from "express";
import {
  getFormResponses,
  sendEventReminders,
} from "../controllers/formController.js";
import { verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/form/responses", verifyAdmin, getFormResponses);
router.post("/form/send-event-reminders", verifyAdmin, sendEventReminders);

export default router;
