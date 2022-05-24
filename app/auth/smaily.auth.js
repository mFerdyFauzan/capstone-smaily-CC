const db = require("../models");
const User = db.user;
const jwt = require("jsonwebtoken");
const jwtSecret = 'cd7144f9d2ed622fcc1712d47c1626424a076bb915fc0f038b84a1c2fa4aaebdb51ed2'

verifyToken = (req, res, next) => {
    //let token = req.cookies.jwt;
    let token = req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }
    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        req.userId = decoded.id;
        next();
    });
};
isAdmin = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "admin") {
                    next();
                    return;
                }
            }
            res.status(403).send({
                message: "Unauthorized. Action Require Admin Role!"
            });
            return;
        });
    });
};
isParent = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "parent") {
                    next();
                    return;
                }
            }
            res.status(403).send({
                message: "Unauthorized. Action Require Parent Role!"
            });
        });
    });
};
isParentOrAdmin = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "parent") {
                    next();
                    return;
                }
                if (roles[i].name === "admin") {
                    next();
                    return;
                }
            }
            res.status(403).send({
                message: "Unauthorized. Action Require Parent or Admin Role!"
            });
        });
    });
};
const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    isParent: isParent,
    isParentOrAdmin: isParentOrAdmin
};
module.exports = authJwt;
/*
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
                if (decodedToken.role !== ("admin" || "parent" || "children")) {
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