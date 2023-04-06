const express = require('express');
const router = express.Router();
var CryptoJS = require("crypto-js");
var jwt = require('jsonwebtoken');
const {v4 : uuidv4} = require('uuid')
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
                // // Encrypting PASSWORD
                var encPass = CryptoJS.AES.encrypt(req.body.password, "CRYPTOJS_secret").toString();

                const myUser ={
                    id:uuidv4(),
                    email:req.body.email,
                    password:encPass,
                    status:req.body.status // storing user status user is admin or normal user
                    

                }

                USERS.push(myUser);
                console.log(USERS);
                // making a object for JWT TOKEN
                const data ={
                    user:{
                        id: myUser.id,
                        email:myUser.email,
                        status:myUser.status

                    }
                }


                try {
                    // CREATING A JWT TOKEN
                    const auhtoken = jwt.sign(data,"jwtsecret");
                    console.log(USERS);
                    // SENDING JWT TOKEN
                    return res.status(200).json({authtoken:auhtoken,success:true})
                } catch (error) {
                    // SENDING A ERROR MESSAGE WIHH SUCCES:FALSE IF SOMETHING WENT WRONG
                  
                    return res.status(500).json({msg:"Internal Server Error pls try after some time",success:false,error:error});
                }




            } else { // if password and confirm password is not matching then send a message for it
               return res.status(200).json({ message: "password and confirm password not match" });
            }
        } else { // if Request method is not POST then send a message with 404 status code and with a error message
           return res.status(404).json({ message: "Not Found" })
        }
    })

    module.exports = router;