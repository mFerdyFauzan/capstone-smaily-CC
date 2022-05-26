const { sequelize, Sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
    const Parent = sequelize.define("parent", {
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            /*
            validate: {
                isAlpha: true
            } */
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                not: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$/,
                len: [8, 255]
            }
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
                //isAlphanumeric: true,
                isLowercase: true
            }
        },
        role: {
            type: Sequelize.ENUM('admin', 'parent'),
            defaultValue: 'parent',
            allowNull: false
        } /*,
        token: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        } */
    });
    return Parent;
};