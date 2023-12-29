import { Router, Response } from "express";
import { CustomRequest } from "../types/user";
import { userAuthorization } from "../middleware/auth";
import {
  getSubmissions,
  postSubmissions,
} from "../controllers/submissionController";

const router = Router();

router.get("/", userAuthorization, getSubmissions);
router.post("/", userAuthorization, postSubmissions);

export default router;
