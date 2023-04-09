const express = require('express')
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const app = express()
const port = 3001

const USERS = [];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = [
 
]

app.post('/signup', (req, res)=>{
 
  try{
    const email=req.body.email;
    const password=req.body.password;
    const admin=req.body.isAdmin;//admin value equals to true if it is admin 
    const emailExists= USERS.filter((ele)=>{ele.email==email})
    if (emailExists ) {
     return res.send({Email:"exist"});
    }
       bcrypt.hash(password,10,(err,hash)=>{
        if(err){
         throw new Error();
        }
        USERS.push({email:email,password:hash,isAdmin:admin});
        res.status(200).json({success:true});
       });       
 }catch(err){
         console.log(err);
         res.status(400).json({message:"Something went wrong",err});
     }
})

function generateAccessToken(id,name){
  return jwt.sign({userId:id,name:name},"secretkey");
}

app.post('/login', (req, res) =>{
  
  try{

  const email=req.body.email;
  const password=req.body.password;
  
  
  const emailExists =  USERS.filter((ele)=>{ele.email==email})
  if (emailExists) {
      bcrypt.compare(password,emailExists.password,(err,result)=>{
          if(err){
              throw new Error("User not authorized");
          }
          if(result===true){
              res.status(201).json({login:"Login succesful",token:generateAccessToken(1,emailExists.email)});   
          }else{
              res.status(401).json({message:"password is incorrect"});
          }
      })
  }else{
      res.status(404).json({login:"User not found)"}); 
  }

}catch(err){
       res.status(500).json({message:err});
   }
 
})

app.get('/questions', function(req, res) {
   return res.json({questions:QUESTIONS});
})

app.get("/submissions:questionId", function(req, res) {
  
  const questionId=req.params.questionId;
  res.json(SUBMISSION[questionId]);
});


app.post("/submissions:questionId", function(req, res) {

  const questionId=req.params.questionId;
const solution=req.body.solution;
  const accept = Math.random() < 0.5;
  if (SUBMISSION[questionId]=="undefined") SUBMISSION[questionId] = [];
  if (accept) {
    SUBMISSION[questionId].push({solution:solution,status:"accepted"});
    return res.send("accepted");
  } else {
    SUBMISSION[questionId].push({solution:solution,status:"rejected"});
    return res.send("rejected");
  }
});


app.post("/addProblem",  (req, res) =>{
  const { email, title, description, testCases } = req.body;

  const user =  USERS.filter((ele)=>{ele.email==email});

    if (user) {
      if (!user.isAdmin)
        return res.status(403).send("You are not admin");

      QUESTIONS.push({title:title,description:description,testCases:testCases});
      return res.status(200).send("Successfully added the problem");
    }

});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})