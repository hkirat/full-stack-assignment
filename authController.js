const { randomUUID } = require("crypto")

// TEST DATA
const USERS = [
    { email: "random@gmail.com", password: "123456" },
    { email: "random1@gmail.com", password: "123456" },
    { email: "random2@gmail.com", password: "123456" }
];


function signup(req, res) {
    // Add logic to decode body
    // body should have email and password
    const { email, password } = req.body;

    //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
    const emailExists = USERS.some(user => user.email === email);
    if (emailExists) {
        return res.json({
            success: false,
            message: 'Email already exists',
        })
    }

    // add user info
    USERS.push({ email, password })

    // return back 200 status code to the client
    return res.json({ success: true, message: 'Account Created' })
}

function login(req, res) {
    // Add logic to decode body
    // body should have email and password
    const { email, password } = req.body;

    // Check if the user with the given email exists in the USERS array
    // Also ensure that the password is the same
    const userExists = USERS.find(user => user.email === email);
    if (userExists === undefined) {
        return res.json({
            success: false,
            message: 'No Accound found.',
        })
    }

    if (userExists.password !== password) {
        return res.status(401).json({
            success: false,
            message: 'Password is incorrect',
        })
    }

    const token = randomUUID()
    return res.status(200).json({
        success: true,
        message: 'Login Success',
        token
    })

    // If the password is the same, return back 200 status code to the client
    // Also send back a token (any random string will do for now)
    // If the password is not the same, return back 401 status code to the client
}

module.exports = {
    signup,
    login,
}