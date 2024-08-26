const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = express()
const port = 3001
app.use(bodyParser.json())
const SECRET_KEY = 'your_secret_key'; // Secret key for JWT
const  USERS = [];
const QUESTIONS = [{
    questionId:"1",
    title: "Two states",
    description: "Gevein an array, return the maximun of the array",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];
const SUBMISSIONS = [
    {
        username: "1",
        questionId: "1",
        code: "sdfsdj sdnlds kdfdjf djkds",
        status: "accepted"
    }
]

app.get('/', (req, res) => {
    res.send('<html><body><h1 style="color: red;">chat</h1></body><html>')
})
app.post('/signup', async (req, res) => {
    const { username, password } = req.body
    //add logic to decdoe the body
    // body  should contain email and password
    if(!username || !password){
        return res.status(400).json({message: "Username and password are required"})
    }
    const userExist  = USERS.find(user => user.username === username)
    if(userExist){
        return res.status(400).json({message: "Username already exists"})
    }

    const hashedPassword  = await bcrypt.hash(password,10)
    USERS.push({username, password: hashedPassword})
    res.status(201).json({message: "User registered successfully"})

    //store the email and passowrd if user does not exits
    //return the status code with 201

    //res.send('Hello World!')
})

app.post('/login', async (req, res) => {

    //add logic to decdoe the body
    // body  should contain email and password
    const { username, password } = req.body
    //add logic to decdoe the body
    // body  should contain email and password
    if(!username || !password){
        return res.status(400).json({message: "Username and password are required"})
    }
   //check if user exist with the  given email in  the  USERS array 

    const userExist  = USERS.find(user => user.username === username)
    if(!userExist){
        return res.status(400).json({message: "Invalid credentials"})
    }
    try{
        const passwordMatch = await bcrypt.compare(password,userExist.password)
        const token =  jwt.sign({username: username}, SECRET_KEY, {expiresIn: '1h'})
        if(passwordMatch) {
            return res.status(200).json({token, message: "login success"})
        } else {
            return res.status(400).json({message: "Invalid credentials"})
        }
    } catch (error) {
        res.status(500).json({ message: 'Error occurred during login.' });
    }
    // and if password matches return the token (any  random strign will do for now) and status code with 200
    // if password does not match then return 401
    //res.send('Hello World!')
})


app.get('/questions', (req, res) => {
    return res.status(200).json({QUESTIONS});
    //retrun  all the questions in  the QUESTIONS array to the  user
   // res.send('Hello World!')
})

const authenticatJwt  = (req, res, next) => {
    const authHeader = req.headers.authorization
    if(authHeader) {
        const token = authHeader.split(' ')[1]
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                return res.sendStatus(403); // Invalid token
            }

            req.user = user; // Attach user info to request object
            next(); // Proceed to the next middleware or route handler
        });
    } else {
        res.sendStatus(401)
    }
}

app.get('/submistsons', authenticatJwt, (req, res) => {
    
    const userSubmissions = SUBMISSIONS.filter(submission => submission.username === req.user.username);
    return res.status(200).json({userSubmissions});
        
    
    //return the user's submissions to the this question.
    //res.send('Hello World!')
})

app.post('/submission', authenticatJwt, (req, res) => {
    const {questionId, code} = req.body
    const  submission  = {
        username : req.user.username,
        questionId: questionId,
        code:  code,
        status: Math.random()  < 0.5 ? "Accepted" : "Rejected"
    }
    SUBMISSIONS.push(submission);
    return res.status(200).json({status: submission.status})
    //let the user submit the solution to the problem and randomly acceptot rejact the solution
    //store the submission to to SUBMISSIONS array.
   // res.send('Hello World!')
})

//to do

//create the endpoint that lets  admin  add a new  problem.
//ensure  the only add can  do that
//logout


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})