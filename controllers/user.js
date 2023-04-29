import { Types } from "mongoose";
import { Questions, Submissions } from "../models/model.js";

export const getQuestions = async function (req, res) {
  //return the user all the questions from the question collection from database
  try {
    const allQuestions = await Questions.find({});
    res.status(201).json({ status: "success", questions: allQuestions });
  } catch (err) {
    res.status(401).json({ status: "fail", error: err.message });
  }
};

export const getSubmissions = async function (req, res) {
  // return the users submissions for this problem
  try {
    const id = req.params.id;

    // getting the question for the questions collection
    const question = await Questions.findById(id);

    // getting all the submissions relating that question
    const findAllSubmissions = await Submissions.find({
      problem: question._id,
    });

    // sending status 200 and json file if it got succed
    if (findAllSubmissions.length > 0) {
      res
        .status(200)
        .json({ status: "success", submissions: findAllSubmissions });
    } else {
      res.status(401).json({
        status: "fail",
        reason: "No Submissions for this problem till now",
        question,
      });
    }
  } catch (err) {
    res.status(401).json({ status: "fail", error: err.message });
  }
};

export const setSubmissions = async function (req, res) {
  try {
    // let the user submit a problem, randomly accept or reject the solution
    const id = req.params.id;
    const { solution } = req.body;

    if (!id || !solution) {
      throw new Error("id is invalid or solution is empty");
    }

    const isAccepted = Math.random() >= 0.5; // 50% chance for acceptance and reject

    const submission = {
      problem: id,
      solution,
      isAccepted,
    };

    // Store the submission in the DB
    const submissionSubmit = await Submissions.create(submission);

    if (isAccepted) {
      res.status(200).json({
        success: "Solution Accepted",
        submission_submit: submissionSubmit,
      });
    } else {
      res.status(401).json({
        fail: "Solution Rejected",
        submission_submit: submissionSubmit,
      });
    }
  } catch (err) {
    res.status(401).json({ status: "fail", error: err.message });
  }
};

export const setQuestions = async (req, res) => {
  try {
    const isAdmin = req.user.isAdmin;
    const { question } = req.body;

    if (!isAdmin) {
      throw new Error("Access denied");
    }

    const newQuestion = new Questions({
      title: question.title,
      description: question.description,
      testCases: question.testCases,
    });

    const response = await newQuestion.save();

    res.status(201).json({ status: "success", response });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
