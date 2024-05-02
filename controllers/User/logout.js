const userRegistrationModel = require('../../models/User/user_info_model');
const tokenModel = require('../../models/User/token_model');

const userLogout = async (req, res) => {
    try {
        const accessToken = req.headers.authorization;
        if(!accessToken || !accessToken.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized' });

    }
    const token = accessToken.split(' ')[1];
    const userToken = await tokenModel.findOne({ accessToken: token });
    if (!userToken) {
        return res.status(401).json({ message: 'Invalid token' });
    }
    const userEmail = userToken.user.username.toLowerCase();
    const user = await userRegistrationModel.findOne({ email: userEmail });
    if (!user) {
        return res.status(401).json({ message: 'Invalid user' });
    }
    await tokenModel.deleteOne({ accessToken: token });
    res.status(200).json({message: 'User logged out successfully'});
}catch (err) {
    return res.status(400).json({ message: err.message });
}
}

module.exports = userLogout;