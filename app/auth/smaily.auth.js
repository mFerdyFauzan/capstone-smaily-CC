const db = require("../models");
const Parent = db.parent;
const ConnectToken = db.connectToken;
const Children = db.children;
const jwt = require("jsonwebtoken");
const config = require("./auth.config");
const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
    if (err instanceof TokenExpiredError) {
        return res.status(403).send({ message: "Unauthorized! Access Token was expired!" });
    }
    return res.sendStatus(403).send({ message: "Unauthorized!" });
}
const verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token) {
        return res.status(401).send({
            message: "No token provided!"
        });
    }
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return catchError(err, res);
        }
        parentId = decoded.id;
        next();
    });
};

async function verifyConnectToken(req, res, next) {
    const connectToken = req.params.token;
    if (connectToken == null) {
        return res.status(403).json({ message: "Connect Token is required!" });
    }
    let cekToken = await ConnectToken.findOne({ where: { token: connectToken } });
    if (!cekToken) {
        res.status(404).json({ message: "Connect token is not in database!" });
        return;
    } else {
        if (ConnectToken.verifyExpiration(cekToken)) {
            Children.findOne({
                where: { id: cekToken.childrenId }
            }).then(child => {
                if (child) {
                    Children.destroy({
                        where: { id: child.id }
                    })
                } else {
                    res.status(404).send({ message: "Children not found" })
                }
            })
            ConnectToken.destroy({
                where: { id: cekToken.id }
            })
            res.status(400).json({
                message: "Connect token was expired. Please make a new register child request",
            });
            return;
        }
        next();
    }
}
isAdmin = (req, res, next) => {
    Parent.findByPk(parentId).then(user => {
        if (user.role === 'admin') {
            next();
            return;
        } else {
            res.status(403).send({
                message: "Unauthorized. Action Require Admin Role!"
            });
            return;
        }
    });
};

isParent = (req, res, next) => {
    Parent.findByPk(parentId).then(user => {
        if (user.role === 'parent') {
            next();
            return;
        } else {
            res.status(403).send({
                message: "Unauthorized. Action Require Parent Role!"
            });
            return;
        }
    });
};

isParentOrAdmin = (req, res, next) => {
    Parent.findByPk(parentId).then(user => {
        if (user.role === 'parent' || user.role === 'admin') {
            next();
            return;
        } else {
            res.status(403).send({
                message: "Unauthorized. Action Require Parent or Admin Role!"
            });
            return;
        }
    });
};
const authJwt = {
    verifyToken: verifyToken,
    verifyConnectToken: verifyConnectToken,
    isAdmin: isAdmin,
    isParent: isParent,
    isParentOrAdmin: isParentOrAdmin
};
module.exports = authJwt;
