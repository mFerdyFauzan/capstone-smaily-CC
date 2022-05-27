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
    /*
    app.post(
        "/api/user/history/create",
        controller.createHistory
    );
    app.get(
        "/api/user/history",
        controller.findHistoryById
    );
    app.post(
        "/api/user/history/comment/create",
        [authJwt.verifyToken, authJwt.isParent],
        controller.createComment
    ); */
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
    app.get(
        "/api/children/:id",
        [authJwt.verifyToken],
        controller.childrenMainPage
    )
    app.get(
        "/api/user/:id/profile",
        [authJwt.verifyToken, authJwt.isParentOrAdmin],
        controller.profile
    );
    app.put(
        "/api/user/:id/changePassword",
        [authJwt.verifyToken, authJwt.isParent],
        controller.changePassword
    );
    app.put(
        "/api/admin/update/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.update
    );
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
};