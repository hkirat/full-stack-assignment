# LeetCode Project

## Backend Requirement


### Models
- SignUp Model
```
{ 
    name: { mandatory}, 
    phone: {mandatory}, 
    email: {mandatory, valid email, unique},
    password: {mandatory}, 
    accountType: { mandatory, default:User} 
}
```
- Question Model
```
{ 
    questionName: {mandatory},
    isDeleted: {boolean, default: false} 
}
```

- Question Model
```
{ 
    answer: {mandatory},
    userId: {mandatory, refs to SignUp model}, 
    questionId: {mandatory, refs to Question model},
    deletedAt: {boolean, default: false} 
}
```
### After Cloning this repo/ Go to Server Folder and Run This Cmd
- Start project
```
  npm install

  npm run start
```

### SignUp APIs /User Or Admin

- Create a admin/user document from request body.

```
{
    "name":"bidyut kundu",
    "password":"asdf1234",
    "email":"bid32@gmail.com",
    "phone":7894561781,
    "accountType": "Admin"
}
```
  `Endpoint: BASE_URL/signup`



### Login APIs /User Or Admin
- If the credentials are incorrect return a suitable error message with a valid HTTP status code

- Login Details.

```
{
    
    "password":"asdf1234",
    "email":"user3@gmail.com"
    
}
```
  `Endpoint: BASE_URL/login`

### POST Question by Admin
- Return HTTP status 201 on a succesful question creation. Also return the question document. The response should be a JSON object. 

- Return HTTP status 400 for an invalid request with a response body

- Question Details.

```
{
    
    "questionName": "If you have two sorted
    arrays, how can you merge them and keep
    the resulting array sorted?"
    
}
```
  `Endpoint: BASE_URL/addquestions`

### GET /allQuestions
- Returns all Questions in the collection that aren't deleted
- Return the HTTP status 200 if any documents are found.

  `Endpoint: BASE_URL/allquestions`




### POST /answer
- Answer Details.

```
{
    
  "answer": "answer3",
  "userId": "642f3e0fe4ea242c91230da3",
  "questionId": "642f42c90a687e3bbf6267aa"
    
}
```
  `Endpoint: BASE_URL/submitted`


### GET /allAnswers
- Returns all answers in the collection that aren't deleted
- Return the HTTP status 200 if any documents are found.

  `Endpoint: BASE_URL/submittedanswer/:questionId`

## Response

## Collections
### SignUp
```yaml
{
  "status": true,
    "message": "Success",
    "data": {
        "name": "bidyut kundu",
        "phone": "7894561771",
        "email": "bid322@gmail.com",
        "password": "$2b$10$aqgd1wlELw5llprk9PC/DOEY8tALy8u9czJFqVTJjE/wRECSVYvkm",
        "accountType": "User",
        "_id": "642ff5197e8b4b98a1ab67eb",
        "createdAt": "2023-04-07T10:48:57.119Z",
        "updatedAt": "2023-04-07T10:48:57.119Z",
        "__v": 0
    }
}
```
### Question
```yaml
{
  "status": true,
    "message": "Success",
    "data": {
        "questionName": "If you have two sorted arrays, how can you merge them and keep the resulting array sorted?",
        "isDeleted": false,
        "_id": "642ff5827e8b4b98a1ab67ee",
        "createdAt": "2023-04-07T10:50:42.367Z",
        "updatedAt": "2023-04-07T10:50:42.367Z",
        "__v": 0
    }
}
```

### Answer
```yaml
{
  "status": true,
    "message": "Success",
    "data": {
        "answer": "answer3",
        "userId": "642f3e0fe4ea242c91230da3",
        "questionId": "642f42c90a687e3bbf6267aa",
        "isDeleted": false,
        "_id": "642fe344a058b5d2246f27dc",
        "createdAt": "2023-04-07T09:32:52.529Z",
        "updatedAt": "2023-04-07T09:32:52.529Z",
        "__v": 0
    }
}
```
