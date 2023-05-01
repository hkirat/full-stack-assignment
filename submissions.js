const app = require('express');
const router = app.Router();

const { SUBMISSIONS, addNewSubmission } = require('./utils')



router.get('/submissions/:problemId', function (req, res) {

    const userEmail = req.session.user;  //retrieving user email id from session which is stored during logging
    const problemId = req.params.problemId.split(':')[1];
    // Retrieve the user's submissions
    const userSubmissions = SUBMISSIONS.filter(submission => submission.userEmail === userEmail);
    // Filter the user's submissions to only include those for the specific problem
    const problemSubmissions = userSubmissions.filter(submission => submission.problemId === problemId);
    res.send(problemSubmissions);
});

router.post('/submissions', function (req, res) {
    const problemId = req.body.problemId;
    const code = req.body.solution;
    let userEmail = req.session.user;
    
    // check if submission already exists
    const existingSubmission = SUBMISSIONS.find(submission =>
        submission.user === userEmail && submission.problemId === problemId
    );

    if (existingSubmission) {
        // if submission already exists, update the code
        existingSubmission.code = code;
    } else {
        // if submission does not exist, create a new submission object
        const newSubmission = {
            userEmail: userEmail,
            problemId: problemId,
            code: code
        };
        addNewSubmission(newSubmission);
    }

    res.status(200).json({ message: 'Submission saved successfully' });
});

router.get('/submit', (req, res) => {
    res.send(`
    <html>
        <head>
        <title>Submit Problem</title>
        </head>
        <body>
        <form method="post" action="/submissions">
            <label for="problemId">Enter your problem id:</label>
            <input type="text" id="problemId" name="problemId"><br>
            <label for="solution">Enter your solution</label>
            <textarea id="solution" name="solution"></textarea><br>
            <button type="submit">Submit</button>
        </form>
        </body>
    </html>
    `);
});

module.exports = router;
