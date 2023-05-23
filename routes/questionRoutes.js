import express from "express";
import { ensureAuthenticated } from "../middlewares/authMiddleware.js";
import { getAllQuestions } from "../controllers/questionController.js";

const router = express.Router();

router.use(ensureAuthenticated);
router.get("/", getAllQuestions);

export default router;
