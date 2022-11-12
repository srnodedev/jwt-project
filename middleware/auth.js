const jwt = require('jsonwebtoken');
const User = require('../model/user');

const verifyToken = async (req, res, next) => {
    const token = req.body.token || req.headers["x-access-token"] || req.query.token;
    if(!token){
        return res.status(401).send("Please login");
    }

    try {
        const decode = await jwt.verify(token, process.env.SECURITY_KEY);
        req.user = decode;
    } catch(err) {
        return res.status(400).send("Invalid token");
    }

    return next();
}

module.exports = verifyToken;