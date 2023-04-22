var SUBMISSION = [
    {
        "submissionId": 1,
        "userId": 1,
        "questionId": 1,
        "solution": "Given an array , return the maximum of the array?",
        "language": "Javascript",
        "result": "Reject"
    },
    {
        "submissionId": 2,
        "userId": 1,
        "questionId": 1,
        "solution": "Given an array , return the maximum of the array?",
        "language": "Javascript",
        "result": "Reject"
    },
    {
        "submissionId": 3,
        "userId": 1,
        "questionId": 1,
        "solution": "Given an array , return the maximum of the array?",
        "language": "Javascript",
        "result": "Accept"
    }
];

const getSubmissionsByUserIdQuestionId = (req, res) => {
    // return the users submissions for this problem
    const {
        userId,
        questionId
    } = req?.query;
    const usersSubmission = SUBMISSION?.filter(sub => (sub?.userId === parseInt(userId)) && (sub?.questionId === parseInt(questionId)));
    if (!!usersSubmission?.length) {
        res.status(200).send({
            submissions: usersSubmission
        })
    } else {
        res.status(404).send({
            message: "Submissions for this user and question is not present",
            submissions: []
        })
    }
}

const addSubmission = (req, res) => {
    // let the user submit a problem, randomly accept or reject the solution
    let { questionId, userId, solution, language } = req.body;
    let passed = parseInt(Math.random() * 10) % 2 === 0;
    let result = passed ? "Accept" : "Reject";
    let submissionObj = {
        submissionId: SUBMISSION?.length + 1,
        userId: userId,
        questionId: questionId,
        solution: solution,
        language: language,
        result: result
    }

    // Store the submission in the SUBMISSION array above
    SUBMISSION.push(submissionObj);

    return res.status(200).send({ message: "Submission successfully saved!", submission: submissionObj, result: result })
}

module.exports = { getSubmissionsByUserIdQuestionId, addSubmission };
