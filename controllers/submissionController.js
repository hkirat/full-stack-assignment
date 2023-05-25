import { SUBMISSIONS } from "../models/Submission.js";
import { QUESTIONS } from "../models/Question.js";

const findQuestion = ({ _id = null }) => {
  if (!_id) {
    return null;
  }

  const question = QUESTIONS.find((que) => {
    return que._id === _id;
  });

  return question;
};

const getAllSubmissions = (req, res) => {
  return res.status(200).json({ data: { submissions: SUBMISSIONS } });
};

const createSubmission = (req, res) => {
  try {
    const { question_id = null, solution = null } = req.body;

    if (!(question_id && solution)) {
      throw new Error("question_id and solution are required!");
    }

    const questionExists = findQuestion({ _id: question_id });
    if (!questionExists) {
      throw new Error(
        "Question associated with the given question_id not found!"
      );
    }

    const testsPassed = Math.random() < 0.5;

    const submission = {
      question_id,
      solution: JSON.stringify(solution),
      accepted: testsPassed,
    };

    SUBMISSIONS.push(submission);

    if (testsPassed) {
      return res.status(200).json({
        success: "Your solution has been accepted.",
        data: { submission },
      });
    }

    return res.status(200).json({
      error: "Your solution has been rejected!",
      data: { submission },
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export { getAllSubmissions, createSubmission };
