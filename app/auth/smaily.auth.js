const User = require("../models/smaily.model");
const jwt = require("jsonwebtoken");
const jwtSecret = 'cd7144f9d2ed622fcc1712d47c1626424a076bb915fc0f038b84a1c2fa4aaebdb51ed2'

exports.adminAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if (err) {
                return res.status(403).send({ message: "Not Authorized" });
            } else {
                if (decodedToken.role !== "admin") {
                    return res.status(403).send({ message: "Not Authorized" });
                } else {
                    next();
                }
            }
        })
    } else {
        return res.status(403).send({ message: "Not Authorized, token not available " });
    }
}

exports.userAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if (err) {
                return res.status(403).send({ err: err.message });
            } else {
                if (decodedToken.role !== ("basic" || "admin" || "parent" || "children")) {
                    return res.status(403).send({ message: "Not Authorized" });
                } else {
                    next();
                }
            }
        })
    } else {
        return res.status(403).send({ message: "Not Authorized, token not available" });
    }
}
/*
exports.getUsers = async (req, res, next) => {
    await User.find({})
        .then(users => {
            const userFunction = users.map(user => {
                const container = {}
                container.username = user.username
                container.role = user.role
                return container
            })
            res.status(200).json({ user: userFunction })
        })
        .catch(err =>
            res.status(401).json({ message: "Not successful", error: err.message })
        )
}
*/