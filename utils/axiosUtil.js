import axios from "axios"
import Cookies from "js-cookie"

export default async function AxiosHelper (url, method, headers, data) {
    const authToken = Cookies.get('user_auth_token');
    if(!headers) headers = {};
    headers['Authorization'] = authToken;

    return await axios(url, {
        method: method || 'POST',
        headers: headers,
        data: data
    })
}