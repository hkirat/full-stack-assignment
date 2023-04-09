exports.getAllSubmissions = (req, res) => {
    const { userId } = req.user
    const userSubmissions = global.SUBMISSIONS.filter(submission => submission.userId === userId)
    res.json(userSubmissions)
}

exports.createSubmission = (req, res) => {
    const { userId } = req.user
    const { questionId, solution } = req.body
    const submission = {userId, questionId, solution}
    global.SUBMISSIONS.push(submission)
    res.status(201).json(submission)
}
