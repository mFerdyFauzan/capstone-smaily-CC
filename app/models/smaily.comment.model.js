const { sequelize, Sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
    const Comment = sequelize.define("comment", {
        text: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ""
        }
    });
    return Comment;
}