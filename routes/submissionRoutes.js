import express from "express";
import {
  createSubmission,
  getAllSubmissions,
} from "../controllers/submissionController.js";
import { ensureAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(ensureAuthenticated);
router.get("/", getAllSubmissions);
router.post("/", createSubmission);

export default router;
