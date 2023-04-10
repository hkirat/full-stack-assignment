## Fullstack API documentation

The REST API to the example app is described below.

#### Base url : http://localhost:3001/api/v1

---

#### Register

`POST  /auth/signup`

#### Body

        {
            "email": "ankit@gmail.com",
            "password": "1234"
        }

#### Response - Success

        {
            "status": "Pass",
            "code": 200,
            "data": {
                "id": "eb6962ee-ba91-4572-b2b3-c0f9dc4dcb5c",
                "email": "ramesh@gmail.com",
                "isAdmin": false
            },
            "message": "User successfully signed"
        }

#### Response - Email Already in use

        {
            "status": "Fail",
            "code": 400,
            "message": "Email already in use"
        }

---

#### Login

`POST  /auth/login`

#### Body

        {
            "email": "ramesh@gmail.com",
            "password": "1234"
        }

#### Response - Success

        {
            "status": "Pass",
            "code": 200,
            "data": {
                "user": {
                    "id": "eb6962ee-ba91-4572-b2b3-c0f9dc4dcb5c",
                    "email": "ramesh@gmail.com",
                    "isAdmin": false
                },
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiZWI2OTYyZWUtYmE5MS00NTcyLWIyYjMtYzBmOWRjNGRjYjVjIiwiZW1haWwiOiJyYW1lc2hAZ21haWwuY29tIiwiaXNBZG1pbiI6ZmFsc2V9LCJpYXQiOjE2ODExNDYwNzEsImV4cCI6MTY4MTE0OTY3MX0.L73EV3qfWBZ1Meb841cTPFAwFPrLdfwH_3H2mPVCCrg"
            },
            "message": "User successfully logged in"
        }

#### Response - Invalid credentials

        {
            "status": "Fail",
            "code": 400,
            "message": "Email or password is not correct"
        }

---

#### User List

`GET  /user`

#### Response - Success

        {
            "status": "Pass",
            "code": 200,
            "data": [
                {
                    "id": "eb6962ee-ba91-4572-b2b3-c0f9dc4dcb5c",
                    "email": "ankit@gmail.com",
                    "isAdmin": false
                }
            ],
            "message": "List of users"
        }

#### Response - Empty User List

        {
            "status": "Pass",
            "code": 200,
            "data": [],
            "message": "List of users"
        }

---

#### User Statistics

`GET  /user/statistics`

#### Response - Success

        {
            "status": "Pass",
            "code": 200,
            "data": {
                "totalQuestionAttempted": 5,
                "pass": {
                    "count": 2,
                    "percent": 40
                },
                "fail": {
                    "count": 3,
                    "percent": 60
                }
            },
            "message": "User Statistics"
        }

---

#### Question List

`GET  /question`

#### Response - Success

       {
            "status": "Pass",
            "code": 200,
            "data": [
                {
                    "id": "391aeaee-2caf-4cae-be5f-20499f14ef03",
                    "title": "Two states",
                    "description": "Given an array , return the maximum of the array?",
                    "testCases": [
                        {
                            "input": "[1,2,3,4,5]",
                            "output": "5"
                        }
                    ],
                    "creator": {
                        "id": "885ee49a-3416-49bf-ae26-417f5c7206de",
                        "email": "rahul@gmail.com"
                    }
                }
            ],
            "message": "List of questions"
        }

#### Response - Empty Question List

       {
            "status": "Pass",
            "code": 200,
            "data": [],
            "message": "List of questions"
        }

---

#### Add Question

`POST  /question`

#### Body

      {
            "title": "Two states",
            "description": "Given an array , return the maximum of the array?",
            "testCases": [
                {
                    "input": "[1,2,3,4,5]",
                    "output": "5"
                }
            ]
        }

#### Response - Success

      {
            "status": "Pass",
            "code": 200,
            "data": {
                "id": "391aeaee-2caf-4cae-be5f-20499f14ef03",
                "title": "Two states",
                "description": "Given an array , return the maximum of the array?",
                "testCases": [
                    {
                        "input": "[1,2,3,4,5]",
                        "output": "5"
                    }
                ],
                "creator": {
                    "id": "885ee49a-3416-49bf-ae26-417f5c7206de",
                    "email": "rahul@gmail.com"
                }
            },
            "message": "Question added successfully"
        }

#### Response - When Non Admin Tried to add new question

        {
            "status": "Fail",
            "code": 400,
            "message": "Only admin can access this route"
        }

---

#### Add Question

`POST  /question`

#### Body

      {
            "title": "Two states",
            "description": "Given an array , return the maximum of the array?",
            "testCases": [
                {
                    "input": "[1,2,3,4,5]",
                    "output": "5"
                }
            ]
        }

#### Response - Success

      {
            "status": "Pass",
            "code": 200,
            "data": {
                "id": "391aeaee-2caf-4cae-be5f-20499f14ef03",
                "title": "Two states",
                "description": "Given an array , return the maximum of the array?",
                "testCases": [
                    {
                        "input": "[1,2,3,4,5]",
                        "output": "5"
                    }
                ],
                "creator": {
                    "id": "885ee49a-3416-49bf-ae26-417f5c7206de",
                    "email": "rahul@gmail.com"
                }
            },
            "message": "Question added successfully"
        }

#### Response - When Non Admin Tried to add new question

        {
            "status": "Fail",
            "code": 400,
            "message": "Only admin can access this route"
        }

---

#### Add Submission

`POST  /submission/:questionId`

#### Body

     {
        "status": "Pass",
        "code": 200,
        "data": {
            "id": "cdfb098b-f2a4-4bce-9cff-c4caae63ed45",
            "code": "function StringStream(string) { this.pos = 0; this.string = string;}",
            "status": "Rejected",
            "question": {
                "id": "391aeaee-2caf-4cae-be5f-20499f14ef03",
                "title": "Two states",
                "description": "Given an array , return the maximum of the array?"
            },
            "submittedBy": {
                "id": "7d5830ca-75a9-47b5-87e1-8e7c88cc22f9",
                "email": "ankit@gmail.com"
            }
        },
        "message": "Successfully submitted"
    }

#### Response - Success

      {
            "status": "Pass",
            "code": 200,
            "data": {
                "id": "391aeaee-2caf-4cae-be5f-20499f14ef03",
                "title": "Two states",
                "description": "Given an array , return the maximum of the array?",
                "testCases": [
                    {
                        "input": "[1,2,3,4,5]",
                        "output": "5"
                    }
                ],
                "creator": {
                    "id": "885ee49a-3416-49bf-ae26-417f5c7206de",
                    "email": "rahul@gmail.com"
                }
            },
            "message": "Question added successfully"
        }

---

#### Submission List

`GET  /submission`

#### Response - Success

      {
        "status": "Pass",
        "code": 200,
        "data": [
            {
                "id": "cdfb098b-f2a4-4bce-9cff-c4caae63ed45",
                "code": "function StringStream(string) { this.pos = 0; this.string = string;}",
                "status": "Rejected",
                "question": {
                    "id": "391aeaee-2caf-4cae-be5f-20499f14ef03",
                    "title": "Two states",
                    "description": "Given an array , return the maximum of the array?"
                },
                "submittedBy": {
                    "id": "7d5830ca-75a9-47b5-87e1-8e7c88cc22f9",
                    "email": "ankit@gmail.com"
                }
            }
        ],
        "message": "List of submissions"
    }
