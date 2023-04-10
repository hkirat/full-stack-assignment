const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

function ValidateEmail(mail) {
  if (mail.match(mailformat)) {
    return true;
  }
  return false;
}

module.exports = { ValidateEmail };
