var timeOut = 3000;
const apiRoute = "http://192.168.100.21:5000";
const socketApiRoute = "http://192.168.100.21:5000/private";
const apiModes = {
	LOGIN: "login",
	SIGNUP: "signup",
	GETUSER: "getuser",
	FETCHTANKS: "fetchtanks",
	ADDTANK: "addtank",
	FETCHTANK: "fetchtank",
    DELETETANK: "deletetank"
};

function BuildUrl(mode) {
	let urlResult = "";
	switch (mode) {
		case apiModes.LOGIN:
			urlResult = `${apiRoute}/auth/login`;
			break;
		case apiModes.SIGNUP:
			urlResult = `${apiRoute}/auth/add-user`;
			break;
		case apiModes.GETUSER:
			urlResult = `${apiRoute}/auth/get-user`;
			break;
		case apiModes.FETCHTANKS:
			urlResult = `${apiRoute}/api/fetch-tanks`;
			break;
		case apiModes.FETCHTANK:
			urlResult = `${apiRoute}/api/fetch-tank`;
			break;
		case apiModes.ADDTANK:
			urlResult = `${apiRoute}/api/add-tank`;
			break;
		case apiModes.UPDATETANK:
			urlResult = `${apiRoute}/api/update-tank`;
			break;
		case apiModes.DELETETANK:
			urlResult = `${apiRoute}/api/delete-tank`;
			break;
		default:
			urlResult = "";
	}

	console.log(urlResult);
	return urlResult;
}

export { apiModes, BuildUrl, apiRoute, socketApiRoute };
