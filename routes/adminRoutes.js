import express from "express";
import { createQuestion } from "../controllers/adminController.js";
import {
  ensureAuthenticated,
  ensureIsAdmin,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(ensureAuthenticated, ensureIsAdmin);
router.post("/createQuestion", createQuestion);

export default router;
