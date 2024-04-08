var express = require('express'),
 bodyParser = require('body-parser'),
 mongoose = require('mongoose'),
 Oauth2Server = require('oauth2-server'),
 Request = Oauth2Server.Request,
 Response = Oauth2Server.Response;
var app = express();

const clientModel = require('./models/User/client.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const route1 = require('./routes/urllist.js');

app.get('/', function (req, res) {
    res.send('Hello World');
});

app.use('/', route1);
app.post('/oauth/token', obtainToken);

async function start() {
    try{
        await mongoose.connect('mongodb+srv://Anjali:Qwerty%40123@tomatodatabase.mpcs8o4.mongodb.net/?retryWrites=true&w=majority');
        console.log('connected to mongodb');
        app.listen(3000, function () {
            console.log('Server is listening on port 3000');
        });
    }catch(e){
        console.log('could not connect to mongodb', e);
    }
}

const client = async function (req, res, next) {
    const client = new clientModel({
        id: req.body.id,
        clientID: req.body.clientID,
        clientSecret: req.body.clientSecret,
        grants: req.body.grants,
        redirectUris: req.body.redirectUris
    });
    console.log("Check", client);
    try {
        console.log("Check client", client);
        const result = await client.save();
        console.log("Check Result ", result);
        res.status(201).json(result);
    }catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}


app.post("/client",client);

const oauthserver = new Oauth2Server({
    model: require("./model.js"),
    accessTokenLifetime: 60 * 60,
    refreshTokenLifetime: 60 * 60 * 24,
    allowBearerTokensInQueryString: true
})

function obtainToken (req, res) {
    var request = new Request(req);
    var response = new Response(res);
    return oauthserver
        .token(request, response)
        .then(function (token) {
            res.json(token);
        })
        .catch(function (err) {
            res.status(err.code || 500).json(err);
        });
}

start();
module.exports = app;