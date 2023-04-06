const catchAsync=require("../../utils/errors/catchAsync");
const validateProblem= require("../../utils/JoiSchema/valdiateProblem");

const problemController=require("../../controller/problemController");

const isAuth= require("../../middleware/isAuth");

const express= require("express")
const router= express.Router();

const {isProblemCreator}=require("../../middleware/isProblemCreator"); // as we did module.exports.isAuthorized... it will come as an obj ... not just a variable...
const { isAdmin } = require("../../middleware/isAdmin");

router.route("/problems")
    .get(catchAsync(problemController.getAll))
    .post(isAuth,isAdmin,validateProblem,catchAsync(problemController.addProblem))


router.route("/problems/:id")
    .get(catchAsync(problemController.showProblem))
    .put(isAuth,isAdmin,isProblemCreator,catchAsync(problemController.editProblem))
    .delete(isAuth,isAdmin,isProblemCreator,catchAsync(problemController.deleteProblem))
 
module.exports=router;