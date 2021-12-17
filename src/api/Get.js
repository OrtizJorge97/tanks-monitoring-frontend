import { apiRoute, BuildUrl, apiModes } from "./ApiProperties";

async function GET(mode, authorization=false, payload=null) {
    const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const url = BuildUrl(mode);
    console.log(url);
    if(authorization) {
        options.headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${payload.accessToken}`
        }
    }

    const response = await fetch(url, options);
    return response;
}

export { GET };