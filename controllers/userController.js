const userModel = require ("../models/user");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret_key = "NOTESAPI";

const signup = async (req,res) => { 
    const{email , password} = req.body;
    try {
        const existingUser = await userModel.findOne({email : email});
        if (existingUser){
            return res.staus(400).json({message:"User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password,10);

        const result = await userModel.create({
            email: email,
            password: hashedPassword,
         });
        const token = jwt.sign({email : result.email, id : result._id},secret_key);
        res.status(200).json({user: result,token});

    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Something went wrong"})
    }

}

const signin = async(req,res) => { 
    const{email , password} = req.body;
    try {
        const existingUser = await userModel.findOne({email : email});
        if (!existingUser){
            return res.staus(404).json({message:"User Not Found"});
        }

        const matchPassword = await bcrypt.compare(password,existingUser.password);
        if(!matchPassword){
            return res.status(401).json({message: "Invalid Credentials"});
        }

        const token = jwt.sign({email : existingUser.email, id : existingUser._id},secret_key);
        res.status(200).json({user: existingUser,token});

    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Something went wrong"})
    }

    
}

module.exports = {signup,signin};
