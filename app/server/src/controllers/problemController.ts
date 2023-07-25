import express, { Express, NextFunction, Request, Response } from 'express';
import Problem from '../models/ProblemModel';
import getErrorJSON from '../utils/getErrorJSON';

export const submit = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, content, testCases, userId, admin } = req.body;
        if(!userId) {
            throw Error ("Bearer token invalid or missing");
        }
        if(!admin) {
            throw Error ("Only admins are allowed to submit problems");
        }
        if(!title || !content || !testCases) {
            throw Error (getErrorJSON("Title, content and testCases are required", "MANDATORY_PARAMS", 400));
        }
        const problem = await Problem.create({
            user: userId, title, content, testCases
        });
        if(problem) {
            res.json({
                success: true,
                message: "Problem has been submitted"
            });
        }
        else {
            throw Error (getErrorJSON("Some error occurred while submission of the problem", "ERROR", 500))
        }
    }
    catch(e) {
        next(e);
    }
}
export const listAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.body;
        let problems;
        if(userId) {
            problems = await Problem.find({ user: userId });
        }
        else {
            problems = await Problem.find();
        }
        if(problems) {
            console.log(problems[0].testCases)
            const response = problems.map((problem) => { return { title: problem.title, content: problem.content, id: problem._id } });
            res.json(response);
        }
        else {
            throw Error (getErrorJSON("No Problems Found", "ERROR", 500))
        }
    }
    catch(e) {
        next(e);
    }
}

export const list = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.body;
        let problems;
        if(!userId) {
            throw Error (getErrorJSON("Unauthorized", "ERROR", 401))
        }
        if(userId) {
            problems = await Problem.find({ user: userId });
        }
        if(problems) {
            console.log(problems[0].testCases)
            const response = problems.map((problem) => { return { title: problem.title, content: problem.content, id: problem._id } });
            res.json(response);
        }
        else {
            throw Error (getErrorJSON("No Problems Found", "ERROR", 500))
        }
    }
    catch(e) {
        next(e);
    }
}

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { problemId } = req.body;
        const problemDetails = await Problem.findById(problemId);
        if(problemDetails) {
            res.json(problemDetails);
        }
        else {
            throw Error (getErrorJSON("Invalid Problem ID", "ERROR", 500));
        }
    }
    catch(e) {
        next(e);
    }
}