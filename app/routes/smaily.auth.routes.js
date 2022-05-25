const express = require("express");
const controller = require("../controllers/smaily.controller");
const app = express();
const { verifySignUp } = require("../auth")

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post(
        "/api/auth/register/children",
        [
            verifySignUp.checkDuplicateUsernameOrEmail,
            verifySignUp.checkRolesExisted
        ],
        controller.registerChildren
    );
    app.post(
        "/api/auth/register/parent",
        [
            verifySignUp.checkDuplicateUsernameOrEmail,
            verifySignUp.checkRolesExisted
        ],
        controller.registerParent
    );
    app.post("/api/auth/login", controller.logIn);
    app.post("/api/auth/refreshtoken", controller.refreshToken);
    app.post(
        "/api/user/logout",
        controller.logOut
    );
};