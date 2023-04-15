import { Request, Response } from 'express';
import Question, { IQuestion } from '../models/question';

// This function will fetch questions from DB 
async function getQuestionsHandler(req: Request, res: Response): Promise<void> {
  // Extract page and pageSize from req query
  const page: number = parseInt(req.query.page as string) || 1;
  const pageSize: number = parseInt(req.query.pageSize as string) || 10;

  try {
    // Get total no of questions in the DB
    const totalQuestions: number = await Question.countDocuments();

    // Fetch questions from DB after pagination
    const questions: IQuestion[] = await Question.find()
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    // Send pagination details and questions
    res.status(200).json({
      currentPage: page,
      totalPages: Math.ceil(totalQuestions / pageSize),
      totalQuestions,
      questions
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
};

export default getQuestionsHandler;
