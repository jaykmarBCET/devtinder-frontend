const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token || res.headers.authorization.split(" ")[1]

        if (!token) {
            return res.status(401).send("No token found. Unauthorized.");
        }
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const user = await User.findById(decoded._id).select("-password");

        if (!user) {
            return res.status(401).send("User not found. Unauthorized.");
        }
        req.user = user;
        next();
    } catch (err) {
        console.error(" Auth Middleware Error:", err.message);
        return res.status(401).send("Invalid or expired token.");
    }
};

module.exports = {
    userAuth,
};
