function validateSignUP(){
    let username = document.getElementById("username").value;
    let password = document.getElementById("pass").value;
    let confirmPassword = document.getElementById("cpass").value;
    console.log(username);
    console.log(password);
    console.log(confirmPassword);
    if(username === "" || password === "" || confirmPassword ===""){
        return false;
    }
    
    if(confirmPassword != password){
        alert("confirm Password and Password should be same");
        return false;
    }
    else {
        return true;
    }
}

