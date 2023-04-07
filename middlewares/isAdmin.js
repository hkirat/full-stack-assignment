const ADMIN_USERS = ["johndoe@email.com"];

const isAdmin = (req, res, next) => {
  //We are assuming that we will get the authenticated users email in the body.
  const { email } = req.body;
  const isAdmin = ADMIN_USERS.includes(email);
  if (!isAdmin) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }
  next();
};

module.exports = isAdmin;
