const express = require("express");
const router = express.Router();
const {
    register, logIn, findOne,
    findAll, update, deleteOne,
    deleteAll, logOut, profile
} = require("../controllers/smaily.controller")
const { adminAuth, userAuth } = require("../auth/smaily.auth");

router.route("/basic/find/").get(userAuth, findAll);
router.route("/basic/find/:id").get(userAuth, findOne);
router.route("/register").post(register);
router.route("/login").post(logIn);
router.route("/basic/update/:id").put(userAuth, update);
router.route("/admin/deleteUser/:id").delete(adminAuth, deleteOne);
router.route("/admin/destroy").delete(adminAuth, deleteAll);
router.route("/logout").get(logOut);
//router.route("/profile").get(profile);
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