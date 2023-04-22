var USERS = [{
    "email": "email@email.com",
    "password": "12345",
    "role": "admin"
}];

const isNil = (data) => {
    return (data === '' || data === null || data === undefined)
}

const register = (req, res) => {
    // Add logic to decode body
    // body should have email and password
    const {
        email,
        password,
        role
    } = req.body;

    //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
    if (!isNil(email) && !isNil(password) && isNil(role)) {
        const isUserExists = USERS?.some(user => user?.email === email);
        if (!isUserExists) {
            USERS.push({
                email,
                password,
                role
            });
            // return back 200 status code to the client
            return res.status(200).send({
                message: "User Added Successfully!"
            });
        } else {
            // return back 200 status code to the client
            return res.status(200).send({
                message: "User Already Exists!"
            });
        }
    } else {
        return res.status(404).send({
            message: "Please fill in all the fields."
        });
    }
}

var rand = function () {
    return Math.random().toString(36).substr(2); // remove `0.`
};

var token = function () {
    return rand() + rand(); // to make it longer
};

token();


const login = (req, res) => {
    // Add logic to decode body
    // body should have email and password
    const {
        email,
        password
    } = req.body;

    // Check if the user with the given email exists in the USERS array
    const user = USERS?.find(user => user?.email === email);

    if (user) {
        // Also ensure that the password is the same
        if (user?.password === password) {
            // If the password is the same, return back 200 status code to the client
            // Also send back a token (any random string will do for now)
            const userToken = token()
            res.status(200).send({
                message: "Succesfully logged in",
                token: userToken
            })
        } else {
            // If the password is not the same, return back 401 status code to the client
            res.status(401).send({
                message: "Invalid password"
            })
        }
    } else {
        // If user doesn't exits
        res.status(403).send({
            message: "User doesn't exists"
        })
    }
}

module.exports = { register, login }