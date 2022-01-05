import { apiRoute, BuildUrl, apiModes } from "./ApiProperties";

async function GET(mode, authorization=false, payload=null, httpGetParams=null) {
    const options = getOptions(authorization, payload);
    var response = null;
    const url = BuildUrl(mode);
    console.log(url);

    if(!httpGetParams) {
        response = await fetch(url, options);
    }
    else {
        //if there is a string passed as endpoint in httpGetParams
        console.log(`${url}${httpGetParams}`);
        console.log(options);
        response = await fetch(`${url}${httpGetParams}`, options);
    }
    return response;
}

function getOptions(authorization, payload) {
    const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    if(authorization) {
        options.headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${payload.accessToken}`
        }
    }
    return options
}

export { GET };