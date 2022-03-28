var timeOut = 3000;
const apiRoute = "http://192.168.100.22:5000";
const socketApiRoute = "http://192.168.100.22:5000/private";
const apiModes = {
	LOGIN: "login",
	RESEND_CONFIRMATION_EMAIL: "resend_confirmation_email",
	SIGNUP: "signup",
	GETUSER: "getuser",
	FETCHTANKS: "fetchtanks",
	ADDTANK: "addtank",
	FETCHTANK: "fetchtank",
	DELETETANK: "deletetank",
	FETCHUSERS: "fetchusers",
	FETCHUSER: "fetchuser",
	UPDATEUSER: "updateuser",
	DELETEUSER: "deleteuser",
	FETCHHISTORIC: "fetch_historic"
};

function BuildUrl(mode) {
	let urlResult = "";
	console.log(mode);
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
		case apiModes.FETCHUSERS:
			urlResult = `${apiRoute}/api/fetch-users`;
			break;
		case apiModes.FETCHUSER:
			urlResult = `${apiRoute}/api/fetch-user`;
			break;
		case apiModes.UPDATEUSER:
			urlResult = `${apiRoute}/api/update-user`;
			break;
		case apiModes.DELETEUSER:
			urlResult = `${apiRoute}/api/delete-user`;
			break;
		case apiModes.FETCHHISTORIC:
			urlResult = `${apiRoute}/api/fetch-historic`;
			break;
		case apiModes.RESEND_CONFIRMATION_EMAIL:
			urlResult = `${apiRoute}/auth/resend-confirmation-email`;
			break;
		default:
			urlResult = "";
	}

	console.log(urlResult);
	return urlResult;
}

export { apiModes, BuildUrl, apiRoute, socketApiRoute };
