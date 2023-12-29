import { CustomRequest, User } from "../types/user";
import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { problemSchema } from "../types/problem";

const prisma = new PrismaClient();

export const getProblems = async (req: CustomRequest, res: Response) => {
  const problems = await prisma.problem.findMany();
  res.status(200).json(problems);
};

export const postProblem = async (req: CustomRequest, res: Response) => {
  try {
    const parsedReq = await problemSchema.parseAsync(req.body);
    const problem = await prisma.problem.create({
      data: {
        title: parsedReq.title,
        description: parsedReq.description,
        level: parsedReq.level,
        testCases: parsedReq.test_cases,
      },
    });

    console.log(problem.id);
    res.status(200).json({ id: problem.id });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
