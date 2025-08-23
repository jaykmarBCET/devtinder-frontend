const validateSignupData = ({ firstName, lastName, emailId, password }) => {
    if (!firstName || !lastName || !emailId || !password) {
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    return emailRegex.test(emailId) && passRegex.test(password);
};

const validateLoginData = ({ emailId, password }) => {
    if (!emailId || !password) {
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailId);
};

const validateEditProfileData = (body) => {
    const allowedEditFields = [
        "firstName",
        "lastName",
        "emailId",
        "photoURL",
        "skills",
        "about",
        "gender",
        "age"
    ];

    return Object.keys(body).every(field => allowedEditFields.includes(field));
};

module.exports = {
    validateSignupData,
    validateLoginData,
    validateEditProfileData
};
