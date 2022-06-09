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
        "/children/:id",
        [authJwt.verifyToken],
        controller.childrenMainPage
    );
    app.get(
        "/user/:id",
        [authJwt.verifyToken, authJwt.isParent],
        controller.profile
    );
    app.put(
        "/user/:id/password",
        [authJwt.verifyToken, authJwt.isParent],
        controller.changePassword
    );
    app.get(
        "/children/:id/lock/app",
        [authJwt.verifyToken],
        controller.getLockApp
    );
    app.get(
        "/children/:id/lock/url",
        [authJwt.verifyToken],
        controller.getLockUrl
    );
    app.put(
        "/user/:id/lock/app",
        [authJwt.verifyToken, authJwt.isParent],
        controller.setLockApp
    );
    app.put(
        "/user/:id/lock/url",
        [authJwt.verifyToken, authJwt.isParent],
        controller.setLockUrl
    );
    app.delete(
        "/user/:id/lock/app",
        [authJwt.verifyToken, authJwt.isParent],
        controller.deleteLockApp
    );
    app.delete(
        "/user/:id/lock/url",
        [authJwt.verifyToken, authJwt.isParent],
        controller.deleteLockUrl
    )
    app.get(
        "/admin/list",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.findAll
    );
    app.get(
        "/admin/user/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.findOne
    );
    app.put(
        "/admin/user/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.update
    );
    app.delete(
        "/admin/user/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.deleteOne
    );
    app.delete(
        "/admin/delete",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.deleteAll
    );
};