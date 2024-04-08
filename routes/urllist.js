var express = require('express'),
    Oauth2Server = require('oauth2-server'),
    Request = Oauth2Server.Request,
    Response = Oauth2Server.Response
const router = express.Router();

const userRegistration = require("../controllers/User/user_info");
const login = require("../controllers/User/login");
const logout = require("../controllers/User/logout");

router.route("/register").post(userRegistration);
router.route("/login").post(authenticaterequest,login);
router.route("/logout").post(authenticaterequest,logout);

// Team Details
const addTeam = require("../controllers/Team/add_team");
const deleteTeam = require("../controllers/Team/delete_team");
const getAllTeam = require("../controllers/Team/get_all_team");
router.route("/addTeam").post(authenticaterequest,addTeam);
router.route("/deleteTeam").post(authenticaterequest,deleteTeam);
router.route("/getAllTeam").get(authenticaterequest,getAllTeam);

//Player Details
const addPlayer = require("../controllers/Player/add_player");
const deletePlayer = require("../controllers/Player/delete_player");
const getAllPlayerByTeamid = require("../controllers/Player/get_all_player_by_teamid");
const playerOnGround = require("../controllers/Player/player_on_ground");
router.route("/addPlayer").post(authenticaterequest,addPlayer);
router.route("/getAllPlayerByTeamid").get(authenticaterequest, getAllPlayerByTeamid)
router.route("/playerOnGround").post(authenticaterequest, playerOnGround);
router.route("/deletePlayer").post(authenticaterequest,deletePlayer);

//Match Details
const getAllMatchDetail = require("../controllers/Match/get_all_match_detail");
const getAllMatchResult = require("../controllers/Match/get_all_match_result");
const addMatchDetail = require("../controllers/Match/add_match_deail");
const addMatchResult = require("../controllers/Match/add_match_result");
const getMatchDetailByMatchId = require("../controllers/Match/get_match_detail_by_matchId");
router.route("/getMatchDetail").get(authenticaterequest, getAllMatchDetail);
router.route("/addMatchDetail").post(authenticaterequest, addMatchDetail);
router.route("/getMatchResult").get(authenticaterequest, getAllMatchResult);
router.route("/addMatchResult").post(authenticaterequest, addMatchResult);
router.route("/getMatchDetailByMatchId").get(authenticaterequest, getMatchDetailByMatchId);

//Inning Details
const addInningDetail = require("../controllers/Innings/add_inning_detail");
router.route("/addInningDetail").post(authenticaterequest, addInningDetail);


const oauthServer = new Oauth2Server({
    model: require("../model"),
    accessTokenLifetime: 60 * 60,
    refreshTokenLifetime: 60 * 60 * 24,
    allowBearerTokensInQueryString: true
});

function authenticaterequest(req, res, next) {
    var request = new Request(req);
    var response = new Response(res);
    return oauthServer
    .authenticate(request, response)
    .then(function (token) {
        next();
    })
    .catch(function (err) {
        res.status(err.code || 500).json(err);
    })
}

module.exports = router;