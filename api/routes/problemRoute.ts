import { Router } from "express";
import { getProblems, postProblem } from "../controllers/problemController";
import { adminAuthorization } from "../middleware/auth";

const router = Router();
router.get("/", getProblems);
router.post("/", adminAuthorization, postProblem);

export default router;
