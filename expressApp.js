const { port } = require("./env.json");
const express = require("express");
const passport = require("passport");
const routes = require("./src/api/routes");
const app = express();
/* 
    add middlewares
*/
app.use(express.json());
// ! not required for stateless applications
//stackoverflow.com/questions/46644366/what-is-passport-initialize-nodejs-express#:~:text=on%20this%20post.-,passport.,the%20application's%20request%2Dresponse%20cycle.
// app.use(passport.initialize());
https: app.use(routes);

console.log(port);
app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
