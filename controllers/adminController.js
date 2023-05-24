import { generateUniqueId } from "../utils/uidUtils.js";
import { QUESTIONS } from "../models/Question.js";

const createQuestion = (req, res) => {
  try {
    const { title = null, description = null, testCases = null } = req.body;

    if (!(title && description && testCases)) {
      throw new Error(
        "Missing payload. title, description and testCases are required!"
      );
    }

    const newQuestion = {
      _id: generateUniqueId(),
      title,
      description,
      testCases,
    };

    QUESTIONS.push(newQuestion);

    return res.status(200).json({
      success: "Question created successfully.",
      data: {
        question: newQuestion,
      },
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export { createQuestion };
