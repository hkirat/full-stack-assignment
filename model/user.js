class UserModel {
  constructor(email, password, isAdmin) {
    this.email = email;
    this.password = password;
    this.isAdmin = isAdmin;
    this.token = "";
  }
}

module.exports = UserModel;
