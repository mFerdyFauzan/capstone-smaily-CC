const authJwt = require("../auth/smaily.auth");
const express = require("express");
const controller = require("../controllers/smaily.controller");
const { isParentOrAdmin } = require("../auth/smaily.auth");
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
    );
    app.get(
        "/api/user/logout",
        controller.logOut
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
    app.get(
        "/api/user/profile",
        [authJwt.verifyToken],
        controller.profile
    );
};
/*
router.route("/user/find/").get(userAuth, findAll);
router.route("/user/find/:id").get(userAuth, findOne);
router.route("/auth/register").post(register);
router.route("/auth/login").post(logIn);
router.route("/user/update/:id").put(userAuth, update);
router.route("/admin/deleteUser/:id").delete(adminAuth, deleteOne);
router.route("/admin/drop").delete(adminAuth, deleteAll);
router.route("/user/logout").get(logOut);
router.route("/user").get(profile);
module.exports = router;

/*module.exports = route => {
    const user = require("../controllers/smaily.controller.js");
    var router = require("express").Router();
    // Create a new Tutorial
    router.post("/register", user.register);
    // Retrieve all Tutorials
    router.post("/login", user.login);
    router.get("/", user.findAll);
    // Retrieve all published Tutorials
    //router.get("/published", user.findAllPublished);
    // Retrieve a single Tutorial with id
    router.get("/:id", user.findOne);
    // Update a Tutorial with id
    router.put("/:id", user.update);
    // Delete a Tutorial with id
    router.delete("/:id", user.delete);
    // Create a new Tutorial
    router.delete("/", user.deleteAll);
    route.use('/api/user', router);
};
*/