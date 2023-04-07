const ADMIN_USERS = ["test@test.com"]

const isAdmin = (req, res, next) => {
    //For now i am just assuming that i will the authenticated users in body and info like email is available after the token is authenticated in some different middleware  
    const {email} = req.body;
    const isAdmin = ADMIN_USERS.includes(email);
    if (!isAdmin) {
      return res.status(401).json({status:"error", message: "Unauthorized"});
    }
    next();
};

module.exports = isAdmin;
