var errors = {
    emailError: "",
    passwordError: ""
};

function isValidEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!re.test(String(email).toLowerCase())) {
        errors.emailError = "Invalid Email";
    }
    else {
        errors.emailError = "";
    }

    return errors.emailError;
}

function isValidPassword(password) {
    if(isFieldEmpty(password)) {
        errors.passwordError = "Invalid Password";
    } 
    else {
        errors.passwordError = "";
    }
    return errors.passwordError;
}

function isFieldEmpty (fieldText) {
    var text = fieldText.trim();
    if(text === '') {
        return true;
    }
    if(text === null) {
        return true;
    }
    if(text === undefined) {
        return true;
    }
    return false;
}

export {isValidEmail, isFieldEmpty, isValidPassword};

