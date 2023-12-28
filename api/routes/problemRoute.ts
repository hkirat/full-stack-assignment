import { Router, Response } from "express";
import { CustomRequest } from "../types/user";

const router = Router();

export const QUESTIONS = [
  {
    id: "1",
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5",
      },
    ],
  },
  {
    id: "2",
    title: "Sum of array",
    description: "Given an array , return the sum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "15",
      },
    ],
  },
];

router.get("/", function (req: CustomRequest, res: Response) {
  //return the user all the questions in the QUESTIONS array
  res.status(200).send(QUESTIONS);
});

export default router;
