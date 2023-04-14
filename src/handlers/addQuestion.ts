import { Request, Response } from "express";
import Question, { IQuestion } from "../models/question";

interface AddQuestionRequestBody {
  title: string;
  statement: string;
  testcases: Array<{ input: string; output: string }>;
}

// Send backs auth-token is login is successfull
async function addQuestion(
  req: Request<{}, {}, AddQuestionRequestBody>,
  res: Response
): Promise<void> {
  // Extract title, statement and testcases from request body
  const { title, statement, testcases } = req.body;

  // Checking if mandatory fields are missing
  if (
    !title ||
    !statement ||
    !testcases ||
    testcases.length === 0 ||
    !testcases[0].input ||
    !testcases[0].output
  ) {
    res.status(400).json({
      error: "Title, statement, and testcases are mandatory fields",
    });
    return;
  }

  try {
    // Check if question with same title or statement exists and storing errorMessage in a variable
    const existingQuestionByTitle: IQuestion | null = await Question.findOne({ title });
    const existingQuestionByStatement: IQuestion | null = await Question.findOne({ statement });
    let errorMessage: string | null = null;

    if (existingQuestionByTitle && existingQuestionByStatement) {
      errorMessage = "Question with same title & statement already exists";
    } else if (existingQuestionByTitle) {
      errorMessage = "Question with same title already exists";
    } else if (existingQuestionByStatement) {
      errorMessage = "Question with same statement already exists";
    }

    if (errorMessage) {
      res.status(409).json({ message: errorMessage });
      return;
    }

    // Create new question in tbe database
    const question: IQuestion = new Question({ title, statement, testcases });
    await question.save();

    // Send created  question as response
    res.status(201).json({ question });
  } catch (error) {
    // If any error send server error
    console.error((error as Error).message);
    res.status(500).send("Server Error");
  }
}

export default addQuestion;
