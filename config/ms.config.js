const cred = require("../Cred/ms.cred")

module.exports = {
    consent_URL: `https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?`,
    direct_token_URL: `https://login.microsoftonline.com/consumers/oauth2/v2.0/token?`,
    redirectUri: "http://localhost:8000/auth/code",
    token_URL: `https://login.microsoftonline.com/consumers/oauth2/v2.0/token?`,
    graph_url: `https://graph.microsoft.com/v1.0/`,
    base_URL: "https://graph.microsoft.com/v1.0/me/onenote/"
}