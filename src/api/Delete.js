import { apiModes, BuildUrl } from "./ApiProperties";

async function DELETE(apiMode, authorization=false, payload) {
    var url = BuildUrl(apiMode);
    var options = {
        method: 'DELETE',
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
    console.log("----------DELETE OPTIONS----------");
    console.log(options);
    var response = await fetch(url, options);
    return response;
}

export { DELETE };