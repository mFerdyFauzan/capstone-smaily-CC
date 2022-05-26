const { sequelize, Sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
    const History = sequelize.define("history", {
        url: {
            type: Sequelize.STRING,
            allowNull: false,
        }
    });
    return History;
}