import { Request, Response } from "express";
import Question from "../models/question";
import User from "../models/user";
import Language from "../models/language";

// This function will send no Of users, no of questions and no of languages supported
async function getStatsHandler(req: Request, res: Response): Promise<void> {

  try {
    // Get total no of questions, languages and users from the DB
    const totalQuestions: number = await Question.countDocuments();
    const totalUsers: number = await User.countDocuments();
    const totalLanguages: number = await Language.countDocuments();

    // Send the collected data
    res.status(200).json({
      questions: totalQuestions,
      languages: totalLanguages,
      users: totalUsers
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
};

export default getStatsHandler;
