let jwt =  require('jsonwebtoken');

module.exports=(req, res, next) => {
    
    let token = req.headers['token-key'];
    // Verify Token
    jwt.verify(token, 'Secret@123', function(err, decoded) {
      if(err){
        res.status(401).send("User Unauthorized");
      }else {
          next();
      }
    });
}