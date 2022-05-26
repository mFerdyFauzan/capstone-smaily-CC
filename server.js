const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
//const { initialize, tes } = require("./app/controllers/smaily.controller");
const controller = require("./app/controllers/smaily.controller");
const app = express();
const db = require("./app/models");
// Setting the port to be used for cors
var corsOptions = {
    origin: "http://localhost:8081"
};
// Sync the database and initialize the roles and admin user
db.sequelize.sync({ force: true }).then(() => {
    console.log("Alter and re-sync db.");
    controller.initialize();
    //tes();
});
/*
const tes = async () => {
    const history1 = await controller.createHistory({
        name: "History#1",
        url: "http://www.contoh1.com"
    });
    const history2 = await controller.createHistory({
        name: "History#2",
        url: "http://www.contoh2.com"
    });
    const comment1 = await controller.createComment(history1.id, {
        name: "bezkoder",
        text: "Good job!",
    });
    await controller.createComment(history1.id, {
        name: "zkoder",
        text: "One of the best tuts!",
    });
    const comment2 = await controller.createComment(history2.id, {
        name: "aKoder",
        text: "Hi, thank you!"
    });
    await controller.createComment(history2.id, {
        name: "anotherKoder",
        text: "Awesome tut!",
    });
    const history1Data = await controller.findTutorialById(history1.id);
    console.log(
        ">> Tutorial id=" + history1Data.id,
        JSON.stringify(history1Data, null, 2)
    );
    const history2Data = await controller.findTutorialById(history2.id);
    console.log(
        ">> Tutorial id=" + history2Data.id,
        JSON.stringify(history2Data, null, 2)
    );
    const comment1Data = await controller.findCommentById(comment1.id);
    console.log(
        ">> Comment id=" + comment1.id,
        JSON.stringify(comment1Data, null, 2)
    );
    const comment2Data = await controller.findCommentById(comment2.id);
    console.log(
        ">> Comment id=" + comment2.id,
        JSON.stringify(comment2Data, null, 2)
    );
    const histories = await controller.findAll();
    console.log(">> All tutorials", JSON.stringify(histories, null, 2));
}; */
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