import { Request, Response } from 'express';
import Submission, { ISubmission } from '../models/submission';

interface GetSubmissionsRequestQuery {
  questionId: string;
  page?: string;
  pageSize?: string;
}

// This function will fetch submissions for a particular question
async function getSubmissions(
  req: Request<{}, {}, {}, GetSubmissionsRequestQuery>,
  res: Response
): Promise<void> {
  // Extract page and pageSize from req query
  const page: number = parseInt(req.query.page as string) || 1;
  const pageSize: number = parseInt(req.query.pageSize as string) || 10;

  try {
    // Extract questionId from request param
    const { questionId } = req.query;

    // Calculate the starting index of the results
    const startIndex: number = (page - 1) * pageSize;

    // Get the total count of submissions(accepted) for a question
    const totalSubmissions: number = await Submission.countDocuments({ 
      questionId,
      status: 'ACCEPTED' 
    });

    // Find submissions for the specified question that have been accepted
    const submissions: ISubmission[] = await Submission
      .find({ questionId, status: 'ACCEPTED' })
      .populate('questionId')
      .populate('userId', '-password -email -createdAt -updatedAt')
      .select('-code -error')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(pageSize)
      .exec();

    
    // Send submissions with pagination data
    const response = {
      currentPage: page,
      totalPages: Math.ceil(totalSubmissions / pageSize),
      totalSubmissions,
      submissions: submissions.map((submission) => ({
        ...submission.toObject(),

        question: submission.questionId, // Rename `questionId` to `question`
        questionId: undefined, // Remove the `questionId` property
        
        user: submission.userId, // Rename `questionId` to `question`
        userId: undefined, // Remove the `questionId` property
      })),
    };
    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export default getSubmissions;
