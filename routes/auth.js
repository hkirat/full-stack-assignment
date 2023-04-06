const express = require('express');
const router = express.Router();
var CryptoJS = require("crypto-js");
var jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid')
const { body, validationResult } = require('express-validator');
const USERS = [];
router.post('/sign',

    [body('email', "Enter a valid Email ").isEmail(),
    body('password', 'Password must be more then 5 char').isLength({ min: 5 })   // sanitizing user input with the help of express-validator



    ], async (req, res) => {
        if (req.method == 'POST') {  // checking Request method 

            if (req.body.password === req.body.confirmPassword) {   // checking whether the password and confirm password matching or not


                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    // checking validation Result of express-validator
                    // if found then sending the error messages
                    return res.status(400).json({ errors: errors.array() });
                }

                // checking if  email already exists in database?
                const userExist = USERS.some((user) => user.email === req.body.email);
                if (userExist) {
                    return res.status(200).json({ message: "user with email already exists" })
                }

                // // Encrypting PASSWORD
                var encPass = CryptoJS.AES.encrypt(req.body.password, "CRYPTOJS_secret").toString();

                const myUser = {
                    id: uuidv4(),
                    email: req.body.email,
                    password: encPass,
                    status: req.body.status // storing user status user is admin or normal user


                }

                USERS.push(myUser);
                console.log(USERS);
                // making a object for JWT TOKEN
                const data = {
                    user: {
                        id: myUser.id,
                        email: myUser.email,
                        status: myUser.status

                    }
                }


                try {
                    // CREATING A JWT TOKEN
                    const auhtoken = jwt.sign(data, "jwtsecret");
                    console.log(USERS);
                    // SENDING JWT TOKEN
                    return res.status(200).json({ authtoken: auhtoken, success: true })
                } catch (error) {
                    // SENDING A ERROR MESSAGE WIHH SUCCES:FALSE IF SOMETHING WENT WRONG

                    return res.status(500).json({ msg: "Internal Server Error pls try after some time", success: false, error: error });
                }




            } else { // if password and confirm password is not matching then send a message for it
                return res.status(200).json({ message: "password and confirm password not match" });
            }
        } else { // if Request method is not POST then send a message with 404 status code and with a error message
            return res.status(400).json({ message: "Not Found" })
        }
    });


// Login API

router.post('/login', 
[body('email', "Enter a valid Email ").isEmail(),
body('password', 'Password must be more then 5 char').isLength({ min: 5 })   // sanitizing user input with the help of express-validator
] , async (req, res) => {

    if (req.method == 'POST') {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          // checking validation Result of express-validator
          // if found then sending the error messages
          return res.status(400).json({ errors: errors.array() });
        }
  
        const myUser = USERS.find((user) => user.email === req.body.email); // finding email in database
        
        if (myUser) {
          var bytes = CryptoJS.AES.decrypt(myUser.password, 'CRYPTOJS_secret');
          var originalPass = bytes.toString(CryptoJS.enc.Utf8);
          if (originalPass === req.body.password) {
            // Matching Input password and database password
            const data = {
              user: {
                id: myUser.id,
                email: myUser.email,
                status: myUser.status
              }
            }
  
            try {
              // CREATING A JWT TOKEN
              const authToken = jwt.sign(data, "jwtsecret");
              console.log(USERS);
              // SENDING JWT TOKEN
              return res.status(200).json({ authtoken: authToken, success: true });
            } catch (error) {
              // SENDING A ERROR MESSAGE WITH SUCCESS:FALSE IF SOMETHING WENT WRONG
              return res.status(500).json({ msg: "Internal Server Error pls try after some time", success: false });
            }
  
          } else {
            // Invalid credentials because password not match
            return res.status(401).json({ message: "Invalid Credentials" });
          }
        } else {
          // If the email/password combination is not found in the database, return 401 status code to the client
          return res.status(401).json({ message: "Invalid Credentials" });
        }
  
      } else {
        return res.status(400).json({ message: "Not Found" })
      }
    }
    
)

module.exports = router;