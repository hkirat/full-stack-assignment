# Express Authentication and Question Management API like LeetCode

This is a simple Express API for user authentication and question management. It allows users to sign up, log in, view questions, submit solutions, and manage questions (only accessible to admins).

## Setup

1. Clone the repository: `git clone https://github.com/PratyushSawan/full-stack-assignment`
2. Navigate to the project directory: `cd full-stack-assignment`
3. Install dependencies: `yarn` OR `npm install`


## Usage

1. Start the development server: `yarn run dev`
2. Access the API at `http://localhost:3001`


## Endpoints

### Sign Up

Create a new user account.

**POST** `/signup`

--
### Sign In

Log into your account.

**POST** `/login`

--

### GET Questions `(auth Required)`
Get a list of questions

**GET** `/questions`

--
### Add a Submission `(auth Required)`
Add a submission in a question

**POST** `/submissions`

--

### Get Your Submissions `(auth Required)`
Add a submission in a question

**GET** `/submissions`

--

### Manage Questions `(ADMIN auth Required)`
Add a submission in a question

**POST** `/questions`