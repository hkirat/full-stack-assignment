const mongoose=require("mongoose");


const submissionSchema=new mongoose.Schema({
    code:{type:String,required:true}, //code by the user
    language:{
        type:String,
        required:false,
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
})


// note : to display the review submit form.. we will display it at show.ejs only which is at campground/:id but to submit the form we will create a new post request 


const Submission= new mongoose.model("Submission",submissionSchema);



module.exports = Submission;





