import express from "express";
import {
  getAllSubmission,
  postSubmisssion,
  login,
  questions,
  signup,
  displayAll,
  addQuestions,
} from "../controllers/control.js";
import { isAdmin, isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/add-question", isAuthenticated, isAdmin, addQuestions);

router.get("/all", displayAll);
router.get("/questions", isAuthenticated, questions);
router
  .route("/submission")
  .get(isAuthenticated, getAllSubmission)
  .post(isAuthenticated, postSubmisssion);

export default router;
