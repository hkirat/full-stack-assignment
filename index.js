import express from "express"
import bodyParser from "body-parser"
import bcrypt from "bcrypt"
import jwt, { decode } from "jsonwebtoken"



const app = express();
const PORT = 5000;
const JWT_SECRET_KEY = "secret"

// const USERS = [];
const USERS = [];

const QUESTIONS = [
    {
        title: "Two states",
        description: "Given an array , return the maximum of the array?",
        testCases: [{
            input: "[1,2,3,4,5]",
            output: "5"
        }]
    }
];


const SUBMISSION = [

];



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.get("/", (req, res) => {
    res.send("Home")
});

app.post("/signup", async (req, res) => {
    const { email, password } = req.body;

    let userEmailExists = false;
    for (const user of USERS) {
        if (user.email === email) {
            userEmailExists = true;
            break;
        }
    }
    if (userEmailExists) {
        return res.status(400).json({ "message": `User already Exists with ${email}. Please use another one` });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        USERS.push({ email, password: hashedPassword });

        res.status(200).json({
            "message": "Registered Successfully",
            "email": email,
            "password": hashedPassword
        });

        console.log(USERS);
    } catch (error) {
        console.log("Error: ", error);
        res.status.send(500).json({ "message": "Server Error!" });
    }
})

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    let userIndex = -1; //we can't put 0 because 0 is also an index of USERS array.
    for (let i = 0; i < USERS.length; i++) {
        if (USERS[i].email === email) {
            userIndex = i;
            break;
        }
    }

    if (userIndex !== -1 && bcrypt.compare(password, USERS[userIndex].password)) {
        const token = jwt.sign({ email }, JWT_SECRET_KEY)
        return res.status(200).json({
            "message": "Logged in Successfully.",
            "email": email,
            "password": password,
            "token": token
        });
    }
    else {
        return res.status(401).json({ "message": "Credentials Doesn't match." });
    }
});

app.get("/questions", (req, res) => {
    res.send(`<h1>QUESTIONS</h1><h3>${QUESTIONS[0].title}</h3><h3>Description:${QUESTIONS[0].description}</h3><h3>testCases:</h3><h3>Input: ${QUESTIONS[0].testCases[0].input}<h3><h3>Output: ${QUESTIONS[0].testCases[0].output}</h3>`);
})

app.get("/submissions", (req, res) => {
    if (SUBMISSION.length > 0) {
        return res.send(`<h1>Your Code:</h1><h3>${SUBMISSION[0]}</h3>`)
    }
    else {
        res.send("<h3>You haven't submitted any code.</h3>")
    }
})


app.post("/submissions", (req, res) => {
    const { code } = req.body;
    if (code.includes("console.log(sum)")) {
        SUBMISSION.push(code)
        return res.status(200).json({ "message": "Your Code has been submitted" })
    }
    else {
        return res.status(400).json({ "message": "Wrong , check it again" })
    }
})

app.post("/admin-login", (req, res) => {
    const { email, password } = req.body({ isAdmin: true }, JWT_SECRET_KEY)
    if (email.includes("admin") && password === "admin") {
        const token = jwt.sign({ isAdmin: true }, JWT_SECRET_KEY)
        res.status(200).json({ "message": "Admin Login Successfull" });
    }
    else {
        res.status(401).json({ "message": "Admin Login Failed!" })
    }
})

//middleware for only admin to change QUESTIONS
const verifyAdmin = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        res.status(401).json({ "message": "Unathorized, You are not admin" });
    }
    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
        if (err || !decode.isAdmin) {
            return res.status(403).json({ "message": "Unathorized, invalid token" })
        }
    });
    next();
}
app.put("/admin/questions/:questionsId", verifyAdmin, (req, res) => {
    const questionId = req.params.questionId;
    const { updatedQuestion } = req.body;

    QUESTIONS.push(updatedQuestion);

    res.status(200).json({ message: "Question updated successfully" });
});



app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
});