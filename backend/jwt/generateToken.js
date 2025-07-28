import jwt from "jsonwebtoken";

const createTokenAndSaveCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_TOKEN, {
        expiresIn: "10d",
    });
    res.cookie("jwt", token, {
        httpOnly: true, // xss
        secure: true,
        sameSite: "none", // csrf
        path: '/',
        partitioned: true,
        maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days in milliseconds
    });
};
export default createTokenAndSaveCookie;