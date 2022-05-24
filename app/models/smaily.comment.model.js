const { sequelize, Sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
    const Comment = sequelize.define("comment", {
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
        body: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });
    return Comment;
}