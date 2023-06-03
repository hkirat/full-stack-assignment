// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

const express = require('express');
const router = express.Router();

const isAdmin = (req, res, next) => {
    const { email } = req.body;

    if (email.toLowerCase() === 'admin@admin.com') {
        next();
    } else {
        res.status(403).json({ error: 'Unauthorised Access' });
    }
};

const problems = [];

router.post('/problems', isAdmin, function (req, res) {
    const { title, description, testCases } = req.body;
    const newProblem = { title, description, testCases };
    problems.push(newProblem);
    res.status(201).json(newProblem);
});

module.exports = router;
