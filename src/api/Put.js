import { apiModes, BuildUrl } from "./ApiProperties";

async function PUT(apiMode, authorization=false, payload) {
    var url = BuildUrl(apiMode);
    var options = {
        method: 'PUT',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    };
    if(authorization) {
        options.headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${payload.accessToken}`
        };
    }
    console.log("----------PUT OPTIONS----------");
    console.log(options);
    console.log(url);
    var response = await fetch(url, options);
    return response;
}

export { PUT };