const { sequelize, Sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
    const History = sequelize.define("history", {
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        /*
        token: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isAlphanumeric: true
            }
        },
        */
        url: {
            type: Sequelize.STRING,
            allowNull: false,
        }
    });
    return History;
}