import express from "express";
import addSubmissionHandler from "../handlers/addSubmission";
import { tokenDecode } from "../middlewares/auth";

const submissionRouter = express.Router();

submissionRouter.post("/submission", tokenDecode, addSubmissionHandler);

export default submissionRouter;
