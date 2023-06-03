const express = require('express');
const router = express.Router();

const SUBMISSIONS = [
    {
        userId: '1',
        problemId: '1',
        code: 'function max(arr) { return Math.max(...arr)',
        status: 'accepted',
    },

    {
        userId: '1',
        problemId: '1',
        code: 'function max(arr) { return Math.max(...arr)',
        status: 'rejected',
    },
];

router.get('/submissions', function (req, res) {
    // return the users submissions for this problem

    const { problemId } = req.query;
    const getSubmission = SUBMISSIONS.filter(
        (submission) => submission.problemId === problemId,
    );

    console.log('submissions submitted');
    res.status(200).send(getSubmission);
});

router.post('/submissions', function (req, res) {
    const { userId, problemId, code } = req.body;
    // let the user submit a problem, randomly accept or reject the solution
    const status = Math.random() < 0.8 ? 'accepted' : 'rejected';
    // Store the submission in the SUBMISSION array above
    if (SUBMISSIONS.length === 0) {
        SUBMISSIONS.push(newSubmission);
    }
    const newSubmission = { userId, problemId, code, status };
    SUBMISSIONS.push(newSubmission);
    console.log('submissions posted');
    res.status(200).send('Submissions posted succesfully');
});

module.exports = router;
