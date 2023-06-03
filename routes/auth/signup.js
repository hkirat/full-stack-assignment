const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const USERS = require('../../users');

router.use(bodyParser.json());

router.post('/signup', function (req, res) {
    // Add logic to decode body
    // body should have email and password

    const email = req.body.email;
    const password = req.body.password;

    //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

    if (USERS.length === 0) {
        USERS.push({ email, password });
        res.status(200);
    } else {
        const userExists = USERS.some((user) => user.email === email);
        if (userExists) {
            res.status(409).send('Email already registered');
        } else {
            USERS.push({ email, password });
            // return back 200 status code to the client
            res.status(200);
        }
    }
});

module.exports = router;
