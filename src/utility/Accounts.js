import { breadcrumbsClasses } from "@mui/material";

const roles = {
    OPERATOR: "Operator",
    ADMINISTRATOR: "Administrator",
    SUPERVISOR: "Supervisor"
};

const sideBarItems = {
    visualizationOptions: ['Visualization', 'Historic'],
    userOptions: ['Profile', 'Collaborators', 'Users'],
    tanksOptions: ['Tanks']
};

var errors = {
    emailError: "",
    passwordError: ""
};

function returnTanksOptions(userRole) {
    let tanksOptions = null;

    switch(userRole) {
        case roles.SUPERVISOR:
            tanksOptions = sideBarItems.tanksOptions
            break;
        case roles.ADMINISTRATOR:
            tanksOptions = sideBarItems.tanksOptions
            break;
        case roles.OPERATOR:
            tanksOptions = sideBarItems.tanksOptions;
            break;
        default:
            tanksOptions = null;
    }

    return tanksOptions;
}

function returnUserOptions(userRole) {
    let userOptions = null;

    switch(userRole) {
        case roles.SUPERVISOR:
            userOptions = sideBarItems.userOptions
            break;
        case roles.ADMINISTRATOR:
            userOptions = sideBarItems.userOptions
            break;
        case roles.OPERATOR:
            userOptions = sideBarItems.userOptions.slice(0, 2)
            break;
        default:
            userOptions = null;
    }

    return userOptions;
}

function returnVisualization(userRole) {
    let visualizationOptions = null;

    switch(userRole) {
        case roles.SUPERVISOR:
            visualizationOptions = sideBarItems.visualizationOptions
            break;
        case roles.ADMINISTRATOR:
            visualizationOptions = sideBarItems.visualizationOptions
            break;
        case roles.OPERATOR:
            visualizationOptions = sideBarItems.visualizationOptions
            break;
        default:
            visualizationOptions = null;
    }

    return visualizationOptions;
}

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

export {
    isValidEmail, 
    isFieldEmpty, 
    isValidPassword, 
    roles,  
    returnVisualization, 
    returnUserOptions, 
    returnTanksOptions
};

