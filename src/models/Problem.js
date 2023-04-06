const mongoose=require("mongoose");
const catchAsync = require("../../utils/errors/catchAsync");
const Submission=require("./Submission")

const Schema = mongoose.Schema;

const ProblemSchema=new Schema({

    title: {
        type:String,
        required:true,
        unique:true, // I don't want my site to have same questionnnnn
    },
    description: {
        type:String,
        required:true,
    },
    testCases: [
      {
        input:String,
        output:String,
      },
    ],

    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User", // The admin who uploaded the questionn
        required:false,
        // default:"Navi Sureka" //That's meeee.... and me to your ig @navi__sureka
    },
    submissions: [{

            type:mongoose.Schema.Types.ObjectId,  // submissions will be an array of obj that refer to submission
            ref:"Submission",                 // ref to the name of the model Submission
            require:false,
    }]
    
})


ProblemSchema.post("findOneAndDelete",((async function(problem,next){
    if(problem && problem.submissions.length){
        await Submission.deleteMany({id:{$in:problem.submissions}})
    }
    next();

})))


module.exports = mongoose.model("Problem", ProblemSchema);
