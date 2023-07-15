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
module.exports = { submit };