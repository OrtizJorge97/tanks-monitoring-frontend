import {useEffect, useState} from "react";
import { POST } from "../api/Post";
import { GET } from "../api/Get";
import { apiModes } from "../api/ApiProperties";

function buildHttpGetParams(apiMode, payload) {
    let httpGetParams = "";
    switch(apiMode) {
        case apiModes.FETCHTANK:
            httpGetParams = `?tankId=${payload.tankId}`;
            break;
        default:
            httpGetParams = null;
    }

    return httpGetParams;
}


export default function useFetch(initialValue) {
    //Make fetch call
    //check if msg is Token has expired. if so then navigate to login page.
    //
    const [value, setValue] = useState(initialValue);

    const doFetch = async(httpMethod, apiMode, authorization, payload) => {
        let response = null;
        if(httpMethod === "POST") {
            response = await POST(apiMode, authorization, payload);
        }
        if(httpMethod === "GET") {
            const httpGetParams = buildHttpGetParams(apiMode, payload);
            response = await GET(apiMode, authorization, payload, httpGetParams);
        }

        return await response.json();
    }

    return [value, setValue, doFetch];
}