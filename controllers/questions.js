var QUESTIONS = [
    {
        "questionId": 1,
        "userId": 1,
        "title": "Two states",
        "titleSlug": "two-states",
        "description": "Given an array , return the maximum of the array?",
        "acceptance": "22%",
        "difficulty": "Easy",
        "examples": [{
            "exampleId": 1,
            "input": "[1,2,3,4,5]",
            "output": "5",
        },
        {
            "exampleId": 2,
            "input": "[41,32,93,104,55]",
            "output": "104",
        }],
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
        "titleSlug": "product",
        "description": "Calculate the product of all the values present in an array",
        "acceptance": "43%",
        "difficulty": "Medium",
        "examples": [{
            "exampleId": 1,
            "input": "[1,2,3,4,5]",
            "output": "120",
            "explanation": "The above array has 5 values, 1,2,3,4,5 and the product of all the values is 120"
        },
        {
            "exampleId": 2,
            "input": "[4,2,9,14,6]",
            "output": "6048",
            "explanation": "The above array has 5 values, 4,2,9,14,6 and the product of all the values is 6048"
        }],
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
    return res.status(200).json({
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

const getQuestionBySlug = (req, res) => {
    let { slug } = req?.body;

    let SelectedQuestion = QUESTIONS?.find(question => question?.titleSlug === slug);

    if (!!slug) {
        return res.status(200)?.send({ message: "Question saved successfully!", question: SelectedQuestion })
    } else {
        return res.status(401).send({ message: "Sorry, You are not authorized to add a question." })
    }
}


module.exports = { getQuestions, addQuestion, getQuestionBySlug };