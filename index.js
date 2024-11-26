const express = require('express')
const app = express()
const port = 3000
app.use(express.json());
const users = [
  { email: "user1@example.com", password: "userpass1" },
  { email: "user2@example.com", password: "userpass2" },
];

const admins = [
  { email: "admin1@example.com", password: "adminpass1" },
  { email: "admin2@example.com", password: "adminpass2" },
];
const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = [
  {
    email: "user@example.com",
    questionTitle: "Find Maximum",
    userSolution: "function findMax(arr) { return Math.max(...arr); }",
    solutionStatus: "Accepted" // or "Rejected"
  }
];

app.post('/signup', function(req, res) {
  const { email, password, role } = req.body;
  if (isEmailInUse(email, role))
    {return res.status(400).send('User with this email already exists');}
  else {
    createUser(email, password, role);
    return res.status(200).send('A user has been created');
  }
});

app.post('/login', function(req, res) {
  const { email, password, role } = req.body;
  if (isEmailInUse(email, role)) {
  if (checkPassword (email, password, role)) {
    return res.status(200).send('Valid login! Happy coding!');
  } else { return res.status(401).send('Invalid Password! Check login details & try again!');}
}
else { return res.status(401).send('Invalid Email! Check login details & try again!'); }});

app.get('/questions', function(req, res) {
  const { email, role } = req.body;
  if(isEmailInUse(email,role)) {
    if(role == "user"){
    res.status(200).json(QUESTIONS);
  } else {res.status(401).send('Only Users can access Questions on this platform');
  }
  } else {res.status(401).send('You need to Signup to access the platform');}
  
});

app.post('/questions', function (req, res) {
  const { email, role } = req.body;
  // Check if the user is an admin
  if (isEmailInUse(email, role)) {
      const { title, description, testcase } = req.body;
      let questionUpdated = false;
      // Loop to check for an existing question
      for (let i = 0; i < QUESTIONS.length; i++) {
        if (QUESTIONS[i].title === title) {
          // Update the existing question
          QUESTIONS[i].description = description;
          QUESTIONS[i].testCases = [{ input: testcase.input, output: testcase.output }];
          questionUpdated = true;
          break;
        }
      }
      if (!questionUpdated) {
        // Add a new question if no match is found
        const newQuestion = {
          title: title,
          description: description,
          testCases: [{ input: testcase.input, output: testcase.output }]
        };
        QUESTIONS.push(newQuestion);
        return res.status(201).send("Question successfully added to the repo: " + JSON.stringify(QUESTIONS));
      }
      return res.status(200).send("Question successfully updated in the repo: " + JSON.stringify(QUESTIONS));
    }else {
    return res.status(401).send("You need to Signup as an admin to create questions");
  }
});


app.get("/submissions", function(req, res) {
  const { email, role } = req.body;
  let gotSubmission = false;
  if (isEmailInUse(email, role)){
for (let i=0; i < SUBMISSION.length; i++){
  if (email === SUBMISSION[i].email) {
    const userSubmissions = [{
      title: SUBMISSION[i].questionTitle, 
      solution: SUBMISSION[i].userSolution, 
      status: SUBMISSION[i].solutionStatus}];
    gotSubmission = true;
    return res.status(200).send("Here are all your submissions:" + JSON.stringify(userSubmissions));
  }
} 
if (gotSubmission === false) {return res.status(401).send("No previous submission by this user!");}
  }else {
  return res.status(401).send("Invalid user! Please check your Email!");
}
});


app.post("/submissions", function(req, res) {
  const { email, role } = req.body;
  if (isEmailInUse(email, role)){
    const {title, solution, status} = req.body;
    const newSubmission = {email: email, questionTitle: title, userSolution: solution, solutionStatus: status}
    SUBMISSION.push(newSubmission);
    return res.status(201).json({ message: "Your submission has been recorded!", submission: newSubmission });
  } else {
    return res.status(401).send("Invalid user! Please check your Email & Role!");
  }
});



app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})


function isEmailInUse(email, role) {
  if (role == "admin") { 
    for (let i=0; i<admins.length; i++){
      if (email === admins[i].email){
        return true;
      }
    }
    } else {
      for (let i=0; i<users.length;i++){
        if (email === users[i].email){
          return true;
        }
    }
}
return false;}

function createUser(email, password, role){
  if (role === 'user') {
    users.push({ email, password });
    console.log(users);
  } else if (role === 'admin') {
    admins.push({ email, password });
    console.log(admins);
  }
}

function checkPassword(email, password, role){
if (role === 'user') {
  for (let i = 0; i < users.length; i++) {
    if (users[i].email == email && users[i].password == password){
      return true;
    }
  }  
  return false;
}else if (role === 'admin') {
  for (let i = 0; i < admins.length; i++) {
    if (admins[i].email == email && admins[i].password == password){
      return true;
    }
  } return false;
} return false;
}