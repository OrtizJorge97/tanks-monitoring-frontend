import { apiModes, BuildUrl } from "./ApiProperties";

async function POST(apiMode, authorization=false, payload) {
    var url = BuildUrl(apiMode);
    var options = {
        method: 'POST',
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
    console.log("url:  " + url);
    console.log(payload);
    var response = await fetch(url, options);
    return response;
}

export { POST };