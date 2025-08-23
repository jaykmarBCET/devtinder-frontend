const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value);
            },
            message: props => `Invalid email address: ${props.value}`
        }
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return validator.isStrongPassword(value);
            },
            message: props => `Weak password: ${props.value}`
        }
    },
    age: {
        type: Number,
        min: [18, 'You must be at least 18 years old']
    },
    gender: {
        type: String,
        enum:{
            values:["male", "female", "others"],
            message:`{VALUE} is not a valid gender type`
        },
    },
    photoURL: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCpY5LtQ47cqncKMYWucFP41NtJvXU06-tnQ&s",
        validate: {
            validator: function (value) {
                return validator.isURL(value);
            },
            message: props => `Invalid photo URL: ${props.value}`
        }
    },
    about: {
        type: String
    },
    skills: {
        type: [String]
    },
    // **FIX:** Add the 'friends' array to the schema
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true,
});

userSchema.methods.getJWT = async function(){
    const user=this;
    const token = await jwt.sign({ _id: user._id }, "Dev@Tinder123", { expiresIn: "1d" });
    return token;
}

module.exports = mongoose.model("User", userSchema);