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
    const access = req.body.access;

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
            password: hashedPassword,
            access: access
        })

        //Saving newUser in db
        const thisUser = await newUser.save();
        res.json(thisUser)

    }

})

router.post('/login', async function (req, res) {
    // Add logic to decode body
    // body should have email and password

    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        //this should be done in frontend, but doing here for now
        res.json({ "error": "Email or password is missing" });
    }

    const thisUser = await User.findOne({email});

    //checking if user exists
    if(!thisUser){
        return res.status(500).json({"Error": "User does not exists"});
    }

    //getting password stored in db
    const thisPass = thisUser.password;

    //Checking if password matches
    let isPasswordCorrect = await bcrypt.compare(password, thisPass);

    if(!isPasswordCorrect){
        return res.status(500).json({"Error": "Incorrect password"});
    }

    res.json({"Token": "LOL XD"});
    
})


module.exports = router
