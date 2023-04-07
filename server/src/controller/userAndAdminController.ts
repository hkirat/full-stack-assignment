import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import signUpModel from "../model/signUp";

const signUpRequest = async function (
  req: express.Request,
  res: express.Response
) {
  try {
    let data = req.body;

    //empty Body
    if (Object.keys(data).length == 0) {
      return res.status(400).send({
        status: false,
        message: "Please Provide Your User Details",
      });
    }

    //name validation
    if (!data.name || data.name.trim().length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "Name is required" });
    } else if (/\d/.test(data.name)) {
      return res
        .status(400)
        .send({ status: false, message: "Name can not have Numbers" });
    }

    //phone number validation
    if (!data.phone || data.phone.length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "Phone Number is required" });
    }

    if (
      !/^(?:(?:\+|0{0,2})91(\s*|[\-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/.test(
        data.phone
      )
    ) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter a valid Mobile Number" });
    }

    const phoneNumberCheck = await signUpModel.findOne({
      phone: data.phone,
    });
    if (phoneNumberCheck) {
      return res
        .status(400)
        .send({ status: false, message: "Phone number is already registered" });
    }

    //email validation
    if (!data.email || data.email.trim().length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "Email field is required" });
    }

    if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(data.email)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide a valid Email" });
    }

    const isEmailAlreadyUsed = await signUpModel.findOne({
      email: data.email,
    });
    if (isEmailAlreadyUsed) {
      return res
        .status(400)
        .send({ status: false, message: "Email is already registered" });
    }

    //password validation
    if (!data.password || data.password.trim().length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "Password is required" });
    }

    if (!/^.{8,15}$/.test(data.password)) {
      return res.status(400).send({
        status: false,
        message: "Password length should be in between 8 to 15",
      });
    }

    //decrypted password create using "bcrypt package"
    const saltRounds = 10;
    const encryptedPassword = await bcrypt.hash(data.password, saltRounds);
    data["password"] = encryptedPassword;

    //user type check
    if (data.accountType) {
      if (!data.accountType || data.accountType.trim().length == 0) {
        return res
          .status(400)
          .send({ status: false, message: "AccountType field is required" });
      }
      const arr: string[] = ["User", "Admin"];

      if (!arr.includes(data.accountType)) {
        return res.status(400).send({
          status: false,
          message: "Account Type sould be either User or Admin",
        });
      }
    }

    let saveData = await signUpModel.create(data);
    {
      res
        .status(201)
        .send({ status: true, message: "Success", data: saveData });
    }
  } catch (err) {
    res
      .status(500)
      .send({ status: false, message: "Error", error: err.message });
  }
};


//login user Api
const loginRequest = async function (
  req: express.Request,
  res: express.Response
) {
  try {
    let data = req.body;
    let { email, password } = data;

    //validation
    if (Object.keys(data).length == 0) {
      return res.status(400).send({
        status: false,
        message: "Please provide your Login details",
      });
    }

    //email and password validation
    if (!email || email.trim().length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide Email details" });
    }

    if (!password || password.trim().length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide Password details" });
    }

    if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)) {
      return res.status(400).send({
        status: false,
        message: "Email should be valid email address",
      });
    }

    if (!/^.{8,15}$/.test(password)) {
      return res.status(400).send({
        status: false,
        message: "Incorrect password",
      });
    }

    //login credentionals
    let user = await signUpModel.findOne({ email: email });
    if (!user) {
      return res.status(401).send({
        status: false,
        message: "Invalid Credentials",
      });
    }

    const decrypPassword = user.password;
    const pass = await bcrypt.compare(password, decrypPassword);
    if (!pass) {
      return res
        .status(400)
        .send({ status: false, message: "Password Incorrect" });
    }

    // use a different secret key for admin and user tokens
    const role = user.accountType;

    let tokenSecret: string;
    if (role === "Admin") {
      tokenSecret = "Admin5^8LydB!mso^o!Yx";
    } else {
      tokenSecret = "5^8LydB!mso^o!YxUser";
    }

    //token creation and login
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        project: "codervillage=Management@backend-apis",
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 10 * 60 * 60,
      },
      tokenSecret
    );

    {
      res.status(201).send({ status: true, data: token });
    }
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = { signUpRequest, loginRequest };
