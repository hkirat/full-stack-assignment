# This is a NodeJS Express Server for building Assignements Apis.

## You can create user with "role" on Postman by default the role is "user"
## Here is an example of that

### Creating a user with role "admin"
POST http://localhost:3001/signup HTTP/2.0
Authorization: token2

{
  "email": "test@email.com",
  "password": "test1234",
  "role": "admin"
}