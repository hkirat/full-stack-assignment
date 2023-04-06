const Submission =require("../models/Submission");
const ExpressError= require("../../utils/errors/ExpressError");
const catchAsync=require("../../utils/errors/catchAsync");
const Problem =require("../models/Problem");
const validateSubmission= require("../../utils/JoiSchema/validateSubmission");


const express= require("express")
const router= express.Router();



const isSubAuthor= require("../../middleware/isSubAuthor");
const isAuth= require("../../middleware/isAuth");



router.get("/problems/:id/submit/:subId",catchAsync(async(req,res,next)=>{
    // const problem= await Problem.findById(req.params.id);
    const submission= await Submission.findById(req.params.subId);
    if(submission){
        res.send(submission)
    }else{
        res.status(404).send("not found");
    }
}))



router.delete("/problems/:id/submit/:subId",isAuth,isSubAuthor,catchAsync(async(req,res,next)=>{
    const problem= await Problem.findById(req.params.id);
    const submission= await Submission.findById(req.params.subId);

    problem.submissions=problem.submissions.filter((arrSub)=>{
        return arrSub.toString()!==submission._id.toString()
    })

    await problem.save()

    const r2= await Submission.findOneAndDelete({"_id":submission._id}) 
    
    console.log("Deleted submission: ",r2._id);
    res.send("done");
}))



router.post("/problems/:id/submit",isAuth,validateSubmission,catchAsync(async(req,res,next)=>{
    const problem= await Problem.findById(req.params.id);
    const submission=await new Submission(req.body)
    submission.author=req.user._id;
    problem.submissions.push(submission)
    await problem.save();
    await submission.save();
    res.send(submission);
}))


router.put("/problems/:id/submit/:subId",isAuth,validateSubmission,catchAsync(async (req,res)=>{
    let submission= await Submission.findById(req.params.subId);
    submission.code= req.body.code;
    submission.language= req.body.language;
    submission=await Submission.findByIdAndUpdate(req.params.subId,{ ...submission});
    await submission.save()
    res.status(200).send(submission);
}
))







module.exports=router;