const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

JWT_SECRET = process.env.JWT_SECRET;
JWT_EXPIRATION = process.env.JWT_EXPIRATION;

exports.signUpUser =(req, res) => {
    const { email, password, user_type } = req.body;
    const user_id = global.USERS.length + 1;
  
    if(user_type!='admin' && user_type!='user'){
      return res.status(400).json({ message: 'Invalid user type' });
    }
  
    const userExist = global.USERS.find(user => user.email === email);
  
    if(userExist){
      return res.status(409).json({ message: 'User already exist' });
    }
    
    //hashing the password before storing it in the array
    //if you don't want to add hashing, remove the below line
    let hashedPassword = bcrypt.hashSync(password, 10);

    const user = { user_id, email, password:hashedPassword, user_type };
    global.USERS.push(user);
    console.log(global.USERS);
  
    //we may or may not need to login the user after signup
    //here I'm directly logging in the user after signup
    //if you don't want to login the user after signup, remove the below code
    const token = jwt.sign({ user_id, user_type }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
    res.status(201).json({ user, token });
}

exports.loginUser = (req, res) => {
    const { email, password } = req.body;
    
    // Find user by email and password
    const user = global.USERS.find(user => user.email === email);
    
    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if password is correct
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Sign JWT token
    const token = jwt.sign({ user_id: user.user_id, user_type: user.user_type }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

    res.json({ user, token });
}