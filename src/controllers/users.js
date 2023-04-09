const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

JWT_SECRET = process.env.JWT_SECRET;
JWT_EXPIRATION = process.env.JWT_EXPIRATION;

exports.signUp = (req, res) => {
    const { email, password, userType } = req.body
    const userId = global.USERS.length + 1

    if (userType!=='admin' && userType!=="user") {
        return res.status(400).json({ message: 'Invalid UserType'})
    }

    const userExists = global.USERS.some(user => user.email === email)
    if (userExists) {
        return res.status(409).json({ message: 'User already exist' });
    }

    let hashedPassword = bcrypt.hashSync(password);
    const user = { userId, email, password:hashedPassword, userType}
    global.USERS.push(user)
    console.log(user)

    const token = jwt.sign({ userId, userType }, JWT_SECRET, { expiresIn: JWT_EXPIRATION })
    res.status(201).json({ user, token })
}

exports.login = (req, res) => {
    const { email, password } = req.body

    const user = global.USERS.find(user => user.email === email)

    if (!user) {
        return res.status(401).json({ message: 'Invalid email' })
    }

    if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: 'Invalid password' })
    }

    // Sign JWT token
    const token = jwt.sign({ user_id: user.user_id, user_type: user.user_type }, JWT_SECRET, { expiresIn: JWT_EXPIRATION })

    res.json({ user, token })
}