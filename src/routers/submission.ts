import express from "express";
import addSubmissionHandler from "../handlers/addSubmission";
import getSubmissionsHandler from "../handlers/getSubmissions";
import { tokenDecode } from "../middlewares/auth";

const submissionRouter = express.Router();

submissionRouter.post("/submission", tokenDecode, addSubmissionHandler);
submissionRouter.get("/submission", getSubmissionsHandler);

export default submissionRouter;
