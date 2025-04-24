function getToken() {
  return localStorage.getItem("access_token");
}

function saveToken(token) {
  localStorage.setItem("access_token", token);
}

function destroyToken() {
  localStorage.removeItem("access_token");
}

export { getToken, saveToken, destroyToken };