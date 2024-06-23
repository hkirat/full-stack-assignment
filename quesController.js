const QUESTIONS = [
    {
        title: "Max Num",
        description: "Given an array , return the maximum of the array?",
        testCases: [{
            input: "[1,2,3,4,5]",
            output: "5"
        }]
    },
    {
        title: "Sum of All",
        description: "Given an array , return the sum of the array?",
        testCases: [{
            input: "[1,2,3,4,5]",
            output: "15"
        }]
    }];

const SUBMISSION = [
    {
        title: "Max Num",
        code: "Math.max(input)"
    }
]

const ADMIN = {
    email: "admin@example.com",
    password: "123456",
}


//return the user all the questions in the QUESTIONS array
function questionList(req, res) {

    const questionList = []

    // Iterate through QUESTIONS array
    QUESTIONS.forEach(ques => {
        let question = {
            title: ques.title,
            description: ques.description,
            testCases: ques.testCases
        };
        questionList.push(question);
    });

    return res.json({
        success: true,
        questionList
    });
}

// return the users submissions for this problem
function submission(req, res) {
    // though there should be a middleware which checks the user identitity via token and then present them with their specific submission but i am hard coding the submission presented

    const index = Math.floor(Math.random() * SUBMISSION.length)

    return res.json({
        success: true,
        submission: SUBMISSION[index]
    })
}

// let the user submit a problem, randomly accept or reject the solution
// Store the submission in the SUBMISSION array above
function submit(req, res) {
    const { title, code } = req.body;

    const questionTitle = QUESTIONS.some(ques => ques.title === title);
    if (!questionTitle) {
        return res.status(403).json({
            success: false,
            message: 'No question found'
        })
    }

    SUBMISSION.push({ title: title, code: code });

    const result = Math.random() < 0.5; // 50% chance of true or false

    return res.json({
        success: result,
        message: result ? 'Correct solution accepted' : 'Wrong solution rejected',
    });

}

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
function createProblem(req, res) {
    const { email, password, question } = req.body;

    const check = ADMIN.email === email && ADMIN.password === password;

    if (!check) {
        return res.status(403).json({
            success: false,
            message: 'Unauthorized: Invalid email address or wrong password',
        })
    }

    const ques = {
        title: question.title,
        description: question.description,
        testCases: question.testCases
    }

    QUESTIONS.push(ques)

    return res.json({
        success: true,
        message: 'Question added successfully',
        QUESTIONS
    })

}


module.exports = {
    questionList,
    submission,
    submit,
    createProblem
}