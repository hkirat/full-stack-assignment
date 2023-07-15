const sendMessage = require("../config/RabbitMQ");
const executionModel = require("../models/executionModel");
const { getErrorJSON } = require("../utils/getErrorJSON");

const execute = async (req, res, next) => {
    try {
        const { src, lang, timeout, input, expectedOutput, user, problem } = req.body;
        if(!src || !lang || !timeout) {
            throw Error(getErrorJSON("Mandatory Params Not Passed", "MANDATORY_PARAMS", 400));
        }
        const execution = await executionModel.create({
            src, lang, input, user, problem
        });
        const{ _id } = execution;
        await sendMessage({ src, lang, timeout, input, expectedOutput, submissionId: _id });
        let baseUrl = req.get('host');
        res.json({
            success: true,
            message: "Queued for execution",
            executionStatus: `http://${baseUrl}/execute/status/${_id}`
        });
    }
    catch(e) {
        next(e);
    }
}

const status = async (req, res, next) => {
    try {
        const { id } = req.params;
        if(!id) {
            throw Error(getErrorJSON("Mandatory Params Not Passed", "MANDATORY_PARAMS", 400));
        }
        const status = await executionModel.findById(id);
        if(!status) {
            throw Error(getErrorJSON("Server Error Occurred", "ERROR", 500));
        }
        res.json(status);
    }
    catch(e) {
        next(e);
    }
}
module.exports = { execute, status };