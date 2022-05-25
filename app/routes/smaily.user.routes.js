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
        "/api/user/find",
        [authJwt.verifyToken, authJwt.isParentOrAdmin],
        controller.findAll
    );
    app.get(
        "/api/user/find/:id",
        [authJwt.verifyToken, isParentOrAdmin],
        controller.findOne
    );
    app.put(
        "/api/user/changePassword/:id",
        [authJwt.verifyToken, authJwt.isParent],
        controller.changePassword
    );
    app.put(
        "/api/admin/update/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.update
    ); /*
    app.post(
        "/api/user/logout",
        controller.logOut
    ); */
    app.delete(
        "/api/admin/deleteUser/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.deleteOne
    );
    app.delete(
        "/api/admin/drop",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.deleteAll
    );
    app.get(
        "/api/user/profile",
        [authJwt.verifyToken],
        controller.profile
    );
};