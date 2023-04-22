var QUESTIONS = [
    {
        "questionId": 1,
        "userId": 1,
        "title": "Two states",
        "description": "Given an array , return the maximum of the array?",
        "testCases": [
            {
                "input": "[1,2,3,4,5]",
                "output": "5"
            }
        ]
    },
    {
        "questionId": 2,
        "userId": 1,
        "title": "Product",
        "description": "Calculate the product of all the values present in an array",
        "testCases": [
            {
                "input": "[1,2,3,4,5]",
                "output": "120"
            }
        ]
    }
];

const getQuestions = (req, res) => {
    //return the user all the questions in the QUESTIONS array
    return res.status(200).send({
        questions: QUESTIONS
    })
}

const addQuestion = (req, res) => {
    // Create a route that lets an admin add a new problem
    let { userId, isAdmin, title, description, testCases } = req.body;

    // ensure that only admins can do that.
    if (isAdmin) {
        let newQuestion = {
            questionId: QUESTIONS?.length + 1,
            userId: parseInt(userId),
            title: title,
            description: description,
            testCases: testCases
        }
        QUESTIONS.push(newQuestion)
        return res.status(200)?.send({ message: "Question saved successfully!", question: newQuestion })
    } else {
        return res.status(401).send({ message: "Sorry, You are not authorized to add a question." })
    }
}


module.exports = { getQuestions, addQuestion };