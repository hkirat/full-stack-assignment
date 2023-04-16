const express = require('express');

const app = express()
const port = 3000
const users = []
const submissions = []
const questions = [{
    title:"two states",
    description : "Given an array,return the maximum of the array.",
    testCases : {
      input:  "[1,2,3,4,5]",
        output:"5"   
    }
}]

 
app.use(express.json());
let signup_check;
app.post('/signup',(req, res) => {
  const email = req.body.email
  const password = req.body.password
  const check = users.find((element)=>element.email===req.body.email)
  if(check){
    signup_check = -1;
    return res.status(409).send('User already exists, try again.')
  }
  else if(!email || !password){
    signup_check = 0;
    return res.status(400).send('Please enter a valid username and password.')
  }
  else{
    
    let myObj = new Object();
    myObj.email = req.body.email;
    myObj.password = req.body.password;
    users.push(myObj);
    console.log(users)
    signup_check = 1;  
    return res.status(201).send("Signed up succesfully. Login to obtain your token(random string rn)")
   
  }
})
app.get('/signup',(req,res)=>{
    if(signup_check===1){
      return res.status(201).send("Signed up succesfully. Login to obtain your token(random string rn)")
    }
    else if(signup_check==-1){
      return res.status(409).send('User already exists, try again.')
    }
    else{
      return res.status(400).send('Please enter a valid username and password.')
    }
})
app.post('/login',(req,res)=>{
  //console.log(users)
    const email_id = req.body.email;
    const pwd = req.body.password;
    
    let check = 0;
    let i;
    for(i=0;i<users.length;i++){
      if(users[i].email===email_id){
        check = 1;
        break;
      }
    }
    //console.log(users[i].email);
    
    if(check===1){
      if(users[i].password!==pwd){
  
        return res.status(401).send("Wrong password, try again.")
      }
      else{
        //Generating a random string of length of the string named 'reference'.      
        const randomstring = require('randomstring');
        const token = randomstring.generate(10);
        return res.status(200).send("Logged in succesfully, here's your token"+" "+token);
      }
      }
      
    else{
      return res.status(401).send("Invalid email id/User does not exist.");
    }
})
app.post('/questions',(req,res)=>{
    return res.status(200).send(questions);
})
app.get('/questions', (req, res) => {
  // Process GET request and send response
  return res.status(200).send(questions);
});
app.post('/admin/addques',(req,res)=>{
   
    
  const newQuestion = {
          title : req.body.title,
          description : req.body.description,
          testCases :{
            input:req.body.testCases.input,
            output:req.body.testCases.output
          }
       }
       let check = questions.find((element)=>element.title===newQuestion.title)
      if(check){
        return res.send("Question already exists, try again.");
      }
      else{
        questions.push(newQuestion);
      console.log(questions);
      return res.status(201).send("Question added successfully.");
      
      }
      
})
app.post('/admin/deleteques',(req,res)=>{
  const newQuestion = {
    title : req.body.title,
    description : req.body.description,
    testCases :{
      input:req.body.testCases.input,
      output:req.body.testCases.output
    }
 }
 let check = questions.find((element)=>element.title===newQuestion.title);
 if(!check){
  return res.status(404).send("Question does not exist, try again.");
}
else{
  questions.splice(questions.indexOf(newQuestion),1);
  console.log(questions);
  return res.status(200).send("Question successfully deleted.");

}
})
app.post('/submissions',(req,res)=>{
  let check = 0;
  let i;
  for(i=0;i<questions.length;i++){
    if(questions[i].title===req.body.title){
      check = 1;
      break;
    }
  }
  if(check==1){
    if(req.body.testCases.input===questions[i].testCases.input){
     
      if(req.body.testCases.output===questions[i].testCases.output){
        const newSubmission={
          title:req.body.title,
          testCases:{
            input:req.body.testCases.input,
            output:req.body.testCases.output
          },
          stature:"accepted"
        }
        submissions.push(newSubmission);
        return res.status(201).send("Submitted succesfully");
      }
      else{
        const newSubmission={
          title:req.body.title,
          testCases:{
            input:req.body.testCases.input,
            output:req.body.testCases.output
          },
          stature:"rejected"
        }
        submissions.push(newSubmission);
        return res.status(401).send("Wrong Output !")
      }
  }
  else{
    return res.status(404).send("Test case doesnt exist .");
  }}
  else{
    return res.status(404).send("Question not found.");
  }
  })
  
app.get('/submissions',(req,res)=>{
    return res.status(200).send(submissions);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
