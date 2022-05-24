const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const { initialize } = require("./app/controllers/smaily.controller");
const app = express();
const db = require("./app/models");
// Setting the port to be used for cors
var corsOptions = {
    origin: "http://localhost:8081"
};
// Sync the database and initialize the roles and admin user
db.sequelize.sync({ force: true }).then(() => {
    console.log("Alter and re-sync db.");
    initialize();
});
//
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// parse cookie
app.use(cookieParser());
// simple route
app.get("/", (req, res) => {
    res.send({ message: "Welcome to Smaily." });
});
// set routes for authentication and general use
require('./app/routes/smaily.auth.routes')(app);
require('./app/routes/smaily.user.routes')(app);
// set port, listen for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});