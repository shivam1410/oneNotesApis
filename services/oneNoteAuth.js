const cred = require("../Cred/ms.cred");
const config = require("../config/ms.config");
const axios = require("axios");
const scope = "Notes.Create Notes.Read Notes.Read.All Notes.ReadWrite Notes.ReadWrite.All User.Read";
const querystring = require('querystring');
const fse = require("fs-extra");


function giveConsent(req,res){
    try{
        let url = "https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?"
        const options = {
            client_id: cred.clientID,
            response_type:"code",
            redirect_uri:config.redirectUri,
            response_mode:"query",
            scope:"offline_access " + scope,
            state:1,
            prompt:"consent"
        }
        url = url + querystring.stringify(options);

        return res.json({url})
    } catch(e){
        console.log(e, "CONSENT SCREEN ERROR")
        res.json({e})
    }
}

async function getAccessTokenByUsingCode(req,res){
    if(req.query.code){
        console.log(req.query)
        const data =  querystring.stringify({
            grant_type: "authorization_code",
            code: req.query.code,
            client_secret: cred.clientSecret,
            client_id: cred.clientID,
            scope,
            redirect_uri: config.redirectUri
        })
        const headers= {
            "Content-Type": "application/x-www-form-urlencoded"
        }

        axios({
            method: "post",
            url: config.token_URL,
            headers,
            data,
        })
        .then(async tokenObject=>{
            console.log(tokenObject.data);
            console.log("writing refresh token to json")
            tokenObject.data.startTime = +Date.now();
            await fse.writeJSONSync("./Cred/token_Object.json", tokenObject.data)
            await fse.writeJSONSync("./Cred/refresh_token.json", tokenObject.data.refresh_token);
            return res.json("Success")
        })
        .catch(e=>{
            console.log("access token by code error", e)
            return res.json("Failure")
        })
    } else {
        console.log(req.query)
        return  res.json("no code found")
    }
}

async function getAccessTokenByRefreshToken(){
    const refresh_token = await fse.readJson("./Cred/refresh_token.json");
    
    const data =  querystring.stringify({
        grant_type: "refresh_token",
        client_secret: cred.clientSecret,
        client_id: cred.clientID,
        scope,
        redirect_uri: config.redirectUri,
        refresh_token
    })
    const headers= {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    axios({
        method: "post",
        url: config.token_URL,
        headers,
        data,
    })
    .then(async tokenObject =>{
        tokenObject.data.startTime = +Date.now();
        console.log(tokenObject)
        fse.writeJSONSync("./Cred/token_Object.json", tokenObject.data)
    })
    .catch(e=>{
        console.log("access token by refresh token error")
    })
}

async function authenticate(req,res,next){
    const tokenObject = await fse.readJsonSync('./Cred/token_Object.json');
    if(tokenObject.access_token){
        // if token is going to expire in 500ms, then call refresh token,
        // let tokenObject.expires_in = 500ms
        // other wise its okay,
        // then call next
        // if control reach to next function, before the response of refresh token api response, it will have old token, that is already valid,
        // and if it took more time to reach then 500ms, then at that time it will have new token
        // x = response time of refresh, y time when next() needs token, lets start with 0, and token is going to expire in 500ms
        // if(x<=50000)then [y can be anything], if(x>50000)then [y<50000 or y>x]
        const currentTime = +Date.now();
        // if((tokenObject.expires_in)*1000 -(currentTime - tokenObject.startTime) <= 50000){
        if((currentTime - tokenObject.startTime) <= (tokenObject.expires_in)*1000 ){
            console.log((currentTime - tokenObject.startTime), (tokenObject.expires_in)*1000);
            console.log("token is going to expire in", tokenObject.expires_in, currentTime,  tokenObject.startTime);
            getAccessTokenByRefreshToken();
            next();
        } else{
            console.log("token still valid")
            next();
        }
    } else {
        // get token by code
        return;
    }
}


module.exports = {
    getAccessTokenByUsingCode,
    getAccessTokenByRefreshToken,
    giveConsent,
    authenticate,
}