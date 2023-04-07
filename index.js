const express = require('express')
const app = express()
const port = 3001

app.use(express.json()); //use this middleware to deal with json data

let verify = false; // for user varification

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

app.post('/signup', function(req, res) {

  const data = req.body; //it will decode body 

  let check_data_email = USERS.find(n => n.email == data.email); // it will check the data is present or not

  // check user exist or not
  if(check_data_email ){
    res.status(400).send("user already exists");
  }else{
    USERS.push(data)
    res.status(200).send("Data added successfully");
  }

})

app.post('/login', function(req, res) {

  const data = req.body; // decode body 

  let verify_email = USERS.find(n => n.email == data.email)
  let verify_passowrd = USERS.find(n => n.password == data.password)

  // check user email and password is correct or not
  if(verify_email && verify_passowrd){
    verify = true;
    res.status(200).redirect('http://127.0.0.1:3001/add');
  }else{
    res.status(401).send("Check email or password")
  }
  
})

app.get('/questions', function(req, res) {

  res.send(QUESTIONS) // it will gave all the question in the form of json data
})
app.post('/questions', function(req, res) {
  if(verify){
    const data = req.body;
    QUESTIONS.push(data);
    res.status(200).send("Question added successfully")
  }else{
    res.status(400).send("Login first")
  }

})

app.get("/submissions", function(req, res) {
  res.send(SUBMISSION)
});

app.post("/submissions", function(req, res) {
  const data = req.body;
  
  SUBMISSION.push(data);
  res.status(200).send("added data successfully")
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})