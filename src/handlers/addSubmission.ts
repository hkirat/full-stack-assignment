import { Request, Response } from 'express';
import Submission, { ISubmission } from '../models/submission';

interface AddSubmissionRequestBody {
  questionId: string;
  code: string;
  language: string;
}

interface SubmissionRequest extends Request {
  userId?: string;
  body: AddSubmissionRequestBody;
}

// Function to add new submission to the DB
async function addSubmissionHandler(req: SubmissionRequest, res: Response): Promise<void> {
  try {
    // Extracting necessary data from request
    const { questionId, code, language } = req.body;
    const userId = req.userId; // tokenDecode middleware provides userId

    // Check if mandatory fields are present
    if (!questionId || !code || !language) {
      res.status(400).json({ error: "questionId, language & code are mandatory fields" });
      return;
    }

    // Add a new submisison to DB
    const submission: ISubmission = new Submission({
      questionId,
      userId,
      language,
      code,
      // TODO: ADD CODE EVALUATION BEFORE SETTING STATUS
      status: Math.random() < 0.5 ? "ACCEPTED" : "REJECTED",
    });
    await submission.save();

    // Send new submission as JSON response
    res.status(201).json(submission);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export default addSubmissionHandler;
