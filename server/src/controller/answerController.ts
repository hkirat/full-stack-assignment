import mongoose from "mongoose";
import express from "express";
import questionModel from "../model/questions";
import answerModel from "../model/answer";
import signUpModel from "../model/signUp";

//submit answer post api for valid user
const submitAnswerRequest = async function (
  req: express.Request,
  res: express.Response
) {
  try {
    let data = req.body;

    //empty Body
    if (Object.keys(data).length == 0) {
      return res.status(400).send({
        status: false,
        message: "Please provide your User details",
      });
    }

    //name validation
    if (!data.answer || data.answer.trim().length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide answer details" });
    }

    if (!data.userId || !data.questionId) {
      return res.status(400).send({
        status: false,
        message: "Something missing, either UserId or QuestionId",
      });
    }

    //userId is exist or not
    let checkUserId = await signUpModel.findById(data.userId);
    if (!checkUserId) {
      return res.status(400).send({ status: false, msg: "Invalid UserId" });
    }

    //questionId is exist or not
    let chcekQuestionId = await questionModel.findById(data.questionId);
    if (!chcekQuestionId) {
      return res.status(400).send({ status: false, msg: "Invalid QuestionId" });
    }

    //setup the objectId type for both feilds
    data.userId = new mongoose.Types.ObjectId(data.userId);
    data.questionId = new mongoose.Types.ObjectId(data.questionId);

    //submit answer creation
    let saveData = await answerModel.create(data);
    res.status(201).send({ status: true, message: "Success", data: saveData });
  } catch (err) {
    res
      .status(500)
      .send({ status: false, message: "Error", error: err.message });
  }
};




//all submitted answer for any particular question for valid user
const allSubmittedAnswersRequest = async function (
  req: express.Request,
  res: express.Response
) {
  try {
    let questionId = req.params.questionId;

    if (!questionId) {
      return res.status(400).send({
        status: false,
        message: "QuestionId Missing",
      });
    }

    //questionId is exist or not
    let allSubmittedAnswers = await answerModel.find({
      questionId: questionId,
    });
    if (!allSubmittedAnswers) {
      return res
        .status(400)
        .send({ status: false, msg: "No submitted answer is found" });
    }

    //sending all answers
    {
      res
        .status(201)
        .send({ status: true, message: "Success", data: allSubmittedAnswers });
    }
  } catch (err) {
    res
      .status(500)
      .send({ status: false, message: "Error", error: err.message });
  }
};

module.exports = { submitAnswerRequest, allSubmittedAnswersRequest };
