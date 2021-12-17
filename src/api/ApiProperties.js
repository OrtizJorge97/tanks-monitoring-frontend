var timeOut = 3000;
const apiRoute = "http://192.168.100.21:5000";
const socketApiRoute = "http://192.168.100.21:5000/private";
const apiModes = {
    LOGIN: "login",
    SIGNUP: "signup",
    GETUSER: "getuser"
};

function BuildUrl(mode) {
    let urlResult = "";
    switch(mode) {
        case apiModes.LOGIN:
            urlResult = `${apiRoute}/auth/login`;
            break;
        case apiModes.SIGNUP:
            urlResult = `${apiRoute}/auth/add-user`;
            break;
        case apiModes.GETUSER:
            urlResult = `${apiRoute}/auth/get-user`;
            break;
        default:
            urlResult = ""
    }

    console.log(urlResult);
    return urlResult;
}

export {
    apiModes, 
    BuildUrl, 
    apiRoute, 
    socketApiRoute
};