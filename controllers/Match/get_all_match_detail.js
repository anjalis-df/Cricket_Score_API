const matchmodel = require('../../models/Match/match_info_model');
const tokenmodel = require('../../models/User/token_model');
const usermodel = require('../../models/User/user_info_model');

const getAllMatchDetail = async (req, res) => {

    try {
        const accessToken = req.headers.authorization;
        if(!accessToken || !accessToken.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const token = accessToken.split(' ')[1];
        const userToken = await tokenmodel.findOne({ accessToken: token });
        if (!userToken) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        const userEmail = userToken.user.username.toLowerCase();
        const user = await usermodel.findOne({ email: userEmail });
        if (!user) {
            return res.status(401).json({ message: 'Invalid user' });
        }

        const match = await matchmodel.find({ user_id: user.user_id });
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }

        res.status(200).json(match);

    } catch (err) {
        res.status(400).json(err);
    }
}

module.exports = getAllMatchDetail 