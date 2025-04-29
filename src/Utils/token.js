import {jwtDecode} from "jwt-decode";

function getToken() {
    return localStorage.getItem("access_token");
}

function saveToken(token) {
    localStorage.setItem("access_token", token);
}

function destroyToken() {
    localStorage.removeItem("access_token");
}

function decodedToken() {
    try {
        return jwtDecode(getToken())
    } catch (e) {
        return null;
    }
}

function isTokenExpired(token) {
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime;
    } catch (e) {
        return true;
    }

}

export {getToken, saveToken, destroyToken, isTokenExpired, decodedToken};