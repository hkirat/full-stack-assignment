import express from "express";
import questionModel from "../model/questions";

//Add Question for Admin Only
const addQuestionRequest = async function (
  req: express.Request,
  res: express.Response
) {
  try {
    let data = req.body;

    //empty Body
    if (Object.keys(data).length == 0) {
      return res.status(400).send({
        status: false,
        message: "Please provide details",
      });
    }

    //name validation
    if (!data.questionName || data.questionName.trim().length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide question details" });
    }

    //question creation
    let saveData = await questionModel.create(data);
    {
      res
        .status(201)
        .send({ status: true, message: "Success", data: saveData });
    }
  } catch (err) {
    res
      .status(500)
      .send({ status: false, message: "Error", error: err.message });
  }
};




//Getting all listed questions for Everyone
const allQuestionsRequest = async function (
  req: express.Request,
  res: express.Response
) {
  try {
    //Find only those questions which is not deleted yet
    let allQuestions = await questionModel.find({
      isDeleted: false,
    });
    if (!allQuestions) {
      return res
        .status(400)
        .send({ status: false, msg: "No submitted answer is found" });
    }

    {
      res
        .status(201)
        .send({ status: true, message: "Success", data: allQuestions });
    }
  } catch (err) {
    res
      .status(500)
      .send({ status: false, message: "Error", error: err.message });
  }
};

module.exports = { addQuestionRequest, allQuestionsRequest };
