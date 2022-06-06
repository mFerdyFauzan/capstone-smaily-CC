const authJwt = require("../auth/smaily.auth");
const express = require("express");
const controller = require("../controllers/smaily.controller");
const app = express();

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.get(
        "/api/children/:id",
        [authJwt.verifyToken],
        controller.childrenMainPage
    );
    app.get(
        "/api/user/:id/profile",
        [authJwt.verifyToken, authJwt.isParent],
        controller.profile
    );
    app.put(
        "/api/user/:id/password",
        [authJwt.verifyToken, authJwt.isParent],
        controller.changePassword
    );
    app.get(
        "/api/children/:id/lock/app",
        [authJwt.verifyToken],
        controller.getLockApp
    );
    app.get(
        "/api/children/:id/lock/url",
        [authJwt.verifyToken],
        controller.getLockUrl
    );
    app.put(
        "/api/user/:id/lock/app",
        [authJwt.verifyToken, authJwt.isParent],
        controller.setLockApp
    );
    app.put(
        "/api/user/:id/lock/url",
        [authJwt.verifyToken, authJwt.isParent],
        controller.setLockUrl
    );
    app.delete(
        "/api/user/:id/lock/app",
        [authJwt.verifyToken, authJwt.isParent],
        controller.deleteLockApp
    );
    app.delete(
        "/api/user/:id/lock/url",
        [authJwt.verifyToken, authJwt.isParent],
        controller.deleteLockUrl
    )
    app.get(
        "/api/admin/find",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.findAll
    );
    app.get(
        "/api/admin/find/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.findOne
    );
    app.put(
        "/api/admin/update/user/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.update
    );
    app.delete(
        "/api/admin/delete/user/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.deleteOne
    );
    app.delete(
        "/api/admin/delete/user",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.deleteAll
    );
};