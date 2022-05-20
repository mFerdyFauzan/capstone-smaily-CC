const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { initial } = require("./app/controllers/smaily.controller");
const app = express();
const { adminAuth, userAuth } = require("./app/auth/smaily.auth");
const db = require("./app/models");
var corsOptions = {
    origin: "http://localhost:8081"
};
db.sequelize.sync({ force: true }).then(() => {
    console.log("Alter and re-sync db.");
    initial();
});
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// simple route

app.get("/", (req, res) => {
    res.send({ message: "Welcome to Smaily." });
});
app.get("/register", (req, res) => {
    res.send({ message: "Please fill the necessary column in order to register your account" });
})
app.get("/login", (req, res) => {
    res.send({ message: "Please login to your account by entering your account's username or email and password" });
})
/*
app.get("/update", (req, res) => {
    res.send({ message: "Update your user information" });
})
app.get("/delete", (req, res) => {
    res.send({ message: "Delete a user from database" });
})
app.get("/destroy", (req, res) => {
    res.send({ message: "Delete all users from database" });
})
*/
app.get("/admin", adminAuth, (req, res) => {
    res.send("Admin Route");
})
app.get("/basic", userAuth, (req, res) => {
    res.send("User Route");
})
app.get("/logout", (req, res) => {
    res.send({ message: "Please log in to access the app" });
})
/*
app.get("/profile", (req, res) => {
    res.send({ message:});
})*/
app.use("/", require("./app/routes/smaily.routes"));
// set port, listen for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});