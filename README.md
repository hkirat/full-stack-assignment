# FullStack Assignment

## Usage

1. Start the server: `npm start`
2. Open your browser and navigate to `http://localhost:3001`
## Folder Structure

The project follows a modular architecture, where the code is organized into separate folders for better maintainability and scalability. Here's a brief description of each folder:

- `controllers`: Contains the controllers for handling incoming requests, performing necessary actions, and sending the response back.
- `middleware`: Contains the middleware functions to handle common tasks such as authentication, input validation, error handling, etc.
- `models`: Contains the models for the data store used in the application.
- `routes`: Contains the route handlers for mapping HTTP requests to the corresponding controller functions.

## API Endpoints

### Authentication

- `/signup` (POST): Allows users to sign up for the platform
- `/login` (POST): Allows registered users to login to the platform

### Questions

- `/questions` (GET): Returns a list of all available questions

### Submissions

- `/submissions/:questionId` (GET): Returns a list of submissions for a particular question
- `/submissions/:questionId` (POST): Allows logged in users to submit a solution for a particular question

## Object Types

### Question Type

| Field       | Type   | Description                          |
| ----------- | ------ | ------------------------------------ |
| id          | Number | The unique ID of the question        |
| title       | String | The title of the question            |
| description | String | The description of the question      |
| testCases   | Array  | An array of test cases for the question |

The `testCases` array contains objects with the following fields:

| Field  | Type   | Description                     |
| ------ | ------ | ------------------------------- |
| input  | String | The input for the test case     |
| output | String | The expected output for the test case |

```json
{
  "id": 1,
  "title": "Two states",
  "description": "Given an array, return the maximum of the array?",
  "testCases": [
    {
      "input": "[1,2,3,4,5]",
      "output": "5"
    },
    {
      "input": "[-10,-5,0,5,10]",
      "output": "10"
    },
    {
      "input": "[3,7,2,8,4]",
      "output": "8"
    }
  ]
}
```

### Submission Type

| Field        | Type   | Description                                    |
| ------------ | ------ | ---------------------------------------------- |
| questionID   | String | The ID of the question the submission relates to |
| submissions  | Array  | An array of submissions for the question        |

The `submissions` array contains objects with the following fields:

| Field   | Type   | Description                        |
| ------- | ------ | ---------------------------------- |
| userId  | String | The ID of the user making the submission |
| code    | String | The code for the submission        |
| status  | String | The status of the submission       |

```json
{
  "questionID": "1",
  "submissions": [
    {
      "userId": "123",
      "code": "console.log('hello world')",
      "status": "accept"
    },
    {
      "userId": "456",
      "code": "console.log('hello')",
      "status": "reject"
    }
  ]
}
```