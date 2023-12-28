import { Router, Response } from "express";
import { CustomRequest } from "../types/user";
import { userAuthorization } from "../middleware/auth";

const router = Router();

interface Submission {
  user: string;
  questionId: string;
  code: string;
  isCorrect: boolean;
}

const submissions: Submission[] = [];

router.get(
  "/",
  userAuthorization,
  function (req: CustomRequest, res: Response) {
    const user = req.user;
    console.log(submissions);
    res
      .status(200)
      .send(submissions.filter((submission) => submission.user === user));
  }
);

router.post(
  "/",
  userAuthorization,
  function (req: CustomRequest, res: Response) {
    const user = req.user;
    console.log(user);
    const body = req.body;
    const questionId = body["questionId"];
    const code = body["code"];
    const isCorrect = Math.random() > 0.5;
    submissions.push({
      user,
      questionId,
      code,
      isCorrect,
    });

    res.status(200).send("Submission created successfully");
  }
);

export default router;
