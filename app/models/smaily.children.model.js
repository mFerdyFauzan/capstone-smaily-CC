const { sequelize, Sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
    const Children = sequelize.define("children", {
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false,
            unique: true
        } /*,
        token: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        } */
        /*
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                isAlpha: true
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                not: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$/
            }
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        }
        */
    });
    return Children;
};