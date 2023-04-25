// Require the Express module
const express = require('express')
const app= express()
const port=3000
const router= express.Router()
const admin = {username: 'admin' , isAdmin: 'true'}
// Create a new Express application
//const app = express();
 
// Define a route for the homepage

const USERS=[]
const QUESTIONS= [{
  title: "Two states",
  description: "given an array, return max",
  testCases: [{
    input: "[1,2,3,4,5]",
    output: "5"
  }]
}]
const SUBMISSION =[{
   userId: "1",
   questionId: "1",
   code: "function max(arr) {return Math.max(...arr)}",
   status:"accepted"
},
  {
    userId: "1",
   questionId: "1",
   code: "function max(arr) {return Math.min(...arr)}",
   status:"rejected"
  }
]


app.post('/signup', (req, res) => {
  //add logic to decode body
  //body should have user email and pw
  // store em and pw in array 
  //only if user doesn't exist
  //return 200
  try{
    const { email, password }= req.body;

    //check if user already exists
    const existingUser =USERS.find(user=> user.email === email);
    if(existingUser){
      res.status(400).send('User already exists');
      return;
    }

    USERS.push({email,password});
    res.status(200).send('User signed up successfully');

  }catch(error){
    console.error(error);
    res.status(500).send("something went wrong");
  }

  //res.send('Hello, world!');
});



app.post('/login', (req, res) => {
  //logic to decode
  //body should have email and pw

  //check if the user exist in array 
  //ensure password in same

  //if same return 200 code with a message 
  //if not same then return code 401
    try{
      const {email, password}= req.body;

      //check if exists
      const user= USERS.find(user=> user.email===email);
      if(!user){
        res.status(401).send('user does not exist');
        return;
      }

      //pw check
      if(user.password !== password){
        res.status(401).send('Incorrect Password');
        return;
      }

      res.status(200).send('successfully Logged in');

    } catch(error){
      console.error(error);
      res.status(500).send('Something went wrong');
    }
});

app.get('/questions', (req, res) => {
  //return all questions in array
  try{
    res.status(200).send(QUESTIONS);
  }catch(error){
    console.error(error);
    res.send(200).send('something went wrong');
  }
});

app.get('/submissions', (req, res) => {
  //return the user submissions for this problem
  try{
    const {userId, questionId}=req.query;
    const userSubmissions = SUBMISSION.filter(submission=> submission.userId=== parseInt(userId) && submission.questionId===(questionId));

    res.status(200).send(userSubmissions);
  }catch(error){
    console.error(error);
    res.status(500).send('something went wrong');
  }
});

app.post('/submissions', (req, res) => {
  //let the user submit a problem, randomly or accept or reject in sub array 
  const {userId, questionId}= req.body;

  const acceptStatus= Math.random()<0.5?'accepted':'rejected';
  SUBMISSION.push({userId, questionId, acceptStatus});

  res.status(200).json({
    message: 'submission successful',
    submission: {userId, questionId, acceptStatus},
  });
});

//leaving hard todos
//create a route that lets an admin add a new problem
// ensure that only admins can do that
router.post('/problems', (req, res) => {
  // Check if user is authorized
  if (!req.user || !req.user.isAdmin) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { userId, questionId, code, status } = req.body;
  const newProblem = {
  userId,
   questionId,
   code,
   status,
  };
  SUBMISSION.push(newProblem);
    
  res.status(201).json({ success: true });
});
// Mount the router to the main app instance
app.use('/api', router);

// Start the server
app.listen(3001, () => {
  console.log('Server started on port 3001');
});
