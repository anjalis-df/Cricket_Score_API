const userRegistrationModel = require('../../models/User/user_info_model');
const tokenModel = require('../../models/User/token_model');
const userLogin = async (req, res) => {
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
 
    const user = await userRegistrationModel.findOne({ email: userToken.user.username.toLowerCase() });
    if (!user) {
        return res.status(401).json({ message: 'Invalid user' });
    }
    res.status(200).json({message: 'User logged in successfully', user: user});

}catch (err) {
    return res.status(400).json({ message: err.message });
    }
}

module.exports = userLogin;