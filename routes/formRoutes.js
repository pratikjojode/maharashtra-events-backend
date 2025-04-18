import express from "express";
import { getFormResponses } from "../controllers/formController.js";
import { verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/form/responses", verifyAdmin, getFormResponses);

export default router;
