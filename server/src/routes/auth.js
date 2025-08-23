const express=require('express');
const { validateSignupData } = require('../utils/validation');
const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const authRouter = express.Router();


// SignUp Route
authRouter.post("/signup", async (req, res) => {
    try {
        validateSignupData(req);

        const { firstName, lastName, emailId, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });

       const savedUser = await newUser.save();
       const token = await savedUser.getJWT();
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite:'none'
        });


        res.json({message:"User added successfully.",data:savedUser});
    } catch (error) {
        res.status(400).send("❌ ERROR: " + error.message);
    }
});

// Login Route
authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId });
        if (!user) {
            throw new Error("Invalid Credentials!");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid Credentials!");
        }

        const token = await user.getJWT();
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            sameSite:"none"
        });

        res.send(user);
    } catch (error) {
        res.status(400).send("❌ Error occurred: " + error.message);
    }
});

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).send({ message: "Logged out successfully" });
});



module.exports =authRouter;