const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../Models/User');

const router = express.Router()

router.get('/', (req, res) => {
    res.send("User route");
})

const USERS = [];

router.post('/signup', async function (req, res) {
    // Add logic to decode body
    // body should have email, password, name

    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    let hashedPassword = "";

    //this should be done in frontend, but doing here for now
    if (!email || !password) {
        res.json({ "error": "Email or password is missing" });
    }

    //checking if user already exists
    let userExists = false;

    userExists = await User.exists({email: email});

    if (userExists) {
        res.status(409).json({ "error": "User already exists" });
    }
    else {

        //Encrypting password
        try{
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }catch(err){
            res.json({'Error': err})
        }

        //Creating new user from User schema
        const newUser = new User({
            name: name,
            email : email,
            password: hashedPassword
        })

        //Saving newUser in db
        const thisUser = await newUser.save();
        res.json(thisUser)

    }

})

router.post('/login', function (req, res) {
    // Add logic to decode body
    // body should have email and password

    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        //this should be done in frontend, but doing here for now
        res.json({ "error": "Email or password is missing" });
    }

    // Check if the user with the given email exists in the USERS array
    // Also ensure that the password is the same
    let userExists = false;
    let this_user = {};

    USERS.forEach((user) => {
        if (user.email === email) {
            userExists = true;
            this_user = user;
        }
    })

    // If the password is the same, return back 200 status code to the client
    if (userExists) {
        if (this_user.password === password) {
            // Also send back a token (any random string will do for now)
            res.status(200).json({ "message": "Login successfull" });
        }
        // If the password is not the same, return back 401 status code to the client
        else {
            res.status(401).json({ "error": "incorrect password" })
        }
    }
    else {
        res.status(401).json({ "error": "User does not exists" })
    }

    res.send('Hello World from route 2!')
})


module.exports = router
