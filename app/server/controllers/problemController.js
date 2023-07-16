const problemModel = require("../models/problemModel");
const { getErrorJSON } = require("../utils/getErrorJSON");
const submit = async (req, res, next) => {
    try {
        const { content, testCases, userId, admin } = req.body;
        if(!admin) {
            throw Error ("Only admins are allowed to submit problems");
        }
        const problem = await problemModel.create({
            user: userId, content, testCases
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
const list = async (req, res, next) => {
    try {
        const { userId } = req.body;
        let problems;
        if(userId) {
            problems = await problemModel.find({ user: userId });
        }
        else {
            problems = await problemModel.find();
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
const get = async (req, res, next) => {
    try {
        const { problemId } = req.body;
        const problemDetails = await problemModel.findById(problemId);
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
module.exports = { submit, list, get };