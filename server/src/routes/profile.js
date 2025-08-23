const express = require('express');
const { userAuth } = require('../middlewares/auth');
const profileRouter = express.Router();
const { validateEditProfileData } = require('../utils/validation'); // ✅ wrap in `{}` if it's exported as named export

// -------------------- View Profile --------------------
profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.json(user);
    } catch (error) {
        res.status(401).send("❌ Invalid token: " + error.message);
    }
});

// -------------------- Edit Profile --------------------
profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        const user = req.user;

        if (!validateEditProfileData(req.body)) {
            throw new Error("Invalid Edit Request!!");
        }

        Object.keys(req.body).forEach((key) => {
            user[key] = req.body[key];
        });

        await user.save();
        res.send(`${user.firstName}, your profile was updated successfully.`);
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});

module.exports = profileRouter;
