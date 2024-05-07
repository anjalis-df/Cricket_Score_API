const user_infoModel = require('../../models/User/user_info_model');
const bcrypt = require("bcrypt");

const userRegistration = async (req, res) => {
    try {
        console.log(req.body);
        const {username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new user_infoModel({
            username: username,
            email: email,
            password: hashedPassword
        })
        const existingUser = await user_infoModel.findOne({ email: email.toLowerCase() }).lean().exec();
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }
        const result = await user.save();
        res.status(201).json("User created successfully");
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

module.exports = userRegistration;