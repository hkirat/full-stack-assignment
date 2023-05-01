This project is implementation of below features as per assignment 1

#Requirement
Node.js
Exoress
Dotenv: To add all the secret credentials into .env files without exposing it in codebase
body-parser: To convert req.body into json
jsonwebtoken: To create authentication token to validate user

#Setup

1. Clone the repository using the following command:

git clone https://github.com/bshreyasharma007/full-stack-assignment.git

2. Navigate to the project directory using the following command:

cd full-stack-assignment

3. Install the required dependencies using the following command:

npm install

4. Create a .env file in the project directory and add the following variables:

JWT_SECRET_KEY= <desired-key>
PORT=<desired-port>

#Usage

1. To start the server, run the following command:

npm start

2. To sign up a new user, send a POST request to /signUp with the following payload:
   {
   "userid": 12,
   "email": "shreya12345@gmailw.com.in",
   "password": "password",
   "admin": false
   }

[OR]
//If user is admin

{
"userid": 1,
"email": "shreyaadmin@gmailw.com.in",
"password": "password",
"admin": true
}

3. To log in a user, send a POST request to /login with the following payload:

{
"email": "shreya12345@gmailw.com.in",
"password": "password"
}

Output you will get a sucess message and a token--> Copy the token as the same token will be used when we will be trying to do operations like submit solution or create a problem where authorization of users is required.

4. You can use postman and add a parameter 'Authorization' and it's value as 'Bearer <token-generated-after-login>'

4.a View questions [ Only logged in users can view the questions ]

4.b Create problem [ Only logged in user who is admin can create problem ]

{
"message": "New problem added successfully",
"problem": {
"problemid": 5,
"title": "addition",
"description": "Write a logic to add two number",
"testcase": [
{
"input": "2 3",
"output": 5
},
{
"input": "4 5",
"output": 9
}
]
}
}

4.c Submit solution [ Only logged in user can submit solution ]

{
"problemid": 1,
"submission": "fun(a, b){ return a+b;}"
}

4.d View Submit solution [ Only logged in user can view their own submission ]

{
"userid": 1,
"problemid": 1
}

5. Once user logs out then the cookie is removed from the token
