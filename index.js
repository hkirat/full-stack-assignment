const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

const USERS = [];

const QUESTIONS = [{
    title: "Two States",
    description: "Given an array, return the maximum of the array",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}]

const SUBMISSIONS = [];

app.post('/signup', (req, res) => {
    const {email, password} = req.body;

    //check if the user has entered the email and password or not
    if(!email || !password){
       return res.status(400).send("Email and password are required.");
    }

    //check if the user already exists in the array
    const existingUser = USERS.find(user => user.email === email);
    if(existingUser){
        return res.status(400).send("User already exists!!!");
    }

    USERS.push({email, password});
   res.status(200).send("Yipeee user added.")
})

app.post('/login', (req, res) => {
    const {email, password} = req.body;

    const user = USERS.find(user => user.email === email);
    
    if(!user){
        return res.status(401).send("The user does not exists. You need to signup first.");
    }

    if(user.password !== password){
        return res.status(401).send("Incorrect password");
    }

    const token = "2sMdFV2LfLHhA9Xp";

    res.status(200).json({message: "Login Successful", token });
})

app.post('/exampleSignup', (req, res) => {
    // Simulating signup for two users
    const user1 = { email: "user1@example.com", password: "password1" };
    const user2 = { email: "user2@example.com", password: "password2" };

    // Pushing the users into the USERS array
    USERS.push(user1, user2);

    res.status(200).send("Example signup successful.");
});

app.get('/questions', (req, res) => {
    try {
    return res.status(200).send(QUESTIONS);
    } catch (error) {
        throw new Error(error);
    }
})

function acceptOrRejectSolution(){
    const randomNum = Math.floor(Math.random() * 2);
    if(randomNum === 0){
       return res.send("Solution Rejected");
    }
    else{
        return res.send("Solution Accepted");
    }
}

app.post('/submissions', (req, res) => {
    const {problem, solution} = req.body;
    const statusOfTheSolution = acceptOrRejectSolution();
    SUBMISSIONS.push({problem, solution, statusOfTheSolution});
    res.status(200).send(statusOfTheSolution);
})

app.get('/submissions', (req, res) => {
    try {
        return res.status(200).send(QUESTIONS);
        } catch (error) {
            throw new Error(error);
        }
})

app.post('/questions', (req, res) => {
    const {email, password} = req.body;

    const userExists = USERS.find(user => user.email === email)

    if(!userExists){
        return res.status(401).send("The user does not exists!");        
    }
    else{
        if(userExists.role != "admin"){
            return res.status(403).send("Only admins are allowed!");
        }
        else{
            QUESTIONS.push(req.body.question)
            return res.status(201).send("New question is added successfully.")
        }
    }
})

app.listen(PORT, () => {
    console.log(`The server is hosted at port ${PORT}`);
})