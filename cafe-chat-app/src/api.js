import { SERVER_URL } from "./app.config";

export async function API_GET(url) {
    const response = await fetch(
        SERVER_URL + "api/" + url,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
                'Content-Type': 'application/json',
                Authorization: "Bearer " + localStorage.getItem("access_token")
            }
        }
    );

    let json = await response.json();

    return json;
}

export async function API_POST(url, data) {
    const response = await fetch(
        SERVER_URL + "api/" + url,
        {
            method: "POST",
            headers: {
                Accept: "application/json",
                'Content-Type': 'application/json',
                Authorization: "Bearer " + localStorage.getItem("access_token")
            },
            body: JSON.stringify(data)
        }
    );

    let json = await response.json();

    return json;
}