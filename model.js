const mongoose = require('mongoose');
const clientModel=require('./models/User/client');
const tokenModel = require('./models/User/token_model');
const userModel = require('./models/User/user_info_model');
const bcrypt = require("bcrypt");
var express = require("express")

var app = express()
app.use(express.json()) 
app.use(express.urlencoded({ extended: true }));

var getAccessToken = async function(token) {
    try {
     
        console.log("Inside Token")
        const foundToken = await tokenModel.findOne({ accessToken: token }).lean().exec();
        
        console.log("foundToken", foundToken)
        if (!foundToken) {
            console.error('Access Token not found');
            return null;
        }
        return foundToken;
    } catch (err) {
        console.error('Error finding Access Token:', err);
        return null;
    }
}

var getClient = async function(clientID, clientSecret) {
    try {
        console.log("Inside Client")
        const foundClient = await clientModel.findOne({ clientID: clientID, clientSecret: clientSecret }).lean().exec();
        console.log("foundClientid", foundClient.clientID)
        if (!foundClient) {
            console.error('Client not found Prince');
            return null;
        }
        console.log("foundClient", foundClient)
        return foundClient;
    } catch (err) {
        console.error('Error finding Client:', err);
        return null;
    }
}


var saveToken = async function (token, client, user) {
    try {
        console.log("Inside Save Token: ", token)
        token.client = {
            id: client.clientID
        };
        console.log("token.client", client)
        token.user = {
            username: user.email
        };
        console.log("token.user", user)

        // Check if token already exists for the user
        const existingToken = await tokenModel.findOne({ 'user.username': user.email }).lean().exec();

        if(!existingToken) {
            console.log('Access Token Not Found:', existingToken);
            // return existingToken;
        }
        else if(existingToken.accessTokenExpiresAt > Date.now()) {
            console.log('Access Token Not Expired:', existingToken);
            // return new tokenModel(token);
            return existingToken;
        }
        else{const deleteToken = await tokenModel.deleteOne({ 'user.username': user.email }).lean().exec();
            console.log('Access Token Deleted:', deleteToken);
        }         

        const tokenInstance = new tokenModel(token);
        console.log("tokenInstance", tokenInstance)
        if(!tokenInstance) {
            console.error('Access Token not found');
            return null;
        }
        
        const savedToken = await tokenInstance.save();
        console.log("savedToken", savedToken)
        return savedToken;
    } catch (err) {
        console.error('Error saving token:', err);
        return null;
    }
}



var getUser = async function (email, password) {
    // console.log("Inside getUser", email, password)
    try {
        console.log("Inside getUser")
        
        const foundUser = await userModel.findOne({email: email.toLowerCase()}).lean().exec();
        console.log("foundUser", foundUser)
        if (!foundUser) {
            console.error('User not found');
            return null;
        }
        const getpassword = await bcrypt.compare(password, foundUser.password);
        if (!getpassword) {
            console.error('User not found');

            return null;
        }
        return foundUser;
    } catch (err) {
        console.error('Error finding User:', err);
        return null;
    }
}

app.use(express.urlencoded({ extended: true }));

var getUserFromClient = async function (clientId, clientSecret) {
    // console.log("Inside getUserFromClient", clientId, clientSecret)
    try {
        console.log("Inside getUserFromClient")
        const foundClient = await clientModel.findOne({ clientId: clientId, clientSecret: clientSecret, grants: 'client_credentials'}).lean().exec();
        if (!foundClient) {
            console.error('Client not found');
            return null;
        }
        return foundClient;
    } catch (err) {
        console.error('Error finding Client:', err);
        return null;
    }
}

var getRefreshToken = async function(refreshToken) {
    try {
        console.log("Inside Refresh Token: ", refreshToken)
        const foundToken = await tokenModel.findOne({ refreshToken: refreshToken }).lean().exec();
        if (!foundToken) {
            console.error('Refresh Token not found');
            return null;
        }
        return foundToken;
    } catch (err) {
        console.error('Error finding Refresh Token:', err);
        return null;
    }
}
var revokeToken = async function(token) {
    try {
        console.log("Inside Revoke Token: ", token)
        const foundToken = await tokenModel.deleteOne({ refreshToken: token }).lean().exec();
        if (!foundToken) {
            console.error('Token not found');
            return null;
        }
        return foundToken;
    }
     catch (err) {
        console.error('Error finding Token:', err);
        return null;
    }
}

module.exports={
    getAccessToken: getAccessToken,
	getClient: getClient,
	saveToken: saveToken,
	getUser: getUser,
	getUserFromClient: getUserFromClient,
	getRefreshToken: getRefreshToken,
	revokeToken: revokeToken
}