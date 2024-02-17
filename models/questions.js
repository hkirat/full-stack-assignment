const mongoose = require('mongoose');

// // {
// //     title: "Two states",
// //     description: "Given an array , return the maximum of the array?",
// //     testCases: [{
// //         input: "[1,2,3,4,5]",
// //         output: "5"
// //     }],
// //     level:"easy"
// // }
// const questions =new mongoose.Schema({
// title:String,
// description:String,
// testCases:[
//     {
//         input:String,
//         output:String
//     }
// ],
// level:String
// })

const userDataSchema = new mongoose.Schema([{
    email:{
       type: String,
       required:true
    },
    password:{
        type:String,
        required:true
    }
}])

const submissionsSchema = new mongoose.Schema({
data:{
    type: Number,
    required:true
 },
 accepted:{
    type: Boolean,
    required:true
 },
 timestamp:{
    type: String,
    required:true
 }
})
// {
//    title: "Two Sum",
//    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.You may assume that each input would have exactly one solution, and you may not use the same element twice.You can return the answer in any order",
//    testCases: [{
//        input: "[1,8,6,2,5,4,8,3,7]",
//        output: "5"
//    }],
//    level:"medium"
//  }
const questionSchema = new mongoose.Schema({
   title: {
       type: String,
       required: true
   },
   description: {
       type: String,
       required: true
   },
   testCases: [{
       input: {
           type: String,
           required: true
       },
       output: {
           type: String,
           required: true
       }
   }],
   level: {
       type: String,
       required: true
   }
})
const userData = mongoose.model('userdata',userDataSchema);
const submissionData = mongoose.model('submissiondata',submissionsSchema);
const questionData = mongoose.model('question',questionSchema);
module.exports = {
    userData: userData,
    submissionData: submissionData,
    questionData:questionData
  };

