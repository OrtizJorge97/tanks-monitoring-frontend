import { apiModes, BuildUrl } from "./ApiProperties";

async function POST(apiMode, jsonObject) {
    var url = BuildUrl(apiMode);
    var options = {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonObject)
    };
    var response = await fetch(url, options);
    return response;
}

export { POST };