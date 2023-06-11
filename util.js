//Password should be atleast 8 characters long and should only contain alpha numeric characters
function passwordIsValid(password){
    const regex = /^[a-zA-Z0-9]{8,}$/;
    return regex.test(password);
}

module.exports = {passwordIsValid}